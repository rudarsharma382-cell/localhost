'use client';

import React from 'react';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { Volume2, VolumeX, Eye, Sparkles } from 'lucide-react';

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
      title="Settings"
      onBack={() => closeWindow(windowId)}
      className="flex-1"
    >
      <div className="h-full bg-surface-panel p-6 overflow-y-auto font-sans select-text text-content-primary space-y-6 max-w-lg mx-auto">
        <div className="space-y-0.5 pb-2 border-b border-border-subtle">
          <h1 className="text-sm font-medium text-content-primary">System Preferences</h1>
          <p className="text-xs text-content-secondary">
            Display, sound, and animation controls.
          </p>
        </div>

        <div className="space-y-3">
          {/* Sound Toggle */}
          <div className="py-2.5 flex items-center justify-between border-b border-border-subtle">
            <div>
              <div className="text-xs font-medium text-content-primary">Sound Effects</div>
              <p className="text-[11px] text-content-secondary">Tactile audio feedback on window actions.</p>
            </div>
            <button
              onClick={toggleSound}
              className={`w-9 h-5 rounded-full p-0.5 border transition-colors duration-quick ${
                soundEnabled ? 'bg-accent border-accent' : 'bg-surface-raised border-border-default'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-quick ${
                  soundEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="py-2.5 flex items-center justify-between border-b border-border-subtle">
            <div>
              <div className="text-xs font-medium text-content-primary">Reduce Motion</div>
              <p className="text-[11px] text-content-secondary">Disables window animations.</p>
            </div>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`w-9 h-5 rounded-full p-0.5 border transition-colors duration-quick ${
                reducedMotion ? 'bg-accent border-accent' : 'bg-surface-raised border-border-default'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-quick ${
                  reducedMotion ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Lite Mode Toggle */}
          <div className="py-2.5 flex items-center justify-between border-b border-border-subtle">
            <div>
              <div className="text-xs font-medium text-content-primary">Lite Mode (2D Desktop)</div>
              <p className="text-[11px] text-content-secondary">Skips the 3D room on login.</p>
            </div>
            <button
              onClick={() => setLiteMode(!isLiteMode)}
              className={`w-9 h-5 rounded-full p-0.5 border transition-colors duration-quick ${
                isLiteMode ? 'bg-accent border-accent' : 'bg-surface-raised border-border-default'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-quick ${
                  isLiteMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reset Desktop */}
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-content-primary">Log Out</div>
              <p className="text-[11px] text-content-secondary">Return to the lock screen.</p>
            </div>
            <button
              onClick={logout}
              className="px-2.5 py-1 rounded-sm bg-surface-base border border-border-default hover:border-border-strong text-xs text-content-secondary hover:text-content-primary transition-colors duration-instant"
            >
              Log out &rarr;
            </button>
          </div>
        </div>

        {/* About Info */}
        <div className="pt-4 border-t border-border-subtle text-xs text-content-tertiary space-y-1">
          <div className="text-content-primary font-medium">Rudar OS</div>
          <div>Personal portfolio and custom operating system by Rudar Sharma.</div>
        </div>
      </div>
    </AppFrame>
  );
}
