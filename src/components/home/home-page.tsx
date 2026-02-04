"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";

import { HeroSearch } from "@/components/search";
import { FilterSidebar } from "@/components/filters";
import { ProductList } from "@/components/products";
import { mockProducts } from "@/data/products";
import { FilterState, Product, SortOption } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Simulate API call with mock data
async function fetchProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockProducts;
}

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("evidence-high");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    evidenceRange: [0, 20],
    countries: [],
    proteinSources: [],
    searchQuery: "",
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply search
    if (appliedSearch) {
      const query = appliedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    // Apply evidence range filter
    result = result.filter(
      (p) =>
        p.evidenceCount >= filters.evidenceRange[0] &&
        p.evidenceCount <= filters.evidenceRange[1]
    );

    // Apply country filter
    if (filters.countries.length > 0) {
      result = result.filter((p) =>
        filters.countries.some(
          (c) =>
            p.ingredientOrigin.includes(c) ||
            p.productionLocation.includes(c) ||
            p.packagingLocation.includes(c)
        )
      );
    }

    // Apply protein source filter
    if (filters.proteinSources.length > 0) {
      result = result.filter((p) =>
        p.proteinSource.some((ps) => filters.proteinSources.includes(ps))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "evidence-high":
        result.sort((a, b) => b.evidenceCount - a.evidenceCount);
        break;
      case "evidence-low":
        result.sort((a, b) => a.evidenceCount - b.evidenceCount);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "date-newest":
        result.sort(
          (a, b) =>
            new Date(b.lastVerifiedDate).getTime() -
            new Date(a.lastVerifiedDate).getTime()
        );
        break;
      case "date-oldest":
        result.sort(
          (a, b) =>
            new Date(a.lastVerifiedDate).getTime() -
            new Date(b.lastVerifiedDate).getTime()
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
    <>
      <HeroSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      <section className="container mx-auto px-4 py-8">
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
      </section>
    </>
  );
}
