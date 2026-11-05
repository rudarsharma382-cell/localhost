'use client';

import React, { useState } from 'react';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { resumeData } from '@/content/resume';
import { tokens } from '@/styles/tokens';
import {
  Download,
  FileText,
  Mail,
  MapPin,
  ExternalLink,
  Award,
  Briefcase,
  GraduationCap,
  Code2,
  FolderGit2,
  Copy,
  Check,
  Eye,
} from 'lucide-react';

interface ResumeAppProps {
  windowId: string;
}

export default function ResumeApp({ windowId }: ResumeAppProps) {
  const { closeWindow, openWindow } = useOSStore();
  const [viewMode, setViewMode] = useState<'document' | 'pdf'>('document');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(resumeData.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <AppFrame
      appId="resume"
      title="Resume.exe — Rudar Sharma Curriculum Vitae"
      onBack={() => closeWindow(windowId)}
      headerActions={
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded bg-surface-base border border-border-default p-0.5 text-[11px] font-sans">
            <button
              onClick={() => setViewMode('document')}
              className={`px-1.5 sm:px-2 py-0.5 rounded-sm transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === 'document'
                  ? 'bg-accent/20 text-accent font-medium'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              <FileText size={11} />
              <span className="hidden xs:inline sm:inline">Document</span>
              <span className="xs:hidden sm:hidden">Doc</span>
            </button>
            <button
              onClick={() => setViewMode('pdf')}
              className={`px-1.5 sm:px-2 py-0.5 rounded-sm transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === 'pdf'
                  ? 'bg-accent/20 text-accent font-medium'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              <Eye size={11} />
              <span>PDF</span>
            </button>
          </div>

          {/* Download Button */}
          <a
            href={resumeData.pdfUrl}
            download="Rudar_Sharma_Resume.pdf"
            className="px-2 sm:px-2.5 py-1 rounded bg-accent text-surface-canvas hover:bg-accent-hover text-xs font-semibold flex items-center gap-1 sm:gap-1.5 transition-colors shadow-sm cursor-pointer shrink-0"
            title="Download Official Resume PDF"
          >
            <Download size={12} />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </a>
        </div>
      }
      className="flex-1"
    >
      <div className="h-full bg-surface-canvas overflow-y-auto select-text font-sans text-content-primary">
        {viewMode === 'pdf' ? (
          /* PDF Viewer Mode */
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl h-full rounded border border-border-default overflow-hidden bg-surface-base shadow-lg">
              <iframe
                src={`${resumeData.pdfUrl}#toolbar=1&navpanes=0`}
                title="Rudar Sharma Resume PDF"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        ) : (
          /* Document Viewer Mode */
          <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-8">
            {/* Document Header Card */}
            <div className="bg-surface-base border border-border-default rounded-lg p-6 md:p-8 space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                      Curriculum Vitae
                    </span>
                    <span className="text-[10px] text-content-tertiary font-mono">Verified 2024</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-content-primary">
                    {resumeData.name}
                  </h1>
                  <p className="text-xs text-accent font-medium">
                    {resumeData.title}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5 text-xs text-content-secondary font-mono">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-content-tertiary" />
                    <span>{resumeData.location}</span>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-1.5 hover:text-content-primary transition-colors cursor-pointer group"
                    title="Click to copy email"
                  >
                    <Mail size={12} className="text-content-tertiary" />
                    <span>{resumeData.email}</span>
                    {copiedEmail ? (
                      <Check size={11} className="text-semantic-success" />
                    ) : (
                      <Copy size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-content-tertiary" />
                    )}
                  </button>
                </div>
              </div>

              {/* Public Links Strip */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {resumeData.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-panel hover:bg-surface-raised border border-border-subtle hover:border-border-default text-xs text-content-secondary hover:text-content-primary transition-colors cursor-pointer"
                  >
                    <span>{link.label}</span>
                    <ExternalLink size={10} className="text-content-tertiary" />
                  </a>
                ))}
              </div>

              {/* Summary Statement */}
              <div className="pt-2">
                <h2 className="text-xs uppercase tracking-wider font-mono text-content-tertiary mb-1.5">
                  Executive Profile
                </h2>
                <p className="text-xs leading-relaxed text-content-secondary">
                  {resumeData.summary}
                </p>
              </div>
            </div>

            {/* Experience Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
                <Briefcase size={15} className="text-accent" />
                <h2 className="text-sm font-semibold tracking-wide text-content-primary uppercase">
                  Professional Experience
                </h2>
              </div>

              <div className="space-y-4">
                {resumeData.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-base border border-border-subtle hover:border-border-default rounded-md p-5 space-y-3 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h3 className="text-sm font-semibold text-content-primary">
                          {exp.role}
                        </h3>
                        <p className="text-xs text-accent font-medium">
                          {exp.company}
                        </p>
                      </div>
                      <div className="text-[11px] font-mono text-content-tertiary sm:text-right">
                        <span>{exp.period}</span> • <span>{exp.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-content-secondary leading-relaxed">
                      {exp.description}
                    </p>

                    <ul className="space-y-1.5 pt-1">
                      {exp.achievements.map((item, aIdx) => (
                        <li key={aIdx} className="text-xs text-content-secondary flex items-start gap-2">
                          <span className="text-accent text-sm leading-none mt-0.5">•</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border-subtle/60">
                      {exp.stack.map((stk) => (
                        <span
                          key={stk}
                          className="px-2 py-0.5 text-[10px] font-mono rounded bg-surface-panel border border-border-subtle text-content-tertiary"
                        >
                          {stk}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Engineering Projects Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
                <FolderGit2 size={15} className="text-accent" />
                <h2 className="text-sm font-semibold tracking-wide text-content-primary uppercase">
                  Key Engineering Projects
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumeData.projects.map((proj, pIdx) => (
                  <div
                    key={pIdx}
                    className="bg-surface-base border border-border-subtle rounded-md p-4 space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-content-primary">
                          {proj.name}
                        </h3>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-accent-hover transition-colors"
                            title="Inspect project live"
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-content-tertiary">
                        {proj.role} • {proj.period}
                      </p>
                      <p className="text-xs text-content-secondary leading-relaxed">
                        {proj.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-2">
                      {proj.stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-surface-panel border border-border-subtle text-content-tertiary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & STEM Track Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
                <GraduationCap size={15} className="text-accent" />
                <h2 className="text-sm font-semibold tracking-wide text-content-primary uppercase">
                  Education & Academic Standing
                </h2>
              </div>

              {resumeData.education.map((edu, eIdx) => (
                <div
                  key={eIdx}
                  className="bg-surface-base border border-border-subtle rounded-md p-5 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h3 className="text-sm font-semibold text-content-primary">
                        {edu.degree}
                      </h3>
                      <p className="text-xs text-accent font-medium">
                        {edu.institution}
                      </p>
                    </div>
                    <div className="text-[11px] font-mono text-content-tertiary">
                      {edu.period} {edu.score && `• ${edu.score}`}
                    </div>
                  </div>

                  {edu.highlights && (
                    <ul className="space-y-1 pt-1">
                      {edu.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="text-xs text-content-secondary flex items-start gap-2">
                          <span className="text-accent text-sm leading-none mt-0.5">•</span>
                          <span className="leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Technical Skills Grid Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
                <Code2 size={15} className="text-accent" />
                <h2 className="text-sm font-semibold tracking-wide text-content-primary uppercase">
                  Technical Competencies
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-surface-base border border-border-subtle rounded-md p-4 space-y-2">
                  <h3 className="text-xs uppercase font-mono font-bold text-accent">
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills.languages.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-1 text-xs rounded bg-surface-panel border border-border-default text-content-primary"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-surface-base border border-border-subtle rounded-md p-4 space-y-2">
                  <h3 className="text-xs uppercase font-mono font-bold text-accent">
                    Frameworks & Engines
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills.frameworks.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-1 text-xs rounded bg-surface-panel border border-border-default text-content-primary"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-surface-base border border-border-subtle rounded-md p-4 space-y-2">
                  <h3 className="text-xs uppercase font-mono font-bold text-accent">
                    Developer Tools & Systems
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills.tools.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-1 text-xs rounded bg-surface-panel border border-border-default text-content-primary"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-surface-base border border-border-subtle rounded-md p-4 space-y-2">
                  <h3 className="text-xs uppercase font-mono font-bold text-accent">
                    Engineering Specialties
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills.specialties.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-1 text-xs rounded bg-surface-panel border border-border-default text-content-primary"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Honors & Hackathon Achievements Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
                <Award size={15} className="text-accent" />
                <h2 className="text-sm font-semibold tracking-wide text-content-primary uppercase">
                  Honors & Hackathon Awards
                </h2>
              </div>

              <div className="space-y-3">
                {resumeData.achievements.map((ach, aIdx) => (
                  <div
                    key={aIdx}
                    className="bg-surface-base border border-border-subtle rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-semibold text-content-primary">
                          {ach.title}
                        </h3>
                        {ach.badge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/30 font-medium">
                            {ach.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-content-secondary leading-relaxed">
                        {ach.description}
                      </p>
                    </div>
                    <div className="text-[10px] font-mono text-content-tertiary sm:text-right shrink-0">
                      <div>{ach.org}</div>
                      <div>{ach.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions Footer */}
            <div className="p-4 rounded-md bg-surface-base border border-border-default flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-content-secondary">
                Looking for references, verification, or project repositories?
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openWindow('certificates')}
                  className="px-3 py-1.5 rounded bg-surface-panel hover:bg-surface-raised border border-border-default text-content-primary transition-colors cursor-pointer"
                >
                  View Certificates &rarr;
                </button>
                <a
                  href={resumeData.pdfUrl}
                  download="Rudar_Sharma_Resume.pdf"
                  className="px-3 py-1.5 rounded bg-accent text-surface-canvas hover:bg-accent-hover font-semibold transition-colors cursor-pointer"
                >
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppFrame>
  );
}
