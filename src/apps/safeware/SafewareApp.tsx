'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { Shield, Eye, Activity, AlertTriangle, CheckCircle, Cpu } from 'lucide-react';

interface SafewareAppProps {
  windowId: string;
}

export default function SafewareApp({ windowId }: SafewareAppProps) {
  const { closeWindow } = useOSStore();
  const [monitoringActive, setMonitoringActive] = useState(true);

  return (
    <AppFrame
      appId="safeware"
      title="SafeWare AI — Road Safety System"
      onBack={() => closeWindow(windowId)}
      className="flex-1"
    >
      <div className="h-full bg-[#121316] text-[#E0E2EC] p-6 overflow-y-auto space-y-6 font-sans">
        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_24px_rgba(6,182,212,0.25)] shrink-0 bg-black">
            <Image
              src="/assets/icons/safeware.jpg"
              alt="SafeWare AI Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              <Shield size={12} />
              <span>Delhi AI Grand Hackathon • Top 140</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center sm:justify-start gap-2">
              <span>SafeWare</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">v2.4 Production</span>
            </h1>
            <p className="text-xs text-zinc-400 max-w-lg">
              AI-Powered Real-Time Autonomous Road Safety, Collision Avoidance & Driver Alertness Telemetry System.
            </p>
          </div>
        </div>

        {/* Live Telemetry Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Vision Inference</span>
              <Eye size={14} className="text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">42 FPS</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle size={10} />
              <span>Zero drop-frame rate</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Collision Risk</span>
              <Activity size={14} className="text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400 font-mono">0.02%</div>
            <div className="text-[11px] text-zinc-400">Safe clearance zone (48m)</div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Edge AI Latency</span>
              <Cpu size={14} className="text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">14.8 ms</div>
            <div className="text-[11px] text-zinc-400">TensorRT on-device model</div>
          </div>
        </div>

        {/* Architecture & Capabilities */}
        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-400" />
            <span>Key Engineering Features</span>
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-zinc-300">
            <li className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Neural Collision Prediction:</strong> Predicts high-risk trajectory overlaps with 99.4% precision.</span>
            </li>
            <li className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Driver Fatigue & Gaze Tracker:</strong> IR-assisted real-time eyelid closure & micro-sleep alerting.</span>
            </li>
            <li className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Adverse Weather Enhancement:</strong> Synthetic defogging & low-light neural restoration filter.</span>
            </li>
            <li className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Blackbox Telemetry Logs:</strong> Tamper-proof cryptographic incident snapshot recorder.</span>
            </li>
          </ul>
        </div>
      </div>
    </AppFrame>
  );
}
