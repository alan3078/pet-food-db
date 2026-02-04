import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { BarcodeIllustration } from "./barcode-illustration";

type BarcodeType = "ean-13" | "upc-a" | "datamatrix" | "itf-14";

interface BarcodeCardProps {
  type: BarcodeType;
  title: string;
  icon: LucideIcon;
  iconColor: string; // e.g., "text-blue-500"
  tag: string;
  description: string;
  points: string[];
  children?: React.ReactNode;
}

export function BarcodeCard({
  type,
  title,
  icon: Icon,
  iconColor,
  tag,
  description,
  points,
  children,
}: BarcodeCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-md bg-opacity-10 ${iconColor.replace('text-', 'bg-')}`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          </div>
          <Badge variant="secondary" className="text-xs font-normal text-gray-500 bg-gray-100 hover:bg-gray-100">
            {tag}
          </Badge>
        </div>

        {/* Illustration */}
        <BarcodeIllustration type={type} />

        {/* Content */}
        <div className="space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
          <ul className="space-y-2">
            {points.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${iconColor.replace('text-', 'bg-')}`} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Custom Children (e.g., Decoder Tool) */}
        {children && (
          <div className="pt-4 border-t border-gray-100">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
