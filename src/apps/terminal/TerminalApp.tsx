'use client';

import React, { useState, useRef, useEffect } from 'react';
import { projects } from '@/content/projects';
import { profile } from '@/content/profile';
import { socials } from '@/content/socials';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error';
  text: string;
}

interface TerminalAppProps {
  windowId: string;
}

export default function TerminalApp({ windowId }: TerminalAppProps) {
  const { closeWindow, openWindow } = useOSStore();
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'output',
      text: 'Rudar OS Terminal [Version 0.1.0-alpha]',
    },
    {
      id: 'init-2',
      type: 'output',
      text: 'Type "help" for a list of available commands.',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const newLines: TerminalLine[] = [
      ...lines,
      { id: `in-${Date.now()}`, type: 'input', text: `$ ${trimmed}` },
    ];

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    switch (cmd) {
      case 'help':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Available commands:
  about            Display developer background and bio
  resume           Open Resume.exe document reader
  certificates     Launch Certificate Wallet
  developer        Open Developer Console & host vitals
  sandbox          Launch 3D & Physics Simulation Lab
  gallery          Open Cinematic Media Gallery
  projects         List all verified engineering projects
  skills           List technical frameworks and languages
  socials          Show verified external profiles and channels
  contact          Show direct contact options
  open <project>   Launch specific project in Browser app (e.g. "open safeware")
  clear            Clear terminal screen
  help             Show this reference list`,
        });
        break;

      case 'resume':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: 'Opening Resume.exe...',
        });
        openWindow('resume');
        break;

      case 'certificates':
      case 'certs':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: 'Launching Certificate Wallet...',
        });
        openWindow('certificates');
        break;

      case 'developer':
      case 'dev':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: 'Opening Developer Console...',
        });
        openWindow('developer');
        break;

      case 'sandbox':
      case 'physics':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: 'Launching Interactive Sandbox & Physics Lab...',
        });
        openWindow('sandbox');
        break;

      case 'gallery':
      case 'photos':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: 'Opening Cinematic Media Gallery...',
        });
        openWindow('gallery');
        break;

      case 'about':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `${profile.name} - Flutter and app developer
Achievement: SafeWare, Top 140 at Delhi AI Grand Hackathon.`,
        });
        break;

      case 'projects':
        const projList = projects
          .map((p) => `  - ${p.name.padEnd(20)} ${p.summary}`)
          .join('\n');
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Verified Projects:\n${projList}`,
        });
        break;

      case 'skills':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Skills:\n  ${profile.skills.join('\n  ')}`,
        });
        break;

      case 'socials':
      case 'contact':
        const socList = socials.map((s) => `  ${s.name.padEnd(12)} ${s.url}`).join('\n');
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Verified Channels:\n${socList}`,
        });
        break;

      case 'open':
        if (!arg) {
          newLines.push({
            id: `err-${Date.now()}`,
            type: 'error',
            text: 'Error: missing project argument. Usage: open <safeware|trusight|worldos|etc>',
          });
        } else {
          const match = projects.find(
            (p) =>
              p.id.toLowerCase() === arg ||
              p.slug.toLowerCase() === arg ||
              p.name.toLowerCase().includes(arg)
          );
          if (match) {
            newLines.push({
              id: `out-${Date.now()}`,
              type: 'output',
              text: `Opening ${match.name} in Browser app...`,
            });
            openWindow('browser', {
              initialUrl: match.liveUrl || 'https://rudar.vercel.app/',
              projectId: match.id,
            });
          } else {
            newLines.push({
              id: `err-${Date.now()}`,
              type: 'error',
              text: `Project "${arg}" not found. Type "projects" to view valid names.`,
            });
          }
        }
        break;

      case 'clear':
        setLines([]);
        setInputVal('');
        return;

      default:
        newLines.push({
          id: `err-${Date.now()}`,
          type: 'error',
          text: `Command not recognized: "${cmd}". Type "help" for commands.`,
        });
        break;
    }

    setLines(newLines);
    setInputVal('');
  };

  return (
    <AppFrame
      appId="terminal"
      title="Terminal CLI"
      onBack={() => closeWindow(windowId)}
      className="flex-1"
    >
      <div className="h-full bg-surface-canvas p-4 font-mono text-xs select-text overflow-y-auto flex flex-col justify-between">
        <div className="space-y-2">
          {lines.map((l) => (
            <div
              key={l.id}
              className={`whitespace-pre-wrap leading-relaxed ${
                l.type === 'input'
                  ? 'text-accent font-semibold'
                  : l.type === 'error'
                  ? 'text-semantic-error'
                  : 'text-content-secondary'
              }`}
            >
              {l.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input prompt */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCommand(inputVal);
          }}
          className="flex items-center gap-2 pt-3 border-t border-border-subtle shrink-0 mt-4"
        >
          <span className="text-accent font-bold">$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type command..."
            autoFocus
            className="flex-1 bg-transparent text-content-primary focus:outline-none"
          />
        </form>
      </div>
    </AppFrame>
  );
}

