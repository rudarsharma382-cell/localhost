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
  | 'trusight'
  | 'certificates'
  | 'developer'
  | 'sandbox'
  | 'gallery';

export const APP_CUSTOM_ICONS: Partial<Record<AppIconId, string>> = {
  browser: '/assets/icons/browser.jpg',
  assistant: '/assets/icons/mybot.jpg',
  notes: '/assets/icons/notes.jpg',
  about: '/assets/icons/profile.jpg',
  terminal: '/assets/icons/terminal.jpg',
  resume: '/assets/icons/resume.jpg',
  certificates: '/assets/icons/certificate.jpg',
  sandbox: '/assets/icons/sandbox.jpg',
  gallery: '/assets/icons/gallery.jpg',
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
        if (size >= 32) {
          return (
            <div
              style={{ width: size, height: size }}
              className={`rounded-xl bg-gradient-to-br from-[#1E2530] via-[#141A22] to-[#0D1016] border border-white/10 flex items-center justify-center p-2.5 shadow-lg ${className}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#C49B72" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
          );
        }
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <circle cx="12" cy="8" r="2" />
            <line x1="8" y1="14" x2="16" y2="14" />
            <line x1="8" y1="17" x2="13" y2="17" />
          </svg>
        );
      case 'certificates':
        if (size >= 32) {
          return (
            <div
              style={{ width: size, height: size }}
              className={`rounded-xl bg-gradient-to-br from-[#2D2316] via-[#1E170E] to-[#140F08] border border-amber-500/20 flex items-center justify-center p-2.5 shadow-lg ${className}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#E5B566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                <circle cx="12" cy="8" r="2.5" fill="#E5B566" fillOpacity="0.3" />
              </svg>
            </div>
          );
        }
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        );
      case 'developer':
        if (size >= 32) {
          return (
            <div
              style={{ width: size, height: size }}
              className={`rounded-xl bg-gradient-to-br from-[#13222E] via-[#0E1720] to-[#090F14] border border-cyan-500/20 flex items-center justify-center p-2.5 shadow-lg ${className}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#67B8DE" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <path d="m7 8 3 2.5-3 2.5" />
                <line x1="12" y1="13" x2="16" y2="13" />
              </svg>
            </div>
          );
        }
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        );
      case 'sandbox':
        if (size >= 32) {
          return (
            <div
              style={{ width: size, height: size }}
              className={`rounded-xl bg-gradient-to-br from-[#122A1E] via-[#0D1D15] to-[#08120C] border border-emerald-500/20 flex items-center justify-center p-2.5 shadow-lg ${className}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#4EC988" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
          );
        }
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        );
      case 'gallery':
        if (size >= 32) {
          return (
            <div
              style={{ width: size, height: size }}
              className={`rounded-xl bg-gradient-to-br from-[#261A28] via-[#1A121C] to-[#120B13] border border-fuchsia-500/20 flex items-center justify-center p-2.5 shadow-lg ${className}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#DDA0DD" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          );
        }
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
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
