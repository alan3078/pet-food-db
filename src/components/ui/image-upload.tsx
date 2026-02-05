"use client";

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: File | string | null;
  onChange: (file: File) => void;
  onRemove: () => void;
  className?: string;
  disabled?: boolean;
  accept?: string;
  description?: string;
}

export function ImageUpload({ 
  value, 
  onChange, 
  onRemove, 
  className, 
  disabled,
  accept = "image/*",
  description = "支援 JPG, PNG, WebP"
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle object URL generation and cleanup for File objects
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setObjectUrl(null);
    }
  }, [value]);

  const preview = typeof value === 'string' ? value : objectUrl;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Simple validation based on accept
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";
      
      if (accept === "image/*") {
        if (isImage) onChange(file);
      } else {
        // Relaxed check for custom accept
        if (isImage || isPdf) onChange(file);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onChange(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) {
        inputRef.current.value = "";
    }
    onRemove();
  };

  return (
    <div className={cn("w-full", className)}>
      {preview ? (
        <div className="relative w-full h-64 border rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center group">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-contain"
            />
            
            <div className="absolute top-2 right-2 flex gap-2 z-10">
                <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 shadow-sm"
                    onClick={handleRemove}
                    disabled={disabled}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
            
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={handleClick}>
                 <p className="text-white font-medium flex items-center gap-2">
                    <Upload className="h-4 w-4" /> 更換圖片
                 </p>
             </div>
             <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleFileChange}
                disabled={disabled}
            />
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors h-64",
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
             disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <ImageIcon className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            點擊或拖曳圖片至此
          </p>
          <p className="text-xs text-gray-500">
            {description}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
