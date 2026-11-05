import { create } from 'zustand';
import { AppIconId } from '@/components/icons/AppIcons';
import { appRegistry } from '@/os/registry';

import { soundManager } from '@/lib/audio';

export interface WindowBounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WindowState {
  id: string;
  appId: AppIconId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  prevBounds?: WindowBounds;
  focused: boolean;
  initialData?: Record<string, unknown>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

interface WindowManagerStore {
  // OS Session State
  visitorName: string;
  isLoggedIn: boolean;
  isLiteMode: boolean;
  soundEnabled: boolean;
  reducedMotion: boolean;
  wallpaper: string;
  activeMenu: 'system' | 'view' | null;
  launcherOpen: boolean;

  // Window Manager State
  windows: WindowState[];
  nextZIndex: number;
  notifications: NotificationItem[];

  // Session Actions
  login: (name?: string) => void;
  logout: () => void;
  setVisitorName: (name: string) => void;
  setLiteMode: (enabled: boolean) => void;
  toggleSound: () => void;
  setReducedMotion: (enabled: boolean) => void;
  setActiveMenu: (menu: 'system' | 'view' | null) => void;
  setLauncherOpen: (open: boolean) => void;

  // Window Actions
  openWindow: (appId: AppIconId, initialData?: Record<string, unknown>) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  toggleMaximizeWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, w: number, h: number, x?: number, y?: number) => void;
  
  // Notification Actions
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  dismissNotification: (id: string) => void;
}

const BASE_Z_INDEX = 20;

