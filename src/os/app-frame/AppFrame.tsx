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
    return (
      <div className={`w-full h-full flex flex-col bg-surface-panel overflow-hidden ${className}`}>
        <div className="h-10 px-3.5 bg-surface-base border-b border-border-default flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Back"
              className="px-2 py-1 rounded-sm text-content-secondary hover:text-content-primary hover:bg-surface-raised text-xs transition-colors duration-instant flex items-center gap-1.5"
            >
              <span>&larr;</span>
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2">
              <AppIcon id={appId} size={15} className="text-content-secondary" />
              <span className="text-xs font-medium text-content-primary">{title}</span>
            </div>
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full flex flex-col bg-surface-panel overflow-hidden ${className}`}>
      {headerActions && (
        <div className="h-9 px-3.5 bg-surface-base/40 border-b border-border-subtle flex items-center justify-between shrink-0">
          <div className="text-xs text-content-tertiary">{title}</div>
          <div className="flex items-center gap-2">{headerActions}</div>
        </div>
      )}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
