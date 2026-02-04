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
import { mockProducts, categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Extended mock data for the details page
const mockProductDetails = {
  ingredients: {
    title: "100% 牛肝",
    description: "源自美國本土牧場。無激素添加。經低溫冷凍乾燥處理以保留營養。不含任何人工防腐劑或填充物。",
    tags: ["單一來源"]
  },
  supplyChain: {
    rawMaterial: {
      location: "美國",
      verifications: [
        { type: "官網資訊驗證", url: "#", verified: true },
        { type: "客服回覆驗證", url: "#", verified: true }
      ]
    },
    production: {
      location: "美國",
      verifications: [
        { type: "包裝標籤驗證", url: "#", verified: true },
        { type: "廠商實地審計報告", url: "#", verified: true }
      ]
    },
    packaging: {
      location: "美國",
      verifications: [
        { type: "包裝標籤驗證", url: "#", verified: true }
      ]
    }
  },
  timeline: [
    { 
      id: 1, 
      date: "2023-10-15", 
      title: "廠商實地審計報告", 
      description: "年度第三方工廠審計，確認生產流程符合安全標準與勞工規範。",
      type: "verified",
      action: "檢視文件" 
    },
    { 
      id: 2, 
      date: "2023-09-12", 
      title: "第三方化驗報告", 
      description: "針對重金屬、沙門氏菌與大腸桿菌的檢驗報告，結果均為陰性。",
      type: "verified",
      action: "檢視文件" 
    },
    { 
      id: 3, 
      date: "2023-08-05", 
      title: "包裝正反面相片", 
      description: "最新批次的零售包裝實拍，包含批號與有效期限標示。",
      type: "photo",
      action: "檢視相片" 
    }
  ]
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("evidence");
  
  const product = mockProducts.find(p => p.id === params.id);

  if (!product) {
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
            <span className="font-medium text-slate-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header Card */}
        <Card className="p-6 border-slate-200 shadow-sm bg-white overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Image Placeholder */}
            <div className="w-full md:w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 border border-slate-200">
              <Package className="h-16 w-16 text-slate-300" />
            </div>

            {/* Product Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">{product.brand}</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      {product.evidenceCount} 份文件已驗證
                    </Badge>
                    <Badge variant="outline" className="text-slate-600 border-slate-200">
                      {categories.find(c => c.value === product.category)?.label || product.category}
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
                {product.description}
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
              <h3 className="text-xl font-bold text-slate-900">{mockProductDetails.ingredients.title}</h3>
              {mockProductDetails.ingredients.tags.map(tag => (
                <Badge key={tag} className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-slate-600">{mockProductDetails.ingredients.description}</p>
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
                <div className="text-2xl font-bold text-slate-900">{mockProductDetails.supplyChain.rawMaterial.location}</div>
              </div>
              <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockProductDetails.supplyChain.rawMaterial.verifications.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-emerald-200 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-1 rounded-full">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="font-bold text-slate-700 text-sm">{item.type}</span>
                    </div>
                    <a href={item.url} className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      查看 <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            {/* Production */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-3 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">生產地</span>
                <div className="text-2xl font-bold text-slate-900">{mockProductDetails.supplyChain.production.location}</div>
              </div>
              <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockProductDetails.supplyChain.production.verifications.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-emerald-200 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-1 rounded-full">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="font-bold text-slate-700 text-sm">{item.type}</span>
                    </div>
                    <a href={item.url} className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      查看 <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            {/* Packaging */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-3 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">包裝地</span>
                <div className="text-2xl font-bold text-slate-900">{mockProductDetails.supplyChain.packaging.location}</div>
              </div>
              <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockProductDetails.supplyChain.packaging.verifications.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-emerald-200 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-1 rounded-full">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="font-bold text-slate-700 text-sm">{item.type}</span>
                    </div>
                    <a href={item.url} className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      查看 <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                ))}
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
              證據時間軸
              {activeTab === "evidence" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
            </button>
          </div>

          <div className="p-8">
            {activeTab === "evidence" && (
              <div className="space-y-6">
                {mockProductDetails.timeline.map((item, index) => (
                  <div key={item.id} className="relative pl-8 pb-8 last:pb-0">
                    {/* Line */}
                    {index !== mockProductDetails.timeline.length - 1 && (
                      <div className="absolute left-[11px] top-3 bottom-0 w-px bg-slate-200" />
                    )}
                    
                    {/* Dot */}
                    <div className={cn(
                      "absolute left-0 top-1 h-6 w-6 rounded-full border-4 border-white shadow-sm z-10",
                      item.type === "verified" ? "bg-emerald-500" : "bg-blue-400"
                    )} />

                    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          {item.type === "verified" ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100">已驗證</Badge>
                          ) : (
                            <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100">相片</Badge>
                          )}
                          <span className="text-sm text-slate-400 font-medium">{item.date}</span>
                        </div>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                      <p className="text-slate-600 mb-4">{item.description}</p>
                      
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                        {item.type === "verified" ? <FileText className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                        {item.action}
                      </Button>
                    </div>
                  </div>
                ))}
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
