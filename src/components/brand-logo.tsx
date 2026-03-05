interface BrandLogoProps {
  showWordmark?: boolean;
  className?: string;
}

export function BrandLogo({ showWordmark = true, className = "" }: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="skill-hunter-logo-gradient" x1="5" y1="3" x2="30" y2="31" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0C6CF2" />
            <stop offset="1" stopColor="#11C58A" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="32" height="32" rx="10" fill="url(#skill-hunter-logo-gradient)" />
        <rect x="1" y="1" width="32" height="32" rx="10" stroke="#D9E3F5" strokeWidth="1.5" />
        <path
          d="M23.8 9.8C21.8 8.1 17.5 7.7 14.8 9.4C12.3 11 12.7 14.1 15.5 14.9L18.8 15.8C22.4 16.8 22.8 20.2 20 22.3C17.2 24.5 12.6 24.1 10.2 22"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M10.4 11.4L24 22.6" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {showWordmark ? (
        <span className="font-heading text-lg font-extrabold tracking-tight text-slate-950">Skill Hunter</span>
      ) : null}
    </span>
  );
}
