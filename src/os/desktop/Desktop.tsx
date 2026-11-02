'use client';

import React, { useEffect } from 'react';
import { useOSStore } from '@/os/window-manager/store';
import { TopBar } from './TopBar';
import { Dock } from './Dock';
import { Notifications } from './Notifications';
import { LockScreen } from './LockScreen';
import { Window } from '@/os/window-manager/Window';

export function Desktop() {
  const {
    isLoggedIn,
    windows,
    activeMenu,
    setActiveMenu,
  } = useOSStore();

  // Global keyboard shortcuts (Esc closes menus)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeMenu) {
          setActiveMenu(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMenu, setActiveMenu]);

  // If not logged in, render the clean 2D lock screen
  if (!isLoggedIn) {
    return <LockScreen />;
  }

  return (
    <div
      onClick={() => {
        if (activeMenu) setActiveMenu(null);
      }}
      className="fixed inset-0 overflow-hidden bg-surface-canvas select-none font-sans"
    >
      {/* OS Wallpaper: Textured Industrial Slate Ground */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="os-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22262B" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#os-grid)" />
        </svg>
      </div>

      {/* Top Bar */}
      <TopBar />

      {/* Window Manager Layer */}
      <div className="absolute inset-0 pt-[34px] pb-[70px] pointer-events-none overflow-hidden">
        {windows.map((win) => (
          <div key={win.id} className="pointer-events-auto">
            <Window window={win} />
          </div>
        ))}
      </div>

      {/* Toast Notifications */}
      <Notifications />

      {/* Application Dock */}
      <Dock />
    </div>
  );
}
