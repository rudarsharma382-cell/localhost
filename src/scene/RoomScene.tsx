'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as THREE from 'three';
import { useOSStore } from '@/os/window-manager/store';
import { profile } from '@/content/profile';
import VintageKeyboard, { KEY_CHAR_MAP } from '@/components/vintage-keyboard';

interface RoomSceneProps {
  onHandoffComplete: () => void;
}

// -------------------------------------------------------------
// 1. Monitor Model (Realistic Flat Monitor)
// -------------------------------------------------------------

function MonitorModel() {
  const { scene } = useGLTF('/assets/monitor.glb');
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        // Make the flat screen mesh pitch matte slate to avoid any light bleed behind HTML
        if (node.name === 'Cube001_Material004_0') {
          (node as THREE.Mesh).material = new THREE.MeshBasicMaterial({
            color: 0x111315,
          });
        }
      }
    });
    return c;
  }, [scene]);

  // Centered so the stand sits directly on the desk at y = 0,
  // and the screen center is aligned at local [0, 0.329, 0] facing +Z towards camera
  return (
    <group position={[0, 0, -0.22]}>
      <group
        scale={0.10}
        position={[-3.887889 * 0.10, 2.246532 * 0.10, 27.40401 * 0.10]}
      >
        <primitive object={cloned} />
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 2. Custom Gaming PC Model (FBXLoader with PBR Materials & Textures)
// -------------------------------------------------------------

function PCTowerModel() {
  const fbx = useLoader(FBXLoader, '/assets/custom gaming PC.fbx');

  const cloned = useMemo(() => {
    const c = fbx.clone(true);
    const textureLoader = new THREE.TextureLoader();

    // Load available extracted textures
    const moboMap = textureLoader.load('/assets/textures/ROG_maximus_xiii.jpg');
    const fanMap = textureLoader.load('/assets/textures/case fan.png');
    const aioMap = textureLoader.load('/assets/textures/deepcool aio.png');
    const logoMap = textureLoader.load('/assets/textures/GamerStorm_logo.png');
    const rgbMap = textureLoader.load('/assets/textures/RGB_TEXTURE.png');
    const psuSideMap = textureLoader.load('/assets/textures/corsairpsuside.jpg');
    const hddMap = textureLoader.load('/assets/textures/hdd.jpg');

    [moboMap, fanMap, aioMap, logoMap, rgbMap, psuSideMap, hddMap].forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
    });

    c.traverse((node) => {
      // 1. Hide the author's huge floor slab platform
      if (node.name === 'Cube') {
        node.visible = false;
        return;
      }

      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        const name = mesh.name;
        const mat = mesh.material;
        const matName = Array.isArray(mat) ? mat[0]?.name : mat?.name;

        // 2. Tempered Glass Side Panel (Cube154 / Material.003)
        if (name === 'Cube154' || matName === 'Material.003') {
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(0x181a1e),
            transparent: true,
            opacity: 0.28,
            roughness: 0.05,
            metalness: 0.1,
            transmission: 0.88,
            ior: 1.52,
            reflectivity: 0.9,
            clearcoat: 1.0,
            clearcoatRoughness: 0.03,
            depthWrite: false,
          });
          mesh.castShadow = false;
          mesh.receiveShadow = true;
          return;
        }

        // 3. Main PC Case Chassis & PSU Shroud (Cube007, Cube002, Material.006)
        if (name === 'Cube007' || name === 'Cube002' || matName === 'Material.006') {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x1a1c20),
            roughness: 0.38,
            metalness: 0.85,
          });
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          return;
        }

        // 4. Case Feet / Base Trim (Cube003, Material.002)
        if (name === 'Cube003' || matName === 'Material.002') {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x121416),
            roughness: 0.7,
            metalness: 0.35,
          });
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          return;
        }

        // 5. Motherboard PCB (Cube009, Material.001)
        if (name === 'Cube009' || matName === 'Material.001') {
          mesh.material = new THREE.MeshStandardMaterial({
            map: moboMap,
            roughness: 0.5,
            metalness: 0.25,
          });
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          return;
        }

        // 6. Case Fans (Cylinders 045, 055, 065, 075, 085, 095, Material.037, Material.040, Material.043)
        if (
          matName === 'Material.037' ||
          matName === 'Material.040' ||
          matName === 'Material.043' ||
          name.startsWith('Cylinder04') ||
          name.startsWith('Cylinder05') ||
          name.startsWith('Cylinder06') ||
          name.startsWith('Cylinder07') ||
          name.startsWith('Cylinder08') ||
          name.startsWith('Cylinder09')
        ) {
          mesh.material = new THREE.MeshStandardMaterial({
            map: fanMap,
            roughness: 0.35,
            metalness: 0.2,
            transparent: true,
          });
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          return;
        }

        // 7. GamerStorm / AIO Cooler Logo & Pump
        if (name.includes('GamerStorm') || matName?.includes('GamerStorm') || name.includes('logo')) {
          mesh.material = new THREE.MeshStandardMaterial({
            map: logoMap,
            roughness: 0.25,
            metalness: 0.7,
            emissive: new THREE.Color(0x286ca8),
            emissiveIntensity: 0.5,
          });
          mesh.castShadow = true;
          return;
        }

        // 8. HDD Bay (Cube008, Cube001, Material.007)
        if (matName === 'Material.007') {
          mesh.material = new THREE.MeshStandardMaterial({
            map: hddMap,
            roughness: 0.45,
            metalness: 0.6,
          });
          mesh.castShadow = true;
          return;
        }

        // 9. RAM RGB / Lighting Heatsinks (Material.027, Material.033, Material.056)
        if (matName === 'Material.027' || matName === 'Material.033' || matName === 'Material.056') {
          mesh.material = new THREE.MeshStandardMaterial({
            map: rgbMap,
            roughness: 0.3,
            metalness: 0.6,
            emissive: new THREE.Color(0x1a4568),
            emissiveIntensity: 0.45,
          });
          mesh.castShadow = true;
          return;
        }

        // 10. Default / Other Internal Hardware Components (GPU shroud, heatpipes, screws, cables)
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mat && !Array.isArray(mat) && mat.type === 'MeshPhongMaterial') {
          const phong = mat as THREE.MeshPhongMaterial;
          mesh.material = new THREE.MeshStandardMaterial({
            color: phong.color,
            map: phong.map,
            roughness: 0.4,
            metalness: 0.65,
          });
        }
      }
    });

    return c;
  }, [fbx]);

  const SCALE = 0.00085;

  return (
    <group position={[0.76, 0, -0.12]} rotation={[0, Math.PI / 5.5, 0]}>
      {/* Offsets PC base to y = 0 and centers X/Z relative to group */}
      <group
        scale={SCALE}
        position={[-854.44 * SCALE, 284.14 * SCALE, -79.86 * SCALE]}
      >
        <primitive object={cloned} />
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 3. Vintage Keyboard on Desk (Elevated 3D Base & Angled Wedge)
// -------------------------------------------------------------

interface KeyboardOnDeskProps {
  onKeyAction: (keyId: string) => void;
}

function KeyboardOnDesk({ onKeyAction }: KeyboardOnDeskProps) {
  const INCLINE = 0.11; // ~6.3 degrees authentic typing angle

  return (
    <group position={[-0.05, 0.0035, 0.18]}>
      {/* 1. Physical Contact Drop Shadow onto Desk Mat */}
      <mesh position={[0, 0.0003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.385, 0.155]} />
        <meshBasicMaterial color="#080706" opacity={0.4} transparent depthWrite={false} />
      </mesh>

      {/* 2. Silicone Bumper Feet (4 Corners) */}
      <mesh position={[-0.175, 0.0015, -0.058]}>
        <cylinderGeometry args={[0.006, 0.006, 0.0025, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      <mesh position={[0.175, 0.0015, -0.058]}>
        <cylinderGeometry args={[0.006, 0.006, 0.0025, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      <mesh position={[-0.175, 0.0015, 0.058]}>
        <cylinderGeometry args={[0.006, 0.006, 0.0025, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      <mesh position={[0.175, 0.0015, 0.058]}>
        <cylinderGeometry args={[0.006, 0.006, 0.0025, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>

      {/* 3. Solid Angled Wedge Chassis (Anodized Dark Walnut Finish) */}
      <group position={[0, 0.008, 0]} rotation={[INCLINE, 0, 0]}>
        {/* Main Wedge Body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.375, 0.012, 0.142]} />
          <meshStandardMaterial color="#221b16" roughness={0.45} metalness={0.2} />
        </mesh>

        {/* Front Lip Bevel (Chamfered edge where wrist rests) */}
        <mesh position={[0, -0.002, 0.071]} rotation={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.375, 0.005, 0.008]} />
          <meshStandardMaterial color="#2a221b" roughness={0.4} metalness={0.25} />
        </mesh>

        {/* Rear Riser Bar (Top accent edge) */}
        <mesh position={[0, 0.004, -0.071]} castShadow>
          <boxGeometry args={[0.375, 0.005, 0.006]} />
          <meshStandardMaterial color="#1a1512" roughness={0.5} metalness={0.3} />
        </mesh>

        {/* Left Chamfer Wall */}
        <mesh position={[-0.187, 0, 0]} rotation={[0, 0, 0.25]} castShadow>
          <boxGeometry args={[0.004, 0.012, 0.142]} />
          <meshStandardMaterial color="#28201a" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Right Chamfer Wall */}
        <mesh position={[0.187, 0, 0]} rotation={[0, 0, -0.25]} castShadow>
          <boxGeometry args={[0.004, 0.012, 0.142]} />
          <meshStandardMaterial color="#28201a" roughness={0.4} metalness={0.2} />
        </mesh>
      </group>

      {/* 4. Recessed HTML Mechanical Keyboard resting on Wedge Top */}
      <group position={[0, 0.015, 0]} rotation={[-Math.PI / 2 + INCLINE, 0, 0]}>
        <Html
          transform
          distanceFactor={0.175}
          pointerEvents="auto"
          style={{
            transformOrigin: 'center center',
          }}
        >
          <div
            style={{
              width: 820,
              minWidth: 820,
              filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.45)) drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
            className="pointer-events-auto select-none opacity-95 hover:opacity-100 transition-opacity"
          >
            <VintageKeyboard embedded={true} onKeyAction={onKeyAction} />
          </div>
        </Html>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 3b. Stitched Cloth Gaming Desk Mat (Centered Under Peripherals)
// -------------------------------------------------------------

function DeskMat() {
  const deskMatTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load('/assets/desk-mat.jpg');
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return tex;
  }, []);

  const weaveBump = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#9e9e9e';
    for (let x = 0; x < 32; x += 4) {
      for (let y = 0; y < 32; y += 4) {
        if ((x + y) % 8 === 0) ctx.fillRect(x, y, 2, 2);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(64, 30);
    return tex;
  }, []);

  // Mat dimensions: 0.94m wide x 0.42m deep x 0.0035m thick (authentic 900x400 extended gaming pad)
  return (
    <group position={[0.08, 0, 0.18]}>
      {/* Heavy-duty stitched anti-fray border rim */}
      <mesh position={[0, 0.0016, 0]} receiveShadow>
        <boxGeometry args={[0.944, 0.0032, 0.424]} />
        <meshStandardMaterial color="#1a1614" roughness={0.92} metalness={0.05} />
      </mesh>

      {/* Textured cloth mat surface with art print & weave bump */}
      <mesh position={[0, 0.0033, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.938, 0.418]} />
        <meshStandardMaterial
          map={deskMatTexture}
          bumpMap={weaveBump || undefined}
          bumpScale={0.0007}
          roughness={0.82}
          metalness={0.04}
        />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 3c. Realistic 3D Gaming Mouse (GLB Model)
// -------------------------------------------------------------

function GamingMouse() {
  const { scene } = useGLTF('/assets/mouse.glb');
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  const SCALE = 1.15;
  // minY = -0.003129, top of desk mat is at y = 0.0035
  const yPos = 0.0035 - (-0.003129 * SCALE);

  return (
    <group position={[0.32, yPos, 0.18]} rotation={[0, Math.PI - 0.08, 0]} scale={SCALE}>
      <primitive object={cloned} />
      {/* Subtle underglow accent on desk mat under mouse */}
      <pointLight position={[0, 0.015, -0.01]} intensity={0.35} distance={0.15} color="#3584DE" />
    </group>
  );
}

// -------------------------------------------------------------
// 4. Flat Screen Login UI (Bezel-to-Bezel Alignment on Monitor)
// -------------------------------------------------------------

interface ScreenUIProps {
  visitorName: string;
  setVisitorName: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  activeField: 'visitor' | 'password';
  setActiveField: (field: 'visitor' | 'password') => void;
  isUnlocked: boolean;
  setIsUnlocked: (unlocked: boolean) => void;
  isTransitioning: boolean;
  onLogin: () => void;
  onScreenClick?: () => void;
}

function MonitorScreenUI({
  visitorName,
  setVisitorName,
  password,
  setPassword,
  activeField,
  setActiveField,
  isUnlocked,
  setIsUnlocked,
  isTransitioning,
  onLogin,
  onScreenClick,
}: ScreenUIProps) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  const visitorInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      setDateStr(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isUnlocked && activeField === 'visitor') {
      const timer = setTimeout(() => visitorInputRef.current?.focus(), 200);
      return () => clearTimeout(timer);
    }
  }, [isUnlocked, activeField]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  // Screen mesh: 0.744m wide x 0.452m high
  // distanceFactor = 0.4 => 1px = 1mm => 744px x 452px fits the bezel with zero distortion or skew
  return (
    <group position={[0, 0.329, -0.217]} rotation={[0, 0, 0]}>
      <Html
        transform
        distanceFactor={0.4}
        pointerEvents="auto"
        style={{
          transformOrigin: 'center center',
        }}
      >
        <div
          style={{
            width: 744,
            height: 452,
            boxSizing: 'border-box',
          }}
          className="relative w-[744px] h-[452px] select-none font-sans overflow-hidden bg-[#111315] border border-[#22262B]"
          onClick={() => {
            if (!isUnlocked) setIsUnlocked(true);
            onScreenClick?.();
          }}
        >
          {/* 1. Full-Bleed Car Wallpaper with bg-cover bg-center */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
            style={{ backgroundImage: `url('/assets/lockscreen-wallpaper.jpg')` }}
          />

          {/* 2. Interactive Backdrop Blur Overlay when Unlocked */}
          <div
            className={`absolute inset-0 transition-all duration-500 ease-out flex flex-col justify-between ${
              isUnlocked
                ? 'backdrop-blur-xl bg-black/45 p-4'
                : 'backdrop-blur-none bg-black/15 p-5 cursor-pointer'
            }`}
          >
            {!isUnlocked ? (
              /* --- STATE A: CLEAN MINIMALIST WORK PC LOCK SCREEN --- */
              <div className="w-full h-full flex flex-col justify-between">
                {/* Top Subtle Status */}
                <div className="flex items-center justify-between text-[11px] text-white/70">
                  <span className="font-medium tracking-wide">Rudar OS</span>
                  <span className="text-[10px] text-white/50">Workstation</span>
                </div>

                {/* Minimalist Top-Center Clock & Date Widget with Clean White Typography */}
                <div className="flex flex-col items-center justify-center my-auto text-center select-none">
                  <span
                    style={{ textShadow: '0 4px 24px rgba(0,0,0,0.98), 0 2px 8px rgba(0,0,0,0.98)' }}
                    className="text-6xl font-black font-sans tracking-tight text-white leading-none"
                  >
                    {timeStr || '--:--'}
                  </span>
                  <span
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.98)' }}
                    className="text-xs font-semibold font-sans tracking-[0.2em] text-white/85 mt-2 uppercase"
                  >
                    {dateStr}
                  </span>
                </div>

                {/* Subtle Non-Boxy Unlock Indicator */}
                <div className="flex items-center justify-center pb-2">
                  <span
                    style={{ textShadow: '0 1px 8px rgba(0,0,0,0.95)' }}
                    className="text-[11px] font-sans font-medium tracking-wide text-white/90 animate-pulse"
                  >
                    Click or press any key to sign in
                  </span>
                </div>
              </div>
            ) : (
              /* --- STATE B: SLEEK BORDERLESS GLASSMORPHIC LOGIN CARD --- */
              <div className="w-full h-full flex flex-col justify-between animate-fadeIn">
                {/* Top Bar on Monitor Screen */}
                <header className="flex items-center justify-between px-2 pt-1">
                  <span className="text-[11px] font-medium text-white/80 font-sans">Rudar OS</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUnlocked(false);
                    }}
                    className="text-[11px] text-white/60 hover:text-white transition-colors cursor-pointer font-sans"
                  >
                    ← Lock
                  </button>
                </header>

                {/* Central Borderless Glassmorphic Card */}
                <main className="flex-1 flex flex-col items-center justify-center my-auto py-1">
                  <div className="w-full max-w-[270px] p-5 rounded-2xl bg-white/[0.08] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 text-center">
                    {/* Clean Avatar & Username */}
                    <div className="mb-3">
                      <img
                        src="/assets/rudar-avatar.jpg"
                        alt="Rudar Sharma"
                        className="w-14 h-14 rounded-full object-cover border-2 border-white/30 shadow-lg mx-auto mb-1.5"
                      />
                      <h1 className="text-xs font-semibold text-white tracking-normal font-sans">
                        Rudar Sharma
                      </h1>
                      <p className="text-[10px] text-white/70 font-sans">
                        Developer & Builder
                      </p>
                    </div>

                    {/* Flat Input Fields with Zero Heavy Boxy Borders */}
                    <form onSubmit={handleSubmit} className="space-y-2.5">
                      <div>
                        <input
                          ref={visitorInputRef}
                          type="text"
                          value={visitorName}
                          onChange={(e) => setVisitorName(e.target.value)}
                          onFocus={() => setActiveField('visitor')}
                          placeholder="Visitor Name"
                          disabled={isTransitioning}
                          className="w-full px-2.5 py-1.5 text-xs bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.16] border-0 border-b border-white/20 focus:border-white/80 rounded-t-sm text-white placeholder:text-white/40 focus:outline-none transition-all duration-quick"
                        />
                      </div>

                      <div>
                        <input
                          ref={passwordInputRef}
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setActiveField('password')}
                          placeholder="Password"
                          disabled={isTransitioning}
                          className="w-full px-2.5 py-1.5 text-xs bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.16] border-0 border-b border-white/20 focus:border-white/80 rounded-t-sm text-white placeholder:text-white/40 focus:outline-none transition-all duration-quick"
                        />
                        <p className="text-[8.5px] text-white/50 mt-1 italic text-left">
                          Any password works. Please do not type a real one.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isTransitioning}
                        className="w-full py-1.5 px-3 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium transition-all duration-quick flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-2 shadow-lg backdrop-blur-md"
                      >
                        {isTransitioning ? (
                          <>
                            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Signing In...</span>
                          </>
                        ) : (
                          <span>Sign In →</span>
                        )}
                      </button>
                    </form>
                  </div>
                </main>

                {/* Bottom Footer on Monitor Screen */}
                <footer className="flex items-center justify-center px-2 pb-1 text-[9px] text-white/50">
                  <span>Delhi AI Grand Hackathon • Top 140</span>
                </footer>
              </div>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
}

// -------------------------------------------------------------
// 5a. Room Structure (User's Custom Background & New Floor Image)
// -------------------------------------------------------------

function RoomStructure() {
  const wallTexture = useLoader(THREE.TextureLoader, '/assets/room-wall-bg.jpg');
  wallTexture.colorSpace = THREE.SRGBColorSpace;

  const floorTexture = useLoader(THREE.TextureLoader, '/assets/floor-new.jpg');
  floorTexture.colorSpace = THREE.SRGBColorSpace;
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(6, 4);

  return (
    <group>
      {/* Seamless Wall Extension to fill any extra space on ultrawide viewports */}
      <mesh position={[0, 1.2, -1.26]}>
        <planeGeometry args={[28, 16]} />
        <meshBasicMaterial color="#201524" />
      </mesh>

      {/* 1. Main Artwork Wall: Mountain, Crescent Moon, Cherry Blossoms & Sunset */}
      <mesh position={[0, 1.08, -1.24]} receiveShadow>
        <planeGeometry args={[6.4, 3.7]} />
        <meshStandardMaterial
          map={wallTexture}
          roughness={0.75}
          metalness={0.03}
        />
      </mesh>

      {/* Deep Wall Skirting Board / Baseboard */}
      <mesh position={[0, -0.73, -1.22]}>
        <boxGeometry args={[28, 0.06, 0.04]} />
        <meshStandardMaterial color="#1C1420" roughness={0.8} />
      </mesh>

      {/* 2. New Floor Design covering all floor space seamlessly */}
      <mesh position={[0, -0.76, 2.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 16]} />
        <meshStandardMaterial
          map={floorTexture}
          roughness={0.4}
          metalness={0.06}
        />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 5b. Modern Studio Desk with Speakers & Warm Amber Orb Lamps
// -------------------------------------------------------------

function StudioDesk() {
  return (
    <group position={[0, 0, -0.02]}>
      {/* Tabletop: 1.84m wide x 0.82m deep x 0.036m thick at y = 0.0 */}
      <mesh position={[0, -0.018, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.84, 0.036, 0.82]} />
        <meshStandardMaterial color="#D8B58D" roughness={0.5} metalness={0.08} />
      </mesh>

      {/* Under-table Support Apron & Crossbar */}
      <mesh position={[0, -0.046, 0]} castShadow>
        <boxGeometry args={[1.60, 0.024, 0.64]} />
        <meshStandardMaterial color="#1E2026" roughness={0.6} />
      </mesh>
      {/* Horizontal Stretcher Bar between legs */}
      <mesh position={[0, -0.42, -0.05]} castShadow>
        <boxGeometry args={[1.45, 0.028, 0.028]} />
        <meshStandardMaterial color="#1E2026" roughness={0.6} />
      </mesh>

      {/* Architectural Angled Trestle Legs (Front & Back) */}
      {[
        [-0.72, 0],
        [0.72, 0],
      ].map(([legX, legZ], lIdx) => (
        <group key={lIdx} position={[legX, -0.38, legZ]}>
          {/* Main Angled Column */}
          <mesh rotation={[0, 0, legX > 0 ? -0.12 : 0.12]} castShadow>
            <boxGeometry args={[0.045, 0.72, 0.14]} />
            <meshStandardMaterial color="#1E2026" roughness={0.5} metalness={0.7} />
          </mesh>
          {/* Bottom Foot Stabilizer on Floor */}
          <mesh position={[0, -0.36, 0]} receiveShadow>
            <boxGeometry args={[0.06, 0.024, 0.62]} />
            <meshStandardMaterial color="#1E2026" roughness={0.5} metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* ================= OFFICIAL LOGITECH AUDIO ACCESSORY SPEAKERS ================= */}
      {/* Left & Right Logitech Speakers flanking the center monitor */}
      <LogitechSpeaker position={[-0.46, 0.0, -0.16]} rotation={[0, 0.22, 0]} />
      <LogitechSpeaker position={[0.46, 0.0, -0.16]} rotation={[0, -0.22, 0]} />

      {/* ================= OFFICIAL 3D DESK LAMP (ON LEFT OF TABLE) ================= */}
      <DeskLamp position={[-0.66, 0.0, -0.14]} rotation={[0, 0.45, 0]} scale={0.14} />
    </group>
  );
}

// -------------------------------------------------------------
// 5c. Official 3D Desk Lamp Accessory Component
// -------------------------------------------------------------

function DeskLamp({
  position = [-0.66, 0.0, -0.14],
  rotation = [0, 0.45, 0],
  scale = 0.14,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF('/assets/accessories/desk_lamp.glb');
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={cloned} />
      {/* Motivated Warm Amber Glow from Lamp Shade */}
      <pointLight
        position={[0.51, 1.68, 0.0]}
        color="#FFE6C2"
        intensity={2.8}
        distance={2.4}
        decay={2}
      />
    </group>
  );
}

// -------------------------------------------------------------
// 5c. Official Logitech Audio Speaker Accessory Component
// -------------------------------------------------------------

function LogitechSpeaker({
  position,
  rotation = [0, 0, 0],
  scale = 0.70,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF('/assets/accessories/logitech_audio_speaker.glb');
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  // Model size is [0.2589, 0.2884, 0.1196]. Sits firmly flush on the tabletop surface with zero floating gap
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={cloned} position={[0, -0.015, 0]} />
    </group>
  );
}

// -------------------------------------------------------------
// 5d. Official Gaming Chair Accessory Component (In front of desk on right)
// -------------------------------------------------------------

function GamingChair() {
  const { scene } = useGLTF('/assets/accessories/gaming_chair_free_download.glb');
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  return (
    <group position={[0.68, -0.76, 0.76]} rotation={[0, -Math.PI * 0.75, 0]} scale={0.00235}>
      <primitive object={cloned} position={[0, -34.54, 0]} />
    </group>
  );
}

// -------------------------------------------------------------
// 5e. Room Environment Assembly & Motivated Lighting
// -------------------------------------------------------------

function RoomEnvironment() {
  return (
    <group>
      {/* 1. Full-Coverage Anime Mountain Sunset Wall Background & Hardwood Floor */}
      <RoomStructure />

      {/* 2. Modern Clean Wooden Studio Desk (at y = 0) with Logitech Speakers */}
      <StudioDesk />

      {/* 3. Official Gaming Chair in Front of Desk on Right Side */}
      <GamingChair />

      {/* 4. Motivated Atmosphere Lighting */}
      {/* Soft Ambient Fill */}
      <ambientLight intensity={1.35} color="#4A3450" />

      {/* Direct Key Light from upper right */}
      <directionalLight
        position={[3.5, 4.5, 3.5]}
        intensity={2.2}
        color="#FFF6EE"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.001}
      />

      {/* Gaming PC Tower Interior RGB Glow */}
      <pointLight position={[0.74, 0.22, -0.10]} intensity={1.8} distance={1.8} color="#3A8AE2" />

      {/* Screen Spill Glow onto Desk */}
      <pointLight position={[0, 0.35, 0.05]} intensity={0.9} distance={2.2} color="#C49B72" />
    </group>
  );
}

// -------------------------------------------------------------
// 6. Camera Controller with Dual View Modes (Room Overview & Desk Close-up)
// -------------------------------------------------------------

function CameraController({
  isTransitioning,
  viewMode,
  onComplete,
}: {
  isTransitioning: boolean;
  viewMode: 'room' | 'desk';
  onComplete: () => void;
}) {
  const { camera } = useThree();
  const startTimeRef = useRef<number | null>(null);

  // Full Room View pose
  const roomPos = useMemo(() => new THREE.Vector3(0.06, 0.28, 2.75), []);
  const roomLookAt = useMemo(() => new THREE.Vector3(0.06, 0.16, -0.20), []);

  // Desk Close-up pose
  const deskPos = useMemo(() => new THREE.Vector3(0, 0.58, 1.25), []);
  const deskLookAt = useMemo(() => new THREE.Vector3(0, 0.22, -0.08), []);

  // Target camera pose on sign-in: ~90% framing where monitor bezels remain visible!
  const targetPos = useMemo(() => new THREE.Vector3(0, 0.329, 0.42), []);
  const targetLookAt = useMemo(() => new THREE.Vector3(0, 0.329, -0.218), []);

  const currentLookAt = useRef(new THREE.Vector3().copy(roomLookAt));
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useFrame((state) => {
    if (isTransitioning) {
      if (startTimeRef.current === null) {
        startTimeRef.current = state.clock.getElapsedTime();
      }
      const elapsed = state.clock.getElapsedTime() - startTimeRef.current;
      const DURATION = 1.15; // seconds
      const p = Math.min(1, elapsed / DURATION);

      // Deceleration cubic curve
      const eased = 1 - Math.pow(1 - p, 3);

      const baseStartPos = viewMode === 'room' ? roomPos : deskPos;
      const baseStartLookAt = viewMode === 'room' ? roomLookAt : deskLookAt;

      camera.position.lerpVectors(baseStartPos, targetPos, eased);
      currentLookAt.current.lerpVectors(baseStartLookAt, targetLookAt, eased);
      camera.lookAt(currentLookAt.current);

      if (p >= 1) {
        onComplete();
      }
    } else {
      const activeBasePos = viewMode === 'room' ? roomPos : deskPos;
      const activeLookAt = viewMode === 'room' ? roomLookAt : deskLookAt;

      // Gentle parallax when hovering/looking around
      const parallaxFactor = viewMode === 'room' ? 0.05 : 0.035;
      const targetX = activeBasePos.x + mouseRef.current.x * parallaxFactor;
      const targetY = activeBasePos.y - mouseRef.current.y * (parallaxFactor * 0.6);

      camera.position.x += (targetX - camera.position.x) * 0.06;
      camera.position.y += (targetY - camera.position.y) * 0.06;
      camera.position.z += (activeBasePos.z - camera.position.z) * 0.06;

      currentLookAt.current.lerp(activeLookAt, 0.06);
      camera.lookAt(currentLookAt.current);
    }
  });

  return null;
}

// -------------------------------------------------------------
// 7. Main RoomScene Component
// -------------------------------------------------------------

export function RoomScene({ onHandoffComplete }: RoomSceneProps) {
  const { login } = useOSStore();
  const [visitorName, setVisitorName] = useState('');
  const [password, setPassword] = useState('');
  const [activeField, setActiveField] = useState<'visitor' | 'password'>('visitor');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [viewMode, setViewMode] = useState<'room' | 'desk'>('room');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Preload 3D models and textures for instant readiness
    useGLTF.preload('/assets/monitor.glb');
    useGLTF.preload('/assets/mouse.glb');
    useGLTF.preload('/assets/accessories/logitech_audio_speaker.glb');
    useGLTF.preload('/assets/accessories/gaming_chair_free_download.glb');
    useLoader.preload(FBXLoader, '/assets/custom gaming PC.fbx');
    useLoader.preload(THREE.TextureLoader, '/assets/room-wall-bg.jpg');
    useLoader.preload(THREE.TextureLoader, '/assets/floor-new.jpg');
  }, []);

  const handleLogin = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
  }, [isTransitioning]);

  const handleComplete = () => {
    login(visitorName);
    onHandoffComplete();
  };

  // Virtual key action callback from VintageKeyboard:
  // Handles clicks on virtual keys and typing on physical keyboard when input is not focused
  const handleKeyAction = useCallback((keyId: string) => {
    if (!isUnlocked) {
      setIsUnlocked(true);
      return;
    }

    if (keyId === 'enter') {
      if (activeField === 'visitor' && visitorName.trim().length > 0) {
        setActiveField('password');
      } else {
        handleLogin();
      }
      return;
    }

    if (keyId === 'tab') {
      setActiveField((prev) => (prev === 'visitor' ? 'password' : 'visitor'));
      return;
    }

    if (keyId === 'backspace') {
      if (activeField === 'visitor') {
        setVisitorName((prev) => prev.slice(0, -1));
      } else {
        setPassword((prev) => prev.slice(0, -1));
      }
      return;
    }

    if (keyId === 'space') {
      if (activeField === 'visitor') {
        setVisitorName((prev) => prev + ' ');
      } else {
        setPassword((prev) => prev + ' ');
      }
      return;
    }

    const charInfo = KEY_CHAR_MAP[keyId];
    if (charInfo) {
      if (activeField === 'visitor') {
        setVisitorName((prev) => prev + charInfo.normal);
      } else {
        setPassword((prev) => prev + charInfo.normal);
      }
    }
  }, [isUnlocked, activeField, visitorName, handleLogin]);

  if (!isMounted) {
    return (
      <div className="fixed inset-0 bg-[#111315] flex flex-col items-center justify-center text-[#9E9E98] z-50 select-none">
        <div className="w-6 h-6 rounded-full border-2 border-[#C49B72] border-t-transparent animate-spin mb-3" />
        <span className="text-xs font-sans tracking-wide text-[#6E706E]">
          Loading 3D Studio...
        </span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-[#111315] overflow-hidden select-none">
      {/* 3D Canvas Scene */}
      <Canvas
        shadows
        camera={{ position: [0.06, 0.28, 2.75], fov: 44 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        className="w-full h-full"
      >
        <CameraController
          isTransitioning={isTransitioning}
          viewMode={viewMode}
          onComplete={handleComplete}
        />

        {/* 1. Complete Reference 3D Room Environment */}
        <RoomEnvironment />

        {/* 2. Custom Imported 3D Hardware Models (Mounted on Clean Desk Surface at y = 0) */}
        <Suspense fallback={null}>
          <MonitorModel />
          <PCTowerModel />
          <DeskMat />
          <KeyboardOnDesk onKeyAction={handleKeyAction} />
          <GamingMouse />
          <MonitorScreenUI
            visitorName={visitorName}
            setVisitorName={setVisitorName}
            password={password}
            setPassword={setPassword}
            activeField={activeField}
            setActiveField={setActiveField}
            isUnlocked={isUnlocked}
            setIsUnlocked={setIsUnlocked}
            isTransitioning={isTransitioning}
            onLogin={handleLogin}
            onScreenClick={() => {
              if (viewMode === 'room') setViewMode('desk');
            }}
          />
        </Suspense>
      </Canvas>

      {/* Floating View Mode Switcher */}
      <div className="absolute bottom-4 left-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setViewMode((prev) => (prev === 'room' ? 'desk' : 'room'))}
          className="text-xs text-[#E2DCF0] hover:text-[#FFFFFF] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2A1E46]/85 border border-[#4E3978] backdrop-blur-sm cursor-pointer shadow-lg font-medium"
          title={viewMode === 'room' ? 'Zoom to Desk View' : 'Zoom to Room View'}
        >
          <span>{viewMode === 'room' ? '🖥️' : '🏠'}</span>
          <span>{viewMode === 'room' ? 'Desk View' : 'Room View'}</span>
        </button>
      </div>
    </div>
  );
}

useGLTF.preload('/assets/monitor.glb');
useGLTF.preload('/assets/accessories/logitech_audio_speaker.glb');
useGLTF.preload('/assets/accessories/gaming_chair_free_download.glb');
useGLTF.preload('/assets/accessories/desk_lamp.glb');

export default RoomScene;
