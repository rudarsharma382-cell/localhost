'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '@/os/window-manager/store';

interface LockScreenProps {
  onUnlock?: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const { login } = useOSStore();
  const [visitorName, setVisitorNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setDateStr(
        now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = () => {
      if (!isUnlocked) {
        setIsUnlocked(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isUnlocked]);

  useEffect(() => {
    if (isUnlocked) {
      const timer = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(timer);
    }
  }, [isUnlocked]);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSigningIn) return;
    setIsSigningIn(true);
    setTimeout(() => {
      login(visitorName || 'Guest');
      if (onUnlock) onUnlock();
    }, 400);
  };

  return (
    <div
      onClick={() => {
        if (!isUnlocked) setIsUnlocked(true);
      }}
      className="fixed inset-0 z-modal overflow-hidden select-none font-sans cursor-default"
    >
      {/* 1. High-Res Clean Wallpaper with bg-cover bg-center */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-transform duration-slow"
        style={{ backgroundImage: `url('/assets/lockscreen-wallpaper.jpg')` }}
      />

      {/* 2. Dynamic Glassmorphic Blur Overlay */}
      <div
        className={`absolute inset-0 transition-all duration-500 ease-out flex flex-col justify-between p-6 md:p-10 ${
          isUnlocked
            ? 'backdrop-blur-xl bg-black/45'
            : 'backdrop-blur-none bg-black/20 cursor-pointer'
        }`}
      >
        {/* Top-Center Minimalist Clock & Date Widget with Clean White Typography */}
        <div className="w-full flex flex-col items-center text-center pt-2 md:pt-6">
          <span
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.95)' }}
            className="text-6xl sm:text-7xl md:text-8xl font-black font-sans tracking-tight text-white leading-none select-none"
          >
            {timeStr || '--:--'}
          </span>
          <span
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}
            className="text-xs sm:text-sm font-semibold font-sans tracking-[0.2em] text-white/85 mt-2.5 uppercase"
          >
            {dateStr}
          </span>
        </div>

        {/* Center Section: Indicator or Glassmorphic Login Card */}
        <div className="flex-1 flex flex-col items-center justify-center my-auto py-4">
          {!isUnlocked ? (
            /* Subtle Work-PC Lock Prompt */
            <div className="animate-pulse flex flex-col items-center gap-2 cursor-pointer">
              <span
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.95)' }}
                className="text-xs sm:text-sm font-medium tracking-wide text-white/90"
              >
                Click or press any key to sign in
              </span>
              <span className="text-white/60 text-xs">&darr;</span>
            </div>
          ) : (
            /* Sleek Borderless Glassmorphic Login Card */
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[320px] p-7 rounded-2xl bg-white/[0.08] backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] border border-white/10 animate-in fade-in zoom-in-95 duration-200"
            >
              {/* Avatar & Machine Owner Info */}
              <div className="flex flex-col items-center text-center mb-5">
                <img
                  src="/assets/rudar-avatar.jpg"
                  alt="Rudar Sharma"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/30 shadow-xl mb-2.5 mx-auto"
                />
                <h2 className="text-base font-semibold text-white tracking-normal font-sans">
                  Rudar Sharma
                </h2>
                <p className="text-xs text-white/70 font-normal mt-0.5 font-sans">
                  Developer & Builder
                </p>
              </div>

              {/* Flat Input Fields with Zero Heavy Boxy Borders */}
              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorNameInput(e.target.value)}
                    placeholder="Visitor Name"
                    disabled={isSigningIn}
                    className="w-full px-3 py-2 text-xs bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.16] border-0 border-b border-white/20 focus:border-white/80 rounded-t-sm text-white placeholder:text-white/40 focus:outline-none transition-all duration-quick"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Password"
                    disabled={isSigningIn}
                    className="w-full px-3 py-2 text-xs bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.16] border-0 border-b border-white/20 focus:border-white/80 rounded-t-sm text-white placeholder:text-white/40 focus:outline-none transition-all duration-quick"
                  />
                  <p className="text-[10px] text-white/50 mt-1 italic text-left">
                    Any password works. Please do not type a real one.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="w-full py-2.5 px-4 bg-white/20 hover:bg-white/30 active:bg-white/35 text-white rounded-lg text-xs font-medium transition-all duration-quick flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-3 shadow-lg backdrop-blur-md"
                >
                  {isSigningIn ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>Sign In &rarr;</span>
                  )}
                </button>
              </form>

              <button
                type="button"
                onClick={() => setIsUnlocked(false)}
                className="w-full text-center text-xs text-white/50 hover:text-white transition-colors mt-3.5"
              >
                &larr; Lock Screen
              </button>
            </div>
          )}
        </div>

        {/* Minimal Footer */}
        <div className="w-full flex items-center justify-between text-[11px] text-white/60">
          <span>Rudar OS</span>
          <span>Delhi AI Grand Hackathon &bull; Top 140</span>
        </div>
      </div>
    </div>
  );
}

export default LockScreen;
