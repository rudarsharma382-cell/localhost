'use client';

import React from 'react';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { Volume2, VolumeX, Eye, RotateCcw, Info, Sparkles } from 'lucide-react';

interface SettingsAppProps {
  windowId: string;
}

export default function SettingsApp({ windowId }: SettingsAppProps) {
  const {
    closeWindow,
    soundEnabled,
    toggleSound,
    reducedMotion,
    setReducedMotion,
    isLiteMode,
    setLiteMode,
    logout,
  } = useOSStore();

  return (
    <AppFrame
      appId="settings"
      title="System Settings"
      onBack={() => closeWindow(windowId)}
      className="flex-1"
    >
      <div className="h-full bg-surface-panel p-6 overflow-y-auto font-sans select-text text-content-primary space-y-6 max-w-xl mx-auto">
        <div className="space-y-1">
          <h1 className="text-base font-semibold text-content-primary">System Preferences</h1>
          <p className="text-xs text-content-secondary">
            Configure desktop motion, audio signals, and performance modes.
          </p>
        </div>

        {/* Setting Items */}
        <div className="space-y-3">
          {/* Sound Toggle */}
          <div className="p-4 rounded-md bg-surface-base border border-border-default flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-content-primary flex items-center gap-2">
                {soundEnabled ? <Volume2 size={14} className="text-accent" /> : <VolumeX size={14} />}
                <span>System Audio Clicks</span>
              </div>
              <p className="text-[11px] text-content-secondary">
                Quiet tactile feedback on window actions and key presses.
              </p>
            </div>
            <button
              onClick={toggleSound}
              className={`w-10 h-5 rounded-full p-0.5 border transition-colors duration-quick ${
                soundEnabled ? 'bg-accent border-accent' : 'bg-surface-raised border-border-default'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-quick ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="p-4 rounded-md bg-surface-base border border-border-default flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-content-primary flex items-center gap-2">
                <Eye size={14} className={reducedMotion ? 'text-accent' : ''} />
                <span>Reduce Motion</span>
              </div>
              <p className="text-[11px] text-content-secondary">
                Disables window animations and replaces transitions with instant crossfades.
              </p>
            </div>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`w-10 h-5 rounded-full p-0.5 border transition-colors duration-quick ${
                reducedMotion ? 'bg-accent border-accent' : 'bg-surface-raised border-border-default'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-quick ${
                  reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Lite Mode Toggle */}
          <div className="p-4 rounded-md bg-surface-base border border-border-default flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-content-primary flex items-center gap-2">
                <Sparkles size={14} className="text-accent" />
                <span>Lite Mode (2D Desktop Only)</span>
              </div>
              <p className="text-[11px] text-content-secondary">
                Skips 3D room rendering. Pure DOM architecture with lowest CPU/GPU load.
              </p>
            </div>
            <button
              onClick={() => setLiteMode(!isLiteMode)}
              className={`w-10 h-5 rounded-full p-0.5 border transition-colors duration-quick ${
                isLiteMode ? 'bg-accent border-accent' : 'bg-surface-raised border-border-default'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-quick ${
                  isLiteMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reset Desktop */}
          <div className="p-4 rounded-md bg-surface-base border border-border-default flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-content-primary">Reset Desktop Session</div>
              <p className="text-[11px] text-content-secondary">
                Closes all open windows and returns to the lock screen.
              </p>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-sm bg-surface-raised border border-border-default hover:border-semantic-error text-xs font-mono text-content-secondary hover:text-semantic-error transition-colors duration-instant"
            >
              Log Out &rarr;
            </button>
          </div>
        </div>

        {/* About Rudar OS Info */}
        <div className="p-4 rounded-md bg-surface-base border border-border-subtle space-y-2 text-xs font-mono text-content-secondary">
          <div className="flex items-center gap-2 text-content-primary font-semibold">
            <Info size={14} className="text-accent" />
            <span>About Rudar OS</span>
          </div>
          <div>Version: 0.1.0-vertical-slice (Gate 2)</div>
          <div>Stack: Next.js 15, TypeScript Strict, Tailwind CSS, Zustand, Fuse.js</div>
          <div>Credits: 21st.dev component parts bin (logged in COMPONENTS.md)</div>
          <div className="text-[10px] text-content-tertiary pt-1">
            Taste &amp; restaints enforced by antigravity.md &bull; Zero AI slop guarantee.
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

