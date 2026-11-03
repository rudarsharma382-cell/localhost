'use client';

import React, { useState, useEffect } from 'react';
import { useOSStore } from '@/os/window-manager/store';
import { appRegistry } from '@/os/registry';
import { AppIcon } from '@/components/icons/AppIcons';
import { Volume2, VolumeX } from 'lucide-react';

export function TopBar() {
  const {
    windows,
    soundEnabled,
    toggleSound,
    logout,
    openWindow,
    activeMenu,
    setActiveMenu,
  } = useOSStore();

  const [timeStr, setTimeStr] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const activeWin = windows.find((w) => w.focused && !w.minimized);
  const activeApp = activeWin ? appRegistry[activeWin.appId] : null;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="h-8 px-3.5 bg-[#121316]/90 backdrop-blur-xl border-b border-[#DDA0DD]/20 flex items-center justify-between select-none z-topBar relative text-xs font-sans">
      {/* Left: System Menu & Active App */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setActiveMenu(activeMenu === 'system' ? null : 'system')}
            aria-expanded={activeMenu === 'system'}
            aria-label="System Menu"
            className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-white/10 font-sans font-semibold text-white transition-colors duration-instant focus:outline-none cursor-pointer"
          >
            <span className="text-[#DDA0DD]">✦</span>
            <span>Rudar OS</span>
          </button>

          {activeMenu === 'system' && (
            <div className="absolute top-8 left-0 w-48 rounded-lg bg-[#181920] border border-[#DDA0DD]/30 shadow-2xl p-1.5 space-y-1 z-50 text-xs text-zinc-200">
              <button
                onClick={() => {
                  openWindow('about');
                  setActiveMenu(null);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors duration-instant cursor-pointer"
              >
                About Rudar
              </button>
              <button
                onClick={() => {
                  openWindow('safeware');
                  setActiveMenu(null);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors duration-instant cursor-pointer"
              >
                SafeWare AI
              </button>
              <button
                onClick={() => {
                  openWindow('trusight');
                  setActiveMenu(null);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors duration-instant cursor-pointer"
              >
                TruSight AI
              </button>
              <button
                onClick={() => {
                  openWindow('settings');
                  setActiveMenu(null);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors duration-instant cursor-pointer"
              >
                Settings
              </button>
              <div className="h-px bg-white/10 my-1" />
              <button
                onClick={() => {
                  setActiveMenu(null);
                  logout();
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-red-500/20 text-zinc-400 hover:text-red-300 transition-colors duration-instant cursor-pointer"
              >
                Lock / Log Out
              </button>
            </div>
          )}
        </div>

        {activeApp && (
          <div className="flex items-center gap-2 text-zinc-400 border-l border-white/10 pl-3">
            <AppIcon id={activeApp.id} size={14} className="text-[#DDA0DD]" />
            <span className="font-sans font-medium text-zinc-200 text-xs">{activeApp.title}</span>
          </div>
        )}
      </div>

      {/* Right: Indicators, Sound Toggle, and Clean Minimal Clock */}
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isOnline ? 'bg-emerald-400 shadow-[0_0_6px_#34D399]' : 'bg-red-400'
            }`}
          />
          <span className="text-[11px] hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        <button
          onClick={toggleSound}
          aria-label={soundEnabled ? 'Mute' : 'Unmute'}
          className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors duration-instant cursor-pointer"
        >
          {soundEnabled ? <Volume2 size={13} className="text-[#DDA0DD]" /> : <VolumeX size={13} />}
        </button>

        <span className="text-zinc-300 font-mono text-xs pl-1">
          {timeStr || '--:--'}
        </span>
      </div>
    </div>
  );
}

export default TopBar;
