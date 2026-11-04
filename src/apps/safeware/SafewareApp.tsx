'use client';

import React, { useState } from 'react';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { ExternalLink, RotateCw, Globe } from 'lucide-react';

interface SafewareAppProps {
  windowId: string;
}

export default function SafewareApp({ windowId }: SafewareAppProps) {
  const { closeWindow } = useOSStore();
  const [iframeKey, setIframeKey] = useState(0);

  return (
    <AppFrame
      appId="safeware"
      title="SafeWare AI — Road Safety System"
      onBack={() => closeWindow(windowId)}
      className="flex-1 overflow-hidden"
    >
      <div className="h-full w-full flex flex-col bg-[#0C0D10] text-[#E0E2EC] overflow-hidden select-none">
        {/* Navigation / Address Header */}
        <div className="h-10 px-4 bg-[#14161C] border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE] animate-pulse" />
            <span className="text-xs font-mono font-medium text-cyan-300 hidden sm:inline">
              SafeWare Production Live
            </span>
          </div>

          {/* In-PC Browser Address Bar */}
          <div className="flex-1 max-w-md flex items-center gap-2 px-3 py-1 rounded bg-black/40 border border-white/10 text-xs font-mono text-zinc-300">
            <Globe size={13} className="text-cyan-400 shrink-0" />
            <span className="truncate">https://getsafeware.vercel.app/</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIframeKey((k) => k + 1)}
              title="Reload site"
              className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCw size={13} />
            </button>
            <a
              href="https://getsafeware.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              title="Open in external browser window"
              className="px-2.5 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>New tab</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Live Embedded Web Frame */}
        <div className="flex-1 w-full h-full relative bg-[#090A0C]">
          <iframe
            key={iframeKey}
            src="https://getsafeware.vercel.app/"
            title="SafeWare AI Live Platform"
            className="w-full h-full border-0 select-auto"
            allow="accelerometer; autoplay; camera; microphone; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </AppFrame>
  );
}
