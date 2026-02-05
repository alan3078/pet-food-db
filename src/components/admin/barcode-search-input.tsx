import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Check, ScanBarcode } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductByBarcode } from "@/services/open-pet-food-facts";
import { Product } from "@/services/open-pet-food-facts/response.dto";

interface BarcodeSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (product: Product) => void;
}

export function BarcodeSearchInput({ value, onChange, onSelect }: BarcodeSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [lastOpenBarcode, setLastOpenBarcode] = useState("");
  const { data, isLoading } = useProductByBarcode(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open dropdown when new data is available
  useEffect(() => {
    if (data?.product && data.code !== lastOpenBarcode) {
      setIsOpen(true);
      setLastOpenBarcode(data.code);
    }
  }, [data, lastOpenBarcode]);

  const handleSelect = () => {
    if (data?.product) {
      onSelect(data.product);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative flex-1" ref={wrapperRef}>
      <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <Input
        className="pl-9"
        placeholder="掃描或輸入條碼 (e.g. 471...)"
        value={value}
        onChange={(e) => {
            onChange(e.target.value);
        }}
      />
      {isLoading && (
         <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Skeleton className="h-4 w-4 rounded-full" />
         </div>
      )}
      
      {isOpen && data?.product && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
           <div 
             className="p-3 hover:bg-gray-50 cursor-pointer flex gap-3 items-center transition-colors"
             onClick={handleSelect}
           >
              <div className="w-12 h-12 relative bg-gray-100 rounded-md overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                 {data.product.image_front_small_url ? (
                    <img 
                      src={data.product.image_front_small_url} 
                      alt={data.product.product_name} 
                      className="w-full h-full object-contain"
                    />
                 ) : (
                    <ScanBarcode className="w-6 h-6 text-gray-400" />
                 )}
              </div>
              <div className="flex-1 min-w-0">
                 <h4 className="font-medium text-sm text-gray-900 truncate">
                   {data.product.product_name || "Unknown Product"}
                 </h4>
                 <p className="text-xs text-gray-500 truncate">
                   {data.product.brands || "Unknown Brand"}
                 </p>
              </div>
              <div className="shrink-0 text-blue-600 bg-blue-50 p-1.5 rounded-full">
                <Check size={14} />
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
