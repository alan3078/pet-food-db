"use client";

import { Search, PawPrint, FlaskConical, FileCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeroSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

export function HeroSearch({
  searchQuery,
  onSearchChange,
  onSearch,
}: HeroSearchProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-background py-24">
      {/* Decorative Background Elements */}
      <div className="absolute left-10 top-10 -rotate-12 opacity-10 md:left-20 md:top-20">
        <PawPrint className="h-24 w-24 text-blue-500" />
      </div>
      <div className="absolute right-10 top-20 rotate-12 opacity-10 md:right-32 md:top-10">
        <FlaskConical className="h-32 w-32 text-blue-500" />
      </div>
      <div className="absolute bottom-10 right-10 -rotate-6 opacity-5 md:bottom-20 md:right-20">
        <FileCode className="h-24 w-24 text-green-500" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          <span className="text-blue-600">寵物零食</span>數據
          <FlaskConical className="ml-3 inline-block h-8 w-8 text-blue-200" />
        </h1>
        {/* <p className="mb-10 text-lg text-muted-foreground">
          中立 · 驗證 · 透明。搜尋超過 10,000 筆產品的原產地與安全數據。
        </p> */}

        <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-full border bg-background p-2 shadow-lg ring-1 ring-black/5">
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] border-0 bg-transparent pl-4 text-base shadow-none focus:ring-0">
              <SelectValue placeholder="全部範圍" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部範圍</SelectItem>
              <SelectItem value="brand">品牌</SelectItem>
              <SelectItem value="product">產品名稱</SelectItem>
              <SelectItem value="ingredient">成分</SelectItem>
            </SelectContent>
          </Select>

          <div className="h-8 w-px bg-border" />

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜尋品牌、產品或成分..."
              className="border-0 bg-transparent pl-10 text-base shadow-none focus-visible:ring-0"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </div>

          <Button 
            className="rounded-full bg-blue-500 px-8 text-base font-medium hover:bg-blue-600" 
            onClick={onSearch}
            size="lg"
          >
            搜尋
          </Button>
        </div>
      </div>
    </section>
  );
}
