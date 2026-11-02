'use client';

import React from 'react';
import { useOSStore } from '@/os/window-manager/store';
import { AppIcon, AppIconId } from '@/components/icons/AppIcons';

interface AppFrameProps {
  appId: AppIconId;
  title: string;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  onBack?: () => void;
  className?: string;
}

export function AppFrame({
  appId,
  title,
  children,
  headerActions,
  onBack,
  className = '',
}: AppFrameProps) {
  const { isLiteMode } = useOSStore();

  if (isLiteMode) {
    // In mobile / lite full-screen mode: render slim top control strip with back button
    return (
      <div className={`w-full h-full flex flex-col bg-surface-panel overflow-hidden ${className}`}>
        <div className="h-[42px] px-4 bg-surface-base border-b border-border-default flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Back to OS Desktop"
              className="px-2 py-1 rounded-sm bg-surface-panel border border-border-default text-content-secondary hover:text-content-primary hover:border-border-strong text-xs font-mono transition-colors duration-instant flex items-center gap-1.5"
            >
              <span>&larr;</span>
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2">
              <AppIcon id={appId} size={16} />
              <span className="text-xs font-medium text-content-primary">{title}</span>
            </div>
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    );
  }

  // In desktop full mode: window chrome is handled by Window.tsx, this is the internal layout frame
  return (
    <div className={`w-full h-full flex flex-col bg-surface-panel overflow-hidden ${className}`}>
      {headerActions && (
        <div className="h-[36px] px-3.5 bg-surface-base/50 border-b border-border-subtle flex items-center justify-between shrink-0">
          <div className="text-xs font-mono text-content-tertiary">{title}</div>
          <div className="flex items-center gap-2">{headerActions}</div>
        </div>
      )}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
