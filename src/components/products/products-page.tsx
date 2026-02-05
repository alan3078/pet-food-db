"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, Search } from "lucide-react";

import { FilterSidebar } from "@/components/filters";
import { ProductList } from "./product-list";
import { useProducts } from "@/hooks/use-products";
import { FilterState, SortOption } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function ProductsPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialSort = (searchParams.get("sort") as SortOption) || "evidence-high";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [appliedSearch, setAppliedSearch] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    evidenceRange: [0, 20],
    countries: [],
    proteinSources: [],
    searchQuery: "",
  });

  const { data: products = [], isLoading } = useProducts();

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply search
    if (appliedSearch) {
      const query = appliedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name_en?.toLowerCase().includes(query) ||
          p.brand?.name?.toLowerCase().includes(query) ||
          p.origin_verbatim_text?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    // Apply evidence range filter
    result = result.filter(
      (p) =>
        (p.evidence_count || 0) >= filters.evidenceRange[0] &&
        (p.evidence_count || 0) <= filters.evidenceRange[1]
    );

    // Apply country filter
    if (filters.countries.length > 0) {
      result = result.filter((p) =>
        filters.countries.some(
          (c) =>
            p.raw_material_origin?.includes(c) ||
            p.factory_location?.includes(c)
        )
      );
    }

    // Apply protein source filter
    if (filters.proteinSources.length > 0) {
      result = result.filter((p) =>
        // Check if any of the product ingredients match the selected protein sources
        // If product_ingredients is available, use it. Otherwise fall back to ingredients_text check
        p.product_ingredients?.some((ing) => 
          filters.proteinSources.some(source => ing.ingredient_name.includes(source))
        ) || 
        (p.ingredients_text && filters.proteinSources.some(source => p.ingredients_text?.includes(source)))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "evidence-high":
        result.sort((a, b) => (b.evidence_count || 0) - (a.evidence_count || 0));
        break;
      case "evidence-low":
        result.sort((a, b) => (a.evidence_count || 0) - (b.evidence_count || 0));
        break;
      case "name-asc":
        result.sort((a, b) => (a.name_en || "").localeCompare(b.name_en || ""));
        break;
      case "name-desc":
        result.sort((a, b) => (b.name_en || "").localeCompare(a.name_en || ""));
        break;
      case "date-newest":
        result.sort(
          (a, b) =>
            new Date(b.updated_at || 0).getTime() -
            new Date(a.updated_at || 0).getTime()
        );
        break;
      case "date-oldest":
        result.sort(
          (a, b) =>
            new Date(a.updated_at || 0).getTime() -
            new Date(b.updated_at || 0).getTime()
        );
        break;
    }

    return result;
  }, [products, appliedSearch, filters, sortBy]);

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = () => {
    setAppliedSearch(searchQuery);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Breadcrumbs
          items={[
            { label: "首頁", href: "/" },
            { label: "產品資料庫" },
          ]}
        />
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">產品資料庫</h1>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜尋品牌、產品或成分..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>搜尋</Button>
        </div>
      </div>

      {/* Mobile Filter Trigger */}
      <div className="mb-6 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              篩選條件
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto sm:w-[400px]">
            <SheetHeader className="mb-4">
              <SheetTitle>篩選條件</SheetTitle>
            </SheetHeader>
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        </div>

        <ProductList
          products={paginatedProducts}
          totalCount={filteredProducts.length}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
