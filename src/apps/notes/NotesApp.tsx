'use client';

import React, { useState } from 'react';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import {
  Send,
  CheckCircle2,
  FileText,
  Plus,
  Search,
  ExternalLink,
  Tag,
  Calendar,
  Sparkles,
  MessageSquare,
  BookOpen,
  Shield,
  Server,
  Share2,
} from 'lucide-react';

interface NoteItem {
  id: string;
  title: string;
  date: string;
  preview: string;
  category: 'architecture' | 'hackathon' | 'systems' | 'guestbook' | 'user';
  author?: string;
  content: string;
  link?: string;
  linkLabel?: string;
  isForm?: boolean;
}

const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'leave-note',
    title: '📝 Leave a Note for Rudar',
    date: 'Today',
    preview: 'Send a message, collaboration request, or feedback directly to Rudar...',
    category: 'guestbook',
    content: '',
    isForm: true,
  },
  {
    id: 'afterclass-note',
    title: 'AfterClass • Classroom Management',
    date: 'Nov 4',
    preview: 'AfterClass is a classroom management and homework app built for students and teachers...',
    category: 'architecture',
    author: 'Rudar Sharma',
    content: `AfterClass is a classroom management and homework app built for students and teachers. It provides a centralized platform where teachers can upload homework, assignments, and study materials, while students can easily access everything in one place.

The goal is to reduce dependency on WhatsApp groups, keep classwork organized, and make communication and academic resources easier to manage for the entire class.

Architecture Highlights:
• Clean Flutter client architecture with reactive state management
• Realtime database synchronization for homework deadlines
• Encrypted assignment channels for teachers
• Built-in subject spaces (Physics, Math, CS) with persistent resource libraries`,
    link: 'https://www.instagram.com/p/DdCKTVeoJxO/',
    linkLabel: 'View AfterClass on Instagram',
  },
  {
    id: 'safeware-note',
    title: 'SafeWare AI • Delhi AI Hackathon',
    date: 'Oct 28',
    preview: 'Computer vision edge inference for hazard warning. Secured Top 140 nationwide...',
    category: 'hackathon',
    author: 'Rudar Sharma',
    content: `SafeWare AI is an intelligent road safety edge system developed for the Delhi AI Grand Hackathon, securing Top 140 nationwide out of thousands of participating engineering teams.

Core Engineering:
• High-frequency spatial-temporal computer vision inference
• Edge hardware acceleration for sub-15ms hazard prediction
• Local telemetry storage with zero cloud latency requirement`,
    link: 'https://github.com/rudarsharma382-cell',
    linkLabel: 'SafeWare Repository',
  },
  {
    id: 'servercraft-note',
    title: 'ServerCraft • Cloud Container Engine',
    date: 'Oct 14',
    preview: 'Automated Docker container orchestration for high-performance Minecraft servers...',
    category: 'systems',
    author: 'Rudar Sharma',
    content: `ServerCraft is a cloud application engineered to deploy, configure, and monitor high-performance Minecraft servers with one click.

System Capabilities:
• Automated Docker container lifecycle & Spigot/Paper/Purpur provisioning
• Dynamic RAM and JVM heap balancing to prevent lag spikes
• Scheduled world snapshots and instant zero-downtime rollbacks`,
    link: 'https://www.instagram.com/p/DdWL3HyIhgN/',
    linkLabel: 'View ServerCraft on Instagram',
  },
  {
    id: 'rudar-note',
    title: 'Engineering Philosophy • Rudar Sharma',
    date: 'Sep 20',
    preview: 'Principles on mobile UI craft, systems architecture, and relentless execution...',
    category: 'systems',
    author: 'Rudar Sharma',
    content: `Engineering Philosophy:
1. Performance First: Interfaces should respond instantaneously with 60fps animations and micro-interactions.
2. Purpose-Built Tools: Software should solve clear pain points (e.g. replacing messy WhatsApp school groups with AfterClass).
3. Continuous Exploration: From Flutter mobile applications to WebGL 3D scenes and cloud containerization, explore the full stack.`,
    link: 'https://linkedin.com/in/rudarsharma-dev/',
    linkLabel: 'Connect on LinkedIn',
  },
];

interface NotesAppProps {
  windowId: string;
}

