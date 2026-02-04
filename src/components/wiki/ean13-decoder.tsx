"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ScanBarcode, Loader2, AlertCircle, Globe, Building2, CheckCircle2, Camera, PackageSearch, ExternalLink } from "lucide-react";
import { useProductByBarcode } from "@/services/open-pet-food-facts";

// GS1 Prefix Ranges
// Source: https://www.gs1.org/standards/id-keys/company-prefix
const GS1_REGIONS = [
  { start: 0, end: 19, name: "美國 / 加拿大 (UPC-A 相容)" },
  { start: 20, end: 29, name: "店內碼 / 限制發行" },
  { start: 30, end: 39, name: "美國 (藥品)" },
  { start: 40, end: 49, name: "店內碼 / 限制發行" },
  { start: 50, end: 59, name: "優惠券" },
  { start: 60, end: 139, name: "美國 / 加拿大" },
  { start: 300, end: 379, name: "法國" },
  { start: 380, end: 380, name: "保加利亞" },
  { start: 383, end: 383, name: "斯洛維尼亞" },
  { start: 385, end: 385, name: "克羅埃西亞" },
  { start: 387, end: 387, name: "波士尼亞與赫塞哥維納" },
  { start: 400, end: 440, name: "德國" },
  { start: 450, end: 459, name: "日本" },
  { start: 460, end: 469, name: "俄羅斯" },
  { start: 471, end: 471, name: "台灣" },
  { start: 474, end: 474, name: "愛沙尼亞" },
  { start: 475, end: 475, name: "拉脫維亞" },
  { start: 477, end: 477, name: "立陶宛" },
  { start: 480, end: 480, name: "菲律賓" },
  { start: 489, end: 489, name: "香港" },
  { start: 490, end: 499, name: "日本" },
  { start: 500, end: 509, name: "英國" },
  { start: 520, end: 520, name: "希臘" },
  { start: 528, end: 528, name: "黎巴嫩" },
  { start: 529, end: 529, name: "賽普勒斯" },
  { start: 531, end: 531, name: "北馬其頓" },
  { start: 535, end: 535, name: "馬爾他" },
  { start: 539, end: 539, name: "愛爾蘭" },
  { start: 540, end: 549, name: "比利時 / 盧森堡" },
  { start: 560, end: 560, name: "葡萄牙" },
  { start: 569, end: 569, name: "冰島" },
  { start: 570, end: 579, name: "丹麥" },
  { start: 590, end: 590, name: "波蘭" },
  { start: 594, end: 594, name: "羅馬尼亞" },
  { start: 599, end: 599, name: "匈牙利" },
  { start: 600, end: 601, name: "南非" },
  { start: 609, end: 609, name: "模里西斯" },
  { start: 611, end: 611, name: "摩洛哥" },
  { start: 613, end: 613, name: "阿爾及利亞" },
  { start: 619, end: 619, name: "突尼西亞" },
  { start: 622, end: 622, name: "埃及" },
  { start: 626, end: 626, name: "伊朗" },
  { start: 640, end: 649, name: "芬蘭" },
  { start: 690, end: 699, name: "中國" },
  { start: 700, end: 709, name: "挪威" },
  { start: 729, end: 729, name: "以色列" },
  { start: 730, end: 739, name: "瑞典" },
  { start: 750, end: 750, name: "墨西哥" },
  { start: 759, end: 759, name: "委內瑞拉" },
  { start: 760, end: 769, name: "瑞士" },
  { start: 770, end: 771, name: "哥倫比亞" },
  { start: 773, end: 773, name: "烏拉圭" },
  { start: 775, end: 775, name: "秘魯" },
  { start: 777, end: 777, name: "玻利維亞" },
  { start: 779, end: 779, name: "阿根廷" },
  { start: 780, end: 780, name: "智利" },
  { start: 784, end: 784, name: "巴拉圭" },
  { start: 789, end: 790, name: "巴西" },
  { start: 800, end: 839, name: "義大利" },
  { start: 840, end: 849, name: "西班牙" },
  { start: 850, end: 850, name: "古巴" },
  { start: 858, end: 858, name: "斯洛伐克" },
  { start: 859, end: 859, name: "捷克" },
  { start: 860, end: 860, name: "塞爾維亞" },
  { start: 868, end: 869, name: "土耳其" },
  { start: 870, end: 879, name: "荷蘭" },
  { start: 880, end: 880, name: "南韓" },
  { start: 885, end: 885, name: "泰國" },
  { start: 888, end: 888, name: "新加坡" },
  { start: 890, end: 890, name: "印度" },
  { start: 893, end: 893, name: "越南" },
  { start: 930, end: 939, name: "澳洲" },
  { start: 940, end: 949, name: "紐西蘭" },
  { start: 955, end: 955, name: "馬來西亞" },
  { start: 958, end: 958, name: "澳門" },
];

