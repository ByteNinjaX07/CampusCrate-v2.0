import React from "react";

export const CampusCrateLogo = ({ className = "h-9 w-auto", showText = true }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 520 150"
        className="h-full w-auto max-h-12 overflow-visible select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="crateLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="crateRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="pinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#00b4d8" />
          </linearGradient>
          <linearGradient id="arrowGradLeft" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#00d8f6" />
          </linearGradient>
          <linearGradient id="arrowGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#00b4d8" />
          </linearGradient>
        </defs>

        {/* Outer Circular Loop Arrows */}
        {/* Left blue arrow curving up */}
        <path
          d="M 38 72 A 42 42 0 0 1 70 32"
          stroke="url(#arrowGradLeft)"
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 68 25 L 80 34 L 66 41 Z"
          fill="#1d4ed8"
        />

        {/* Right cyan arrow curving down */}
        <path
          d="M 120 54 A 42 42 0 0 1 148 94"
          stroke="url(#arrowGradRight)"
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 152 102 L 140 91 L 153 87 Z"
          fill="#00b4d8"
        />

        {/* Isometric Crate Box */}
        {/* Inner Top Opening (Depth) */}
        <polygon points="92,48 132,68 92,88 52,68" fill="#0f172a" />

        {/* Left Wall */}
        <polygon points="52,68 92,88 92,134 52,114" fill="url(#crateLeftGrad)" />
        {/* Left wall handle slot */}
        <rect x="63" y="92" width="14" height="5" rx="2.5" fill="#ffffff" opacity="0.8" transform="skewY(18)" />

        {/* Right Wall */}
        <polygon points="92,88 132,68 132,114 92,134" fill="url(#crateRightGrad)" />

        {/* Magnifying Glass Icon on Right Wall */}
        <circle cx="110" cy="102" r="10" stroke="#ffffff" strokeWidth="3.5" fill="none" />
        <line x1="117" y1="109" x2="125" y2="117" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />

        {/* Location Pin */}
        <g transform="translate(92, 60)">
          <path
            d="M 0 -40 C -15 -40 -25 -28 -25 -12 C -25 8 0 24 0 24 C 0 24 25 8 25 -12 C 25 -28 15 -40 0 -40 Z"
            fill="url(#pinGrad)"
          />
          <circle cx="0" cy="-16" r="7.5" fill="#ffffff" />
        </g>

        {/* Wordmark text */}
        {showText && (
          <g transform="translate(162, 104)">
            <text
              x="0"
              y="0"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontWeight="800"
              fontSize="68"
              fill="#ffffff"
              letterSpacing="-1.5"
            >
              Campus
            </text>
            <text
              x="254"
              y="0"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontWeight="800"
              fontSize="68"
              fill="#38bdf8"
              letterSpacing="-1.5"
            >
              Crate
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
