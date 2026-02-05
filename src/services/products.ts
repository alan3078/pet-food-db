import { createClient } from "@/utils/supabase/client";
import { Product, ProductIngredient, EvidenceDocument } from "@/types/product";
import { SupabaseClient } from "@supabase/supabase-js";

export const getProducts = async (supabase?: SupabaseClient) => {
  const client = supabase || createClient();
  const { data, error } = await client
    .from("product")
    .select(`
      *,
      brand:brand_id (*),
      evidence_documents:evidence_document (count)
    `)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  
  // Map the response to include evidence_count
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((item: any) => ({
    ...item,
    evidence_count: item.evidence_documents?.[0]?.count || 0
  })) as Product[];
};

export const getProduct = async (id: string | number, supabase?: SupabaseClient) => {
  const client = supabase || createClient();
  const { data, error } = await client
    .from("product")
    .select(`
      *,
      brand:brand_id (*),
      product_ingredients:product_ingredient (*),
      evidence_documents:evidence_document (*)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  
  // Add evidence_count
  const product = data as Product;
  product.evidence_count = product.evidence_documents?.length || 0;
  
  return product;
};

export type CreateProductDTO = Omit<Product, "id" | "brand" | "product_ingredients" | "evidence_documents" | "evidence_count" | "updated_at"> & {
  ingredients?: Omit<ProductIngredient, "id" | "product_id" | "is_linked_evidence">[];
  evidence?: Omit<EvidenceDocument, "id" | "product_id" | "updated_at">[];
};

export const createProduct = async (productData: CreateProductDTO, supabase?: SupabaseClient) => {
  const client = supabase || createClient();
  
  // 1. Create Product
  const { ingredients, evidence, ...productFields } = productData;
  
  const { data: product, error: productError } = await client
    .from("product")
    .insert(productFields)
    .select()
    .single();

  if (productError) throw productError;

  const productId = product.id;

  // 2. Create Ingredients
  if (ingredients && ingredients.length > 0) {
    const ingredientsToInsert = ingredients.map(ing => ({
      ...ing,
      product_id: productId,
      is_linked_evidence: false
    }));
    
    const { error: ingError } = await client
      .from("product_ingredient")
      .insert(ingredientsToInsert);
      
    if (ingError) {
      console.error("Error inserting ingredients:", ingError);
      // We don't rollback here because no transaction support in client
    }
  }

  // 3. Create Evidence Documents
  if (evidence && evidence.length > 0) {
    await addProductEvidence(productId, evidence, client);
  }

  return product as Product;
};

export const updateProduct = async (id: number, updates: Partial<Product>, supabase?: SupabaseClient) => {
  const client = supabase || createClient();
  const { data, error } = await client
    .from("product")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
};

export const deleteProduct = async (id: number, supabase?: SupabaseClient) => {
  const client = supabase || createClient();
  const { error } = await client
    .from("product")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

export const addProductEvidence = async (
  productId: number, 
  evidence: Omit<EvidenceDocument, "id" | "product_id" | "updated_at">[],
  supabase?: SupabaseClient
) => {
  const client = supabase || createClient();
  
  const evidenceToInsert = evidence.map(doc => ({
    ...doc,
    product_id: productId
  }));
  
  const { error } = await client
    .from("evidence_document")
    .insert(evidenceToInsert);
    
  if (error) {
    console.error("Error inserting evidence:", error);
    throw error;
  }
};
