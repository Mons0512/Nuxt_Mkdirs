import { supabaseAdmin } from './supabase';

export interface UploadResult {
  url: string | null;
  error: string | null;
}

export async function uploadImage(
  file: File | Buffer,
  bucket: string = 'images',
  folder: string = ''
): Promise<UploadResult> {
  try {
    const fileExt = 'file' in file ? file.name.split('.').pop() || 'png' : 'png';
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const buffer = 'buffer' in file ? file.buffer : await file.arrayBuffer();

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: 'file' in file ? file.type : 'image/png',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: null, error: error.message };
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Upload error:', error);
    return { url: null, error: 'Upload failed' };
  }
}

export async function deleteImage(url: string, bucket: string = 'images'): Promise<boolean> {
  try {
    const urlParts = url.split(`${bucket}/`);
    if (urlParts.length < 2) {
      return false;
    }

    const fileName = urlParts[urlParts.length - 1];
    const { error } = await supabaseAdmin.storage.from(bucket).remove([fileName]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}

export async function uploadBase64Image(
  base64Data: string,
  bucket: string = 'images',
  folder: string = ''
): Promise<UploadResult> {
  try {
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return { url: null, error: 'Invalid base64 data' };
    }

    const ext = matches[1];
    const data = Buffer.from(matches[2], 'base64');
    const fileName = `${uuidv4()}.${ext}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { data: uploadData, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, data, {
        contentType: `image/${ext}`,
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: null, error: error.message };
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(uploadData.path);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Upload error:', error);
    return { url: null, error: 'Upload failed' };
  }
}
