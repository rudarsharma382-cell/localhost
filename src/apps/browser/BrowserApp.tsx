'use client';

import React, { useState, useEffect } from 'react';
import { projects } from '@/content/projects';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  ExternalLink,
  Globe,
  Sparkles,
  BookOpen,
  Server,
  Shield,
  Layers,
  CheckCircle2,
  Share2,
  Compass,
  Laptop,
  Cpu,
  Heart,
  ShoppingBag,
  Award,
} from 'lucide-react';
import { OriginalHackathonPortfolio } from '@/components/portfolio/OriginalHackathonPortfolio';

function LinkedinIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

interface BrowserAppProps {
  windowId: string;
}

export default function BrowserApp({ windowId }: BrowserAppProps) {
  const { closeWindow, openWindow, toggleMaximizeWindow, windows } = useOSStore();
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

  const bookmarks = [
    { name: 'SafeWare AI', url: 'https://getsafeware.vercel.app/', icon: Shield, color: 'text-emerald-400' },
    { name: 'BMW M4 CSL 3D', url: 'https://bmwm4csl.vercel.app/', icon: Sparkles, color: 'text-cyan-400' },
    { name: 'Monolith House 3D', url: 'https://monolithhouse.vercel.app/', icon: Layers, color: 'text-amber-400' },
    { name: 'Arc Laptop 3D', url: 'https://arc-motion.vercel.app/', icon: Laptop, color: 'text-purple-400' },
    { name: 'Sole Agent AI', url: 'https://soleagent.vercel.app/', icon: Cpu, color: 'text-rose-400' },
    { name: 'Divine Herbal Life', url: 'https://divineherbalife.in/', icon: Heart, color: 'text-green-400' },
    { name: 'Zetklo Store', url: 'https://clothing-store-5e2.pages.dev/', icon: ShoppingBag, color: 'text-pink-400' },
    { name: 'AfterClass', url: 'rudar://afterclass', icon: BookOpen, color: 'text-blue-400' },
    { name: 'ServerCraft', url: 'rudar://servercraft', icon: Server, color: 'text-indigo-400' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/rudarsharma-dev/', icon: LinkedinIcon, color: 'text-sky-400' },
    { name: 'Portfolio', url: '/portfolio/index.html', icon: Award, color: 'text-[#DDA0DD]' },
  ];

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
    if (
      currentUrl === 'rudar://start' ||
      currentUrl === 'rudar://portfolio' ||
      currentUrl === 'rudar://afterclass' ||
      currentUrl === 'rudar://servercraft' ||
      currentUrl.includes('linkedin.com')
    ) {
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
          {/* Browser Brand Icon */}
          <div className="flex items-center gap-1.5 shrink-0 pl-0.5 pr-1">
            <Compass size={18} className="text-[#DDA0DD] animate-spin-slow" />
            <span className="text-xs font-mono font-bold text-zinc-300 hidden md:inline">Browser</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleBack}
              disabled={historyIndex === 0}
              aria-label="Back"
              className="p-1 rounded-sm text-content-secondary hover:text-content-primary hover:bg-surface-panel disabled:opacity-30 transition-colors duration-instant cursor-pointer"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={handleForward}
              disabled={historyIndex >= history.length - 1}
              aria-label="Forward"
              className="p-1 rounded-sm text-content-secondary hover:text-content-primary hover:bg-surface-panel disabled:opacity-30 transition-colors duration-instant cursor-pointer"
            >
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => navigateTo(currentUrl)}
              aria-label="Reload"
              className="p-1 rounded-sm text-content-secondary hover:text-content-primary hover:bg-surface-panel transition-colors duration-instant cursor-pointer"
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

          {currentUrl.startsWith('http') && (
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

        {/* Bookmarks Bar with Icons */}
        <div className="h-8 px-3 bg-surface-raised border-b border-border-subtle flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono select-none shrink-0 no-scrollbar">
          {bookmarks.map((bm) => {
            const Icon = bm.icon;
            return (
              <button
                key={bm.name}
                onClick={() => navigateTo(bm.url)}
                className={`px-2.5 py-0.5 rounded-sm transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  currentUrl === bm.url
                    ? 'bg-[#8B1E1E] text-white font-semibold'
                    : 'text-content-secondary hover:text-content-primary hover:bg-surface-panel'
                }`}
              >
                <Icon size={12} className={bm.color} />
                <span>{bm.name}</span>
              </button>
            );
          })}
        </div>

        {/* Browser Content */}
        <div className="flex-1 relative overflow-auto bg-[#050505]">
          {currentUrl === 'rudar://start' || currentUrl === 'rudar://portfolio' ? (
            <iframe
              src="/portfolio/index.html"
              title="Rudar Sharma Official Portfolio"
              className="w-full h-full border-0 bg-[#050505]"
            />
          ) : currentUrl === 'rudar://afterclass' ? (
            /* AfterClass Dedicated Showcase View */
            <div className="min-h-full bg-[#FFFFFF] text-[#111111] p-8 max-w-4xl mx-auto space-y-8 font-sans">
              <div className="border-b border-[#111111]/10 pb-6 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8B1E1E]">
                    ACADEMIC ARCHITECTURE // AFTERCLASS
                  </span>
                  <h1 className="font-['Syne',sans-serif] text-3xl font-extrabold uppercase mt-1">
                    AfterClass
                  </h1>
                  <p className="text-xs text-[#555555] font-sans mt-2 max-w-2xl leading-relaxed">
                    AfterClass is a classroom management and homework app built for students and teachers. It provides a centralized platform where teachers can upload homework, assignments, and study materials, while students can easily access everything in one place. The goal is to reduce dependency on WhatsApp groups, keep classwork organized, and make communication and academic resources easier to manage for the entire class.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-sm bg-[#8B1E1E]/10 text-[#8B1E1E] font-mono text-xs font-semibold shrink-0">
                  Flutter App
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-[#111111]/10 rounded-sm p-4 space-y-2">
                  <h3 className="font-['Syne',sans-serif] text-sm font-bold uppercase">
                    Centralized Academic Hub
                  </h3>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    Teachers upload homework, assignments, and study materials in one organized place, eliminating clutter and lost documents.
                  </p>
                </div>
                <div className="border border-[#111111]/10 rounded-sm p-4 space-y-2">
                  <h3 className="font-['Syne',sans-serif] text-sm font-bold uppercase">
                    Replaces WhatsApp Groups
                  </h3>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    Designed to reduce dependency on noisy personal messaging groups, protecting student privacy and keeping classwork focused.
                  </p>
                </div>
                <div className="border border-[#111111]/10 rounded-sm p-4 space-y-2">
                  <h3 className="font-['Syne',sans-serif] text-sm font-bold uppercase">
                    Streamlined Communication
                  </h3>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    Subject spaces, homework deadline reminders, and academic resource libraries easily accessible for the entire class.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#F9FAFB] border border-[#111111]/10 rounded-sm flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-[#111111]">Built by Rudar Sharma</div>
                  <div className="text-[10px] text-[#777777] font-mono">Engineered with Flutter & Mobile Architecture</div>
                </div>
                <a
                  href="https://www.instagram.com/p/DdCKTVeoJxO/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-[#E1306C] to-[#C13584] text-white rounded-md text-xs font-sans font-semibold hover:opacity-90 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>View on Instagram</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ) : currentUrl === 'rudar://servercraft' ? (
            /* ServerCraft Dedicated Showcase View */
            <div className="min-h-full bg-[#FFFFFF] text-[#111111] p-8 max-w-4xl mx-auto space-y-8 font-sans">
              <div className="border-b border-[#111111]/10 pb-6 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0E1B2E]">
                    CLOUD ORCHESTRATION // SERVERCRAFT
                  </span>
                  <h1 className="font-['Syne',sans-serif] text-3xl font-extrabold uppercase mt-1">
                    ServerCraft
                  </h1>
                  <p className="text-xs text-[#555555] font-mono mt-1">
                    High-performance Minecraft server deployment engine with automated Docker container lifecycle management.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-sm bg-[#0E1B2E]/10 text-[#0E1B2E] font-mono text-xs font-semibold shrink-0">
                  Container Platform
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-[#111111]/10 rounded-sm p-4 space-y-2">
                  <h3 className="font-['Syne',sans-serif] text-sm font-bold uppercase">
                    One-Click Provisioning
                  </h3>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    Spins up Spigot, Paper, Purpur, and Fabric server instances with automatic port forwarding and Java runtime detection.
                  </p>
                </div>
                <div className="border border-[#111111]/10 rounded-sm p-4 space-y-2">
                  <h3 className="font-['Syne',sans-serif] text-sm font-bold uppercase">
                    Telemetry & RAM Balancing
                  </h3>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    Real-time TPS monitor, JVM garbage collection optimization, and dynamic heap scaling to prevent server lag.
                  </p>
                </div>
                <div className="border border-[#111111]/10 rounded-sm p-4 space-y-2">
                  <h3 className="font-['Syne',sans-serif] text-sm font-bold uppercase">
                    Automated Backups
                  </h3>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    Scheduled world snapshots and instantaneous restore points with zero downtime or world file corruption.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#F9FAFB] border border-[#111111]/10 rounded-sm flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-[#111111]">Built by Rudar Sharma</div>
                  <div className="text-[10px] text-[#777777] font-mono">Engineered for low-latency gaming hosts</div>
                </div>
                <a
                  href="https://www.instagram.com/p/DdWL3HyIhgN/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-[#E1306C] to-[#C13584] text-white rounded-md text-xs font-sans font-semibold hover:opacity-90 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>View on Instagram</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ) : currentUrl.includes('instagram.com') ? (
            /* Instagram Dedicated Preview View (prevents X-Frame-Options block) */
            <div className="min-h-full bg-[#0F1015] text-white p-8 max-w-xl mx-auto space-y-6 flex flex-col items-center justify-center text-center font-sans">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] text-white flex items-center justify-center shadow-lg shadow-pink-500/20">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Instagram Project Showcase
                </h2>
                <p className="text-xs text-zinc-400 font-sans max-w-md leading-relaxed">
                  {currentUrl.includes('DdCKTVeoJxO')
                    ? 'AfterClass • Official Showcase Post by Rudar Sharma'
                    : currentUrl.includes('DdWL3HyIhgN')
                    ? 'ServerCraft • Official Showcase Post by Rudar Sharma'
                    : 'Official project post by Rudar Sharma on Instagram'}
                </p>
              </div>
              <div className="flex gap-3">
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white text-xs font-semibold tracking-wider flex items-center gap-2 hover:opacity-95 shadow-md shadow-pink-500/30 transition-all"
                >
                  <span>Open Instagram Post</span>
                  <ExternalLink size={14} />
                </a>
                <button
                  onClick={() => navigateTo('rudar://start')}
                  className="px-4 py-2.5 rounded-lg border border-white/20 text-xs font-sans text-zinc-300 hover:bg-white/10"
                >
                  Back to Browser
                </button>
              </div>
            </div>
          ) : currentUrl.includes('linkedin.com') ? (
            /* LinkedIn Dedicated Preview View (prevents X-Frame-Options block) */
            <div className="min-h-full bg-[#FFFFFF] text-[#111111] p-8 max-w-xl mx-auto space-y-6 flex flex-col items-center justify-center text-center font-sans">
              <div className="w-16 h-16 rounded-full bg-[#0E1B2E] text-white flex items-center justify-center shadow-md">
                <LinkedinIcon size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="font-['Syne',sans-serif] text-2xl font-extrabold uppercase">
                  Rudar Sharma on LinkedIn
                </h2>
                <p className="text-xs text-[#555555] font-mono max-w-md leading-relaxed">
                  STEM Scholar • Flutter & Systems Engineer • Finalist at Delhi AI Grand Hackathon (Top 140 India) • Intern at Axlero, Innovexis, Labmentix & HOOLLOW.
                </p>
              </div>
              <div className="flex gap-3">
                <a
                  href="https://linkedin.com/in/rudarsharma-dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-sm bg-[#8B1E1E] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#A62B2B] transition-colors"
                >
                  <span>Open LinkedIn Profile</span>
                  <ExternalLink size={14} />
                </a>
                <button
                  onClick={() => navigateTo('rudar://start')}
                  className="px-4 py-2.5 rounded-sm border border-[#111111]/20 text-xs font-mono text-[#111111] hover:bg-[#111111]/5"
                >
                  Back to Portfolio
                </button>
              </div>
            </div>
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
