import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Store, Plane, ShieldCheck, Package, ScanBarcode, BookOpen } from "lucide-react";
import { BarcodeCard } from "@/components/wiki/barcode-card";
import { Ean13Decoder } from "@/components/wiki/ean13-decoder";

export default function BarcodeWikiPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "首頁", href: "/" },
              { label: "寵物糧條碼百科" },
            ]}
          />
        </div>

        <div className="space-y-4 mb-12">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1">
            <BookOpen size={14} />
            知識百科
          </Badge>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
            深入了解包裝上的黑白線條，掌握 4 大關鍵條碼類別，確保毛孩的每一口糧食都安全、可追溯。
          </p>
        </div>

        {/* Decoder Tool Section */}
        <div className="mb-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
           <div className="text-center mb-8 space-y-2">
             <h2 className="text-2xl font-bold text-gray-900">條碼智能解析器</h2>
             <p className="text-gray-600">輸入包裝上的條碼，自動識別格式並解析詳細資訊。</p>
           </div>
           <Ean13Decoder />
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <BarcodeCard
            type="ean-13"
            title="EAN-13 標準條碼"
            icon={Store}
            iconColor="text-blue-600"
            tag="Identity"
            description="由 13 位數字組成的國際通用身分證。結構包含："
            points={[
              "前綴碼 (Prefix)：如 489 代表香港註冊廠商。",
              "廠商代碼與產品代碼，確保全球唯一性。"
            ]}
          />
          
          <BarcodeCard
            type="upc-a"
            title="UPC-A 北美通用碼"
            icon={Plane}
            iconColor="text-purple-600"
            tag="Import"
            description="由 12 位數字組成，源於美國與加拿大，是北美進口寵物糧的標配。"
            points={[
              "常見品牌：Hill's, Orijen, Wellness 等美加進口糧。",
              "可向上兼容 EAN-13 (前面補0)，專注於零售結帳。"
            ]}
          />

          <BarcodeCard
            type="datamatrix"
            title="GS1 DataMatrix 二維碼"
            icon={ShieldCheck}
            iconColor="text-green-600"
            tag="Safety"
            description="方形矩陣二維碼，不僅是身分證，更是食品安全的「黑盒子」。"
            points={[
              "紀錄批號 (Batch) 與效期 (Expiry)：精準鎖定問題產品。",
              "支援序列號防偽與緊急召回 (Recall) 功能。"
            ]}
          />

          <BarcodeCard
            type="itf-14"
            title="ITF-14 物流箱碼"
            icon={Package}
            iconColor="text-orange-600"
            tag="Logistics"
            description="帶有粗黑框保護的 14 位條碼，專用於外箱包裝 (Case Packaging)。"
            points={[
              "倉儲物流專用，即使紙箱印刷粗糙也能被掃描器讀取。",
              "代表「一整箱」而非「單一包」商品。"
            ]}
          />
        </div>
      </div>
    </div>
  );
}
