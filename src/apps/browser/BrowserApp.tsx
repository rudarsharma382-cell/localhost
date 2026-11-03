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
} from 'lucide-react';
import { RetroPortfolio } from '@/components/portfolio/RetroPortfolio';
import { AppIconId } from '@/components/icons/AppIcons';

interface BrowserAppProps {
  windowId: string;
}

export default function BrowserApp({ windowId }: BrowserAppProps) {
  const { closeWindow, openWindow, windows } = useOSStore();
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

  const navigateTo = (url: string) => {
    let target = url.trim();
    if (!target) target = 'rudar://start';

    if (!target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('rudar://')) {
      target = `https://duckduckgo.com/?q=${encodeURIComponent(target)}`;
    }

    setUrlInput(target);
    setCurrentUrl(target);

    const newHistory = [...history.slice(0, historyIndex + 1), target];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  useEffect(() => {
    if (currentUrl === 'rudar://start') {
      setEmbedState({ checked: true, canEmbed: true });
      setIsLoading(false);
      return;
    }

    const matchingProject = projects.find((p) => p.liveUrl === currentUrl);
    if (matchingProject && matchingProject.embed === 'never') {
      setEmbedState({
        checked: true,
        canEmbed: false,
        reason: 'Site security settings require opening in an external tab.',
      });
      setIsLoading(false);
      return;
    }

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
          reason: err.message,
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
        p.summary.toLowerCase().includes(searchQuery.toLowerCase())
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
        {/* Navigation Bar */}
        <div className="h-10 px-3 bg-surface-base border-b border-border-default flex items-center gap-2 select-none shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={handleBack}
              disabled={historyIndex === 0}
              aria-label="Back"
              className="p-1 rounded-sm text-content-secondary hover:text-content-primary hover:bg-surface-panel disabled:opacity-30 transition-colors duration-instant"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={handleForward}
              disabled={historyIndex >= history.length - 1}
              aria-label="Forward"
              className="p-1 rounded-sm text-content-secondary hover:text-content-primary hover:bg-surface-panel disabled:opacity-30 transition-colors duration-instant"
            >
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => navigateTo(currentUrl)}
              aria-label="Reload"
              className="p-1 rounded-sm text-content-secondary hover:text-content-primary hover:bg-surface-panel transition-colors duration-instant"
            >
              <RotateCw size={13} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Address Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigateTo(urlInput);
            }}
            className="flex-1 flex items-center"
          >
            <div className="w-full flex items-center gap-2 px-3 py-1 rounded-sm bg-surface-panel border border-border-default focus-within:border-border-strong transition-colors duration-instant">
              <Globe size={13} className="text-content-tertiary shrink-0" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Search or enter web address..."
                className="w-full bg-transparent text-xs text-content-primary placeholder:text-content-tertiary focus:outline-none"
              />
            </div>
          </form>

          {currentUrl !== 'rudar://start' && (
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open in new window"
              className="px-2.5 py-1 rounded-sm bg-surface-raised border border-border-default hover:border-border-strong text-content-secondary hover:text-content-primary text-xs flex items-center gap-1.5 transition-colors duration-instant shrink-0"
            >
              <span>New tab</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        {/* Browser Content */}
        <div className="flex-1 relative overflow-auto bg-white">
          {currentUrl === 'rudar://start' || currentUrl === 'rudar://portfolio' ? (
            <RetroPortfolio onOpenApp={(appId) => openWindow(appId)} />
          ) : embedState.checked && !embedState.canEmbed ? (
            /* Friendly External View */
            <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto space-y-4">
              <div className="space-y-1.5">
                <h2 className="text-sm font-sans font-semibold text-content-primary">
                  Site opens in a new tab
                </h2>
                <p className="text-xs text-content-secondary leading-relaxed">
                  This site does not allow embedding inside a window. Open it in a browser tab to view the live project.
                </p>
              </div>

              <div className="flex gap-2">
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-sm bg-surface-raised border border-border-strong hover:border-accent text-content-primary text-xs font-medium flex items-center gap-1.5 transition-colors duration-instant"
                >
                  <span>Open project</span>
                  <ExternalLink size={12} />
                </a>
                <button
                  onClick={() => navigateTo('rudar://start')}
                  className="px-3 py-1.5 rounded-sm bg-surface-base border border-border-default text-content-secondary text-xs hover:text-content-primary"
                >
                  Back
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative">
              {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-canvas/80 text-xs text-content-tertiary">
                  Loading site...
                </div>
              )}
              <iframe
                src={currentUrl}
                title="Live view"
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
