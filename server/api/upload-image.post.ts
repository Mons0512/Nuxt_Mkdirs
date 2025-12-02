/**
 * Upload image to Sanity
 */
export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No file uploaded',
      });
    }

    const file = formData.find(f => f.name === 'file');
    if (!file || !file.data) {
      throw createError({
        statusCode: 400,
        message: 'No file found in form data',
      });
    }

    // Check file size (max 1MB)
    const maxSize = 1 * 1024 * 1024;
    if (file.data.length > maxSize) {
      throw createError({
        statusCode: 400,
        message: 'File size should be less than 1MB',
      });
    }

    // Check file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!file.type || !allowedTypes.includes(file.type)) {
      throw createError({
        statusCode: 400,
        message: 'Only PNG and JPEG images are allowed',
      });
    }

    // Upload to Sanity
    const asset = await sanityClient.assets.upload('image', file.data, {
      filename: file.filename || 'uploaded-image',
      contentType: file.type,
    });

    return { asset };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error('Error uploading image:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to upload image',
    });
  }
});
