import { z } from 'zod';

const requestSchema = z.object({
  url: z.string().url('Invalid URL format'),
});

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody(event);
    const { url } = requestSchema.parse(body);

    // Step 1: Scrape website
    const scrapedData = await scrapeWebsite(url);

    // Step 2: Use AI to extract metadata
    const aiMetadata = await extractWebsiteMetadata(scrapedData.html, url);

    // Step 3: Upload images to Sanity (if available)
    let iconAsset = null;
    let imageAsset = null;

    // Try to upload favicon as icon
    if (scrapedData.favicon) {
      try {
        const iconBuffer = await downloadImage(scrapedData.favicon);
        iconAsset = await uploadImageToSanity(iconBuffer, 'icon.png');
      } catch (error) {
        console.warn('Failed to upload favicon:', error);
      }
    }

    // Try to upload OG image
    if (scrapedData.ogImage) {
      try {
        const imageBuffer = await downloadImage(scrapedData.ogImage);
        imageAsset = await uploadImageToSanity(imageBuffer, 'image.jpg');
      } catch (error) {
        console.warn('Failed to upload OG image:', error);
      }
    }

    // Return combined results
    return {
      success: true,
      data: {
        name: aiMetadata.name || scrapedData.title,
        description: aiMetadata.description || scrapedData.description,
        introduction: aiMetadata.introduction,
        category: aiMetadata.category,
        tags: aiMetadata.tags,
        icon: iconAsset ? {
          _id: iconAsset._id,
          url: iconAsset.url,
        } : null,
        image: imageAsset ? {
          _id: imageAsset._id,
          url: imageAsset.url,
        } : null,
      },
    };
  } catch (error: any) {
    console.error('AI analyze error:', error);
    
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: error.errors[0].message,
      });
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to analyze website',
    });
  }
});
