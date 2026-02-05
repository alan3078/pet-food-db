import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function TrendingSection() {
  // Mock data matching the screenshot
  const trendingProducts = [
    {
      id: 1,
      brand: "Natural Choice",
      product: "冷凍乾燥鴨胸肉",
      evidence: 12,
      score: 94.2,
      image: null, 
    },
    {
      id: 2,
      brand: "Ocean Delights",
      product: "野生鮪魚主食罐",
      evidence: 8,
      score: 82.5,
      image: null,
    },
    {
      id: 3,
      brand: "Green Garden",
      product: "鮮蒸地瓜片",
      evidence: 15,
      score: 98.1,
      image: null,
    },
    {
      id: 4,
      brand: "Prime Beef",
      product: "頂級牛肉條",
      evidence: 4,
      score: 76.0,
      image: null,
    },
  ];

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between p-6 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-orange-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </span>
          <h2 className="text-xl font-bold">熱門搜尋產品</h2>
        </div>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">
          TRENDINGS
        </span>
      </div>

      <div className="p-6 pt-2">
        <div className="grid grid-cols-[80px_1fr_80px_80px] gap-4 border-b py-2 text-sm text-muted-foreground">
          <div>預覽</div>
          <div>品牌與產品</div>
          <div className="text-center">核實文件</div>
          <div className="text-right">透明評分</div>
        </div>

        <div className="divide-y">
          {trendingProducts.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[80px_1fr_80px_80px] items-center gap-4 py-4"
            >
              <div className="h-16 w-16 overflow-hidden rounded-md border bg-slate-50">
                {item.image ? (
                   // Placeholder for now
                   <div className="h-full w-full bg-slate-200" />
                ) : (
                  <Skeleton className="h-full w-full" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-blue-500 hover:underline cursor-pointer">
                  {item.brand}
                </h3>
                <p className="text-sm text-slate-500">{item.product}</p>
              </div>
              <div className="text-center font-bold text-green-500">
                {item.evidence}份
              </div>
              <div className="text-right font-medium text-slate-600">
                {item.score}%
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/products?sort=evidence-high"
            className="inline-flex items-center text-sm font-medium text-blue-500 hover:text-blue-600"
          >
            查看完整數據排行榜 <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
