import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Play button shape with gradient */}
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#1E88E5" />
            </linearGradient>
          </defs>
          {/* Circle background */}
          <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />
          {/* Play triangle */}
          <path
            d="M16 12 L16 28 L30 20 Z"
            fill="#0D1117"
          />
          {/* Green slash accent */}
          <path
            d="M25 8 L18 32"
            stroke="#00C853"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {showText && (
        <span className={`font-bold ${textSizeClasses[size]} text-gradient`}>
          Epstify
        </span>
      )}
    </div>
  );
};

export default Logo;
