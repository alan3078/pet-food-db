import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, CreateProductDTO } from "@/services/products";
import { Product } from "@/types/product";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string | number) => [...productKeys.details(), id] as const,
};

export const useProducts = () => {
  const supabase = createClient();
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: () => getProducts(supabase),
  });
};

export const useProduct = (id: string | number) => {
  const supabase = createClient();
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id, supabase),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateProductDTO) => createProduct(data, supabase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useUpdateProduct = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) => 
      updateProduct(id, data, supabase),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(data.id) });
    },
  });
};

export const useDeleteProduct = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id, supabase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};
