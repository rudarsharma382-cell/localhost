import React from 'react';
import dynamic from 'next/dynamic';
import { AppIconId } from '@/components/icons/AppIcons';

export type AppTier = 'mvp' | 'should' | 'could';

export interface AppMetadata {
  id: AppIconId;
  title: string;
  shortTitle: string;
  icon: AppIconId;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  singleInstance: boolean;
  resizable: boolean;
  tier: AppTier;
  component: React.ComponentType<{ windowId: string; isLiteMode?: boolean }>;
}

// Lazy loading each application chunk
const StudioApp = dynamic(() => import('@/apps/studio/StudioApp'), {
  loading: () => <AppLoadingState title="Development Studio" />,
});

const BrowserApp = dynamic(() => import('@/apps/browser/BrowserApp'), {
  loading: () => <AppLoadingState title="Browser" />,
});

const AboutApp = dynamic(() => import('@/apps/about/AboutApp'), {
  loading: () => <AppLoadingState title="About Me" />,
});

const AssistantApp = dynamic(() => import('@/apps/assistant/AssistantApp'), {
  loading: () => <AppLoadingState title="Rudar AI" />,
});

const SocialsApp = dynamic(() => import('@/apps/socials/SocialsApp'), {
  loading: () => <AppLoadingState title="Socials" />,
});

const NotesApp = dynamic(() => import('@/apps/notes/NotesApp'), {
  loading: () => <AppLoadingState title="Notes" />,
});

const ResumeApp = dynamic(() => import('@/apps/resume/ResumeApp'), {
  loading: () => <AppLoadingState title="Resume" />,
});

const TerminalApp = dynamic(() => import('@/apps/terminal/TerminalApp'), {
  loading: () => <AppLoadingState title="Terminal" />,
});

const SettingsApp = dynamic(() => import('@/apps/settings/SettingsApp'), {
  loading: () => <AppLoadingState title="Settings" />,
});

const SafewareApp = dynamic(() => import('@/apps/safeware/SafewareApp'), {
  loading: () => <AppLoadingState title="SafeWare AI" />,
});

const TruSightApp = dynamic(() => import('@/apps/trusight/TruSightApp'), {
  loading: () => <AppLoadingState title="TruSight AI" />,
});

const CertificatesApp = dynamic(() => import('@/apps/certificates/CertificatesApp'), {
  loading: () => <AppLoadingState title="Certificate Wallet" />,
});

const DeveloperApp = dynamic(() => import('@/apps/developer/DeveloperApp'), {
  loading: () => <AppLoadingState title="Developer Console" />,
});

const SandboxApp = dynamic(() => import('@/apps/sandbox/SandboxApp'), {
  loading: () => <AppLoadingState title="Sandbox.exe" />,
});

const GalleryApp = dynamic(() => import('@/apps/gallery/GalleryApp'), {
  loading: () => <AppLoadingState title="Gallery.exe" />,
});

function AppLoadingState({ title }: { title: string }) {
  return (
    <div className="w-full h-full min-h-[240px] flex flex-col items-center justify-center p-6 bg-surface-panel text-content-secondary space-y-3 select-none">
      <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      <span className="text-xs font-mono text-content-tertiary">Loading {title}...</span>
    </div>
  );
}

