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

  // Lock screen view
  if (!isLoggedIn) {
    if (hasCheckedCapabilities && use3DScene && !isLiteMode) {
      return <RoomScene onHandoffComplete={() => setUse3DScene(false)} />;
    }
    return <LockScreen />;
  }

  // 90% Realistic Physical Monitor Bezel Framing the OS Desktop
  return (
    <div
      onClick={() => {
        if (activeMenu) setActiveMenu(null);
      }}
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden select-none font-sans bg-[#1B1220]"
    >
      {/* 1. Authentic Room Artwork Background visible outside the 90% bezels */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-500"
        style={{
          backgroundImage: `url('/assets/room-wall-bg.jpg')`,
          filter: 'brightness(0.60) saturate(1.15)',
        }}
      />

      {/* 2. Wooden Studio Desk Tabletop Surface directly underneath the physical monitor stand */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#A67848] via-[#BF8F5C]/80 to-transparent pointer-events-none border-t border-[#8B5E34]/30" />

      {/* 3. Subtle Atmospheric Room Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/55 pointer-events-none" />

      {/* Monitor Display Bezel Enclosure (90% - 92% screen size) */}
      <div
        className={`relative flex flex-col transition-all duration-300 ease-out ${
          isMaximizedScreen
            ? 'w-full h-full rounded-none border-0'
            : 'w-[94vw] h-[91vh] max-w-[1780px] max-h-[1000px] rounded-2xl border-[11px] border-[#15171B] shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.08)] bg-black ring-1 ring-white/5'
        }`}
      >
        {/* Inner Monitor Screen Area */}
        <div className="relative flex-1 w-full h-full overflow-hidden bg-[#111315]">
          {/* BMW M4 GTA Desktop Wallpaper */}
          <DesktopWallpaper />

          {/* Desktop Grid Shortcuts */}
          <DesktopIcons />

          {/* Top Bar with System Menu & App Title */}
          <TopBar />

          {/* Window Manager Layer */}
          <div className="absolute inset-0 pt-9 pb-16 pointer-events-none overflow-hidden">
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

        {/* Physical Monitor Chin (shown when in 90% Bezel Mode) */}
        {!isMaximizedScreen && (
          <div className="h-7 bg-[#141619] border-t border-white/10 flex items-center justify-between px-4 select-none shrink-0 text-zinc-400 text-[10px] font-sans">
            <div className="flex items-center gap-2">
              <span className="text-zinc-300">✦</span>
              <span className="tracking-wider text-zinc-300 font-medium">Rudar OS 4K Workstation</span>
            </div>

            <div className="font-sans tracking-[0.35em] text-zinc-300 text-[9px] uppercase font-bold">
              R U D A R
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMaximizedScreen(true)}
                className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                title="Expand to Fullscreen"
              >
                <Maximize2 size={11} />
                <span className="text-[9px] font-medium">Fullscreen</span>
              </button>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" title="Power ON" />
            </div>
          </div>
        )}
      </div>

      {/* Monitor Stand Base underneath Chassis */}
      {!isMaximizedScreen && (
        <div className="flex flex-col items-center pointer-events-none shrink-0 -mt-0.5">
          {/* Metallic Neck Column */}
          <div className="w-36 h-2.5 bg-gradient-to-b from-[#22252B] to-[#17191D] rounded-b-md shadow-lg border-x border-white/5" />
          {/* Slim Desk Base Plate */}
          <div className="w-60 h-1 bg-[#1A1C21] rounded-full shadow-2xl border-t border-white/10" />
        </div>
      )}

      {/* Exit Fullscreen Floating Button (when maximized) */}
      {isMaximizedScreen && (
        <button
          type="button"
          onClick={() => setIsMaximizedScreen(false)}
          className="absolute top-2 right-2 z-[999] px-2 py-1 rounded-md bg-black/70 hover:bg-black/90 border border-white/20 text-white text-[10px] flex items-center gap-1 backdrop-blur-md cursor-pointer shadow-lg"
          title="Return to 90% Bezel View"
        >
          <Minimize2 size={11} />
          <span>90% Bezel View</span>
        </button>
      )}
    </div>
  );
}

export default Desktop;
