'use client';

import React, { useState } from 'react';
import { useOSStore } from '@/os/window-manager/store';
import { AppIcon, AppIconId } from '@/components/icons/AppIcons';

interface DesktopShortcut {
  id: string;
  name: string;
  appId: AppIconId;
  initialData?: Record<string, unknown>;
}

// Full PC Desktop Shortcuts (Developer icon removed as requested)
const SHORTCUTS: DesktopShortcut[] = [
  { id: 'sc-about', name: 'About Rudar', appId: 'about' },
  { id: 'sc-resume', name: 'Resume.exe', appId: 'resume' },
  { id: 'sc-certificates', name: 'Certificates', appId: 'certificates' },
  { id: 'sc-sandbox', name: 'Sandbox.exe', appId: 'sandbox' },
  { id: 'sc-gallery', name: 'Gallery.exe', appId: 'gallery' },
  { id: 'sc-safeware', name: 'SafeWare AI', appId: 'safeware' },
  { id: 'sc-trusight', name: 'TruSight AI', appId: 'trusight' },
  { id: 'sc-browser', name: 'Browser', appId: 'browser' },
  { id: 'sc-assistant', name: 'Rudar AI', appId: 'assistant' },
  { id: 'sc-notes', name: 'Notes', appId: 'notes' },
  { id: 'sc-terminal', name: 'Terminal', appId: 'terminal' },
];

export function DesktopIcons() {
  const { openWindow } = useOSStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleOpen = (sc: DesktopShortcut) => {
    openWindow(sc.appId, sc.initialData);
    setSelectedId(null);
  };

  const handleClick = (sc: DesktopShortcut) => {
    // If mobile screen (< 768px) or already selected, tap directly opens the app!
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      handleOpen(sc);
    } else if (selectedId === sc.id) {
      handleOpen(sc);
    } else {
      setSelectedId(sc.id);
    }
  };

  return (
    <div
      onClick={() => setSelectedId(null)}
      className="absolute top-10 sm:top-12 left-3 sm:left-6 z-desktopIcons flex flex-col flex-wrap max-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-120px)] content-start gap-y-2 sm:gap-y-3 gap-x-1.5 sm:gap-x-2 select-none pointer-events-auto max-w-[calc(100vw-24px)] overflow-x-auto no-scrollbar"
    >
      {SHORTCUTS.map((sc) => {
        const isSelected = selectedId === sc.id;
        return (
          <div
            key={sc.id}
            onClick={(e) => {
              e.stopPropagation();
              handleClick(sc);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleOpen(sc);
            }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleOpen(sc);
            }}
            className="w-16 sm:w-20 flex flex-col items-center gap-1 sm:gap-1.5 p-1 rounded-md cursor-pointer group outline-none select-none"
          >
            {/* Real PC Desktop Icon: 100% borderless, unboxed, preserving true logo art */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-quick group-hover:scale-105 drop-shadow-[0_4px_12px_rgba(0,0,0,0.75)]">
              <AppIcon
                id={sc.appId}
                size={48}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* Clean Label with Playpen font and high-contrast text shadow */}
            <span
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.98), 0 0 8px rgba(0,0,0,0.95)' }}
              className={`text-[10px] sm:text-xs font-playpen font-medium text-center leading-tight tracking-normal line-clamp-2 px-1 sm:px-1.5 py-0.5 rounded-sm transition-colors ${
                isSelected
                  ? 'text-white font-medium bg-blue-600/75 backdrop-blur-sm shadow-sm'
                  : 'text-white/95 group-hover:text-white'
              }`}
            >
              {sc.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
