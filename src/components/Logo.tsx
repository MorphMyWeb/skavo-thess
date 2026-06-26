import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'compact' | 'full' | 'icon';
  color?: 'primary' | 'yellow' | 'white';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'compact',
  color = 'primary',
}) => {
  // Define colors based on prop
  const strokeColor = 
    color === 'primary' ? '#F27D26' : 
    color === 'yellow' ? '#FACC15' : '#FFFFFF';

  // Backhoe Loader Outline SVG
  const IconSVG = (
    <svg
      viewBox="0 0 100 55"
      fill="none"
      stroke={strokeColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full transition-colors duration-300"
      id="excavator-logo-svg"
    >
      {/* Cabin */}
      <path d="M 45 14 L 54 14 L 56 30 L 45 30 Z" strokeWidth="1.5" />
      {/* Cabin Window Panes */}
      <line x1="49.5" y1="14" x2="49.5" y2="30" strokeWidth="1" strokeDasharray="1 1" />
      <line x1="45" y1="21" x2="55" y2="21" strokeWidth="1" strokeDasharray="1 1" />
      
      {/* Engine Hood / Body */}
      <path d="M 31 24 L 45 24 L 45 32 L 31 32 Z" strokeWidth="1.5" />
      {/* Front Grille */}
      <line x1="31" y1="26" x2="31" y2="30" strokeWidth="1" />
      
      {/* Mudguards */}
      <path d="M 41 32 A 8.5 8.5 0 0 1 59 32" strokeWidth="1.2" />
      <path d="M 24 32.5 A 5.5 5.5 0 0 1 36 32.5" strokeWidth="1.2" />

      {/* Wheels */}
      {/* Rear Wheel (Larger) */}
      <circle cx="50" cy="34.5" r="7.5" strokeWidth="1.5" />
      <circle cx="50" cy="34.5" r="2.5" strokeWidth="1" />
      {/* Front Wheel (Smaller) */}
      <circle cx="30" cy="35" r="4.5" strokeWidth="1.5" />
      <circle cx="30" cy="35" r="1.5" strokeWidth="1" />

      {/* Front Loader (Left side) */}
      {/* Loader Main Arm */}
      <path d="M 41 26 L 22 28 L 14 36" strokeWidth="1.5" />
      {/* Shovel / Bucket */}
      <path d="M 14 36 L 9 36 L 5 28 L 10 21 Z" strokeWidth="1.5" />
      {/* Hydraulics */}
      <line x1="36" y1="29" x2="21" y2="31" strokeWidth="1" />

      {/* Backhoe Excavator Arm (Right side) */}
      {/* Swing post pivot */}
      <rect x="58" y="24" width="3" height="8" rx="0.5" strokeWidth="1.2" />
      {/* Boom (Articulated curved arm) */}
      <path d="M 59.5 26 C 63 15, 71 8, 75 13" strokeWidth="1.8" />
      {/* Dipper stick (Second arm) */}
      <path d="M 75 13 L 83 26" strokeWidth="1.5" />
      {/* Secondary Linkages */}
      <path d="M 71 10 L 78 18" strokeWidth="0.8" />
      {/* Excavator Bucket with Teeth */}
      <path d="M 83 26 L 87 30 L 84 35 L 80 33 L 80 28 Z" strokeWidth="1.5" />
      {/* Teeth pointing down-back */}
      <line x1="84" y1="35" x2="85" y2="38" strokeWidth="1.2" />
      <line x1="82" y1="34.2" x2="83" y2="37.2" strokeWidth="1.2" />
      <line x1="80" y1="33" x2="81" y2="36" strokeWidth="1.2" />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`w-12 h-12 flex items-center justify-center ${className}`} id="excavator-logo-container">
        {IconSVG}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center justify-center text-center p-6 bg-black border border-white/5 rounded-lg max-w-sm mx-auto ${className}`} id="excavator-logo-full">
        {/* Loader Icon */}
        <div className="w-48 h-28 mb-4">
          {IconSVG}
        </div>
        {/* SKAVO THESS Logo Text */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-wider leading-none uppercase" style={{ color: strokeColor }}>
          SKAVO THESS
        </h1>
        {/* Build Your Dream Border Box */}
        <div className="mt-4 border-2 px-6 py-1.5 rounded-sm" style={{ borderColor: strokeColor }}>
          <span className="text-xs sm:text-sm font-black uppercase tracking-[0.3em]" style={{ color: strokeColor }}>
            BUILD YOUR DREAM
          </span>
        </div>
      </div>
    );
  }

  // Default: compact header layout
  return (
    <div className={`flex items-center gap-3 ${className}`} id="excavator-logo-compact">
      <div className="w-12 h-12 shrink-0 flex items-center justify-center">
        {IconSVG}
      </div>
      <div className="flex flex-col">
        <span className="text-xl sm:text-2xl font-black tracking-tight leading-none text-white">
          SKAVO<span className="text-[#F27D26] font-mono">-</span>THESS
        </span>
        <span className="text-[9px] uppercase tracking-[0.25em] text-gray-400 font-bold leading-none mt-1">
          Χωματουργικές Εργασίες
        </span>
      </div>
    </div>
  );
};