export const appRegistry: Record<AppIconId, AppMetadata> = {
  studio: {
    id: 'studio',
    title: 'Development Studio',
    shortTitle: 'Studio',
    icon: 'studio',
    defaultSize: { w: 920, h: 620 },
    minSize: { w: 600, h: 420 },
    singleInstance: true,
    resizable: true,
    tier: 'mvp',
    component: StudioApp,
  },
  browser: {
    id: 'browser',
    title: 'Browser',
    shortTitle: 'Browser',
    icon: 'browser',
    defaultSize: { w: 960, h: 640 },
    minSize: { w: 640, h: 440 },
    singleInstance: false,
    resizable: true,
    tier: 'mvp',
    component: BrowserApp,
  },
  about: {
    id: 'about',
    title: 'About Me',
    shortTitle: 'About',
    icon: 'about',
    defaultSize: { w: 680, h: 560 },
    minSize: { w: 480, h: 380 },
    singleInstance: true,
    resizable: true,
    tier: 'mvp',
    component: AboutApp,
  },
  assistant: {
    id: 'assistant',
    title: 'Rudar AI',
    shortTitle: 'Assistant',
    icon: 'assistant',
    defaultSize: { w: 460, h: 580 },
    minSize: { w: 380, h: 460 },
    singleInstance: true,
    resizable: true,
    tier: 'mvp',
    component: AssistantApp,
  },
  socials: {
    id: 'socials',
    title: 'Socials & Network',
    shortTitle: 'Socials',
    icon: 'socials',
    defaultSize: { w: 440, h: 420 },
    minSize: { w: 360, h: 320 },
    singleInstance: true,
    resizable: false,
    tier: 'mvp',
    component: SocialsApp,
  },
  notes: {
    id: 'notes',
    title: 'Notes & Guestbook',
    shortTitle: 'Notes',
    icon: 'notes',
    defaultSize: { w: 500, h: 520 },
    minSize: { w: 400, h: 400 },
    singleInstance: true,
    resizable: true,
    tier: 'should',
    component: NotesApp,
  },
  resume: {
    id: 'resume',
    title: 'Resume.exe',
    shortTitle: 'Resume',
    icon: 'resume',
    defaultSize: { w: 840, h: 680 },
    minSize: { w: 560, h: 480 },
    singleInstance: true,
    resizable: true,
    tier: 'should',
    component: ResumeApp,
  },
  certificates: {
    id: 'certificates',
    title: 'Certificate Wallet',
    shortTitle: 'Certificates',
    icon: 'certificates',
    defaultSize: { w: 860, h: 620 },
    minSize: { w: 580, h: 420 },
    singleInstance: true,
    resizable: true,
    tier: 'should',
    component: CertificatesApp,
  },
  developer: {
    id: 'developer',
    title: 'Developer Console',
    shortTitle: 'Developer',
    icon: 'developer',
    defaultSize: { w: 880, h: 640 },
    minSize: { w: 600, h: 440 },
    singleInstance: true,
    resizable: true,
    tier: 'should',
    component: DeveloperApp,
  },
  sandbox: {
    id: 'sandbox',
    title: 'Sandbox.exe',
    shortTitle: 'Sandbox',
    icon: 'sandbox',
    defaultSize: { w: 920, h: 660 },
    minSize: { w: 640, h: 480 },
    singleInstance: true,
    resizable: true,
    tier: 'should',
    component: SandboxApp,
  },
  gallery: {
    id: 'gallery',
    title: 'Gallery.exe',
    shortTitle: 'Gallery',
    icon: 'gallery',
    defaultSize: { w: 900, h: 640 },
    minSize: { w: 620, h: 460 },
    singleInstance: true,
    resizable: true,
    tier: 'should',
    component: GalleryApp,
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal CLI',
    shortTitle: 'Terminal',
    icon: 'terminal',
    defaultSize: { w: 680, h: 460 },
    minSize: { w: 480, h: 340 },
    singleInstance: false,
    resizable: true,
    tier: 'should',
    component: TerminalApp,
  },
  settings: {
    id: 'settings',
    title: 'Settings',
    shortTitle: 'Settings',
    icon: 'settings',
    defaultSize: { w: 520, h: 480 },
    minSize: { w: 420, h: 360 },
    singleInstance: true,
    resizable: false,
    tier: 'should',
    component: SettingsApp,
  },
  safeware: {
    id: 'safeware',
    title: 'SafeWare AI',
    shortTitle: 'SafeWare',
    icon: 'safeware',
    defaultSize: { w: 820, h: 580 },
    minSize: { w: 560, h: 420 },
    singleInstance: true,
    resizable: true,
    tier: 'mvp',
    component: SafewareApp,
  },
  trusight: {
    id: 'trusight',
    title: 'TruSight AI',
    shortTitle: 'TruSight',
    icon: 'trusight',
    defaultSize: { w: 820, h: 580 },
    minSize: { w: 560, h: 420 },
    singleInstance: true,
    resizable: true,
    tier: 'mvp',
    component: TruSightApp,
  },
};

export const defaultDockApps: AppIconId[] = [
  'safeware',
  'trusight',
  'browser',
  'about',
  'assistant',
  'resume',
  'certificates',
  'sandbox',
  'gallery',
  'notes',
  'terminal',
];
