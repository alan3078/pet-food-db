import Link from "next/link";
import { ArrowRight, FileText, CheckCircle2, MessageCircle, FileCheck } from "lucide-react";

export function LatestSection() {
  const latestUpdates = [
    {
      id: 1,
      brand: "Nutri-Plus",
      action: "上傳了 SGS 重金屬檢測報告",
      time: "10 分鐘前",
      status: "pending",
      statusLabel: "待審核",
      icon: FileText,
      iconColor: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      id: 2,
      brand: "Farm To Table",
      action: "更新了雞肉供應商許可證",
      time: "1 小時前",
      status: "verified",
      statusLabel: "已核實",
      icon: CheckCircle2,
      iconColor: "text-green-500",
      bg: "bg-green-50",
    },
    {
      id: 3,
      brand: "Mimi's Kitchen",
      action: "回覆了關於產地來源的詢問",
      time: "3 小時前",
      status: "processing",
      statusLabel: "處理中",
      icon: MessageCircle,
      iconColor: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      id: 4,
      brand: "Healthy Paws",
      action: "新增 3 份營養成分檢驗報告",
      time: "5 小時前",
      status: "verified",
      statusLabel: "已核實",
      icon: FileCheck,
      iconColor: "text-green-500",
      bg: "bg-green-50",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-orange-100 text-orange-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between p-6 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-blue-500">
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
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
          </span>
          <h2 className="text-xl font-bold">最近更新文件</h2>
        </div>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">
          LIVE FEED
        </span>
      </div>

      <div className="p-6 pt-2">
        <div className="grid grid-cols-[100px_1fr_80px] gap-4 border-b py-2 text-sm text-muted-foreground">
          <div>更新時間</div>
          <div>品牌/項目</div>
          <div className="text-right">驗證狀態</div>
        </div>

        <div className="divide-y">
          {latestUpdates.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[100px_1fr_80px] items-center gap-4 py-4"
            >
              <div className="text-sm text-slate-500">{item.time}</div>
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.bg}`}>
                  <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-500 hover:underline cursor-pointer">
                    {item.brand}
                  </h3>
                  <p className="text-sm text-slate-500">{item.action}</p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusStyle(
                    item.status
                  )}`}
                >
                  {item.statusLabel}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/products?sort=date-newest"
            className="inline-flex items-center text-sm font-medium text-blue-500 hover:text-blue-600"
          >
            瀏覽所有歷史更新 <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
