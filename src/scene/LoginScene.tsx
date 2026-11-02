'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { useOSStore } from '@/os/window-manager/store';
import { profile } from '@/content/profile';

interface LoginSceneProps {
  onHandoffComplete: () => void;
}

export function LoginScene({ onHandoffComplete }: LoginSceneProps) {
  const { login } = useOSStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const monitorDomRef = useRef<HTMLDivElement>(null);

  const [visitorName, setVisitorName] = useState('');
  const [password, setPassword] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      setDateStr(now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerLogin = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
  };

  useEffect(() => {
    const container = containerRef.current;
    const monitorDom = monitorDomRef.current;
    if (!container || !monitorDom) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0d0e);

    const cssScene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const startCamPos = new THREE.Vector3(0, 1.15, 3.2);
    const targetCamPos = new THREE.Vector3(0, 1.05, 0.72); // Dolly destination right at monitor
    camera.position.copy(startCamPos);
    camera.lookAt(0, 1.05, 0);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. CSS3D Renderer (For DOM on monitor)
    const cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(width, height);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = '0';
    cssRenderer.domElement.style.left = '0';
    cssRenderer.domElement.style.pointerEvents = 'auto';
    container.appendChild(cssRenderer.domElement);

    // 5. Build Procedural Desk Scene (Code primitives only, PRD Sec 2 & 5)
    // Desk Surface
    const deskGeo = new THREE.BoxGeometry(7, 0.15, 3.5);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x141618,
      roughness: 0.8,
      metalness: 0.1,
    });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, -0.075, 0);
    desk.receiveShadow = true;
    scene.add(desk);

    // Monitor Stand Base & Stem
    const standBaseGeo = new THREE.BoxGeometry(0.8, 0.04, 0.6);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x1c1f23, roughness: 0.5, metalness: 0.6 });
    const standBase = new THREE.Mesh(standBaseGeo, standMat);
    standBase.position.set(0, 0.02, -0.1);
    scene.add(standBase);

    const standStemGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.1, 16);
    const standStem = new THREE.Mesh(standStemGeo, standMat);
    standStem.position.set(0, 0.55, -0.1);
    scene.add(standStem);

    // Monitor Frame / Bezel
    const monitorFrameGeo = new THREE.BoxGeometry(3.2, 2.05, 0.06);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1a1d20, roughness: 0.6, metalness: 0.3 });
    const monitorFrame = new THREE.Mesh(monitorFrameGeo, frameMat);
    monitorFrame.position.set(0, 1.05, 0);
    monitorFrame.castShadow = true;
    scene.add(monitorFrame);

    // Keyboard Bed
    const kbGeo = new THREE.BoxGeometry(1.6, 0.04, 0.55);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x1c1f23, roughness: 0.7, metalness: 0.2 });
    const keyboard = new THREE.Mesh(kbGeo, kbMat);
    keyboard.position.set(0, 0.02, 1.0);
    keyboard.receiveShadow = true;
    scene.add(keyboard);

    // Mouse
    const mouseGeo = new THREE.BoxGeometry(0.24, 0.05, 0.4);
    const mouseMat = new THREE.MeshStandardMaterial({ color: 0x1c1f23, roughness: 0.5, metalness: 0.4 });
    const mouse = new THREE.Mesh(mouseGeo, mouseMat);
    mouse.position.set(1.2, 0.025, 0.95);
    mouse.receiveShadow = true;
    scene.add(mouse);

    // 6. CSS3D Object for Monitor Screen
    monitorDom.style.display = 'block';
    const cssObject = new CSS3DObject(monitorDom);
    cssObject.position.set(0, 1.05, 0.035);
    cssObject.scale.set(0.0031, 0.0031, 0.0031);
    cssScene.add(cssObject);

    // 7. Motivated Lighting
    const keyLight = new THREE.DirectionalLight(0xededee, 0.6);
    keyLight.position.set(2, 4, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const ambientLight = new THREE.AmbientLight(0x111315, 0.5);
    scene.add(ambientLight);

    // Screen Glow Point Light (Illuminates desk, keyboard, mouse)
    const screenGlow = new THREE.PointLight(0xe58b24, 1.2, 4.0);
    screenGlow.position.set(0, 1.1, 0.3);
    scene.add(screenGlow);

    // 8. Interaction & Parallax
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const normX = (e.clientX / width - 0.5) * 2;
      const normY = (e.clientY / height - 0.5) * 2;
      targetParallaxX = normX * 0.08;
      targetParallaxY = -normY * 0.05;
    };

    window.addEventListener('pointermove', handlePointerMove);

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      cssRenderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop & Dolly Timeline
    let animationFrameId: number;
    let transitionStartTime: number | null = null;
    const TRANSITION_DURATION = 1200; // 1200ms per tokens

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      if (isTransitioning) {
        if (!transitionStartTime) transitionStartTime = time;
        const elapsed = time - transitionStartTime;
        const progress = Math.min(1, elapsed / TRANSITION_DURATION);

        // Ease-enter deceleration curve: cubic-bezier(0.16, 1, 0.3, 1)
        const t = progress;
        const eased = 1 - Math.pow(1 - t, 3);

        camera.position.lerpVectors(startCamPos, targetCamPos, eased);
        camera.lookAt(0, 1.05, 0);

        if (progress >= 1) {
          // Transition complete: trigger login and handoff
          login(visitorName);
          cancelAnimationFrame(animationFrameId);
          dispose();
          onHandoffComplete();
          return;
        }
      } else {
        // Subtle idle drift damping
        currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
        currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;

        camera.position.x = startCamPos.x + currentParallaxX;
        camera.position.y = startCamPos.y + currentParallaxY;
        camera.lookAt(0, 1.05, 0);
      }

      renderer.render(scene, camera);
      cssRenderer.render(cssScene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 11. Complete WebGL & GPU Disposal (PRD Sec 5.4 strictly enforced)
    const dispose = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      // Traverse and dispose all geometries & materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      renderer.forceContextLoss();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      if (cssRenderer.domElement && cssRenderer.domElement.parentNode) {
        cssRenderer.domElement.parentNode.removeChild(cssRenderer.domElement);
      }
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
      dispose();
    };
  }, [isTransitioning, login, visitorName, onHandoffComplete]);

  return (
    <div className="fixed inset-0 z-modal bg-surface-canvas overflow-hidden select-none font-sans">
      {/* 3D Canvas & CSS3D Container */}
      <div ref={containerRef} className="w-full h-full relative" />

      {/* Top Header / Skip Intro Button */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-50 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          <span className="font-display font-bold text-sm tracking-tight text-content-primary">
            RUDAR OS &bull; 3D WORKSPACE
          </span>
        </div>
        <button
          onClick={() => {
            login(visitorName);
            onHandoffComplete();
          }}
          className="px-3 py-1.5 rounded-sm bg-surface-base/80 backdrop-blur-md border border-border-default hover:border-accent text-xs font-mono text-content-secondary hover:text-content-primary transition-colors duration-instant"
        >
          Skip intro to desktop &rarr;
        </button>
      </div>

      {/* Real DOM Element Projected on 3D Monitor (CSS3D) */}
      <div
        ref={monitorDomRef}
        style={{ width: '960px', height: '620px', display: 'none' }}
        className="bg-surface-base text-content-primary p-8 flex flex-col items-center justify-between border border-border-strong rounded-lg shadow-window select-text"
      >
        {/* Top Info */}
        <div className="w-full flex items-center justify-between text-xs font-mono text-content-tertiary">
          <span>RUDAR OS WORKSTATION</span>
          <span>{dateStr || 'Verified Profile'}</span>
        </div>

        {/* Center Machine Owner & Simulated Form */}
        <div className="flex flex-col items-center space-y-6 max-w-sm w-full text-center">
          <div className="space-y-1">
            <div className="font-display font-bold text-5xl tracking-tight text-content-primary">
              {timeStr || '12:00'}
            </div>
            <div className="text-xs font-mono text-content-secondary uppercase">
              {profile.name} &bull; Flutter Developer
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              triggerLogin();
            }}
            className="w-full space-y-3"
          >
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-mono text-content-secondary">Who&apos;s visiting?</label>
              <input
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="Guest (or your name)"
                className="w-full px-3 py-1.5 rounded-sm bg-surface-panel border border-border-default text-xs text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[11px] font-mono text-content-secondary">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full px-3 py-1.5 rounded-sm bg-surface-panel border border-border-default text-xs text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
              <p className="text-[10px] text-content-tertiary italic">
                Any password works. Please don&apos;t type a real one.
              </p>
            </div>

            <button
              type="submit"
              disabled={isTransitioning}
              className="w-full py-2 px-4 rounded-sm bg-accent hover:bg-accent-hover text-surface-canvas text-xs font-semibold uppercase tracking-wider transition-colors duration-instant mt-2 flex items-center justify-center gap-2"
            >
              {isTransitioning ? (
                <>
                  <span className="w-3 h-3 border-2 border-surface-canvas border-t-transparent rounded-full animate-spin" />
                  <span>Entering Desktop...</span>
                </>
              ) : (
                <span>Log In &bull; Push to Desktop &rarr;</span>
              )}
            </button>
          </form>
        </div>

        {/* Bottom Specs */}
        <div className="text-[10px] font-mono text-content-tertiary">
          Delhi AI Grand Hackathon Top 140 &bull; WebGL2 Scene
        </div>
      </div>
    </div>
  );
}
