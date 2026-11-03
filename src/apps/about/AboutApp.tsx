'use client';

import React from 'react';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { RetroPortfolio } from '@/components/portfolio/RetroPortfolio';
import { AppIconId } from '@/components/icons/AppIcons';

interface AboutAppProps {
  windowId: string;
}

export default function AboutApp({ windowId }: AboutAppProps) {
  const { closeWindow, openWindow } = useOSStore();

  const handleOpenApp = (appId: AppIconId) => {
    openWindow(appId);
  };

  return (
    <AppFrame
      appId="about"
      title="Rudar Sharma — UI/UX Portfolio"
      onBack={() => closeWindow(windowId)}
      className="flex-1 overflow-hidden"
    >
      <div className="h-full w-full overflow-y-auto bg-white select-text">
        <RetroPortfolio onOpenApp={handleOpenApp} />
      </div>
    </AppFrame>
  );
}
