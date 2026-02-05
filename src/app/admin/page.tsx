import { 
  Users, 
  Package, 
  ShoppingBag, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">儀表板</h1>
        <p className="text-gray-500">歡迎回到管理系統，這裡是您的今日概覽。</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總產品數</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">58</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                +4.2% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              較上月
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總瀏覽量</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                +19% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              較上月
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待審核文件</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 inline-flex items-center">
                +2 <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              自昨天
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">資料完整度</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                +1.2% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              較上月
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity or Quick Actions could go here */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>近期活動</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {/* Mock activity items */}
               <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">更新了 &quot;頂級牛肝塊&quot; 的成分表</p>
                    <p className="text-sm text-muted-foreground">2 小時前 • 系統管理員</p>
                  </div>
               </div>
               <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">新增產品 &quot;有機雞肉條&quot;</p>
                    <p className="text-sm text-muted-foreground">5 小時前 • 系統管理員</p>
                  </div>
               </div>
               <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">收到新的檢驗報告</p>
                    <p className="text-sm text-muted-foreground">1 天前 • 外部提交</p>
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>系統狀態</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">API 狀態</span>
                 <span className="text-green-600 font-medium">正常運作</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">資料庫延遲</span>
                 <span className="text-gray-900 font-medium">24ms</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">最後備份</span>
                 <span className="text-gray-900 font-medium">今日 03:00</span>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
