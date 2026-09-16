import React from 'react';

export const SecurityIllustration: React.FC = () => {
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
          {/* Shield Blue Gradient */}
          <linearGradient id="shieldGrad" x1="130" y1="60" x2="230" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00D2FF" />
            <stop offset="40%" stopColor="#0091FF" />
            <stop offset="100%" stopColor="#0A50D0" />
          </linearGradient>

          {/* Shield Inner Gradient */}
          <linearGradient id="shieldInner" x1="140" y1="80" x2="220" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#25E2FF" />
            <stop offset="100%" stopColor="#0072E5" />
          </linearGradient>

          {/* Laptop Base Gradient */}
          <linearGradient id="laptopBase" x1="40" y1="210" x2="320" y2="245" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E2238" />
            <stop offset="50%" stopColor="#2D3252" />
            <stop offset="100%" stopColor="#151728" />
          </linearGradient>

          {/* Laptop Screen Glass */}
          <linearGradient id="laptopScreen" x1="80" y1="120" x2="280" y2="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1B2B4A" />
            <stop offset="100%" stopColor="#0D182E" />
          </linearGradient>

          {/* Gear Gradient */}
          <linearGradient id="gearGrad" x1="40" y1="110" x2="110" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8A9BB8" />
            <stop offset="100%" stopColor="#485670" />
          </linearGradient>

          {/* Passkey Card Gradient */}
          <linearGradient id="passkeyCard" x1="50" y1="140" x2="140" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2A334E" />
            <stop offset="100%" stopColor="#181F33" />
          </linearGradient>

          {/* Cloud White Gradient */}
          <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#D2E3FC" />
          </linearGradient>

          {/* Security Radiant Ambient Glow */}
          <radialGradient id="secGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#00C853" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0B0B14" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Glow */}
        <circle cx="180" cy="150" r="140" fill="url(#secGlow)" />

        {/* FLOATING CLOUDS (Top Left & Top Right) */}
        <g opacity="0.9" transform="translate(230, 45)">
          <path
            d="M20 18 A 12 12 0 0 1 42 16 A 16 16 0 0 1 66 22 A 10 10 0 0 1 62 34 L 14 34 A 10 10 0 0 1 20 18 Z"
            fill="url(#cloudGrad)"
          />
        </g>
        <g opacity="0.75" transform="translate(70, 70) scale(0.8)">
          <path
            d="M20 18 A 12 12 0 0 1 42 16 A 16 16 0 0 1 66 22 A 10 10 0 0 1 62 34 L 14 34 A 10 10 0 0 1 20 18 Z"
            fill="url(#cloudGrad)"
          />
        </g>

        {/* GEAR MECHANISM (Left) */}
        <g transform="translate(60, 115) scale(0.95)">
          <circle cx="40" cy="40" r="32" fill="url(#gearGrad)" stroke="#B8C7DE" strokeWidth="1.5" />
          {/* Gear teeth */}
          <rect x="36" y="2" width="8" height="10" rx="2" fill="#B8C7DE" />
          <rect x="36" y="68" width="8" height="10" rx="2" fill="#B8C7DE" />
          <rect x="2" y="36" width="10" height="8" rx="2" fill="#B8C7DE" />
          <rect x="68" y="36" width="10" height="8" rx="2" fill="#B8C7DE" />
          <rect x="12" y="12" width="9" height="9" rx="2" fill="#B8C7DE" transform="rotate(45 16.5 16.5)" />
          <rect x="59" y="59" width="9" height="9" rx="2" fill="#B8C7DE" transform="rotate(45 63.5 63.5)" />
          <rect x="59" y="12" width="9" height="9" rx="2" fill="#B8C7DE" transform="rotate(45 63.5 16.5)" />
          <rect x="12" y="59" width="9" height="9" rx="2" fill="#B8C7DE" transform="rotate(45 16.5 63.5)" />
          {/* Center hole */}
          <circle cx="40" cy="40" r="14" fill="#0D182E" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        </g>

        {/* GEAR MECHANISM (Right) */}
        <g transform="translate(255, 175) scale(0.65)">
          <circle cx="40" cy="40" r="28" fill="#9D4EDD" opacity="0.85" />
          <rect x="36" y="4" width="8" height="8" rx="2" fill="#C77DFF" />
          <rect x="36" y="68" width="8" height="8" rx="2" fill="#C77DFF" />
          <rect x="4" y="36" width="8" height="8" rx="2" fill="#C77DFF" />
          <rect x="68" y="36" width="8" height="8" rx="2" fill="#C77DFF" />
          <circle cx="40" cy="40" r="12" fill="#0D182E" />
        </g>

        {/* 3D LAPTOP HARDWARE BASE */}
        <g transform="translate(45, 130)">
          {/* Screen Bezel */}
          <path
            d="M35 15 L 235 15 L 250 95 L 20 95 Z"
            fill="url(#laptopScreen)"
            stroke="rgba(0, 210, 255, 0.4)"
            strokeWidth="1.5"
          />

          {/* Laptop Keyboard Lower Deck Base */}
          <path
            d="M10 95 L 260 95 L 280 115 L -10 115 Z"
            fill="url(#laptopBase)"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1.5"
          />

          {/* Trackpad */}
          <rect x="105" y="99" width="60" height="12" rx="3" fill="#141724" stroke="rgba(255,255,255,0.1)" />
        </g>

        {/* PASSKEY AUTHENTICATION CARD (Left Floating) */}
        <g transform="translate(48, 155)">
          <rect
            width="82"
            height="50"
            rx="10"
            fill="url(#passkeyCard)"
            stroke="#00D2FF"
            strokeWidth="1.5"
          />
          {/* Header bar */}
          <rect x="8" y="8" width="20" height="6" rx="2" fill="#00D2FF" />
          {/* Password Asterisk Dots */}
          <circle cx="14" cy="24" r="2.5" fill="#00C853" />
          <circle cx="24" cy="24" r="2.5" fill="#00C853" />
          <circle cx="34" cy="24" r="2.5" fill="#00C853" />
          <circle cx="44" cy="24" r="2.5" fill="#00C853" />
          <circle cx="54" cy="24" r="2.5" fill="#00C853" />
          {/* Progress bar line */}
          <rect x="8" y="36" width="66" height="4" rx="2" fill="rgba(255,255,255,0.15)" />
          <rect x="8" y="36" width="48" height="4" rx="2" fill="#00C853" />
        </g>

        {/* CENTER 3D SHIELD WITH GLOWING KEYHOLE */}
        <g transform="translate(130, 65)">
          {/* Outer Shield Backing */}
          <path
            d="M50 0 C 80 0, 100 15, 100 35 C 100 85, 50 125, 50 135 C 50 125, 0 85, 0 35 C 0 15, 20 0, 50 0 Z"
            fill="url(#shieldGrad)"
            stroke="#FFFFFF"
            strokeWidth="3"
            filter="drop-shadow(0px 8px 16px rgba(0, 145, 255, 0.4))"
          />

          {/* Inner Shield Facet */}
          <path
            d="M50 10 C 74 10, 88 22, 88 38 C 88 78, 50 112, 50 120 C 50 112, 12 78, 12 38 C 12 22, 26 10, 50 10 Z"
            fill="url(#shieldInner)"
          />

          {/* White Sheen Highlight */}
          <path
            d="M50 10 C 65 10, 80 18, 85 30 L 50 65 Z"
            fill="rgba(255, 255, 255, 0.35)"
          />

          {/* Padlock Shackle */}
          <path
            d="M38 52 V 42 C 38 34, 62 34, 62 42 V 52"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Padlock Body */}
          <rect x="30" y="50" width="40" height="32" rx="8" fill="#FFFFFF" />

          {/* Keyhole */}
          <circle cx="50" cy="63" r="4" fill="#0A50D0" />
          <path d="M48 64 L 52 64 L 53 73 L 47 73 Z" fill="#0A50D0" />
        </g>

        {/* Sparkle Stars & Data Particles */}
        <circle cx="40" cy="50" r="3" fill="#00D2FF" />
        <circle cx="310" cy="110" r="3" fill="#00C853" />
        <circle cx="330" cy="160" r="2" fill="#00D2FF" />
        <circle cx="50" cy="240" r="2.5" fill="#FFE27A" />
      </svg>
    </div>
  );
};
