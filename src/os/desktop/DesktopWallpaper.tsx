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
      {/* 1. Official BMW M4 Wallpaper from Assets/wallpaper folder */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url('/assets/wallpaper/BMW M4 GTA.jpg')` }}
      />

      {/* 2. Clean Contrast Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/55 pointer-events-none" />

      {/* 3. Primary Day Widget with High-Contrast Constant Typography */}
      <div className="absolute top-2 sm:top-4 md:top-5 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none text-center z-[2]">
        {/* PRIMARY: Day of the Week as the dominant elevated focal point */}
        <h1
          style={{
            textShadow: '0 4px 28px rgba(0,0,0,0.98), 0 2px 8px rgba(0,0,0,0.98)',
          }}
          className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tight text-white uppercase leading-none select-none font-sans"
        >
          {dayStr || 'TUESDAY'}
        </h1>

        {/* SECONDARY: Crisp White Time and Date sitting well above the car hood */}
        <div
          style={{
            textShadow: '0 2px 12px rgba(0,0,0,0.98)',
          }}
          className="flex items-center gap-2.5 text-xs sm:text-sm md:text-base font-semibold tracking-[0.25em] text-white/90 mt-1 uppercase font-sans"
        >
          <span>{timeStr || '--:--'}</span>
          <span className="w-1 h-1 rounded-full bg-white/70" />
          <span>{dateStr}</span>
        </div>
      </div>
    </div>
  );
}

export default DesktopWallpaper;
