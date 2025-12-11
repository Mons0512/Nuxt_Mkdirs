/**
 * Upload image buffer to Sanity
 */
export async function uploadImageToSanity(buffer: Buffer, filename: string) {
  try {
    // Determine content type from filename
    const ext = filename.split('.').pop()?.toLowerCase();
    let contentType = 'image/jpeg';
    
    if (ext === 'png') {
      contentType = 'image/png';
    } else if (ext === 'jpg' || ext === 'jpeg') {
      contentType = 'image/jpeg';
    }

    // Upload to Sanity
    const asset = await sanityClient.assets.upload('image', buffer, {
      filename,
      contentType,
    });

    return asset;
  } catch (error) {
    console.error('Upload to Sanity error:', error);
    throw new Error('Failed to upload image to Sanity');
  }
}
