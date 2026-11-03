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
        return <GithubIcon size={16} className="text-content-primary" />;
      case 'linkedin':
        return <LinkedinIcon size={16} className="text-[#6A9BC4]" />;
      case 'instagram':
        return <InstagramIcon size={16} className="text-content-secondary" />;
      default:
        return <Globe size={16} className="text-content-secondary" />;
    }
  };

  return (
    <AppFrame
      appId="socials"
      title="Public Profiles"
      onBack={() => closeWindow(windowId)}
      className="flex-1"
    >
      <div className="h-full bg-surface-panel p-6 overflow-y-auto font-sans select-text text-content-primary space-y-4 max-w-md mx-auto">
        <div className="space-y-0.5 pb-2 border-b border-border-subtle">
          <h1 className="text-sm font-medium text-content-primary">Profiles</h1>
          <p className="text-xs text-content-secondary">
            Verified channels and code repositories.
          </p>
        </div>

        <div className="divide-y divide-border-subtle">
          {socials.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 flex items-center justify-between hover:bg-surface-raised/40 px-2 rounded-sm transition-colors duration-instant group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-surface-base border border-border-subtle flex items-center justify-center shrink-0">
                  {getSocialIcon(link.id)}
                </div>
                <div>
                  <div className="text-xs font-medium text-content-primary group-hover:text-accent transition-colors duration-instant">
                    {link.name}
                  </div>
                  <div className="text-[11px] text-content-tertiary">
                    {link.description}
                  </div>
                </div>
              </div>

              <ExternalLink size={12} className="text-content-tertiary group-hover:text-content-primary shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </AppFrame>
  );
}
