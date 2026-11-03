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

const SHORTCUTS: DesktopShortcut[] = [
  { id: 'sc-about', name: 'About Rudar', appId: 'about' },
  { id: 'sc-safeware', name: 'SafeWare AI', appId: 'safeware' },
  { id: 'sc-trusight', name: 'TruSight AI', appId: 'trusight' },
  { id: 'sc-browser', name: 'Browser', appId: 'browser' },
  { id: 'sc-assistant', name: 'Rudar AI', appId: 'assistant' },
  { id: 'sc-terminal', name: 'Terminal', appId: 'terminal' },
  { id: 'sc-notes', name: 'Notes', appId: 'notes' },
];

export function DesktopIcons() {
  const { openWindow } = useOSStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDoubleClick = (sc: DesktopShortcut) => {
    openWindow(sc.appId, sc.initialData);
  };

  return (
    <div
      onClick={() => setSelectedId(null)}
      className="absolute top-12 left-6 z-desktopIcons flex flex-col gap-4 select-none pointer-events-auto"
    >
      {SHORTCUTS.map((sc) => {
        const isSelected = selectedId === sc.id;
        return (
          <div
            key={sc.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedId(sc.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleDoubleClick(sc);
            }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleDoubleClick(sc);
            }}
            className="w-20 flex flex-col items-center gap-1.5 p-1 rounded-md cursor-pointer group outline-none select-none"
          >
            {/* Real PC Desktop Icon: 100% borderless, unboxed, preserving true logo art */}
            <div className="w-12 h-12 flex items-center justify-center transition-transform duration-quick group-hover:scale-105 drop-shadow-[0_4px_12px_rgba(0,0,0,0.75)]">
              <AppIcon
                id={sc.appId}
                size={48}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* Clean Label with high-contrast text shadow */}
            <span
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.98), 0 0 8px rgba(0,0,0,0.95)' }}
              className={`text-xs font-sans text-center leading-tight tracking-normal line-clamp-2 px-1.5 py-0.5 rounded-sm transition-colors ${
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

