"use client";

import { useState, useEffect } from "react";
import { Brand } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Factory } from "lucide-react";
import { BrandActions } from "@/components/admin/brand-actions";
import { getCountryName } from "@/data/countries";
import { PaginationControl } from "@/components/common/pagination-control";

interface BrandTableProps {
  initialBrands: Brand[];
}

export function BrandTable({ initialBrands }: BrandTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredBrands = initialBrands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (brand.country_code && brand.country_code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredBrands.length / pageSize);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="搜尋品牌名稱、前綴碼..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
          {paginatedBrands.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                沒有找到相關品牌
              </TableCell>
            </TableRow>
          ) : (
            paginatedBrands.map((brand) => (
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
            ))
          )}
        </TableBody>
      </Table>
      
      <div className="py-2 border-t bg-gray-50">
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          totalItems={filteredBrands.length}
        />
      </div>
    </div>
  );
}
