export function WelcomeIllustration() {
  return (
    <svg
      viewBox="0 0 280 200"
      className="w-56 h-40 sm:w-72 sm:h-52 mx-auto mb-4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="280" height="200" fill="url(#sky)" rx="12" />

      {/* Stars */}
      <circle cx="30" cy="20" r="1" fill="#94a3b8" opacity="0.4" />
      <circle cx="75" cy="30" r="0.8" fill="#94a3b8" opacity="0.3" />
      <circle cx="250" cy="25" r="1" fill="#94a3b8" opacity="0.5" />
      <circle cx="200" cy="15" r="0.8" fill="#94a3b8" opacity="0.3" />
      <circle cx="160" cy="22" r="0.6" fill="#94a3b8" opacity="0.25" />

      {/* Soft rolling hills */}
      <path
        d="M0 165 Q40 140 80 155 Q120 170 160 148 Q200 130 240 150 Q260 158 280 145 L280 200 L0 200 Z"
        fill="#1e3a2f"
        opacity="0.5"
      />
      <path
        d="M0 180 Q50 160 100 172 Q150 185 200 165 Q240 152 280 168 L280 200 L0 200 Z"
        fill="#1e3a2f"
        opacity="0.35"
      />

      {/* Moon */}
      <circle cx="230" cy="45" r="14" fill="#fbbf24" opacity="0.15" />
      <circle cx="230" cy="45" r="10" fill="#fbbf24" opacity="0.1" />

      {/* Puffy clouds */}
      <g opacity="0.2">
        <ellipse cx="55" cy="50" rx="18" ry="6" fill="#94a3b8" />
        <ellipse cx="45" cy="48" rx="10" ry="5" fill="#94a3b8" />
        <ellipse cx="65" cy="49" rx="10" ry="4" fill="#94a3b8" />
      </g>
      <g opacity="0.15">
        <ellipse cx="190" cy="38" rx="14" ry="5" fill="#94a3b8" />
        <ellipse cx="182" cy="36" rx="8" ry="4" fill="#94a3b8" />
        <ellipse cx="200" cy="37" rx="9" ry="4" fill="#94a3b8" />
      </g>

      {/* === Paraglider === */}
      {/* Canopy — smooth puffy arc */}
      <path
        d="M60 68 Q95 45 140 42 Q185 45 220 68"
        stroke="#22d3ee"
        strokeWidth="3"
        strokeLinecap="round"
        fill="#22d3ee"
        fillOpacity="0.1"
      />
      {/* Canopy highlight */}
      <path
        d="M80 60 Q110 48 140 46 Q170 48 200 60"
        stroke="#67e8f9"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />

      {/* Lines — converging to waist level */}
      <line x1="75" y1="64" x2="134" y2="125" stroke="#94a3b8" strokeWidth="0.5" opacity="0.35" />
      <line x1="110" y1="52" x2="136" y2="125" stroke="#94a3b8" strokeWidth="0.5" opacity="0.35" />
      <line x1="140" y1="48" x2="140" y2="125" stroke="#94a3b8" strokeWidth="0.5" opacity="0.35" />
      <line x1="170" y1="52" x2="144" y2="125" stroke="#94a3b8" strokeWidth="0.5" opacity="0.35" />
      <line x1="205" y1="64" x2="146" y2="125" stroke="#94a3b8" strokeWidth="0.5" opacity="0.35" />

      {/* Cute pilot — chibi style */}
      {/* Big round head with helmet */}
      <circle cx="140" cy="110" r="8" fill="#94a3b8" opacity="0.9" />
      {/* Helmet */}
      <path
        d="M132 108 Q132 102 140 100 Q148 102 148 108"
        fill="#64748b"
        opacity="0.8"
      />
      {/* Goggles */}
      <ellipse cx="136" cy="110" rx="2.5" ry="2" fill="#0f172a" opacity="0.6" />
      <ellipse cx="144" cy="110" rx="2.5" ry="2" fill="#0f172a" opacity="0.6" />
      {/* Goggle shine */}
      <circle cx="135" cy="109.5" r="0.7" fill="#67e8f9" opacity="0.5" />
      <circle cx="143" cy="109.5" r="0.7" fill="#67e8f9" opacity="0.5" />
      {/* Smile */}
      <path d="M137 113.5 Q140 115.5 143 113.5" stroke="#0f172a" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5" />

      {/* Round lil body */}
      <ellipse cx="140" cy="124" rx="7" ry="5" fill="#64748b" opacity="0.7" />

      {/* Stubby legs dangling */}
      <path d="M135 128 Q134 134 132 138" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" fill="none" />
      <path d="M145 128 Q146 134 148 138" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" fill="none" />

      {/* Lil round feet */}
      <circle cx="131" cy="139" r="2.5" fill="#94a3b8" opacity="0.6" />
      <circle cx="149" cy="139" r="2.5" fill="#94a3b8" opacity="0.6" />

      {/* Tiny waving hand */}
      <path d="M148 121 Q152 118 155 115" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.6" fill="none" />
      <circle cx="155.5" cy="114" r="1.5" fill="#94a3b8" opacity="0.6" />

      {/* Wind swooshes */}
      <path d="M18 85 Q30 83 42 85" stroke="#64748b" strokeWidth="1" strokeLinecap="round" opacity="0.3" fill="none" />
      <path d="M10 100 Q25 97 38 100" stroke="#64748b" strokeWidth="0.8" strokeLinecap="round" opacity="0.2" fill="none" />
      <path d="M238 90 Q252 87 265 90" stroke="#64748b" strokeWidth="1" strokeLinecap="round" opacity="0.25" fill="none" />

      {/* Lil birds */}
      <path d="M85 35 Q87 33 89 35" stroke="#94a3b8" strokeWidth="0.7" strokeLinecap="round" opacity="0.25" fill="none" />
      <path d="M95 40 Q96.5 38.5 98 40" stroke="#94a3b8" strokeWidth="0.5" strokeLinecap="round" opacity="0.2" fill="none" />
    </svg>
  );
}
