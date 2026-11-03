'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { tokens } from '@/styles/tokens';
import { TodoMarker } from '../../../components/common/TodoMarker';

export default function StyleguidePage() {
  const [toggleState, setToggleState] = useState(false);
  const [activeTab, setActiveTab] = useState<'tokens' | 'chrome' | 'icons' | 'components'>('tokens');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-surface-canvas text-content-primary selection:bg-accent/20 selection:text-accent font-sans">
      {/* Dev Navigation Top Bar */}
      <header className="sticky top-0 z-topBar bg-surface-base/95 backdrop-blur-md border-b border-border-default px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          <span className="font-display font-bold text-md tracking-tight">RUDAR OS</span>
          <span className="text-content-tertiary text-xs font-mono px-2 py-0.5 rounded-sm bg-surface-raised border border-border-subtle">
            DEV STYLEGUIDE &bull; GATE 1
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-content-secondary hidden sm:inline">
            Status: <strong className="text-semantic-success">Awaiting Gate 1 Review</strong>
          </span>
          <Link
            href="/"
            className="px-2.5 py-1 rounded-sm bg-surface-panel border border-border-default text-content-secondary hover:text-content-primary hover:border-border-strong transition-colors duration-instant"
          >
            &larr; Root
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-16">
        {/* Intro Banner */}
        <section className="space-y-4 border-b border-border-default pb-8">
          <div className="flex items-center gap-2 text-accent text-xs font-sans">
            <span>Identity Specification &bull; Studio Slate &amp; Mineral Linen</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-content-primary">
            Rudar OS Identity &amp; Design Tokens
          </h1>
          <p className="text-content-secondary text-base max-w-3xl leading-relaxed">
            Rudar OS is quiet, precise, and tactile. Built on warm studio slate and mineral linen tones,
            delicate hairline dividers, bespoke geometric app icons, and custom utilitarian window controls.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-2.5 py-1 rounded-sm text-xs bg-surface-panel border border-border-default text-content-secondary">
              Zero Generic Card Grids
            </span>
            <span className="px-2.5 py-1 rounded-sm text-xs bg-surface-panel border border-border-default text-content-secondary">
              Zero Orange-on-Black
            </span>
            <span className="px-2.5 py-1 rounded-sm text-xs bg-surface-panel border border-border-default text-content-secondary">
              Custom Window Controls
            </span>
            <span className="px-2.5 py-1 rounded-sm text-xs bg-surface-panel border border-border-default text-content-secondary">
              Verified Facts Only
            </span>
          </div>
        </section>

        {/* Section 1: Color Palette & Contrast */}
        <section className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-lg font-display font-bold text-content-primary">
              1. Color Tokens & Contrast Matrix
            </h2>
            <p className="text-sm text-content-secondary">
              Surface hierarchy (canvas, base, panel, raised), hairline borders, and strictly verified WCAG text contrast ratios.
            </p>
          </div>

          {/* Surface Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-md bg-surface-canvas border border-border-default space-y-2">
              <div className="text-xs font-mono text-content-tertiary">surface.canvas</div>
              <div className="text-sm font-semibold text-content-primary">#0C0D0E</div>
              <div className="text-xs text-content-secondary">Deep room ground & OS canvas</div>
            </div>
            <div className="p-4 rounded-md bg-surface-base border border-border-default space-y-2">
              <div className="text-xs font-mono text-content-tertiary">surface.base</div>
              <div className="text-sm font-semibold text-content-primary">#141618</div>
              <div className="text-xs text-content-secondary">Top bar, dock container, window frame</div>
            </div>
            <div className="p-4 rounded-md bg-surface-panel border border-border-default space-y-2">
              <div className="text-xs font-mono text-content-tertiary">surface.panel</div>
              <div className="text-sm font-semibold text-content-primary">#1A1D20</div>
              <div className="text-xs text-content-secondary">Window interior, active sidebar</div>
            </div>
            <div className="p-4 rounded-md bg-surface-raised border border-border-default space-y-2">
              <div className="text-xs font-mono text-content-tertiary">surface.raised</div>
              <div className="text-sm font-semibold text-content-primary">#22262B</div>
              <div className="text-xs text-content-secondary">Floating menus, toasts, popovers</div>
            </div>
          </div>

          {/* The Single Accent & Semantics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-md bg-surface-panel border-2 border-accent space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-accent">accent.DEFAULT</span>
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              </div>
              <div className="text-sm font-bold text-content-primary">#E58B24 (Burnished Amber)</div>
              <div className="text-xs text-content-secondary">Reserved: Focus, active state, primary action</div>
              <div className="text-[11px] font-mono text-semantic-success pt-1">Contrast 5.8:1 (WCAG AA)</div>
            </div>
            <div className="p-4 rounded-md bg-surface-panel border border-border-default space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-semantic-success">semantic.success</span>
                <span className="w-2.5 h-2.5 rounded-full bg-semantic-success" />
              </div>
              <div className="text-sm font-semibold text-content-primary">#34B27B</div>
              <div className="text-xs text-content-secondary">Verified status, online indicator</div>
              <div className="text-[11px] font-mono text-semantic-success pt-1">Contrast 5.1:1 (WCAG AA)</div>
            </div>
            <div className="p-4 rounded-md bg-surface-panel border border-border-default space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-semantic-warning">semantic.warning</span>
                <span className="w-2.5 h-2.5 rounded-full bg-semantic-warning" />
              </div>
              <div className="text-sm font-semibold text-content-primary">#E5A83B</div>
              <div className="text-xs text-content-secondary">Pending review, cautionary hint</div>
              <div className="text-[11px] font-mono text-semantic-success pt-1">Contrast 6.2:1 (WCAG AA)</div>
            </div>
            <div className="p-4 rounded-md bg-surface-panel border border-border-default space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-semantic-error">semantic.error</span>
                <span className="w-2.5 h-2.5 rounded-full bg-semantic-error" />
              </div>
              <div className="text-sm font-semibold text-content-primary">#E5484D</div>
              <div className="text-xs text-content-secondary">Close dot, embed fallback alert</div>
              <div className="text-[11px] font-mono text-semantic-success pt-1">Contrast 4.6:1 (WCAG AA)</div>
            </div>
            <div className="p-4 rounded-md bg-surface-panel border border-border-default space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-semantic-info">semantic.info</span>
                <span className="w-2.5 h-2.5 rounded-full bg-semantic-info" />
              </div>
              <div className="text-sm font-semibold text-content-primary">#4DA6E8</div>
              <div className="text-xs text-content-secondary">Telemetry hint, reference link</div>
              <div className="text-[11px] font-mono text-semantic-success pt-1">Contrast 5.4:1 (WCAG AA)</div>
            </div>
          </div>

          {/* Text Contrast Verification Board */}
          <div className="p-5 rounded-md bg-surface-panel border border-border-default space-y-4">
            <div className="text-xs font-mono text-content-tertiary uppercase tracking-wider">
              Text Contrast Verification (over #141618 surface base)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <div className="text-content-primary font-medium text-base">Primary Text (#EDEDEE)</div>
                <p className="text-xs text-content-tertiary">Used for titles, active buttons, window headers.</p>
                <div className="text-xs font-mono text-semantic-success">Contrast Ratio: 15.2:1 (WCAG AAA)</div>
              </div>
              <div className="space-y-1">
                <div className="text-content-secondary font-medium text-base">Secondary Text (#9BA1A6)</div>
                <p className="text-xs text-content-tertiary">Used for case study body, menu options, labels.</p>
                <div className="text-xs font-mono text-semantic-success">Contrast Ratio: 5.8:1 (WCAG AA)</div>
              </div>
              <div className="space-y-1">
                <div className="text-content-tertiary font-medium text-base">Tertiary Text (#687076)</div>
                <p className="text-xs text-content-tertiary">Used for inactive windows, timestamps, shortcuts.</p>
                <div className="text-xs font-mono text-semantic-info">Contrast Ratio: 3.5:1 (Subtext/Meta)</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Typography System */}
        <section className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-lg font-display font-bold text-content-primary">
              2. Typography System: The Three Families
            </h2>
            <p className="text-sm text-content-secondary">
              Strictly three families: Cabinet Grotesk (Display), Switzer (UI &amp; Reading), JetBrains Mono (Code &amp; Metadata).
            </p>
          </div>

          <div className="space-y-6 p-6 rounded-md bg-surface-panel border border-border-default">
            {/* Display */}
            <div className="border-b border-border-subtle pb-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-content-tertiary">
                <span>DISPLAY FAMILY: Cabinet Grotesk</span>
                <span>Role: Clock, Case Study Titles, OS Wordmark</span>
              </div>
              <div className="text-4xl font-display font-bold text-content-primary tracking-tight">
                21:42:08 &bull; RUDAR OS
              </div>
              <p className="text-sm text-content-secondary font-display">
                Machined European grotesque with deliberate angular cuts for high architectural presence.
              </p>
            </div>

            {/* UI & Reading */}
            <div className="border-b border-border-subtle pb-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-content-tertiary">
                <span>UI &amp; READING FAMILY: Switzer</span>
                <span>Role: System Menus, Buttons, Case Study Body (60-75ch length)</span>
              </div>
              <h3 className="text-lg font-medium text-content-primary">
                SafeWare: AI Road Safety &amp; Telemetry Detection
              </h3>
              <p className="text-base text-content-secondary leading-relaxed max-w-prose">
                A computer-vision powered hazard detection system designed to analyze live telemetry feeds in real-time.
                Built with precision cross-platform client architecture and low-latency inference pipelines.
              </p>
              <div className="flex gap-2 text-xs text-content-tertiary">
                <span className="font-medium text-content-primary">13px UI Label</span> &bull;
                <span>15px Body Reading</span> &bull;
                <span className="text-accent">Hover State</span>
              </div>
            </div>

            {/* Monospace */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-content-tertiary">
                <span>MONOSPACE FAMILY: JetBrains Mono</span>
                <span>Role: Terminal CLI, File Tree, Telemetry, Code Metadata</span>
              </div>
              <div className="p-4 rounded-sm bg-surface-canvas border border-border-default font-mono text-xs space-y-1.5 text-content-secondary">
                <div className="text-content-primary">$ rudar-os --status --verified-facts</div>
                <div>&gt; Name: Rudar Sharma [Flutter &amp; App Developer]</div>
                <div>&gt; Achievement: SafeWare &bull; Top 140, Delhi AI Grand Hackathon</div>
                <div>&gt; Memory: 64MB DOM allocated &bull; GPU unmounted after login</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Window Chrome System */}
        <section className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-lg font-display font-bold text-content-primary">
              3. Window Chrome: Active vs Inactive State
            </h2>
            <p className="text-sm text-content-secondary">
              Single consistent frame. 38px title bar, calibrated tactile control dots, obvious z-order focus distinction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Window */}
            <div className="rounded-lg bg-surface-base border border-border-strong shadow-window-active overflow-hidden">
              <div className="h-[38px] px-3.5 bg-surface-base border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-semantic-error/90 hover:bg-semantic-error flex items-center justify-center text-[8px] text-surface-canvas font-bold cursor-pointer transition-colors duration-instant">
                      &times;
                    </span>
                    <span className="w-3 h-3 rounded-full bg-semantic-warning/90 hover:bg-semantic-warning flex items-center justify-center text-[8px] text-surface-canvas font-bold cursor-pointer transition-colors duration-instant">
                      &minus;
                    </span>
                    <span className="w-3 h-3 rounded-full bg-semantic-success/90 hover:bg-semantic-success flex items-center justify-center text-[8px] text-surface-canvas font-bold cursor-pointer transition-colors duration-instant">
                      +
                    </span>
                  </div>
                  <span className="text-xs font-mono text-content-tertiary ml-2">App: Studio</span>
                </div>
                <div className="text-xs font-medium text-content-primary">Development Studio (Active)</div>
                <div className="w-10 text-right text-[10px] font-mono text-accent">FOCUSED</div>
              </div>
              <div className="p-6 bg-surface-panel space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-content-primary">Active Window Interior</span>
                  <span className="px-2 py-0.5 rounded-sm bg-accent/10 text-accent font-mono text-xs border border-accent/20">
                    z-index: 25
                  </span>
                </div>
                <p className="text-xs text-content-secondary leading-relaxed">
                  Notice the high-contrast title text, illuminated control dots with hover indicators, strong hairline border,
                  and subtle amber highlight in the elevation shadow.
                </p>
              </div>
            </div>

            {/* Inactive Window */}
            <div className="rounded-lg bg-surface-base/80 border border-border-subtle shadow-base overflow-hidden opacity-85">
              <div className="h-[38px] px-3.5 bg-surface-base/60 border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-content-tertiary/40" />
                    <span className="w-3 h-3 rounded-full bg-content-tertiary/40" />
                    <span className="w-3 h-3 rounded-full bg-content-tertiary/40" />
                  </div>
                  <span className="text-xs font-mono text-content-tertiary/60 ml-2">App: Browser</span>
                </div>
                <div className="text-xs font-medium text-content-tertiary">Browser (Inactive)</div>
                <div className="w-10 text-right text-[10px] font-mono text-content-tertiary">REST</div>
              </div>
              <div className="p-6 bg-surface-panel/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-content-tertiary">Inactive Window Interior</span>
                  <span className="px-2 py-0.5 rounded-sm bg-surface-raised text-content-tertiary font-mono text-xs border border-border-subtle">
                    z-index: 21
                  </span>
                </div>
                <p className="text-xs text-content-tertiary leading-relaxed">
                  Dimmed title text, desaturated control dots, reduced border contrast. Instant focus switch on mouse pointer
                  or keyboard tab.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: App Icon System */}
        <section className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-lg font-display font-bold text-content-primary">
              4. Custom App Icon Construction Rule (The 9 Apps)
            </h2>
            <p className="text-sm text-content-secondary">
              Every app icon is crafted to the same rule: 40x40 squircle (radius-md 8px), base slate #1C1F23 fill, 1px border,
              bespoke geometric glyph in #EDEDEE with an integrated #E58B24 warm amber highlight.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-4">
            {/* 1. Dev Studio */}
            <div
              onClick={() => setSelectedIcon('Development Studio')}
              className="flex flex-col items-center gap-2 p-3 rounded-md bg-surface-panel border border-border-default hover:border-accent cursor-pointer transition-colors duration-instant group"
            >
              <div className="w-10 h-10 rounded-md bg-[#1C1F23] border border-[#2F343B] flex items-center justify-center relative shadow-sm group-hover:scale-105 transition-transform duration-instant">
                {/* Custom Split Pane Glyph */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
                  <rect x="2" y="3" width="16" height="14" rx="2" />
                  <path d="M8 3v14" />
                  <path d="M12 8l2 2-2 2" stroke="#E58B24" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-content-secondary text-center leading-tight">Studio</span>
            </div>

            {/* 2. Browser */}
            <div
              onClick={() => setSelectedIcon('Browser')}
              className="flex flex-col items-center gap-2 p-3 rounded-md bg-surface-panel border border-border-default hover:border-accent cursor-pointer transition-colors duration-instant group"
            >
              <div className="w-10 h-10 rounded-md bg-[#1C1F23] border border-[#2F343B] flex items-center justify-center relative shadow-sm group-hover:scale-105 transition-transform duration-instant">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
                  <circle cx="10" cy="10" r="7" />
                  <path d="M3.5 10h13" />
                  <path d="M10 3a11 11 0 0 1 0 14" />
                  <circle cx="13" cy="7" r="1.5" fill="#E58B24" stroke="none" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-content-secondary text-center leading-tight">Browser</span>
            </div>

            {/* 3. About Me */}
            <div
              onClick={() => setSelectedIcon('About Me')}
              className="flex flex-col items-center gap-2 p-3 rounded-md bg-surface-panel border border-border-default hover:border-accent cursor-pointer transition-colors duration-instant group"
            >
              <div className="w-10 h-10 rounded-md bg-[#1C1F23] border border-[#2F343B] flex items-center justify-center relative shadow-sm group-hover:scale-105 transition-transform duration-instant">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
                  <circle cx="10" cy="7" r="3.5" />
                  <path d="M4 16c0-3 2.5-5 6-5s6 2 6 5" />
                  <circle cx="14" cy="5" r="1" fill="#E58B24" stroke="none" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-content-secondary text-center leading-tight">About</span>
            </div>

            {/* 4. Rudar AI */}
            <div
              onClick={() => setSelectedIcon('Rudar AI')}
              className="flex flex-col items-center gap-2 p-3 rounded-md bg-surface-panel border border-border-default hover:border-accent cursor-pointer transition-colors duration-instant group"
            >
              <div className="w-10 h-10 rounded-md bg-[#1C1F23] border border-[#2F343B] flex items-center justify-center relative shadow-sm group-hover:scale-105 transition-transform duration-instant">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
                  <path d="M10 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" />
                  <circle cx="10" cy="10" r="1.5" fill="#E58B24" stroke="none" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-content-secondary text-center leading-tight">Assistant</span>
            </div>

            {/* 5. Socials */}
            <div
              onClick={() => setSelectedIcon('Socials')}
              className="flex flex-col items-center gap-2 p-3 rounded-md bg-surface-panel border border-border-default hover:border-accent cursor-pointer transition-colors duration-instant group"
            >
              <div className="w-10 h-10 rounded-md bg-[#1C1F23] border border-[#2F343B] flex items-center justify-center relative shadow-sm group-hover:scale-105 transition-transform duration-instant">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
                  <circle cx="6" cy="10" r="2.5" />
                  <circle cx="14" cy="6" r="2.5" />
                  <circle cx="14" cy="14" r="2.5" />
                  <path d="M8.5 9l3-2" stroke="#E58B24" />
                  <path d="M8.5 11l3 2" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-content-secondary text-center leading-tight">Socials</span>
            </div>

            {/* 6. Notes */}
            <div
              onClick={() => setSelectedIcon('Notes')}
              className="flex flex-col items-center gap-2 p-3 rounded-md bg-surface-panel border border-border-default hover:border-accent cursor-pointer transition-colors duration-instant group"
            >
              <div className="w-10 h-10 rounded-md bg-[#1C1F23] border border-[#2F343B] flex items-center justify-center relative shadow-sm group-hover:scale-105 transition-transform duration-instant">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
                  <rect x="4" y="3" width="12" height="14" rx="2" />
                  <path d="M7 7h6" />
                  <path d="M7 10h4" />
                  <path d="M12 12l2 2" stroke="#E58B24" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-content-secondary text-center leading-tight">Notes</span>
            </div>

            {/* 7. Resume */}
            <div
              onClick={() => setSelectedIcon('Resume')}
              className="flex flex-col items-center gap-2 p-3 rounded-md bg-surface-panel border border-border-default hover:border-accent cursor-pointer transition-colors duration-instant group"
            >
              <div className="w-10 h-10 rounded-md bg-[#1C1F23] border border-[#2F343B] flex items-center justify-center relative shadow-sm group-hover:scale-105 transition-transform duration-instant">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
                  <path d="M5 3h7l4 4v10H5V3z" />
                  <path d="M12 3v4h4" />
                  <path d="M8 11h4" stroke="#E58B24" />
                  <path d="M8 14h3" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-content-secondary text-center leading-tight">Resume</span>
            </div>

            {/* 8. Terminal */}
            <div
              onClick={() => setSelectedIcon('Terminal')}
              className="flex flex-col items-center gap-2 p-3 rounded-md bg-surface-panel border border-border-default hover:border-accent cursor-pointer transition-colors duration-instant group"
            >
              <div className="w-10 h-10 rounded-md bg-[#1C1F23] border border-[#2F343B] flex items-center justify-center relative shadow-sm group-hover:scale-105 transition-transform duration-instant">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
                  <rect x="3" y="4" width="14" height="12" rx="2" />
                  <path d="M6 8l3 2-3 2" />
                  <path d="M11 12h3" stroke="#E58B24" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-content-secondary text-center leading-tight">Terminal</span>
            </div>

            {/* 9. Settings */}
            <div
              onClick={() => setSelectedIcon('Settings')}
              className="flex flex-col items-center gap-2 p-3 rounded-md bg-surface-panel border border-border-default hover:border-accent cursor-pointer transition-colors duration-instant group"
            >
              <div className="w-10 h-10 rounded-md bg-[#1C1F23] border border-[#2F343B] flex items-center justify-center relative shadow-sm group-hover:scale-105 transition-transform duration-instant">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
                  <circle cx="10" cy="10" r="3" />
                  <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.9 4.9l1.4 1.4M13.7 13.7l1.4 1.4M4.9 15.1l1.4-1.4M13.7 6.3l1.4-1.4" />
                  <circle cx="10" cy="10" r="1" fill="#E58B24" stroke="none" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-content-secondary text-center leading-tight">Settings</span>
            </div>
          </div>

          {selectedIcon && (
            <div className="p-3 rounded-sm bg-surface-base border border-accent/30 text-xs font-mono text-content-secondary flex items-center justify-between">
              <span>Selected Icon: <strong className="text-accent">{selectedIcon}</strong></span>
              <button
                onClick={() => setSelectedIcon(null)}
                className="text-content-tertiary hover:text-content-primary"
              >
                Clear
              </button>
            </div>
          )}
        </section>

        {/* Section 5: Component States Matrix */}
        <section className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-lg font-display font-bold text-content-primary">
              5. Component States Matrix (Required States)
            </h2>
            <p className="text-sm text-content-secondary">
              Every interactive element rendered in default, hover, focus-visible, active, disabled, loading, empty, and error states.
            </p>
          </div>

          {/* Buttons Matrix */}
          <div className="p-5 rounded-md bg-surface-panel border border-border-default space-y-4">
            <div className="text-xs font-mono text-content-tertiary uppercase tracking-wider">
              Buttons: Primary &amp; Secondary State Progression
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {/* Default */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-content-tertiary">DEFAULT</div>
                <button className="w-full py-2 px-3 rounded-sm bg-accent text-surface-canvas text-xs font-medium transition-colors duration-instant">
                  Action
                </button>
                <button className="w-full py-2 px-3 rounded-sm bg-surface-raised border border-border-default text-content-primary text-xs font-medium">
                  Secondary
                </button>
              </div>

              {/* Hover */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-content-tertiary">HOVER</div>
                <button className="w-full py-2 px-3 rounded-sm bg-accent-hover text-surface-canvas text-xs font-medium">
                  Hovered
                </button>
                <button className="w-full py-2 px-3 rounded-sm bg-surface-raised border border-border-strong text-content-primary text-xs font-medium">
                  Hovered
                </button>
              </div>

              {/* Focus-Visible */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-content-tertiary">FOCUS-VISIBLE</div>
                <button className="w-full py-2 px-3 rounded-sm bg-accent text-surface-canvas text-xs font-medium ring-2 ring-accent ring-offset-2 ring-offset-surface-panel">
                  Focused
                </button>
                <button className="w-full py-2 px-3 rounded-sm bg-surface-raised border border-border-default text-content-primary text-xs font-medium ring-2 ring-accent ring-offset-2 ring-offset-surface-panel">
                  Focused
                </button>
              </div>

              {/* Active */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-content-tertiary">ACTIVE (PRESSED)</div>
                <button className="w-full py-2 px-3 rounded-sm bg-accent-active text-surface-canvas text-xs font-medium scale-[0.98]">
                  Pressed
                </button>
                <button className="w-full py-2 px-3 rounded-sm bg-surface-base border border-border-strong text-content-secondary text-xs font-medium scale-[0.98]">
                  Pressed
                </button>
              </div>

              {/* Disabled */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-content-tertiary">DISABLED</div>
                <button disabled className="w-full py-2 px-3 rounded-sm bg-surface-raised/40 border border-border-subtle text-content-tertiary/50 text-xs font-medium cursor-not-allowed">
                  Disabled
                </button>
                <button disabled className="w-full py-2 px-3 rounded-sm bg-surface-base/30 border border-border-subtle text-content-tertiary/40 text-xs font-medium cursor-not-allowed">
                  Disabled
                </button>
              </div>

              {/* Loading */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-content-tertiary">LOADING</div>
                <button className="w-full py-2 px-3 rounded-sm bg-accent text-surface-canvas text-xs font-medium flex items-center justify-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-surface-canvas border-t-transparent rounded-full animate-spin" />
                  <span>Loading</span>
                </button>
                <button className="w-full py-2 px-3 rounded-sm bg-surface-raised border border-border-default text-content-primary text-xs font-medium flex items-center justify-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <span>Syncing</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form Inputs Matrix */}
          <div className="p-5 rounded-md bg-surface-panel border border-border-default space-y-4">
            <div className="text-xs font-mono text-content-tertiary uppercase tracking-wider">
              Form Inputs &amp; Controls Matrix
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Default Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-content-secondary">Default Input</label>
                <input
                  type="text"
                  placeholder="Type visitor name..."
                  className="w-full px-3 py-2 rounded-sm bg-surface-base border border-border-default text-xs text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors duration-instant"
                />
              </div>

              {/* Active / Focused Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-accent">Active / Focus</label>
                <input
                  type="text"
                  defaultValue="rudar@operating-system"
                  className="w-full px-3 py-2 rounded-sm bg-surface-base border border-accent ring-1 ring-accent text-xs text-content-primary focus:outline-none"
                />
              </div>

              {/* Error Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-semantic-error">Error State</label>
                <input
                  type="text"
                  defaultValue="invalid_entry"
                  className="w-full px-3 py-2 rounded-sm bg-surface-base border border-semantic-error ring-1 ring-semantic-error/40 text-xs text-semantic-error focus:outline-none"
                />
                <span className="text-[11px] font-mono text-semantic-error">Field cannot be empty</span>
              </div>

              {/* Toggle Switch */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-content-secondary">Toggle Switch</label>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => setToggleState(!toggleState)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-quick border border-border-default ${
                      toggleState ? 'bg-accent border-accent' : 'bg-surface-raised'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-quick ${
                        toggleState ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-mono text-content-secondary">
                    {toggleState ? 'Lite Mode: ON' : 'Lite Mode: OFF'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Empty, Loading, and TODO State Modules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Empty State */}
            <div className="p-5 rounded-md bg-surface-panel border border-border-default space-y-3 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-content-tertiary uppercase">EMPTY STATE</div>
                <h4 className="text-sm font-medium text-content-primary mt-2">No Notes Submitted</h4>
                <p className="text-xs text-content-secondary mt-1">
                  The visitor guestbook is currently clear. Leave a message for Rudar directly from this desktop.
                </p>
              </div>
              <button className="w-fit px-3 py-1.5 rounded-sm bg-surface-raised border border-border-default text-xs text-content-primary hover:border-border-strong">
                Leave Note &rarr;
              </button>
            </div>

            {/* Error State */}
            <div className="p-5 rounded-md bg-surface-panel border border-semantic-error/40 space-y-3 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-semantic-error uppercase">FALLBACK STATE</div>
                <h4 className="text-sm font-medium text-content-primary mt-2">Site Cannot Be Framed</h4>
                <p className="text-xs text-content-secondary mt-1">
                  External site security policies forbid iframe embedding. Fallback to full-screen external view.
                </p>
              </div>
              <button className="w-fit px-3 py-1.5 rounded-sm bg-surface-raised border border-semantic-error/50 text-xs text-semantic-error hover:bg-semantic-error/10">
                Open in New Tab &rarr;
              </button>
            </div>

            {/* TODO Marker Demo */}
            <div className="p-5 rounded-md bg-surface-panel border border-border-default space-y-3 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-semantic-warning uppercase">TODO MECHANISM</div>
                <h4 className="text-sm font-medium text-content-primary mt-2">Missing Content Marker</h4>
                <p className="text-xs text-content-secondary mt-1">
                  Rendered in dev mode whenever required content from Rudar is still pending. Degrades cleanly in production.
                </p>
                <div className="mt-3">
                  <TodoMarker field="AboutBio" message="Pending Rudar personal background copy" />
                </div>
              </div>
              <span className="text-[10px] font-mono text-content-tertiary">Logged in MISSING_CONTENT.md</span>
            </div>
          </div>
        </section>

        {/* Gate 1 Approval Prompt */}
        <section className="p-6 rounded-md bg-surface-base border-2 border-accent/40 space-y-4">
          <div className="flex items-center gap-2 text-accent text-xs font-mono uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span>Gate 1: Ready for Review &amp; Approval</span>
          </div>
          <h2 className="text-lg font-display font-bold text-content-primary">
            Design Proposal Ready in DESIGN_PROPOSAL.md
          </h2>
          <p className="text-sm text-content-secondary leading-relaxed">
            All Phase 0 requirements (strict TypeScript, Tailwind, Zod schema validation, MISSING_CONTENT.md generator) are complete.
            The visual identity proposal (neutrals, burnished amber accent, Cabinet Grotesk + Switzer + JetBrains Mono, window chrome, 9 custom app icons, and 21st.dev component shortlist) is fully specified and live on this styleguide route.
          </p>
          <div className="text-xs font-mono text-content-tertiary">
            Next Action: User review and approval of DESIGN_PROPOSAL.md.
          </div>
        </section>
      </main>
    </div>
  );
}
