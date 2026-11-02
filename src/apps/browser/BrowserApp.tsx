'use client';

import React, { useState, useEffect } from 'react';
import { projects } from '@/content/projects';
import { Project } from '@/content/types';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  ExternalLink,
  Search,
  Globe,
  ShieldAlert,
  Compass,
} from 'lucide-react';

interface BrowserAppProps {
  windowId: string;
}

export default function BrowserApp({ windowId }: BrowserAppProps) {
  const { closeWindow, windows } = useOSStore();
  const currentWin = windows.find((w) => w.id === windowId);
  const initialUrl = (currentWin?.initialData?.initialUrl as string) || '';

  const [urlInput, setUrlInput] = useState<string>(initialUrl || 'rudar://start');
  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl || 'rudar://start');
  const [history, setHistory] = useState<string[]>([initialUrl || 'rudar://start']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [embedState, setEmbedState] = useState<{
    checked: boolean;
    canEmbed: boolean;
    reason?: string;
  }>({ checked: false, canEmbed: true });
  const [searchQuery, setSearchQuery] = useState('');

  // Handle URL navigation
  const navigateTo = (url: string) => {
    let target = url.trim();
    if (!target) target = 'rudar://start';

    // If query without protocol or domain, search projects first
    if (!target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('rudar://')) {
      // Internal search or handoff to real search
      target = `https://duckduckgo.com/?q=${encodeURIComponent(target)}`;
    }

    setUrlInput(target);
    setCurrentUrl(target);

    const newHistory = [...history.slice(0, historyIndex + 1), target];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Check embeddability whenever URL changes
  useEffect(() => {
    if (currentUrl === 'rudar://start') {
      setEmbedState({ checked: true, canEmbed: true });
      setIsLoading(false);
      return;
    }

    // Check project configuration
    const matchingProject = projects.find((p) => p.liveUrl === currentUrl);
    if (matchingProject && matchingProject.embed === 'never') {
      setEmbedState({
        checked: true,
        canEmbed: false,
        reason: 'Project explicitly configured to not embed (CSP / X-Frame-Options restricted).',
      });
      setIsLoading(false);
      return;
    }

    // Server-side probe check
    setIsLoading(true);
    setEmbedState({ checked: false, canEmbed: false });

    fetch(`/api/embeddable?url=${encodeURIComponent(currentUrl)}`)
      .then((res) => res.json())
      .then((data) => {
        setEmbedState({
          checked: true,
          canEmbed: data.embeddable ?? false,
          reason: data.reason,
        });
      })
      .catch((err) => {
        setEmbedState({
          checked: true,
          canEmbed: false,
          reason: `Verification probe error: ${err.message}`,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentUrl]);

  const handleBack = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentUrl(prev);
      setUrlInput(prev);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentUrl(next);
      setUrlInput(next);
    }
  };

  const filteredProjects = projects.filter((p) =>
    searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.stack.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
  );

  return (
    <AppFrame
      appId="browser"
      title="Browser"
      onBack={() => closeWindow(windowId)}
      className="flex-1"
    >
      <div className="flex flex-col h-full bg-surface-panel font-sans select-text">
        {/* Browser Navigation Bar */}
        <div className="h-10 px-3 bg-surface-base border-b border-border-default flex items-center gap-2 select-none shrink-0">
          {/* History Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleBack}
              disabled={historyIndex === 0}
              aria-label="Back"
              className="p-1 rounded-sm text-content-secondary hover:text-content-primary hover:bg-surface-panel disabled:opacity-30 disabled:hover:bg-transparent transition-colors duration-instant"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={handleForward}
              disabled={historyIndex >= history.length - 1}
              aria-label="Forward"
              className="p-1 rounded-sm text-content-secondary hover:text-content-primary hover:bg-surface-panel disabled:opacity-30 disabled:hover:bg-transparent transition-colors duration-instant"
            >
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => navigateTo(currentUrl)}
              aria-label="Reload"
              className="p-1 rounded-sm text-content-secondary hover:text-content-primary hover:bg-surface-panel transition-colors duration-instant"
            >
              <RotateCw size={13} className={isLoading ? 'animate-spin text-accent' : ''} />
            </button>
          </div>

          {/* Address Bar Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigateTo(urlInput);
            }}
            className="flex-1 flex items-center"
          >
            <div className="w-full flex items-center gap-2 px-3 py-1 rounded-sm bg-surface-panel border border-border-default focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-colors duration-instant">
              <Globe size={13} className="text-content-tertiary shrink-0" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter URL or search projects..."
                className="w-full bg-transparent text-xs font-mono text-content-primary placeholder:text-content-tertiary focus:outline-none"
              />
            </div>
          </form>

          {/* Always Visible: Open in New Tab */}
          {currentUrl !== 'rudar://start' && (
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open in new external tab"
              className="px-2.5 py-1 rounded-sm bg-surface-raised border border-border-default hover:border-accent text-content-secondary hover:text-content-primary text-xs font-mono flex items-center gap-1.5 transition-colors duration-instant shrink-0"
            >
              <span>External</span>
              <ExternalLink size={12} className="text-accent" />
            </a>
          )}
        </div>

        {/* Viewport Content */}
        <div className="flex-1 relative overflow-auto bg-surface-canvas">
          {currentUrl === 'rudar://start' ? (
            /* Considered Start Page (Not a uniform card grid) */
            <div className="max-w-4xl mx-auto px-8 py-10 space-y-10">
              {/* Header & Search */}
              <div className="space-y-4 text-center max-w-xl mx-auto">
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-accent uppercase tracking-wider">
                  <Compass size={14} />
                  <span>Rudar OS &bull; Live Work Portal</span>
                </div>
                <h1 className="text-2xl font-display font-bold text-content-primary tracking-tight">
                  Live Project Browser
                </h1>
                <p className="text-sm text-content-secondary">
                  Explore verified live projects. Selecting an item attempts real live iframe embedding with instant fallbacks.
                </p>

                {/* Filter / Search Input */}
                <div className="relative pt-2">
                  <Search size={14} className="absolute left-3.5 top-5 text-content-tertiary" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search project name, stack, or problem..."
                    className="w-full pl-9 pr-4 py-2 rounded-sm bg-surface-base border border-border-default text-xs text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans transition-colors duration-instant"
                  />
                </div>
              </div>

              {/* Projects List (Considered Editorial List) */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-content-tertiary flex items-center justify-between border-b border-border-subtle pb-2">
                  <span>Available Deployments ({filteredProjects.length})</span>
                  <span>Embeddability Policy: PRD Sec 9</span>
                </div>

                <div className="divide-y divide-border-subtle">
                  {filteredProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-sans font-semibold text-sm text-content-primary group-hover:text-accent transition-colors duration-instant">
                            {proj.name}
                          </span>
                          {proj.embed === 'never' ? (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-semantic-warning/10 text-semantic-warning border border-semantic-warning/30">
                              External Tab Only
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-semantic-success/10 text-semantic-success border border-semantic-success/30">
                              Live Frame Ready
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-content-secondary leading-relaxed">
                          {proj.summary}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.stack.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-mono text-content-tertiary bg-surface-base px-2 py-0.5 rounded-sm border border-border-subtle"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {proj.liveUrl ? (
                          <button
                            onClick={() => navigateTo(proj.liveUrl!)}
                            className="px-3 py-1.5 rounded-sm bg-accent hover:bg-accent-hover text-surface-canvas text-xs font-medium transition-colors duration-instant"
                          >
                            Open Project &rarr;
                          </button>
                        ) : (
                          <button
                            onClick={() => navigateTo('https://rudar.vercel.app/')}
                            className="px-3 py-1.5 rounded-sm bg-surface-base border border-border-default hover:border-accent text-content-secondary text-xs font-medium transition-colors duration-instant"
                          >
                            Explore Live &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : embedState.checked && !embedState.canEmbed ? (
            /* Friendly Non-Embeddable Fallback View */
            <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-semantic-warning/10 border border-semantic-warning/30 flex items-center justify-center text-semantic-warning">
                <ShieldAlert size={24} />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-base font-sans font-semibold text-content-primary">
                  Site Cannot Be Framed Inside OS
                </h2>
                <p className="text-xs text-content-secondary leading-relaxed">
                  Security policies on this deployment forbid iframe embedding ({embedState.reason || 'frame-ancestors restriction'}).
                  Per PRD Section 9, we never fake screenshots.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 w-full">
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-4 rounded-sm bg-accent hover:bg-accent-hover text-surface-canvas text-xs font-medium text-center transition-colors duration-instant flex items-center justify-center gap-2"
                >
                  <span>Open in External Tab</span>
                  <ExternalLink size={13} />
                </a>
                <button
                  onClick={() => navigateTo('rudar://start')}
                  className="py-2 px-3 rounded-sm bg-surface-panel border border-border-default text-content-secondary text-xs hover:text-content-primary"
                >
                  Return to Start
                </button>
              </div>
            </div>
          ) : (
            /* Live Iframe View with loading indicator */
            <div className="w-full h-full relative">
              {isLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface-canvas/90 space-y-3">
                  <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                  <span className="text-xs font-mono text-content-tertiary">
                    Verifying security headers &amp; loading live frame...
                  </span>
                </div>
              )}
              <iframe
                src={currentUrl}
                title="Live Project View"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                className="w-full h-full border-0 bg-white"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          )}
        </div>
      </div>
    </AppFrame>
  );
}

