'use client';

import React, { useState, useRef, useEffect } from 'react';
import { queryAssistant, AssistantState } from '@/assistant/engine';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { Send, RotateCcw, Sparkles, ExternalLink, User, Bot } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  followUps?: string[];
  relatedLinks?: string[];
  isFallback?: boolean;
}

interface AssistantAppProps {
  windowId: string;
}

const DEFAULT_STARTERS = [
  'Tell me about Rudar',
  'What did he build with AI?',
  'What are his technical skills?',
  'Tell me about Delhi AI Hackathon',
  'How can I connect with him?',
];

export default function AssistantApp({ windowId }: AssistantAppProps) {
  const { closeWindow, reducedMotion } = useOSStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "I am Rudar's portfolio assistant. I only discuss verified facts about his projects, Flutter engineering, and hackathon achievements. Ask me anything or choose a starter below.",
      followUps: DEFAULT_STARTERS,
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
      // Immediate response under reduced motion
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
          isFallback: res.isFallback,
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
            isFallback: res.isFallback,
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
        text: 'Conversation cleared. How can I assist you with Rudar’s portfolio?',
        followUps: DEFAULT_STARTERS,
      },
    ]);
  };

  return (
    <AppFrame
      appId="assistant"
      title="Rudar AI &bull; Portfolio Assistant"
      onBack={() => closeWindow(windowId)}
      headerActions={
        <button
          onClick={handleClear}
          aria-label="Clear chat conversation"
          className="p-1 text-content-tertiary hover:text-content-primary rounded-sm hover:bg-surface-raised transition-colors duration-instant"
          title="Clear Conversation"
        >
          <RotateCcw size={13} />
        </button>
      }
      className="flex-1"
    >
      <div className="flex flex-col h-full bg-surface-panel font-sans select-text text-content-primary">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              } space-y-1.5`}
            >
              {/* Sender label */}
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-content-tertiary uppercase">
                {msg.sender === 'user' ? (
                  <>
                    <span>Visitor</span>
                    <User size={10} />
                  </>
                ) : (
                  <>
                    <Bot size={10} className="text-accent" />
                    <span className="text-accent">Rudar AI</span>
                  </>
                )}
              </div>

              {/* Message Content */}
              <div
                className={`max-w-[85%] rounded-md p-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-surface-base border border-border-default text-content-primary'
                    : msg.isFallback
                    ? 'bg-surface-base/80 border border-semantic-warning/30 text-content-secondary'
                    : 'bg-surface-base border border-border-strong text-content-primary'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Related Links */}
                {msg.relatedLinks && msg.relatedLinks.length > 0 && (
                  <div className="pt-2.5 mt-2.5 border-t border-border-subtle flex flex-wrap gap-2">
                    {msg.relatedLinks.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-accent hover:underline"
                      >
                        <span>Verified Link</span>
                        <ExternalLink size={10} />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Suggested Follow-ups */}
              {msg.followUps && msg.followUps.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 max-w-[85%]">
                  {msg.followUps.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="text-left text-[11px] font-sans px-2.5 py-1 rounded-sm bg-surface-base hover:bg-surface-raised border border-border-subtle hover:border-accent text-content-secondary hover:text-content-primary transition-colors duration-instant"
                    >
                      {prompt} &rarr;
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-surface-base border border-border-subtle text-content-tertiary text-xs max-w-[200px]">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse delay-75" />
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse delay-150" />
              <span className="text-[11px] font-mono ml-1">Assistant typing...</span>
            </div>
          )}

          <div ref={scrollBottomRef} />
        </div>

        {/* Input Bar Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-surface-base border-t border-border-default flex items-center gap-2 shrink-0 select-none"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about projects, Flutter, or hackathon..."
            className="flex-1 px-3 py-2 rounded-sm bg-surface-panel border border-border-default text-xs text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors duration-instant"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            className="p-2 rounded-sm bg-accent hover:bg-accent-hover disabled:bg-surface-raised disabled:text-content-tertiary text-surface-canvas transition-colors duration-instant"
          >
            <Send size={13} />
          </button>
        </form>
      </div>
    </AppFrame>
  );
}
