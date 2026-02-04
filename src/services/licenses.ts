import { createClient } from "@/utils/supabase/client";
import { License } from "@/types";

export const getLicensesByBrandId = async (brandId: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("license")
    .select("*")
    .eq("brand_id", brandId)
    .order("prefix", { ascending: true });

  if (error) throw error;
  return data as License[];
};

export const createLicense = async (license: Omit<License, "updated_at">) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("license")
    .insert(license)
    .select()
    .single();

  if (error) throw error;
  return data as License;
};

export const deleteLicense = async (prefix: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("license")
    .delete()
    .eq("prefix", prefix);

  if (error) throw error;
};
