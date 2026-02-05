"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBrands } from "@/hooks/use-brands";
import { LookupModal, LookupItem, LookupColumn } from "@/components/common/lookup-modal";
import { getCountryName } from "@/data/countries";

interface BrandLookupProps {
  value?: string | number;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function BrandLookup({ value, onChange, disabled, className }: BrandLookupProps) {
  const [open, setOpen] = React.useState(false);
  const { data: brands, isLoading } = useBrands();

  const selectedBrand = React.useMemo(() => {
    if (!brands || !value) return null;
    return brands.find((b) => b.id.toString() === value.toString());
  }, [brands, value]);

  const lookupItems: LookupItem[] = React.useMemo(() => {
    if (!brands) return [];
    return brands.map((brand) => ({
      id: brand.id,
      name: brand.name,
      country_code: brand.country_code,
      // For search capability
      searchStr: `${brand.name} ${getCountryName(brand.country_code || "")}`
    }));
  }, [brands]);

  const columns: LookupColumn<LookupItem>[] = [
    {
      header: "ID",
      accessorKey: "id",
      className: "w-[80px] font-mono text-gray-500",
    },
    {
      header: "Brand Name",
      accessorKey: "name",
      className: "font-medium",
    },
    {
      header: "Country",
      cell: (item) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {getCountryName(item.country_code)}
        </span>
      ),
    },
  ];

  const handleSelect = (item: LookupItem) => {
    onChange(item.id.toString());
  };

  return (
    <>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn("w-full justify-between font-normal", !value && "text-muted-foreground", className)}
        disabled={disabled || isLoading}
        onClick={() => setOpen(true)}
        type="button"
      >
        {selectedBrand ? (
          <span className="truncate">{selectedBrand.name}</span>
        ) : (
          <span>{isLoading ? "Loading brands..." : "Select brand"}</span>
        )}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      <LookupModal
        open={open}
        onOpenChange={setOpen}
        title="Select Brand"
        items={lookupItems}
        columns={columns}
        onSelect={handleSelect}
        isLoading={isLoading}
        searchPlaceholder="Search brands..."
        selectedId={selectedBrand?.id}
      />
    </>
  );
}
