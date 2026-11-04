'use client';

import React, { useState, useRef, useEffect } from 'react';
import { queryAssistant, AssistantState } from '@/assistant/engine';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import {
  Send,
  RotateCcw,
  ExternalLink,
  Bot,
  Sparkles,
  User,
  BookOpen,
  Shield,
  Server,
  Award,
  Zap,
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  followUps?: string[];
  relatedLinks?: string[];
}

interface AssistantAppProps {
  windowId: string;
}

const FEATURED_STARTERS = [
  { label: 'Tell me about AfterClass', icon: BookOpen, query: 'Tell me about AfterClass' },
  { label: 'What is SafeWare AI?', icon: Shield, query: 'What is SafeWare?' },
  { label: 'How does ServerCraft work?', icon: Server, query: 'Tell me about ServerCraft' },
  { label: 'Verified Hackathon Awards', icon: Award, query: 'What awards has he won?' },
  { label: 'Who is Rudar Sharma?', icon: User, query: 'Who is Rudar Sharma?' },
  { label: 'Technical Stack', icon: Zap, query: 'What are his technical skills?' },
];

/**
 * Helper to render simple inline bold formatting (**text**)
 */
function FormattedMessageText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span className="whitespace-pre-wrap leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

export default function AssistantApp({ windowId }: AssistantAppProps) {
  const { closeWindow, reducedMotion } = useOSStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am Rudar's AI Copilot. I can answer questions about his software engineering, Flutter mobile development, systems architecture, and verified hackathon achievements.",
      followUps: [
        'Tell me about AfterClass',
        'What is SafeWare?',
        'Tell me about ServerCraft',
        'What awards has he won?',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [engineState, setEngineState] = useState<AssistantState>({});

  const scrollBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [messages, isTyping, reducedMotion]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsgId = `user-${Date.now()}`;
    const newMessages: Message[] = [
      ...messages,
      { id: userMsgId, sender: 'user', text: query },
    ];
    setMessages(newMessages);
    setInput('');

    if (reducedMotion) {
      const res = queryAssistant(query, engineState);
      if (res.resolvedEntity) {
        setEngineState({ lastEntityId: res.resolvedEntity });
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: res.answer,
          followUps: res.followUps,
          relatedLinks: res.relatedLinks,
        },
      ]);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        const res = queryAssistant(query, engineState);
        if (res.resolvedEntity) {
          setEngineState({ lastEntityId: res.resolvedEntity });
        }
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `asst-${Date.now()}`,
            sender: 'assistant',
            text: res.answer,
            followUps: res.followUps,
            relatedLinks: res.relatedLinks,
          },
        ]);
      }, 350);
    }
  };

  const handleClear = () => {
    setEngineState({});
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: 'Session reset. What would you like to explore regarding Rudar’s work?',
        followUps: [
          'Tell me about AfterClass',
          'What is SafeWare?',
          'Tell me about ServerCraft',
          'What awards has he won?',
        ],
      },
    ]);
  };

  return (
    <AppFrame
      appId="assistant"
      title="Rudar AI"
      onBack={() => closeWindow(windowId)}
      headerActions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            aria-label="Clear chat"
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      }
      className="flex-1"
    >
      <div className="flex flex-col h-full bg-[#0B0D14] font-sans select-text text-zinc-100 relative overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Copilot Bar */}
        <div className="h-10 px-4 bg-zinc-900/60 backdrop-blur-md border-b border-white/5 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-sm">
                <Bot size={12} />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0B0D14]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-200">Rudar AI</span>
              <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">• Neural Assistant v2.4</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Ready
            </span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 z-10">
          {/* Welcome Card if starting fresh */}
          {messages.length <= 1 && (
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/10 backdrop-blur-md space-y-3 mb-2 shadow-sm">
              <div className="flex items-center gap-2 text-zinc-300">
                <Sparkles size={16} className="text-blue-400" />
                <span className="text-xs font-semibold">Suggested Questions</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FEATURED_STARTERS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(item.query)}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-left text-xs text-zinc-300 hover:text-white transition-all duration-150 group cursor-pointer"
                    >
                      <div className="p-1 rounded-md bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300 shrink-0">
                        <Icon size={13} />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              } space-y-1.5`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 px-1 font-mono">
                {msg.sender === 'user' ? (
                  <>
                    <span>You</span>
                    <User size={10} className="text-blue-400" />
                  </>
                ) : (
                  <>
                    <Bot size={10} className="text-indigo-400" />
                    <span>Rudar AI</span>
                  </>
                )}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-md backdrop-blur-md transition-all ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs shadow-blue-600/10'
                    : 'bg-zinc-900/80 border border-white/10 text-zinc-200 rounded-tl-xs shadow-black/40'
                }`}
              >
                <FormattedMessageText text={msg.text} />

                {/* Related Links Pill Badges */}
                {msg.relatedLinks && msg.relatedLinks.length > 0 && (
                  <div className="pt-2.5 mt-2.5 border-t border-white/10 flex flex-wrap gap-2">
                    {msg.relatedLinks.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-blue-400 hover:text-blue-300 transition-colors shadow-sm"
                      >
                        <span>
                          {url.includes('instagram.com')
                            ? 'View on Instagram'
                            : url.includes('github.com')
                            ? 'View on GitHub'
                            : url.includes('linkedin.com')
                            ? 'View LinkedIn'
                            : 'Open Link'}
                        </span>
                        <ExternalLink size={10} />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Follow-up Prompts */}
              {msg.followUps && msg.followUps.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 max-w-[85%]">
                  {msg.followUps.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="text-left text-[11px] px-3 py-1.5 rounded-full bg-zinc-900/60 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02]"
                    >
                      <span>{prompt}</span>
                      <span className="text-zinc-500">&rarr;</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-zinc-900/70 border border-white/10 max-w-[120px] shadow-sm">
              <Bot size={12} className="text-blue-400 animate-pulse" />
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
              </div>
            </div>
          )}

          <div ref={scrollBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-zinc-900/60 backdrop-blur-md border-t border-white/10 shrink-0 z-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-[#141622] border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all shadow-inner"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about AfterClass, SafeWare, Flutter, or hackathons..."
              className="flex-1 bg-transparent text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none py-1"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
              className="p-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-30 disabled:hover:from-blue-600 disabled:hover:to-indigo-600 text-white transition-all duration-150 cursor-pointer shadow-sm"
            >
              <Send size={13} />
            </button>
          </form>
          <div className="flex items-center justify-between px-2 pt-1.5 text-[10px] text-zinc-500 font-mono">
            <span>Press Enter ↵ to ask</span>
            <span>Rudar OS Assistant</span>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
