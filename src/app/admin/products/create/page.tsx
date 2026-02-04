"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Check, ChevronRight, Info, Map, Apple, CheckCircle2, Search, Upload, FileText, X, Sparkles, Link as LinkIcon, Unlink, Plus, Trash2, Image as ImageIcon, Settings, AlertTriangle, FileUp, Package, ScanBarcode, Store } from "lucide-react";
import { BarcodeCard } from "@/components/wiki/barcode-card";
import { BarcodeSearchInput } from "@/components/admin/barcode-search-input";
import { Product } from "@/services/open-pet-food-facts/response.dto";

const STEPS = [
  {
    id: 1,
    label: "基本資訊",
    icon: Info,
    description: "產品基本身分與宣稱"
  },
  {
    id: 2,
    label: "產地來源",
    icon: Map,
    description: "生產工廠與證明"
  },
  {
    id: 3,
    label: "成份與營養",
    icon: Apple,
    description: "詳細成份表與分析"
  },
  {
    id: 4,
    label: "完成提交",
    icon: CheckCircle2,
    description: "預覽並確認"
  }
];

export default function AddProductPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    barcode: "",
    name: "",
    brand: "",
    category: "",
    originText: "",
    countryCode: "",
    factoryName: "",
    factoryLocation: "",
    ingredientSource: "",
    evidenceFiles: [] as string[], // Placeholder for file uploads
    ingredientText: "",
    nutrition: {
      protein: "",
      fat: "",
      fiber: "",
      moisture: ""
    }
  });

  const handleProductSelect = (product: Product) => {
    setFormData(prev => ({
      ...prev,
      name: product.product_name || prev.name,
      brand: product.brands || prev.brand,
      ingredientText: product.ingredients_text || prev.ingredientText,
      originText: product.origin || prev.originText,
      countryCode: product.countries || prev.countryCode,
      nutrition: {
        ...prev.nutrition,
        protein: product.nutriments?.proteins_100g?.toString() || prev.nutrition.protein,
        // @ts-expect-error - fat_100g might be missing in DTO
        fat: product.nutriments?.fat_100g?.toString() || prev.nutrition.fat,
        fiber: product.nutriments?.fiber_100g?.toString() || prev.nutrition.fiber,
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/products" className="hover:text-blue-600">產品管理</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">新增產品資料</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">新增產品資料</h1>
        <p className="text-gray-500">請按步驟填寫產品詳細資訊。標記 <span className="text-red-500">*</span> 為必填項目。</p>
      </div>

      {/* Stepper */}
      <div className="relative flex justify-between items-start mb-12 px-10">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-10" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-blue-600 -z-10 transition-all duration-300" 
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-gray-50/0">
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 z-10
                  ${isActive ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110' : 
                    isCompleted ? 'bg-blue-600 border-blue-600 text-white' : 
                    'bg-white border-gray-300 text-gray-400'}
                `}
              >
                {isCompleted ? <Check size={20} /> : <step.icon size={20} />}
              </div>
              <span className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <Card className="p-8 shadow-sm border-gray-200 bg-white mb-6">
        {currentStep === 1 && (
          <div className="space-y-10">
            {/* Section 1 */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
                <h2 className="text-lg font-bold text-gray-900">第一步：產品基本身分</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    產品條碼 (Barcode)
                  </label>
                  <div className="flex gap-2">
                    <BarcodeSearchInput 
                      value={formData.barcode}
                      onChange={(val) => setFormData({...formData, barcode: val})}
                      onSelect={handleProductSelect}
                    />
                    <Button variant="outline" className="gap-2 shrink-0">
                      <ScanBarcode size={16} />
                      掃描
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    產品名稱 (英文) <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="e.g. Freeze-Dried Chicken Hearts" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <p className="text-xs text-gray-400">請輸入產品包裝上的原始英文名稱</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      品牌名稱 (英文) <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      placeholder="e.g. Pure Bites" 
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      產品分類 <span className="text-red-500">*</span>
                    </label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(val) => setFormData({...formData, category: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇分類" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jerky">肉乾 (Jerky)</SelectItem>
                        <SelectItem value="biscuit">餅乾 (Biscuit)</SelectItem>
                        <SelectItem value="dental">潔牙骨 (Dental)</SelectItem>
                        <SelectItem value="wet">濕食 (Wet Food)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
                <h2 className="text-lg font-bold text-gray-900">第二步：產地宣稱</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    標籤宣稱產地 (Verbatim Text) <span className="text-gray-400 font-normal">(選填)</span>
                  </label>
                  <Textarea 
                    placeholder="請完整抄錄包裝上顯示之產地資訊，例如：Made in USA with ingredients sourced from North America."
                    className="min-h-[100px] resize-none"
                    value={formData.originText}
                    onChange={(e) => setFormData({...formData, originText: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    標準化國家代碼
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input 
                      className="pl-9"
                      placeholder="搜尋國家, 如: United States"
                      value={formData.countryCode}
                      onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-10">
            {/* Section 1: Production Factory */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
                <h2 className="text-lg font-bold text-gray-900">生產工廠資訊</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    工廠名稱 <span className="text-gray-400 font-normal">(選填)</span>
                  </label>
                  <Input 
                    placeholder="輸入工廠名稱" 
                    value={formData.factoryName}
                    onChange={(e) => setFormData({...formData, factoryName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    工廠所在地 <span className="text-gray-400 font-normal">(選填)</span>
                  </label>
                  <Input 
                    placeholder="e.g. Thailand, Chonburi" 
                    value={formData.factoryLocation}
                    onChange={(e) => setFormData({...formData, factoryLocation: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Ingredient Source */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
                <h2 className="text-lg font-bold text-gray-900">主要原料來源</h2>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  原料產地 <span className="text-gray-400 font-normal">(選填)</span>
                </label>
                <Input 
                  placeholder="e.g. Chicken sourced from USA farms" 
                  value={formData.ingredientSource}
                  onChange={(e) => setFormData({...formData, ingredientSource: e.target.value})}
                />
                <p className="text-xs text-gray-400">請盡量提供具體的原料來源地資訊</p>
              </div>
            </div>

            {/* Section 3: Evidence Upload */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
                <h2 className="text-lg font-bold text-gray-900">證明文件上傳</h2>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  <Upload size={24} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">點擊或拖曳文件至此上傳</h3>
                <p className="text-xs text-gray-500 mb-4">支援 PDF, JPG, PNG 格式 (最大 5MB)</p>
                <Button variant="outline" size="sm" className="h-8">選擇文件</Button>
              </div>

              {/* Mock Uploaded List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center border border-gray-200 text-red-500">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Factory_Cert_2024.pdf</p>
                      <p className="text-xs text-gray-400">2.4 MB • Uploaded just now</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 p-1">
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Ingredients & Nutrition */}
            <div className="flex-1 space-y-10">
              
              {/* Ingredients Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-l-4 border-blue-600 pl-3">
                  <h2 className="text-lg font-bold text-gray-900">成份清單 (Ingredients)</h2>
                  <Button variant="outline" size="sm" className="gap-2 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
                    <Sparkles size={14} />
                    AI 智慧辨識
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      完整成份文字 (英文) <span className="text-gray-400 font-normal">(選填)</span>
                    </label>
                    <Textarea 
                      placeholder="e.g. Chicken, Chicken Liver, Chicken Heart, New Zealand Green Mussel..."
                      className="min-h-[100px] resize-none"
                      value={formData.ingredientText}
                      onChange={(e) => setFormData({...formData, ingredientText: e.target.value})}
                    />
                  </div>

                  {/* Parsed Ingredients List (Mock) */}
                  <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>已解析成份 (3)</span>
                    </div>

                    {/* Mock Item 1 */}
                    <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center text-gray-400">
                          <Settings size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Chicken (雞肉)</p>
                          <p className="text-xs text-gray-500">主要肉類來源</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs border border-green-100">
                          <LinkIcon size={12} />
                          已連結佐證
                        </span>
                        <button className="text-gray-400 hover:text-red-500 p-1">
                          <X size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Mock Item 2 */}
                    <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center text-gray-400">
                          <Settings size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Chicken Liver (雞肝)</p>
                          <p className="text-xs text-gray-500">內臟類</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs border border-gray-200">
                          <Unlink size={12} />
                          連結佐證
                        </span>
                        <button className="text-gray-400 hover:text-red-500 p-1">
                          <X size={16} />
                        </button>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full border-dashed text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50">
                      <Plus size={16} className="mr-2" />
                      新增單項成份
                    </Button>
                  </div>
                </div>
              </div>

              {/* Nutrition Analysis Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-l-4 border-blue-600 pl-3">
                  <h2 className="text-lg font-bold text-gray-900">營養成份保證值 (Guaranteed Analysis)</h2>
                  <Button variant="outline" size="sm" className="gap-2 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
                    <FileUp size={14} />
                    上傳實驗室報告
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500">粗蛋白 (Crude Protein) <span className="text-gray-400 font-normal">(選填)</span></label>
                    <div className="relative">
                      <Input 
                        placeholder="min" 
                        value={formData.nutrition?.protein || ""}
                        onChange={(e) => setFormData({
                          ...formData, 
                          nutrition: {
                            ...(formData.nutrition || { protein: "", fat: "", fiber: "", moisture: "" }), 
                            protein: e.target.value
                          }
                        })}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500">粗脂肪 (Crude Fat) <span className="text-gray-400 font-normal">(選填)</span></label>
                    <div className="relative">
                      <Input 
                        placeholder="min" 
                        value={formData.nutrition?.fat || ""}
                        onChange={(e) => setFormData({
                          ...formData, 
                          nutrition: {
                            ...(formData.nutrition || { protein: "", fat: "", fiber: "", moisture: "" }), 
                            fat: e.target.value
                          }
                        })}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500">粗纖維 (Crude Fiber)</label>
                    <div className="relative">
                      <Input 
                        placeholder="max" 
                        value={formData.nutrition?.fiber || ""}
                        onChange={(e) => setFormData({
                          ...formData, 
                          nutrition: {
                            ...(formData.nutrition || { protein: "", fat: "", fiber: "", moisture: "" }), 
                            fiber: e.target.value
                          }
                        })}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500">水分 (Moisture)</label>
                    <div className="relative">
                      <Input 
                        placeholder="max" 
                        value={formData.nutrition?.moisture || ""}
                        onChange={(e) => setFormData({
                          ...formData, 
                          nutrition: {
                            ...(formData.nutrition || { protein: "", fat: "", fiber: "", moisture: "" }), 
                            moisture: e.target.value
                          }
                        })}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                    </div>
                  </div>
                </div>

                {/* Warning Alert */}
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex gap-3 items-start">
                  <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={16} />
                  <div className="text-xs text-orange-800">
                    <span className="font-bold">缺少實驗室佐證報告：</span>
                    請確保至少有一份第三方檢驗報告 (COA) 連結至此區塊，以符合透明度標準。
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Evidence Library */}
            <div className="w-full lg:w-80 shrink-0 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">佐證資料庫</h3>
                <Settings size={16} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <Input className="pl-9 h-9 text-sm" placeholder="搜尋資料標籤..." />
              </div>

              <div className="space-y-3">
                {/* Mock Evidence Item 1 */}
                <div className="group relative border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400 relative">
                    <ImageIcon size={32} />
                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">使用中</span>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-bold text-gray-900 truncate">包裝背面 (Back Label)</p>
                    <p className="text-[10px] text-gray-400">Uploaded 2 mins ago</p>
                  </div>
                </div>

                 {/* Mock Evidence Item 2 */}
                 <div className="group relative border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400 relative">
                    <ImageIcon size={32} />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-bold text-gray-900 truncate">包裝正面 (Front Label)</p>
                    <p className="text-[10px] text-gray-400">Uploaded 5 mins ago</p>
                  </div>
                </div>

                {/* Mock Evidence Item 3 - PDF */}
                <div className="group relative border rounded-lg overflow-hidden bg-red-50 border-red-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video flex items-center justify-center text-red-500 relative">
                    <FileText size={32} />
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-xs font-bold text-gray-900 truncate">Lab_Report_2024.pdf</p>
                    <p className="text-[10px] text-gray-400">Uploaded 10 mins ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 4 && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Data Summary */}
            <div className="flex-1 space-y-8">
              
              {/* Basic Info Summary */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">基本資訊</h3>
                  <button onClick={() => setCurrentStep(1)} className="text-sm font-medium text-blue-600 hover:text-blue-700">編輯</button>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 flex gap-6">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                     <ImageIcon className="text-gray-300" size={48} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2 mb-1">
                       <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded">狗零食</span>
                       <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded">肉乾類</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">{formData.name || "Product Name"}</h4>
                    <p className="text-gray-500">品牌：{formData.brand || "Brand Name"} • SKU: NB-2023-CK01</p>
                    <div className="flex gap-4 text-sm text-gray-500 mt-2">
                       <span>⚖️ 150g</span>
                    </div>
                  </div>
                </div>

                {formData.barcode && (
                  <div className="mt-4">
                    <BarcodeCard
                      type="ean-13"
                      title={formData.barcode}
                      icon={Store}
                      iconColor="text-blue-600"
                      tag="Product ID"
                      description="產品主要識別條碼 (Primary Barcode)"
                      points={[
                        "格式: EAN-13 / UPC 標準零售條碼",
                        `數值: ${formData.barcode}`
                      ]}
                    />
                  </div>
                )}
              </div>

              {/* Supply Chain Summary */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">供應鏈實證</h3>
                  <button onClick={() => setCurrentStep(2)} className="text-sm font-medium text-blue-600 hover:text-blue-700">編輯</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {/* Card 1: Source */}
                   <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                            <Map size={16} /> 原料來源
                         </div>
                         <CheckCircle2 size={16} className="text-green-500" />
                      </div>
                      <p className="font-bold text-gray-900 mb-1">{formData.countryCode || "Unknown"}</p>
                      <div className="mt-3">
                         <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 flex w-fit gap-1 items-center">
                            <FileText size={10} /> 進口報單
                         </span>
                      </div>
                   </div>
                   {/* Card 2: Factory */}
                   <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                            <Settings size={16} /> 製造加工
                         </div>
                         <CheckCircle2 size={16} className="text-green-500" />
                      </div>
                      <p className="font-bold text-gray-900 mb-1">{formData.factoryLocation || "Unknown"}</p>
                      <div className="mt-3">
                         <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 flex w-fit gap-1 items-center">
                            <FileText size={10} /> 工廠登記證
                         </span>
                      </div>
                   </div>
                   {/* Card 3: Packaging */}
                   <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                            <Package size={16} /> 包裝地點
                         </div>
                         <CheckCircle2 size={16} className="text-green-500" />
                      </div>
                      <p className="font-bold text-gray-900 mb-1">{formData.factoryLocation || "Unknown"}</p>
                      <div className="mt-3">
                         <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 flex w-fit gap-1 items-center">
                            <ImageIcon size={10} /> 實體照片
                         </span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Ingredients & Nutrition Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Ingredients List */}
                 <div>
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="text-lg font-bold text-gray-900">成份清單</h3>
                       <button onClick={() => setCurrentStep(3)} className="text-sm font-medium text-blue-600 hover:text-blue-700">編輯</button>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed border border-gray-100">
                       {formData.ingredientText || "No ingredients provided."}
                    </div>
                    <div className="mt-4 flex gap-2">
                       <span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100 flex items-center gap-1"><Check size={12}/> 無穀</span>
                       <span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100 flex items-center gap-1"><Check size={12}/> 單一肉源</span>
                    </div>
                 </div>

                 {/* Nutrition Table */}
                 <div>
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="text-lg font-bold text-gray-900">營養保證值</h3>
                       <button onClick={() => setCurrentStep(3)} className="text-sm font-medium text-blue-600 hover:text-blue-700">編輯</button>
                    </div>
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                       <table className="w-full text-sm">
                          <tbody className="divide-y divide-gray-100">
                             <tr className="bg-gray-50/50">
                                <td className="px-4 py-3 text-gray-600 font-medium">項目</td>
                                <td className="px-4 py-3 text-gray-900 font-bold text-right">數值</td>
                             </tr>
                             <tr>
                                <td className="px-4 py-3 text-gray-600">粗蛋白</td>
                                <td className="px-4 py-3 text-gray-900 font-bold text-right">{formData.nutrition?.protein || "-"}% min</td>
                             </tr>
                             <tr>
                                <td className="px-4 py-3 text-gray-600">粗脂肪</td>
                                <td className="px-4 py-3 text-gray-900 font-bold text-right">{formData.nutrition?.fat || "-"}% min</td>
                             </tr>
                             <tr>
                                <td className="px-4 py-3 text-gray-600">水分</td>
                                <td className="px-4 py-3 text-gray-900 font-bold text-right">{formData.nutrition?.moisture || "-"}% max</td>
                             </tr>
                             <tr className="bg-gray-50/50">
                                <td colSpan={2} className="px-4 py-2 text-xs text-gray-500 flex items-center gap-1">
                                   <CheckCircle2 size={12} className="text-green-500" />
                                   佐證：SGS_Report_2023.pdf
                                </td>
                             </tr>
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
            </div>

            {/* Right Column: Score & Status */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
               <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                     數據完整度
                  </h3>
                  
                  {/* Score Circle (Mock) */}
                  <div className="relative w-32 h-32 mx-auto mb-8">
                     <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#10B981" strokeWidth="8" strokeDasharray="283" strokeDashoffset="28" strokeLinecap="round" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900">90%</span>
                        <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full mt-1">極佳</span>
                     </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-4">
                     <div className="flex gap-3">
                        <div className="mt-0.5 text-green-500"><CheckCircle2 size={18} /></div>
                        <div>
                           <p className="text-sm font-bold text-gray-900">基本資料完整</p>
                           <p className="text-xs text-gray-500">必填欄位與商品圖片皆已設定。</p>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <div className="mt-0.5 text-green-500"><CheckCircle2 size={18} /></div>
                        <div>
                           <p className="text-sm font-bold text-gray-900">供應鏈佐證 (3/3)</p>
                           <p className="text-xs text-gray-500">原料、製造、包裝皆已上傳證明。</p>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <div className="mt-0.5 text-green-500"><CheckCircle2 size={18} /></div>
                        <div>
                           <p className="text-sm font-bold text-gray-900">營養分析報告</p>
                           <p className="text-xs text-gray-500">已連結第三方實驗室報告。</p>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <div className="mt-0.5 text-orange-500"><AlertTriangle size={18} /></div>
                        <div>
                           <p className="text-sm font-bold text-gray-900">建議：商品影片</p>
                           <p className="text-xs text-gray-500">缺少商品影片，建議補充以提升信任度。</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Publish Info */}
               <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900">
                  <div className="flex items-center gap-2 font-bold mb-2">
                     <Info size={16} />
                     發布說明
                  </div>
                  <p className="text-blue-700/80 text-xs leading-relaxed">
                     資料發布後將即時同步至消費者端網站。如需修改，請至「產品列表」進行編輯。
                  </p>
               </div>
            </div>
          </div>
        )}
        
        <div className="mb-6"></div>
      </Card>

      {/* Footer Actions */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          className="h-11 px-8 text-gray-600 border-gray-300 hover:bg-gray-50"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          {currentStep === 1 ? '取消返回' : '上一步'}
        </Button>
        
        <div className="flex gap-4">
          <Button variant="outline" className="h-11 px-6 text-blue-600 border-blue-200 hover:bg-blue-50">
            暫存草稿
          </Button>
          <Button 
            className={`h-11 px-8 shadow-md transition-colors ${
              currentStep === STEPS.length 
                ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
            }`}
            onClick={handleNext}
          >
            {currentStep === STEPS.length ? (
              <span className="flex items-center gap-2">
                <Upload size={16} /> 發布產品
              </span>
            ) : (
              <>
                下一步
                <ChevronRight size={16} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tip Box */}
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <div className="shrink-0 mt-0.5">
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        </div>
        <div className="text-sm text-blue-900">
          <p className="font-bold mb-1">小技巧</p>
          <p className="text-blue-700/80">
            產品與品牌名稱需以英文輸入，以便系統與國際資料庫進行比對驗證。若產品僅有中文包裝，請使用羅馬拼音或官方譯名。
          </p>
        </div>
      </div>
    </div>
  );
}
