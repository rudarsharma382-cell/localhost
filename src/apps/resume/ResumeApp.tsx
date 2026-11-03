'use client';

import React, { useState, useEffect } from 'react';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { Download, FileText } from 'lucide-react';
import { TodoMarker } from '@/components/common/TodoMarker';

interface ResumeAppProps {
  windowId: string;
}

export default function ResumeApp({ windowId }: ResumeAppProps) {
  const { closeWindow, openWindow } = useOSStore();
  const [hasPdf, setHasPdf] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
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
      title="Resume"
      onBack={() => closeWindow(windowId)}
      headerActions={
        hasPdf ? (
          <a
            href="/resume.pdf"
            download="Rudar_Sharma_Resume.pdf"
            className="px-2.5 py-1 rounded-sm bg-surface-raised border border-border-default hover:border-border-strong text-content-primary text-xs flex items-center gap-1.5 transition-colors duration-instant"
          >
            <Download size={12} />
            <span>Download</span>
          </a>
        ) : null
      }
      className="flex-1"
    >
      <div className="h-full bg-surface-panel p-6 overflow-y-auto font-sans select-text text-content-primary">
        {loading ? (
          <div className="h-full flex items-center justify-center text-xs text-content-tertiary">
            Checking document...
          </div>
        ) : hasPdf ? (
          <div className="w-full h-full rounded-sm border border-border-subtle overflow-hidden">
            <iframe
              src="/resume.pdf#toolbar=0"
              title="Resume"
              className="w-full h-full border-0"
            />
          </div>
        ) : (
          <div className="h-full max-w-sm mx-auto flex flex-col items-center justify-center text-center space-y-4 p-6">
            <div className="w-10 h-10 rounded-full bg-surface-base border border-border-default flex items-center justify-center text-content-tertiary">
              <FileText size={18} />
            </div>

            <div className="space-y-1">
              <h2 className="text-sm font-medium text-content-primary">Resume Document</h2>
              <p className="text-xs text-content-secondary leading-relaxed">
                The resume PDF will be available here once updated.
              </p>
            </div>

            <TodoMarker message="Upload public/resume.pdf" />

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => openWindow('about')}
                className="px-3 py-1.5 rounded-sm bg-surface-base border border-border-default hover:border-border-strong text-xs text-content-secondary hover:text-content-primary transition-colors duration-instant"
              >
                About Rudar &rarr;
              </button>
              <button
                onClick={() => openWindow('socials')}
                className="px-3 py-1.5 rounded-sm bg-surface-base border border-border-default hover:border-border-strong text-xs text-content-secondary hover:text-content-primary transition-colors duration-instant"
              >
                LinkedIn &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </AppFrame>
  );
}
