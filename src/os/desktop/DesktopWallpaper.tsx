'use client';

import React, { useState, useEffect } from 'react';

export function DesktopWallpaper() {
  const [dayStr, setDayStr] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDayStr(now.toLocaleDateString([], { weekday: 'long' }).toUpperCase());
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setDateStr(
        now.toLocaleDateString([], {
          day: 'numeric',
          month: 'long',
        }).toUpperCase()
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      {/* 1. Official High-Resolution BMW M4 GT4 EVO Wallpaper */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url('/assets/wallpaper.jpg')`,
        }}
      />

      {/* 2. Primary Day Widget in Anurati Font */}
      <div className="absolute top-2 sm:top-3 md:top-4 left-1/2 -translate-x-1/2 w-full px-4 flex flex-col items-center pointer-events-none select-none text-center z-[2]">
        {/* PRIMARY: Day of the Week in Futuristic Anurati Typography */}
        <h1
          style={{
            textShadow: '0 4px 30px rgba(0,0,0,0.98), 0 2px 10px rgba(0,0,0,0.95)',
            fontFamily: "'Anurati', sans-serif",
            letterSpacing: '0.14em',
          }}
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white uppercase leading-none select-none drop-shadow-2xl truncate max-w-full"
        >
          {dayStr || 'WEDNESDAY'}
        </h1>

        {/* SECONDARY: Crisp White Time and Date floating cleanly above the windshield */}
        <div
          style={{
            textShadow: '0 2px 14px rgba(0,0,0,0.98)',
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            letterSpacing: '0.15em',
          }}
          className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-sm md:text-base font-semibold text-white/95 mt-1 sm:mt-1.5 uppercase"
        >
          <span>{timeStr || '--:--'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
          <span>{dateStr}</span>
        </div>
      </div>
    </div>
  );
}

export default DesktopWallpaper;
