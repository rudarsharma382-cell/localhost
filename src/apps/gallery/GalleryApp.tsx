'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { galleryItems } from '@/content/gallery';
import { GalleryItem, GalleryAlbum } from '@/content/schema';
import {
  Image as ImageIcon,
  Film,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  MapPin,
  Tag,
  Cpu,
  Search,
  Sparkles,
} from 'lucide-react';

interface GalleryAppProps {
  windowId: string;
}

const ALBUMS: ('All' | GalleryAlbum)[] = [
  'All',
  'Robotics & Hardware',
  'Hackathons & Summits',
  'Workshops & Labs',
  'Behind The Scenes',
];

export default function GalleryApp({ windowId }: GalleryAppProps) {
  const { closeWindow } = useOSStore();
  const [selectedAlbum, setSelectedAlbum] = useState<'All' | GalleryAlbum>('All');
  const [search, setSearch] = useState('');
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  // Filter items
  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchesAlbum = selectedAlbum === 'All' || item.album === selectedAlbum;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.caption.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      return matchesAlbum && matchesSearch;
    });
  }, [selectedAlbum, search]);

  const activeItem = activeItemIndex !== null ? filteredItems[activeItemIndex] : null;

  // Keyboard navigation for full-screen viewer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeItemIndex === null) return;

      if (e.key === 'Escape') {
        setActiveItemIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveItemIndex((idx) => (idx !== null ? (idx + 1) % filteredItems.length : null));
      } else if (e.key === 'ArrowLeft') {
        setActiveItemIndex((idx) =>
          idx !== null ? (idx - 1 + filteredItems.length) % filteredItems.length : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItemIndex, filteredItems.length]);

  return (
    <AppFrame
      appId="gallery"
      title="Gallery.exe — Hardware, Robotics & Hackathon Archive"
      onBack={() => closeWindow(windowId)}
      headerActions={
        <div className="flex items-center gap-2 text-xs font-mono text-content-tertiary">
          <span>{galleryItems.length} Archive Media</span>
        </div>
      }
      className="flex-1"
    >
      <div className="h-full bg-surface-canvas flex flex-col font-sans select-none text-content-primary overflow-hidden relative">
        {/* Top Album Filter Bar */}
        <div className="p-4 bg-surface-base border-b border-border-default space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search archive media by title, tag, or rig..."
                className="w-full pl-9 pr-3 py-1.5 rounded bg-surface-panel border border-border-default focus:border-border-strong text-xs text-content-primary placeholder:text-content-tertiary focus:outline-none transition-colors select-text"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-primary text-xs"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="text-[11px] font-mono text-content-tertiary hidden sm:block">
              Excluding website UI screenshots • Physical engineering only
            </div>
          </div>

          {/* Album Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {ALBUMS.map((alb) => (
              <button
                key={alb}
                onClick={() => {
                  setSelectedAlbum(alb);
                  setActiveItemIndex(null);
                }}
                className={`px-3 py-1 rounded text-xs transition-colors shrink-0 cursor-pointer ${
                  selectedAlbum === alb
                    ? 'bg-accent/20 border border-accent/40 text-accent font-medium'
                    : 'bg-surface-panel border border-border-subtle hover:border-border-default text-content-secondary hover:text-content-primary'
                }`}
              >
                {alb}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid View */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {filteredItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-2 text-content-tertiary">
              <ImageIcon size={32} className="opacity-40" />
              <p className="text-xs">No media found matching your filter criteria.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedAlbum('All');
                }}
                className="text-xs text-accent hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setActiveItemIndex(idx)}
                  className="group bg-surface-base border border-border-subtle hover:border-border-strong rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-base hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                >
                  {/* Thumbnail Viewport */}
                  <div
                    className={`relative w-full bg-surface-panel overflow-hidden border-b border-border-subtle ${
                      item.aspectRatio === '16:9'
                        ? 'aspect-[16/9]'
                        : item.aspectRatio === '4:3'
                        ? 'aspect-[4/3]'
                        : 'aspect-square'
                    }`}
                  >
                    {item.mediaType === 'video' ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-black">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-slow opacity-80"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-accent/90 text-surface-canvas flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Film size={18} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-slow"
                        loading="lazy"
                      />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-canvas/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Album Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-base/80 backdrop-blur-md border border-white/10 text-content-primary">
                        {item.album}
                      </span>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute bottom-2 right-2 text-[10px] font-mono text-content-tertiary bg-surface-base/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/5">
                      {item.date}
                    </div>
                  </div>

                  {/* Caption & Metadata */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="text-xs font-semibold text-content-primary group-hover:text-accent transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-content-secondary line-clamp-2 leading-relaxed">
                        {item.caption}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-content-tertiary border-t border-border-subtle/60">
                      <span className="truncate max-w-[180px]">{item.location}</span>
                      <span className="text-accent uppercase">{item.mediaType}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Full-Screen Cinematic Media Viewer Modal */}
        {activeItem && (
          <div
            className="fixed inset-0 z-modal bg-surface-canvas/95 backdrop-blur-lg flex flex-col items-center justify-between p-4 md:p-6 animate-fadeIn"
            onClick={() => setActiveItemIndex(null)}
          >
            {/* Modal Header */}
            <div
              className="w-full max-w-5xl flex items-center justify-between text-xs text-content-primary px-2 py-1 shrink-0 select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-accent/20 text-accent border border-accent/30 font-semibold">
                  {activeItem.album}
                </span>
                <span className="text-xs font-semibold text-content-primary truncate max-w-md">
                  {activeItem.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-content-tertiary hidden sm:inline">
                  {activeItemIndex! + 1} / {filteredItems.length}
                </span>
                <button
                  onClick={() => setActiveItemIndex(null)}
                  className="p-1.5 rounded hover:bg-surface-raised text-content-secondary hover:text-content-primary transition-colors cursor-pointer"
                  title="Close Viewer (Esc)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Main Stage Viewport */}
            <div
              className="flex-1 w-full max-w-5xl flex items-center justify-center relative my-2 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              <button
                onClick={() =>
                  setActiveItemIndex(
                    (activeItemIndex! - 1 + filteredItems.length) % filteredItems.length
                  )
                }
                className="absolute left-2 z-10 p-2.5 rounded-full bg-surface-base/80 hover:bg-surface-panel text-content-secondary hover:text-content-primary transition-all border border-white/10 shadow-lg cursor-pointer"
                title="Previous Media (Left Arrow)"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Media Display */}
              <div className="max-h-[70vh] flex items-center justify-center">
                {activeItem.mediaType === 'video' ? (
                  <video
                    src={activeItem.src}
                    controls
                    autoPlay
                    loop
                    className="max-h-[68vh] max-w-full rounded-lg shadow-2xl border border-white/10"
                  />
                ) : (
                  <img
                    src={activeItem.src}
                    alt={activeItem.title}
                    className="max-h-[68vh] max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
                  />
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={() =>
                  setActiveItemIndex((activeItemIndex! + 1) % filteredItems.length)
                }
                className="absolute right-2 z-10 p-2.5 rounded-full bg-surface-base/80 hover:bg-surface-panel text-content-secondary hover:text-content-primary transition-all border border-white/10 shadow-lg cursor-pointer"
                title="Next Media (Right Arrow)"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Modal Bottom Metadata Drawer */}
            <div
              className="w-full max-w-5xl bg-surface-base/90 border border-border-default rounded-xl p-4 space-y-2 select-text font-sans shrink-0 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-2">
                <div className="flex items-center gap-3 text-xs text-content-secondary">
                  <span className="flex items-center gap-1 font-mono text-accent">
                    <MapPin size={12} />
                    <span>{activeItem.location}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono text-content-tertiary">
                    <Calendar size={12} />
                    <span>{activeItem.date}</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {activeItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-surface-panel border border-border-subtle text-content-tertiary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-content-secondary leading-relaxed">
                {activeItem.caption}
              </p>

              {activeItem.equipment && activeItem.equipment.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-content-tertiary pt-1">
                  <span className="text-accent">Hardware / Rig:</span>
                  {activeItem.equipment.map((eq) => (
                    <span key={eq} className="px-1.5 py-0.5 rounded bg-surface-panel border border-border-subtle">
                      {eq}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppFrame>
  );
}

