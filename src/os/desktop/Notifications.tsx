'use client';

import React from 'react';
import { useOSStore } from '@/os/window-manager/store';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

export function Notifications() {
  const { notifications, dismissNotification } = useOSStore();

  if (notifications.length === 0) return null;

  return (
    <aside
      aria-live="polite"
      aria-label="System Notifications"
      className="fixed top-12 right-4 z-toasts flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none"
    >
      {notifications.map((note) => {
        const getIcon = () => {
          switch (note.type) {
            case 'success':
              return <CheckCircle2 size={15} className="text-semantic-success shrink-0" />;
            case 'warning':
              return <AlertTriangle size={15} className="text-semantic-warning shrink-0" />;
            case 'error':
              return <AlertCircle size={15} className="text-semantic-error shrink-0" />;
            default:
              return <Info size={15} className="text-accent shrink-0" />;
          }
        };

        return (
          <div
            key={note.id}
            role="status"
            className="pointer-events-auto p-3.5 rounded-md bg-surface-raised/95 backdrop-blur-md border border-border-strong shadow-floating flex items-start justify-between gap-3 animate-in slide-in-from-top-2 fade-in duration-base"
          >
            <div className="flex items-start gap-2.5">
              {getIcon()}
              <div className="space-y-0.5">
                <div className="text-xs font-sans font-semibold text-content-primary">
                  {note.title}
                </div>
                <div className="text-xs text-content-secondary leading-normal">
                  {note.message}
                </div>
              </div>
            </div>

            <button
              onClick={() => dismissNotification(note.id)}
              aria-label="Dismiss notification"
              className="text-content-tertiary hover:text-content-primary p-0.5 rounded-sm hover:bg-surface-panel transition-colors duration-instant"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </aside>
  );
}

