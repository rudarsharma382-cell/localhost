'use client';

import React from 'react';
import { socials } from '@/content/socials';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { ExternalLink, Globe } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from '@/components/icons/BrandIcons';

interface SocialsAppProps {
  windowId: string;
}

export default function SocialsApp({ windowId }: SocialsAppProps) {
  const { closeWindow } = useOSStore();

  const getSocialIcon = (id: string) => {
    switch (id) {
      case 'github':
        return <GithubIcon size={18} className="text-content-primary" />;
      case 'linkedin':
        return <LinkedinIcon size={18} className="text-[#4DA6E8]" />;
      case 'instagram':
        return <InstagramIcon size={18} className="text-accent" />;
      default:
        return <Globe size={18} className="text-accent" />;
    }
  };

  return (
    <AppFrame
      appId="socials"
      title="Public Profiles & Network"
      onBack={() => closeWindow(windowId)}
      className="flex-1"
    >
      <div className="h-full bg-surface-panel p-6 overflow-y-auto font-sans select-text text-content-primary space-y-6">
        <div className="space-y-1">
          <h1 className="text-base font-semibold text-content-primary">Verified Public Profiles</h1>
          <p className="text-xs text-content-secondary">
            Direct communication channels and code repositories. All links open securely in a new tab.
          </p>
        </div>

        <div className="space-y-2.5">
          {socials.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-md bg-surface-base border border-border-default hover:border-accent hover:bg-surface-raised flex items-center justify-between transition-colors duration-instant group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-md bg-surface-panel border border-border-subtle flex items-center justify-center shrink-0">
                  {getSocialIcon(link.id)}
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-content-primary group-hover:text-accent transition-colors duration-instant">
                    {link.name}
                  </div>
                  <div className="text-[11px] text-content-secondary line-clamp-1">
                    {link.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-content-tertiary group-hover:text-accent shrink-0">
                <span className="hidden sm:inline text-[10px]">Open</span>
                <ExternalLink size={13} />
              </div>
            </a>
          ))}
        </div>

        <div className="pt-2 text-[11px] font-mono text-content-tertiary">
          Rel: <code>noopener noreferrer</code> enforced &bull; PRD Sec 7.5
        </div>
      </div>
    </AppFrame>
  );
}
