"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeroSearch } from "@/components/search";
import { TrendingSection } from "./trending-section";
import { LatestSection } from "./latest-section";

export function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <main className="min-h-screen bg-background pb-12">
      <HeroSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        showScopeSelector={false}
      />

      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <TrendingSection />
          <LatestSection />
        </div>
      </section>
    </main>
  );
}
