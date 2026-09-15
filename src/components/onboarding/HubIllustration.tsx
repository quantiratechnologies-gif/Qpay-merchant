import React from 'react';

export const HubIllustration: React.FC = () => {
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
          {/* Phone Frame Gradient */}
          <linearGradient id="phoneBody" x1="50" y1="20" x2="280" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E1E34" />
            <stop offset="100%" stopColor="#121220" />
          </linearGradient>

          {/* Screen Gradient */}
          <linearGradient id="screenGrad" x1="80" y1="30" x2="220" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#151528" />
            <stop offset="100%" stopColor="#0B0B14" />
          </linearGradient>

          {/* Emerald Glow */}
          <linearGradient id="greenGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7FE87F" />
            <stop offset="100%" stopColor="#4BB543" />
          </linearGradient>

          {/* Golden Coin Gradient */}
          <linearGradient id="goldCoin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFDE59" />
            <stop offset="100%" stopColor="#FF914D" />
          </linearGradient>

          <radialGradient id="hubBackdrop" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7FE87F" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0B0B14" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Glow */}
        <circle cx="180" cy="150" r="140" fill="url(#hubBackdrop)" />

        {/* 3D FLOATING PHONE MOCKUP */}
        <g transform="translate(100, 20)">
          {/* Phone Shadow */}
          <rect x="-10" y="240" width="180" height="24" rx="12" fill="rgba(0,0,0,0.4)" filter="blur(6px)" />

          {/* Phone Outer Chassis */}
          <rect
            x="0"
            y="0"
            width="160"
            height="250"
            rx="28"
            fill="url(#phoneBody)"
            stroke="rgba(127, 232, 127, 0.4)"
            strokeWidth="2"
          />

          {/* Phone Inner Display */}
          <rect
            x="7"
            y="7"
            width="146"
            height="236"
            rx="22"
            fill="url(#screenGrad)"
          />

          {/* Dynamic Island / Speaker */}
          <rect x="56" y="14" width="48" height="10" rx="5" fill="#0B0B14" />
          <circle cx="88" cy="19" r="2" fill="rgba(255,255,255,0.3)" />

          {/* Screen Content: Balance Pill */}
          <rect x="20" y="42" width="120" height="42" rx="12" fill="#1E1E32" stroke="rgba(255,255,255,0.08)" />
          <text x="32" y="58" fill="#A2A2BA" fontSize="8" fontWeight="700">TOTAL BALANCE</text>
          <text x="32" y="74" fill="#FFFFFF" fontSize="13" fontWeight="900">SAR 48,250</text>

          {/* Transfer Success Card inside Screen */}
          <g transform="translate(20, 96)">
            <rect width="120" height="85" rx="12" fill="rgba(127, 232, 127, 0.12)" stroke="#7FE87F" strokeWidth="1.2" />
            <circle cx="28" cy="24" r="14" fill="#7FE87F" />
            <path d="M23 24 L 27 28 L 34 20" stroke="#0B0B14" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <text x="48" y="20" fill="#FFFFFF" fontSize="9" fontWeight="800">Sarie Instant</text>
            <text x="48" y="31" fill="#7FE87F" fontSize="8" fontWeight="700">+SAR 1,250.00</text>

            <line x1="12" y1="46" x2="108" y2="46" stroke="rgba(127,232,127,0.2)" strokeWidth="1" />

            <text x="12" y="60" fill="#A2A2BA" fontSize="7.5" fontWeight="600">To: Tariq Al-Otaibi</text>
            <text x="12" y="72" fill="#6E6E85" fontSize="7" fontWeight="600">Al Rajhi • SA03••••4821</text>
          </g>

          {/* Quick Pay Buttons row inside screen */}
          <rect x="20" y="192" width="36" height="32" rx="8" fill="#1E1E32" stroke="rgba(255,255,255,0.1)" />
          <text x="26" y="212" fill="#7FE87F" fontSize="9" fontWeight="bold">QR</text>
          <rect x="62" y="192" width="36" height="32" rx="8" fill="#1E1E32" stroke="rgba(255,255,255,0.1)" />
          <text x="67" y="212" fill="#FFFFFF" fontSize="8" fontWeight="bold">Send</text>
          <rect x="104" y="192" width="36" height="32" rx="8" fill="#1E1E32" stroke="rgba(255,255,255,0.1)" />
          <text x="108" y="212" fill="#FFFFFF" fontSize="8" fontWeight="bold">Bills</text>
        </g>

        {/* FLOATING 3D GOLDEN SAR COINS */}
        <g transform="translate(45, 90)">
          <circle cx="26" cy="26" r="24" fill="url(#goldCoin)" stroke="#FFE27A" strokeWidth="2" />
          <circle cx="26" cy="26" r="19" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="15" y="32" fill="#5C3B00" fontSize="13" fontWeight="900" fontFamily="sans-serif">
            SAR
          </text>
        </g>

        <g transform="translate(265, 140)">
          <circle cx="20" cy="20" r="18" fill="url(#goldCoin)" stroke="#FFE27A" strokeWidth="1.5" />
          <text x="11" y="25" fill="#5C3B00" fontSize="10" fontWeight="900">
            SAR
          </text>
        </g>

        {/* Floating Connective Energy Rails / Nodes */}
        <path
          d="M75 110 C 85 130, 95 150, 115 150"
          stroke="#7FE87F"
          strokeWidth="2"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M245 135 C 265 140, 275 145, 285 155"
          stroke="#7FE87F"
          strokeWidth="2"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.8"
        />

        {/* Sparkle Accents */}
        <circle cx="45" cy="50" r="3" fill="#7FE87F" />
        <circle cx="310" cy="80" r="2.5" fill="#FFE27A" />
        <circle cx="320" cy="230" r="3" fill="#7FE87F" />
      </svg>
    </div>
  );
};
