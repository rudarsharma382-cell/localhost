'use client';

import React from 'react';
import { profile } from '@/content/profile';
import { isTodo } from '@/content/schema';
import { TodoMarker } from '@/components/common/TodoMarker';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { ExternalLink, Terminal, Shield, Award, Sparkles } from 'lucide-react';

interface AboutAppProps {
  windowId: string;
}

export default function AboutApp({ windowId }: AboutAppProps) {
  const { closeWindow, openWindow } = useOSStore();

  return (
    <AppFrame
      appId="about"
      title="About Me"
      onBack={() => closeWindow(windowId)}
      className="flex-1"
    >
      <div className="h-full bg-surface-panel p-8 overflow-y-auto font-sans select-text text-content-primary space-y-8 max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-border-default pb-6">
          <div className="w-20 h-20 rounded-md bg-surface-base border-2 border-border-default flex items-center justify-center shrink-0 shadow-base relative">
            <svg width="36" height="36" viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
              <circle cx="10" cy="7" r="3.5" />
              <path d="M4 16c0-3 2.5-5 6-5s6 2 6 5" />
              <circle cx="14" cy="5" r="1.5" fill="#E58B24" stroke="none" />
            </svg>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-display font-bold text-content-primary">
                {profile.name}
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-accent/15 text-accent border border-accent/30">
                Developer
              </span>
            </div>
            <div className="text-xs font-mono text-content-tertiary">
              Flutter &bull; Mobile Engineering &bull; WebGL Interfaces
            </div>
            {isTodo(profile.intro) ? (
              <div className="pt-1">
                <TodoMarker field="Intro" message={profile.intro} />
              </div>
            ) : (
              <p className="text-xs text-content-secondary leading-relaxed pt-1">
                {profile.intro}
              </p>
            )}
          </div>
        </div>

        {/* Verified Hackathon Highlight */}
        <div className="p-4 rounded-md bg-surface-base border border-semantic-warning/40 space-y-2">
          <div className="flex items-center gap-2 text-semantic-warning text-xs font-mono uppercase tracking-wider">
            <Award size={15} />
            <span>Verified Hackathon Result</span>
          </div>
          <div className="text-sm font-semibold text-content-primary">
            SafeWare &bull; Top 140, Delhi AI Grand Hackathon
          </div>
          <p className="text-xs text-content-secondary leading-relaxed">
            AI-based computer vision road safety platform built under strict hackathon constraints, reaching the top 140 ranking.
          </p>
        </div>

        {/* Technical Competencies */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-content-tertiary">
            Core Engineering Competencies
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {profile.skills.map((skill) => (
              <div
                key={skill}
                className="p-2.5 rounded-sm bg-surface-base border border-border-subtle flex items-center gap-2 text-content-secondary"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial Copy from about.md */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-mono uppercase tracking-wider text-content-tertiary">
            Personal Philosophy &amp; Background
          </h2>
          <div className="p-5 rounded-md bg-surface-base border border-border-default space-y-3">
            <TodoMarker
              field="about.md"
              message="PRD Sec 7.3: Rudar to provide personal background copy in src/content/about.md. Clean empty state rendered in production."
            />
            <p className="text-xs text-content-secondary italic leading-relaxed">
              &ldquo;Software should feel like a well-made physical tool: quiet, precise, and dependable.&rdquo;
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-border-subtle flex flex-wrap gap-3 text-xs font-mono">
          <button
            onClick={() => openWindow('socials')}
            className="px-3 py-1.5 rounded-sm bg-surface-base border border-border-default hover:border-accent text-content-secondary hover:text-content-primary transition-colors duration-instant flex items-center gap-2"
          >
            <span>Network Links</span>
            <ExternalLink size={12} className="text-accent" />
          </button>
          <button
            onClick={() => openWindow('assistant')}
            className="px-3 py-1.5 rounded-sm bg-surface-base border border-border-default hover:border-accent text-content-secondary hover:text-content-primary transition-colors duration-instant flex items-center gap-2"
          >
            <Sparkles size={12} className="text-accent" />
            <span>Ask Rudar AI</span>
          </button>
        </div>
      </div>
    </AppFrame>
  );
}
