import React from 'react';
import { useStore } from '../context/StoreContext';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
}) => {
  const { settings } = useStore();

  const iconDimensions = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  }[size];

  const titleSizes = {
    sm: 'text-base font-bold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-extrabold',
  }[size];

  if (settings.logoUrl) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img
          src={settings.logoUrl}
          alt="Hasnain Gadget Store Logo"
          className="h-9 w-auto object-contain"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="flex flex-col">
          <span className={`${titleSizes} font-display tracking-tight text-slate-900 uppercase`}>
            HASNAIN <span className="text-emerald-600">GADGETS</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official Hasnain Gadget Store Emblem in Fresh Green */}
      <div
        className={`relative ${iconDimensions} rounded-lg bg-gradient-to-br from-emerald-600 to-green-700 border border-emerald-500/50 flex items-center justify-center shadow-[0_2px_10px_rgba(16,185,129,0.3)] shrink-0 overflow-hidden group`}
      >
        {/* Subtle geometric circuitry background */}
        <svg
          viewBox="0 0 40 40"
          className="absolute inset-0 w-full h-full opacity-35 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 10h12v8H8v12h20v-6h8" />
          <circle cx="8" cy="10" r="2" fill="currentColor" />
          <circle cx="36" cy="24" r="2" fill="currentColor" />
        </svg>

        {/* Monogram HGS with white & mint sheen */}
        <span className="relative font-display font-black tracking-tighter text-white">
          HGS
        </span>

        {/* Emerald corner highlight */}
        <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-200/90 rounded-bl-sm blur-[0.5px]" />
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`${titleSizes} font-display tracking-tight text-slate-900 uppercase`}>
            HASNAIN
          </span>
          <span className={`${titleSizes} font-display tracking-tight text-emerald-600 uppercase`}>
            GADGETS
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mt-0.5">
            Official Store • 12M Warranty
          </span>
        )}
      </div>
    </div>
  );
};
