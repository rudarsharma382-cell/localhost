'use client';

import React, { useEffect, useState } from 'react';
import { useOSStore } from '@/os/window-manager/store';
import { TopBar } from './TopBar';
import { Dock } from './Dock';
import { Notifications } from './Notifications';
import { LockScreen } from './LockScreen';
import { Window } from '@/os/window-manager/Window';
import { LoginScene } from '@/scene/LoginScene';
import { detectCapabilities } from '@/lib/capabilities';

export function Desktop() {
  const {
    isLoggedIn,
    isLiteMode,
    setLiteMode,
    windows,
    activeMenu,
    setActiveMenu,
  } = useOSStore();

  const [hasCheckedCapabilities, setHasCheckedCapabilities] = useState(false);
  const [use3DScene, setUse3DScene] = useState(false);

  // Check device capabilities on mount
  useEffect(() => {
    const caps = detectCapabilities();
    if (caps.shouldUseLiteMode) {
      setLiteMode(true);
      setUse3DScene(false);
    } else {
      setUse3DScene(!isLiteMode);
    }
    setHasCheckedCapabilities(true);
  }, [isLiteMode, setLiteMode]);

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

  // If not logged in yet:
  if (!isLoggedIn) {
    if (hasCheckedCapabilities && use3DScene && !isLiteMode) {
      // 3D Room Login Scene with Dolly Push into Monitor
      return <LoginScene onHandoffComplete={() => setUse3DScene(false)} />;
    }
    // Clean 2D Lite Mode Lock Screen
    return <LockScreen />;
  }

  // Pure DOM Desktop after Login (GPU freed)
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
