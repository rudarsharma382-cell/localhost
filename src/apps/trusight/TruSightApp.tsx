'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import {
  Scan,
  ShieldCheck,
  Cpu,
  Binary,
  Layers,
  FileCheck2,
  Sparkles,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface TruSightAppProps {
  windowId: string;
}

export default function TruSightApp({ windowId }: TruSightAppProps) {
  const { closeWindow } = useOSStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'technology' | 'scanner' | 'architecture'>('overview');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<null | {
    confidence: number;
    verdict: string;
    metrics: { name: string; score: number; status: 'pass' | 'warn' | 'fail' }[];
  }>(null);

  const handleRunScan = () => {
    setScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setScanning(false);
      setScanResult({
        confidence: 99.4,
        verdict: 'Authentic Human Recording (No Generative Synthesis Detected)',
        metrics: [
          { name: 'Facial Biometric Warping', score: 0.02, status: 'pass' },
          { name: 'Frequency Domain GAN Artifacts', score: 0.01, status: 'pass' },
          { name: 'Audio-Visual Phoneme Synchrony', score: 99.8, status: 'pass' },
          { name: 'Eye Blink & Micro-Expression Dynamics', score: 98.7, status: 'pass' },
        ],
      });
    }, 1400);
  };

  return (
    <AppFrame
      appId="trusight"
      title="TruSight AI — Synthetic Media Forensics Website"
      onBack={() => closeWindow(windowId)}
      className="flex-1 overflow-hidden"
    >
      <div className="h-full w-full bg-[#0D0F14] text-[#E2E8F0] overflow-y-auto font-sans select-text">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-20 bg-[#0D0F14]/90 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-purple-500/40">
              <Image src="/assets/icons/trusight.jpg" alt="TruSight Logo" fill className="object-cover" />
            </div>
            <span className="font-bold text-sm tracking-wide text-white">TruSight AI</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              v1.8 Core
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <button
              onClick={() => setActiveTab('overview')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'overview' ? 'text-purple-400 font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('technology')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'technology' ? 'text-purple-400 font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'scanner' ? 'text-purple-400 font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Live Workbench
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'architecture' ? 'text-purple-400 font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Architecture
            </button>
          </div>
        </nav>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">
          {/* Hero Section */}
          <section className="text-center space-y-4 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-mono">
              <Sparkles size={13} />
              <span>See Beyond The Fake</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Defending Truth in the <br />
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Age of Generative Deepfakes.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
              TruSight AI is an autonomous media forensics engine designed to detect synthetic facial manipulation, audio voice cloning, and AI video generation artifacts in real time.
            </p>
          </section>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Scan size={18} />
                  </div>
                  <h3 className="font-bold text-sm text-white">Spatial Frequency Analysis</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Identifies high-frequency spectral artifacts left behind by diffusion models and generative upscaling lattices.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Cpu size={18} />
                  </div>
                  <h3 className="font-bold text-sm text-white">Biological Consistency</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Tracks involuntary human biometrics including microscopic pulse color changes (rPPG), blink periodicity, and gaze physics.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Lock size={18} />
                  </div>
                  <h3 className="font-bold text-sm text-white">Air-Gapped Offline Engine</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Runs fully on-device without leaking sensitive recordings to external cloud APIs, ensuring legal chain-of-custody.
                  </p>
                </div>
              </div>

              {/* Problem / Solution Narrative */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-400" />
                  <span>The Challenge: Why Single-Model Detection Fails</span>
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Traditional detection algorithms rely purely on known artifact classifiers. However, as generative architectures like Sora, Runway, and ElevenLabs rapidly evolve, single-frame models suffer severe false-positive rates. TruSight solves this by evaluating <strong>cross-modal coherence</strong>: matching vocal phonetic formants against physical lip muscular dynamics.
                </p>
              </div>
            </div>
          )}

          {/* TECHNOLOGY TAB */}
          {activeTab === 'technology' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-white">The TruSight Multi-Stage Forensic Pipeline</h2>
                <p className="text-xs text-zinc-400">
                  Every video passes through four independent verification tiers before a confidence score is aggregated.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-4">
                  <span className="font-mono text-purple-400 font-bold text-sm">01</span>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-white">Frame Decomposition & Wavelet Transform</h4>
                    <p className="text-xs text-zinc-400">
                      Deconstructs 60 FPS video streams into discrete 2D Fourier and Wavelet domains to detect synthetic pixel quantization patterns.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-4">
                  <span className="font-mono text-purple-400 font-bold text-sm">02</span>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-white">Facial Landmark Mesh & Optical Flow</h4>
                    <p className="text-xs text-zinc-400">
                      Maps 468 3D facial landmarks to identify boundary warping around hair, ears, and jawlines during rapid head rotations.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-4">
                  <span className="font-mono text-purple-400 font-bold text-sm">03</span>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-white">Phoneme-to-Viseme Chronology Sync</h4>
                    <p className="text-xs text-zinc-400">
                      Compares acoustic speech frequency spikes against mouth aperture timing to detect audio dubbing and voice swaps.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-4">
                  <span className="font-mono text-purple-400 font-bold text-sm">04</span>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-white">Ensemble Confidence Scoring</h4>
                    <p className="text-xs text-zinc-400">
                      Weighs evidence across all tiers to generate a transparent cryptographic verification certificate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCANNER WORKBENCH TAB */}
          {activeTab === 'scanner' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-base text-white">Interactive Deepfake Verification Demo</h3>
                    <p className="text-xs text-zinc-400">Run a simulated multi-modal forensic inspection.</p>
                  </div>

                  <button
                    onClick={handleRunScan}
                    disabled={scanning}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-mono font-semibold transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {scanning ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Decomposing Video Stream...</span>
                      </>
                    ) : (
                      <>
                        <Play size={13} />
                        <span>Execute Forensic Scan</span>
                      </>
                    )}
                  </button>
                </div>

                {scanResult && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-4">
                    <div className="flex items-center gap-3 text-emerald-400 text-sm font-semibold">
                      <CheckCircle2 size={18} />
                      <span>{scanResult.verdict}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {scanResult.metrics.map((m, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                          <div className="text-[11px] text-zinc-400 flex justify-between">
                            <span>{m.name}</span>
                            <span className="font-mono text-emerald-400">{m.score}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min(m.score, 100)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ARCHITECTURE TAB */}
          {activeTab === 'architecture' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h4 className="text-sm font-bold text-white font-mono text-purple-400">// Client Engine</h4>
                  <p className="text-xs text-zinc-300">
                    Flutter cross-platform application utilizing WebAssembly and platform channels for ultra-low latency hardware acceleration.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h4 className="text-sm font-bold text-white font-mono text-indigo-400">// Inference Core</h4>
                  <p className="text-xs text-zinc-300">
                    TensorRT and ONNX quantized models capable of running at 30+ FPS directly on local GPU or edge mobile processors.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppFrame>
  );
}
