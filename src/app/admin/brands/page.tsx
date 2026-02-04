import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Filter, Factory } from "lucide-react";
import Link from "next/link";
import { BrandActions } from "@/components/admin/brand-actions";
import { getBrands } from "@/services/brands";
import { getCountryName } from "@/data/countries";

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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="搜尋品牌名稱、前綴碼..." 
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2 text-gray-600">
            <Filter size={16} />
            篩選
          </Button>
        </div>

        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>品牌名稱</TableHead>
              <TableHead>註冊國家</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands?.map((brand) => (
              <TableRow key={brand.id} className="hover:bg-gray-50/50">
                <TableCell className="font-mono font-medium text-gray-500">
                  #{brand.id}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Factory size={16} className="text-gray-400" />
                    {brand.name}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {getCountryName(brand.country_code)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <BrandActions brandId={brand.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
