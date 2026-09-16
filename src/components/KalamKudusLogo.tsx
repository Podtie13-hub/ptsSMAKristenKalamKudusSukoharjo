import React from 'react';

interface KalamKudusLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
  variant?: 'full' | 'shield-only';
  customHeight?: number;
  logoUrl?: string;
}

export const KalamKudusShield: React.FC<{ size?: number; className?: string; logoUrl?: string }> = ({
  size = 56,
  className = '',
  logoUrl,
}) => {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Logo SMA Kristen Kalam Kudus Sukoharjo"
        className={`object-contain select-none ${className}`}
        style={{ width: size, height: size * 1.05 }}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Authentic Sekolah Kristen Kalam Kudus (YKKI) emblem:
  // Oval shield in Royal Blue with Gold/White trim, Open Holy Bible with Alpha (Α) & Omega (Ω),
  // Red Latin Cross standing at the center, golden rays, laurel leaves, and KALAM KUDUS banner.
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 160 185"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${className}`}
      aria-label="Logo Resmi SMA Kristen Kalam Kudus"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="shieldGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9D423" />
          <stop offset="100%" stopColor="#FF4E50" />
        </linearGradient>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E3A6C" />
        </linearGradient>
        <linearGradient id="crossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        <filter id="badgeShadow" x="0" y="0" width="160" height="185" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Outer Golden Border Shield */}
      <g filter="url(#badgeShadow)">
        <path
          d="M80 174C130 146 154 110 154 22C154 22 120 16 80 6C40 16 6 22 6 22C6 110 30 146 80 174Z"
          fill="#D97706"
        />
        <path
          d="M80 170C127 143 150 108 150 24C150 24 118 18 80 9C42 18 10 24 10 24C10 108 33 143 80 170Z"
          fill="#FEF3C7"
        />
        <path
          d="M80 166C124 140 146 106 146 26C146 26 116 20 80 12C44 20 14 26 14 26C14 106 36 140 80 166Z"
          fill="url(#skyGrad)"
        />
      </g>

      {/* Sun Rays emanating behind Cross */}
      <g opacity="0.35">
        <line x1="80" y1="58" x2="80" y2="20" stroke="#FDE68A" strokeWidth="2" strokeDasharray="3 3" />
        <line x1="80" y1="58" x2="115" y2="30" stroke="#FDE68A" strokeWidth="2" strokeDasharray="3 3" />
        <line x1="80" y1="58" x2="45" y2="30" stroke="#FDE68A" strokeWidth="2" strokeDasharray="3 3" />
        <line x1="80" y1="58" x2="125" y2="58" stroke="#FDE68A" strokeWidth="2" strokeDasharray="3 3" />
        <line x1="80" y1="58" x2="35" y2="58" stroke="#FDE68A" strokeWidth="2" strokeDasharray="3 3" />
      </g>

      {/* Central Latin Cross in Red with Gold Border */}
      <g id="salib-kristen">
        {/* Gold glow outline */}
        <rect x="73.5" y="24" width="13" height="52" rx="2" fill="#FDE68A" />
        <rect x="58.5" y="37" width="43" height="13" rx="2" fill="#FDE68A" />
        {/* Red core */}
        <rect x="75" y="25.5" width="10" height="49" rx="1.5" fill="url(#crossGrad)" />
        <rect x="60" y="38.5" width="40" height="10" rx="1.5" fill="url(#crossGrad)" />
        {/* Highlight sheen */}
        <line x1="77" y1="27" x2="77" y2="72" stroke="#FCA5A5" strokeWidth="1" strokeLinecap="round" />
        <line x1="62" y1="40" x2="98" y2="40" stroke="#FCA5A5" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Open Holy Bible (Alkitab Terbuka) with Alpha & Omega */}
      <g id="alkitab-terbuka" transform="translate(0, 18)">
        {/* Book Base / Outer Cover */}
        <path
          d="M80 78C64 71 44 71 28 77C26 78 24 80 24 83V112C42 105 62 105 80 114C98 105 118 105 136 112V83C136 80 134 78 132 77C116 71 96 71 80 78Z"
          fill="#78350F"
        />
        {/* White / Cream Pages */}
        <path
          d="M80 76C63 70 43 70 28 75V107C44 101 64 101 80 109C96 101 116 101 132 107V75C117 70 97 70 80 76Z"
          fill="#FFFBEB"
          stroke="#E5E7EB"
          strokeWidth="1.2"
        />
        {/* Center Spine */}
        <line x1="80" y1="76" x2="80" y2="109" stroke="#92400E" strokeWidth="2.5" />

        {/* Text Lines on Left Page */}
        <line x1="36" y1="84" x2="72" y2="84" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="36" y1="91" x2="72" y2="91" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="36" y1="98" x2="66" y2="98" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />

        {/* Text Lines on Right Page */}
        <line x1="88" y1="84" x2="124" y2="84" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="88" y1="91" x2="124" y2="91" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="88" y1="98" x2="118" y2="98" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />

        {/* Greek Alpha (Α) on left & Omega (Ω) on right */}
        <text
          x="54"
          y="95"
          fill="#1E3A6C"
          fontFamily="'Times New Roman', serif"
          fontWeight="bold"
          fontSize="17"
          textAnchor="middle"
          opacity="0.95"
        >
          Α
        </text>
        <text
          x="106"
          y="95"
          fill="#1E3A6C"
          fontFamily="'Times New Roman', serif"
          fontWeight="bold"
          fontSize="17"
          textAnchor="middle"
          opacity="0.95"
        >
          Ω
        </text>
      </g>

      {/* Golden Wheat / Laurel Branch of Wisdom on Lower Left & Right */}
      <g id="laurel" fill="#F59E0B" opacity="0.9">
        <path d="M22 118C28 122 36 126 44 130C38 124 32 118 22 118Z" />
        <path d="M26 128C32 133 42 137 50 140C44 134 36 129 26 128Z" />
        <path d="M138 118C132 122 124 126 116 130C122 124 128 118 138 118Z" />
        <path d="M134 128C128 133 118 137 110 140C116 134 124 129 134 128Z" />
      </g>

      {/* Bottom Red Ribbon with Gold Border */}
      <g id="banner-ribbon">
        {/* Ribbon back folds */}
        <path d="M4 143L22 133L26 142L12 153L4 143Z" fill="#7F1D1D" />
        <path d="M156 143L138 133L134 142L148 153L156 143Z" fill="#7F1D1D" />

        {/* Main Ribbon Body */}
        <path
          d="M16 137C42 143 68 145 80 145C92 145 118 143 144 137L148 155C122 161 94 163 80 163C66 163 38 161 12 155L16 137Z"
          fill="#DC2626"
          stroke="#FEF3C7"
          strokeWidth="1.2"
        />

        {/* Banner Text: KALAM KUDUS */}
        <text
          x="80"
          y="153.5"
          fill="#FFFFFF"
          fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
          fontWeight="900"
          fontSize="11"
          letterSpacing="1.5"
          textAnchor="middle"
        >
          KALAM KUDUS
        </text>
      </g>
    </svg>
  );
};

