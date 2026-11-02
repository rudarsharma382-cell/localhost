import React from 'react';

export type AppIconId =
  | 'studio'
  | 'browser'
  | 'about'
  | 'assistant'
  | 'socials'
  | 'notes'
  | 'resume'
  | 'terminal'
  | 'settings';

interface AppIconProps {
  id: AppIconId;
  size?: number;
  className?: string;
  showContainer?: boolean;
}

export function AppIcon({ id, size = 20, className = '', showContainer = false }: AppIconProps) {
  const glyph = () => {
    switch (id) {
      case 'studio':
        return (
          <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
            <rect x="2" y="3" width="16" height="14" rx="2" />
            <path d="M8 3v14" />
            <path d="M12 8l2 2-2 2" stroke="#E58B24" />
          </svg>
        );
      case 'browser':
        return (
          <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
            <circle cx="10" cy="10" r="7" />
            <path d="M3.5 10h13" />
            <path d="M10 3a11 11 0 0 1 0 14" />
            <circle cx="13" cy="7" r="1.5" fill="#E58B24" stroke="none" />
          </svg>
        );
      case 'about':
        return (
          <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
            <circle cx="10" cy="7" r="3.5" />
            <path d="M4 16c0-3 2.5-5 6-5s6 2 6 5" />
            <circle cx="14" cy="5" r="1" fill="#E58B24" stroke="none" />
          </svg>
        );
      case 'assistant':
        return (
          <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
            <path d="M10 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" />
            <circle cx="10" cy="10" r="1.5" fill="#E58B24" stroke="none" />
          </svg>
        );
      case 'socials':
        return (
          <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
            <circle cx="6" cy="10" r="2.5" />
            <circle cx="14" cy="6" r="2.5" />
            <circle cx="14" cy="14" r="2.5" />
            <path d="M8.5 9l3-2" stroke="#E58B24" />
            <path d="M8.5 11l3 2" />
          </svg>
        );
      case 'notes':
        return (
          <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
            <rect x="4" y="3" width="12" height="14" rx="2" />
            <path d="M7 7h6" />
            <path d="M7 10h4" />
            <path d="M12 12l2 2" stroke="#E58B24" strokeWidth="2" />
          </svg>
        );
      case 'resume':
        return (
          <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
            <path d="M5 3h7l4 4v10H5V3z" />
            <path d="M12 3v4h4" />
            <path d="M8 11h4" stroke="#E58B24" />
            <path d="M8 14h3" />
          </svg>
        );
      case 'terminal':
        return (
          <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
            <rect x="3" y="4" width="14" height="12" rx="2" />
            <path d="M6 8l3 2-3 2" />
            <path d="M11 12h3" stroke="#E58B24" strokeWidth="2" />
          </svg>
        );
      case 'settings':
        return (
          <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
            <circle cx="10" cy="10" r="3" />
            <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.9 4.9l1.4 1.4M13.7 13.7l1.4 1.4M4.9 15.1l1.4-1.4M13.7 6.3l1.4-1.4" />
            <circle cx="10" cy="10" r="1" fill="#E58B24" stroke="none" />
          </svg>
        );
    }
  };

  if (!showContainer) {
    return <span className={`inline-flex items-center justify-center ${className}`}>{glyph()}</span>;
  }

  return (
    <div
      className={`w-10 h-10 rounded-md bg-[#1C1F23] border border-[#2F343B] flex items-center justify-center relative shadow-sm select-none transition-transform duration-instant ${className}`}
    >
      {glyph()}
    </div>
  );
}

