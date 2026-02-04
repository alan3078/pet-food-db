export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: ProductCategory;
  mainConcerns: Concern[];
  ingredientOrigin: string;
  packagingLocation: string;
  productionLocation: string;
  evidenceCount: number;
  lastVerifiedDate: string;
  proteinSource: ProteinSource[];
  image?: string;
}

export type ProductCategory = 
  | "all"
  | "jerky"
  | "biscuit"
  | "dental";

export type Concern = 
  | "packaging"
  | "chemical"
  | "veterinary";

export type ProteinSource = 
  | "beef"
  | "chicken"
  | "fish"
  | "pork"
  | "lamb";

export type Country = 
  | "USA"
  | "Canada"
  | "New Zealand"
  | "Australia"
  | "Brazil"
  | "Mexico"
  | "Global (Unknown)";

export interface FilterState {
  category: ProductCategory;
  evidenceRange: [number, number];
  countries: string[];
  proteinSources: ProteinSource[];
  searchQuery: string;
}

export type SortOption = 
  | "evidence-high"
  | "evidence-low"
  | "name-asc"
  | "name-desc"
  | "date-newest"
  | "date-oldest";
