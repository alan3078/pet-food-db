import { Brand } from "./brand";

export interface Product {
  id: number;
  barcode: string;
  brand_id: number | null;
  name_en: string;
  category: string | null;
  specification: string | null;
  version_label: string | null;
  origin_verbatim_text: string | null;
  standard_country_code: string | null;
  factory_name: string | null;
  factory_location: string | null;
  raw_material_origin: string | null;
  crude_protein_min: number | null;
  crude_fat_min: number | null;
  crude_fiber_max: number | null;
  moisture_max: number | null;
  ingredients_text: string | null;
  updated_at: string | null;
  
  // Relations
  brand?: Brand;
  product_ingredients?: ProductIngredient[];
  evidence_documents?: EvidenceDocument[];
  
  // Computed/UI helpers
  evidence_count?: number;
}

export interface ProductIngredient {
  id: number;
  product_id: number;
  ingredient_name: string;
  ingredient_type: string | null;
  is_linked_evidence: boolean;
}

export interface EvidenceDocument {
  id: number;
  product_id: number;
  file_name: string | null;
  file_path: string | null;
  doc_type: string | null;
  updated_at: string | null;
}

export type ProductCategory = 
  | "all"
  | "jerky"
  | "biscuit"
  | "dental"
  | string; // Allow string from DB

export type ProteinSource =
  | "beef"
  | "chicken"
  | "fish"
  | "lamb"
  | "pork"
  | string;

export type SortOption = 
  | "evidence-high"
  | "evidence-low"
  | "name-asc"
  | "name-desc"
  | "date-newest"
  | "date-oldest";

export interface FilterState {
  category: string;
  evidenceRange: [number, number];
  countries: string[];
  proteinSources: string[];
  searchQuery: string;
}
