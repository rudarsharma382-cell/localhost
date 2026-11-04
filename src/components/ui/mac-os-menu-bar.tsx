'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Types
export interface MenuItemOption {
  label?: string;
  action?: string;
  shortcut?: string;
  type?: 'item' | 'separator';
  hasSubmenu?: boolean;
}

export interface MenuConfig {
  label: string;
  items: MenuItemOption[];
}

export interface MacOSMenuBarProps {
  appName?: string;
  logoSrc?: string;
  menus?: MenuConfig[];
  appleMenuItems?: MenuItemOption[];
  onMenuAction?: (action: string) => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  className?: string;
}

// Default menus with only the features actually in use
export const DEFAULT_MENUS: MenuConfig[] = [
  {
    label: 'File',
    items: [
      { label: 'New Window', action: 'new-window', shortcut: '⌘N' },
      { label: 'Open Browser', action: 'open-browser', shortcut: '⌘B' },
      { label: 'Open Terminal', action: 'open-terminal', shortcut: '⌘T' },
      { type: 'separator' },
      { label: 'Close Window', action: 'close-window', shortcut: '⌘W' },
    ],
  },
  {
    label: 'Window',
    items: [
      { label: 'Minimize', action: 'minimize', shortcut: '⌘M' },
      { label: 'Full Space / Maximize', action: 'maximize', shortcut: '⌃⌘F' },
      { type: 'separator' },
      { label: 'Bring All to Front', action: 'bring-to-front' },
      { label: 'Close All Windows', action: 'close-all' },
    ],
  },
  {
    label: 'Help',
    items: [
      { label: 'About Rudar', action: 'about' },
      { label: 'Official Portfolio', action: 'portfolio' },
      { label: 'SafeWare Live Site', action: 'safeware-web' },
      { type: 'separator' },
      { label: 'Launcher Shortcuts', action: 'shortcuts', shortcut: '⌘K' },
    ],
  },
];

// System / Apple menu items with only active features
export const DEFAULT_APPLE_MENU_ITEMS: MenuItemOption[] = [
  { label: 'About Rudar OS', action: 'about', shortcut: '⌘I' },
  { type: 'separator' },
  { label: 'SafeWare AI', action: 'safeware' },
  { label: 'TruSight AI', action: 'trusight' },
  { label: 'Official Portfolio', action: 'portfolio' },
  { label: 'Settings', action: 'settings', shortcut: '⌘,' },
  { type: 'separator' },
  { label: 'Lock / Log Out', action: 'logout', shortcut: '⌃⌘Q' },
];

