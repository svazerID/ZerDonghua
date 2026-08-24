import React from 'react';
import Image from 'next/image';

interface ZerDonghuaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showBadge?: boolean;
  className?: string;
}

export const ZerDonghuaLogo: React.FC<ZerDonghuaLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  showBadge = true,
  className = ''
}) => {
  const iconSizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const titleSizeMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const badgeSizeMap = {
    sm: 'text-[9px] px-1 py-0.2',
    md: 'text-[10px] px-1.5 py-0.5',
    lg: 'text-xs px-2 py-0.5',
    xl: 'text-xs px-2.5 py-1'
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* Logo mark */}
      <div
        className={`relative ${iconSizeMap[size]} rounded-2xl bg-gradient-to-br from-[#7c3aed] via-purple-600 to-[#a78bfa] p-[1.5px] shadow-[0_8px_30px_#0009] group-hover:shadow-[0_12px_35px_#000000bf] transition-all duration-300 group-hover:scale-105 shrink-0`}
      >
        {/* Background dark shield with subtle radial gradient */}
        <div className="w-full h-full bg-[#0a0c10] rounded-[14px] flex items-center justify-center overflow-hidden relative">
          <Image
            src="/icon.png"
            alt="ZerDonghua"
            fill
            decoding="async"
            sizes="64px"
            className="w-full h-full object-contain p-1.5 relative z-10"
          />
        </div>
      </div>

      {/* Brand Typography */}
      <div>
        <div className="flex items-center gap-1.5">
          <span
            className={`${titleSizeMap[size]} font-black tracking-tight text-white group-hover:text-purple-200 transition-colors leading-none`}
          >
            ZER
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-purple-300">
              DONGHUA
            </span>
          </span>
          {showBadge && (
            <span
              className={`${badgeSizeMap[size]} font-black uppercase rounded-md bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white tracking-widest shadow-sm shadow-[#0009] border border-white/20 leading-tight`}
            >
              HD
            </span>
          )}
        </div>
        {showSubtitle && (
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium tracking-wide mt-0.5 group-hover:text-gray-300 transition-colors">
            Streaming Donghua Sub Indo
          </p>
        )}
      </div>
    </div>
  );
};
