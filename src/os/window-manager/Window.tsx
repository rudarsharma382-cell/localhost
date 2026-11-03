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
        transform: `translate3d(${win.x}px, ${win.y}px, 0)`,
        width: `${win.w}px`,
        height: `${win.h}px`,
        zIndex: win.z,
      }}
      className={`fixed top-0 left-0 flex flex-col rounded-xl overflow-hidden select-none transition-all duration-instant will-change-transform ${
        win.focused
          ? 'bg-[#121316] border border-[#DDA0DD]/35 shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(221,160,221,0.12)] ring-1 ring-[#DDA0DD]/20'
          : 'bg-[#121316]/95 border border-zinc-800/80 shadow-[0_10px_25px_rgba(0,0,0,0.5)]'
      } ${win.maximized ? 'rounded-none' : ''}`}
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
        {/* Left: macOS Window Controls (Traffic Lights) */}
        <div className="flex items-center space-x-2" role="group" aria-label="Window Controls">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
            aria-label={`Close ${win.title}`}
            className="w-3 h-3 bg-red-400 hover:bg-red-500 rounded-full transition-colors cursor-pointer border-0 p-0 focus:outline-none"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
            aria-label={`Minimize ${win.title}`}
            className="w-3 h-3 bg-yellow-400 hover:bg-yellow-500 rounded-full transition-colors cursor-pointer border-0 p-0 focus:outline-none"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximizeWindow(win.id);
            }}
            aria-label={`Maximize ${win.title}`}
            className="w-3 h-3 bg-green-500 hover:bg-green-600 rounded-full transition-colors cursor-pointer border-0 p-0 focus:outline-none"
          />
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

        {/* Right: Balanced Spacer */}
        <div className="w-12 flex justify-end">
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
