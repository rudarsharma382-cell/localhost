import { create } from 'zustand';

export type CarModelId = 'porsche' | 'lamborghini' | 'mclaren';
export type PaintFinish = 'gloss' | 'metallic' | 'matte' | 'satin';
export type WheelFinish = 'silver' | 'black' | 'bronze' | 'gunmetal';
export type CameraView = 'default' | 'front' | 'side' | 'rear' | 'top';

export interface CarSpecs {
  name: string;
  brand: string;
  badge: string;
  engine: string;
  power: string;
  acceleration: string;
  topSpeed: string;
  drivetrain: string;
  modelUrl: string;
  defaultColor: string;
  scale: number;
  rotation?: [number, number, number];
}

export const CAR_MODELS: Record<CarModelId, CarSpecs> = {
  porsche: {
    name: 'Porsche 911 Carrera 4S',
    brand: 'Porsche',
    badge: 'Stuttgart • 992 Generation',
    engine: '3.0L Twin-Turbo Flat-6',
    power: '443 HP @ 6,500 RPM',
    acceleration: '3.2s (0-60 mph)',
    topSpeed: '190 mph (306 km/h)',
    drivetrain: 'All-Wheel Drive (AWD)',
    modelUrl: '/assets/cars/porsche_911_carrera_4s.glb',
    defaultColor: '#DC2626', // Racing Red
    scale: 1.0,
    rotation: [0, 0, 0],
  },
  lamborghini: {
    name: 'Lamborghini Revuelto',
    brand: 'Lamborghini',
    badge: 'Sant’Agata Bolognese • V12 Hybrid HPEV',
    engine: '6.5L Naturally Aspirated V12 + 3 E-Motors',
    power: '1,001 HP Combined',
    acceleration: '2.5s (0-60 mph)',
    topSpeed: '217 mph (350 km/h)',
    drivetrain: 'Electric All-Wheel Drive (E-AWD)',
    modelUrl: '/assets/cars/lamborghini_revuelto.glb',
    defaultColor: '#111113', // Obsidian Black
    scale: 1.0,
    rotation: [0, 0, 0],
  },
  mclaren: {
    name: 'McLaren P1',
    brand: 'McLaren',
    badge: 'Woking, Surrey • Ultimate Series Hypercar',
    engine: '3.8L Twin-Turbo V8 + Lightweight E-Motor',
    power: '903 HP Combined',
    acceleration: '2.7s (0-60 mph)',
    topSpeed: '217 mph (350 km/h)',
    drivetrain: 'Mid-Engine, Rear-Wheel Drive (RWD)',
    modelUrl: '/assets/cars/mclaren_p1.glb',
    defaultColor: '#94A3B8', // Liquid Silver
    scale: 1.0,
    rotation: [0, 0, 0],
  },
};

export interface PaintColorOption {
  name: string;
  hex: string;
}

export const PAINT_SWATCHES: PaintColorOption[] = [
  { name: 'Obsidian Black', hex: '#111113' },
  { name: 'Orchid Purple', hex: '#8B5CF6' },
  { name: 'Alpine White', hex: '#F8FAFC' },
  { name: 'Liquid Silver', hex: '#94A3B8' },
  { name: 'Racing Red', hex: '#DC2626' },
  { name: 'Acid Green', hex: '#84CC16' },
  { name: 'Miami Blue', hex: '#0EA5E9' },
  { name: 'Speed Yellow', hex: '#EAB308' },
];

export const UNDERGLOW_COLORS: PaintColorOption[] = [
  { name: 'Neon Cyan', hex: '#06B6D4' },
  { name: 'Deep Purple', hex: '#A855F7' },
  { name: 'Crimson Red', hex: '#EF4444' },
  { name: 'Acid Green', hex: '#22C55E' },
  { name: 'Amber Gold', hex: '#F59E0B' },
  { name: 'Ice White', hex: '#E0F2FE' },
];

