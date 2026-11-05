'use client';

import React from 'react';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { resumeData } from '@/content/resume';
import { Download, ExternalLink } from 'lucide-react';

interface ResumeAppProps {
  windowId: string;
}

export default function ResumeApp({ windowId }: ResumeAppProps) {
  const { closeWindow } = useOSStore();

  const pdfUrl = resumeData.pdfUrl || '/resume.pdf';

  return (
    <AppFrame
      appId="resume"
      title="Resume.exe — Rudar Sharma Curriculum Vitae"
      onBack={() => closeWindow(windowId)}
      headerActions={
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Open in New Tab Button */}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded bg-surface-base border border-border-default hover:bg-surface-raised text-content-secondary hover:text-content-primary text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            title="Open PDF in new tab"
          >
            <ExternalLink size={12} />
            <span className="hidden sm:inline">Open Tab</span>
          </a>

          {/* Download Button */}
          <a
            href={pdfUrl}
            download="Rudar_Sharma_Resume.pdf"
            className="px-2.5 py-1 rounded bg-accent text-surface-canvas hover:bg-accent-hover text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer shrink-0"
            title="Download Official Resume PDF"
          >
            <Download size={12} />
            <span>Download PDF</span>
          </a>
        </div>
      }
      className="flex-1"
    >
      <div className="w-full h-full bg-[#18181b] flex flex-col items-center justify-center p-0 md:p-3 overflow-hidden select-none">
        <div className="w-full h-full rounded-none md:rounded border-0 md:border md:border-border-default overflow-hidden bg-white shadow-xl">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0`}
            title="Rudar Sharma Resume PDF"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </AppFrame>
  );
}
