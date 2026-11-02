'use client';

import React, { useState } from 'react';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

interface NotesAppProps {
  windowId: string;
}

export default function NotesApp({ windowId }: NotesAppProps) {
  const { closeWindow, visitorName, addNotification } = useOSStore();
  const [name, setName] = useState(visitorName === 'Guest' ? '' : visitorName);
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'feedback' | 'collaboration' | 'general'>('general');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    // Simulate client-side send (backend route will connect in Phase 6)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      addNotification('Notes', 'Your note has been saved for Rudar.', 'success');
    }, 400);
  };

  const handleReset = () => {
    setMessage('');
    setSubmitted(false);
  };

  return (
    <AppFrame
      appId="notes"
      title="Notes & Guestbook"
      onBack={() => closeWindow(windowId)}
      className="flex-1"
    >
      <div className="h-full bg-surface-panel p-6 overflow-y-auto font-sans select-text text-content-primary space-y-6 max-w-lg mx-auto">
        <div className="space-y-1">
          <h1 className="text-base font-semibold text-content-primary">Leave a Note for Rudar</h1>
          <p className="text-xs text-content-secondary leading-relaxed">
            Your name and message are stored in a private inbox so Rudar can read them. No visitor-facing guestbook is displayed.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-md bg-surface-base border border-semantic-success/40 text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-semantic-success/10 border border-semantic-success/30 flex items-center justify-center text-semantic-success mx-auto">
              <CheckCircle2 size={20} />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-content-primary">Note Sent Successfully</h2>
              <p className="text-xs text-content-secondary">
                Thank you for reaching out. Rudar reviews new incoming notes directly.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-sm bg-surface-panel border border-border-default hover:border-border-strong text-xs font-mono text-content-primary transition-colors duration-instant"
            >
              Send Another Note &rarr;
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">Your Name (Optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Guest (or your name / handle)"
                maxLength={60}
                className="w-full px-3 py-2 rounded-sm bg-surface-base border border-border-default text-xs text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors duration-instant"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {(['general', 'collaboration', 'feedback'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-1.5 px-2 rounded-sm text-xs font-mono capitalize border transition-colors duration-instant ${
                      category === cat
                        ? 'bg-accent/15 border-accent text-accent font-medium'
                        : 'bg-surface-base border-border-default text-content-secondary hover:border-border-strong'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-content-secondary">Message</label>
                <span className="text-[10px] font-mono text-content-tertiary">
                  {message.length} / 1000
                </span>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your note, feedback, or collaboration idea..."
                rows={5}
                maxLength={1000}
                required
                className="w-full px-3 py-2 rounded-sm bg-surface-base border border-border-default text-xs text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none transition-colors duration-instant"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] font-mono text-content-tertiary italic">
                PRD Sec 12: Private inbox
              </span>
              <button
                type="submit"
                disabled={!message.trim() || isSubmitting}
                className="px-4 py-2 rounded-sm bg-accent hover:bg-accent-hover disabled:bg-surface-raised disabled:text-content-tertiary text-surface-canvas text-xs font-medium transition-colors duration-instant flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-surface-canvas border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Note</span>
                    <Send size={12} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AppFrame>
  );
}

