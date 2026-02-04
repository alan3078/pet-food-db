import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"; // I need to check if table component exists, otherwise use div
import { 
  Download, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  History,
  TrendingUp,
  FileWarning
} from "lucide-react";
import Link from "next/link";
import { mockProducts } from "@/data/products";
import { Product } from "@/types/product";

// Helper to determine status based on evidence count (mock logic)
const getStatus = (count: number) => {
  if (count >= 15) return { label: "資料完整", color: "bg-green-100 text-green-700", icon: CheckCircle2 };
  if (count >= 8) return { label: "缺少成分表", color: "bg-yellow-100 text-yellow-700", icon: AlertTriangle };
  return { label: "缺少檢驗報告", color: "bg-red-100 text-red-700", icon: AlertCircle };
};

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">產品管理列表</h1>
          <p className="text-gray-500">管理產品目錄並追蹤數據完整性與證據來源</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            匯出數據
          </Button>
          <Link href="/admin/products/create">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus size={16} />
              新增產品
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Filter size={16} />
          <span>快速篩選:</span>
        </div>
        
        <select className="bg-blue-50 border-none text-blue-700 text-sm font-medium py-1.5 px-3 rounded-md outline-none">
          <option>所有產品</option>
        </select>

        <select className="bg-gray-50 border-none text-gray-700 text-sm font-medium py-1.5 px-3 rounded-md outline-none">
          <option>品牌: 所有品牌</option>
        </select>

        <select className="bg-gray-50 border-none text-gray-700 text-sm font-medium py-1.5 px-3 rounded-md outline-none">
          <option>分類: 貓犬零食</option>
        </select>

         <select className="bg-gray-50 border-none text-gray-700 text-sm font-medium py-1.5 px-3 rounded-md outline-none">
          <option>證據數量: 10份以上</option>
        </select>

        <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-md text-sm cursor-pointer">
          <span className="font-medium">狀態: 資料不完整</span>
          <button className="hover:text-orange-900">×</button>
        </div>

        <button className="ml-auto text-gray-400 text-sm hover:text-gray-600">
          清除所有篩選
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">縮圖</th>
                <th className="px-6 py-4 font-medium">產品名稱</th>
                <th className="px-6 py-4 font-medium">品牌</th>
                <th className="px-6 py-4 font-medium">證據數量</th>
                <th className="px-6 py-4 font-medium">資料完整性</th>
                <th className="px-6 py-4 font-medium">最後更新</th>
                <th className="px-6 py-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockProducts.map((product) => {
                const status = getStatus(product.evidenceCount);
                const StatusIcon = status.icon;
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                         {/* Placeholder image */}
                         <span className="text-2xl">🥩</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{product.name} (EN)</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.brand}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {product.evidenceCount} 份證據
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon size={14} />
                        {status.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {product.lastVerifiedDate}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          預覽
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700">
                          編輯
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex items-center justify-between text-sm text-gray-500">
          <div>
            顯示 1 到 {mockProducts.length} 項，共 58 項產品
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="default" size="icon" className="h-8 w-8 bg-blue-600 hover:bg-blue-700">
              1
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 text-gray-600">
              2
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 text-gray-600">
              3
            </Button>
            <span className="flex items-center px-2">...</span>
            <Button variant="outline" size="icon" className="h-8 w-8 text-gray-600">
              12
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 text-gray-600">
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-start gap-4">
          <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
            <FileWarning size={24} />
          </div>
          <div>
            <h3 className="font-bold text-yellow-900">資料缺失警示</h3>
            <p className="text-sm text-yellow-700 mt-1">目前有 12 項產品缺少成分分析表，建議優先補齊。</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="font-bold text-blue-900">近期資料累積趨勢</h3>
            <p className="text-sm text-blue-700 mt-1">本月平均每項產品證據提升了 4.2%，資料庫品質持續最佳化。</p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-4">
          <div className="p-2 bg-gray-200 rounded-lg text-gray-600">
            <History size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">系統最後備份</h3>
            <p className="text-sm text-gray-600 mt-1">備份完成時間：2023-10-24 03:00 AM (自動排程)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
