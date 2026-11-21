'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOSStore } from '@/os/window-manager/store';
import { appRegistry, defaultDockApps } from '@/os/registry';
import { APP_CUSTOM_ICONS, AppIconId } from '@/components/icons/AppIcons';
import MacOSDock, { DockApp } from '@/components/ui/mac-os-dock';

export function Dock() {
  const { windows, openWindow, focusWindow, restoreWindow } = useOSStore();
  const [isHovered, setIsHovered] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if any non-minimized window is currently open
  const hasOpenWindows = windows.some((w) => !w.minimized);

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 280);
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const handleAppClick = (appId: string) => {
    const iconId = appId as AppIconId;
    const existing = windows.find((w) => w.appId === iconId);
    if (!existing) {
      openWindow(iconId);
      return;
    }

    if (existing.minimized) {
      restoreWindow(existing.id);
    } else {
      focusWindow(existing.id);
    }
  };

  // Map system apps to DockApp items using the user's custom high-fidelity icons
  const dockApps: DockApp[] = defaultDockApps.map((appId) => {
    const app = appRegistry[appId];
    const customIcon = APP_CUSTOM_ICONS[appId] || '';
    return {
      id: appId,
      name: app ? app.title : appId,
      icon: customIcon,
    };
  });

  // Open apps for bottom indicator dots
  const openAppIds = Array.from(new Set(windows.map((w) => w.appId)));

  // Auto-hide rule: When an app is open, taskbar hides unless user hovers the bottom edge
  const shouldShow = !hasOpenWindows || isHovered;

  return (
    <>
      {/* Invisible bottom trigger strip when an app is open and taskbar is hidden */}
      {hasOpenWindows && (
        <div
          aria-hidden="true"
          className="fixed bottom-0 left-0 right-0 h-4 z-[59] pointer-events-auto cursor-default"
          onMouseEnter={handleMouseEnter}
        />
      )}

      {/* Dock container */}
      <nav
        aria-label="Dock"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-[60] flex items-end select-none max-w-full px-2 overflow-visible ${
          shouldShow
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-[calc(100%+32px)] opacity-0 pointer-events-none'
        }`}
        style={{
          transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease-out',
        }}
      >
        <MacOSDock
          apps={dockApps}
          onAppClick={handleAppClick}
          openApps={openAppIds}
        />
      </nav>
    </>
  );
}

export default Dock;
