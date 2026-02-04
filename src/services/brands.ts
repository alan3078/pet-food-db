import { createClient } from "@/utils/supabase/client";
import { Brand } from "@/types";

export const getBrands = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brand")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as Brand[];
};

export const getBrand = async (id: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brand")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Brand;
};

export const createBrand = async (brand: Omit<Brand, "id" | "updated_at">) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brand")
    .insert(brand)
    .select()
    .single();

  if (error) throw error;
  return data as Brand;
};

export const updateBrand = async (id: number, brand: Partial<Brand>) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brand")
    .update(brand)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Brand;
};

export const deleteBrand = async (id: number) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("brand")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
