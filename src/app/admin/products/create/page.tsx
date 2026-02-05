"use client";

import { useState, useRef, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Check, ChevronRight, Info, Map, Apple, CheckCircle2, Search, Upload, FileText, X, Sparkles, Link as LinkIcon, Unlink, Plus, Trash2, Image as ImageIcon, Settings, AlertTriangle, FileUp, Package, ScanBarcode, Store } from "lucide-react";
import { BarcodeCard } from "@/components/wiki/barcode-card";
import { BarcodeSearchInput } from "@/components/admin/barcode-search-input";
import { Product as OpenFoodFactsProduct } from "@/services/open-pet-food-facts/response.dto";
import { useBrands } from "@/hooks/use-brands";
import { useCreateProduct } from "@/hooks/use-products";
import { uploadProductEvidence } from "@/services/storage";

interface EvidenceFile {
  id: string;
  file?: File;
  name: string;
  path?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
}

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
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { data: brands = [] } = useBrands();
  const createProductMutation = useCreateProduct();

  const [formData, setFormData] = useState({
    barcode: "",
    name: "",
    brandId: "",
    category: "",
    specification: "",
    versionLabel: "",
    originText: "",
    countryCode: "",
    factoryName: "",
    factoryLocation: "",
    ingredientSource: "",
    evidenceFiles: [] as EvidenceFile[], 
    ingredientText: "",
    nutrition: {
      protein: "",
      fat: "",
      fiber: "",
      moisture: ""
    }
  });

  const handleProductSelect = (product: OpenFoodFactsProduct) => {
    // Try to find matching brand
    const matchingBrand = brands.find(b => 
      b.name.toLowerCase() === product.brands?.toLowerCase()
    );

    setFormData(prev => ({
      ...prev,
      name: product.product_name || prev.name,
      brandId: matchingBrand?.id?.toString() || prev.brandId,
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
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!formData.barcode || !formData.name || !formData.brandId) {
      alert("請填寫必填欄位 (Barcode, Name, Brand)");
      return;
    }

    createProductMutation.mutate({
      barcode: formData.barcode,
      name_en: formData.name,
      brand_id: parseInt(formData.brandId),
      category: formData.category || null,
      specification: formData.specification || null,
      version_label: formData.versionLabel || null,
      origin_verbatim_text: formData.originText || null,
      standard_country_code: formData.countryCode || null,
      factory_name: formData.factoryName || null,
      factory_location: formData.factoryLocation || null,
      raw_material_origin: formData.ingredientSource || null,
      ingredients_text: formData.ingredientText || null,
      crude_protein_min: formData.nutrition.protein ? parseFloat(formData.nutrition.protein) : null,
      crude_fat_min: formData.nutrition.fat ? parseFloat(formData.nutrition.fat) : null,
      crude_fiber_max: formData.nutrition.fiber ? parseFloat(formData.nutrition.fiber) : null,
      moisture_max: formData.nutrition.moisture ? parseFloat(formData.nutrition.moisture) : null,
      // Map evidence files to EvidenceDocument objects
      evidence: formData.evidenceFiles
        .filter(f => f.status === 'success' && f.path)
        .map(file => ({
          file_name: file.name,
          file_path: file.path!,
          doc_type: "document"
        }))
    }, {
      onSuccess: () => {
        // alert("產品建立成功！");
        router.push("/admin/products");
      },
      onError: (error) => {
        console.error(error);
        alert("建立失敗：" + error.message);
      }
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addEvidenceFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!formData.barcode) {
        alert("請先輸入產品條碼 (Barcode)");
        e.target.value = "";
        return;
      }

      const newFile: EvidenceFile = {
        id: Math.random().toString(36).substring(7),
        file,
        name: file.name,
        status: 'uploading'
      };

      setFormData(prev => ({
        ...prev,
        evidenceFiles: [...prev.evidenceFiles, newFile]
      }));

      // Start upload immediately
      try {
        const path = `products/${formData.barcode}/${file.name}`;
        const uploadedPath = await uploadProductEvidence(file, path);
        
        setFormData(prev => ({
          ...prev,
          evidenceFiles: prev.evidenceFiles.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'success', path: uploadedPath } 
              : f
          )
        }));
      } catch (error) {
        console.error("Upload failed:", error);
        setFormData(prev => ({
          ...prev,
          evidenceFiles: prev.evidenceFiles.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'error' } 
              : f
          )
        }));
        alert("上傳失敗");
      }

      // Reset input
      e.target.value = "";
    }
  };

  const removeEvidenceFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      evidenceFiles: prev.evidenceFiles.filter((_, i) => i !== index)
    }));
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
                    產品條碼 (Barcode) <span className="text-red-500">*</span>
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
                      規格 (Specification)
                    </label>
                    <Input 
                      placeholder="e.g. 50g, 100g" 
                      value={formData.specification}
                      onChange={(e) => setFormData({...formData, specification: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      版本標籤 (Version Label)
                    </label>
                    <Input 
                      placeholder="e.g. 2024 New Formula" 
                      value={formData.versionLabel}
                      onChange={(e) => setFormData({...formData, versionLabel: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      品牌名稱 <span className="text-red-500">*</span>
                    </label>
                    <Select 
                      value={formData.brandId} 
                      onValueChange={(val) => setFormData({...formData, brandId: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選擇品牌" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map(brand => (
                          <SelectItem key={brand.id} value={brand.id.toString()}>
                            {brand.name || "Unknown Brand"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      placeholder="搜尋國家, 如: US, CA"
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

              <div 
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={addEvidenceFile}
              >
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  <Upload size={24} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">點擊上傳文件</h3>
                <p className="text-xs text-gray-500 mb-4">支援 PDF, JPG, PNG 格式 (最大 5MB)</p>
                <Button variant="outline" size="sm" className="h-8">選擇文件</Button>
              </div>

              {/* Uploaded List */}
              <div className="space-y-3">
                {formData.evidenceFiles.map((file, index) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded flex items-center justify-center border border-gray-200 text-red-500">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{file.name}</p>
                        <p className="text-xs text-gray-400">
                          {file.status === 'uploading' ? 'Uploading...' : 
                           file.status === 'success' ? 'Uploaded' : 
                           file.status === 'error' ? 'Failed' : 'Pending'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeEvidenceFile(index)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
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
                    AI 智慧辨識 (Coming Soon)
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
                </div>
              </div>

              {/* Nutrition Analysis Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-l-4 border-blue-600 pl-3">
                  <h2 className="text-lg font-bold text-gray-900">營養成份保證值 (Guaranteed Analysis)</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500">粗蛋白 (Crude Protein)</label>
                    <div className="relative">
                      <Input 
                        placeholder="min" 
                        value={formData.nutrition?.protein || ""}
                        onChange={(e) => setFormData({
                          ...formData, 
                          nutrition: { ...formData.nutrition, protein: e.target.value }
                        })}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500">粗脂肪 (Crude Fat)</label>
                    <div className="relative">
                      <Input 
                        placeholder="min" 
                        value={formData.nutrition?.fat || ""}
                        onChange={(e) => setFormData({
                          ...formData, 
                          nutrition: { ...formData.nutrition, fat: e.target.value }
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
                          nutrition: { ...formData.nutrition, fiber: e.target.value }
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
                          nutrition: { ...formData.nutrition, moisture: e.target.value }
                        })}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Evidence Library */}
            <div className="w-full lg:w-80 shrink-0 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">佐證資料庫</h3>
              </div>
              
              <div className="space-y-3">
                {formData.evidenceFiles.length > 0 ? (
                  formData.evidenceFiles.map((file) => (
                    <div key={file.id} className="group relative border rounded-lg overflow-hidden bg-white shadow-sm">
                       <div className="p-2">
                        <p className="text-xs font-bold text-gray-900 truncate">{file.name}</p>
                        <p className="text-[10px] text-gray-400">
                          {file.status === 'success' ? 'Ready' : file.status}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">尚未上傳文件</p>
                )}
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
                       <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded">{formData.category || "Uncategorized"}</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">{formData.name || "Product Name"}</h4>
                    <p className="text-gray-500">
                      品牌：{brands.find(b => b.id.toString() === formData.brandId)?.name || formData.brandId}
                    </p>
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

              {/* Ingredients Summary */}
               <div>
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-bold text-gray-900">成份清單</h3>
                     <button onClick={() => setCurrentStep(3)} className="text-sm font-medium text-blue-600 hover:text-blue-700">編輯</button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed border border-gray-100">
                     {formData.ingredientText || "No ingredients provided."}
                  </div>
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
            disabled={createProductMutation.isPending}
          >
            {createProductMutation.isPending ? '提交中...' : (currentStep === STEPS.length ? '確認並提交' : '下一步')}
            {!createProductMutation.isPending && <ChevronRight size={16} className="ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
