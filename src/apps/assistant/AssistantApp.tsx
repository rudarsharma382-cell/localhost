'use client';

import React, { useState, useRef, useEffect } from 'react';
import { queryAssistant, AssistantState } from '@/assistant/engine';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { Send, RotateCcw, ExternalLink } from 'lucide-react';

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

const DEFAULT_STARTERS = [
  'Tell me about Rudar',
  'What is SafeWare?',
  'What awards has he won?',
  'How can I connect with him?',
];

export default function AssistantApp({ windowId }: AssistantAppProps) {
  const { closeWindow, reducedMotion } = useOSStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "I am Rudar's portfolio assistant. I can answer questions about his projects, Flutter background, and hackathon results.",
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
      }, 300);
    }
  };

  const handleClear = () => {
    setEngineState({});
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: 'Conversation cleared. How can I assist you?',
        followUps: DEFAULT_STARTERS,
      },
    ]);
  };

  return (
    <AppFrame
      appId="assistant"
      title="Rudar AI"
      onBack={() => closeWindow(windowId)}
      headerActions={
        <button
          onClick={handleClear}
          aria-label="Clear chat"
          className="p-1 text-content-tertiary hover:text-content-primary transition-colors duration-instant"
          title="Clear"
        >
          <RotateCcw size={12} />
        </button>
      }
      className="flex-1"
    >
      <div className="flex flex-col h-full bg-surface-panel font-sans select-text text-content-primary">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              } space-y-1`}
            >
              <div className="text-[11px] text-content-tertiary">
                {msg.sender === 'user' ? 'You' : 'Assistant'}
              </div>

              <div
                className={`max-w-[85%] rounded-sm p-2.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-surface-raised border border-border-default text-content-primary'
                    : 'bg-surface-base border border-border-subtle text-content-secondary'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {msg.relatedLinks && msg.relatedLinks.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-border-subtle flex flex-wrap gap-2">
                    {msg.relatedLinks.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline"
                      >
                        <span>Related link</span>
                        <ExternalLink size={10} />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {msg.followUps && msg.followUps.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 max-w-[85%]">
                  {msg.followUps.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="text-left text-[11px] px-2 py-1 rounded-sm bg-surface-base hover:bg-surface-raised border border-border-subtle text-content-secondary hover:text-content-primary transition-colors duration-instant"
                    >
                      {prompt} &rarr;
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="text-xs text-content-tertiary italic">
              Thinking...
            </div>
          )}

          <div ref={scrollBottomRef} />
        </div>

        {/* Input */}
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
            className="flex-1 px-3 py-1.5 rounded-sm bg-surface-panel border border-border-default text-xs text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-border-strong transition-colors duration-instant"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send"
            className="p-1.5 rounded-sm bg-surface-raised hover:bg-border-default border border-border-default disabled:opacity-30 text-content-primary transition-colors duration-instant"
          >
            <Send size={13} />
          </button>
        </form>
      </div>
    </AppFrame>
  );
}
