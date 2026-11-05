'use client';

import React, { useMemo, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarConfigStore, CAR_MODELS, CarModelId } from './carStore';

// ---------------------------------------------------------------------------
// 1. Procedural Carbon Fiber GT Wing / Aero Component
// ---------------------------------------------------------------------------
function CarbonAeroPackage({
  active,
  aeroKit,
  carId,
}: {
  active: boolean;
  aeroKit: boolean;
  carId: CarModelId;
}) {
  const carbonMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#18181B',
        roughness: 0.35,
        metalness: 0.8,
      }),
    []
  );

  const wingOffset: [number, number, number] =
    carId === 'porsche'
      ? [0, 1.25, -2.05]
      : carId === 'lamborghini'
      ? [0, 1.15, -2.25]
      : [0, 1.18, -2.1];

  const wingWidth = carId === 'porsche' ? 1.6 : 1.75;

  return (
    <group>
      {/* Active High-Downforce Rear GT Wing */}
      {active && (
        <group position={wingOffset}>
          {/* Main Airfoil Blade */}
          <mesh castShadow receiveShadow material={carbonMaterial}>
            <boxGeometry args={[wingWidth, 0.04, 0.32]} />
          </mesh>
          {/* Gurney Flap */}
          <mesh position={[0, 0.025, -0.14]} castShadow material={carbonMaterial}>
            <boxGeometry args={[wingWidth, 0.03, 0.02]} />
          </mesh>
          {/* Left Endplate */}
          <mesh position={[-wingWidth / 2, 0.04, 0]} castShadow material={carbonMaterial}>
            <boxGeometry args={[0.02, 0.22, 0.38]} />
          </mesh>
          {/* Right Endplate */}
          <mesh position={[wingWidth / 2, 0.04, 0]} castShadow material={carbonMaterial}>
            <boxGeometry args={[0.02, 0.22, 0.38]} />
          </mesh>
          {/* Dual Aero Swan-Neck Pylons */}
          <mesh position={[-0.42, -0.22, 0.05]} castShadow material={carbonMaterial}>
            <boxGeometry args={[0.04, 0.44, 0.12]} />
          </mesh>
          <mesh position={[0.42, -0.22, 0.05]} castShadow material={carbonMaterial}>
            <boxGeometry args={[0.04, 0.44, 0.12]} />
          </mesh>
        </group>
      )}

      {/* Front Carbon Splitter Blade */}
      {aeroKit && (
        <group>
          <mesh
            position={[0, 0.08, carId === 'porsche' ? 2.15 : 2.35]}
            castShadow
            material={carbonMaterial}
          >
            <boxGeometry args={[1.75, 0.025, 0.3]} />
          </mesh>
          {/* Left Canard */}
          <mesh
            position={[-0.92, 0.24, carId === 'porsche' ? 1.95 : 2.1]}
            rotation={[0, 0, -0.25]}
            material={carbonMaterial}
          >
            <boxGeometry args={[0.18, 0.02, 0.24]} />
          </mesh>
          {/* Right Canard */}
          <mesh
            position={[0.92, 0.24, carId === 'porsche' ? 1.95 : 2.1]}
            rotation={[0, 0, 0.25]}
            material={carbonMaterial}
          >
            <boxGeometry args={[0.18, 0.02, 0.24]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 2. Underglow Lighting Component
// ---------------------------------------------------------------------------
function Underglow({ enabled, color }: { enabled: boolean; color: string }) {
  if (!enabled) return null;

  return (
    <group position={[0, 0.02, 0]}>
      <pointLight position={[0, 0.08, 1.2]} intensity={2.8} distance={3.2} color={color} />
      <pointLight position={[0, 0.08, -1.2]} intensity={2.8} distance={3.2} color={color} />
      <pointLight position={[-0.85, 0.08, 0]} intensity={3.5} distance={3.5} color={color} />
      <pointLight position={[0.85, 0.08, 0]} intensity={3.5} distance={3.5} color={color} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[2.4, 4.6]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. GLB Loaded Car Mesh with Dynamic Material Binding
// ---------------------------------------------------------------------------
interface LoadedCarProps {
  carId: CarModelId;
  modelUrl: string;
  scale?: number;
  rotation?: [number, number, number];
}

function LoadedCar({ carId, modelUrl, scale = 1.0, rotation = [0, 0, 0] }: LoadedCarProps) {
  const { scene } = useGLTF(modelUrl);
  const {
    paintColor,
    roughness,
    metalness,
    wheelFinish,
    caliperColor,
    spoilerActive,
    aeroKit,
    headlights,
    taillights,
  } = useCarConfigStore();

  const wheelValues = useMemo(() => {
    switch (wheelFinish) {
      case 'black':
        return { color: new THREE.Color('#18181B'), metalness: 0.65, roughness: 0.6 };
      case 'bronze':
        return { color: new THREE.Color('#B48C50'), metalness: 0.88, roughness: 0.28 };
      case 'gunmetal':
        return { color: new THREE.Color('#475569'), metalness: 0.9, roughness: 0.32 };
      case 'silver':
      default:
        return { color: new THREE.Color('#E2E8F0'), metalness: 0.95, roughness: 0.18 };
    }
  }, [wheelFinish]);

  // Clone scene and compute mathematical grounding (wheels touching floor at y = 0)
  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);

    // Hide unwanted studio ground plane in Porsche Sketchfab GLTF
    if (carId === 'porsche') {
      cloned.traverse((child) => {
        if (child.name === 'Plane' || child.name === 'Plane_0') {
          child.visible = false;
        }
      });
    }

    // Clone materials so mutations don't alter cached original GLTF
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone());
        } else if (mesh.material) {
          mesh.material = mesh.material.clone();
        }
      }
    });

    // Calculate exact bounding box to ground wheels at y = 0 and center on X/Z
    const box = new THREE.Box3().setFromObject(cloned);
    const center = new THREE.Vector3();
    box.getCenter(center);

    cloned.position.set(-center.x, -box.min.y, -center.z);
    cloned.updateMatrixWorld(true);

    return cloned;
  }, [scene, carId]);

  // Update dynamic materials on user interactions
  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const applyToMaterial = (mat: THREE.Material) => {
          if (!mat || !(mat instanceof THREE.MeshStandardMaterial)) return;

          const name = mat.name.toLowerCase();

          // Body Paint Material
          const isPaint =
            name.includes('paint') ||
            name.includes('carpaint') ||
            name === 'coat' ||
            name === 'tex_shiny' ||
            name === 'material_0' ||
            name.includes('paintedmetal') ||
            name === 'm_carpaint' ||
            name.includes('car_paint');

          if (isPaint) {
            mat.color.set(paintColor);
            mat.roughness = roughness;
            mat.metalness = metalness;
            mat.needsUpdate = true;
          }

          // Wheel Rims
          const isWheelRim =
            name.includes('rim') ||
            name.includes('wheelrim') ||
            name === 'silver' ||
            name === 'm_wheelrim' ||
            name === 'wheel.001' ||
            name.includes('gunmetal');

          if (isWheelRim) {
            mat.color.copy(wheelValues.color);
            mat.metalness = wheelValues.metalness;
            mat.roughness = wheelValues.roughness;
            mat.needsUpdate = true;
          }

          // Brake Calipers
          const isCaliper = name.includes('caliper');
          if (isCaliper) {
            mat.color.set(caliperColor);
            mat.metalness = 0.85;
            mat.roughness = 0.22;
            mat.needsUpdate = true;
          }

          // Headlights
          const isHeadlight =
            name.includes('headlight') ||
            name === 'lights' ||
            name.includes('emitter');

          if (isHeadlight) {
            if (headlights) {
              mat.emissive.set('#E0F2FE');
              mat.emissiveIntensity = 4.0;
            } else {
              mat.emissive.set('#000000');
              mat.emissiveIntensity = 0;
            }
            mat.needsUpdate = true;
          }

          // Tail-lights
          const isTaillight =
            name.includes('taillight') ||
            name.includes('light_grid_red') ||
            name.includes('emission_red') ||
            name.includes('glassred') ||
            name.includes('tail');

          if (isTaillight) {
            if (taillights) {
              mat.emissive.set('#FF0033');
              mat.emissiveIntensity = 5.0;
            } else {
              mat.emissive.set('#1A0000');
              mat.emissiveIntensity = 0.1;
            }
            mat.needsUpdate = true;
          }
        };

        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(applyToMaterial);
        } else {
          applyToMaterial(mesh.material);
        }
      }

      // Handle native animated rear wing on Lamborghini Revuelto
      if (carId === 'lamborghini') {
        if (
          obj.name.includes('Wing_CarPaint') ||
          obj.name.includes('WingHinge') ||
          obj.name.includes('WingStrut') ||
          obj.name.includes('WingPiston')
        ) {
          obj.position.y = spoilerActive ? 0.22 : 0;
        }
      }
    });
  }, [
    clonedScene,
    carId,
    paintColor,
    roughness,
    metalness,
    wheelValues,
    caliperColor,
    spoilerActive,
    headlights,
    taillights,
  ]);

  return (
    <group key={carId} scale={scale} rotation={rotation}>
      <primitive object={clonedScene} />
      {/* Procedural GT Wing for Porsche & McLaren (Revuelto has native active aero) */}
      {carId !== 'lamborghini' && (
        <CarbonAeroPackage active={spoilerActive} aeroKit={aeroKit} carId={carId} />
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. Procedural Placeholder Fallback & Loading Car
// ---------------------------------------------------------------------------
function FallbackCyberCar() {
  const { paintColor, roughness, metalness, spoilerActive } = useCarConfigStore();
  const ringRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 1.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Holographic 3D Scanning Ring while Streaming Assets */}
      <group ref={ringRef} position={[0, 0.75, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.4, 2.48, 64]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.65} />
        </mesh>
      </group>

      {/* Main Body Chassis */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.4, 4.4]} />
        <meshStandardMaterial color={paintColor} roughness={roughness} metalness={metalness} />
      </mesh>

      {/* Cabin Cockpit Glass */}
      <mesh position={[0, 0.85, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.45, 2.3]} />
        <meshPhysicalMaterial
          color="#18181B"
          roughness={0.1}
          metalness={0.9}
          transmission={0.6}
          transparent
        />
      </mesh>

      {/* Aerodynamic Sloped Hood */}
      <mesh position={[0, 0.52, 1.4]} rotation={[-0.15, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.18, 1.5]} />
        <meshStandardMaterial color={paintColor} roughness={roughness} metalness={metalness} />
      </mesh>

      {/* 4 Wheels Touching Ground at y = 0 */}
      {[
        [-0.95, 0.35, 1.3],
        [0.95, 0.35, 1.3],
        [-0.95, 0.35, -1.3],
        [0.95, 0.35, -1.3],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.28, 32]} />
            <meshStandardMaterial color="#111113" roughness={0.7} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[x > 0 ? 0.08 : -0.08, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.18, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>
      ))}

      {/* Active Rear Wing */}
      {spoilerActive && (
        <group position={[0, 1.15, -2.0]}>
          <mesh castShadow>
            <boxGeometry args={[1.8, 0.04, 0.32]} />
            <meshStandardMaterial color="#18181B" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[-0.45, -0.2, 0]} castShadow>
            <boxGeometry args={[0.04, 0.4, 0.1]} />
            <meshStandardMaterial color="#18181B" metalness={0.8} />
          </mesh>
          <mesh position={[0.45, -0.2, 0]} castShadow>
            <boxGeometry args={[0.04, 0.4, 0.1]} />
            <meshStandardMaterial color="#18181B" metalness={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 5. Main Car Root Component
// ---------------------------------------------------------------------------
export default function CarModel() {
  const { selectedCar, underglow, underglowColor } = useCarConfigStore();
  const spec = CAR_MODELS[selectedCar];

  return (
    <group>
      <React.Suspense fallback={<FallbackCyberCar />}>
        <LoadedCar
          key={selectedCar}
          carId={selectedCar}
          modelUrl={spec.modelUrl}
          scale={spec.scale}
          rotation={spec.rotation}
        />
      </React.Suspense>

      {/* Underglow Neon Lighting */}
      <Underglow enabled={underglow} color={underglowColor} />
    </group>
  );
}
