'use client';

import React, { useState } from 'react';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { developerData } from '@/content/developer';
import { DeveloperCategory, LiveTechNote } from '@/content/schema';
import {
  Terminal,
  Cpu,
  Layers,
  Code2,
  FileCode,
  CheckCircle,
  Activity,
  GitBranch,
  ShieldAlert,
  Sparkles,
  Server,
  Zap,
  ArrowUpRight,
} from 'lucide-react';

interface DeveloperAppProps {
  windowId: string;
}

export default function DeveloperApp({ windowId }: DeveloperAppProps) {
  const { closeWindow, openWindow } = useOSStore();
  const [activeTab, setActiveTab] = useState<'matrix' | 'notes' | 'vitals'>('matrix');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCategories = developerData.categories.filter((cat) => {
    if (selectedCategory === 'all') return true;
    return cat.id === selectedCategory;
  });

  const filteredNotes = developerData.notes.filter((note) => {
    if (statusFilter === 'all') return true;
    return note.status === statusFilter;
  });

  return (
    <AppFrame
      appId="developer"
      title="Developer Console — System Architecture & Tech Matrix"
      onBack={() => closeWindow(windowId)}
      headerActions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => openWindow('terminal')}
            className="px-2.5 py-1 rounded bg-surface-raised hover:bg-border-default border border-border-default text-xs text-content-primary flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Launch Terminal CLI"
          >
            <Terminal size={11} className="text-accent" />
            <span className="font-mono text-[11px]">Open Terminal</span>
          </button>
        </div>
      }
      className="flex-1"
    >
      <div className="h-full bg-surface-canvas flex flex-col font-sans select-text text-content-primary overflow-hidden">
        {/* System Vitals Bar */}
        <div className="h-10 px-4 md:px-6 bg-surface-base border-b border-border-default flex items-center justify-between select-none shrink-0 font-mono text-[11px]">
          <div className="flex items-center gap-3 text-content-tertiary">
            <span className="inline-flex items-center gap-1.5 text-content-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-pulse" />
              <span>{developerData.systemVitals.kernel}</span>
            </span>
            <span className="hidden lg:inline">•</span>
            <span className="hidden lg:inline">{developerData.systemVitals.runtime}</span>
          </div>

          <div className="flex items-center gap-2 text-content-secondary">
            <span className="text-content-tertiary hidden sm:inline">Arch:</span>
            <span className="text-accent">{developerData.systemVitals.targetArch}</span>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="px-4 md:px-6 bg-surface-base/60 border-b border-border-subtle flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-1 -mb-px">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'matrix'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-content-secondary hover:text-content-primary'
              }`}
            >
              <Layers size={13} />
              <span>Stack Matrix</span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-content-secondary hover:text-content-primary'
              }`}
            >
              <FileCode size={13} />
              <span>Architecture Dispatches</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-surface-panel border border-border-subtle font-mono">
                {developerData.notes.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('vitals')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'vitals'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-content-secondary hover:text-content-primary'
              }`}
            >
              <Activity size={13} />
              <span>Environment & Specs</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {activeTab === 'matrix' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 rounded text-xs transition-colors shrink-0 cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-accent/20 border border-accent/40 text-accent font-medium'
                      : 'bg-surface-base border border-border-subtle text-content-secondary hover:text-content-primary'
                  }`}
                >
                  All Categories
                </button>
                {developerData.categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1 rounded text-xs transition-colors shrink-0 cursor-pointer ${
                      selectedCategory === c.id
                        ? 'bg-accent/20 border border-accent/40 text-accent font-medium'
                        : 'bg-surface-base border border-border-subtle text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>

              {/* Categorized Stack Grid */}
              <div className="space-y-6">
                {filteredCategories.map((cat) => (
                  <div key={cat.id} className="space-y-3">
                    <div className="border-b border-border-subtle pb-1.5 flex items-center justify-between">
                      <div>
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-content-primary">
                          {cat.title}
                        </h2>
                        <p className="text-[11px] text-content-tertiary">
                          {cat.description}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-content-tertiary">
                        {cat.items.length} tools
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {cat.items.map((item) => (
                        <div
                          key={item.name}
                          className="bg-surface-base border border-border-subtle hover:border-border-default rounded-md p-3.5 space-y-2 flex flex-col justify-between transition-colors shadow-sm"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xs font-bold text-content-primary">
                                {item.name}
                              </h3>
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                                  item.level === 'Expert'
                                    ? 'bg-semantic-success/10 text-semantic-success border-semantic-success/20'
                                    : item.level === 'Advanced'
                                    ? 'bg-accent/10 text-accent border-accent/20'
                                    : 'bg-surface-panel text-content-secondary border-border-subtle'
                                }`}
                              >
                                {item.level}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] font-mono text-content-tertiary">
                              <span className="text-accent">{item.tag}</span>
                              <span>•</span>
                              <span>{item.experienceYears} yrs experience</span>
                            </div>

                            <p className="text-[11px] text-content-secondary leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-border-subtle/60 flex flex-wrap gap-1">
                            {item.projects.map((p) => (
                              <span
                                key={p}
                                className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-surface-panel text-content-tertiary border border-border-subtle"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-content-primary">
                    Live Engineering Dispatches & Architectural Rationale
                  </h2>
                  <p className="text-[11px] text-content-tertiary">
                    Documented system decisions, performance benchmarks, and memory models.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {(['all', 'Active Production', 'Benchmarked'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-colors cursor-pointer ${
                        statusFilter === st
                          ? 'bg-accent/20 border-accent/40 text-accent'
                          : 'bg-surface-base border-border-subtle text-content-tertiary hover:text-content-primary'
                      }`}
                    >
                      {st === 'all' ? 'All Statuses' : st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-surface-base border border-border-subtle rounded-lg p-5 space-y-3 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            note.status === 'Active Production'
                              ? 'bg-semantic-success/10 text-semantic-success border-semantic-success/20'
                              : 'bg-accent/10 text-accent border-accent/20'
                          }`}
                        >
                          {note.status}
                        </span>
                        <span className="text-[10px] text-content-tertiary font-mono">
                          {note.category} • {note.date}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-content-primary">
                      {note.title}
                    </h3>

                    <p className="text-xs text-content-secondary leading-relaxed">
                      {note.summary}
                    </p>

                    <div className="p-3 rounded bg-surface-panel border border-border-subtle space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-mono text-accent font-semibold block">
                        Observed Impact & Benchmark
                      </span>
                      <p className="text-[11px] text-content-secondary leading-relaxed">
                        {note.impact}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {note.stack.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 text-[10px] font-mono rounded bg-surface-panel border border-border-subtle text-content-tertiary"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vitals' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-surface-base border border-border-default rounded-lg p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
                  <Cpu size={16} className="text-accent" />
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-content-primary">
                    Host Runtime & Memory Architecture
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 bg-surface-panel rounded border border-border-subtle space-y-1">
                    <span className="text-[10px] text-content-tertiary uppercase">Target Runtime</span>
                    <div className="text-content-primary font-bold">Next.js 15.5.29 • React 19 Native</div>
                  </div>
                  <div className="p-3 bg-surface-panel rounded border border-border-subtle space-y-1">
                    <span className="text-[10px] text-content-tertiary uppercase">Memory Management</span>
                    <div className="text-content-primary font-bold">Deterministic WebGL / DOM Disposal</div>
                  </div>
                  <div className="p-3 bg-surface-panel rounded border border-border-subtle space-y-1">
                    <span className="text-[10px] text-content-tertiary uppercase">Audio Subsystem</span>
                    <div className="text-content-primary font-bold">Web Audio API • Synthesized Haptics</div>
                  </div>
                  <div className="p-3 bg-surface-panel rounded border border-border-subtle space-y-1">
                    <span className="text-[10px] text-content-tertiary uppercase">State Architecture</span>
                    <div className="text-content-primary font-bold">Zustand Centralized Multi-Store</div>
                  </div>
                </div>

                <div className="pt-2 text-xs text-content-secondary leading-relaxed">
                  Rudar OS is built with strict boundary sandboxing, zero global pollution, and lazy dynamic chunking. Every native application runs in an isolated frame with its own memory lifecycle and event listeners.
                </div>
              </div>

              {/* Quick Navigation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => openWindow('sandbox')}
                  className="p-4 rounded-lg bg-surface-base hover:bg-surface-panel border border-border-subtle hover:border-border-default text-left transition-colors cursor-pointer group space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-content-primary group-hover:text-accent">
                    <span>Open Sandbox.exe</span>
                    <ArrowUpRight size={14} />
                  </div>
                  <p className="text-[11px] text-content-tertiary">
                    Experiment with real-time 3D PBR materials and native canvas physics simulations.
                  </p>
                </button>

                <button
                  onClick={() => openWindow('terminal')}
                  className="p-4 rounded-lg bg-surface-base hover:bg-surface-panel border border-border-subtle hover:border-border-default text-left transition-colors cursor-pointer group space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-content-primary group-hover:text-accent">
                    <span>Open Terminal CLI</span>
                    <ArrowUpRight size={14} />
                  </div>
                  <p className="text-[11px] text-content-tertiary">
                    Inspect projects, execute developer commands, and query system diagnostics.
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppFrame>
  );
}

