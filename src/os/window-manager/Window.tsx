'use client';

import React, { useRef, useCallback } from 'react';
import { WindowState, useOSStore } from './store';
import { appRegistry } from '@/os/registry';
import { AppIcon } from '@/components/icons/AppIcons';

interface WindowProps {
  window: WindowState;
}

export function Window({ window: win }: WindowProps) {
  const {
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useOSStore();

  const app = appRegistry[win.appId];
  const windowRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ isDragging: boolean; startX: number; startY: number; initX: number; initY: number }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
  });

  // Drag handling with pointer capture
  const onPointerDownTitle = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('button')) return;

      focusWindow(win.id);
      if (win.maximized) return;

      dragRef.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        initX: win.x,
        initY: win.y,
      };

      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [focusWindow, win.id, win.maximized, win.x, win.y]
  );

  const onPointerMoveTitle = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current.isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      updateWindowPosition(win.id, dragRef.current.initX + dx, dragRef.current.initY + dy);
    },
    [win.id, updateWindowPosition]
  );

  const onPointerUpTitle = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDragging) return;
    dragRef.current.isDragging = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  }, []);

  // Resize handling
  const onResizePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, direction: string) => {
      e.stopPropagation();
      focusWindow(win.id);
      if (win.maximized) return;

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = win.w;
      const startH = win.h;
      const startPosX = win.x;
      const startPosY = win.y;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        let newW = startW;
        let newH = startH;
        let newX = startPosX;
        let newY = startPosY;

        if (direction.includes('e')) newW = startW + dx;
        if (direction.includes('s')) newH = startH + dy;
        if (direction.includes('w')) {
          newW = startW - dx;
          newX = startPosX + dx;
        }
        if (direction.includes('n')) {
          newH = startH - dy;
          newY = startPosY + dy;
        }

        updateWindowSize(win.id, newW, newH, newX, newY);
      };

      const handlePointerUp = () => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    },
    [focusWindow, win.id, win.maximized, win.w, win.h, win.x, win.y, updateWindowSize]
  );

  if (win.minimized) {
    return null;
  }

  const AppComponent = app ? app.component : null;

  return (
    <div
      ref={windowRef}
      onMouseDown={() => focusWindow(win.id)}
      style={{
        transform: win.maximized ? 'translate3d(0, 0, 0)' : `translate3d(${win.x}px, ${win.y}px, 0)`,
        width: win.maximized ? '100vw' : `${win.w}px`,
        height: win.maximized ? '100vh' : `${win.h}px`,
        zIndex: win.maximized ? win.z + 50 : win.z,
      }}
      className={`fixed top-0 left-0 flex flex-col overflow-hidden select-none transition-all duration-instant will-change-transform ${
        win.maximized
          ? 'w-screen h-screen rounded-none border-0 shadow-2xl'
          : win.focused
          ? 'rounded-xl bg-[#121316] border border-[#DDA0DD]/35 shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(221,160,221,0.12)] ring-1 ring-[#DDA0DD]/20'
          : 'rounded-xl bg-[#121316]/95 border border-zinc-800/80 shadow-[0_10px_25px_rgba(0,0,0,0.5)]'
      }`}
      role="dialog"
      aria-labelledby={`window-title-${win.id}`}
      aria-modal="false"
    >
      {/* Safari-01 Obsidian Title Bar with macOS Traffic Light Controls */}
      <div
        onPointerDown={onPointerDownTitle}
        onPointerMove={onPointerMoveTitle}
        onPointerUp={onPointerUpTitle}
        onDoubleClick={() => toggleMaximizeWindow(win.id)}
        className={`h-9 px-3.5 flex items-center justify-between border-b cursor-grab active:cursor-grabbing select-none transition-colors duration-instant ${
          win.focused
            ? 'bg-[#1A1B22] border-zinc-800'
            : 'bg-[#16171D] border-zinc-800/60'
        }`}
      >
        {/* Left: macOS Window Controls (Traffic Lights with authentic hover marks) */}
        <div
          className="group/traffic flex items-center space-x-2 shrink-0"
          role="group"
          aria-label="Window Controls"
        >
          {/* Close - Red dot with black '✕' mark */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
            aria-label={`Close ${win.title}`}
            title="Close"
            className="w-3 h-3 bg-[#FF5F56] hover:bg-[#E0443E] rounded-full transition-all cursor-pointer border border-[#E0443E]/60 p-0 flex items-center justify-center focus:outline-none shadow-sm"
          >
            <svg
              className="opacity-0 group-hover/traffic:opacity-100 transition-opacity"
              width="6"
              height="6"
              viewBox="0 0 10 10"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" />
              <line x1="8.5" y1="1.5" x2="1.5" y2="8.5" />
            </svg>
          </button>

          {/* Minimize - Yellow dot with black '–' mark */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
            aria-label={`Minimize ${win.title}`}
            title="Minimize"
            className="w-3 h-3 bg-[#FFBD2E] hover:bg-[#DEA123] rounded-full transition-all cursor-pointer border border-[#DEA123]/60 p-0 flex items-center justify-center focus:outline-none shadow-sm"
          >
            <svg
              className="opacity-0 group-hover/traffic:opacity-100 transition-opacity"
              width="6"
              height="6"
              viewBox="0 0 10 10"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="1.5" y1="5" x2="8.5" y2="5" />
            </svg>
          </button>

          {/* Maximize / Full Space - Green dot with black diagonal arrows */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximizeWindow(win.id);
            }}
            aria-label={`Maximize ${win.title}`}
            title="Full Space / Maximize"
            className="w-3 h-3 bg-[#27C93F] hover:bg-[#1AAB29] rounded-full transition-all cursor-pointer border border-[#1AAB29]/60 p-0 flex items-center justify-center focus:outline-none shadow-sm"
          >
            <svg
              className="opacity-0 group-hover/traffic:opacity-100 transition-opacity"
              width="6"
              height="6"
              viewBox="0 0 10 10"
              fill="#000000"
            >
              <polygon points="0,0 4.5,0 0,4.5" />
              <polygon points="10,10 5.5,10 10,5.5" />
            </svg>
          </button>
        </div>

        {/* Center: Safari-01 Address / Title Pill */}
        <div className="flex-1 mx-4 max-w-sm h-6 bg-zinc-800/60 rounded-md border border-white/5 flex items-center justify-center px-3 gap-2">
          <AppIcon id={win.appId} size={13} className={win.focused ? 'text-[#DDA0DD]' : 'text-zinc-500'} />
          <span
            id={`window-title-${win.id}`}
            className={`text-xs font-sans font-medium truncate ${
              win.focused ? 'text-zinc-200' : 'text-zinc-400'
            }`}
          >
            {win.title}
          </span>
        </div>

        {/* Right: Focus Indicator (Full Space button removed per user request) */}
        <div className="flex items-center gap-2 shrink-0">
          {win.focused && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#DDA0DD] shadow-[0_0_6px_#DDA0DD]" />
          )}
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-auto bg-[#121316] relative">
        {AppComponent ? (
          <AppComponent windowId={win.id} />
        ) : (
          <div className="p-6 text-zinc-400 text-xs">Application unavailable.</div>
        )}
      </div>

      {/* Resize Handles */}
      {app?.resizable && !win.maximized && (
        <>
          <div onPointerDown={(e) => onResizePointerDown(e, 'e')} className="absolute top-0 right-0 w-2 h-full cursor-e-resize" />
          <div onPointerDown={(e) => onResizePointerDown(e, 's')} className="absolute bottom-0 left-0 w-full h-2 cursor-s-resize" />
          <div onPointerDown={(e) => onResizePointerDown(e, 'se')} className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-10" />
          <div onPointerDown={(e) => onResizePointerDown(e, 'w')} className="absolute top-0 left-0 w-2 h-full cursor-w-resize" />
          <div onPointerDown={(e) => onResizePointerDown(e, 'sw')} className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-10" />
        </>
      )}
    </div>
  );
}
