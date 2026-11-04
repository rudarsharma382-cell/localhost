'use client';

import React, { useEffect, useState } from 'react';
import { useOSStore } from '@/os/window-manager/store';
import { TopBar } from './TopBar';
import { Dock } from './Dock';
import { Notifications } from './Notifications';
import { LockScreen } from './LockScreen';
import { Window } from '@/os/window-manager/Window';
import { Launcher } from './Launcher';
import { DesktopWallpaper } from './DesktopWallpaper';
import { DesktopIcons } from './DesktopIcons';
import { BootSequence } from '@/components/boot/BootSequence';
import dynamic from 'next/dynamic';
import { detectCapabilities } from '@/lib/capabilities';
import { Maximize2, Minimize2 } from 'lucide-react';

const RoomScene = dynamic(() => import('@/scene/RoomScene').then((m) => m.RoomScene), {
  ssr: false,
});

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
  const [isMaximizedScreen, setIsMaximizedScreen] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

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

  // Lock screen view with Boot Video intro
  if (!isLoggedIn) {
    const shouldShow3D = !isLiteMode && (hasCheckedCapabilities ? use3DScene : true);

    return (
      <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#111315]">
        {isBooting && <BootSequence onComplete={() => setIsBooting(false)} />}
        {shouldShow3D ? (
          <RoomScene onHandoffComplete={() => setUse3DScene(false)} />
        ) : (
          <LockScreen />
        )}
      </div>
    );
  }

  // Full Screen Edge-to-Edge Desktop
  return (
    <div
      onClick={() => {
        if (activeMenu) setActiveMenu(null);
      }}
      className="fixed inset-0 w-full h-full overflow-hidden select-none font-sans bg-[#111315]"
    >
      {/* BMW Motorsport Desktop Wallpaper */}
      <DesktopWallpaper />

      {/* Desktop Grid Shortcuts */}
      <DesktopIcons />

      {/* Top Bar with System Menu & App Title */}
      <TopBar />

      {/* Window Manager Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[10]">
        {windows.map((win) => (
          <div key={win.id} className="pointer-events-auto">
            <Window window={win} />
          </div>
        ))}
      </div>

      {/* Toast Notifications */}
      <Notifications />

      {/* Quick Launcher (Cmd+K) */}
      <Launcher />

      {/* Application Dock */}
      <Dock />
    </div>
  );
}

export default Desktop;
