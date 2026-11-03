'use client';

import React, { useState } from 'react';
import { projects } from '@/content/projects';
import { Project } from '@/content/types';
import { isTodo } from '@/content/schema';
import { TodoMarker } from '@/components/common/TodoMarker';
import { useOSStore } from '@/os/window-manager/store';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { ChevronRight, ArrowRight, ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/icons/BrandIcons';
import { AppIcon } from '@/components/icons/AppIcons';

interface StudioAppProps {
  windowId: string;
}

export default function StudioApp({ windowId }: StudioAppProps) {
  const { openWindow, closeWindow } = useOSStore();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0].id);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleOpenInBrowser = (proj: Project) => {
    openWindow('browser', {
      initialUrl: proj.liveUrl || 'https://rudar.vercel.app/',
      projectId: proj.id,
      projectName: proj.name,
    });
  };

  return (
    <AppFrame
      appId="studio"
      title="Development Studio"
      onBack={() => closeWindow(windowId)}
      className="flex-1"
    >
      <div className="flex h-full bg-surface-panel text-content-primary font-sans select-text">
        {/* Left Navigator (Thin hairline divider, no heavy boxes) */}
        <aside
          aria-label="Projects list"
          className="w-52 shrink-0 border-r border-border-subtle bg-surface-base/50 flex flex-col justify-between select-none"
        >
          <div className="p-3 space-y-2">
            <div className="px-2 py-1 text-xs font-medium text-content-tertiary">
              Projects
            </div>

            <div className="space-y-0.5">
              {projects.map((proj) => {
                const isSelected = proj.id === selectedProjectId;
                return (
                  <button
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-sm text-xs font-sans flex items-center justify-between transition-colors duration-instant ${
                      isSelected
                        ? 'bg-surface-raised text-content-primary font-medium'
                        : 'text-content-secondary hover:text-content-primary hover:bg-surface-raised/40'
                    }`}
                  >
                    <span className="truncate">{proj.name}</span>
                    {proj.achievements && proj.achievements.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" title="Verified Achievement" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 border-t border-border-subtle text-xs text-content-tertiary">
            Verified facts only
          </div>
        </aside>

        {/* Main Reading Pane (Generous spacing, thin hairline rules) */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Header Bar */}
          <div className="h-10 px-6 border-b border-border-subtle bg-surface-base/30 flex items-center justify-between text-xs shrink-0 select-none">
            <div className="flex items-center gap-1.5 text-content-tertiary">
              <span>Projects</span>
              <ChevronRight size={12} />
              <span className="text-content-primary font-medium">{selectedProject.name}</span>
            </div>
            <button
              onClick={() => handleOpenInBrowser(selectedProject)}
              className="px-2.5 py-1 rounded-sm bg-surface-raised border border-border-default hover:border-border-strong text-content-primary text-xs font-medium flex items-center gap-1.5 transition-colors duration-instant"
            >
              <span>Open in browser</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Project Details */}
          <div className="p-8 max-w-2xl space-y-6">
            {/* Title & Summary */}
            <div className="space-y-2">
              <h1 className="text-xl font-display font-bold text-content-primary tracking-tight">
                {selectedProject.name}
              </h1>
              <p className="text-sm text-content-secondary leading-relaxed">
                {selectedProject.summary}
              </p>
            </div>

            {/* Achievement Line (Quiet hairline divider, no cartoon badges) */}
            {selectedProject.achievements && selectedProject.achievements.length > 0 && (
              <div className="py-3 border-y border-border-subtle space-y-0.5">
                <div className="text-xs text-content-tertiary font-medium">
                  Achievement
                </div>
                <div className="text-sm font-medium text-content-primary">
                  {selectedProject.achievements.join(', ')}
                </div>
              </div>
            )}

            {/* Problem & Motivation (No clipped boxes, natural text flow) */}
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-medium text-content-tertiary">Problem</div>
                {selectedProject.problem && isTodo(selectedProject.problem) ? (
                  <div className="py-1">
                    <TodoMarker message={selectedProject.problem} />
                  </div>
                ) : (
                  <p className="text-sm text-content-secondary leading-relaxed">
                    {selectedProject.problem}
                  </p>
                )}
              </div>

              <div className="h-px bg-border-subtle" />

              <div className="space-y-1">
                <div className="text-xs font-medium text-content-tertiary">Motivation</div>
                {selectedProject.why && isTodo(selectedProject.why) ? (
                  <div className="py-1">
                    <TodoMarker message={selectedProject.why} />
                  </div>
                ) : (
                  <p className="text-sm text-content-secondary leading-relaxed">
                    {selectedProject.why}
                  </p>
                )}
              </div>

              <div className="h-px bg-border-subtle" />

              <div className="space-y-1">
                <div className="text-xs font-medium text-content-tertiary">Contribution</div>
                {selectedProject.contribution && isTodo(selectedProject.contribution) ? (
                  <div className="py-1">
                    <TodoMarker message={selectedProject.contribution} />
                  </div>
                ) : (
                  <p className="text-sm text-content-secondary leading-relaxed">
                    {selectedProject.contribution}
                  </p>
                )}
              </div>
            </div>

            {/* External Links */}
            <div className="pt-4 flex items-center gap-4 text-xs">
              {selectedProject.liveUrl ? (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-content-secondary hover:text-content-primary flex items-center gap-1.5 transition-colors duration-instant"
                >
                  <ExternalLink size={12} />
                  <span>Live site</span>
                </a>
              ) : null}

              {selectedProject.repoUrl ? (
                <a
                  href={selectedProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-content-secondary hover:text-content-primary flex items-center gap-1.5 transition-colors duration-instant"
                >
                  <GithubIcon size={13} />
                  <span>Source repository</span>
                </a>
              ) : null}
            </div>
          </div>
        </main>
      </div>
    </AppFrame>
  );
}