export default function NotesApp({ windowId }: NotesAppProps) {
  const { closeWindow, visitorName, addNotification } = useOSStore();
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [selectedNoteId, setSelectedNoteId] = useState<string>('leave-note');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for Leave a Note
  const [name, setName] = useState(visitorName === 'Guest' ? '' : visitorName);
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'feedback' | 'collaboration' | 'general'>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formOpenTime] = useState(Date.now());

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const filteredNotes = notes.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.preview.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q)
    );
  });

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
        addNotification('Note Saved', 'Your note has been submitted to Rudar.', 'success');

        // Add to active notes sidebar
        const newVisitorNote: NoteItem = {
          id: `visitor-${Date.now()}`,
          title: `Note from ${name || 'Guest'}`,
          date: 'Just now',
          preview: message.slice(0, 70) + (message.length > 70 ? '...' : ''),
          category: 'user',
          author: name || 'Guest',
          content: message,
        };
        setNotes((prev) => [prev[0], newVisitorNote, ...prev.slice(1)]);
        setSelectedNoteId(newVisitorNote.id);
      } else {
        addNotification('Error', data.error || 'Failed to send note', 'error');
      }
    } catch {
      addNotification('Error', 'Connection failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setMessage('');
    setSubmitted(false);
    setSelectedNoteId('leave-note');
  };

  return (
    <AppFrame
      appId="notes"
      title="Notes"
      onBack={() => closeWindow(windowId)}
      className="flex-1"
    >
      <div className="flex h-full bg-[#13141B] font-sans text-zinc-100 select-text overflow-hidden">
        {/* Left Column: Notes List Sidebar */}
        <div className="w-64 sm:w-72 border-r border-white/10 bg-[#171822]/90 flex flex-col shrink-0 select-none">
          {/* Top Search & Action Bar */}
          <div className="p-3 border-b border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <FileText size={14} className="text-amber-400" />
                All Notes
              </span>
              <button
                onClick={() => {
                  setSelectedNoteId('leave-note');
                  setSubmitted(false);
                }}
                className="p-1 px-2 rounded-md bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="Write a new note"
              >
                <Plus size={12} />
                <span>New</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-black/20 border border-white/10 focus-within:border-amber-400/50 transition-colors">
              <Search size={12} className="text-zinc-500 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full bg-transparent text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Notes Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {filteredNotes.map((note) => {
              const isSelected = selectedNoteId === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`p-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-l-2 border-amber-400'
                      : 'hover:bg-white/5 border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`text-xs font-semibold truncate ${
                        isSelected ? 'text-amber-200' : 'text-zinc-200'
                      }`}
                    >
                      {note.title}
                    </h3>
                    <span className="text-[10px] text-zinc-500 shrink-0 ml-2 font-mono">
                      {note.date}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {note.preview}
                  </p>
                </div>
              );
            })}
            {filteredNotes.length === 0 && (
              <div className="p-6 text-center text-xs text-zinc-500">
                No matching notes found.
              </div>
            )}
          </div>

          {/* Footer Status */}
          <div className="p-2.5 px-3 border-t border-white/10 text-[10px] text-zinc-500 font-mono flex items-center justify-between bg-black/10">
            <span>{notes.length} Notes</span>
            <span className="text-amber-400/80">macOS Notes</span>
          </div>
        </div>

        {/* Right Column: Active Note Viewer / Editor */}
        <div className="flex-1 flex flex-col bg-[#111218] overflow-y-auto">
          {selectedNote.isForm ? (
            /* Interactive Note Form (Leave a Note) */
            <div className="p-6 md:p-8 max-w-xl mx-auto w-full space-y-6">
              <div className="space-y-1.5 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono">
                  <Calendar size={13} />
                  <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h1 className="text-xl font-bold text-zinc-100 tracking-tight">
                  Leave a Note for Rudar
                </h1>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your message is saved privately in the system. Great for collaboration ideas, project feedback, or getting in touch.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-xl bg-zinc-900/60 border border-emerald-500/30 text-center space-y-4 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-sm font-semibold text-zinc-100">Note Saved & Submitted</h2>
                    <p className="text-xs text-zinc-400">
                      Thank you for leaving a note! It has been added to your notes list.
                    </p>
                  </div>
                  <button
                    onClick={handleResetForm}
                    className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Write Another Note &rarr;
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">Your Name (Optional)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Guest / Your Name"
                      maxLength={60}
                      className="w-full px-3.5 py-2 rounded-lg bg-zinc-900/70 border border-white/10 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">Topic</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['general', 'collaboration', 'feedback'] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`py-2 px-3 rounded-lg text-xs capitalize border transition-all cursor-pointer font-medium ${
                            category === cat
                              ? 'bg-amber-500/20 border-amber-400/60 text-amber-200'
                              : 'bg-zinc-900/40 border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-zinc-300">Message</label>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {message.length} / 1000
                      </span>
                    </div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your note, feedback, or collaboration details..."
                      rows={6}
                      maxLength={1000}
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/70 border border-white/10 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 resize-none transition-all"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={!message.trim() || isSubmitting}
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-black text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      {isSubmitting ? (
                        <span>Saving...</span>
                      ) : (
                        <>
                          <span>Save & Send Note</span>
                          <Send size={12} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Developer Note Viewer */
            <div className="p-6 md:p-8 max-w-2xl mx-auto w-full space-y-6">
              <div className="border-b border-white/10 pb-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span>{selectedNote.date} • {selectedNote.author || 'Engineering Log'}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-semibold text-zinc-300">
                    {selectedNote.category}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
                  {selectedNote.title}
                </h1>
              </div>

              {/* Formatted Note Body */}
              <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line space-y-4 font-sans">
                {selectedNote.content}
              </div>

              {/* Optional Link / Attachment */}
              {selectedNote.link && (
                <div className="pt-4 border-t border-white/10">
                  <a
                    href={selectedNote.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors shadow-sm"
                  >
                    <span>{selectedNote.linkLabel || 'Open Attachment'}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppFrame>
  );
}
