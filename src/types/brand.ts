export interface Brand {
  id: number;
  name: string;
  country_code: string;
  updated_at?: string;
}

export interface License {
  prefix: string;
  brand_id: number;
  source: string;
  source_date: string;
  updated_at?: string;
}

export type SortOption = "name-asc" | "name-desc" | "date-newest" | "date-oldest";
