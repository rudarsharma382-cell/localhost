'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { Scan, ShieldAlert, CheckCircle2, FileSearch, Sparkles, Binary } from 'lucide-react';

interface TruSightAppProps {
  windowId: string;
}

export default function TruSightApp({ windowId }: TruSightAppProps) {
  const { closeWindow } = useOSStore();
  const [analyzing, setAnalyzing] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState<string | null>(null);

  const handleSimulateScan = () => {
    setAnalyzing(true);
    setVerifiedResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      setVerifiedResult('Authentic Human Recording (99.8% Confidence — 0 Artifacts Detected)');
    }, 1200);
  };

  return (
    <AppFrame
      appId="trusight"
      title="TruSight — Deepfake & Synthetic Media Detector"
      onBack={() => closeWindow(windowId)}
      className="flex-1"
    >
      <div className="h-full bg-[#121316] text-[#E0E2EC] p-6 overflow-y-auto space-y-6 font-sans">
        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-purple-500/30 shadow-[0_0_24px_rgba(168,85,247,0.25)] shrink-0 bg-black">
            <Image
              src="/assets/icons/trusight.jpg"
              alt="TruSight Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
              <Sparkles size={12} />
              <span>See Beyond The Fake</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center sm:justify-start gap-2">
              <span>TruSight AI</span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">Neural Forensic</span>
            </h1>
            <p className="text-xs text-zinc-400 max-w-lg">
              Next-generation spatial-temporal deepfake, voice clone, and generative synthesis detection platform.
            </p>
          </div>
        </div>

        {/* Interactive Deepfake Inspector */}
        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Scan size={14} className="text-purple-400" />
              <span>Deepfake Verification Workbench</span>
            </h3>
            <button
              onClick={handleSimulateScan}
              disabled={analyzing}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-medium transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Scanning Video Frames...</span>
                </>
              ) : (
                <>
                  <FileSearch size={13} />
                  <span>Run Forensic Analysis</span>
                </>
              )}
            </button>
          </div>

          {verifiedResult && (
            <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-xs text-emerald-300 animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>{verifiedResult}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                <Binary size={12} className="text-purple-400" />
                <span>Facial Warping Ratio</span>
              </div>
              <div className="text-lg font-mono font-semibold text-white">0.003%</div>
              <div className="text-[10px] text-emerald-400">Within natural human biometrics</div>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                <ShieldAlert size={12} className="text-cyan-400" />
                <span>Audio Spectral Synthesis</span>
              </div>
              <div className="text-lg font-mono font-semibold text-white">0.00%</div>
              <div className="text-[10px] text-emerald-400">No vocal clone harmonics detected</div>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                <Sparkles size={12} className="text-indigo-400" />
                <span>Micro-Blinking Rate</span>
              </div>
              <div className="text-lg font-mono font-semibold text-white">18.2 / min</div>
              <div className="text-[10px] text-emerald-400">Natural involuntary reflex pattern</div>
            </div>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
