'use client';

import React, { useState } from 'react';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { RotateCw, ExternalLink, Globe } from 'lucide-react';

interface AboutAppProps {
  windowId: string;
}

export default function AboutApp({ windowId }: AboutAppProps) {
  const { closeWindow } = useOSStore();
  const [iframeKey, setIframeKey] = useState(0);

  const portfolioUrl = '/portfolio/index.html';

  return (
    <AppFrame
      appId="about"
      title="Rudar Sharma — Official Portfolio (assets/portfolio)"
      onBack={() => closeWindow(windowId)}
      className="flex-1 overflow-hidden"
    >
      <div className="flex flex-col h-full w-full bg-[#050505] text-white">
        {/* Navigation & Controls Bar */}
        <div className="h-9 px-3 bg-[#111315] border-b border-white/10 flex items-center justify-between select-none shrink-0 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIframeKey((k) => k + 1)}
              aria-label="Reload"
              className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Reload Portfolio"
            >
              <RotateCw size={13} />
            </button>
            <span className="text-zinc-400 text-[11px] flex items-center gap-1">
              <Globe size={12} className="text-[#DDA0DD]" />
              <span>Official Portfolio (assets/portfolio)</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Open in New Tab</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Live Portfolio Iframe running directly from assets/portfolio */}
        <div className="flex-1 relative w-full h-full bg-[#050505]">
          <iframe
            key={iframeKey}
            src={portfolioUrl}
            title="Rudar Sharma Official Portfolio"
            className="w-full h-full border-0 bg-[#050505]"
          />
        </div>
      </div>
    </AppFrame>
  );
}
