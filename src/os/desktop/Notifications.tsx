'use client';

import React from 'react';
import { useOSStore } from '@/os/window-manager/store';
import { CheckCircle2, AlertTriangle, AlertCircle, X, Sparkles } from 'lucide-react';

export function Notifications() {
  const { notifications, dismissNotification } = useOSStore();

  if (notifications.length === 0) return null;

  return (
    <aside
      aria-live="polite"
      aria-label="System Notifications"
      className="fixed top-11 right-4 z-[80] flex flex-col gap-3 max-w-sm w-full pointer-events-none select-none font-sans"
    >
      {notifications.map((note) => {
        const getIconConfig = () => {
          switch (note.type) {
            case 'success':
              return {
                badge: 'from-emerald-500/25 to-teal-500/15 border-emerald-400/30 text-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.3)]',
                icon: <CheckCircle2 size={16} />,
              };
            case 'warning':
              return {
                badge: 'from-amber-500/25 to-yellow-500/15 border-amber-400/30 text-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.3)]',
                icon: <AlertTriangle size={16} />,
              };
            case 'error':
              return {
                badge: 'from-red-500/25 to-rose-500/15 border-red-400/30 text-rose-300 shadow-[0_0_14px_rgba(244,63,94,0.3)]',
                icon: <AlertCircle size={16} />,
              };
            default:
              return {
                badge: 'from-blue-500/25 to-indigo-500/20 border-blue-400/30 text-blue-300 shadow-[0_0_14px_rgba(96,165,250,0.3)]',
                icon: <Sparkles size={16} />,
              };
          }
        };

        const config = getIconConfig();

        return (
          <div
            key={note.id}
            role="status"
            className="pointer-events-auto rounded-2xl bg-[#14161f]/85 backdrop-blur-2xl border border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.65),0_2px_8px_rgba(0,0,0,0.35)] p-3.5 flex items-start gap-3 animate-in slide-in-from-top-3 fade-in duration-200 transition-all group"
            style={{
              boxShadow: '0 14px 34px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
            }}
          >
            {/* Elegant App Badge */}
            <div
              className={`w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br ${config.badge} border flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}
            >
              {config.icon}
            </div>

            {/* Content Body */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-zinc-400 font-mono">
                  Rudar OS
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  now
                </span>
              </div>
              <h4 className="text-xs font-semibold text-white tracking-tight truncate leading-snug">
                {note.title}
              </h4>
              <p className="text-[11px] text-zinc-300/90 leading-relaxed mt-0.5 font-normal">
                {note.message}
              </p>
            </div>

            {/* Close / Dismiss Button */}
            <button
              onClick={() => dismissNotification(note.id)}
              aria-label="Dismiss notification"
              className="text-zinc-500 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors shrink-0 -mr-1 -mt-0.5 cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </aside>
  );
}

export default Notifications;
