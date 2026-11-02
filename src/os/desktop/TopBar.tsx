'use client';

import React, { useState, useEffect } from 'react';
import { useOSStore } from '@/os/window-manager/store';
import { appRegistry } from '@/os/registry';
import { AppIcon } from '@/components/icons/AppIcons';
import { Volume2, VolumeX, Globe } from 'lucide-react';

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

  // Active focused window
  const activeWin = windows.find((w) => w.focused && !w.minimized);
  const activeApp = activeWin ? appRegistry[activeWin.appId] : null;

  // Real clock (HH:mm)
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

  // Real online status from navigator.onLine
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
    <div className="h-[34px] px-3.5 bg-surface-base/95 backdrop-blur-md border-b border-border-default flex items-center justify-between select-none z-topBar relative text-xs font-sans">
      {/* Left: System Menu & Active App */}
      <div className="flex items-center gap-3">
        {/* System Menu Button */}
        <div className="relative">
          <button
            onClick={() => setActiveMenu(activeMenu === 'system' ? null : 'system')}
            aria-expanded={activeMenu === 'system'}
            aria-label="System Menu"
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm hover:bg-surface-raised font-display font-bold text-content-primary transition-colors duration-instant focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>RUDAR OS</span>
          </button>

          {/* System Dropdown */}
          {activeMenu === 'system' && (
            <div className="absolute top-[32px] left-0 w-48 rounded-md bg-surface-raised border border-border-strong shadow-floating p-1 space-y-0.5 z-50 text-xs">
              <button
                onClick={() => {
                  openWindow('about');
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 rounded-sm hover:bg-accent/15 hover:text-accent text-content-primary flex items-center justify-between transition-colors duration-instant"
              >
                <span>About Rudar OS</span>
                <span className="text-[10px] font-mono text-content-tertiary">v0.1</span>
              </button>
              <button
                onClick={() => {
                  openWindow('settings');
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 rounded-sm hover:bg-accent/15 hover:text-accent text-content-primary flex items-center justify-between transition-colors duration-instant"
              >
                <span>System Settings</span>
              </button>
              <div className="h-[1px] bg-border-subtle my-1" />
              <button
                onClick={() => {
                  setActiveMenu(null);
                  logout();
                }}
                className="w-full text-left px-3 py-1.5 rounded-sm hover:bg-semantic-error/15 hover:text-semantic-error text-content-primary flex items-center justify-between transition-colors duration-instant"
              >
                <span>Log Out</span>
                <span className="text-[10px] font-mono text-content-tertiary">&rarr;</span>
              </button>
            </div>
          )}
        </div>

        {/* Focused App Name */}
        {activeApp && (
          <div className="flex items-center gap-1.5 text-content-secondary border-l border-border-subtle pl-3">
            <AppIcon id={activeApp.id} size={13} className="opacity-90" />
            <span className="font-medium text-content-primary text-xs">{activeApp.title}</span>
          </div>
        )}
      </div>

      {/* Right: Only REAL indicators (Clock, Sound Toggle, Online Status) */}
      <div className="flex items-center gap-3 font-mono text-xs">
        {/* Real Online Status */}
        <div
          className="flex items-center gap-1.5 text-content-tertiary"
          title={isOnline ? 'Network status: Online' : 'Network status: Offline'}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isOnline ? 'bg-semantic-success' : 'bg-semantic-error'
            }`}
          />
          <span className="text-[11px] hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        {/* Real Sound Toggle */}
        <button
          onClick={toggleSound}
          aria-label={soundEnabled ? 'Mute system sound' : 'Unmute system sound'}
          className="p-1 rounded-sm hover:bg-surface-panel text-content-secondary hover:text-content-primary transition-colors duration-instant"
        >
          {soundEnabled ? <Volume2 size={13} className="text-accent" /> : <VolumeX size={13} />}
        </button>

        {/* Real Clock */}
        <div className="px-1.5 py-0.5 rounded-sm bg-surface-panel/80 border border-border-subtle font-medium text-content-primary text-xs">
          {timeStr || '--:--'}
        </div>
      </div>
    </div>
  );
}

