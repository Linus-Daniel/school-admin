import React from 'react';

interface UniversityCrestProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const UniversityCrest: React.FC<UniversityCrestProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}>
      {/* University Shield with Nigerian Green-White-Green motif and academic symbols */}
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* Outer Circular Ring with Gold Accent */}
        <circle cx="50" cy="50" r="47" fill="#008751" stroke="#F59E0B" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="43" fill="#064E3B" stroke="#A7F3D0" strokeWidth="1" strokeDasharray="2 2" />

        {/* Heraldic Shield */}
        <path
          d="M30 24H70C70 24 70 54 50 72C30 54 30 24 30 24Z"
          fill="#FFFFFF"
          stroke="#F59E0B"
          strokeWidth="1.5"
        />

        {/* Green-White-Green Stripes across Shield */}
        <path d="M30 25H43V58C37.5 50 32 40 30 25Z" fill="#008751" />
        <path d="M57 25H70C68 40 62.5 50 57 58V25Z" fill="#008751" />

        {/* Open Book of Learning in Shield center */}
        <path
          d="M44 38C46 37 48 37 50 38C52 37 54 37 56 38V47C54 46 52 46 50 47C48 46 46 46 44 47V38Z"
          fill="#1E293B"
          stroke="#F59E0B"
          strokeWidth="0.8"
        />
        <line x1="50" y1="38" x2="50" y2="47" stroke="#F59E0B" strokeWidth="0.8" />

        {/* Torch of Enlightenment / Truth */}
        <path d="M48.5 28H51.5L51 34H49L48.5 28Z" fill="#F59E0B" />
        <path d="M50 25C51.5 26.5 52 28 50 29C48 28 48.5 26.5 50 25Z" fill="#EF4444" />

        {/* University Base Motto Ribbon */}
        <path
          d="M20 78C30 75 40 74 50 74C60 74 70 75 80 78L78 84C69 82 59 81 50 81C41 81 31 82 22 84L20 78Z"
          fill="#F59E0B"
        />
        <text
          x="50"
          y="79.5"
          textAnchor="middle"
          fill="#064E3B"
          fontSize="4.5"
          fontWeight="bold"
          fontFamily="sans-serif"
          letterSpacing="0.5"
        >
          DISCIPLINA ET DOCTRINA
        </text>

        {/* Golden Laurel Branches */}
        <path
          d="M22 45C22 56 28 66 38 72M78 45C78 56 72 66 62 72"
          stroke="#F59E0B"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export const NigerianFlagBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    className={`inline-flex items-center overflow-hidden rounded border border-emerald-700/40 shadow-xs text-[10px] font-bold ${className}`}
    title="Federal Republic of Nigeria"
  >
    <span className="w-2.5 h-3.5 bg-[#008751] block" />
    <span className="w-2.5 h-3.5 bg-white block" />
    <span className="w-2.5 h-3.5 bg-[#008751] block" />
  </span>
);
