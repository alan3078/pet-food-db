import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getBrands } from "@/services/brands";
import { BrandTable } from "@/components/admin/brand-table";

export default async function BrandListPage() {
  const brands = await getBrands();

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">品牌資料管理</h1>
          <p className="text-gray-500">管理所有品牌的詳細資料、授權資訊與產品關聯。</p>
        </div>
        <Link href="/admin/brands/create">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus size={16} />
            新增品牌
          </Button>
        </Link>
      </div>

      <BrandTable initialBrands={brands || []} />
    </div>
  );
}
