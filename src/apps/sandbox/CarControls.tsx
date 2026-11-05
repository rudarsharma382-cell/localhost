'use client';

import React, { useState } from 'react';
import {
  useCarConfigStore,
  CAR_MODELS,
  CarModelId,
  PaintFinish,
  WheelFinish,
  CameraView,
  PAINT_SWATCHES,
  UNDERGLOW_COLORS,
} from './carStore';
import {
  Palette,
  Disc,
  Wind,
  Lightbulb,
  Camera,
  RotateCw,
  RotateCcw,
  Sparkles,
  Zap,
  Gauge,
  Sliders,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function CarControls() {
  const {
    selectedCar,
    setSelectedCar,
    paintColor,
    setPaintColor,
    paintFinish,
    setPaintFinish,
    roughness,
    setRoughness,
    metalness,
    setMetalness,
    wheelFinish,
    setWheelFinish,
    caliperColor,
    setCaliperColor,
    spoilerActive,
    toggleSpoiler,
    aeroKit,
    toggleAeroKit,
    headlights,
    toggleHeadlights,
    taillights,
    toggleTaillights,
    underglow,
    toggleUnderglow,
    underglowColor,
    setUnderglowColor,
    autoRotate,
    toggleAutoRotate,
    cameraView,
    setCameraView,
    resetToDefaults,
  } = useCarConfigStore();

  const [activeTab, setActiveTab] = useState<'paint' | 'wheels' | 'aero' | 'lighting' | 'camera'>(
    'paint'
  );
  const [isCollapsed, setIsCollapsed] = useState(false);

  const carSpec = CAR_MODELS[selectedCar];

  const FINISH_PRESETS: { id: PaintFinish; label: string }[] = [
    { id: 'gloss', label: 'Gloss Clear' },
    { id: 'metallic', label: 'Metallic Pearl' },
    { id: 'satin', label: 'Satin Sheen' },
    { id: 'matte', label: 'Stealth Matte' },
  ];

  const WHEEL_STYLES: { id: WheelFinish; label: string; desc: string }[] = [
    { id: 'silver', label: 'Silver Diamond Cut', desc: 'Forged polished alloy' },
    { id: 'black', label: 'Satin Matte Black', desc: 'Stealth competition rim' },
    { id: 'bronze', label: 'Bronze Championship', desc: 'Heritage race magnesium' },
    { id: 'gunmetal', label: 'Gunmetal Gray', desc: 'Deep titanium luster' },
  ];

  const CALIPER_SWATCHES = [
    { name: 'Racing Red', hex: '#DC2626' },
    { name: 'Acid Yellow', hex: '#EAB308' },
    { name: 'Cyber Cyan', hex: '#06B6D4' },
    { name: 'Vibrant Orange', hex: '#EA580C' },
  ];

  const CAMERA_VIEWS: { id: CameraView; label: string }[] = [
    { id: 'default', label: 'Hero 3/4' },
    { id: 'front', label: 'Front Grille' },
    { id: 'side', label: 'Side Profile' },
    { id: 'rear', label: 'Rear Wing' },
    { id: 'top', label: 'Top Aero' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none font-sans">
      {/* Top Bar: Car Model Switcher & Telemetry Specs */}
      <div className="pointer-events-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-zinc-950/85 backdrop-blur-xl border border-zinc-800/90 rounded-2xl p-3 px-4 shadow-2xl">
        {/* Model Tabs */}
        <div className="flex items-center gap-1.5 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
          {(Object.keys(CAR_MODELS) as CarModelId[]).map((carId) => {
            const spec = CAR_MODELS[carId];
            const isSelected = selectedCar === carId;
            return (
              <button
                key={carId}
                onClick={() => setSelectedCar(carId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-accent text-zinc-950 shadow-md scale-102 font-bold'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                }`}
              >
                <span>{spec.brand}</span>
                <span className="opacity-80 hidden sm:inline">{spec.name.replace(spec.brand, '')}</span>
              </button>
            );
          })}
        </div>

        {/* Live Specs Badges */}
        <div className="hidden lg:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Zap size={13} className="text-accent" />
            <span className="font-semibold">{carSpec.power}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Gauge size={13} className="text-accent" />
            <span className="font-semibold">{carSpec.acceleration}</span>
          </div>
          <div className="hidden xl:flex items-center gap-1.5 text-zinc-400">
            <span>Top:</span>
            <span className="text-zinc-200 font-semibold">{carSpec.topSpeed}</span>
          </div>
          <div className="hidden xl:flex items-center gap-1.5 text-zinc-500 text-[11px]">
            <span>{carSpec.drivetrain}</span>
          </div>
        </div>

        {/* Reset & Auto-Rotate Quick Toggles */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleAutoRotate}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
              autoRotate
                ? 'bg-accent/20 border-accent/40 text-accent font-semibold'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Toggle 360° Showroom Rotation"
          >
            <RotateCw size={13} className={autoRotate ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">360° Orbit</span>
          </button>
          <button
            onClick={resetToDefaults}
            className="p-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title="Reset Configuration to Factory Defaults"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Bottom Floating Control Dock */}
      {isCollapsed ? (
        <div
          onClick={() => setIsCollapsed(false)}
          className="pointer-events-auto self-center bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/90 rounded-full px-4 py-2 shadow-2xl flex items-center gap-2 cursor-pointer hover:bg-zinc-900 transition-all text-xs font-semibold text-zinc-200"
        >
          <Sliders size={13} className="text-accent" />
          <span>Customize Vehicle</span>
          <ChevronUp size={14} className="text-zinc-400" />
        </div>
      ) : (
        <div className="pointer-events-auto self-center w-full max-w-2xl bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 p-1 bg-zinc-900/50 text-xs gap-1">
            <div className="flex items-center justify-around flex-1 gap-0.5">
              <button
                onClick={() => setActiveTab('paint')}
                className={`flex-1 py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer font-medium text-[11px] sm:text-xs ${
                  activeTab === 'paint'
                    ? 'bg-accent/20 text-accent font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Palette size={12} />
                <span>Paint<span className="hidden sm:inline"> & Finish</span></span>
              </button>
              <button
                onClick={() => setActiveTab('wheels')}
                className={`flex-1 py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer font-medium text-[11px] sm:text-xs ${
                  activeTab === 'wheels'
                    ? 'bg-accent/20 text-accent font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Disc size={12} />
                <span>Wheels<span className="hidden sm:inline"> & Rims</span></span>
              </button>
              <button
                onClick={() => setActiveTab('aero')}
                className={`flex-1 py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer font-medium text-[11px] sm:text-xs ${
                  activeTab === 'aero'
                    ? 'bg-accent/20 text-accent font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Wind size={12} />
                <span>Aero<span className="hidden sm:inline"> & Mods</span></span>
              </button>
              <button
                onClick={() => setActiveTab('lighting')}
                className={`flex-1 py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer font-medium text-[11px] sm:text-xs ${
                  activeTab === 'lighting'
                    ? 'bg-accent/20 text-accent font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Lightbulb size={12} />
                <span>Lights<span className="hidden sm:inline"> / Neon</span></span>
              </button>
              <button
                onClick={() => setActiveTab('camera')}
                className={`flex-1 py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer font-medium text-[11px] sm:text-xs ${
                  activeTab === 'camera'
                    ? 'bg-accent/20 text-accent font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Camera size={12} />
                <span>Camera</span>
              </button>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors shrink-0"
              title="Minimize Controls"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="p-3 sm:p-4 max-h-56 overflow-y-auto no-scrollbar">
          {/* TAB 1: Paint & PBR */}
          {activeTab === 'paint' && (
            <div className="space-y-3.5">
              {/* Preset Swatches */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                    Factory Paint Palette
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: paintColor }} />
                    <span className="font-mono text-[11px]">{paintColor.toUpperCase()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {PAINT_SWATCHES.map((swatch) => {
                    const isSelected = paintColor.toLowerCase() === swatch.hex.toLowerCase();
                    return (
                      <button
                        key={swatch.name}
                        onClick={() => setPaintColor(swatch.hex)}
                        className={`w-7 h-7 rounded-full shrink-0 transition-transform cursor-pointer relative flex items-center justify-center border ${
                          isSelected
                            ? 'scale-120 ring-2 ring-accent border-white'
                            : 'border-white/20 hover:scale-110'
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                        title={swatch.name}
                      >
                        {isSelected && <Check size={12} className={swatch.hex === '#F8FAFC' ? 'text-black' : 'text-white'} />}
                      </button>
                    );
                  })}
                  {/* Custom Color Input */}
                  <label
                    className="w-7 h-7 rounded-full shrink-0 border border-white/20 hover:border-white/40 cursor-pointer overflow-hidden flex items-center justify-center bg-zinc-800"
                    title="Custom Paint Color"
                  >
                    <input
                      type="color"
                      value={paintColor}
                      onChange={(e) => setPaintColor(e.target.value)}
                      className="opacity-0 w-0 h-0 cursor-pointer"
                    />
                    <Sliders size={12} className="text-zinc-300" />
                  </label>
                </div>
              </div>

              {/* Finish Modes */}
              <div>
                <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Clearcoat & Finish
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FINISH_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPaintFinish(p.id)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                        paintFinish === p.id
                          ? 'bg-accent/20 border-accent/40 text-accent font-semibold'
                          : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Precision Sliders */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                    <span>Roughness</span>
                    <span className="font-mono">{roughness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.9"
                    step="0.01"
                    value={roughness}
                    onChange={(e) => setRoughness(parseFloat(e.target.value))}
                    className="w-full accent-accent h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                    <span>Metalness</span>
                    <span className="font-mono">{metalness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.01"
                    value={metalness}
                    onChange={(e) => setMetalness(parseFloat(e.target.value))}
                    className="w-full accent-accent h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Wheels & Rims */}
          {activeTab === 'wheels' && (
            <div className="space-y-3.5">
              <div>
                <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-2">
                  Alloy Rim Finishes
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {WHEEL_STYLES.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setWheelFinish(w.id)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                        wheelFinish === w.id
                          ? 'bg-accent/15 border-accent/40 text-zinc-100 font-semibold'
                          : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div>
                        <div className="text-xs">{w.label}</div>
                        <div className="text-[10px] text-zinc-500 font-normal">{w.desc}</div>
                      </div>
                      {wheelFinish === w.id && <Check size={14} className="text-accent shrink-0 ml-2" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brake Calipers Color */}
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-2">
                  Brembo Brake Calipers
                </span>
                <div className="flex items-center gap-2">
                  {CALIPER_SWATCHES.map((c) => {
                    const isSelected = caliperColor.toLowerCase() === c.hex.toLowerCase();
                    return (
                      <button
                        key={c.name}
                        onClick={() => setCaliperColor(c.hex)}
                        className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-800 border-accent text-zinc-100 font-semibold'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hex }} />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Aero & Mods */}
          {activeTab === 'aero' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Active Rear GT Wing Toggle */}
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">Active Rear GT Wing</div>
                    <div className="text-[10px] text-zinc-400">Carbon fiber high-downforce airfoil</div>
                  </div>
                  <button
                    onClick={toggleSpoiler}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      spoilerActive
                        ? 'bg-accent text-zinc-950 font-bold'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {spoilerActive ? 'Deployed' : 'Retracted'}
                  </button>
                </div>

                {/* Carbon Aero Splitter Kit Toggle */}
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">Carbon Aero Package</div>
                    <div className="text-[10px] text-zinc-400">Front splitter canards & side blades</div>
                  </div>
                  <button
                    onClick={toggleAeroKit}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      aeroKit
                        ? 'bg-accent text-zinc-950 font-bold'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {aeroKit ? 'Equipped' : 'Stock'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Illumination & Underglow */}
          {activeTab === 'lighting' && (
            <div className="space-y-3.5">
              {/* Primary Headlights / Taillights */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={toggleHeadlights}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    headlights
                      ? 'bg-sky-950/40 border-sky-500/50 text-sky-200 font-semibold'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <div>
                    <div className="text-xs">Matrix LED Headlights</div>
                    <div className="text-[10px] text-zinc-500">{headlights ? 'Projectors Active' : 'Off'}</div>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${headlights ? 'bg-sky-400 shadow-[0_0_8px_#38bdf8]' : 'bg-zinc-700'}`} />
                </button>

                <button
                  onClick={toggleTaillights}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    taillights
                      ? 'bg-red-950/40 border-red-500/50 text-red-200 font-semibold'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <div>
                    <div className="text-xs">Neon Tail Strip</div>
                    <div className="text-[10px] text-zinc-500">{taillights ? 'Emissive Active' : 'Off'}</div>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${taillights ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-zinc-700'}`} />
                </button>
              </div>

              {/* Underglow Neon Section */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                    <Sparkles size={13} className="text-accent" />
                    <span>Chassis Neon Underglow</span>
                  </div>
                  <button
                    onClick={toggleUnderglow}
                    className={`px-2.5 py-0.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      underglow
                        ? 'bg-accent text-zinc-950 font-bold'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {underglow ? 'ON' : 'OFF'}
                  </button>
                </div>

                {underglow && (
                  <div className="flex items-center gap-2 pt-1">
                    {UNDERGLOW_COLORS.map((u) => {
                      const isSelected = underglowColor.toLowerCase() === u.hex.toLowerCase();
                      return (
                        <button
                          key={u.name}
                          onClick={() => setUnderglowColor(u.hex)}
                          className={`w-6 h-6 rounded-full shrink-0 border transition-transform cursor-pointer ${
                            isSelected
                              ? 'scale-120 ring-2 ring-white border-transparent'
                              : 'border-white/20 hover:scale-110'
                          }`}
                          style={{ backgroundColor: u.hex }}
                          title={u.name}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Camera Perspectives */}
          {activeTab === 'camera' && (
            <div className="space-y-2.5">
              <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block">
                Preset Studio Perspectives
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {CAMERA_VIEWS.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setCameraView(v.id)}
                    className={`py-2 px-1.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      cameraView === v.id
                        ? 'bg-accent/20 border-accent/40 text-accent font-semibold'
                        : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-zinc-500 pt-1">
                You can also freely click and drag inside the showroom to orbit, right-click to pan, and scroll to zoom.
              </p>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);
}

