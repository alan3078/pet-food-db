import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

const BUCKET_NAME = "product-evidence";

export const uploadProductEvidence = async (
  file: File,
  path: string,
  supabase?: SupabaseClient
) => {
  const client = supabase || createClient();
  
  const { data, error } = await client.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;
  
  return data.path;
};

export const getProductEvidenceUrl = (path: string, supabase?: SupabaseClient) => {
  const client = supabase || createClient();
  const { data } = client.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
};
