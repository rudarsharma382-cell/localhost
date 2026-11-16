'use client';

import React from 'react';
import { useOSStore } from '@/os/window-manager/store';
import { appRegistry, defaultDockApps } from '@/os/registry';
import { APP_CUSTOM_ICONS, AppIconId } from '@/components/icons/AppIcons';
import MacOSDock, { DockApp } from '@/components/ui/mac-os-dock';

export function Dock() {
  const { windows, openWindow, focusWindow, restoreWindow } = useOSStore();

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

  return (
    <nav
      aria-label="Dock"
      className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-[60] flex items-end select-none pointer-events-auto max-w-full px-2 overflow-visible"
    >
      <MacOSDock
        apps={dockApps}
        onAppClick={handleAppClick}
        openApps={openAppIds}
      />
    </nav>
  );
}

export default Dock;