interface BarcodeAnalysis {
  prefix: string;
  region: string;
  manufacturerPart: string;
  productPart: string;
  checkDigit: string;
  isValid: boolean;
}

export function Ean13Decoder() {
  const [barcode, setBarcode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<BarcodeAnalysis | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchBarcode, setSearchBarcode] = useState<string>("");

  const { data, isLoading } = useProductByBarcode(searchBarcode);
  const product = data?.product;

  // EAN-13 Check Digit Validation
  const isValidEAN13 = (code: string) => {
    if (code.length !== 13 || !/^\d+$/.test(code)) return false;

    let sumOdd = 0;
    let sumEven = 0;

    for (let i = 0; i < 12; i++) {
      const digit = parseInt(code[i]);
      if (i % 2 === 0) {
        sumOdd += digit; // Odd positions (0, 2, 4...) have weight 1
      } else {
        sumEven += digit; // Even positions (1, 3, 5...) have weight 3
      }
    }

    const total = sumOdd + (sumEven * 3);
    const checkDigit = (10 - (total % 10)) % 10;

    return checkDigit === parseInt(code[12]);
  };

  const getRegionName = (code: string) => {
    const prefix = parseInt(code.substring(0, 3));
    const region = GS1_REGIONS.find(r => prefix >= r.start && prefix <= r.end);
    return region ? region.name : "未知地區 / 全球通用";
  };

  const analyzeBarcode = () => {
    setError(null);
    setAnalysis(null);
    // Reset searchBarcode to ensure we can trigger a new search if needed, 
    // although react-query handles caching, setting it explicitly ensures the UI is in sync with the current action.
    // However, for the hook to work, we need to set it to the new barcode.
    // If we set it to null/empty first, it might cause a flicker or be unnecessary.
    // We will just set it to the new barcode if valid.

    if (!barcode) {
      setError("請輸入條碼");
      return;
    }

    if (!isValidEAN13(barcode)) {
      setError("無效的 EAN-13 條碼格式 (檢查碼錯誤或長度不符)");
      return;
    }

    // Parse Segments
    const prefix = barcode.substring(0, 3);
    const region = getRegionName(barcode);
    const checkDigit = barcode.substring(12, 13);
    const middlePart = barcode.substring(3, 12);
    const manufacturerPart = middlePart; 
    const productPart = ""; 

    setAnalysis({
      prefix,
      region,
      manufacturerPart,
      productPart,
      checkDigit,
      isValid: true
    });
    
    setIsOpen(true);

    // Trigger data fetch via hook
    setSearchBarcode(barcode);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            className="pl-9" 
            placeholder="請輸入 13 位條碼 (e.g. 489...)" 
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            inputMode="numeric"
            maxLength={13}
            onKeyDown={(e) => e.key === "Enter" && analyzeBarcode()}
          />
        </div>
        <Button onClick={analyzeBarcode} className="bg-blue-600 hover:bg-blue-700" type="button" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : "解析"}
        </Button>
        <Button variant="outline" size="icon" className="shrink-0" onClick={() => alert("開啟相機功能開發中...")}>
          <Camera size={18} />
        </Button>
      </div>

      {error && !isOpen && (
        <div className="text-sm text-red-500 flex items-center gap-2 bg-red-50 p-3 rounded-md">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScanBarcode className="text-blue-600" />
              條碼結構解析
            </DialogTitle>
            <DialogDescription>
              深入了解 {barcode} 的組成結構
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Visual Barcode Breakdown */}
            <div className="flex items-center justify-center space-x-1 text-2xl font-mono font-bold">
              <div className="flex flex-col items-center">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-200">{analysis?.prefix}</span>
                <span className="text-[10px] text-blue-600 mt-1 font-sans font-normal">前綴碼</span>
              </div>
              <span className="text-gray-300">-</span>
              <div className="flex flex-col items-center">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded border border-gray-200 tracking-widest">{analysis?.manufacturerPart}</span>
                <span className="text-[10px] text-gray-500 mt-1 font-sans font-normal">廠商與產品代碼</span>
              </div>
              <span className="text-gray-300">-</span>
              <div className="flex flex-col items-center">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded border border-green-200">{analysis?.checkDigit}</span>
                <span className="text-[10px] text-green-600 mt-1 font-sans font-normal">檢查碼</span>
              </div>
            </div>

            {/* Detailed Cards */}
            <div className="grid gap-4">
              {/* Region Info */}
              <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">註冊地區 / 國家</h4>
                  <p className="text-blue-700 text-lg font-medium mt-1">{analysis?.region}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    前綴碼 {analysis?.prefix} 表示該品牌是在此地區的 GS1 組織註冊，並不一定代表產地。
                  </p>
                </div>
              </div>

              {/* Manufacturer Info */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="p-2 bg-gray-200 rounded-lg text-gray-600 shrink-0">
                  <Building2 size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">廠商與產品序列</h4>
                  <p className="text-gray-700 font-mono mt-1">{analysis?.manufacturerPart}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    中間的 9 位數字由廠商代碼 (Company Prefix) 與產品代碼 (Item Reference) 組成。長度依據廠商規模而定。
                  </p>
                </div>
              </div>

              {/* Check Digit Info */}
              <div className="flex items-start gap-4 p-4 bg-green-50/50 rounded-xl border border-green-100">
                <div className="p-2 bg-green-100 rounded-lg text-green-600 shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">檢查碼驗證</h4>
                  <p className="text-green-700 font-mono mt-1">
                    {analysis?.checkDigit} <span className="text-sm font-sans font-normal text-green-600">(有效)</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    透過公式計算前 12 位數字得出的驗證碼，確保條碼掃描正確無誤。
                  </p>
                </div>
              </div>
            </div>

            {/* Product Found Info */}
            {isLoading ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="p-4 flex gap-4">
                  <Skeleton className="w-24 h-24 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ) : product ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <PackageSearch size={18} className="text-blue-600" />
                    Open Food Facts
                  </h3>
                  <a 
                    href={`https://world.openpetfoodfacts.org/product/${product.code}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Open Food Facts <ExternalLink size={10} />
                  </a>
                </div>
                <div className="p-4 flex gap-4">
                  <div className="w-24 h-24 bg-white rounded-lg border border-gray-100 flex items-center justify-center shrink-0 p-1">
                    {product.image_front_small_url ? (
                      <img src={product.image_front_small_url} alt={product.product_name} className="w-full h-full object-contain" />
                    ) : (
                      <PackageSearch className="text-gray-300" size={32} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-lg mb-1">{product.product_name || "未知名稱"}</h4>
                    <p className="text-gray-600 mb-2">{product.brands || "未知品牌"}</p>
                    <div className="flex flex-wrap gap-2">
                      {product.categories_tags?.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {tag.replace('en:', '').replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <PackageSearch className="mx-auto mb-2 opacity-20" size={32} />
                <p className="text-sm">Open PET FOOD facts 資料庫中未找到此產品資料</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
