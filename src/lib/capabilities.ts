/**
 * Client Hardware & Capability Detection
 * Evaluates whether device can comfortably run WebGL2 3D scene or should use Lite Mode.
 * Rules: PRD Section 13
 */

export interface DeviceCapabilities {
  webgl2: boolean;
  saveData: boolean;
  isCoarsePointer: boolean;
  reducedMotion: boolean;
  deviceMemoryTier: 'high' | 'mid' | 'low';
  shouldUseLiteMode: boolean;
}

export function detectCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    return {
      webgl2: false,
      saveData: false,
      isCoarsePointer: false,
      reducedMotion: false,
      deviceMemoryTier: 'mid',
      shouldUseLiteMode: true,
    };
  }

  // 1. WebGL2 check
  let webgl2 = false;
  try {
    const canvas = document.createElement('canvas');
    webgl2 = !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
  } catch {
    webgl2 = false;
  }

  // 2. Reduced motion
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 3. Pointer type and width
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const isNarrow = window.innerWidth < 900;

  // 4. Save data check
  const nav = navigator as unknown as { connection?: { saveData?: boolean }; deviceMemory?: number; hardwareConcurrency?: number };
  const saveData = nav.connection?.saveData === true;

  // 5. Memory & Cores
  const mem = nav.deviceMemory || 8;
  const cores = nav.hardwareConcurrency || 4;

  const deviceMemoryTier: 'high' | 'mid' | 'low' = mem < 4 || cores <= 2 ? 'low' : mem >= 8 ? 'high' : 'mid';

  // Lite mode triggers per PRD Section 13:
  // - No WebGL2
  // - deviceMemory below 4 or cores <= 2
  // - saveData
  // - coarse pointer with width < 900px
  // - URL param ?mode=lite
  const urlParamLite = new URLSearchParams(window.location.search).get('mode') === 'lite';

  const shouldUseLiteMode =
    !webgl2 ||
    deviceMemoryTier === 'low' ||
    saveData ||
    (isCoarsePointer && isNarrow) ||
    urlParamLite;

  return {
    webgl2,
    saveData,
    isCoarsePointer,
    reducedMotion,
    deviceMemoryTier,
    shouldUseLiteMode,
  };
}
