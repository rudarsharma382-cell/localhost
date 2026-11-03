'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOSStore } from '@/os/window-manager/store';
import { AppIconId } from '@/components/icons/AppIcons';
import { ExternalLink, ArrowUpRight, Award, Shield, Eye, Globe, BookOpen } from 'lucide-react';

interface RetroPortfolioProps {
  onOpenApp?: (appId: AppIconId) => void;
}

export function RetroPortfolio({ onOpenApp }: RetroPortfolioProps) {
  const { openWindow } = useOSStore();
  const [activeTab, setActiveTab] = useState<'works' | 'about' | 'contact'>('works');

  const handleLaunch = (appId: AppIconId) => {
    if (onOpenApp) {
      onOpenApp(appId);
    } else {
      openWindow(appId);
    }
  };

  const projects = [
    {
      num: '01',
      id: 'safeware' as AppIconId,
      name: 'SafeWare AI',
      category: 'Road Safety & Computer Vision',
      accolade: 'Top 140 • Delhi AI Grand Hackathon',
      desc: 'Edge-computed hazard detection and driver telemetry architecture built with Flutter and real-time computer vision streams.',
      stack: ['Flutter', 'Computer Vision', 'Edge AI', 'Dart'],
      icon: <Shield size={18} className="text-[#8B1E1E]" />,
    },
    {
      num: '02',
      id: 'trusight' as AppIconId,
      name: 'TruSight AI',
      category: 'Media Verification & Forensic Intelligence',
      accolade: 'Synthetic Media Detection',
      desc: 'Multi-modal media authenticity engine performing artifact aggregation, reverse image analysis, and offline verification.',
      stack: ['Flutter', 'Multi-Model AI', 'Forensics', 'REST API'],
      icon: <Eye size={18} className="text-[#8B1E1E]" />,
    },
    {
      num: '03',
      id: 'browser' as AppIconId,
      name: 'WorldOS',
      category: 'Geospatial Data & 3D Telemetry',
      accolade: 'Interactive 3D Engine',
      desc: 'Global real-time data visualization framework rendering multi-layered telemetry and geospatial streams on interactive 3D globes.',
      stack: ['Three.js', 'React', 'Telemetry', 'WebGL'],
      icon: <Globe size={18} className="text-[#0E1B2E]" />,
    },
    {
      num: '04',
      id: 'notes' as AppIconId,
      name: 'AfterClass',
      category: 'Academic Spaces & Community Architecture',
      accolade: 'High-Concurrency Platform',
      desc: 'Class-specific discussion spaces, homework streaming, and encrypted teacher upload workflows built for zero latency.',
      stack: ['Flutter', 'Realtime DB', 'State Machine', 'Mobile UI'],
      icon: <BookOpen size={18} className="text-[#0E1B2E]" />,
    },
  ];

  return (
    <div className="w-full min-h-full bg-[#FFFFFF] text-[#111111] font-sans selection:bg-[#8B1E1E] selection:text-white pb-16">
      {/* 1. Precision Top Editorial Bar */}
      <header className="sticky top-0 z-20 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#111111]/10 px-6 sm:px-10 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-['Syne',sans-serif] font-extrabold text-sm tracking-wider text-[#111111] uppercase">
            Rudar Sharma
          </span>
          <span className="text-[#8B1E1E] font-mono text-[10px] tracking-widest hidden sm:inline">
            / 2026 FOLIO
          </span>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#8B1E1E] animate-ping" />
          <span className="text-[#111111]/70 tracking-wide text-[11px] hidden md:inline">
            DELHI AI HACKATHON • TOP 140
          </span>
        </div>

        {/* Navigation jump */}
        <nav className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider text-[#111111]/70">
          <button
            onClick={() => setActiveTab('works')}
            className={`transition-colors cursor-pointer ${
              activeTab === 'works' ? 'text-[#8B1E1E] font-bold border-b border-[#8B1E1E]' : 'hover:text-[#111111]'
            }`}
          >
            Works
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`transition-colors cursor-pointer ${
              activeTab === 'about' ? 'text-[#8B1E1E] font-bold border-b border-[#8B1E1E]' : 'hover:text-[#111111]'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`transition-colors cursor-pointer ${
              activeTab === 'contact' ? 'text-[#8B1E1E] font-bold border-b border-[#8B1E1E]' : 'hover:text-[#111111]'
            }`}
          >
            Connect
          </button>
        </nav>
      </header>

      {/* 2. Main Container with White Frontend & Retro Red Styling */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 pt-10 sm:pt-16 space-y-16">
        {/* HERO SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="border-b border-[#111111]/10 pb-12"
        >
          <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#8B1E1E]/10 text-[#8B1E1E] font-mono text-[11px] font-semibold tracking-wider uppercase">
                <Award size={13} />
                <span>Delhi AI Grand Hackathon • Top 140</span>
              </div>

              <h1 className="font-['Syne',sans-serif] text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#111111] leading-[1.08] uppercase">
                Flutter & App <br />
                <span className="text-[#8B1E1E]">Developer.</span>
              </h1>

              <p className="text-[#444444] text-sm sm:text-base leading-relaxed max-w-lg font-normal">
                Engineering high-performance mobile systems, safety-critical computer vision applications, and responsive cross-platform architectures with pure UI restraint.
              </p>
            </div>

            {/* Avatar Frame with Retro Hairline Border */}
            <div className="shrink-0 relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 border-2 border-[#8B1E1E]/30 bg-[#FFFFFF] shadow-md">
                <img
                  src="/assets/rudar-avatar.jpg"
                  alt="Rudar Sharma"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-[#8B1E1E] text-white font-mono text-[9px] uppercase tracking-wider rounded-sm font-semibold shadow-sm">
                Rudar
              </span>
            </div>
          </div>
        </motion.section>

        {/* SECTION: SELECTED WORKS (ZERO CARD SPAM • PURE EDITORIAL ROWS) */}
        {activeTab === 'works' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="flex items-baseline justify-between border-b border-[#111111]/10 pb-3">
              <h2 className="font-['Syne',sans-serif] text-xs font-bold tracking-[0.25em] text-[#8B1E1E] uppercase">
                // 01 Selected Systems & Works
              </h2>
              <span className="text-[#111111]/50 text-xs font-mono">
                Click row to inspect live in Rudar OS
              </span>
            </div>

            <div className="divide-y divide-[#111111]/10">
              {projects.map((proj) => (
                <motion.div
                  key={proj.id}
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => handleLaunch(proj.id)}
                  className="group py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-[#8B1E1E]/[0.02] transition-colors px-2 -mx-2 rounded-sm"
                >
                  <div className="flex items-start gap-4 max-w-lg">
                    <span className="font-mono text-xs text-[#8B1E1E] font-bold tracking-wider pt-0.5">
                      {proj.num}
                    </span>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-['Syne',sans-serif] text-lg font-bold text-[#111111] group-hover:text-[#8B1E1E] transition-colors uppercase">
                          {proj.name}
                        </h3>
                        <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#111111]/5 text-[#444444] rounded-sm">
                          {proj.accolade}
                        </span>
                      </div>
                      <p className="text-xs text-[#555555] leading-relaxed">
                        {proj.desc}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {proj.stack.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono text-[#0E1B2E] bg-[#0E1B2E]/5 px-1.5 py-0.5 rounded-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-sm bg-[#111111] text-white text-xs font-mono font-medium flex items-center gap-1.5 group-hover:bg-[#8B1E1E] transition-colors"
                    >
                      <span>Open App</span>
                      <ArrowUpRight size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* SECTION: ABOUT & CORE METHODOLOGY */}
        {activeTab === 'about' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="flex items-baseline justify-between border-b border-[#111111]/10 pb-3">
              <h2 className="font-['Syne',sans-serif] text-xs font-bold tracking-[0.25em] text-[#8B1E1E] uppercase">
                // 02 Engineering Approach & Background
              </h2>
            </div>

            <div className="space-y-6 text-[#333333] text-sm leading-relaxed max-w-2xl">
              <p>
                I am a mobile and web systems engineer specializing in <strong>Flutter</strong> and full-stack application development. I prioritize rock-solid state management, physical device frame rates, and zero unnecessary visual clutter.
              </p>
              <p>
                My featured project, <strong>SafeWare AI</strong>, was selected among the <strong>Top 140</strong> at the Delhi AI Grand Hackathon, demonstrating real-time computer vision hazard detection running smoothly on mobile edge hardware.
              </p>
            </div>

            {/* Core Tenets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="p-4 border-l-2 border-[#8B1E1E] bg-[#FDFDFD] space-y-2">
                <span className="font-mono text-xs text-[#8B1E1E] font-bold">01 / DISCIPLINE</span>
                <h4 className="font-bold text-sm text-[#111111]">Zero Bloat</h4>
                <p className="text-xs text-[#666666]">
                  Strict avoidance of unnecessary dependencies, heavy AI gradients, or decorative bloat.
                </p>
              </div>

              <div className="p-4 border-l-2 border-[#0E1B2E] bg-[#FDFDFD] space-y-2">
                <span className="font-mono text-xs text-[#0E1B2E] font-bold">02 / FLUIDITY</span>
                <h4 className="font-bold text-sm text-[#111111]">60 FPS Target</h4>
                <p className="text-xs text-[#666666]">
                  Engineered for rock-steady render passes, smooth touch gestures, and instant response.
                </p>
              </div>

              <div className="p-4 border-l-2 border-[#8B1E1E] bg-[#FDFDFD] space-y-2">
                <span className="font-mono text-xs text-[#8B1E1E] font-bold">03 / RESILIENCE</span>
                <h4 className="font-bold text-sm text-[#111111]">Offline First</h4>
                <p className="text-xs text-[#666666]">
                  Fallback caching and graceful offline degradation built into every core network loop.
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* SECTION: CONNECT & EXTERNAL PROFILES */}
        {activeTab === 'contact' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="flex items-baseline justify-between border-b border-[#111111]/10 pb-3">
              <h2 className="font-['Syne',sans-serif] text-xs font-bold tracking-[0.25em] text-[#8B1E1E] uppercase">
                // 03 Public Endpoints & Repositories
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="https://github.com/rudarsharma382-cell"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 border border-[#111111]/10 hover:border-[#8B1E1E] transition-colors rounded-sm flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-['Syne',sans-serif] font-bold text-sm text-[#111111] group-hover:text-[#8B1E1E] transition-colors">
                    GitHub Repositories
                  </h4>
                  <p className="text-xs text-[#666666] font-mono mt-0.5">
                    github.com/rudarsharma382-cell
                  </p>
                </div>
                <ExternalLink size={16} className="text-[#8B1E1E]" />
              </a>

              <a
                href="https://linkedin.com/in/rudarsharma-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 border border-[#111111]/10 hover:border-[#8B1E1E] transition-colors rounded-sm flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-['Syne',sans-serif] font-bold text-sm text-[#111111] group-hover:text-[#8B1E1E] transition-colors">
                    LinkedIn Network
                  </h4>
                  <p className="text-xs text-[#666666] font-mono mt-0.5">
                    linkedin.com/in/rudarsharma-dev
                  </p>
                </div>
                <ExternalLink size={16} className="text-[#8B1E1E]" />
              </a>

              <a
                href="https://rudar.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 border border-[#111111]/10 hover:border-[#8B1E1E] transition-colors rounded-sm flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-['Syne',sans-serif] font-bold text-sm text-[#111111] group-hover:text-[#8B1E1E] transition-colors">
                    Live Web Deployment
                  </h4>
                  <p className="text-xs text-[#666666] font-mono mt-0.5">
                    rudar.vercel.app
                  </p>
                </div>
                <ExternalLink size={16} className="text-[#8B1E1E]" />
              </a>

              <a
                href="https://www.instagram.com/codealchemist_07/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 border border-[#111111]/10 hover:border-[#8B1E1E] transition-colors rounded-sm flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-['Syne',sans-serif] font-bold text-sm text-[#111111] group-hover:text-[#8B1E1E] transition-colors">
                    Instagram Engineering Notes
                  </h4>
                  <p className="text-xs text-[#666666] font-mono mt-0.5">
                    @codealchemist_07
                  </p>
                </div>
                <ExternalLink size={16} className="text-[#8B1E1E]" />
              </a>
            </div>
          </motion.section>
        )}
      </main>

      {/* 3. Footer */}
      <footer className="max-w-4xl mx-auto px-6 sm:px-10 mt-20 pt-6 border-t border-[#111111]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#666666] font-mono">
        <div>&copy; 2026 Rudar Sharma. All Rights Reserved.</div>
        <div className="text-[#8B1E1E]">Delhi AI Grand Hackathon • Top 140</div>
      </footer>
    </div>
  );
}

export default RetroPortfolio;

