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
  | 'settings'
  | 'safeware'
  | 'trusight';

export const APP_CUSTOM_ICONS: Partial<Record<AppIconId, string>> = {
  browser: '/assets/icons/browser.jpg',
  assistant: '/assets/icons/mybot.jpg',
  notes: '/assets/icons/notes.jpg',
  about: '/assets/icons/profile.jpg',
  terminal: '/assets/icons/terminal.jpg',
  resume: '/assets/icons/profile.jpg',
  safeware: '/assets/icons/safeware.jpg',
  trusight: '/assets/icons/trusight.jpg',
};

interface AppIconProps {
  id: AppIconId;
  size?: number;
  className?: string;
  useCustomImage?: boolean;
}

/**
 * Custom Rudar OS App Icon Set
 * Uses custom high-fidelity artwork icons provided in /assets/icons/
 * with fallback to precision vector glyphs.
 */
export function AppIcon({
  id,
  size = 20,
  className = '',
  useCustomImage = true,
}: AppIconProps) {
  const customImg = APP_CUSTOM_ICONS[id];

  if (useCustomImage && customImg) {
    return (
      <img
        src={customImg}
        alt={id}
        width={size}
        height={size}
        className={`object-cover rounded-md select-none pointer-events-none shadow-sm ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // Fallback / Standalone Vector Glyphs
  const renderGlyph = () => {
    switch (id) {
      case 'studio':
        return (
          <div
            style={{ width: size, height: size }}
            className={`rounded-md bg-gradient-to-br from-[#1E232A] to-[#121518] border border-white/10 flex items-center justify-center p-1 shadow-sm ${className}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#C49B72" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="9" y1="4" x2="9" y2="20" />
              <line x1="13" y1="9" x2="17" y2="9" />
              <line x1="13" y1="13" x2="16" y2="13" />
            </svg>
          </div>
        );
      case 'browser':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <path d="M12 3a14 14 0 0 1 0 18" />
            <path d="M12 3a14 14 0 0 0 0 18" />
          </svg>
        );
      case 'about':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
          </svg>
        );
      case 'assistant':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z" />
          </svg>
        );
      case 'socials':
        return (
          <div
            style={{ width: size, height: size }}
            className={`rounded-md bg-gradient-to-br from-[#231B32] to-[#141020] border border-white/10 flex items-center justify-center p-1 shadow-sm ${className}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="6" r="3" />
              <circle cx="18" cy="18" r="3" />
              <line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
              <line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
            </svg>
          </div>
        );
      case 'notes':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h12l4 4v12H4V4z" />
            <path d="M16 4v4h4" />
            <line x1="8" y1="12" x2="14" y2="12" />
            <line x1="8" y1="16" x2="12" y2="16" />
          </svg>
        );
      case 'resume':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <circle cx="12" cy="8" r="2" />
            <line x1="8" y1="14" x2="16" y2="14" />
            <line x1="8" y1="17" x2="13" y2="17" />
          </svg>
        );
      case 'terminal':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M7 9l3 3-3 3" />
            <line x1="12" y1="15" x2="16" y2="15" />
          </svg>
        );
      case 'settings':
        return (
          <div
            style={{ width: size, height: size }}
            className={`rounded-md bg-gradient-to-br from-[#242A30] to-[#161A1E] border border-white/10 flex items-center justify-center p-1 shadow-sm ${className}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#C49B72" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <circle cx="12" cy="12" r="3.5" />
              <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
            </svg>
          </div>
        );
    }
  };

  return <span className={`inline-flex items-center justify-center ${className}`}>{renderGlyph()}</span>;
}
