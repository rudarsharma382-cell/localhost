'use client';

import React, { useState, useEffect } from 'react';
import { useOSStore } from '@/os/window-manager/store';
import { profile } from '@/content/profile';

interface LockScreenProps {
  onUnlock?: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const { login } = useOSStore();
  const [visitorName, setVisitorNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setDateStr(
        now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    login(visitorName);
    if (onUnlock) onUnlock();
  };

  return (
    <div className="fixed inset-0 z-modal bg-surface-canvas flex flex-col items-center justify-between p-8 select-none font-sans text-content-primary">
      {/* Top Header / Skip Link */}
      <div className="w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent" />
          <span className="font-display font-bold text-sm tracking-tight">RUDAR OS</span>
        </div>
        <button
          onClick={() => handleLogin()}
          className="text-xs font-mono text-content-secondary hover:text-accent transition-colors duration-instant"
        >
          Skip to desktop &rarr;
        </button>
      </div>

      {/* Center Stack */}
      <div className="flex flex-col items-center space-y-8 max-w-sm w-full text-center">
        {/* Large Display Clock */}
        <div className="space-y-1">
          <div className="font-display font-bold text-6xl tracking-tight text-content-primary">
            {timeStr || '12:00'}
          </div>
          <div className="text-sm font-medium text-content-secondary uppercase tracking-wider">
            {dateStr || 'Today'}
          </div>
        </div>

        {/* Machine Owner Card */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-surface-panel border-2 border-border-default flex items-center justify-center relative overflow-hidden shadow-base">
            {/* Minimalist Biometric / Person Avatar Icon */}
            <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="#EDEDEE" strokeWidth="1.5">
              <circle cx="10" cy="7" r="3.5" />
              <path d="M4 16c0-3 2.5-5 6-5s6 2 6 5" />
              <circle cx="14" cy="5" r="1.2" fill="#E58B24" stroke="none" />
            </svg>
          </div>
          <div>
            <div className="font-sans font-semibold text-base text-content-primary">
              {profile.name}
            </div>
            <div className="text-xs text-content-tertiary font-mono">
              Machine Owner &bull; Flutter &amp; App Developer
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full space-y-3">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-mono text-content-secondary">Who&apos;s visiting?</label>
            <input
              type="text"
              value={visitorName}
              onChange={(e) => setVisitorNameInput(e.target.value)}
              placeholder="Guest (or your name)"
              className="w-full px-3.5 py-2 rounded-sm bg-surface-base border border-border-default text-xs text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors duration-instant"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-mono text-content-secondary">Password</label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              className="w-full px-3.5 py-2 rounded-sm bg-surface-base border border-border-default text-xs text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors duration-instant"
            />
            <p className="text-[11px] text-content-tertiary italic">
              Any password works. Please don&apos;t type a real one.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-sm bg-accent hover:bg-accent-hover text-surface-canvas text-xs font-semibold uppercase tracking-wider transition-colors duration-instant mt-2"
          >
            Log in to Desktop
          </button>
        </form>
      </div>

      {/* Bottom Footer Note */}
      <div className="text-xs font-mono text-content-tertiary text-center">
        Lite Mode Vertical Slice &bull; No credentials stored
      </div>
    </div>
  );
}
