'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import CarModel from './CarModel';
import { useCarConfigStore, CameraView } from './carStore';

// ---------------------------------------------------------------------------
// 1. Smooth Camera Controller for Preset Views
// ---------------------------------------------------------------------------
const VIEW_COORDINATES: Record<CameraView, [number, number, number]> = {
  default: [4.6, 2.0, 5.0],
  front: [0, 1.3, 5.2],
  side: [6.2, 1.4, 0],
  rear: [-2.2, 1.8, -5.2],
  top: [0.01, 7.8, 0.01],
};

function CameraController() {
  const { camera } = useThree();
  const { cameraView, autoRotate } = useCarConfigStore();
  const targetPos = useRef(new THREE.Vector3(...VIEW_COORDINATES[cameraView]));
  const isTransitioning = useRef(true);

  useEffect(() => {
    targetPos.current.set(...VIEW_COORDINATES[cameraView]);
    isTransitioning.current = true;
  }, [cameraView]);

  useFrame((_, delta) => {
    if (isTransitioning.current && !autoRotate) {
      camera.position.lerp(targetPos.current, Math.min(1, delta * 3.5));
      if (camera.position.distanceTo(targetPos.current) < 0.05) {
        isTransitioning.current = false;
      }
    }
  });

  return null;
}

// ---------------------------------------------------------------------------
// 2. Headlight Beams Projector
// ---------------------------------------------------------------------------
function HeadlightBeams({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;

  return (
    <group position={[0, 0.65, 2.3]}>
      {/* Left Projector Beam */}
      <spotLight
        position={[-0.65, 0, 0]}
        target-position={[-0.65, -0.6, 9]}
        color="#F0F9FF"
        intensity={6.0}
        angle={0.45}
        penumbra={0.7}
        distance={16}
      />
      {/* Right Projector Beam */}
      <spotLight
        position={[0.65, 0, 0]}
        target-position={[0.65, -0.6, 9]}
        color="#F0F9FF"
        intensity={6.0}
        angle={0.45}
        penumbra={0.7}
        distance={16}
      />
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. Luxury Showroom Studio Stage Floor
// ---------------------------------------------------------------------------
function ShowroomPedestal() {
  return (
    <group position={[0, -0.01, 0]}>
      {/* Main Circular Pedestal */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[5.2, 5.4, 0.1, 64]} />
        <meshStandardMaterial color="#141417" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Outer Polished Bevel Rim */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[5.4, 5.6, 0.09, 64]} />
        <meshStandardMaterial color="#27272A" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Illuminated Edge Accent Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[5.15, 5.22, 64]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.45} />
      </mesh>

      {/* Infinite Dark Showroom Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0A0A0C" roughness={0.6} metalness={0.4} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. Studio Lighting Environment Rig
// ---------------------------------------------------------------------------
function StudioLighting() {
  const { headlights } = useCarConfigStore();

  return (
    <>
      {/* Ambient Fill */}
      <ambientLight intensity={0.7} />

      {/* Overhead Large Softbox Area Light */}
      <directionalLight position={[0, 10, 0]} intensity={1.8} />

      {/* Key Directional Light with Shadows */}
      <directionalLight
        position={[7, 8, 6]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Left Fill Light */}
      <directionalLight position={[-7, 6, -5]} intensity={1.2} />

      {/* Cinematic Blue Rim Light (Rear Silhouette) */}
      <pointLight position={[0, 5, -8]} intensity={3.5} color="#60A5FA" distance={18} />

      {/* Warm Golden Contour Light */}
      <pointLight position={[7, 2.5, -4]} intensity={2.0} color="#FBBF24" distance={15} />

      {/* Front Headlight Light Beams */}
      <HeadlightBeams enabled={headlights} />
    </>
  );
}

// ---------------------------------------------------------------------------
// 5. Real-Time Streaming Asset Progress Indicator
// ---------------------------------------------------------------------------
function ModelLoadingProgress() {
  const { active, progress, item } = useProgress();
  if (!active) return null;

  const fileName = item ? item.split('/').pop()?.replace('.glb', '') : 'Car Model';

  return (
    <div className="absolute top-4 right-4 z-20 pointer-events-none flex items-center gap-3 bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-2xl">
      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between gap-4 text-[11px] font-mono">
          <span className="text-neutral-300 font-semibold uppercase tracking-wider">
            Streaming {fileName}
          </span>
          <span className="text-cyan-400">{Math.round(progress)}%</span>
        </div>
        <div className="w-36 h-1 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-400 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6. Main Showroom Canvas Component
// ---------------------------------------------------------------------------
export default function CarShowroom() {
  const { autoRotate } = useCarConfigStore();
  const controlsRef = useRef<any>(null);

  return (
    <div className="w-full h-full relative bg-[#070709] overflow-hidden select-none">
      {/* Real-time Streaming Asset Progress Indicator */}
      <ModelLoadingProgress />

      <Canvas
        shadows
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        camera={{ position: [4.6, 2.0, 5.0], fov: 42 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#070709');
        }}
      >
        <CameraController />
        <StudioLighting />

        {/* 3D Car Model */}
        <CarModel />

        {/* Studio Pedestal & Floor */}
        <ShowroomPedestal />

        {/* Realistic Contact Shadows */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.75}
          scale={14}
          blur={2.4}
          far={4.0}
          resolution={512}
          color="#000000"
        />

        {/* Orbit Camera Controls with Smooth Damping */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.05}
          target={[0, 0.55, 0]}
          minDistance={2.4}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2 - 0.03}
          minPolarAngle={0.15}
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
        />
      </Canvas>
    </div>
  );
}

