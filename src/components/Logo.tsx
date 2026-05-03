interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { svg: 28, text: 'text-lg' },
  md: { svg: 36, text: 'text-xl' },
  lg: { svg: 48, text: 'text-2xl' },
};

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const { svg, text } = sizeMap[size];

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label="ConvertFlow">
      <svg
        width={svg}
        height={svg}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Document body */}
        <rect x="6" y="4" width="28" height="36" rx="4" fill="url(#logo-gradient)" />
        {/* Folded corner */}
        <path d="M28 4 L34 10 L28 10 Z" fill="white" fillOpacity="0.25" />
        {/* Document lines */}
        <rect x="11" y="18" width="18" height="2.5" rx="1.25" fill="white" fillOpacity="0.7" />
        <rect x="11" y="23" width="14" height="2.5" rx="1.25" fill="white" fillOpacity="0.5" />
        <rect x="11" y="28" width="16" height="2.5" rx="1.25" fill="white" fillOpacity="0.5" />
        {/* Circular arrows (conversion symbol) */}
        <circle cx="37" cy="34" r="9" fill="white" />
        <path
          d="M32 34 C32 31.24 34.24 29 37 29"
          stroke="url(#logo-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M37 29 L35 27 M37 29 L39 27"
          stroke="url(#logo-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M42 34 C42 36.76 39.76 39 37 39"
          stroke="url(#logo-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M37 39 L39 41 M37 39 L35 41"
          stroke="url(#logo-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
      <span className={`font-bold ${text} bg-gradient-to-r from-primary-500 to-violet-600 bg-clip-text text-transparent`}>
        ConvertFlow
      </span>
    </span>
  );
}

export default Logo;
