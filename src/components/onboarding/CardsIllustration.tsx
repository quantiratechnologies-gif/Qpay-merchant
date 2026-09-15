import React from 'react';

export const CardsIllustration: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '320px',
        height: '260px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <svg
        viewBox="0 0 360 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          {/* Card 1 Glass Gradient */}
          <linearGradient id="card1Grad" x1="40" y1="50" x2="280" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2A2A44" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#1E1E34" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#121222" stopOpacity="0.9" />
          </linearGradient>

          {/* Card 2 Emerald Gradient */}
          <linearGradient id="card2Grad" x1="80" y1="100" x2="320" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B4032" />
            <stop offset="40%" stopColor="#14664F" />
            <stop offset="100%" stopColor="#05261E" />
          </linearGradient>

          {/* Card 3 Sapphire/Cobalt Gradient */}
          <linearGradient id="card3Grad" x1="120" y1="130" x2="340" y2="270" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2E5CFF" />
            <stop offset="60%" stopColor="#1A38B8" />
            <stop offset="100%" stopColor="#0E1E6B" />
          </linearGradient>

          {/* Chip Gold Gradient */}
          <linearGradient id="goldChip" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFE27A" />
            <stop offset="100%" stopColor="#C49B28" />
          </linearGradient>

          {/* Ambient Glow */}
          <radialGradient id="cardsGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7FE87F" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0B0B14" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Backdrop Ambient Lighting */}
        <circle cx="180" cy="150" r="140" fill="url(#cardsGlow)" />

        {/* BOTTOM CARD (3D Isometric Cobalt Card) */}
        <g transform="rotate(-16 180 180) translate(25, 45)">
          {/* Card Base */}
          <rect
            x="30"
            y="70"
            width="230"
            height="140"
            rx="16"
            fill="url(#card3Grad)"
            stroke="rgba(100, 160, 255, 0.4)"
            strokeWidth="1.5"
          />
          {/* Card Decorative Wave Lines */}
          <path
            d="M30 140 C 90 110, 150 170, 260 120"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M30 160 C 100 130, 170 190, 260 140"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Chip */}
          <rect x="52" y="94" width="30" height="22" rx="4" fill="url(#goldChip)" />
          {/* NFC Waves */}
          <path
            d="M96 100 A 8 8 0 0 1 96 112 M101 96 A 14 14 0 0 1 101 116"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />
          {/* Card Numbers & Brand */}
          <text x="52" y="152" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold" letterSpacing="2">
            SA03 •••• 4821
          </text>
          <text x="52" y="180" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="800" letterSpacing="1">
            AL RAJHI BANK
          </text>
          {/* mada badge */}
          <rect x="198" y="165" width="46" height="24" rx="6" fill="#FFFFFF" />
          <text x="207" y="181" fill="#053026" fontSize="10" fontWeight="900">
            mada
          </text>
        </g>

        {/* MIDDLE CARD (Emerald Sarie Card) */}
        <g transform="rotate(-6 180 150) translate(0, 15)">
          <rect
            x="45"
            y="55"
            width="230"
            height="140"
            rx="16"
            fill="url(#card2Grad)"
            stroke="rgba(127, 232, 127, 0.5)"
            strokeWidth="1.5"
          />
          {/* Geometric Accents */}
          <circle cx="230" cy="80" r="45" fill="none" stroke="rgba(127,232,127,0.15)" strokeWidth="12" />
          <rect x="65" y="80" width="30" height="22" rx="4" fill="url(#goldChip)" />
          <path
            d="M108 86 A 8 8 0 0 1 108 98 M113 82 A 14 14 0 0 1 113 102"
            stroke="#7FE87F"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          <text x="65" y="136" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold" letterSpacing="2">
            SA58 •••• 1092
          </text>
          <text x="65" y="165" fill="#7FE87F" fontSize="9" fontWeight="800" letterSpacing="1">
            SARIE DIRECT DEBIT
          </text>
          <circle cx="215" cy="155" r="14" fill="#FF4757" opacity="0.85" />
          <circle cx="233" cy="155" r="14" fill="#FFA502" opacity="0.85" />
        </g>

        {/* TOP FLOATING GLASS CARD (Frosted Translucent Glassmorphism) */}
        <g transform="rotate(8 180 120) translate(-15, -15)">
          <rect
            x="60"
            y="40"
            width="230"
            height="140"
            rx="16"
            fill="url(#card1Grad)"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="1.5"
          />
          {/* Glass Highlight Sheen */}
          <path
            d="M60 56 Q 160 40 290 85 L 290 40 L 60 40 Z"
            fill="rgba(255, 255, 255, 0.12)"
          />
          <rect x="80" y="65" width="30" height="22" rx="4" fill="url(#goldChip)" />
          {/* Contactless waves */}
          <path
            d="M124 71 A 8 8 0 0 1 124 83 M129 67 A 14 14 0 0 1 129 87"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          <text x="80" y="120" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold" letterSpacing="2">
            4821 9012 3616 8800
          </text>
          <text x="80" y="150" fill="rgba(255,255,255,0.9)" fontSize="9" fontWeight="800" letterSpacing="1">
            FAHAD AL-HARBI
          </text>
          {/* VISA Typography */}
          <text x="228" y="155" fill="#FFFFFF" fontSize="16" fontWeight="900" fontStyle="italic" letterSpacing="1">
            VISA
          </text>
        </g>

        {/* Floating Sparks & Sparkle Stars */}
        <circle cx="50" cy="60" r="3" fill="#7FE87F" opacity="0.8" />
        <circle cx="310" cy="90" r="2.5" fill="#7FE87F" opacity="0.7" />
        <circle cx="40" cy="220" r="2" fill="#2E5CFF" opacity="0.8" />
        <circle cx="320" cy="210" r="3.5" fill="#FFE27A" opacity="0.8" />
      </svg>
    </div>
  );
};
