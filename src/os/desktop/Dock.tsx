'use client';

import React, { useState } from 'react';
import { useOSStore } from '@/os/window-manager/store';
import { appRegistry, defaultDockApps } from '@/os/registry';
import { AppIcon, AppIconId } from '@/components/icons/AppIcons';

export function Dock() {
  const { windows, openWindow, focusWindow, restoreWindow } = useOSStore();
  const [hoveredApp, setHoveredApp] = useState<AppIconId | null>(null);

  const handleIconClick = (appId: AppIconId) => {
    const existing = windows.find((w) => w.appId === appId);
    if (!existing) {
      openWindow(appId);
      return;
    }

    if (existing.minimized) {
      restoreWindow(existing.id);
    } else if (existing.focused) {
      // If already focused, can remain or minimize
      // Standard desktop convention: clicking focused window keeps focus or toggles
    } else {
      focusWindow(existing.id);
    }
  };

  return (
    <nav
      aria-label="Application Dock"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-dock flex items-end gap-2 px-3 py-2 rounded-md bg-surface-base/90 backdrop-blur-md border border-border-default shadow-floating select-none"
    >
      {defaultDockApps.map((appId) => {
        const app = appRegistry[appId];
        if (!app) return null;

        const matchingWindows = windows.filter((w) => w.appId === appId);
        const isOpen = matchingWindows.length > 0;
        const isMinimized = isOpen && matchingWindows.every((w) => w.minimized);
        const isFocused = isOpen && matchingWindows.some((w) => w.focused);

        return (
          <div
            key={appId}
            className="relative flex flex-col items-center group"
            onMouseEnter={() => setHoveredApp(appId)}
            onMouseLeave={() => setHoveredApp(null)}
          >
            {/* Hover Tooltip Label */}
            {hoveredApp === appId && (
              <div className="absolute -top-9 px-2.5 py-1 rounded-sm bg-surface-raised border border-border-strong shadow-base text-content-primary font-sans text-xs whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-instant z-50">
                {app.title}
                {isMinimized && <span className="text-content-tertiary ml-1.5">(Minimized)</span>}
              </div>
            )}

            {/* App Icon Squircle Button */}
            <button
              onClick={() => handleIconClick(appId)}
              aria-label={`Open ${app.title}`}
              className={`w-10 h-10 rounded-md bg-[#1C1F23] border flex items-center justify-center relative transition-all duration-instant focus:outline-none focus:ring-1 focus:ring-accent ${
                isFocused
                  ? 'border-accent shadow-sm scale-105'
                  : 'border-[#2F343B] hover:border-border-strong hover:scale-105'
              }`}
            >
              <AppIcon id={appId} size={20} />
            </button>

            {/* Dock Open & State Indicator Dot */}
            <div className="h-1.5 flex items-center justify-center mt-1">
              {isOpen && (
                <span
                  className={`w-1 h-1 rounded-full transition-colors duration-quick ${
                    isFocused
                      ? 'bg-accent'
                      : isMinimized
                      ? 'bg-content-tertiary/70'
                      : 'bg-content-primary/80'
                  }`}
                />
              )}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
