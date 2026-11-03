'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '@/os/window-manager/store';
import { appRegistry } from '@/os/registry';
import { projects } from '@/content/projects';
import { AppIcon } from '@/components/icons/AppIcons';
import { Search, Command, ArrowRight } from 'lucide-react';

export function Launcher() {
  const {
    launcherOpen,
    setLauncherOpen,
    openWindow,
  } = useOSStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setLauncherOpen(!launcherOpen);
      }
      if (e.key === 'Escape' && launcherOpen) {
        setLauncherOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [launcherOpen, setLauncherOpen]);

  useEffect(() => {
    if (launcherOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [launcherOpen]);

  if (!launcherOpen) return null;

  // Filter items
  const q = query.toLowerCase();

  const matchingApps = Object.values(appRegistry).filter(
    (app) => app.title.toLowerCase().includes(q) || app.shortTitle.toLowerCase().includes(q)
  );

  const matchingProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.stack.some((s) => s.toLowerCase().includes(q))
  );

  interface LauncherItem {
    id: string;
    title: string;
    subtitle: string;
    type: 'app' | 'project';
    action: () => void;
    icon?: React.ReactNode;
  }

  const items: LauncherItem[] = [
    ...matchingApps.map((app) => ({
      id: `app-${app.id}`,
      title: app.title,
      subtitle: `Application`,
      type: 'app' as const,
      icon: <AppIcon id={app.id} size={15} />,
      action: () => {
        openWindow(app.id);
        setLauncherOpen(false);
      },
    })),
    ...matchingProjects.map((p) => ({
      id: `proj-${p.id}`,
      title: p.name,
      subtitle: p.summary,
      type: 'project' as const,
      icon: <span className="w-1.5 h-1.5 rounded-full bg-accent" />,
      action: () => {
        openWindow('browser', {
          initialUrl: p.liveUrl || 'https://rudar.vercel.app/',
          projectId: p.id,
        });
        setLauncherOpen(false);
      },
    })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, items.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + items.length) % Math.max(1, items.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[selectedIndex]) {
        items[selectedIndex].action();
      }
    }
  };

  return (
    <div
      onClick={() => setLauncherOpen(false)}
      className="fixed inset-0 z-launcher bg-surface-canvas/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] p-4 select-none animate-in fade-in duration-quick"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-lg bg-surface-raised border border-border-strong shadow-floating overflow-hidden font-sans text-content-primary flex flex-col animate-in zoom-in-95 duration-quick"
      >
        {/* Search Input Bar */}
        <div className="h-12 px-4 border-b border-border-default flex items-center gap-3 bg-surface-base">
          <Search size={16} className="text-content-tertiary" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search apps, verified projects, or commands..."
            className="flex-1 bg-transparent text-sm text-content-primary placeholder:text-content-tertiary focus:outline-none"
          />
          <kbd className="px-2 py-0.5 rounded-sm bg-surface-panel border border-border-subtle text-[11px] font-mono text-content-tertiary">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-border-subtle/40">
          {items.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-content-tertiary">
              No matching applications or projects found.
            </div>
          ) : (
            items.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2.5 rounded-sm flex items-center justify-between cursor-pointer transition-colors duration-instant ${
                    isSelected ? 'bg-accent/15 text-accent' : 'hover:bg-surface-panel'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">{item.icon}</div>
                    <div className="space-y-0.5">
                      <div className={`text-xs font-medium ${isSelected ? 'text-accent' : 'text-content-primary'}`}>
                        {item.title}
                      </div>
                      <div className="text-[10px] font-mono text-content-tertiary" dangerouslySetInnerHTML={{ __html: item.subtitle }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-content-tertiary">
                    {isSelected && <ArrowRight size={12} className="text-accent" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="h-8 px-4 bg-surface-base/80 border-t border-border-subtle flex items-center justify-between text-[10px] font-mono text-content-tertiary">
          <span>Keyboard: &uarr; &darr; to navigate &bull; Enter to open</span>
          <span>Shortcut: Cmd/Ctrl + K</span>
        </div>
      </div>
    </div>
  );
}

