'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AppIcon, AppIconId } from '@/components/icons/AppIcons';

// Types for the component
export interface DockApp {
  id: string;
  name: string;
  icon: string;
}

export interface MacOSDockProps {
  apps: DockApp[];
  onAppClick: (appId: string) => void;
  openApps?: string[];
  className?: string;
}

export const MacOSDock: React.FC<MacOSDockProps> = ({ 
  apps, 
  onAppClick, 
  openApps = [],
  className = ''
}) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [currentScales, setCurrentScales] = useState<number[]>(apps.map(() => 1));
  const [currentPositions, setCurrentPositions] = useState<number[]>([]);
  const dockRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastMouseMoveTime = useRef<number>(0);

  // Responsive size calculations based on viewport
  const getResponsiveConfig = useCallback(() => {
    if (typeof window === 'undefined') {
      return { baseIconSize: 56, maxScale: 1.6, effectWidth: 240 };
    }

    const winW = window.innerWidth;
    const numApps = apps.length || 11;
    const maxAvailable = winW - 24;
    // Calculate size needed so all apps fit comfortably without clipping
    const fittedSize = Math.floor((maxAvailable - 16) / numApps) - 3;

    if (winW < 540) {
      // Mobile phones: dynamically fit all dock apps perfectly on screen
      const dynamicSize = Math.max(26, Math.min(36, fittedSize));
      return {
        baseIconSize: dynamicSize,
        maxScale: 1.2,
        effectWidth: 120,
      };
    } else if (winW < 768) {
      // Small tablets
      const dynamicSize = Math.max(34, Math.min(46, fittedSize));
      return {
        baseIconSize: dynamicSize,
        maxScale: 1.4,
        effectWidth: 180,
      };
    } else if (winW < 1024) {
      // Tablets and small laptops
      return {
        baseIconSize: 48,
        maxScale: 1.55,
        effectWidth: 240,
      };
    } else {
      // Desktop and large screens
      return {
        baseIconSize: 56,
        maxScale: 1.75,
        effectWidth: 280,
      };
    }
  }, [apps.length]);

  const [config, setConfig] = useState(getResponsiveConfig);
  const { baseIconSize, maxScale, effectWidth } = config;
  const minScale = 1.0;
  const baseSpacing = Math.max(4, baseIconSize * 0.08);

  // Update config on window resize
  useEffect(() => {
    const handleResize = () => {
      setConfig(getResponsiveConfig());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getResponsiveConfig]);

  // Authentic macOS cosine-based magnification algorithm
  const calculateTargetMagnification = useCallback((mousePosition: number | null) => {
    if (mousePosition === null) {
      return apps.map(() => minScale);
    }

    return apps.map((_, index) => {
      const normalIconCenter = (index * (baseIconSize + baseSpacing)) + (baseIconSize / 2);
      const minX = mousePosition - (effectWidth / 2);
      const maxX = mousePosition + (effectWidth / 2);
      
      if (normalIconCenter < minX || normalIconCenter > maxX) {
        return minScale;
      }
      
      const theta = ((normalIconCenter - minX) / effectWidth) * 2 * Math.PI;
      const cappedTheta = Math.min(Math.max(theta, 0), 2 * Math.PI);
      const scaleFactor = (1 - Math.cos(cappedTheta)) / 2;
      
      return minScale + (scaleFactor * (maxScale - minScale));
    });
  }, [apps, baseIconSize, baseSpacing, effectWidth, maxScale, minScale]);

  // Calculate positions based on current scales
  const calculatePositions = useCallback((scales: number[]) => {
    let currentX = 0;
    
    return scales.map((scale) => {
      const scaledWidth = baseIconSize * scale;
      const centerX = currentX + (scaledWidth / 2);
      currentX += scaledWidth + baseSpacing;
      return centerX;
    });
  }, [baseIconSize, baseSpacing]);

  // Initialize positions
  useEffect(() => {
    const initialScales = apps.map(() => minScale);
    const initialPositions = calculatePositions(initialScales);
    setCurrentScales(initialScales);
    setCurrentPositions(initialPositions);
  }, [apps, calculatePositions, minScale, config]);

  // Animation loop
  const animateToTarget = useCallback(() => {
    const targetScales = calculateTargetMagnification(mouseX);
    const targetPositions = calculatePositions(targetScales);
    const lerpFactor = mouseX !== null ? 0.2 : 0.12;

    setCurrentScales(prevScales => {
      return prevScales.map((currentScale, index) => {
        const diff = targetScales[index] - currentScale;
        return currentScale + (diff * lerpFactor);
      });
    });

    setCurrentPositions(prevPositions => {
      return prevPositions.map((currentPos, index) => {
        const diff = targetPositions[index] - currentPos;
        return currentPos + (diff * lerpFactor);
      });
    });

    const scalesNeedUpdate = currentScales.some((scale, index) => 
      Math.abs(scale - targetScales[index]) > 0.002
    );
    const positionsNeedUpdate = currentPositions.some((pos, index) => 
      Math.abs(pos - targetPositions[index]) > 0.1
    );
    
    if (scalesNeedUpdate || positionsNeedUpdate || mouseX !== null) {
      animationFrameRef.current = requestAnimationFrame(animateToTarget);
    }
  }, [mouseX, calculateTargetMagnification, calculatePositions, currentScales, currentPositions]);

  // Start/stop animation loop
  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animateToTarget);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animateToTarget]);

  // Throttled mouse movement handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const now = performance.now();
    
    if (now - lastMouseMoveTime.current < 16) {
      return;
    }
    
    lastMouseMoveTime.current = now;
    
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      const padding = Math.max(8, baseIconSize * 0.12);
      setMouseX(e.clientX - rect.left - padding);
    }
  }, [baseIconSize]);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  const createBounceAnimation = (element: HTMLElement) => {
    const bounceHeight = Math.max(-8, -baseIconSize * 0.15);
    element.style.transition = 'transform 0.2s ease-out';
    element.style.transform = `translateY(${bounceHeight}px)`;
    
    setTimeout(() => {
      element.style.transform = 'translateY(0px)';
    }, 200);
  };

  const handleAppClick = (appId: string, index: number) => {
    if (iconRefs.current[index]) {
      if (typeof window !== 'undefined' && (window as any).gsap) {
        const gsap = (window as any).gsap;
        const bounceHeight = currentScales[index] > 1.3 ? -baseIconSize * 0.2 : -baseIconSize * 0.15;
        
        gsap.to(iconRefs.current[index], {
          y: bounceHeight,
          duration: 0.2,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
          transformOrigin: 'bottom center'
        });
      } else {
        createBounceAnimation(iconRefs.current[index]!);
      }
    }
    
    onAppClick(appId);
  };

  // Calculate content width
  const contentWidth = currentPositions.length > 0 
    ? Math.max(...currentPositions.map((pos, index) => 
        pos + (baseIconSize * currentScales[index]) / 2
      ))
    : (apps.length * (baseIconSize + baseSpacing)) - baseSpacing;

  const padding = Math.max(8, baseIconSize * 0.12);

  return (
    <div 
      className="relative flex flex-col items-center justify-end overflow-visible pointer-events-auto"
      style={{
        paddingTop: `${Math.ceil((maxScale - 1) * baseIconSize + 16)}px`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={dockRef}
        className={`backdrop-blur-xl ${className} overflow-visible relative`}
        style={{
          width: `${contentWidth + padding * 2}px`,
          background: 'rgba(16, 16, 20, 0.76)',
          borderRadius: `${Math.max(14, baseIconSize * 0.38)}px`,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: `
            0 ${Math.max(4, baseIconSize * 0.1)}px ${Math.max(16, baseIconSize * 0.4)}px rgba(0, 0, 0, 0.6),
            0 ${Math.max(2, baseIconSize * 0.05)}px ${Math.max(8, baseIconSize * 0.2)}px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(0, 0, 0, 0.3)
          `,
          padding: `${padding}px`,
          overflow: 'visible'
        }}
      >
        <div 
          className="relative overflow-visible"
          style={{
            height: `${baseIconSize}px`,
            width: '100%',
            overflow: 'visible'
          }}
        >
          {apps.map((app, index) => {
            const scale = currentScales[index];
            const position = currentPositions[index] || 0;
            const scaledSize = baseIconSize * scale;
            
            return (
              <div
                key={app.id}
                ref={(el) => { iconRefs.current[index] = el; }}
                className="absolute cursor-pointer flex flex-col items-center justify-end overflow-visible"
                title={app.name}
                onClick={() => handleAppClick(app.id, index)}
                style={{
                  left: `${position - scaledSize / 2}px`,
                  bottom: '0px',
                  width: `${scaledSize}px`,
                  height: `${scaledSize}px`,
                  transformOrigin: 'bottom center',
                  zIndex: Math.round(scale * 10),
                  overflow: 'visible'
                }}
              >
                {/* macOS-style Tooltip on Hover */}
                {scale > 1.35 && (
                  <div 
                    className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-md text-[11px] font-sans font-medium text-white/95 bg-[#181a1d]/90 backdrop-blur-md border border-white/15 shadow-xl whitespace-nowrap pointer-events-none select-none z-50 transition-opacity duration-150"
                    style={{ opacity: Math.min(1, (scale - 1.35) * 4) }}
                  >
                    {app.name}
                  </div>
                )}

                {app.icon ? (
                  <img
                    src={app.icon}
                    alt={app.name}
                    width={scaledSize}
                    height={scaledSize}
                    className="w-full h-full object-cover shadow-md border border-white/10 select-none pointer-events-none"
                    style={{
                      borderRadius: `${Math.round(scaledSize * 0.22)}px`,
                      filter: `drop-shadow(0 ${scale > 1.1 ? Math.round(scale * 4) : 2}px ${scale > 1.1 ? Math.round(scale * 8) : 4}px rgba(0,0,0,${0.35 + (scale - 1) * 0.25}))`
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: `${scaledSize}px`,
                      height: `${scaledSize}px`,
                      borderRadius: `${Math.round(scaledSize * 0.22)}px`,
                      filter: `drop-shadow(0 ${scale > 1.1 ? Math.round(scale * 4) : 2}px ${scale > 1.1 ? Math.round(scale * 8) : 4}px rgba(0,0,0,${0.35 + (scale - 1) * 0.25}))`
                    }}
                    className="flex items-center justify-center select-none pointer-events-none"
                  >
                    <AppIcon id={app.id as AppIconId} size={scaledSize} />
                  </div>
                )}
                
                {/* Clean Crisp White Indicator Dot */}
                {openApps.includes(app.id) && (
                  <div 
                    className="absolute pointer-events-none"
                    style={{
                      bottom: `${Math.max(-4, -baseIconSize * 0.08)}px`,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: `${Math.max(4, baseIconSize * 0.07)}px`,
                      height: `${Math.max(4, baseIconSize * 0.07)}px`,
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 0 6px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.4)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MacOSDock;