export const KalamKudusLogo: React.FC<KalamKudusLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor = 'text-[#1E3A6C]',
  subtextColor = 'text-[#1E3A6C]',
  variant = 'full',
  customHeight,
  logoUrl,
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return { shieldSize: 36, titleClass: 'text-sm font-bold tracking-tight', subClass: 'text-[10px] tracking-wide' };
      case 'md':
        return { shieldSize: 48, titleClass: 'text-base font-extrabold', subClass: 'text-xs tracking-wider' };
      case 'lg':
        return { shieldSize: 64, titleClass: 'text-xl font-extrabold tracking-tight', subClass: 'text-sm tracking-wider' };
      case 'xl':
        return { shieldSize: 84, titleClass: 'text-2xl font-black tracking-tight', subClass: 'text-base font-semibold tracking-widest' };
      case 'custom':
        return { shieldSize: customHeight || 50, titleClass: 'text-base font-bold', subClass: 'text-xs' };
      default:
        return { shieldSize: 48, titleClass: 'text-base font-bold', subClass: 'text-xs' };
    }
  };

  const { shieldSize, titleClass, subClass } = getDimensions();

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <KalamKudusShield size={shieldSize} logoUrl={logoUrl} />
      {showText && variant === 'full' && (
        <div className="flex flex-col justify-center leading-tight">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600">
            SMA Kristen
          </span>
          <span className={`${titleClass} ${textColor} leading-none my-0.5 tracking-tight font-black`}>
            KALAM KUDUS
          </span>
          <span className={`${subClass} ${subtextColor} font-bold uppercase tracking-widest opacity-90 text-[#D8232A]`}>
            SUKOHARJO
          </span>
        </div>
      )}
    </div>
  );
};

export default KalamKudusLogo;
