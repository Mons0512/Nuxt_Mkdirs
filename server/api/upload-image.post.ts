import { uploadImage } from '../utils/storage';

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

    const maxSize = 1 * 1024 * 1024;
    if (file.data.length > maxSize) {
      throw createError({
        statusCode: 400,
        message: 'File size should be less than 1MB',
      });
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!file.type || !allowedTypes.includes(file.type)) {
      throw createError({
        statusCode: 400,
        message: 'Only PNG and JPEG images are allowed',
      });
    }

    const buffer = Buffer.from(file.data);
    const result = await uploadImage(
      { buffer, name: file.filename || 'image.png', type: file.type || 'image/png' } as any,
      'images'
    );

    if (!result.url) {
      throw createError({
        statusCode: 500,
        message: result.error || 'Failed to upload image',
      });
    }

    return { url: result.url };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error('Error uploading image:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to upload image',
    });
  }
});
