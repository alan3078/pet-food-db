import { BrandForm } from "@/components/admin/brand-form";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { getBrand } from "@/services/brands";
import { getLicensesByBrandId } from "@/services/licenses";
import { License } from "@/types";

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

  let brand;
  try {
    brand = await getBrand(brandId, supabase);
  } catch (error) {
    console.error("Error fetching brand:", error);
    notFound();
  }

  let licenses: License[] = [];
  try {
    licenses = await getLicensesByBrandId(brandId, supabase);
  } catch (error) {
    console.error("Error fetching licenses:", error);
  }

  return <BrandForm initialData={brand} initialLicenses={licenses} isEditMode />;
}
