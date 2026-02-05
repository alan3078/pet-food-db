import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

const EVIDENCE_BUCKET_NAME = "product-evidence";
const PUBLIC_BUCKET_NAME = "public-bucket";

export type ProductImageCategory = "labels" | "certificates" | "ingredients" | "evidence";

export const uploadProductEvidence = async (
  file: File,
  productId: string | number,
  fileName: string,
  supabase?: SupabaseClient
) => {
  const client = supabase || createClient();
  const path = `products/${productId}/evidence/${fileName}`;
  
  const { data, error } = await client.storage
    .from(PUBLIC_BUCKET_NAME)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;
  
  const { data: urlData } = client.storage.from(PUBLIC_BUCKET_NAME).getPublicUrl(data.path);
  return urlData.publicUrl;
};

export const getProductEvidenceUrl = (path: string, supabase?: SupabaseClient) => {
  const client = supabase || createClient();
  // If path is already a full URL (starts with http), return it
  if (path.startsWith('http')) return path;
  
  const { data } = client.storage.from(PUBLIC_BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
};

export const uploadProductImage = async (
  file: File,
  productId: string | number,
  category: ProductImageCategory,
  fileName: string, // User provided filename or we generate one? usually keep original or sanitize it.
  supabase?: SupabaseClient
) => {
  const client = supabase || createClient();
  const path = `products/${productId}/${category}/${fileName}`;

  const { data, error } = await client.storage
    .from(PUBLIC_BUCKET_NAME)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true, // Allow overwriting for now
    });

  if (error) throw error;

  const { data: urlData } = client.storage.from(PUBLIC_BUCKET_NAME).getPublicUrl(data.path);
  return urlData.publicUrl;
};
