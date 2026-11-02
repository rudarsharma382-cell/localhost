'use client';

import React, { useRef, useState, useCallback } from 'react';
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

  const [isHovered, setIsHovered] = useState(false);

  // Drag handling with pointer capture
  const onPointerDownTitle = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Don't drag if clicking buttons
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
    return null; // Minimized windows are represented in dock
  }

  const AppComponent = app ? app.component : null;

  return (
    <div
      ref={windowRef}
      onMouseDown={() => focusWindow(win.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: `translate3d(${win.x}px, ${win.y}px, 0)`,
        width: `${win.w}px`,
        height: `${win.h}px`,
        zIndex: win.z,
      }}
      className={`fixed top-0 left-0 flex flex-col rounded-lg overflow-hidden select-none transition-shadow duration-instant will-change-transform ${
        win.focused
          ? 'bg-surface-base border border-border-strong shadow-window-active ring-1 ring-accent/25'
          : 'bg-surface-base/90 border border-border-subtle shadow-base'
      } ${win.maximized ? 'rounded-none' : ''}`}
      role="dialog"
      aria-labelledby={`window-title-${win.id}`}
      aria-modal="false"
    >
      {/* Window Title Bar */}
      <div
        onPointerDown={onPointerDownTitle}
        onPointerMove={onPointerMoveTitle}
        onPointerUp={onPointerUpTitle}
        onDoubleClick={() => toggleMaximizeWindow(win.id)}
        className={`h-[38px] px-3.5 flex items-center justify-between border-b cursor-grab active:cursor-grabbing select-none transition-colors duration-instant ${
          win.focused
            ? 'bg-surface-base border-border-subtle'
            : 'bg-surface-base/70 border-border-subtle/50'
        }`}
      >
        {/* Left: Tactile Window Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5" role="group" aria-label="Window Controls">
            {/* Close */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(win.id);
              }}
              aria-label={`Close ${win.title}`}
              className="w-3 h-3 rounded-full bg-semantic-error/90 hover:bg-semantic-error flex items-center justify-center text-[8px] text-surface-canvas font-bold cursor-pointer transition-colors duration-instant focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {isHovered && <span>&times;</span>}
            </button>
            {/* Minimize */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                minimizeWindow(win.id);
              }}
              aria-label={`Minimize ${win.title}`}
              className="w-3 h-3 rounded-full bg-semantic-warning/90 hover:bg-semantic-warning flex items-center justify-center text-[8px] text-surface-canvas font-bold cursor-pointer transition-colors duration-instant focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {isHovered && <span>&minus;</span>}
            </button>
            {/* Maximize */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMaximizeWindow(win.id);
              }}
              aria-label={`Maximize or Restore ${win.title}`}
              className="w-3 h-3 rounded-full bg-semantic-success/90 hover:bg-semantic-success flex items-center justify-center text-[8px] text-surface-canvas font-bold cursor-pointer transition-colors duration-instant focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {isHovered && <span>+</span>}
            </button>
          </div>

          <div className="flex items-center gap-1.5 ml-2.5">
            <AppIcon id={win.appId} size={14} className="opacity-80" />
            <span
              id={`window-title-${win.id}`}
              className={`text-xs font-sans font-medium truncate max-w-[240px] ${
                win.focused ? 'text-content-primary' : 'text-content-tertiary'
              }`}
            >
              {win.title}
            </span>
          </div>
        </div>

        {/* Right Status Indicator */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          {win.focused ? (
            <span className="text-accent text-[10px] tracking-wider uppercase opacity-75">Active</span>
          ) : (
            <span className="text-content-tertiary/60 text-[10px]">Inactive</span>
          )}
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-auto bg-surface-panel relative">
        {AppComponent ? (
          <AppComponent windowId={win.id} />
        ) : (
          <div className="p-6 text-content-secondary text-sm">Application not loaded.</div>
        )}
      </div>

      {/* Resize Handles (Only if resizable and not maximized) */}
      {app?.resizable && !win.maximized && (
        <>
          <div
            onPointerDown={(e) => onResizePointerDown(e, 'e')}
            className="absolute top-0 right-0 w-2 h-full cursor-e-resize"
          />
          <div
            onPointerDown={(e) => onResizePointerDown(e, 's')}
            className="absolute bottom-0 left-0 w-full h-2 cursor-s-resize"
          />
          <div
            onPointerDown={(e) => onResizePointerDown(e, 'se')}
            className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-10"
          />
          <div
            onPointerDown={(e) => onResizePointerDown(e, 'w')}
            className="absolute top-0 left-0 w-2 h-full cursor-w-resize"
          />
          <div
            onPointerDown={(e) => onResizePointerDown(e, 'sw')}
            className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-10"
          />
        </>
      )}
    </div>
  );
}

