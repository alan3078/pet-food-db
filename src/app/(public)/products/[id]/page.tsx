"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Package, 
  FileText,
  Download,
  Eye,
  ChevronRight,
  ExternalLink,
  Info
} from "lucide-react";
import { useProduct } from "@/hooks/use-products";
import { categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("evidence");
  
  // params.id is the product id
  const { data: product, isLoading, error } = useProduct(params.id as string);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">找不到產品</h1>
        <Button onClick={() => router.back()} className="mt-4">返回</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">首頁</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-slate-300" />
            <span className="cursor-pointer hover:text-blue-600 transition-colors">數據庫</span>
            <ChevronRight className="h-4 w-4 mx-2 text-slate-300" />
            <span className="font-medium text-slate-900">{product.name_en}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header Card */}
        <Card className="p-6 border-slate-200 shadow-sm bg-white overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Image */}
            <div className="w-full md:w-48 h-48 bg-white rounded-xl flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
              {product.main_image_url ? (
                <img 
                  src={product.main_image_url} 
                  alt={product.name_en} 
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                  <Package className="h-16 w-16 text-slate-300" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">{product.brand?.name}</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name_en}</h1>
                  {(product.specification || product.version_label) && (
                    <div className="flex items-center gap-2 mb-2">
                      {product.specification && (
                        <Badge variant="outline" className="text-sm font-normal text-slate-500">
                          {product.specification}
                        </Badge>
                      )}
                      {product.version_label && (
                        <Badge variant="outline" className="text-sm font-normal text-slate-500">
                          {product.version_label}
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      {product.evidence_count || 0} 已驗證
                    </Badge>
                    <Badge variant="outline" className="text-slate-600 border-slate-200">
                      {categories.find(c => c.value === product.category)?.label || product.category || "未分類"}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="rounded-full text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-blue-600">
                    <Share2 className="h-4 w-4 mr-2" />
                    分享
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-blue-600">
                    <Bookmark className="h-4 w-4 mr-2" />
                    收藏
                  </Button>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed max-w-3xl">
                {product.origin_verbatim_text || "暫無描述"}
              </p>
            </div>
          </div>
        </Card>

        {/* Ingredients Section */}
        <Card className="p-6 border-slate-200 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">主要成分</h2>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-bold text-slate-900">成分列表</h3>
              {/* If we had parsed ingredients tags, we could map them here. For now, skipping tags. */}
            </div>
            <p className="text-slate-600">{product.ingredients_text || "暫無成分資訊"}</p>
          </div>
        </Card>

        {/* Supply Chain Verification */}
        <Card className="p-6 border-slate-200 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-6">
             <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">供應鏈多重驗證</h2>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Raw Material */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-3 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">原料產地</span>
                <div className="text-2xl font-bold text-slate-900">{product.raw_material_origin || "未標示"}</div>
              </div>
              <div className="md:col-span-9">
                <p className="text-sm text-slate-500 italic">驗證資料準備中...</p>
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            {/* Production */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-3 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">生產地</span>
                <div className="text-2xl font-bold text-slate-900">{product.factory_location || "未標示"}</div>
              </div>
              <div className="md:col-span-9">
                <p className="text-sm text-slate-500 italic">驗證資料準備中...</p>
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            {/* Packaging */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-3 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">包裝地</span>
                <div className="text-2xl font-bold text-slate-900">{product.factory_location || "未標示"}</div>
              </div>
              <div className="md:col-span-9">
                 <p className="text-sm text-slate-500 italic">驗證資料準備中...</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs & Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => setActiveTab("overview")}
              className={cn(
                "px-8 py-4 text-sm font-bold transition-colors relative",
                activeTab === "overview" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              概覽
              {activeTab === "overview" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
            </button>
            <button 
              onClick={() => setActiveTab("composition")}
              className={cn(
                "px-8 py-4 text-sm font-bold transition-colors relative",
                activeTab === "composition" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              成分與營養
              {activeTab === "composition" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
            </button>
            <button 
              onClick={() => setActiveTab("evidence")}
              className={cn(
                "px-8 py-4 text-sm font-bold transition-colors relative",
                activeTab === "evidence" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              文件時間軸
              {activeTab === "evidence" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
            </button>
          </div>

          <div className="p-8">
            {activeTab === "evidence" && (
              <div className="space-y-6">
                {product.evidence_documents && product.evidence_documents.length > 0 ? (
                  product.evidence_documents.map((doc, index) => (
                    <div key={doc.id} className="relative pl-8 pb-8 last:pb-0">
                      {/* Line */}
                      {index !== (product.evidence_documents?.length || 0) - 1 && (
                        <div className="absolute left-[11px] top-3 bottom-0 w-px bg-slate-200" />
                      )}
                      
                      {/* Dot */}
                      <div className={cn(
                        "absolute left-0 top-1 h-6 w-6 rounded-full border-4 border-white shadow-sm z-10 bg-emerald-500"
                      )} />

                      <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100">已驗證</Badge>
                            <span className="text-sm text-slate-400 font-medium">{new Date(doc.updated_at || "").toLocaleDateString()}</span>
                          </div>
                        </div>

                        <h4 className="text-lg font-bold text-slate-900 mb-2">{doc.file_name || "文件"}</h4>
                        <p className="text-slate-600 mb-4">{doc.doc_type || "未分類文件"}</p>
                        
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                           <FileText className="h-4 w-4 mr-2" />
                          檢視文件
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                   <div className="text-center py-12 text-slate-500">
                    暫無文件文件
                  </div>
                )}
              </div>
            )}
            
            {activeTab !== "evidence" && (
              <div className="text-center py-12 text-slate-500">
                {activeTab === "overview" ? "概覽內容將顯示於此。" : "成分與營養內容將顯示於此。"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
