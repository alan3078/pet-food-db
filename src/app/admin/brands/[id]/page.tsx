import { BrandForm } from "@/components/admin/brand-form";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBrandPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  
  // The ID is now a number (integer) in the database, but comes as string from URL
  const brandId = parseInt(id, 10);

  if (isNaN(brandId)) {
      notFound();
  }

  const { data: brand, error: brandError } = await supabase
    .from("brand")
    .select("*")
    .eq("id", brandId)
    .single();

  if (brandError || !brand) {
    console.error("Error fetching brand:", brandError);
    notFound();
  }

  const { data: licenses, error: licenseError } = await supabase
    .from("license")
    .select("*")
    .eq("brand_id", brandId)
    .order("prefix", { ascending: true });

  if (licenseError) {
    console.error("Error fetching licenses:", licenseError);
    // We don't 404 here, just pass empty licenses or log error
  }

  return <BrandForm initialData={brand} initialLicenses={licenses || []} isEditMode />;
}
