"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteBrand } from "@/services/brands";

interface BrandActionsProps {
  brandId: number;
}

export function BrandActions({ brandId }: BrandActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("確定要刪除此品牌嗎？此操作無法復原。")) return;
    
    setIsDeleting(true);
    try {
      await deleteBrand(brandId);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete brand:", error);
      alert("刪除失敗");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(brandId.toString())}
        >
          複製 ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Link href={`/admin/brands/${brandId}`}>
          <DropdownMenuItem>
            <Pencil className="mr-2 h-4 w-4" />
            編輯
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem 
            onClick={handleDelete} 
            className="text-red-600 focus:text-red-600"
            disabled={isDeleting}
        >
          {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
          刪除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
