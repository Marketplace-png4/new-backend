import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
const bucket = process.env.SUPABASE_BUCKET || 'images';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadImage(filePath, base64Data, contentType = 'image/png') {
  let payload = base64Data;
  let detectedContentType = contentType;

  const matches = payload.match(/^data:(.+);base64,(.+)$/);
  if (matches) {
    detectedContentType = matches[1];
    payload = matches[2];
  }

  const buffer = Buffer.from(payload, 'base64');

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: detectedContentType,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}
