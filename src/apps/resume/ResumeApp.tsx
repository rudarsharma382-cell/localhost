'use client';

import React, { useState, useEffect } from 'react';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { Download, FileText, ExternalLink, AlertCircle } from 'lucide-react';
import { TodoMarker } from '@/components/common/TodoMarker';

interface ResumeAppProps {
  windowId: string;
}

export default function ResumeApp({ windowId }: ResumeAppProps) {
  const { closeWindow, openWindow } = useOSStore();
  const [hasPdf, setHasPdf] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if /resume.pdf exists
    fetch('/resume.pdf', { method: 'HEAD' })
      .then((res) => {
        setHasPdf(res.ok);
      })
      .catch(() => {
        setHasPdf(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AppFrame
      appId="resume"
      title="Resume & Folio"
      onBack={() => closeWindow(windowId)}
      headerActions={
        hasPdf ? (
          <a
            href="/resume.pdf"
            download="Rudar_Sharma_Resume.pdf"
            className="px-2.5 py-1 rounded-sm bg-accent hover:bg-accent-hover text-surface-canvas text-xs font-mono flex items-center gap-1.5 transition-colors duration-instant"
          >
            <Download size={12} />
            <span>Download PDF</span>
          </a>
        ) : null
      }
      className="flex-1"
    >
      <div className="h-full bg-surface-panel p-6 overflow-y-auto font-sans select-text text-content-primary">
        {loading ? (
          <div className="h-full flex items-center justify-center text-xs font-mono text-content-tertiary space-x-2">
            <span className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            <span>Checking document path...</span>
          </div>
        ) : hasPdf ? (
          <div className="w-full h-full rounded-md border border-border-default overflow-hidden">
            <iframe
              src="/resume.pdf#toolbar=0"
              title="Rudar Sharma Resume"
              className="w-full h-full border-0"
            />
          </div>
        ) : (
          /* Honest Empty State per PRD Section 7.7 */
          <div className="h-full max-w-md mx-auto flex flex-col items-center justify-center text-center space-y-4 p-8">
            <div className="w-12 h-12 rounded-full bg-surface-base border border-border-default flex items-center justify-center text-content-tertiary">
              <FileText size={24} />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-sm font-semibold text-content-primary">Resume Document Pending</h2>
              <p className="text-xs text-content-secondary leading-relaxed">
                Rudar has not yet uploaded <code className="text-accent font-mono">public/resume.pdf</code>.
                Per PRD rules, no fake resume is fabricated.
              </p>
            </div>

            <TodoMarker field="resume.pdf" message="Rudar to provide real resume PDF at public/resume.pdf" />

            <div className="pt-2 flex flex-col sm:flex-row gap-2 w-full">
              <button
                onClick={() => openWindow('about')}
                className="flex-1 py-2 px-3 rounded-sm bg-surface-base border border-border-default hover:border-accent text-xs font-medium text-content-secondary hover:text-content-primary transition-colors duration-instant"
              >
                View About Me &rarr;
              </button>
              <button
                onClick={() => openWindow('socials')}
                className="flex-1 py-2 px-3 rounded-sm bg-surface-base border border-border-default hover:border-accent text-xs font-medium text-content-secondary hover:text-content-primary transition-colors duration-instant"
              >
                View LinkedIn &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </AppFrame>
  );
}

