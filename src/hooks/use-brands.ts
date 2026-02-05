import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { getBrands, getBrand, createBrand, updateBrand, deleteBrand } from "@/services/brands";
import { Brand } from "@/types";

// Keys for cache invalidation
export const brandKeys = {
  all: ["brands"] as const,
  lists: () => [...brandKeys.all, "list"] as const,
  list: (filters: string) => [...brandKeys.lists(), { filters }] as const,
  details: () => [...brandKeys.all, "detail"] as const,
  detail: (id: number) => [...brandKeys.details(), id] as const,
};

export const useBrands = () => {
  const supabase = createClient();
  return useQuery({
    queryKey: brandKeys.lists(),
    queryFn: () => getBrands(supabase),
  });
};

export const useBrand = (id: number) => {
  const supabase = createClient();
  return useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: () => getBrand(id, supabase),
    enabled: !!id && !isNaN(id),
  });
};

export const useCreateBrand = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<Brand, "id" | "updated_at">) => createBrand(data, supabase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
    },
  });
};

export const useUpdateBrand = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Brand> }) => 
      updateBrand(id, data, supabase),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({ queryKey: brandKeys.detail(data.id) });
    },
  });
};

export const useDeleteBrand = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteBrand(id, supabase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
    },
  });
};
