'use client';

import React from 'react';
import { useOSStore } from '@/os/window-manager/store';
import { appRegistry } from '@/os/registry';
import MacOSMenuBar from '@/components/ui/mac-os-menu-bar';

export function TopBar() {
  const {
    windows,
    soundEnabled,
    toggleSound,
    logout,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    focusWindow,
    setLauncherOpen,
  } = useOSStore();

  const activeWin = windows.find((w) => w.focused && !w.minimized);
  const activeApp = activeWin ? appRegistry[activeWin.appId] : null;

  const handleMenuAction = (action: string) => {
    switch (action) {
      // System & App Navigation
      case 'about':
        openWindow('about');
        break;
      case 'safeware':
        openWindow('safeware');
        break;
      case 'trusight':
        openWindow('trusight');
        break;
      case 'portfolio':
        openWindow('browser', { initialUrl: '/portfolio/index.html' });
        break;
      case 'settings':
        openWindow('settings');
        break;
      case 'logout':
        logout();
        break;

      // File actions
      case 'new-window':
        if (activeWin) {
          openWindow(activeWin.appId);
        } else {
          openWindow('browser');
        }
        break;
      case 'open-browser':
        openWindow('browser');
        break;
      case 'open-terminal':
        openWindow('terminal');
        break;
      case 'close-window':
        if (activeWin) {
          closeWindow(activeWin.id);
        }
        break;

      // Window controls
      case 'minimize':
        if (activeWin) {
          minimizeWindow(activeWin.id);
        }
        break;
      case 'maximize':
        if (activeWin) {
          toggleMaximizeWindow(activeWin.id);
        }
        break;
      case 'bring-to-front':
        if (activeWin) {
          focusWindow(activeWin.id);
        }
        break;
      case 'close-all':
        windows.forEach((w) => closeWindow(w.id));
        break;

      // Quick links & shortcuts
      case 'safeware-web':
        openWindow('browser', { initialUrl: 'https://getsafeware.vercel.app/' });
        break;
      case 'bmw-site':
        openWindow('browser', { initialUrl: 'https://bmwm4csl.vercel.app/' });
        break;
      case 'shortcuts':
        setLauncherOpen(true);
        break;

      default:
        console.log('TopBar action:', action);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-topBar">
      <MacOSMenuBar
        appName={activeApp ? activeApp.title : 'Rudar OS'}
        onMenuAction={handleMenuAction}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />
    </header>
  );
}

export default TopBar;
