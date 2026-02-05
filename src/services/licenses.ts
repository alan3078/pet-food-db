import { createClient } from "@/utils/supabase/client";
import { License } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const getLicensesByBrandId = async (brandId: number, supabase?: SupabaseClient) => {
  const client = supabase || createClient();
  const { data, error } = await client
    .from("license")
    .select("*")
    .eq("brand_id", brandId)
    .order("prefix", { ascending: true });

  if (error) throw error;
  return data as License[];
};

export const createLicense = async (license: Omit<License, "updated_at">, supabase?: SupabaseClient) => {
  const client = supabase || createClient();
  const { data, error } = await client
    .from("license")
    .insert(license)
    .select()
    .single();

  if (error) throw error;
  return data as License;
};

export const deleteLicense = async (prefix: string, supabase?: SupabaseClient) => {
  const client = supabase || createClient();
  const { error } = await client
    .from("license")
    .delete()
    .eq("prefix", prefix);

  if (error) throw error;
};
