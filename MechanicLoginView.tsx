import React, { useState } from 'react';
import { ViewMode } from '../types';
import { 
  Wrench, 
  Lock, 
  ShieldCheck, 
  User, 
  Key, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Radio, 
  Cpu,
  Layers
} from 'lucide-react';

interface MechanicLoginViewProps {
  onNavigate: (view: ViewMode) => void;
  onLoginSuccess: (techData: {
    id: string;
    name: string;
    badgeId: string;
    station: string;
    title: string;
  }) => void;
}

export const MechanicLoginView: React.FC<MechanicLoginViewProps> = ({
  onNavigate,
  onLoginSuccess,
}) => {
  const [techName, setTechName] = useState('Alex Vance');
  const [badgeId, setBadgeId] = useState('#TECH-08-ALX');
  const [stationBay, setStationBay] = useState('Bay 04 — Dyno & Brake');
  const [passcode, setPasscode] = useState('ApexTechBay04!');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const demoTechnicians = [
    {
      id: 'tech-08',
      name: 'Alex Vance',
      badgeId: '#TECH-08-ALX',
      station: 'Bay 04 — Dyno & Brake',
      title: 'Level 4 Master Motorsport & Dyno Specialist',
      pass: 'ApexTechBay04!',
    },
    {
      id: 'tech-01',
      name: 'Kurt Becker',
      badgeId: '#TECH-01-KRT',
      station: 'Bay 02 — High-Torque Chassis Rig',
      title: 'Master Motorsport Engineer',
      pass: 'ChassisRig2026!',
    },
    {
      id: 'tech-04',
      name: 'Maya Lin',
      badgeId: '#TECH-04-MYA',
      station: 'Bay 01 — Optical Laser Alignment',
      title: 'Suspension & Chassis Geometry Specialist',
      pass: 'LaserAlign992!',
    },
  ];

  const handleMechanicLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!techName.trim() || !passcode.trim()) {
      setErrorMsg('Please enter technician credentials and station passcode.');
      return;
    }

    const matched = demoTechnicians.find(
      (t) =>
        t.name.toLowerCase() === techName.toLowerCase() ||
        t.badgeId.toLowerCase() === badgeId.toLowerCase()
    );

    if (matched) {
      onLoginSuccess(matched);
    } else {
      onLoginSuccess({
        id: `tech-${Date.now()}`,
        name: techName,
        badgeId: badgeId || '#TECH-NEW',
        station: stationBay,
        title: 'Certified Bay Specialist',
      });
    }
  };

  const handleQuickDemo = (t: typeof demoTechnicians[0]) => {
    setTechName(t.name);
    setBadgeId(t.badgeId);
    setStationBay(t.station);
    setPasscode(t.pass);
    onLoginSuccess(t);
  };

  return (
    <div className="min-h-screen bg-[#0c1322] text-[#dce2f7] flex flex-col justify-between relative overflow-hidden select-none">
      {/* Ambient Radial Lights */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[150px] pointer-events-none"></div>

      {/* Top Header Bar */}
      <header className="px-6 py-4 border-b border-white/5 bg-[#0c1322]/80 backdrop-blur-xl flex items-center justify-between z-20">
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-transform">
            <Wrench className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm tracking-tight leading-none">ApexMoto</div>
            <div className="text-[9px] uppercase tracking-wider text-blue-400 font-bold mt-0.5">
              SERVICE TERMINAL LOGIN
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('landing')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Home</span>
          </button>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-4">
        <div className="w-full max-w-lg bg-[#141b2b]/95 border border-blue-500/30 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_30px_rgba(59,130,246,0.15)] overflow-hidden backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
          {/* Card Top Banner */}
          <div className="p-6 pb-5 bg-gradient-to-b from-blue-500/10 to-transparent border-b border-white/5 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-mono mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span>WORKSTATION OPS • BAY TERMINAL ACCESS</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Technician Terminal Sign-In
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Authenticate to manage assigned dyno work orders, log diagnostic telemetry, and allocate OEM track components.
            </p>
          </div>

          <div className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleMechanicLogin} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                    Technician Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={techName}
                      onChange={(e) => setTechName(e.target.value)}
                      placeholder="Alex Vance"
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                    Badge ID
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={badgeId}
                      onChange={(e) => setBadgeId(e.target.value)}
                      placeholder="#TECH-08-ALX"
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-3 py-2 text-xs font-mono text-blue-300 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                  Assigned Station Bay
                </label>
                <select
                  value={stationBay}
                  onChange={(e) => setStationBay(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Bay 04 — Dyno & Brake">Bay 04 — Dyno & Multi-Sensor Calibration</option>
                  <option value="Bay 02 — High-Torque Chassis Rig">Bay 02 — High-Torque Chassis Rig</option>
                  <option value="Bay 01 — Optical Laser Alignment">Bay 01 — Optical 3D Laser Alignment</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                  Terminal Passcode
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(59,130,246,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
              >
                <Wrench className="w-4 h-4" />
                <span>Authorize & Open Workstation</span>
              </button>

              {/* Quick Presets */}
              <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold text-center">
                  ⚡ SELECT DEMO TECHNICIAN
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
                  {demoTechnicians.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleQuickDemo(t)}
                      className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-blue-500/30 transition-all text-left group cursor-pointer"
                    >
                      <div className="text-[11px] font-bold text-white group-hover:text-blue-300 truncate">
                        {t.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {t.badgeId}
                      </div>
                      <div className="text-[9px] font-mono text-blue-400 mt-1 truncate">
                        {t.station.split('—')[0]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </form>

            {/* Switch to Other Portals */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span>Looking for another portal?</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('customer-login')}
                  className="text-orange-400 hover:underline cursor-pointer"
                >
                  Customer Login
                </button>
                <span>•</span>
                <button
                  onClick={() => onNavigate('admin-login')}
                  className="text-purple-400 hover:underline cursor-pointer"
                >
                  Admin Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-white/5 bg-[#0c1322]/80 backdrop-blur-xl flex items-center justify-between text-xs text-slate-500 z-10">
        <div>ApexMoto Service Station Ops • Isolated Bay Environment</div>
        <div className="font-mono text-[11px] text-blue-400">
          ROLE: WORKSHOP MECHANIC ONLY
        </div>
      </footer>
    </div>
  );
};
