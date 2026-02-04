import React from "react";
import { cn } from "@/lib/utils";

type BarcodeType = "ean-13" | "upc-a" | "datamatrix" | "itf-14";

interface BarcodeIllustrationProps {
  type: BarcodeType;
  className?: string;
}

export function BarcodeIllustration({ type, className }: BarcodeIllustrationProps) {
  const containerClass = cn(
    "w-full aspect-[2/1] bg-gray-50 flex items-center justify-center rounded-md overflow-hidden",
    className
  );

  switch (type) {
    case "ean-13":
      return (
        <div className={containerClass}>
          <div className="flex flex-col items-center">
            {/* EAN-13 SVG */}
            <svg width="200" height="100" viewBox="0 0 200 100" className="w-48 h-24">
              <rect x="10" y="10" width="2" height="60" fill="#333" />
              <rect x="14" y="10" width="2" height="60" fill="#333" />
              {/* Left group */}
              <rect x="20" y="10" width="4" height="50" fill="#333" />
              <rect x="26" y="10" width="2" height="50" fill="#333" />
              <rect x="30" y="10" width="2" height="50" fill="#333" />
              <rect x="36" y="10" width="6" height="50" fill="#333" />
              <rect x="44" y="10" width="4" height="50" fill="#333" />
              <rect x="50" y="10" width="2" height="50" fill="#333" />
              {/* Center guard */}
              <rect x="96" y="10" width="2" height="60" fill="#333" />
              <rect x="100" y="10" width="2" height="60" fill="#333" />
              {/* Right group */}
              <rect x="106" y="10" width="2" height="50" fill="#333" />
              <rect x="110" y="10" width="4" height="50" fill="#333" />
              <rect x="118" y="10" width="6" height="50" fill="#333" />
              <rect x="126" y="10" width="2" height="50" fill="#333" />
              <rect x="130" y="10" width="4" height="50" fill="#333" />
              <rect x="136" y="10" width="2" height="50" fill="#333" />
              {/* End guard */}
              <rect x="184" y="10" width="2" height="60" fill="#333" />
              <rect x="188" y="10" width="2" height="60" fill="#333" />
              
              <text x="5" y="85" fontSize="10" fontFamily="monospace" fill="#333">4</text>
              <text x="35" y="85" fontSize="10" fontFamily="monospace" fill="#333">901234</text>
              <text x="125" y="85" fontSize="10" fontFamily="monospace" fill="#333">567890</text>
            </svg>
          </div>
        </div>
      );
    case "upc-a":
      return (
        <div className={containerClass}>
           <div className="flex flex-col items-center">
            {/* UPC-A SVG */}
            <svg width="200" height="100" viewBox="0 0 200 100" className="w-48 h-24">
              <rect x="20" y="10" width="2" height="65" fill="#333" />
              <rect x="24" y="10" width="2" height="65" fill="#333" />
              
              {/* Bars */}
              <rect x="30" y="10" width="4" height="55" fill="#333" />
              <rect x="36" y="10" width="2" height="55" fill="#333" />
              <rect x="40" y="10" width="2" height="55" fill="#333" />
              <rect x="46" y="10" width="6" height="55" fill="#333" />
              <rect x="54" y="10" width="4" height="55" fill="#333" />
              <rect x="60" y="10" width="2" height="55" fill="#333" />
              
              {/* Center */}
              <rect x="96" y="10" width="2" height="65" fill="#333" />
              <rect x="100" y="10" width="2" height="65" fill="#333" />
              
              {/* Right Bars */}
              <rect x="106" y="10" width="2" height="55" fill="#333" />
              <rect x="110" y="10" width="4" height="55" fill="#333" />
              <rect x="118" y="10" width="6" height="55" fill="#333" />
              <rect x="126" y="10" width="2" height="55" fill="#333" />
              
               <rect x="174" y="10" width="2" height="65" fill="#333" />
              <rect x="178" y="10" width="2" height="65" fill="#333" />

              <text x="10" y="85" fontSize="10" fontFamily="monospace" fill="#333">0</text>
              <text x="45" y="85" fontSize="10" fontFamily="monospace" fill="#333">12345</text>
              <text x="115" y="85" fontSize="10" fontFamily="monospace" fill="#333">67890</text>
               <text x="185" y="85" fontSize="10" fontFamily="monospace" fill="#333">5</text>
            </svg>
          </div>
        </div>
      );
    case "datamatrix":
      return (
        <div className={containerClass}>
           <div className="flex items-center gap-4">
             {/* DataMatrix SVG */}
             <svg width="80" height="80" viewBox="0 0 80 80" className="w-20 h-20">
               {/* L-pattern finder pattern */}
               <rect x="10" y="10" width="2" height="60" fill="#333" />
               <rect x="10" y="68" width="60" height="2" fill="#333" />
               {/* Top and Right dashed finder */}
               <path d="M12 10 H14 M16 10 H18 M20 10 H22 M24 10 H26 M28 10 H30 M32 10 H34 M36 10 H38 M40 10 H42 M44 10 H46 M48 10 H50 M52 10 H54 M56 10 H58 M60 10 H62 M64 10 H66 M68 10 H70" stroke="#333" strokeWidth="2" />
               <path d="M70 12 V14 M70 16 V18 M70 20 V22 M70 24 V26 M70 28 V30 M70 32 V34 M70 36 V38 M70 40 V42 M70 44 V46 M70 48 V50 M70 52 V54 M70 56 V58 M70 60 V62 M70 64 V66 M70 68 V70" stroke="#333" strokeWidth="2" />
               
               {/* Random matrix data */}
               <rect x="16" y="16" width="4" height="4" fill="#333" />
               <rect x="24" y="16" width="4" height="4" fill="#333" />
               <rect x="32" y="16" width="4" height="4" fill="#333" />
               <rect x="20" y="24" width="4" height="4" fill="#333" />
               <rect x="28" y="24" width="4" height="4" fill="#333" />
               <rect x="36" y="24" width="4" height="4" fill="#333" />
               <rect x="44" y="24" width="4" height="4" fill="#333" />
               <rect x="16" y="32" width="4" height="4" fill="#333" />
               <rect x="40" y="32" width="4" height="4" fill="#333" />
               <rect x="56" y="32" width="4" height="4" fill="#333" />
               <rect x="24" y="40" width="4" height="4" fill="#333" />
               <rect x="48" y="40" width="4" height="4" fill="#333" />
               <rect x="32" y="48" width="4" height="4" fill="#333" />
               <rect x="56" y="48" width="4" height="4" fill="#333" />
               <rect x="64" y="48" width="4" height="4" fill="#333" />
               <rect x="20" y="56" width="4" height="4" fill="#333" />
               <rect x="44" y="56" width="4" height="4" fill="#333" />
               <rect x="60" y="56" width="4" height="4" fill="#333" />
               <rect x="36" y="64" width="4" height="4" fill="#333" />
             </svg>
             <div className="flex flex-col gap-1 text-[8px] font-mono text-gray-500">
               <span className="text-green-600 font-bold">LOT: A1B2C3</span>
               <span>EXP: 2025/12</span>
               <span>SN: 987654321</span>
             </div>
           </div>
        </div>
      );
    case "itf-14":
      return (
        <div className={containerClass}>
           <div className="flex flex-col items-center">
            {/* ITF-14 SVG */}
            <svg width="220" height="100" viewBox="0 0 220 100" className="w-52 h-24">
              {/* Bearer Bar Frame */}
              <rect x="10" y="10" width="200" height="60" fill="none" stroke="#333" strokeWidth="4" />
              
              {/* Bars inside */}
              <g transform="translate(20, 20)">
                <rect x="0" y="0" width="2" height="40" fill="#333" />
                <rect x="4" y="0" width="2" height="40" fill="#333" />
                <rect x="10" y="0" width="6" height="40" fill="#333" />
                <rect x="18" y="0" width="2" height="40" fill="#333" />
                <rect x="22" y="0" width="4" height="40" fill="#333" />
                <rect x="28" y="0" width="2" height="40" fill="#333" />
                <rect x="34" y="0" width="2" height="40" fill="#333" />
                <rect x="38" y="0" width="6" height="40" fill="#333" />
                <rect x="48" y="0" width="2" height="40" fill="#333" />
                <rect x="52" y="0" width="4" height="40" fill="#333" />
                
                 {/* Gap */}
                 
                <rect x="80" y="0" width="4" height="40" fill="#333" />
                <rect x="86" y="0" width="2" height="40" fill="#333" />
                <rect x="90" y="0" width="2" height="40" fill="#333" />
                <rect x="94" y="0" width="6" height="40" fill="#333" />
                <rect x="102" y="0" width="2" height="40" fill="#333" />
                <rect x="106" y="0" width="4" height="40" fill="#333" />
                <rect x="112" y="0" width="6" height="40" fill="#333" />
                <rect x="120" y="0" width="2" height="40" fill="#333" />
                <rect x="124" y="0" width="4" height="40" fill="#333" />
                <rect x="130" y="0" width="2" height="40" fill="#333" />
                 
                <rect x="176" y="0" width="2" height="40" fill="#333" />
                <rect x="179" y="0" width="2" height="40" fill="#333" />
              </g>

              <text x="35" y="85" fontSize="10" fontFamily="monospace" fill="#333">1 489 12345 6789 2</text>
            </svg>
          </div>
        </div>
      );
  }
}