export const useOSStore = create<WindowManagerStore>((set, get) => ({
  visitorName: 'Guest',
  isLoggedIn: false, // Starts at lock screen
  isLiteMode: false, // Evaluated dynamically via detectCapabilities()
  soundEnabled: false,
  reducedMotion: false,
  wallpaper: 'industrial-slate',
  activeMenu: null,
  launcherOpen: false,

  windows: [],
  nextZIndex: BASE_Z_INDEX + 1,
  notifications: [],

  login: (name) => {
    const finalName = name && name.trim() ? name.trim() : 'Guest';
    set({
      visitorName: finalName,
      isLoggedIn: true,
    });
    // Trigger clean system welcome notification
    setTimeout(() => {
      get().addNotification(
        'Rudar OS Workstation',
        `Welcome, ${finalName}! All systems initialized.`,
        'info'
      );
    }, 450);
  },

  logout: () => {
    set({
      isLoggedIn: false,
      windows: [],
      activeMenu: null,
      launcherOpen: false,
    });
  },

  setVisitorName: (name) => set({ visitorName: name }),
  setLiteMode: (enabled) => set({ isLiteMode: enabled }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
  setActiveMenu: (menu) => set({ activeMenu: menu }),
  setLauncherOpen: (open) => set({ launcherOpen: open }),

  openWindow: (appId, initialData) => {
    const { windows, nextZIndex } = get();
    const app = appRegistry[appId];

    if (!app) {
      console.error(`Attempted to open unregistered app: ${appId}`);
      return '';
    }

    // Check single-instance rule
    if (app.singleInstance) {
      const existing = windows.find((w) => w.appId === appId);
      if (existing) {
        if (existing.minimized) {
          get().restoreWindow(existing.id);
        } else {
          get().focusWindow(existing.id);
        }
        return existing.id;
      }
    }

    // Calculate smart cascaded position within viewport bounds
    const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800;
    const isMobile = viewportW < 768;

    const w = isMobile ? viewportW : Math.min(app.defaultSize.w, Math.max(app.minSize.w, viewportW - 48));
    const h = isMobile ? viewportH - 32 : Math.min(app.defaultSize.h, Math.max(app.minSize.h, viewportH - 120));

    // Cascade offset based on open windows count
    const openCount = windows.filter((win) => !win.minimized).length;
    const cascadeOffset = (openCount % 6) * 28;

    const x = isMobile ? 0 : Math.max(24, Math.min(viewportW - w - 24, 60 + cascadeOffset));
    const y = isMobile ? 32 : Math.max(50, Math.min(viewportH - h - 70, 60 + cascadeOffset));

    const id = `${appId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const newWindow: WindowState = {
      id,
      appId,
      title: app.title,
      x,
      y,
      w,
      h,
      z: nextZIndex,
      minimized: false,
      maximized: isMobile,
      focused: true,
      initialData,
    };

    set({
      windows: [...windows.map((win) => ({ ...win, focused: false })), newWindow],
      nextZIndex: nextZIndex + 1,
    });

    if (get().soundEnabled) {
      soundManager.playWindowOpen();
    }

    return id;
  },

  closeWindow: (id) => {
    const { windows } = get();
    const filtered = windows.filter((w) => w.id !== id);
    // If closed window was focused, focus the next highest z-index window
    if (filtered.length > 0) {
      const highest = [...filtered]
        .filter((w) => !w.minimized)
        .sort((a, b) => b.z - a.z)[0];
      if (highest) {
        highest.focused = true;
      }
    }
    set({ windows: filtered });
  },

  focusWindow: (id) => {
    const { windows, nextZIndex } = get();
    const target = windows.find((w) => w.id === id);
    if (!target) return;

    if (target.focused && !target.minimized) return;

    set({
      windows: windows.map((w) =>
        w.id === id
          ? { ...w, focused: true, minimized: false, z: nextZIndex }
          : { ...w, focused: false }
      ),
      nextZIndex: nextZIndex + 1,
    });
  },

  minimizeWindow: (id) => {
    const { windows } = get();
    const nextWindows = windows.map((w) =>
      w.id === id ? { ...w, minimized: true, focused: false } : w
    );
    // Shift focus to next highest window
    const activeRemaining = [...nextWindows]
      .filter((w) => !w.minimized)
      .sort((a, b) => b.z - a.z)[0];
    if (activeRemaining) {
      activeRemaining.focused = true;
    }
    set({ windows: nextWindows });
  },

  restoreWindow: (id) => {
    get().focusWindow(id);
  },

  toggleMaximizeWindow: (id) => {
    const { windows } = get();
    const win = windows.find((w) => w.id === id);
    if (!win) return;

    const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800;
    // Full screen: takes the entire viewport space edge-to-edge
    const maxBounds = {
      x: 0,
      y: 0,
      w: viewportW,
      h: viewportH,
    };

    if (win.maximized && win.prevBounds) {
      // Restore previous bounds
      set({
        windows: windows.map((w) =>
          w.id === id
            ? {
                ...w,
                maximized: false,
                x: win.prevBounds!.x,
                y: win.prevBounds!.y,
                w: win.prevBounds!.w,
                h: win.prevBounds!.h,
                prevBounds: undefined,
              }
            : w
        ),
      });
    } else {
      // Save current bounds and maximize
      set({
        windows: windows.map((w) =>
          w.id === id
            ? {
                ...w,
                maximized: true,
                prevBounds: { x: w.x, y: w.y, w: w.w, h: w.h },
                x: maxBounds.x,
                y: maxBounds.y,
                w: maxBounds.w,
                h: maxBounds.h,
              }
            : w
        ),
      });
    }
  },

  updateWindowPosition: (id, x, y) => {
    const { windows } = get();
    const win = windows.find((w) => w.id === id);
    if (!win || win.maximized) return;

    const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800;

    // Viewport clamp: titlebar must remain reachable
    const clampedX = Math.max(-win.w + 100, Math.min(viewportW - 100, x));
    const clampedY = Math.max(34, Math.min(viewportH - 60, y));

    set({
      windows: windows.map((w) =>
        w.id === id ? { ...w, x: clampedX, y: clampedY } : w
      ),
    });
  },

  updateWindowSize: (id, w, h, x, y) => {
    const { windows } = get();
    const win = windows.find((w) => w.id === id);
    if (!win || win.maximized) return;

    const app = appRegistry[win.appId];
    const minW = app ? app.minSize.w : 360;
    const minH = app ? app.minSize.h : 240;

    const clampedW = Math.max(minW, w);
    const clampedH = Math.max(minH, h);

    set({
      windows: windows.map((w) =>
        w.id === id
          ? {
              ...w,
              w: clampedW,
              h: clampedH,
              ...(x !== undefined ? { x } : {}),
              ...(y !== undefined ? { y } : {}),
            }
          : w
      ),
    });
  },

  addNotification: (title, message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    const newNote: NotificationItem = {
      id,
      title,
      message,
      type,
      timestamp: Date.now(),
    };

    // Keep max 3 toasts per PRD Section 6.1
    set((state) => ({
      notifications: [newNote, ...state.notifications].slice(0, 3),
    }));

    if (get().soundEnabled) {
      soundManager.playNotification();
    }

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      get().dismissNotification(id);
    }, 5000);
  },

  dismissNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));

