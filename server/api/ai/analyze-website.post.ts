import { z } from 'zod';
import { uploadImage } from '../../utils/storage';

const requestSchema = z.object({
  url: z.string().url('Invalid URL format'),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { url } = requestSchema.parse(body);

    const scrapedData = await scrapeWebsite(url);
    const aiMetadata = await extractWebsiteMetadata(scrapedData.html, url);

    let iconUrl = null;
    let imageUrl = null;

    if (scrapedData.favicon) {
      try {
        const iconBuffer = await downloadImage(scrapedData.favicon);
        const result = await uploadImage(iconBuffer, 'images', 'icons');
        iconUrl = result.url;
      } catch (error) {
        console.warn('Failed to upload favicon:', error);
      }
    }

    if (scrapedData.ogImage) {
      try {
        const imageBuffer = await downloadImage(scrapedData.ogImage);
        const result = await uploadImage(imageBuffer, 'images', 'items');
        imageUrl = result.url;
      } catch (error) {
        console.warn('Failed to upload OG image:', error);
      }
    }

    return {
      success: true,
      data: {
        name: aiMetadata.name || scrapedData.title,
        description: aiMetadata.description || scrapedData.description,
        introduction: aiMetadata.introduction,
        category: aiMetadata.category,
        tags: aiMetadata.tags,
        icon: iconUrl,
        image: imageUrl,
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
