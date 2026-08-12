interface SathiLogoProps {
    className?: string;
    /** Primary accent color for gradients (defaults to Emerald #10B981) */
    primaryColor?: string;
    /** Secondary accent color for gradients (defaults to Mint #34D399) */
    secondaryColor?: string;
    /** Pass true if rendering over dark green/emerald backgrounds */
    isDarkBg?: boolean;
  }
  
  export default function SathiLogo({
    className = "h-12 w-auto",
    primaryColor = "#10B981",
    secondaryColor = "#34D399",
    isDarkBg = false,
  }: SathiLogoProps) {
    // Dynamic text color for dark vs light backgrounds
    const textColor = isDarkBg ? "#FFFFFF" : "currentColor";
    const contrastCircleFill = isDarkBg ? "rgba(255, 255, 255, 0.15)" : "none";
  
    return (
      <svg
        className={className}
        viewBox="0 0 500 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Dynamic Primary Gradient */}
          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
  
          {/* Dynamic Secondary Gradient */}
          <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={primaryColor} />
          </linearGradient>
        </defs>
  
        {/* ICON MARK */}
        <g transform="translate(20, 10)">
          {/* Backdrop Glow Disc (Active when on Green/Dark Backgrounds) */}
          {isDarkBg && (
            <circle cx="85" cy="65" r="55" fill={contrastCircleFill} />
          )}
  
          {/* Outer Ring & Motion Lines */}
          <path
            d="M 70 135 C 20 135 10 90 40 40 C 55 15 85 5 110 20"
            stroke="url(#emeraldGrad)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 20 120 C 35 120 40 100 55 90"
            stroke={secondaryColor}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 10 105 C 25 105 30 85 45 75"
            stroke={primaryColor}
            strokeWidth="4"
            strokeLinecap="round"
          />
  
          {/* Futsal Ball */}
          <circle cx="85" cy="65" r="38" fill="url(#emeraldGrad)" />
          <polygon points="85,42 98,52 93,68 77,68 72,52" fill="#FFFFFF" opacity="0.95" />
          <polygon points="85,42 85,27 98,34 98,52" fill="#047857" opacity="0.35" />
          <polygon points="98,52 113,57 108,72 93,68" fill="#047857" opacity="0.35" />
          <polygon points="77,68 62,72 57,57 72,52" fill="#047857" opacity="0.35" />
          <polygon points="93,68 98,83 85,93 77,68" fill="#047857" opacity="0.4" />
          
          {/* Core Dot */}
          <circle cx="85" cy="65" r="8" fill="#0f172a" />
          <circle cx="85" cy="65" r="4" fill={secondaryColor} />
        </g>
  
        {/* TYPOGRAPHY */}
        <g transform="translate(170, 95)">
          <text
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="64"
            fill={textColor}
            letterSpacing="2"
          >
            SATHI
          </text>
          <text
            x="5"
            y="32"
            fontFamily="sans-serif"
            fontWeight="800"
            fontSize="18"
            fill={isDarkBg ? secondaryColor : primaryColor}
            letterSpacing="8"
          >
            FUTSAL
          </text>
          <rect x="5" y="42" width="220" height="4" rx="2" fill="url(#accentGrad)" />
        </g>
      </svg>
    );
  }