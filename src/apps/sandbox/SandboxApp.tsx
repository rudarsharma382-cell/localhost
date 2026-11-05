'use client';

import React, { useState, useRef, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { AppFrame } from '@/os/app-frame/AppFrame';
import { useOSStore } from '@/os/window-manager/store';
import { physicsPresets } from '@/content/physics';
import { PhysicsPreset } from '@/content/schema';
import CarShowroom from './CarShowroom';
import CarControls from './CarControls';
import {
  Car,
  Box,
  Atom,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Sparkles,
  Maximize2,
  Info,
  RefreshCw,
  Sun,
  Layers,
  Activity,
  Flame,
} from 'lucide-react';

interface SandboxAppProps {
  windowId: string;
}

// ---------------------------------------------------------------------------
// 1. 3D Configurator Mesh Component
// ---------------------------------------------------------------------------
interface ConfigurableMeshProps {
  geometryType: 'torusKnot' | 'icosahedron' | 'octahedron' | 'dodecahedron' | 'sphere';
  color: string;
  roughness: number;
  metalness: number;
  wireframe: boolean;
  autoRotate: boolean;
  rotationSpeed: number;
}

function ConfigurableMesh({
  geometryType,
  color,
  roughness,
  metalness,
  wireframe,
  autoRotate,
  rotationSpeed,
}: ConfigurableMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
      meshRef.current.rotation.x += delta * (rotationSpeed * 0.4);
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      {geometryType === 'torusKnot' && <torusKnotGeometry args={[1, 0.32, 128, 32]} />}
      {geometryType === 'icosahedron' && <icosahedronGeometry args={[1.3, 2]} />}
      {geometryType === 'octahedron' && <octahedronGeometry args={[1.4, 0]} />}
      {geometryType === 'dodecahedron' && <dodecahedronGeometry args={[1.3, 0]} />}
      {geometryType === 'sphere' && <sphereGeometry args={[1.2, 64, 64]} />}

      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        wireframe={wireframe}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// 2. Physics Simulation Engine Canvas
// ---------------------------------------------------------------------------
interface PhysicsCanvasProps {
  preset: PhysicsPreset;
  params: Record<string, number>;
  isRunning: boolean;
  resetSignal: number;
}

function PhysicsCanvas({ preset, params, isRunning, resetSignal }: PhysicsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.clientWidth * window.devicePixelRatio || 600);
    const height = (canvas.height = canvas.clientHeight * window.devicePixelRatio || 400);

    // Simulation Data Structures
    let bodies: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      mass: number;
      color: string;
      trail: Array<{ x: number; y: number }>;
    }> = [];

    // Pendulum State
    let theta1 = Math.PI / 2;
    let theta2 = Math.PI / 2;
    let omega1 = 0;
    let omega2 = 0;
    const pendulumTrace: Array<{ x: number; y: number }> = [];

    // Reset or Initialize
    const initSimulation = () => {
      bodies = [];
      pendulumTrace.length = 0;

      if (preset.id === 'gravity') {
        const count = Math.min(30, Math.floor(params.particleCount || 16));
        const centerX = width / 2;
        const centerY = height / 2;
        const speed = params.velocity || 45;

        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const dist = 70 + (i % 4) * 35;
          const v = (speed / 10) * Math.sqrt(100 / Math.max(20, dist));
          bodies.push({
            x: centerX + Math.cos(angle) * dist,
            y: centerY + Math.sin(angle) * dist,
            vx: -Math.sin(angle) * v * 1.5,
            vy: Math.cos(angle) * v * 1.5,
            radius: 3 + (i % 3) * 1.5,
            mass: params.mass || 50,
            color: i % 2 === 0 ? '#C49B72' : '#6A9BC4',
            trail: [],
          });
        }
      } else if (preset.id === 'collisions') {
        const count = Math.min(35, Math.floor(params.particleCount || 18));
        const v = params.velocity || 50;

        for (let i = 0; i < count; i++) {
          const rad = 7 + (i % 4) * 3;
          bodies.push({
            x: rad + 20 + Math.random() * (width - rad * 2 - 40),
            y: rad + 20 + Math.random() * (height - rad * 2 - 40),
            vx: ((Math.random() - 0.5) * v) / 10,
            vy: ((Math.random() - 0.5) * v) / 10,
            radius: rad,
            mass: rad * rad,
            color: ['#C49B72', '#6A9BC4', '#3EA876', '#E4B058'][i % 4],
            trail: [],
          });
        }
      } else if (preset.id === 'pendulum') {
        theta1 = Math.PI / 2;
        theta2 = Math.PI / 2;
        omega1 = 0;
        omega2 = 0;
      } else if (preset.id === 'particles') {
        const count = Math.min(200, Math.floor(params.particleCount || 120));
        for (let i = 0; i < count; i++) {
          bodies.push({
            x: width / 2 + (Math.random() - 0.5) * 40,
            y: height - 40,
            vx: (Math.random() - 0.5) * ((params.velocity || 60) / 10),
            vy: -Math.random() * ((params.velocity || 60) / 5) - 3,
            radius: 2 + Math.random() * 2,
            mass: 1,
            color: '#C49B72',
            trail: [],
          });
        }
      }
    };

    initSimulation();

    // Loop
    const loop = () => {
      // Clear with dark slate wash
      ctx.fillStyle = '#111315';
      ctx.fillRect(0, 0, width, height);

      // Subtle Background Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (preset.id === 'gravity') {
        const centerX = width / 2;
        const centerY = height / 2;
        const G = (params.gravity || 9.8) * 12;

        // Central Attractor
        ctx.beginPath();
        ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#E4B058';
        ctx.shadowColor = '#E4B058';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

        bodies.forEach((b) => {
          if (isRunning) {
            const dx = centerX - b.x;
            const dy = centerY - b.y;
            const distSq = dx * dx + dy * dy + 400;
            const dist = Math.sqrt(distSq);
            const force = G / distSq;
            b.vx += (dx / dist) * force;
            b.vy += (dy / dist) * force;
            b.x += b.vx;
            b.y += b.vy;

            b.trail.push({ x: b.x, y: b.y });
            if (b.trail.length > 30) b.trail.shift();
          }

          // Draw Trail
          if (b.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(b.trail[0].x, b.trail[0].y);
            for (let i = 1; i < b.trail.length; i++) {
              ctx.lineTo(b.trail[i].x, b.trail[i].y);
            }
            ctx.strokeStyle = b.color + '44';
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          // Draw Body
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = b.color;
          ctx.fill();
        });
      } else if (preset.id === 'collisions') {
        const e = params.elasticity ?? 0.95;

        bodies.forEach((b, i) => {
          if (isRunning) {
            b.x += b.vx;
            b.y += b.vy;

            // Boundary Rebound
            if (b.x - b.radius < 0) {
              b.x = b.radius;
              b.vx = -b.vx * e;
            } else if (b.x + b.radius > width) {
              b.x = width - b.radius;
              b.vx = -b.vx * e;
            }
            if (b.y - b.radius < 0) {
              b.y = b.radius;
              b.vy = -b.vy * e;
            } else if (b.y + b.radius > height) {
              b.y = height - b.radius;
              b.vy = -b.vy * e;
            }

            // Sphere-to-sphere collision detection
            for (let j = i + 1; j < bodies.length; j++) {
              const o = bodies[j];
              const dx = o.x - b.x;
              const dy = o.y - b.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const minDist = b.radius + o.radius;

              if (dist < minDist && dist > 0) {
                const nx = dx / dist;
                const ny = dy / dist;
                const kx = b.vx - o.vx;
                const ky = b.vy - o.vy;
                const p = 2 * (nx * kx + ny * ky) / (b.mass + o.mass);

                b.vx -= p * o.mass * nx * e;
                b.vy -= p * o.mass * ny * e;
                o.vx += p * b.mass * nx * e;
                o.vy += p * b.mass * ny * e;

                // Push apart
                const overlap = 0.5 * (minDist - dist);
                b.x -= nx * overlap;
                b.y -= ny * overlap;
                o.x += nx * overlap;
                o.y += ny * overlap;
              }
            }
          }

          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = b.color;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.stroke();
        });
      } else if (preset.id === 'pendulum') {
        const g = (params.gravity || 9.8) * 0.12;
        const L1 = (params.armLength || 120) * 0.8;
        const L2 = (params.armLength || 120) * 0.7;
        const m1 = (params.mass || 40) * 0.2;
        const m2 = (params.mass || 40) * 0.2;
        const damping = 1 - (params.damping || 0.002);
        const originX = width / 2;
        const originY = height * 0.28;

        if (isRunning) {
          // Double pendulum angular acceleration differential equations
          const num1 = -g * (2 * m1 + m2) * Math.sin(theta1);
          const num2 = -m2 * g * Math.sin(theta1 - 2 * theta2);
          const num3 = -2 * Math.sin(theta1 - theta2) * m2;
          const num4 = omega2 * omega2 * L2 + omega1 * omega1 * L1 * Math.cos(theta1 - theta2);
          const den1 = L1 * (2 * m1 + m2 - m2 * Math.cos(2 * theta1 - 2 * theta2));
          const alpha1 = (num1 + num2 + num3 * num4) / den1;

          const num5 = 2 * Math.sin(theta1 - theta2);
          const num6 = omega1 * omega1 * L1 * (m1 + m2);
          const num7 = g * (m1 + m2) * Math.cos(theta1);
          const num8 = omega2 * omega2 * L2 * m2 * Math.cos(theta1 - theta2);
          const den2 = L2 * (2 * m1 + m2 - m2 * Math.cos(2 * theta1 - 2 * theta2));
          const alpha2 = (num5 * (num6 + num7 + num8)) / den2;

          omega1 = (omega1 + alpha1) * damping;
          omega2 = (omega2 + alpha2) * damping;
          theta1 += omega1;
          theta2 += omega2;
        }

        const x1 = originX + L1 * Math.sin(theta1);
        const y1 = originY + L1 * Math.cos(theta1);
        const x2 = x1 + L2 * Math.sin(theta2);
        const y2 = y1 + L2 * Math.cos(theta2);

        if (isRunning) {
          pendulumTrace.push({ x: x2, y: y2 });
          if (pendulumTrace.length > 250) pendulumTrace.shift();
        }

        // Draw chaotic trace
        if (pendulumTrace.length > 1) {
          ctx.beginPath();
          ctx.moveTo(pendulumTrace[0].x, pendulumTrace[0].y);
          for (let i = 1; i < pendulumTrace.length; i++) {
            ctx.lineTo(pendulumTrace[i].x, pendulumTrace[i].y);
          }
          ctx.strokeStyle = 'rgba(196, 155, 114, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Draw Rods
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = '#9CA2A8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Joints
        [
          { x: originX, y: originY, r: 4, c: '#FFFFFF' },
          { x: x1, y: y1, r: 8, c: '#6A9BC4' },
          { x: x2, y: y2, r: 10, c: '#C49B72' },
        ].forEach((pt) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
          ctx.fillStyle = pt.c;
          ctx.fill();
        });
      } else if (preset.id === 'particles') {
        const g = (params.gravity || 12) * 0.05;
        const e = params.elasticity ?? 0.7;

        bodies.forEach((p) => {
          if (isRunning) {
            p.vy += g;
            p.x += p.vx;
            p.y += p.vy;

            // Ground bounce
            if (p.y + p.radius > height) {
              p.y = height - p.radius;
              p.vy = -p.vy * e;
              p.vx *= 0.98;
            }

            // Wall bounce
            if (p.x < 0 || p.x > width) {
              p.vx = -p.vx * e;
            }

            // Respawn if stopped
            if (Math.abs(p.vy) < 0.2 && p.y >= height - p.radius - 1) {
              p.x = width / 2 + (Math.random() - 0.5) * 30;
              p.y = height - 40;
              p.vx = (Math.random() - 0.5) * ((params.velocity || 60) / 10);
              p.vy = -Math.random() * ((params.velocity || 60) / 5) - 3;
            }
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#C49B72';
          ctx.fill();
        });
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [preset, params, isRunning, resetSignal]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block rounded bg-[#111315] border border-border-default shadow-inner"
    />
  );
}

// ---------------------------------------------------------------------------
// 3. Main SandboxApp Component
// ---------------------------------------------------------------------------
export default function SandboxApp({ windowId }: SandboxAppProps) {
  const { closeWindow } = useOSStore();
  const [activeTab, setActiveTab] = useState<'car' | 'physics' | '3d'>('car');

  // 3D Configurator State
  const [geometryType, setGeometryType] = useState<ConfigurableMeshProps['geometryType']>('torusKnot');
  const [color, setColor] = useState('#C49B72');
  const [roughness, setRoughness] = useState(0.35);
  const [metalness, setMetalness] = useState(0.85);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.6);

  // Physics Simulation State
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const activePreset = physicsPresets[activePresetIndex] || physicsPresets[0];
  const [params, setParams] = useState<Record<string, number>>({ ...activePreset.defaultParams });
  const [isRunning, setIsRunning] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);

  // Switch preset
  const handleSelectPreset = (idx: number) => {
    setActivePresetIndex(idx);
    setParams({ ...physicsPresets[idx].defaultParams });
    setResetSignal((s) => s + 1);
  };

  const COLOR_PRESETS = [
    { label: 'Mineral Ochre', value: '#C49B72' },
    { label: 'Titanium Silver', value: '#9CA2A8' },
    { label: 'Cyan Matrix', value: '#67B8DE' },
    { label: 'Emerald Kinetic', value: '#4EC988' },
    { label: 'Obsidian Black', value: '#1A1D20' },
    { label: 'Plum Nebula', value: '#DDA0DD' },
  ];

  return (
    <AppFrame
      appId="sandbox"
      title="Sandbox.exe — 3D Car Configurator & Interactive Lab"
      onBack={() => closeWindow(windowId)}
      headerActions={
        <div className="flex items-center rounded bg-surface-base border border-border-default p-0.5 text-xs font-sans">
          <button
            onClick={() => setActiveTab('car')}
            className={`px-2 sm:px-3 py-1 rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'car'
                ? 'bg-accent/20 text-accent font-medium'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            <Car size={13} />
            <span className="hidden sm:inline">3D Car Configurator</span>
            <span className="sm:hidden">Car</span>
          </button>
          <button
            onClick={() => setActiveTab('physics')}
            className={`px-2 sm:px-3 py-1 rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'physics'
                ? 'bg-accent/20 text-accent font-medium'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            <Atom size={13} />
            <span className="hidden sm:inline">Physics Lab</span>
            <span className="sm:hidden">Physics</span>
          </button>
          <button
            onClick={() => setActiveTab('3d')}
            className={`px-2 sm:px-3 py-1 rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === '3d'
                ? 'bg-accent/20 text-accent font-medium'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            <Box size={13} />
            <span className="hidden sm:inline">Geometry Lab</span>
            <span className="sm:hidden">3D</span>
          </button>
        </div>
      }
      className="flex-1"
    >
      <div className="h-full bg-surface-canvas flex flex-col font-sans select-none text-content-primary overflow-hidden">
        {activeTab === 'car' ? (
          /* ============================================================== */
          /* 3D Car Configurator Module (Porsche, Lamborghini, McLaren)     */
          /* ============================================================== */
          <div className="flex-1 w-full h-full relative overflow-hidden bg-[#070709]">
            <CarShowroom />
            <CarControls />
          </div>
        ) : activeTab === '3d' ? (
          /* ============================================================== */
          /* Procedural 3D Geometry Lab Module                              */
          /* ============================================================== */
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
            {/* 3D Canvas Viewport */}
            <div className="flex-1 relative bg-[#0C0E10] min-h-[300px]">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-xs text-content-tertiary font-mono">
                    Initializing WebGL Pipeline...
                  </div>
                }
              >
                <Canvas shadows camera={{ position: [0, 0, 4.2], fov: 45 }}>
                  <ambientLight intensity={0.8} />
                  <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
                  <directionalLight position={[-5, -4, -4]} intensity={0.5} />
                  <pointLight position={[0, -2, 2]} intensity={0.5} color={color} />

                  <ConfigurableMesh
                    geometryType={geometryType}
                    color={color}
                    roughness={roughness}
                    metalness={metalness}
                    wireframe={wireframe}
                    autoRotate={autoRotate}
                    rotationSpeed={rotationSpeed}
                  />

                  <OrbitControls enableDamping dampingFactor={0.05} minDistance={2} maxDistance={10} />
                </Canvas>
              </Suspense>

              {/* Viewport Telemetry Badge */}
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded bg-surface-base/80 backdrop-blur-md border border-white/10 font-mono text-[10px] text-content-secondary space-y-0.5 pointer-events-none">
                <div>Model: <span className="text-content-primary uppercase">{geometryType}</span></div>
                <div>Shader: <span className="text-accent">PBR Standard Mesh</span></div>
                <div className="text-content-tertiary">Drag to rotate • Scroll to zoom</div>
              </div>
            </div>

            {/* Configurator Controls Sidebar */}
            <div className="w-full md:w-80 bg-surface-base border-t md:border-t-0 md:border-l border-border-default p-5 overflow-y-auto space-y-5 shrink-0 text-xs select-none">
              <div className="border-b border-border-subtle pb-2">
                <h3 className="font-semibold text-content-primary uppercase tracking-wide text-xs">
                  Material & Geometry Controls
                </h3>
                <p className="text-[11px] text-content-tertiary">
                  Customize physical shader parameters in real-time.
                </p>
              </div>

              {/* Geometry Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-content-secondary">
                  Geometry Primitive
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['torusKnot', 'icosahedron', 'octahedron', 'dodecahedron', 'sphere'] as const).map(
                    (geom) => (
                      <button
                        key={geom}
                        onClick={() => setGeometryType(geom)}
                        className={`px-2.5 py-1.5 rounded text-[11px] capitalize border transition-colors cursor-pointer ${
                          geometryType === geom
                            ? 'bg-accent/20 border-accent/40 text-accent font-semibold'
                            : 'bg-surface-panel border-border-subtle text-content-secondary hover:text-content-primary'
                        }`}
                      >
                        {geom}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Color Presets */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-content-secondary">
                  Material Color Preset
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {COLOR_PRESETS.map((cp) => (
                    <button
                      key={cp.value}
                      onClick={() => setColor(cp.value)}
                      className={`flex items-center gap-1.5 p-1.5 rounded border text-[10px] transition-colors cursor-pointer ${
                        color === cp.value
                          ? 'border-accent bg-surface-panel text-content-primary font-semibold'
                          : 'border-border-subtle bg-surface-panel/40 text-content-secondary hover:text-content-primary'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: cp.value }} />
                      <span className="truncate">{cp.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders: Roughness & Metalness */}
              <div className="space-y-4 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-content-secondary">Roughness</span>
                    <span className="text-accent">{roughness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={roughness}
                    onChange={(e) => setRoughness(parseFloat(e.target.value))}
                    className="w-full accent-[#C49B72] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-content-secondary">Metalness</span>
                    <span className="text-accent">{metalness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={metalness}
                    onChange={(e) => setMetalness(parseFloat(e.target.value))}
                    className="w-full accent-[#C49B72] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-content-secondary">Auto-Rotation Speed</span>
                    <span className="text-accent">{rotationSpeed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.5"
                    step="0.1"
                    value={rotationSpeed}
                    onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                    className="w-full accent-[#C49B72] cursor-pointer"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-border-subtle">
                <label className="flex items-center justify-between p-2 rounded bg-surface-panel border border-border-subtle cursor-pointer">
                  <span className="text-content-secondary">Wireframe Overlay</span>
                  <input
                    type="checkbox"
                    checked={wireframe}
                    onChange={(e) => setWireframe(e.target.checked)}
                    className="accent-[#C49B72] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded bg-surface-panel border border-border-subtle cursor-pointer">
                  <span className="text-content-secondary">Auto-Rotate Viewport</span>
                  <input
                    type="checkbox"
                    checked={autoRotate}
                    onChange={(e) => setAutoRotate(e.target.checked)}
                    className="accent-[#C49B72] cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* Physics Playground Module                                       */
          /* ============================================================== */
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
            {/* Simulation Canvas Viewport */}
            <div className="flex-1 flex flex-col p-4 md:p-6 min-h-[300px] overflow-hidden bg-surface-canvas">
              {/* Preset Selector Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 shrink-0">
                {physicsPresets.map((pr, idx) => (
                  <button
                    key={pr.id}
                    onClick={() => handleSelectPreset(idx)}
                    className={`px-3 py-1.5 rounded text-xs transition-colors shrink-0 cursor-pointer font-medium ${
                      activePresetIndex === idx
                        ? 'bg-accent/20 border border-accent/40 text-accent'
                        : 'bg-surface-base border border-border-subtle text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    {pr.name.split('&')[0]}
                  </button>
                ))}
              </div>

              {/* Canvas Wrapper */}
              <div className="flex-1 w-full h-full relative min-h-[240px]">
                <PhysicsCanvas
                  preset={activePreset}
                  params={params}
                  isRunning={isRunning}
                  resetSignal={resetSignal}
                />

                {/* Floating Canvas Controls */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="px-2.5 py-1 rounded bg-surface-base/90 backdrop-blur-md border border-white/10 text-xs font-mono text-content-primary hover:text-accent transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    {isRunning ? <Pause size={12} /> : <Play size={12} />}
                    <span>{isRunning ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    onClick={() => setResetSignal((s) => s + 1)}
                    className="p-1.5 rounded bg-surface-base/90 backdrop-blur-md border border-white/10 text-content-secondary hover:text-content-primary transition-colors shadow-md cursor-pointer"
                    title="Reset Simulation"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Physics Parameters & Theory Sidebar */}
            <div className="w-full md:w-80 bg-surface-base border-t md:border-t-0 md:border-l border-border-default p-5 overflow-y-auto space-y-5 shrink-0 text-xs select-none">
              <div className="border-b border-border-subtle pb-2">
                <h3 className="font-semibold text-content-primary uppercase tracking-wide text-xs">
                  {activePreset.subtitle}
                </h3>
                <p className="text-[11px] text-content-tertiary mt-0.5">
                  {activePreset.description}
                </p>
              </div>

              {/* Formula Card */}
              <div className="p-3 rounded bg-surface-panel border border-border-subtle space-y-1">
                <span className="text-[10px] font-mono text-accent uppercase font-bold">
                  Governing Formula
                </span>
                <div className="font-mono text-xs text-content-primary font-semibold">
                  {activePreset.formula}
                </div>
              </div>

              {/* Sliders for active preset parameters */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-mono uppercase text-content-secondary">
                  Live Adjustable Parameters
                </h4>

                {activePreset.paramDefs.map((pDef) => (
                  <div key={pDef.id} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-content-secondary">{pDef.label}</span>
                      <span className="text-accent">
                        {params[pDef.id] !== undefined ? params[pDef.id] : pDef.min} {pDef.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={pDef.min}
                      max={pDef.max}
                      step={pDef.step}
                      value={params[pDef.id] !== undefined ? params[pDef.id] : pDef.min}
                      onChange={(e) =>
                        setParams((prev) => ({
                          ...prev,
                          [pDef.id]: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full accent-[#C49B72] cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              {/* Theory Box */}
              <div className="pt-2 border-t border-border-subtle space-y-1.5 select-text font-sans">
                <div className="flex items-center gap-1.5 text-accent text-[11px] font-semibold">
                  <Info size={12} />
                  <span>Physical Principles</span>
                </div>
                <p className="text-[11px] text-content-secondary leading-relaxed">
                  {activePreset.theory}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppFrame>
  );
}

