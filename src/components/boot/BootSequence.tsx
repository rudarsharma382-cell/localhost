'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  // Complete and trigger smooth fade-out
  const handleFinish = useCallback(() => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      setIsMounted(false);
      onComplete();
    }, 750);
  }, [isFading, onComplete]);

  // Failsafe timeout: never stay stuck on boot video if user is on slow connection
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFinish();
    }, 12000);
    return () => clearTimeout(timer);
  }, [handleFinish]);

  // Attempt autoplay with sound, fall back to muted if policy blocks
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Audio played successfully
        })
        .catch(() => {
          // Autoplay with audio was blocked by browser policy; fallback to muted
          video.muted = true;
          video.play().catch((err) => {
            console.warn('Video autoplay failed:', err);
            handleFinish();
          });
        });
    }
  }, [handleFinish]);

  // Update progress bar
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    setProgress(Math.min(100, pct));
  };

  // Keyboard shortcut listener (Escape or Space or Enter to skip)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish]);

  if (!isMounted) return null;

  return (
    <div
      onClick={() => {
        // If user clicks anywhere while muted, unmute audio
        if (videoRef.current && videoRef.current.muted) {
          videoRef.current.muted = false;
        }
      }}
      className={`fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center select-none transition-opacity duration-700 ease-out cursor-pointer ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 1080p Boot Video */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleFinish}
        onError={handleFinish}
        className="w-full h-full object-cover pointer-events-none"
      >
        <source src="/assets/boot/boot.mp4" type="video/mp4" />
      </video>

      {/* Subtle Cinematic Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/40" />

      {/* Bottom HUD: Minimal Progress Bar & Asset Warm-up Indicator */}
      <div className="absolute bottom-6 left-8 right-8 max-w-xl mx-auto flex flex-col items-center space-y-2 text-center pointer-events-none">
        <div className="flex items-center justify-between w-full text-[11px] font-mono text-zinc-400 px-1">
          <span className="tracking-widest uppercase text-zinc-300">
            {progress < 40
              ? 'Loading 3D Hardware & Textures...'
              : progress < 85
              ? 'Compiling WebGL Shaders & Studio Lights...'
              : 'Workstation Ready // Handing off...'}
          </span>
          <span className="font-semibold text-white">{Math.round(progress)}%</span>
        </div>

        {/* Glow Progress Track */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 relative">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-400 rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(129,140,248,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default BootSequence;
