"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/product";
import { 
  Package, 
  CheckCircle2,
  HelpCircle,
  Eye,
  History,
  Download,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const getOriginDisplay = (location: string | null) => {
  if (!location || location.includes("Unknown") || location.includes("Claimed")) {
    return {
      className: "text-slate-700",
      icon: <HelpCircle className="mr-1.5 h-4 w-4 text-slate-400" />,
      badge: <Badge variant="secondary" className="mt-1.5 bg-slate-100 text-slate-500 hover:bg-slate-100 font-normal text-[10px] px-2 py-0.5 h-5">未驗證</Badge>
    };
  }
  return {
    className: "text-slate-900",
    icon: <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-500" />,
    badge: <Badge variant="secondary" className="mt-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-100 font-normal text-[10px] px-2 py-0.5 h-5">已驗證</Badge>
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  
  const ingredientOriginDisplay = getOriginDisplay(product.raw_material_origin);
  const productionOriginDisplay = getOriginDisplay(product.factory_location);
  
  // Map real evidence documents to timeline if available, otherwise empty array (removed mock data)
  const timelineItems = product.evidence_documents?.map(doc => ({
    id: doc.id,
    title: doc.file_name || "Document",
    date: doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : "",
    action: "下載",
    icon: <Download className="h-3 w-3 mr-1" />
  })) || [];

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTimelineExpanded(!isTimelineExpanded);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md border-slate-200 bg-white group cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-0 flex flex-col md:flex-row">
        {/* Left Sidebar - Brand & Image - Slimmer */}
        <div className="w-full md:w-40 bg-slate-50/50 border-b md:border-b-0 md:border-r border-slate-100 p-4 flex flex-col items-center justify-center text-center shrink-0">
          <div className="h-20 w-20 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
            {product.thumbnail_url ? (
              <img 
                src={product.thumbnail_url} 
                alt={product.name_en} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="h-8 w-8 text-slate-300" />
            )}
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Brand</span>
            <h4 className="font-bold text-slate-700 text-sm">{product.brand?.name || "Unknown"}</h4>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-5 flex flex-col">
          {/* Header Section - Compact */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-5">
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {product.name_en}
              </h3>
              {(product.specification || product.version_label) && (
                <div className="flex gap-2">
                  {product.specification && (
                    <Badge variant="outline" className="text-xs font-normal text-slate-500">
                      {product.specification}
                    </Badge>
                  )}
                  {product.version_label && (
                    <Badge variant="outline" className="text-xs font-normal text-slate-500">
                      {product.version_label}
                    </Badge>
                  )}
                </div>
              )}
              <p className="text-slate-500 text-sm line-clamp-2">
                {product.origin_verbatim_text || "No description available."}
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
               <Badge variant="outline" className="bg-blue-50/50 text-blue-700 border-blue-100 px-3 py-1 rounded-full flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                  <span className="text-xs font-bold">{product.evidence_count || 0} </span>
               </Badge>
            </div>
          </div>

          {/* Origins Grid - Slim & Clean */}
          <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-slate-100 bg-slate-50/30 -mx-5 px-5">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">原料產地</span>
              <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                  {product.raw_material_origin || "Unknown"}
                </div>
                {ingredientOriginDisplay.badge}
              </div>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">生產地</span>
              <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                  {product.factory_location || "Unknown"}
                </div>
                {productionOriginDisplay.badge}
              </div>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">類別</span>
              <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                  {product.category || "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Footer / Collapsible Timeline */}
          <div className="mt-auto pt-4">
             <div 
               className="flex items-center justify-between cursor-pointer select-none group/timeline"
               onClick={handleTimelineClick}
             >
                <div className="flex items-center gap-2 text-slate-500 group-hover/timeline:text-slate-800 transition-colors">
                  <History className="h-4 w-4" />
                  <span className="text-xs font-bold">文件時間軸 ({timelineItems.length})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400">上次更新: {product.updated_at ? new Date(product.updated_at).toLocaleDateString() : "-"}</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full hover:bg-slate-100">
                    {isTimelineExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
             </div>

             {/* Expandable Timeline Content */}
             <div 
               className={cn(
                 "grid transition-[grid-template-rows] duration-300 ease-out cursor-default",
                 isTimelineExpanded ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"
               )}
               onClick={(e) => e.stopPropagation()}
             >
               <div className="overflow-hidden">
                 <div className="relative pb-2">
                    {/* Vertical connecting line */}
                    <div className="absolute left-[13.5px] top-2 bottom-0 w-px bg-slate-200" />
                    
                    {timelineItems.length > 0 ? timelineItems.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="relative flex gap-4 mb-6 last:mb-0 group/item">
                        {/* Timeline Dot */}
                        <div className="relative z-10 flex-none w-7 flex justify-center pt-1.5">
                           <div className="h-2.5 w-2.5 rounded-full bg-white border-[2.5px] border-emerald-500 shadow-sm group-hover/item:scale-110 transition-transform" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 pt-0.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h5 className="text-sm font-bold text-slate-700">{item.title}</h5>
                            <span className="text-[10px] text-slate-400 font-medium tabular-nums">{item.date}</span>
                          </div>
                          
                          {item.action && (
                            <Button 
                              variant="link" 
                              className="h-auto p-0 mt-1.5 text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center gap-1.5"
                              onClick={handleActionClick}
                            >
                              {item.icon}
                              {item.action}
                            </Button>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="text-center text-slate-400 text-xs py-2">
                        暫無文件文件
                      </div>
                    )}
                 </div>
                 
                 <div className="mt-2 pt-3 border-t border-slate-100 flex justify-center">
                    <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-blue-600 h-7" onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/products/${product.id}`);
                    }}>
                      查看完整履歷
                    </Button>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
