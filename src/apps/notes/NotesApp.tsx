'use client';

import React, { useState } from 'react';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { Send, CheckCircle2 } from 'lucide-react';

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
  const [formOpenTime] = useState(Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName: name,
          message,
          category,
          timestamp: formOpenTime,
          honeypot: '',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        addNotification('Note sent', 'Your message has been saved for Rudar.', 'success');
      } else {
        addNotification('Error', data.error || 'Failed to send note', 'error');
      }
    } catch {
      addNotification('Error', 'Connection failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setMessage('');
    setSubmitted(false);
  };

  return (
    <AppFrame
      appId="notes"
      title="Notes"
      onBack={() => closeWindow(windowId)}
      className="flex-1"
    >
      <div className="h-full bg-surface-panel p-6 overflow-y-auto font-sans select-text text-content-primary space-y-6 max-w-md mx-auto">
        <div className="space-y-1">
          <h1 className="text-base font-semibold text-content-primary">Leave a note</h1>
          <p className="text-xs text-content-secondary leading-relaxed">
            Your name and message are stored privately so Rudar can read them.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-sm bg-surface-base border border-border-default text-center space-y-3">
            <div className="w-8 h-8 rounded-full bg-semantic-success/10 border border-semantic-success/30 flex items-center justify-center text-semantic-success mx-auto">
              <CheckCircle2 size={16} />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-medium text-content-primary">Message sent</h2>
              <p className="text-xs text-content-secondary">
                Thank you for reaching out.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-sm bg-surface-panel border border-border-default text-xs text-content-primary hover:border-border-strong transition-colors duration-instant"
            >
              Send another note &rarr;
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-xs text-content-secondary">Your Name (Optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Guest"
                maxLength={60}
                className="w-full px-3 py-1.5 rounded-sm bg-surface-base border border-border-default text-xs text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-border-strong transition-colors duration-instant"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs text-content-secondary">Topic</label>
              <div className="grid grid-cols-3 gap-2">
                {(['general', 'collaboration', 'feedback'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-1.5 px-2 rounded-sm text-xs capitalize border transition-colors duration-instant ${
                      category === cat
                        ? 'bg-surface-raised border-border-strong text-content-primary font-medium'
                        : 'bg-surface-base border-border-default text-content-secondary hover:border-border-strong'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs text-content-secondary">Message</label>
                <span className="text-[11px] text-content-tertiary">
                  {message.length} / 1000
                </span>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your note or collaboration message..."
                rows={5}
                maxLength={1000}
                required
                className="w-full px-3 py-2 rounded-sm bg-surface-base border border-border-default text-xs text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-border-strong resize-none transition-colors duration-instant"
              />
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                disabled={!message.trim() || isSubmitting}
                className="px-4 py-2 rounded-sm bg-surface-raised hover:bg-border-default border border-border-strong disabled:opacity-30 text-content-primary text-xs font-medium transition-colors duration-instant flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <span>Send note</span>
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
