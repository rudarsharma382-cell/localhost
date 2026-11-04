'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  ExternalLink,
  Mail,
  Shield,
  Eye,
  Globe,
  ArrowUpRight,
  X,
  Maximize2,
  CheckCircle2,
  BookOpen,
  Server,
  Terminal,
  Compass,
  Sparkles,
  Layers,
  Cpu,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { useOSStore } from '@/os/window-manager/store';
import { AppIconId } from '@/components/icons/AppIcons';

function LinkedinIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export function OriginalHackathonPortfolio() {
  const { openWindow } = useOSStore();
  const [activeTab, setActiveTab] = useState<'works' | 'milestones' | 'certs' | 'gallery' | 'connect'>('works');
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCert, setSelectedCert] = useState<{ title: string; issuer: string; img: string } | null>(null);

  const certifications = [
    { title: 'Google AI Essentials', issuer: 'Google', img: '/assets/portfolio/cert-google-ai.jpg' },
    { title: 'Google Prompting Essentials', issuer: 'Google', img: '/assets/portfolio/cert-google-prompting.jpg' },
    { title: 'Microsoft Certified AI', issuer: 'Microsoft', img: '/assets/portfolio/cert-ms-ai.jpg' },
    { title: 'IBM Cybersecurity Analyst', issuer: 'IBM', img: '/assets/portfolio/cert-ibm-cyber.jpg' },
    { title: 'IBM Web Development', issuer: 'IBM', img: '/assets/portfolio/cert-ibm-web.jpg' },
    { title: 'Cisco Python Programming', issuer: 'Cisco', img: '/assets/portfolio/cert-cisco-python.jpg' },
    { title: 'GUVI & HCL Tech Certification', issuer: 'GUVI / HCL', img: '/assets/portfolio/cert-guvi-hcl.jpg' },
    { title: 'Simplilearn AI Foundation', issuer: 'Simplilearn', img: '/assets/portfolio/cert-simplilearn-ai.jpg' },
  ];

  const milestones = [
    {
      year: '2026',
      title: 'Cracked Internship at Axlero Solutions',
      role: 'Software Engineering Intern',
      desc: 'Building high-performance modules, optimizing system architectures, and engineering scalable workflows.',
      badge: 'Internship',
      tag: 'Engineering',
    },
    {
      year: '2026',
      title: 'Cracked Internship at Innovexis',
      role: 'Technical Engineering Intern',
      desc: 'Contributing to core product pipelines, data workflows, and modern web application development.',
      badge: 'Internship',
      tag: 'Systems',
    },
    {
      year: '2026',
      title: 'Cracked Internship at Labmentix',
      role: 'Infrastructure & Engineering Intern',
      desc: 'Specializing in real-world infrastructure builds, server orchestration, and production deployments.',
      badge: 'Internship',
      tag: 'DevOps',
    },
    {
      year: '2026',
      title: 'Finalist // Delhi AI Grand Hackathon',
      role: 'Summit Finalist (Top 140 in India)',
      desc: 'Recognized as an official Summit Finalist with SafeWare AI, ranking among the Top 140 teams across India out of 5 Lakh+ students and 1,000+ technical institutions.',
      badge: 'Top 140 India',
      featured: true,
      tag: 'Hackathon',
    },
    {
      year: '2025',
      title: 'Elite STEM Stream Selection',
      role: 'STEM Scholar',
      desc: 'Selected for the prestigious STEM stream at the premier School of Specialized Excellence (SoSE), Delhi, India.',
      badge: 'Academic Honor',
      tag: 'Scholar',
    },
    {
      year: '2026',
      title: 'HOOLLOW Engineering Integration',
      role: 'Core Web & Systems Engineer',
      desc: 'Collaborated with startup HOOLLOW, directing platform website features and runtime system optimizations.',
      badge: 'Startup',
      tag: 'Production',
    },
  ];

  const ventures = [
    {
      num: '01',
      title: 'SafeWare AI',
      category: 'Autonomous Road Safety & Vision',
      accolade: 'Top 140 • Delhi AI Grand Hackathon',
      desc: 'Edge-computed road safety system utilizing computer vision for driver alertness, micro-sleep detection, and forward hazard avoidance.',
      stack: ['Flutter', 'Computer Vision', 'Dart', 'Edge AI'],
      url: 'https://getsafeware.vercel.app/',
      appId: 'safeware' as AppIconId,
      featured: true,
    },
    {
      num: '02',
      title: 'TruSight AI',
      category: 'Media Forensics & Deepfake Detection',
      accolade: 'Spatial-Temporal Neural Verification',
      desc: 'Multi-modal analysis platform verifying deepfakes, synthetic voice clones, and digital authenticity with forensic reporting.',
      stack: ['Flutter', 'Multi-Modal AI', 'Forensics', 'REST API'],
      appId: 'trusight' as AppIconId,
      featured: true,
    },
    {
      num: '03',
      title: 'BMW M4 CSL 3D',
      category: 'WebGL Automotive Experience',
      accolade: 'Interactive 3D Configurator',
      desc: 'Real-time studio lighting, PBR materials, and cinematic aerodynamic visualization for BMW M4 CSL.',
      stack: ['Three.js', 'React', 'WebGL', 'GLTF'],
      url: 'https://bmwm4csl.vercel.app/',
    },
    {
      num: '04',
      title: 'Monolith House 3D',
      category: 'Brutalist Architectural Walkthrough',
      accolade: 'Spatial WebGL Engine',
      desc: 'Interactive 3D architectural journey with real-time shadow computation and procedural lighting.',
      stack: ['Three.js', 'React Three Fiber', 'GLTF', 'Shaders'],
      url: 'https://monolithhouse.vercel.app/',
    },
    {
      num: '05',
      title: 'Arc Laptop 3D Motion',
      category: 'Hardware Product Animation',
      accolade: 'Kinetic 60 FPS Experience',
      desc: 'High-concept kinetic scroll-driven 3D motion site displaying futuristic computing hardware.',
      stack: ['Three.js', 'Framer Motion', 'React', 'TypeScript'],
      url: 'https://arc-motion.vercel.app/',
    },
    {
      num: '06',
      title: 'Sole Agent AI',
      category: 'Autonomous Multi-Agent Cockpit',
      accolade: 'AI Workflow Orchestration',
      desc: 'Unified interface for deploying and coordinating autonomous AI agents with adaptive tool execution.',
      stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'AI Agents'],
      url: 'https://soleagent.vercel.app/',
    },
    {
      num: '07',
      title: 'AfterClass',
      category: 'School Classroom Architecture',
      accolade: 'WhatsApp Replacement for Schools',
      desc: 'Dedicated class spaces, encrypted teacher assignment uploads, and distraction-free homework streams.',
      stack: ['Flutter', 'Realtime DB', 'State Machine', 'Mobile UI'],
      internalRoute: 'rudar://afterclass',
    },
    {
      num: '08',
      title: 'ServerCraft',
      category: 'Minecraft Cloud Orchestrator',
      accolade: 'One-Click Server Deployment',
      desc: 'Automated container deployment and memory management dashboard for high-performance Minecraft servers.',
      stack: ['Node.js', 'Docker', 'Containers', 'WebSockets'],
      internalRoute: 'rudar://servercraft',
    },
    {
      num: '09',
      title: 'Divine Herbal Life',
      category: 'Ayurvedic Wellness Platform',
      accolade: 'E-Commerce & Holistic Health',
      desc: 'Modern digital storefront for organic Ayurvedic formulations and wellness consults.',
      stack: ['Full-Stack', 'E-Commerce', 'Responsive Web'],
      url: 'https://divineherbalife.in/',
    },
    {
      num: '10',
      title: 'Zetklo Fashion Store',
      category: 'Modern Apparel Storefront',
      accolade: 'Edge Deployed on Cloudflare',
      desc: 'Ultra-fast aesthetic fashion shopping experience with instant edge caching.',
      stack: ['Cloudflare Pages', 'React', 'Tailwind CSS'],
      url: 'https://clothing-store-5e2.pages.dev/',
    },
  ];

  const galleryEvents = [
    {
      date: 'Feb 2026',
      loc: 'IIT-Delhi, New Delhi',
      title: 'Tryst 2026 // IIT Delhi',
      desc: 'Explored robotics, student ventures, and engineering innovation at IIT Delhi annual technology symposium.',
      photos: ['https://iili.io/qqmw8VR.md.webp', 'https://iili.io/qqmwSPp.md.webp'],
    },
    {
      date: 'Apr 2026',
      loc: 'KV Gole Market, New Delhi',
      title: 'AI Workflow Workshop // Hoollow Rampage',
      desc: 'Conducted an interactive AI workflow and robotics programming workshop for aspiring developers.',
      photos: ['https://iili.io/BgDlbsV.md.jpg', 'https://iili.io/BgD0qsp.md.jpg'],
    },
    {
      date: 'Feb 2026',
      loc: 'Bharat Mandapam, New Delhi',
      title: 'AI Impact Summit // Bharat Mandapam',
      desc: 'Explored frontier AI models and autonomous systems at India’s premier global technology summit.',
      photos: ['https://iili.io/qqDqdlf.md.webp', 'https://iili.io/qqm0DYv.md.webp'],
    },
    {
      date: 'Feb 2026',
      loc: 'IITM, New Delhi',
      title: 'Techno Sapiens 2K26 Hackathon',
      desc: 'Competed in intensive 24-hour sprint developing rapid edge AI prototypes.',
      photos: ['https://iili.io/qqphca1.md.jpg', 'https://iili.io/qqpha3P.md.jpg'],
    },
  ];

  const handleLaunchApp = (appId?: AppIconId, url?: string, internalRoute?: string) => {
    if (appId) {
      openWindow(appId);
    } else if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (internalRoute) {
      openWindow('browser', { initialUrl: internalRoute });
    }
  };

  return (
    <div className="w-full min-h-full bg-[#FFFFFF] text-[#111111] font-sans selection:bg-[#8B1E1E] selection:text-white pb-24">
      {/* 1. Precision Awwwards Editorial Header */}
      <header className="sticky top-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#111111]/10 px-6 sm:px-10 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-['Syne',sans-serif] font-extrabold text-sm tracking-wider text-[#111111] uppercase">
            Rudar Sharma
          </span>
          <span className="text-[#8B1E1E] font-mono text-[10px] tracking-widest hidden sm:inline">
            // OFFICIAL 2026 MAJOR PORTFOLIO
          </span>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#8B1E1E] animate-ping" />
          <span className="text-[#111111]/70 tracking-wide text-[11px] hidden md:inline">
            DELHI AI GRAND HACKATHON • TOP 140
          </span>
        </div>

        {/* Editorial Navigation Tabs */}
        <nav className="flex items-center gap-3 sm:gap-5 text-xs font-mono uppercase tracking-wider text-[#111111]/70">
          {[
            { id: 'works', label: 'Works' },
            { id: 'milestones', label: 'Milestones' },
            { id: 'certs', label: 'Credentials' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'connect', label: 'Connect' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`transition-colors cursor-pointer py-1 relative ${
                activeTab === tab.id
                  ? 'text-[#8B1E1E] font-bold border-b-2 border-[#8B1E1E]'
                  : 'hover:text-[#111111]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* 2. Editorial Kinetic Marquee Ribbon */}
      <div className="border-b border-[#111111]/10 bg-[#0E1B2E] text-white py-1.5 px-6 overflow-hidden select-none">
        <div className="flex items-center gap-8 whitespace-nowrap text-[10px] font-mono tracking-widest uppercase">
          <span className="text-[#FFFFFF]">★ DELHI AI GRAND HACKATHON FINALIST (TOP 140 INDIA)</span>
          <span className="text-[#FFFFFF]/50">•</span>
          <span className="text-[#FFFFFF]/80">STEM SCHOLAR @ PREMIER SOSE DELHI</span>
          <span className="text-[#FFFFFF]/50">•</span>
          <span className="text-[#FFFFFF]">SOFTWARE INTERN @ AXLERO • INNOVEXIS • LABMENTIX</span>
          <span className="text-[#FFFFFF]/50">•</span>
          <span className="text-[#FFFFFF]/80">FLUTTER & EDGE AI ARCHITECTURE</span>
          <span className="text-[#FFFFFF]/50">•</span>
          <span className="text-[#FFFFFF]">HOOLLOW PLATFORM SYSTEMS</span>
        </div>
      </div>

      {/* 3. Main Editorial Body */}
      <main className="max-w-5xl mx-auto px-6 sm:px-10 pt-10 sm:pt-14 space-y-16">
        {/* HERO SECTION: Zero card spam, pure high-fashion editorial */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="border-b border-[#111111]/10 pb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#8B1E1E]/10 text-[#8B1E1E] font-mono text-[11px] font-semibold tracking-wider uppercase">
                <Award size={13} />
                <span>Delhi AI Grand Hackathon • Top 140 Finalist</span>
              </div>

              <h1 className="font-['Syne',sans-serif] text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#111111] leading-[1.05] uppercase">
                Systems, Flutter <br />
                <span className="text-[#8B1E1E]">& AI Engineer.</span>
              </h1>

              <p className="text-[#444444] text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                Dedicated STEM Scholar at School of Specialized Excellence (SoSE), building edge-computed hazard telemetry, multi-modal forensics, and high-frequency cross-platform systems with uncompromising design restraint.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono text-[#0E1B2E]">
                <span className="px-2 py-0.5 bg-[#0E1B2E]/5 rounded-sm">Flutter & Dart</span>
                <span className="px-2 py-0.5 bg-[#0E1B2E]/5 rounded-sm">Computer Vision</span>
                <span className="px-2 py-0.5 bg-[#0E1B2E]/5 rounded-sm">Three.js / WebGL</span>
                <span className="px-2 py-0.5 bg-[#0E1B2E]/5 rounded-sm">Python / TensorRT</span>
                <span className="px-2 py-0.5 bg-[#8B1E1E]/10 text-[#8B1E1E] font-semibold rounded-sm">
                  Top 140 India
                </span>
              </div>
            </div>

            {/* 21st.dev Style Interactive 3D Persona Flip Card */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-44 h-56 [perspective:1000px] cursor-pointer group"
                title="Click to flip persona"
              >
                <div
                  className={`w-full h-full relative transition-transform duration-700 [transform-style:preserve-3d] ${
                    isFlipped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* Front: CodeAlchemist Anime Avatar */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-sm p-1.5 border-2 border-[#8B1E1E]/30 bg-[#FFFFFF] shadow-sm flex flex-col items-center justify-between">
                    <div className="w-full h-40 relative rounded-sm overflow-hidden bg-[#0E1B2E]/5">
                      <Image
                        src="/assets/portfolio/hero-avatar.png"
                        alt="CodeAlchemist Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="w-full flex items-center justify-between text-[10px] font-mono px-1">
                      <span className="font-bold text-[#8B1E1E]">@CodeAlchemist</span>
                      <span className="text-[#777777] group-hover:text-[#111111]">Flip ↺</span>
                    </div>
                  </div>

                  {/* Back: Real Portrait Photo of Rudar Sharma */}
                  <div className="absolute inset-0 w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-sm p-1.5 border-2 border-[#0E1B2E]/40 bg-[#FFFFFF] shadow-sm flex flex-col items-center justify-between">
                    <div className="w-full h-40 relative rounded-sm overflow-hidden bg-[#0E1B2E]/5">
                      <Image
                        src="/assets/portfolio/Rudar_sharma_img.jpg"
                        alt="Rudar Sharma Real Portrait"
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="w-full flex items-center justify-between text-[10px] font-mono px-1">
                      <span className="font-bold text-[#0E1B2E]">Rudar Sharma</span>
                      <span className="text-[#777777]">Flip ↺</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-mono text-[#888888] mt-2">
                Click persona to toggle avatar / real portrait
              </p>
            </div>
          </div>
        </motion.section>

        {/* SECTION 01: SELECTED WORKS & VENTURES (ZERO CARD SPAM • EDITORIAL ROWS) */}
        {activeTab === 'works' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="flex items-baseline justify-between border-b border-[#111111]/10 pb-3">
              <h2 className="font-['Syne',sans-serif] text-xs font-bold tracking-[0.25em] text-[#8B1E1E] uppercase">
                // 01 Selected Systems & Live Projects
              </h2>
              <span className="text-[#111111]/50 text-xs font-mono">
                Click to open directly in Rudar OS or new tab
              </span>
            </div>

            <div className="divide-y divide-[#111111]/10">
              {ventures.map((proj) => (
                <motion.div
                  key={proj.title}
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => handleLaunchApp(proj.appId, proj.url, proj.internalRoute)}
                  className="group py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-[#8B1E1E]/[0.02] transition-colors px-2 -mx-2 rounded-sm"
                >
                  <div className="flex items-start gap-4 max-w-xl">
                    <span className="font-mono text-xs text-[#8B1E1E] font-bold tracking-wider pt-0.5">
                      {proj.num}
                    </span>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-['Syne',sans-serif] text-base sm:text-lg font-bold text-[#111111] group-hover:text-[#8B1E1E] transition-colors uppercase">
                          {proj.title}
                        </h3>
                        <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#111111]/5 text-[#444444] rounded-sm">
                          {proj.accolade}
                        </span>
                      </div>
                      <p className="text-xs text-[#555555] leading-relaxed">
                        {proj.desc}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.stack.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-mono text-[#0E1B2E] bg-[#0E1B2E]/5 px-1.5 py-0.5 rounded-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-sm bg-[#111111] text-white text-xs font-mono font-medium flex items-center gap-1.5 group-hover:bg-[#8B1E1E] transition-colors"
                    >
                      <span>{proj.appId ? 'Open App' : 'Launch'}</span>
                      <ArrowUpRight size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* SECTION 02: STRATEGIC MILESTONES (EDITORIAL TRACK RECORD) */}
        {activeTab === 'milestones' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="flex items-baseline justify-between border-b border-[#111111]/10 pb-3">
              <h2 className="font-['Syne',sans-serif] text-xs font-bold tracking-[0.25em] text-[#8B1E1E] uppercase">
                // 02 Strategic Milestones & Engineering Record
              </h2>
              <span className="text-[#111111]/50 text-xs font-mono">
                Verified Career & Academic Track
              </span>
            </div>

            <div className="divide-y divide-[#111111]/10">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="py-5 flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-xs text-[#8B1E1E] font-bold tracking-wider pt-0.5">
                      {m.year}
                    </span>
                    <div className="space-y-1 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-['Syne',sans-serif] text-base font-bold text-[#111111] uppercase">
                          {m.title}
                        </h3>
                        <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#8B1E1E]/10 text-[#8B1E1E] font-semibold rounded-sm">
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-[#0E1B2E]">{m.role}</p>
                      <p className="text-xs text-[#555555] leading-relaxed pt-0.5">{m.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#777777] uppercase self-start md:self-center">
                    [{m.tag}]
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* SECTION 03: VERIFIED CREDENTIALS (INTERACTIVE LIGHTBOX) */}
        {activeTab === 'certs' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="flex items-baseline justify-between border-b border-[#111111]/10 pb-3">
              <h2 className="font-['Syne',sans-serif] text-xs font-bold tracking-[0.25em] text-[#8B1E1E] uppercase">
                // 03 Verified Credentials & Certifications
              </h2>
              <span className="text-[#111111]/50 text-xs font-mono">
                Click any credential to inspect original certificate
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert.title}
                  onClick={() => setSelectedCert(cert)}
                  className="group border border-[#111111]/10 rounded-sm p-3 bg-[#FFFFFF] hover:border-[#8B1E1E] transition-all cursor-pointer flex flex-col justify-between space-y-3"
                >
                  <div className="w-full h-28 relative rounded-sm overflow-hidden bg-[#0E1B2E]/5 border border-[#111111]/5">
                    <Image
                      src={cert.img}
                      alt={cert.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h4 className="font-['Syne',sans-serif] text-xs font-bold text-[#111111] group-hover:text-[#8B1E1E] transition-colors leading-snug">
                      {cert.title}
                    </h4>
                    <p className="text-[10px] font-mono text-[#777777] mt-0.5">
                      Issuer: {cert.issuer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* SECTION 04: FIELD GALLERY (REAL EVENTS) */}
        {activeTab === 'gallery' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="flex items-baseline justify-between border-b border-[#111111]/10 pb-3">
              <h2 className="font-['Syne',sans-serif] text-xs font-bold tracking-[0.25em] text-[#8B1E1E] uppercase">
                // 04 Real Field Events & Community Work
              </h2>
              <span className="text-[#111111]/50 text-xs font-mono">
                From official gallery.json records
              </span>
            </div>

            <div className="space-y-8">
              {galleryEvents.map((evt, idx) => (
                <div key={idx} className="border-b border-[#111111]/10 pb-6 space-y-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h3 className="font-['Syne',sans-serif] text-sm font-bold text-[#111111] uppercase">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-[#555555] mt-0.5">{evt.desc}</p>
                    </div>
                    <span className="text-[10px] font-mono text-[#8B1E1E] font-semibold">
                      {evt.date} • {evt.loc}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {evt.photos.map((url, pIdx) => (
                      <div
                        key={pIdx}
                        className="h-32 relative rounded-sm overflow-hidden bg-[#0E1B2E]/5 border border-[#111111]/10"
                      >
                        <Image
                          src={url}
                          alt={`${evt.title} photo ${pIdx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* SECTION 05: TRANSMISSION & CONNECT */}
        {activeTab === 'connect' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="flex items-baseline justify-between border-b border-[#111111]/10 pb-3">
              <h2 className="font-['Syne',sans-serif] text-xs font-bold tracking-[0.25em] text-[#8B1E1E] uppercase">
                // 05 Direct Transmission & Connect
              </h2>
              <span className="text-[#111111]/50 text-xs font-mono">
                Verified Direct Channels
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <p className="text-sm text-[#444444] leading-relaxed">
                  Interested in discussing autonomous computer vision architectures, high-performance Flutter mobile systems, or hackathon collaboration? Reach out through any verified channel below.
                </p>

                <div className="space-y-3 pt-2">
                  <a
                    href="https://linkedin.com/in/rudarsharma-dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border border-[#111111]/10 rounded-sm hover:border-[#8B1E1E] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <LinkedinIcon size={18} className="text-[#0E1B2E] group-hover:text-[#8B1E1E] transition-colors" />
                      <div>
                        <div className="text-xs font-bold font-mono text-[#111111]">LinkedIn</div>
                        <div className="text-[10px] text-[#777777]">linkedin.com/in/rudarsharma-dev</div>
                      </div>
                    </div>
                    <ArrowUpRight size={14} className="text-[#777777] group-hover:text-[#8B1E1E]" />
                  </a>

                  <a
                    href="https://github.com/rudarsharma382-cell"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border border-[#111111]/10 rounded-sm hover:border-[#8B1E1E] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <GithubIcon size={18} className="text-[#0E1B2E] group-hover:text-[#8B1E1E] transition-colors" />
                      <div>
                        <div className="text-xs font-bold font-mono text-[#111111]">GitHub</div>
                        <div className="text-[10px] text-[#777777]">github.com/rudarsharma382-cell</div>
                      </div>
                    </div>
                    <ArrowUpRight size={14} className="text-[#777777] group-hover:text-[#8B1E1E]" />
                  </a>

                  <a
                    href="https://rudar.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border border-[#111111]/10 rounded-sm hover:border-[#8B1E1E] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-[#0E1B2E] group-hover:text-[#8B1E1E] transition-colors" />
                      <div>
                        <div className="text-xs font-bold font-mono text-[#111111]">Web Portfolio</div>
                        <div className="text-[10px] text-[#777777]">rudar.vercel.app</div>
                      </div>
                    </div>
                    <ArrowUpRight size={14} className="text-[#777777] group-hover:text-[#8B1E1E]" />
                  </a>
                </div>
              </div>

              {/* Direct Note Form */}
              <div className="border border-[#111111]/10 rounded-sm p-5 bg-[#F9FAFB] space-y-4">
                <h3 className="font-['Syne',sans-serif] text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Transmit Message to Rudar
                </h3>
                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="text-[10px] text-[#777777] uppercase block mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="Collaborator / Organizer"
                      className="w-full bg-[#FFFFFF] border border-[#111111]/15 rounded-sm px-3 py-1.5 focus:border-[#8B1E1E] outline-none text-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#777777] uppercase block mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      className="w-full bg-[#FFFFFF] border border-[#111111]/15 rounded-sm px-3 py-1.5 focus:border-[#8B1E1E] outline-none text-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#777777] uppercase block mb-1">Inquiry / Subject</label>
                    <textarea
                      rows={3}
                      placeholder="Brief note or project inquiry..."
                      className="w-full bg-[#FFFFFF] border border-[#111111]/15 rounded-sm px-3 py-1.5 focus:border-[#8B1E1E] outline-none text-[#111111] resize-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Message dispatch queued for Rudar Sharma.')}
                    className="w-full py-2 bg-[#8B1E1E] text-white rounded-sm font-bold uppercase tracking-wider hover:bg-[#A62B2B] transition-colors"
                  >
                    Send Transmission
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </main>

      {/* 4. Interactive Lightbox Modal for Credentials */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-50 bg-[#0E1B2E]/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FFFFFF] border border-[#111111]/20 rounded-sm max-w-2xl w-full p-4 space-y-3 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-[#111111]/10 pb-2">
                <div>
                  <h3 className="font-['Syne',sans-serif] text-sm font-bold text-[#111111] uppercase">
                    {selectedCert.title}
                  </h3>
                  <p className="text-[10px] font-mono text-[#777777]">
                    Verified Issuing Authority: {selectedCert.issuer}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-1 rounded-sm text-[#111111] hover:bg-[#111111]/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="relative w-full h-[60vh] max-h-[500px] rounded-sm overflow-hidden bg-black/5">
                <Image
                  src={selectedCert.img}
                  alt={selectedCert.title}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#555555] pt-1">
                <span className="flex items-center gap-1.5 text-[#8B1E1E]">
                  <CheckCircle2 size={13} />
                  <span>Credential Authenticity Verified</span>
                </span>
                <button
                  onClick={() => window.open(selectedCert.img, '_blank')}
                  className="text-[#0E1B2E] hover:underline flex items-center gap-1"
                >
                  <span>Open Full Resolution</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