export interface CarConfigState {
  selectedCar: CarModelId;
  paintColor: string;
  paintFinish: PaintFinish;
  roughness: number;
  metalness: number;
  wheelFinish: WheelFinish;
  caliperColor: string;
  spoilerActive: boolean;
  aeroKit: boolean;
  headlights: boolean;
  taillights: boolean;
  underglow: boolean;
  underglowColor: string;
  autoRotate: boolean;
  cameraView: CameraView;

  // Actions
  setSelectedCar: (car: CarModelId) => void;
  setPaintColor: (color: string) => void;
  setPaintFinish: (finish: PaintFinish) => void;
  setRoughness: (roughness: number) => void;
  setMetalness: (metalness: number) => void;
  setWheelFinish: (finish: WheelFinish) => void;
  setCaliperColor: (color: string) => void;
  toggleSpoiler: () => void;
  toggleAeroKit: () => void;
  toggleHeadlights: () => void;
  toggleTaillights: () => void;
  toggleUnderglow: () => void;
  setUnderglowColor: (color: string) => void;
  toggleAutoRotate: () => void;
  setCameraView: (view: CameraView) => void;
  resetToDefaults: () => void;
}

export const useCarConfigStore = create<CarConfigState>((set, get) => ({
  selectedCar: 'porsche',
  paintColor: '#DC2626',
  paintFinish: 'metallic',
  roughness: 0.25,
  metalness: 0.88,
  wheelFinish: 'silver',
  caliperColor: '#DC2626',
  spoilerActive: true,
  aeroKit: true,
  headlights: true,
  taillights: true,
  underglow: true,
  underglowColor: '#06B6D4',
  autoRotate: false,
  cameraView: 'default',

  setSelectedCar: (car: CarModelId) => {
    const spec = CAR_MODELS[car];
    set({
      selectedCar: car,
      paintColor: spec.defaultColor,
    });
  },

  setPaintColor: (color: string) => set({ paintColor: color }),

  setPaintFinish: (finish: PaintFinish) => {
    let roughness = 0.25;
    let metalness = 0.88;
    if (finish === 'gloss') {
      roughness = 0.12;
      metalness = 0.7;
    } else if (finish === 'metallic') {
      roughness = 0.25;
      metalness = 0.95;
    } else if (finish === 'matte') {
      roughness = 0.75;
      metalness = 0.15;
    } else if (finish === 'satin') {
      roughness = 0.42;
      metalness = 0.45;
    }
    set({ paintFinish: finish, roughness, metalness });
  },

  setRoughness: (roughness: number) => set({ roughness }),
  setMetalness: (metalness: number) => set({ metalness }),
  setWheelFinish: (wheelFinish: WheelFinish) => set({ wheelFinish }),
  setCaliperColor: (caliperColor: string) => set({ caliperColor }),
  toggleSpoiler: () => set((s) => ({ spoilerActive: !s.spoilerActive })),
  toggleAeroKit: () => set((s) => ({ aeroKit: !s.aeroKit })),
  toggleHeadlights: () => set((s) => ({ headlights: !s.headlights })),
  toggleTaillights: () => set((s) => ({ taillights: !s.taillights })),
  toggleUnderglow: () => set((s) => ({ underglow: !s.underglow })),
  setUnderglowColor: (underglowColor: string) => set({ underglowColor }),
  toggleAutoRotate: () => set((s) => ({ autoRotate: !s.autoRotate })),
  setCameraView: (cameraView: CameraView) => set({ cameraView }),

  resetToDefaults: () => {
    const car = get().selectedCar;
    const spec = CAR_MODELS[car];
    set({
      paintColor: spec.defaultColor,
      paintFinish: 'metallic',
      roughness: 0.25,
      metalness: 0.88,
      wheelFinish: 'silver',
      caliperColor: '#DC2626',
      spoilerActive: true,
      aeroKit: true,
      headlights: true,
      taillights: true,
      underglow: true,
      underglowColor: '#06B6D4',
      autoRotate: false,
      cameraView: 'default',
    });
  },
}));

