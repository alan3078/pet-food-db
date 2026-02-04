"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { categories, countries, proteinSources } from "@/data/products";
import { FilterState, ProductCategory, ProteinSource } from "@/types";

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const handleCategoryChange = (category: ProductCategory) => {
    onFilterChange({ ...filters, category });
  };

  const handleCountryToggle = (country: string) => {
    const newCountries = filters.countries.includes(country)
      ? filters.countries.filter((c) => c !== country)
      : [...filters.countries, country];
    onFilterChange({ ...filters, countries: newCountries });
  };

  const handleProteinToggle = (protein: ProteinSource) => {
    const newProteins = filters.proteinSources.includes(protein)
      ? filters.proteinSources.filter((p) => p !== protein)
      : [...filters.proteinSources, protein];
    onFilterChange({ ...filters, proteinSources: newProteins });
  };

  const handleReset = () => {
    onFilterChange({
      category: "all",
      evidenceRange: [0, 20],
      countries: [],
      proteinSources: [],
      searchQuery: "",
    });
  };

  return (
    <aside className="w-full space-y-6 lg:w-64">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">篩選條件</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary/80"
          onClick={handleReset}
        >
          重置
        </Button>
      </div>

      <Separator />

      {/* Category Filter */}
      <div className="space-y-3">
        <h3 className="font-medium">產品類別</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.value} className="flex items-center gap-2">
              <Checkbox
                id={`category-${category.value}`}
                checked={filters.category === category.value}
                onCheckedChange={() =>
                  handleCategoryChange(category.value as ProductCategory)
                }
              />
              <label
                htmlFor={`category-${category.value}`}
                className="cursor-pointer text-sm"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Evidence Range Filter */}
      <div className="space-y-3">
        <h3 className="font-medium">證據數量區間</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{filters.evidenceRange[0]}</span>
          <span>-</span>
          <span>{filters.evidenceRange[1]}+</span>
        </div>
        <input
          type="range"
          min="0"
          max="20"
          value={filters.evidenceRange[0]}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              evidenceRange: [parseInt(e.target.value), filters.evidenceRange[1]],
            })
          }
          className="w-full accent-primary"
        />
      </div>

      <Separator />

      {/* Country Filter */}
      <div className="space-y-3">
        <h3 className="font-medium">宣稱產地</h3>
        <div className="space-y-2">
          {countries.slice(0, 4).map((country) => (
            <div key={country.value} className="flex items-center gap-2">
              <Checkbox
                id={`country-${country.value}`}
                checked={filters.countries.includes(country.value)}
                onCheckedChange={() => handleCountryToggle(country.value)}
              />
              <label
                htmlFor={`country-${country.value}`}
                className="cursor-pointer text-sm"
              >
                {country.label}
              </label>
            </div>
          ))}
          <Button variant="link" size="sm" className="h-auto p-0 text-primary">
            • 顯示更多
          </Button>
        </div>
      </div>

      <Separator />

      {/* Protein Source Filter */}
      <div className="space-y-3">
        <h3 className="font-medium">蛋白質來源</h3>
        <div className="space-y-2">
          {proteinSources.slice(0, 3).map((protein) => (
            <div key={protein.value} className="flex items-center gap-2">
              <Checkbox
                id={`protein-${protein.value}`}
                checked={filters.proteinSources.includes(
                  protein.value as ProteinSource
                )}
                onCheckedChange={() =>
                  handleProteinToggle(protein.value as ProteinSource)
                }
              />
              <label
                htmlFor={`protein-${protein.value}`}
                className="cursor-pointer text-sm"
              >
                {protein.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
