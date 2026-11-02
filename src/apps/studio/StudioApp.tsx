'use client';

import React, { useState } from 'react';
import { projects } from '@/content/projects';
import { Project } from '@/content/types';
import { isTodo } from '@/content/schema';
import { TodoMarker } from '@/components/common/TodoMarker';
import { useOSStore } from '@/os/window-manager/store';
import { AppFrame } from '@/os/app-frame/AppFrame';
import {
  Folder,
  FileCode,
  ExternalLink,
  ChevronRight,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { GithubIcon } from '@/components/icons/BrandIcons';

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
        {/* Left IDE File Tree Sidebar */}
        <aside
          aria-label="Project Explorer"
          className="w-56 shrink-0 border-r border-border-default bg-surface-base/60 flex flex-col justify-between select-none"
        >
          <div className="p-3 space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-content-tertiary flex items-center justify-between">
              <span>EXPLORER</span>
              <span className="text-[10px] text-accent">PROJECTS ({projects.length})</span>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-mono text-content-secondary">
                <Folder size={13} className="text-accent" />
                <span className="font-semibold text-content-primary">rudar-workspace</span>
              </div>

              <div className="pl-4 space-y-0.5 border-l border-border-subtle ml-3">
                {projects.map((proj) => {
                  const isSelected = proj.id === selectedProjectId;
                  return (
                    <button
                      key={proj.id}
                      onClick={() => setSelectedProjectId(proj.id)}
                      className={`w-full text-left px-2 py-1.5 rounded-sm text-xs font-mono flex items-center justify-between transition-colors duration-instant ${
                        isSelected
                          ? 'bg-accent/15 text-accent font-medium border-l-2 border-accent'
                          : 'text-content-secondary hover:text-content-primary hover:bg-surface-raised'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <FileCode size={12} className={isSelected ? 'text-accent' : 'text-content-tertiary'} />
                        <span className="truncate">{proj.name}</span>
                      </div>
                      {proj.achievements && proj.achievements.length > 0 && (
                        <Trophy size={11} className="text-semantic-warning shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-border-subtle text-[11px] font-mono text-content-tertiary">
            <span>Verified Spec &bull; No Fake Stats</span>
          </div>
        </aside>

        {/* Main Case Study Pane */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Breadcrumb Header */}
          <div className="h-9 px-6 border-b border-border-subtle bg-surface-base/40 flex items-center justify-between text-xs font-mono shrink-0 select-none">
            <div className="flex items-center gap-1.5 text-content-tertiary">
              <span>projects</span>
              <ChevronRight size={12} />
              <span className="text-content-primary font-semibold">{selectedProject.slug}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenInBrowser(selectedProject)}
                className="px-2.5 py-1 rounded-sm bg-accent hover:bg-accent-hover text-surface-canvas text-xs font-sans font-medium flex items-center gap-1.5 transition-colors duration-instant"
              >
                <span>Launch in Browser</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* Case Study Content */}
          <div className="p-8 max-w-3xl space-y-8">
            {/* Title & Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-display font-bold text-content-primary tracking-tight">
                  {selectedProject.name}
                </h1>
                {selectedProject.featured && (
                  <span className="px-2 py-0.5 rounded-sm bg-accent/10 border border-accent/30 text-accent text-[11px] font-mono">
                    Featured Project
                  </span>
                )}
              </div>
              <p className="text-base text-content-secondary leading-relaxed">
                {selectedProject.summary}
              </p>
            </div>

            {/* Verified Achievements */}
            {selectedProject.achievements && selectedProject.achievements.length > 0 && (
              <div className="p-4 rounded-md bg-semantic-warning/10 border border-semantic-warning/30 flex items-start gap-3">
                <Trophy size={18} className="text-semantic-warning shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-mono font-semibold text-semantic-warning uppercase tracking-wider">
                    Verified Hackathon Achievement
                  </div>
                  <div className="text-sm font-medium text-content-primary">
                    {selectedProject.achievements.join(', ')}
                  </div>
                </div>
              </div>
            )}

            {/* Problem & Why */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-md bg-surface-base border border-border-default space-y-2">
                <div className="text-xs font-mono uppercase text-content-tertiary">The Problem</div>
                {selectedProject.problem && isTodo(selectedProject.problem) ? (
                  <TodoMarker field="Problem" message={selectedProject.problem} />
                ) : (
                  <p className="text-sm text-content-secondary leading-relaxed">
                    {selectedProject.problem || 'Documentation in progress.'}
                  </p>
                )}
              </div>

              <div className="p-5 rounded-md bg-surface-base border border-border-default space-y-2">
                <div className="text-xs font-mono uppercase text-content-tertiary">Why It Exists</div>
                {selectedProject.why && isTodo(selectedProject.why) ? (
                  <TodoMarker field="Why" message={selectedProject.why} />
                ) : (
                  <p className="text-sm text-content-secondary leading-relaxed">
                    {selectedProject.why || 'Architecture specifications ongoing.'}
                  </p>
                )}
              </div>
            </div>

            {/* Key Features */}
            {selectedProject.features && selectedProject.features.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-mono uppercase tracking-wider text-content-tertiary">
                  Core Architectural Capabilities
                </h2>
                <ul className="space-y-2">
                  {selectedProject.features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-sm bg-surface-base/60 border border-border-subtle text-sm text-content-secondary flex items-start gap-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack Chips */}
            <div className="space-y-3">
              <h2 className="text-sm font-mono uppercase tracking-wider text-content-tertiary">
                Technologies &amp; Frameworks
              </h2>
              <div className="flex flex-wrap gap-2">
                {selectedProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-sm bg-surface-base border border-border-default text-xs font-mono text-content-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Individual Contribution */}
            <div className="space-y-2">
              <h2 className="text-sm font-mono uppercase tracking-wider text-content-tertiary">
                Rudar&apos;s Contribution
              </h2>
              {selectedProject.contribution && isTodo(selectedProject.contribution) ? (
                <TodoMarker field="Contribution" message={selectedProject.contribution} />
              ) : (
                <p className="text-sm text-content-secondary">
                  {selectedProject.contribution || 'Engineering breakdown pending.'}
                </p>
              )}
            </div>

            {/* External Links */}
            <div className="pt-4 border-t border-border-subtle flex flex-wrap gap-4 text-xs font-mono">
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-sm bg-surface-raised border border-border-default text-content-primary hover:border-accent flex items-center gap-2 transition-colors duration-instant"
                >
                  <ExternalLink size={13} className="text-accent" />
                  <span>External Live Link</span>
                </a>
              )}
              {selectedProject.repoUrl ? (
                <a
                  href={selectedProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-sm bg-surface-raised border border-border-default text-content-primary hover:border-accent flex items-center gap-2 transition-colors duration-instant"
                >
                  <GithubIcon size={13} />
                  <span>View Repository</span>
                </a>
              ) : (
                <span className="px-3 py-1.5 rounded-sm bg-surface-base border border-border-subtle text-content-tertiary flex items-center gap-1.5">
                  <GithubIcon size={13} />
                  <span>Repository: Private / Pending</span>
                </span>
              )}
            </div>
          </div>
        </main>
      </div>
    </AppFrame>
  );
}
