import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { getLicensesByBrandId, createLicense, deleteLicense } from "@/services/licenses";
import { License } from "@/types";
import { brandKeys } from "./use-brands";

export const licenseKeys = {
  all: ["licenses"] as const,
  byBrand: (brandId: number) => [...licenseKeys.all, "brand", brandId] as const,
};

export const useLicenses = (brandId: number) => {
  const supabase = createClient();
  return useQuery({
    queryKey: licenseKeys.byBrand(brandId),
    queryFn: () => getLicensesByBrandId(brandId, supabase),
    enabled: !!brandId && !isNaN(brandId),
  });
};

export const useCreateLicense = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<License, "updated_at">) => createLicense(data, supabase),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: licenseKeys.byBrand(variables.brand_id) });
      // Also invalidate brand details if licenses are part of it (optional)
      queryClient.invalidateQueries({ queryKey: brandKeys.detail(variables.brand_id) });
    },
  });
};

export const useDeleteLicense = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prefix: string) => deleteLicense(prefix, supabase),
    onSuccess: () => {
      // We might not know the brand_id here easily to invalidate efficiently
      // So we invalidate all licenses or rely on parent component refetch
      queryClient.invalidateQueries({ queryKey: licenseKeys.all });
    },
  });
};
