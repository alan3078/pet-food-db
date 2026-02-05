import { createClient } from "@/utils/supabase/client";
import { Brand } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const getBrands = async (supabase?: SupabaseClient) => {
  const client = supabase || createClient();
  const { data, error } = await client
    .from("brand")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as Brand[];
};

export const getBrand = async (id: number, supabase?: SupabaseClient) => {
  const client = supabase || createClient();
  const { data, error } = await client
    .from("brand")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Brand;
};

export const createBrand = async (brand: Omit<Brand, "id" | "updated_at">, supabase?: SupabaseClient) => {
  const client = supabase || createClient();
  const { data, error } = await client
    .from("brand")
    .insert(brand)
    .select()
    .single();

  if (error) throw error;
  return data as Brand;
};

export const updateBrand = async (id: number, brand: Partial<Brand>, supabase?: SupabaseClient) => {
  const client = supabase || createClient();
  const { data, error } = await client
    .from("brand")
    .update(brand)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Brand;
};

export const deleteBrand = async (id: number, supabase?: SupabaseClient) => {
  const client = supabase || createClient();
  const { error } = await client
    .from("brand")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
