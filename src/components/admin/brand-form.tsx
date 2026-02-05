"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronRight, Save, X, AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";
import { Brand, License } from "@/types";
import { useCreateBrand, useUpdateBrand } from "@/hooks/use-brands";
import { useCreateLicense, useDeleteLicense } from "@/hooks/use-licenses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/data/countries";

interface BrandFormProps {
  initialData?: Brand;
  initialLicenses?: License[];
  isEditMode?: boolean;
}

export function BrandForm({ initialData, initialLicenses = [], isEditMode = false }: BrandFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  // React Query Mutations
  const createBrandMutation = useCreateBrand();
  const updateBrandMutation = useUpdateBrand();
  const createLicenseMutation = useCreateLicense();
  const deleteLicenseMutation = useDeleteLicense();

  const isSubmitting = 
    createBrandMutation.isPending || 
    updateBrandMutation.isPending || 
    createLicenseMutation.isPending || 
    deleteLicenseMutation.isPending;

  const [formData, setFormData] = useState<Partial<Brand>>({
    name: initialData?.name || "",
    country_code: initialData?.country_code || "",
    parent_company: initialData?.parent_company || "",
  });

  // License state
  const [licenses, setLicenses] = useState<Partial<License>[]>(initialLicenses);
  const [newLicense, setNewLicense] = useState<Partial<License>>({
    prefix: "",
    source: "",
    source_date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, country_code: value }));
  };

  // License handlers
  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLicense((prev) => ({ ...prev, [name]: value }));
  };

  const addLicense = () => {
    if (!newLicense.prefix) return;
    if (licenses.some(l => l.prefix === newLicense.prefix)) {
      setError("此 GS1 前綴碼已存在於列表中");
      return;
    }
    setLicenses([...licenses, newLicense]);
    setNewLicense({
      prefix: "",
      source: "",
      source_date: new Date().toISOString().split('T')[0]
    });
    setError(null);
  };

  const removeLicense = (prefix: string) => {
    setLicenses(licenses.filter(l => l.prefix !== prefix));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      let brandId: number;

      if (isEditMode) {
        if (!initialData?.id) throw new Error("Brand ID is required for editing");
        brandId = initialData.id;
        await updateBrandMutation.mutateAsync({
          id: brandId,
          data: {
            name: formData.name,
            country_code: formData.country_code,
            parent_company: formData.parent_company,
          }
        });
      } else {
        if (!formData.name || !formData.country_code) {
            throw new Error("請填寫所有必填欄位");
        }
        const newBrand = await createBrandMutation.mutateAsync({
          name: formData.name,
          country_code: formData.country_code,
          parent_company: formData.parent_company,
        });
        brandId = newBrand.id;
      }

      // Handle Licenses
      // For edit mode, we calculate diffs. For create mode, all are new.
      const currentPrefixes = licenses.map(l => l.prefix);
      const initialPrefixes = initialLicenses.map(l => l.prefix);

      // Licenses to add (in current state but not in initial)
      const toAdd = licenses.filter(l => l.prefix && !initialPrefixes.includes(l.prefix));
      
      // Licenses to delete (in initial but not in current)
      // Only applicable in Edit mode
      const toDelete = initialLicenses.filter(l => !currentPrefixes.includes(l.prefix));

      await Promise.all([
        ...toAdd.map(l => createLicenseMutation.mutateAsync({
          prefix: l.prefix!,
          brand_id: brandId,
          source: l.source || "",
          source_date: l.source_date || new Date().toISOString().split('T')[0]
        })),
        ...toDelete.map(l => deleteLicenseMutation.mutateAsync(l.prefix!))
      ]);

      router.push("/admin/brands");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("發生錯誤，請稍後再試");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/brands" className="hover:text-blue-600">品牌資料</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">{isEditMode ? "編輯品牌" : "新增品牌"}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{isEditMode ? "編輯品牌資料" : "新增品牌資料"}</h1>
        <p className="text-gray-500">{isEditMode ? "修改品牌基本資料與授權資訊" : "請輸入品牌的基本資料與授權資訊。"}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>基本資訊</CardTitle>
            <CardDescription>品牌的核心識別資料</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">品牌名稱 (Name) <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="例如: Orijen"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country_code">註冊國家 (Country) <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.country_code}
                  onValueChange={handleCountryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇國家" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent_company">母公司 (Parent Company)</Label>
                <Input
                  id="parent_company"
                  name="parent_company"
                  placeholder="例如: Mars, Inc."
                  value={formData.parent_company || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>GS1 授權資訊 (Licenses)</CardTitle>
            <CardDescription>管理品牌的 GS1 公司前綴碼 (GCP)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add New License */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-3">新增授權</h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4 space-y-1.5">
                  <Label htmlFor="prefix" className="text-xs">GS1 前綴碼 (Prefix)</Label>
                  <Input
                    id="prefix"
                    name="prefix"
                    placeholder="例如: 8859387"
                    value={newLicense.prefix}
                    onChange={handleLicenseChange}
                  />
                </div>
                <div className="md:col-span-4 space-y-1.5">
                  <Label htmlFor="source" className="text-xs">來源 (Source)</Label>
                  <Input
                    id="source"
                    name="source"
                    placeholder="例如: GS1 TW"
                    value={newLicense.source}
                    onChange={handleLicenseChange}
                  />
                </div>
                <div className="md:col-span-3 space-y-1.5">
                  <Label htmlFor="source_date" className="text-xs">日期 (Date)</Label>
                  <Input
                    id="source_date"
                    name="source_date"
                    type="date"
                    value={newLicense.source_date}
                    onChange={handleLicenseChange}
                  />
                </div>
                <div className="md:col-span-1">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="w-full bg-white hover:bg-gray-100 border border-gray-200"
                    onClick={addLicense}
                    disabled={!newLicense.prefix}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* License List */}
            {licenses.length > 0 ? (
              <div className="border rounded-md divide-y">
                {licenses.map((license, index) => (
                  <div key={license.prefix || index} className="flex items-center justify-between p-3 hover:bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                      <div>
                        <span className="text-xs text-gray-500 block">前綴碼</span>
                        <span className="font-mono font-medium">{license.prefix}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block">來源</span>
                        <span className="text-sm">{license.source || "-"}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block">日期</span>
                        <span className="text-sm font-mono">{license.source_date}</span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                      onClick={() => removeLicense(license.prefix!)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                <p>尚無授權資料</p>
                <p className="text-sm text-gray-400">請在上方輸入並新增 GS1 前綴碼</p>
              </div>
            )}
          </CardContent>
        </Card>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-4 pt-4 border-t">
          <Link href="/admin/brands">
            <Button variant="outline" type="button">取消</Button>
          </Link>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[120px]" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                儲存中...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                儲存變更
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
