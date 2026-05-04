interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { svg: 32, text: 'text-lg' },
  md: { svg: 40, text: 'text-xl' },
  lg: { svg: 52, text: 'text-2xl' },
};

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const { svg, text } = sizeMap[size];

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label="FlowToPDF">
      <svg
        width={svg}
        height={svg}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Flowing waves under the document */}
        <path
          d="M2 44 C 10 38, 18 50, 28 44 C 38 38, 46 50, 56 44"
          stroke="url(#wave-gradient-1)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />
        <path
          d="M4 50 C 12 44, 20 56, 30 50 C 40 44, 48 56, 58 50"
          stroke="url(#wave-gradient-2)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M6 56 C 14 50, 22 62, 32 56 C 42 50, 50 62, 60 56"
          stroke="url(#wave-gradient-3)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />

        {/* Document body */}
        <rect
          x="16"
          y="6"
          width="32"
          height="38"
          rx="4"
          fill="white"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />

        {/* Folded corner (red/orange) */}
        <path
          d="M40 6 L48 14 L40 14 Z"
          fill="#EF4444"
        />
        <path
          d="M40 6 L40 14 L48 14"
          stroke="#DC2626"
          strokeWidth="0.5"
          fill="none"
        />

        {/* PDF "A" symbol in red */}
        <path
          d="M27 28 L32 18 L37 28 M29 25 L35 25"
          stroke="#DC2626"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Arrow pointing right */}
        <path
          d="M44 36 L54 36 L54 32 L60 38 L54 44 L54 40 L44 40 Z"
          fill="url(#arrow-gradient)"
        />

        <defs>
          <linearGradient id="wave-gradient-1" x1="0" y1="44" x2="64" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#06B6D4" />
            <stop offset="1" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="wave-gradient-2" x1="0" y1="50" x2="64" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0EA5E9" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="wave-gradient-3" x1="0" y1="56" x2="64" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="arrow-gradient" x1="44" y1="32" x2="60" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>
      </svg>
      <span className={`font-bold ${text} bg-gradient-to-r from-primary-500 to-violet-600 bg-clip-text text-transparent`}>
        FlowToPDF
      </span>
    </span>
  );
}

export default Logo;