// MenuDropdown Component
interface MenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItemOption[];
  position: { x: number; y: number };
  onAction?: (action: string) => void;
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({
  isOpen,
  onClose,
  items,
  position,
  onAction,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute backdrop-blur-xl z-[70] select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        background: 'rgba(18, 20, 26, 0.82)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '8px',
        boxShadow: `
          0 12px 36px rgba(0, 0, 0, 0.45),
          0 2px 8px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.12)
        `,
        minWidth: '210px',
        animation: 'menuFadeIn 0.15s cubic-bezier(0.23, 1, 0.32, 1) forwards',
      }}
    >
      <div className="py-1">
        {items.map((item, index) => {
          if (item.type === 'separator') {
            return (
              <div
                key={index}
                className="h-px bg-white/10 mx-2 my-1"
              />
            );
          }

          return (
            <div
              key={index}
              className="px-3.5 py-1 text-zinc-200 text-xs cursor-pointer hover:bg-white/15 hover:text-white transition-colors duration-100 flex justify-between items-center rounded mx-1"
              onClick={() => {
                if (item.action) {
                  onAction?.(item.action);
                }
                onClose();
              }}
            >
              <span className="flex items-center">
                {item.label}
                {item.hasSubmenu && (
                  <span className="ml-2 text-[10px] opacity-70">▶</span>
                )}
              </span>
              {item.shortcut && (
                <span className="text-[11px] text-zinc-400 font-mono ml-4">
                  {item.shortcut}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * MacOS Menu Bar Component
 *
 * Transparent glassmorphic top menu bar with live clock,
 * system controls, and active app menus.
 */
export const MacOSMenuBar: React.FC<MacOSMenuBarProps> = ({
  appName = 'Rudar OS',
  logoSrc = '/assets/icons/rs-logo-white.png',
  menus = DEFAULT_MENUS,
  appleMenuItems = DEFAULT_APPLE_MENU_ITEMS,
  onMenuAction,
  soundEnabled = true,
  onToggleSound,
  className = '',
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const appleLogoRef = useRef<HTMLDivElement>(null);
  const menuRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({});

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAppleMenuClick = useCallback(() => {
    if (activeMenu === 'apple') {
      setActiveMenu(null);
    } else {
      if (appleLogoRef.current) {
        const rect = appleLogoRef.current.getBoundingClientRect();
        const parentRect = appleLogoRef.current.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };
        setDropdownPosition({
          x: Math.max(8, rect.left - parentRect.left),
          y: 34,
        });
      }
      setActiveMenu('apple');
    }
  }, [activeMenu]);

  const handleMenuItemClick = useCallback((menuLabel: string) => {
    if (activeMenu === menuLabel) {
      setActiveMenu(null);
    } else {
      const menuRef = menuRefs.current[menuLabel];
      if (menuRef) {
        const rect = menuRef.getBoundingClientRect();
        const parentRect = menuRef.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };
        setDropdownPosition({
          x: rect.left - parentRect.left,
          y: 34,
        });
        setActiveMenu(menuLabel);
      }
    }
  }, [activeMenu]);

  const closeDropdown = useCallback(() => {
    setActiveMenu(null);
  }, []);

  const handleMenuAction = useCallback((action: string) => {
    if (action === 'toggle-sound') {
      onToggleSound?.();
      return;
    }
    onMenuAction?.(action);
  }, [onMenuAction, onToggleSound]);

  return (
    <div className="relative w-full z-topBar select-none">
      <div
        className={`w-full backdrop-blur-md transition-all duration-150 ${className}`}
        style={{
          height: '32px',
          background: 'rgba(10, 12, 16, 0.28)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div className="flex justify-between items-center h-full px-3.5">
          {/* Left section - Apple/System logo and app menus */}
          <div className="flex items-center space-x-3.5">
            {/* Rudar Sharma Monogram Logo */}
            <div
              ref={appleLogoRef}
              onClick={handleAppleMenuClick}
              className="cursor-pointer hover:opacity-80 transition-all duration-150 py-0.5 px-1 rounded hover:bg-white/10 flex items-center justify-center"
              title="System Menu"
            >
              <img
                src={logoSrc}
                alt="Rudar OS"
                className="h-4 w-auto max-w-[28px] object-contain select-none filter drop-shadow-[0_1px_4px_rgba(255,255,255,0.3)]"
                draggable={false}
              />
            </div>

            {/* Current App Name */}
            <span className="text-white text-xs font-semibold tracking-wide drop-shadow-sm">
              {appName}
            </span>

            {/* Menu Items */}
            <div className="flex items-center space-x-4">
              {menus.map((menu) => (
                <span
                  key={menu.label}
                  ref={(el) => { menuRefs.current[menu.label] = el; }}
                  className="text-zinc-200 hover:text-white text-xs cursor-pointer py-0.5 px-1.5 rounded hover:bg-white/10 transition-colors duration-100 select-none"
                  onClick={() => handleMenuItemClick(menu.label)}
                >
                  {menu.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right section - status icons, sound and clock */}
          <div className="flex items-center space-x-3 text-xs">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              className="cursor-pointer p-1 rounded hover:bg-white/10 transition-colors duration-100 text-zinc-300 hover:text-white"
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              aria-label="Sound Toggle"
            >
              {soundEnabled ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
              )}
            </button>

            {/* Battery */}
            <div className="cursor-pointer hover:opacity-80 transition-opacity duration-150" title="Battery: 100% (Plugged In)">
              <svg width="22" height="11" viewBox="0 0 190 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0 C0.82 -0.01 1.64 -0.01 2.49 -0.02 C5.2 -0.03 7.91 -0.03 10.62 -0.03 C12.5 -0.03 14.39 -0.03 16.28 -0.04 C20.23 -0.05 24.18 -0.05 28.13 -0.04 C33.19 -0.04 38.25 -0.05 43.31 -0.08 C47.2 -0.09 51.1 -0.09 54.99 -0.09 C56.86 -0.09 58.73 -0.09 60.59 -0.1 C63.2 -0.12 65.81 -0.11 68.42 -0.1 C69.19 -0.11 69.96 -0.11 70.75 -0.12 C76.49 -0.06 79.69 1.26 83.71 5.27 C85.12 9.06 84.89 13.09 84.91 17.08 C84.92 17.83 84.92 18.58 84.93 19.36 C84.94 20.96 84.95 22.55 84.95 24.15 C84.96 26.57 84.99 28.99 85.02 31.41 C85.03 32.97 85.03 34.52 85.04 36.08 C85.05 36.79 85.06 37.51 85.07 38.25 C85.05 43.4 84.25 46.87 81.71 51.27 C77.44 53.68 73.1 53.56 68.33 53.55 C67.49 53.55 66.66 53.56 65.81 53.56 C63.07 53.58 60.32 53.58 57.58 53.58 C55.67 53.58 53.77 53.58 51.86 53.59 C47.86 53.6 43.86 53.6 39.86 53.59 C34.74 53.58 29.62 53.6 24.5 53.62 C20.56 53.64 16.62 53.64 12.68 53.64 C10.79 53.64 8.9 53.64 7.01 53.65 C4.37 53.67 1.73 53.66 -0.91 53.65 C-2.08 53.66 -2.08 53.66 -3.27 53.67 C-7.79 53.63 -10.68 53.05 -14.29 50.27 C-17.12 46.66 -16.6 42.17 -16.59 37.78 C-16.6 36.96 -16.6 36.14 -16.6 35.29 C-16.61 33.55 -16.61 31.81 -16.61 30.07 C-16.6 27.42 -16.63 24.77 -16.65 22.11 C-16.65 20.42 -16.66 18.73 -16.65 17.03 C-16.66 16.24 -16.67 15.46 -16.68 14.65 C-16.64 9.84 -16.12 6.35 -13.29 2.27 C-9.01 -0.07 -4.76 -0.02 0 0 Z " fill="#FFFFFF" transform="translate(31.291015625,14.725341796875)"/>
                <path d="M0 0 C1.04 -0.01 2.07 -0.01 3.14 -0.02 C4.27 -0.02 5.4 -0.02 6.57 -0.02 C8.36 -0.03 8.36 -0.03 10.19 -0.04 C13.47 -0.05 16.74 -0.06 20.02 -0.06 C22.07 -0.06 24.12 -0.07 26.17 -0.07 C32.6 -0.08 39.02 -0.09 45.44 -0.1 C52.84 -0.1 60.24 -0.12 67.64 -0.15 C73.37 -0.17 79.1 -0.18 84.83 -0.18 C88.24 -0.18 91.66 -0.19 95.08 -0.21 C98.9 -0.22 102.71 -0.22 106.53 -0.22 C107.65 -0.23 108.77 -0.23 109.93 -0.24 C117.95 -0.2 124.42 0.86 131.18 5.33 C136.31 10.69 138.96 16.98 139.03 24.4 C139.04 25.23 139.05 26.06 139.06 26.92 C139.07 28.26 139.07 28.26 139.08 29.62 C139.08 30.55 139.09 31.48 139.09 32.43 C139.1 34.39 139.11 36.36 139.11 38.32 C139.12 41.3 139.15 44.28 139.18 47.26 C139.19 49.17 139.2 51.08 139.2 53 C139.21 53.88 139.22 54.76 139.24 55.67 C139.21 62.81 138.04 69.65 133.62 75.45 C121.36 87.44 100.42 84.44 84.56 84.41 C82.33 84.41 80.11 84.41 77.88 84.41 C73.24 84.41 68.6 84.41 63.96 84.4 C58.06 84.39 52.16 84.4 46.25 84.41 C41.67 84.42 37.08 84.41 32.49 84.41 C30.31 84.41 28.14 84.41 25.96 84.41 C-10.09 84.47 -10.09 84.47 -18.13 77.14 C-23.9 71.36 -25.46 64.46 -25.54 56.58 C-25.54 55.66 -25.53 54.74 -25.53 53.8 C-25.53 52.83 -25.53 51.86 -25.54 50.86 C-25.54 48.82 -25.53 46.79 -25.52 44.75 C-25.5 41.65 -25.52 38.55 -25.54 35.45 C-25.54 33.46 -25.53 31.47 -25.53 29.48 C-25.53 28.57 -25.54 27.65 -25.54 26.7 C-25.47 19.42 -24.08 14.04 -19.94 7.89 C-14.29 2.36 -7.84 0.03 0 0 Z M-12.13 14.83 C-16.85 22.65 -16.47 31.04 -16.44 39.92 C-16.44 42.07 -16.46 44.22 -16.49 46.37 C-16.73 58.23 -16.73 58.23 -11.85 68.71 C-5.34 74.75 2.68 74.44 10.99 74.42 C12.09 74.42 13.19 74.43 14.32 74.43 C17.94 74.44 21.56 74.44 25.18 74.44 C27.7 74.45 30.23 74.45 32.75 74.45 C38.04 74.46 43.32 74.46 48.61 74.46 C54.71 74.45 60.8 74.46 66.89 74.48 C72.78 74.5 78.66 74.51 84.54 74.5 C87.04 74.5 89.53 74.51 92.02 74.52 C95.51 74.53 99 74.52 102.5 74.51 C103.52 74.52 104.54 74.53 105.6 74.54 C113.23 74.48 120.02 73.75 125.81 68.45 C130.56 60.82 130.22 52.57 130.19 43.84 C130.18 41.78 130.21 39.71 130.23 37.65 C130.41 25.44 130.41 25.44 125.63 14.5 C119.19 8.44 110.1 8.85 101.84 8.87 C100.76 8.86 99.69 8.86 98.58 8.85 C95.03 8.84 91.49 8.84 87.94 8.84 C85.47 8.84 82.99 8.83 80.52 8.83 C75.33 8.82 70.15 8.82 64.97 8.82 C58.34 8.83 51.71 8.81 45.09 8.79 C39.98 8.78 34.87 8.77 29.75 8.78 C27.31 8.78 24.87 8.77 22.43 8.76 C19 8.75 15.58 8.76 12.16 8.77 C11.16 8.76 10.16 8.75 9.14 8.74 C1.89 8.8 -6.88 9.18 -12.13 14.83 Z " fill="#FFFFFF" transform="translate(25.127975463867188,-0.14044189453125)"/>
                <path d="M0 0 C6.61 2.2 7.27 2.78 11 8 C12.64 12.91 12.5 17.88 12 23 C10.19 26.56 10.19 26.56 8 29 C7.29 29.9 7.29 29.9 6.56 30.81 C5 32 5 32 0 33 C0 22.11 0 11.22 0 0 Z " fill="#FFFFFF" transform="translate(171,25)"/>
              </svg>
            </div>

            {/* WiFi */}
            <div className="cursor-pointer hover:opacity-80 transition-opacity duration-150" title="Wi-Fi: Connected">
              <svg width="18" height="13" viewBox="0 0 150 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0 C0.66 0.21 1.31 0.42 1.98 0.63 C14.82 4.91 25.8 11.81 35.81 20.81 C36.58 21.5 36.58 21.5 37.36 22.19 C39.29 24.01 40.84 25.68 42.02 28.07 C41.99 30.93 40.74 32 38.81 34.06 C38.2 34.73 37.59 35.41 36.96 36.1 C33.08 39.87 33.08 39.87 31 41 C26.85 40.07 24.52 37.81 21.56 34.88 C4.57 19.28 -16.81 15.08 -39.23 15.83 C-58.93 17.04 -76.63 28.19 -91 41 C-96.18 39.59 -99.97 36.35 -103 32 C-103.4 28.28 -102.98 26.38 -100.8 23.32 C-76.42 -3.27 -33.31 -10.63 0 0 Z" fill="#FFFFFF" transform="translate(103,4)"/>
                <path d="M0 0 C1.9 2.05 1.9 2.05 2.9 5.05 C0.9 8 -1.66 10.47 -4.1 13.05 C-5.15 14.32 -5.15 14.32 -6.23 15.61 C-8.1 17.05 -8.1 17.05 -10.46 16.84 C-13.42 15.96 -14.91 14.82 -17.23 12.8 C-27.99 4.04 -39.59 1.83 -53.1 3.05 C-61.85 4.93 -69.21 9.61 -75.85 15.49 C-78.1 17.05 -78.1 17.05 -80.44 16.91 C-83.78 15.83 -85.44 14.28 -87.91 11.8 C-88.7 11.03 -89.49 10.26 -90.31 9.47 C-92.1 7.05 -92.1 7.05 -92.62 4.53 C-91.5 -0.82 -86.3 -3.87 -82.1 -6.95 C-74.22 -11.67 -66.12 -15.17 -57.1 -16.95 C-56.39 -17.09 -55.68 -17.23 -54.95 -17.38 C-34.5 -20.5 -15 -13.7 0 0 Z" fill="#FFFFFF" transform="translate(117.1015625,53.94921875)"/>
                <path d="M0 0 C2.56 1.51 3.97 2.75 6 5 C6.52 7.25 6.52 7.25 6 10 C4.24 12.44 2.12 14.44 -0.06 16.5 C-0.62 17.06 -1.19 17.61 -1.76 18.18 C-5.58 21.89 -9.39 25.31 -14 28 C-19.8 26.44 -23.6 22.19 -27.88 18.19 C-28.67 17.48 -29.47 16.76 -30.29 16.03 C-31.04 15.33 -31.78 14.64 -32.55 13.92 C-33.24 13.29 -33.93 12.66 -34.63 12 C-36 10 -36 10 -35.83 7.42 C-34.58 3.79 -33.04 2.37 -30 0 C-19 -5.3 -11.01 -5.16 0 0 Z" fill="#FFFFFF" transform="translate(87,77)"/>
              </svg>
            </div>

            {/* Clock */}
            <span className="text-zinc-200 text-xs font-mono select-none pl-1 font-medium tracking-tight">
              {currentTime || '--:--'}
            </span>
          </div>
        </div>
      </div>

      {/* Apple / System Menu Dropdown */}
      <MenuDropdown
        isOpen={activeMenu === 'apple'}
        onClose={closeDropdown}
        items={appleMenuItems}
        position={dropdownPosition}
        onAction={handleMenuAction}
      />

      {/* App Menus Dropdowns */}
      {menus.map((menu) => (
        <MenuDropdown
          key={menu.label}
          isOpen={activeMenu === menu.label}
          onClose={closeDropdown}
          items={menu.items}
          position={dropdownPosition}
          onAction={handleMenuAction}
        />
      ))}
    </div>
  );
};

export default MacOSMenuBar;
