import React, { useState, useEffect } from 'react';
import { X, Video, Maximize2, Radio, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { HERO_IMAGE, ROTOR_IMAGE } from '../data/mockData';

interface LiveCamModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCam?: string;
}

export const LiveCamModal: React.FC<LiveCamModalProps> = ({
  isOpen,
  onClose,
  defaultCam = 'cam-04',
}) => {
  const [activeCam, setActiveCam] = useState(defaultCam);
  const [muted, setMuted] = useState(true);
  const [rpm, setRpm] = useState(8420);
  const [oilTemp, setOilTemp] = useState(98.4);
  const [boost, setBoost] = useState(1.42);

  // Simulate live telemetry flutter
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setRpm(8300 + Math.floor(Math.random() * 320));
      setOilTemp(+(98 + Math.random() * 0.8).toFixed(1));
      setBoost(+(1.38 + Math.random() * 0.08).toFixed(2));
    }, 800);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentImage = activeCam === 'cam-rotor' ? ROTOR_IMAGE : HERO_IMAGE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0c1322] border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="h-14 px-5 border-b border-white/10 flex items-center justify-between bg-[#141b2b]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <span>BAY 04 • HIGH-TORQUE DYNO & BRAKE FEED</span>
                <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-mono text-[10px]">
                  LIVE 4K
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                2023 Porsche 911 GT3 (992) • Order #RO-98210
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted(!muted)}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={muted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-orange-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Canvas Container */}
        <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
          <img
            src={currentImage}
            alt="Live Bay Feed"
            className="w-full h-full object-cover"
          />

          {/* HUD Top Left */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>REC 00:48:19</span>
              <span className="text-slate-400">|</span>
              <span className="text-emerald-400">FPS: 60.0</span>
            </div>
            <div className="text-[10px] font-mono text-white/70 px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm self-start">
              SENSOR SYNC: CAN-BUS 1.28 GB/s
            </div>
          </div>

          {/* HUD Bottom Left: Live Gauges */}
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <div className="px-3 py-2 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 font-mono">
              <div className="text-[10px] text-slate-400 uppercase">Engine Speed</div>
              <div className="text-sm font-bold text-orange-400 tabular-nums">{rpm} RPM</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 font-mono">
              <div className="text-[10px] text-slate-400 uppercase">Oil Temp</div>
              <div className="text-sm font-bold text-emerald-400 tabular-nums">{oilTemp} °C</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 font-mono">
              <div className="text-[10px] text-slate-400 uppercase">Manifold Boost</div>
              <div className="text-sm font-bold text-blue-400 tabular-nums">{boost} bar</div>
            </div>
          </div>

          {/* HUD Bottom Right: Reticle */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-300">
            <Radio className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>OPTICAL MICRON CALIBRATOR ACTIVE</span>
          </div>
        </div>

        {/* Cam Switcher Footer */}
        <div className="p-3.5 bg-[#141b2b] border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1">Switch Angle:</span>
            <button
              onClick={() => setActiveCam('cam-04')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeCam === 'cam-04'
                  ? 'bg-orange-500 text-white font-semibold shadow-[0_0_12px_rgba(249,115,22,0.4)]'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Bay 04 Main Dyno
            </button>
            <button
              onClick={() => setActiveCam('cam-rotor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeCam === 'cam-rotor'
                  ? 'bg-orange-500 text-white font-semibold shadow-[0_0_12px_rgba(249,115,22,0.4)]'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Rotor Cam 04 (Macro)
            </button>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            Technician: <strong className="text-white">Alex Vance</strong> (Bay Lead)
          </div>
        </div>
      </div>
    </div>
  );
};
