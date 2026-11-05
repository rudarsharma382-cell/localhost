'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { certificates } from '@/content/certificates';
import { Certificate, CertificateCategory } from '@/content/schema';
import { CardStack, CardStackItem } from '@/components/ui/card-stack';
import ReflectiveCard from '@/components/ui/ReflectiveCard';
import {
  Search,
  Award,
  ExternalLink,
  X,
  CheckCircle2,
  Calendar,
  Layers,
  LayoutGrid,
  ZoomIn,
  ZoomOut,
  Sparkles,
  ShieldCheck,
  Eye,
  CreditCard,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface CertificatesAppProps {
  windowId: string;
}

const CATEGORIES: ('All' | CertificateCategory)[] = [
  'All',
  'AI & Machine Learning',
  'Systems & Cloud',
  'Web & Mobile',
  'Cybersecurity',
  'Hackathons & Honors',
];

export default function CertificatesApp({ windowId }: CertificatesAppProps) {
  const { closeWindow } = useOSStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | CertificateCategory>('All');
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [viewMode, setViewMode] = useState<'stack' | 'grid'>('stack');
  const [inspectTab, setInspectTab] = useState<'reflective' | 'document'>('reflective');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const cardWidth = isMobile
    ? typeof window !== 'undefined'
      ? Math.min(340, window.innerWidth - 32)
      : 320
    : 460;
  const cardHeight = isMobile ? Math.round(cardWidth * 0.65) : 290;

  // Filtered certificate list
  const filteredCertificates = useMemo(() => {
    return certificates.filter((c) => {
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.issuer.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q)) ||
        c.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  // Map to CardStack items
  interface CertStackItem extends CardStackItem {
    cert: Certificate;
  }

  const stackItems: CertStackItem[] = useMemo(() => {
    return filteredCertificates.map((cert) => ({
      id: cert.id,
      title: cert.title,
      description: cert.description,
      imageSrc: cert.image,
      href: cert.verificationUrl,
      tag: cert.category,
      ctaLabel: 'Verify Credential',
      cert,
    }));
  }, [filteredCertificates]);

  // Active index for carousel swipe
  const activeCertIndex = useMemo(() => {
    if (!activeCert) return -1;
    return filteredCertificates.findIndex((c) => c.id === activeCert.id);
  }, [activeCert, filteredCertificates]);

  const goToPrevCert = React.useCallback(() => {
    if (filteredCertificates.length === 0) return;
    const prevIndex =
      activeCertIndex <= 0 ? filteredCertificates.length - 1 : activeCertIndex - 1;
    setActiveCert(filteredCertificates[prevIndex]);
  }, [activeCertIndex, filteredCertificates]);

  const goToNextCert = React.useCallback(() => {
    if (filteredCertificates.length === 0) return;
    const nextIndex =
      activeCertIndex >= filteredCertificates.length - 1 ? 0 : activeCertIndex + 1;
    setActiveCert(filteredCertificates[nextIndex]);
  }, [activeCertIndex, filteredCertificates]);

  // Cursor drag / swipe tracking
  const pointerStartRef = React.useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerStartRef.current) return;
    const deltaX = e.clientX - pointerStartRef.current.x;
    const deltaY = e.clientY - pointerStartRef.current.y;
    pointerStartRef.current = null;

    // Horizontal swipe threshold: 35px, horizontal movement dominant
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
      if (deltaX > 0) {
        goToPrevCert(); // swiped right -> prev
      } else {
        goToNextCert(); // swiped left -> next
      }
    }
  };

  // Keyboard shortcut listener for modal close (Esc) and Left/Right arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === 'Escape') {
        if (activeCert) {
          setActiveCert(null);
          setIsZoomed(false);
        }
      } else if (e.key === 'ArrowLeft') {
        if (activeCert) {
          goToPrevCert();
        }
      } else if (e.key === 'ArrowRight') {
        if (activeCert) {
          goToNextCert();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCert, goToPrevCert, goToNextCert]);

  return (
    <AppFrame
      appId="certificates"
      title="Certificate Wallet — Accredited Credentials"
      onBack={() => closeWindow(windowId)}
      headerActions={
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-zinc-900/90 p-0.5 rounded border border-zinc-800 text-xs">
            <button
              onClick={() => setViewMode('stack')}
              className={`px-2 py-0.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'stack'
                  ? 'bg-accent/20 text-accent font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="3D Card Stack View"
            >
              <Layers size={12} />
              <span>3D Deck</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2 py-0.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-accent/20 text-accent font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={12} />
              <span>Grid</span>
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-sans text-zinc-400">
            <span>{certificates.length} Credentials</span>
          </div>
        </div>
      }
      className="flex-1"
    >
      <div className="h-full bg-[#0A0A0A] flex flex-col font-sans select-text text-zinc-100 overflow-hidden relative">
        {/* Top Filter & Search Controls */}
        <div className="p-3 md:p-4 bg-[#0A0A0A] border-b border-zinc-800/80 space-y-2.5 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search credentials by title, issuer, or skill..."
                className="w-full pl-9 pr-3 py-1.5 rounded bg-zinc-900/80 border border-zinc-800 focus:border-accent text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 text-xs"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-sans">
              <ShieldCheck size={14} className="text-accent" />
              <span className="text-[11px]">All credentials verified against public registries</span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded text-xs transition-colors shrink-0 cursor-pointer font-sans ${
                  selectedCategory === cat
                    ? 'bg-accent/20 border border-accent/40 text-accent font-medium'
                    : 'bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center bg-[#0A0A0A]">
          {filteredCertificates.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-2 text-zinc-500 font-sans">
              <Award size={32} className="opacity-40" />
              <p className="text-xs">No certificates match your search query.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                }}
                className="text-xs text-accent hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === 'stack' ? (
            <div className="w-full max-w-4xl py-2 flex flex-col items-center">
              <div className="text-center mb-1">
                <span className="text-[11px] font-sans text-zinc-400">
                  Drag cards or use Left/Right arrows • Click Inspect to open Reflective Card
                </span>
              </div>
              <CardStack<CertStackItem>
                items={stackItems}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                perspectivePx={isMobile ? 800 : 1100}
                depthPx={isMobile ? 90 : 130}
                overlap={0.46}
                spreadDeg={isMobile ? 32 : 44}
                autoAdvance={false}
                showDots={true}
                className="mx-auto"
                renderCard={(item, { active }) => (
                  <div
                    className="relative w-full h-full bg-zinc-950 rounded-2xl overflow-hidden flex flex-col justify-between border border-zinc-800 shadow-2xl group cursor-pointer font-sans"
                    onClick={() => {
                      setActiveCert(item.cert);
                      setInspectTab('reflective');
                    }}
                  >
                    {/* Background Certificate Image */}
                    <div className="absolute inset-0">
                      <img
                        src={item.imageSrc}
                        alt={item.title}
                        className="w-full h-full object-cover select-none pointer-events-none"
                        loading="eager"
                      />
                    </div>

                    {/* Gradient Overlays */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/25" />

                    {/* Top Bar inside Card */}
                    <div className="relative z-10 p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-accent text-[11px] font-sans font-semibold">
                        <CheckCircle2 size={12} className="text-accent" />
                        <span>{item.cert.issuer}</span>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-zinc-300 text-[10px] font-sans">
                        <Calendar size={10} />
                        <span>{item.cert.date}</span>
                      </div>
                    </div>

                    {/* Bottom Metadata & Controls */}
                    <div className="relative z-10 p-4 space-y-2">
                      <div>
                        <span className="text-[10px] uppercase font-sans tracking-wider text-accent/90 font-medium">
                          {item.cert.category}
                        </span>
                        <h3 className="text-sm font-semibold text-white truncate drop-shadow-sm font-sans">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-zinc-300 line-clamp-2 mt-0.5 leading-relaxed font-sans">
                          {item.description}
                        </p>
                      </div>

                      {/* Skills + Action Buttons */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex flex-wrap gap-1 max-w-[65%]">
                          {item.cert.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-1.5 py-0.5 text-[9px] font-sans rounded bg-white/15 backdrop-blur-sm text-zinc-200 border border-white/10"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        {active && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCert(item.cert);
                                setInspectTab('reflective');
                              }}
                              className="px-2.5 py-1 rounded bg-accent text-zinc-950 hover:bg-accent-hover text-[11px] font-medium flex items-center gap-1 transition-colors shadow-sm cursor-pointer font-sans"
                              title="Inspect with Reflective Card"
                            >
                              <Eye size={12} />
                              <span>Inspect</span>
                            </button>
                            {item.cert.verificationUrl && (
                              <a
                                href={item.cert.verificationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 rounded bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-colors"
                                title="Public Verification Registry"
                              >
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {filteredCertificates.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => {
                    setActiveCert(cert);
                    setIsZoomed(false);
                    setInspectTab('reflective');
                  }}
                  className="group bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-base hover:-translate-y-0.5 hover:shadow-md cursor-pointer font-sans"
                >
                  {/* Image Preview with overlay badge */}
                  <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden border-b border-zinc-800/80">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-slow"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/10 text-accent font-semibold">
                        {cert.issuer}
                      </span>
                    </div>

                    <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-zinc-300 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/5 font-sans">
                      <Calendar size={10} />
                      <span>{cert.date}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="text-xs font-semibold text-zinc-100 line-clamp-1 group-hover:text-accent transition-colors font-sans">
                        {cert.title}
                      </h3>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                        {cert.description}
                      </p>
                    </div>

                    {/* Skill Tags */}
                    <div className="pt-2 flex flex-wrap gap-1">
                      {cert.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-1.5 py-0.5 text-[9px] font-sans rounded bg-zinc-800/60 text-zinc-300 border border-zinc-700/60"
                        >
                          {skill}
                        </span>
                      ))}
                      {cert.skills.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[9px] font-sans text-zinc-400">
                          +{cert.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Full-Screen Certificate Modal Reader with ReflectiveCard */}
        {activeCert && (
          <div
            className="fixed inset-0 z-modal bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-fadeIn select-none"
            onClick={() => setActiveCert(null)}
          >
            <div
              className="relative w-full max-w-4xl max-h-[94vh] bg-[#0A0A0A] border border-zinc-800 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden font-sans"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="h-14 px-5 bg-[#0A0A0A] border-b border-zinc-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                    <Award size={14} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xs sm:text-sm font-semibold text-zinc-100 truncate max-w-xs sm:max-w-md font-sans">
                      {activeCert.title}
                    </h2>
                    <span className="text-[10px] text-zinc-400 font-sans block">
                      {activeCert.issuer} • {activeCert.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Position Indicator */}
                  {filteredCertificates.length > 1 && activeCertIndex >= 0 && (
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
                      {activeCertIndex + 1} / {filteredCertificates.length}
                    </span>
                  )}

                  {/* Inspect Tab Toggle */}
                  <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs">
                    <button
                      onClick={() => setInspectTab('reflective')}
                      className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-sans ${
                        inspectTab === 'reflective'
                          ? 'bg-accent/20 text-accent font-medium'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <CreditCard size={13} />
                      <span className="hidden sm:inline">Reflective Card</span>
                    </button>
                    <button
                      onClick={() => setInspectTab('document')}
                      className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-sans ${
                        inspectTab === 'document'
                          ? 'bg-accent/20 text-accent font-medium'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <FileText size={13} />
                      <span className="hidden sm:inline">Document</span>
                    </button>
                  </div>

                  {inspectTab === 'document' && (
                    <button
                      onClick={() => setIsZoomed(!isZoomed)}
                      className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                      title={isZoomed ? 'Zoom Out' : 'Zoom In'}
                    >
                      {isZoomed ? <ZoomOut size={15} /> : <ZoomIn size={15} />}
                    </button>
                  )}

                  {activeCert.verificationUrl && (
                    <a
                      href={activeCert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs text-zinc-200 flex items-center gap-1.5 transition-colors font-sans"
                    >
                      <span>Verify</span>
                      <ExternalLink size={12} />
                    </a>
                  )}

                  <button
                    onClick={() => setActiveCert(null)}
                    className="p-1.5 rounded-md hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer ml-1"
                    title="Close Modal (Esc)"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Modal Viewport: ReflectiveCard vs Document with Cursor Swipe Gestures */}
              <div
                className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-[#0A0A0A] relative"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
              >
                {/* Floating Carousel Navigation Buttons */}
                {filteredCertificates.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrevCert();
                      }}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-zinc-900/85 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 backdrop-blur-md shadow-2xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                      title="Previous Certificate (Left Arrow or Swipe Right)"
                      aria-label="Previous Certificate"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNextCert();
                      }}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-zinc-900/85 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 backdrop-blur-md shadow-2xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                      title="Next Certificate (Right Arrow or Swipe Left)"
                      aria-label="Next Certificate"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {inspectTab === 'reflective' ? (
                  <div className="w-full flex flex-col items-center justify-center py-2 animate-fadeIn">
                    <ReflectiveCard
                      name={activeCert.title}
                      role={`${activeCert.issuer} — ${activeCert.category}`}
                      badge="Accredited"
                      status="Verified"
                      statusColor="#22c55e"
                      idLabel="CREDENTIAL ID"
                      idValue={activeCert.credentialId || `CERT-${activeCert.id.toUpperCase()}`}
                      image={activeCert.image}
                      imageFit="contain"
                      videoSrc="/assets/boot/boot.mp4"
                      theme="dark"
                      tint="#ffffff"
                      metalness={0.9}
                      roughness={0.25}
                      blurStrength={6}
                      shine={1.2}
                      glare={0.6}
                      width="min(680px, 92vw)"
                      height="min(460px, 60vh)"
                      radius={20}
                      enableTilt={true}
                      tiltStrength={14}
                    />
                    <div className="text-center pt-3">
                      <span className="text-[11px] font-sans text-zinc-400">
                        Interactive WebGL Card • Move cursor over card to reflect light • Swipe cursor or press ← / → to switch
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`transition-all duration-base cursor-zoom-in ${
                      isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 max-w-3xl'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  >
                    <img
                      src={activeCert.image}
                      alt={activeCert.title}
                      className="w-full h-auto object-contain rounded-lg shadow-2xl border border-white/10"
                    />
                  </div>
                )}
              </div>

              {/* Modal Metadata Drawer */}
              <div className="p-4 bg-[#0A0A0A] border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shrink-0 select-text font-sans">
                <div className="space-y-1">
                  <div className="text-[11px] text-zinc-400 font-sans">
                    {activeCert.description}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeCert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 text-[10px] font-sans rounded bg-zinc-900 border border-zinc-800 text-accent font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {activeCert.credentialId && (
                  <div className="text-[11px] font-sans text-zinc-400 sm:text-right shrink-0">
                    <span className="text-[9px] uppercase tracking-wider block font-sans">Credential ID</span>
                    <span className="text-zinc-200 font-semibold font-sans">{activeCert.credentialId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppFrame>
  );
}

