import React, { useState } from 'react';
import { X, Wrench, Shield, Check, Lock, Key, ArrowRight, UserCheck, Cpu } from 'lucide-react';

interface MechanicLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (techName: string, bay: string) => void;
}

export const MechanicLoginModal: React.FC<MechanicLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [techId, setTechId] = useState('#TECH-08-ALX');
  const [techName, setTechName] = useState('Alex Vance');
  const [bayStation, setBayStation] = useState('Bay 04 - Dyno & Diagnostics');
  const [pinCode, setPinCode] = useState('9821');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const quickTechs = [
    {
      id: '#TECH-08-ALX',
      name: 'Alex Vance',
      role: 'Level 4 Master Tech',
      bay: 'Bay 04 - Dyno & Diagnostics',
      badgeColor: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
    },
    {
      id: '#TECH-01-KRT',
      name: 'Kurt Becker',
      role: 'Master Motorsport Engineer',
      bay: 'Bay 04 - Dyno & Brake',
      badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    },
    {
      id: '#TECH-12-STF',
      name: 'Stefan Ruiz',
      role: 'Senior Fluidics Specialist',
      bay: 'Bay 02 - Fluidics Dock',
      badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    },
    {
      id: '#TECH-04-MRC',
      name: 'Marco Leone',
      role: 'Chassis & Alignment Tech',
      bay: 'Bay 06 - Chassis Rig',
      badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    },
  ];

  const handleSelectTech = (tech: typeof quickTechs[0]) => {
    setTechId(tech.id);
    setTechName(tech.name);
    setBayStation(tech.bay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess(techName, bayStation);
        onClose();
        setIsSuccess(false);
      }, 700);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* Ambient Radial Backdrops */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-orange-500/15 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-blue-600/15 blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-lg rounded-2xl bg-[#191f2f]/95 border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] p-6 sm:p-8 overflow-hidden backdrop-blur-2xl">
        {/* Specular line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-13 h-13 rounded-xl bg-[#0c1322] border border-orange-500/30 flex items-center justify-center shadow-lg mb-3">
            <Wrench className="w-6 h-6 text-orange-400" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]"></span>
            <span className="text-[10px] font-mono tracking-widest text-orange-400 font-bold uppercase">
              WORKSTATION OPS • DIAGNOSTIC TERMINAL V4.2
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Mechanic Terminal Authentication
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Authenticate master technician credentials to access work orders, allocate inventory parts, and calibrate workshop bays.
          </p>
        </div>

        {/* Quick Tech Switcher Preset Chips */}
        <div className="mb-5 space-y-1.5">
          <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block">
            Select Active Lead Specialist:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {quickTechs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectTech(t)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  techId === t.id
                    ? 'bg-orange-500/15 border-orange-500/50 shadow-[0_0_12px_rgba(249,115,22,0.2)]'
                    : 'bg-white/[0.03] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>{t.name}</span>
                  <span className="text-[10px] font-mono text-orange-400">{t.id.slice(0, 8)}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{t.role}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tech Badge / RFID ID</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={techId}
                  onChange={(e) => setTechId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#070e1d] border border-white/10 font-mono text-xs text-white uppercase focus:outline-none focus:border-orange-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Technician Full Name</label>
              <input
                type="text"
                required
                value={techName}
                onChange={(e) => setTechName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Station / Bay</label>
              <select
                value={bayStation}
                onChange={(e) => setBayStation(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500/50 cursor-pointer"
              >
                <option value="Bay 04 - Dyno & Diagnostics">Bay 04 - Dyno & Diagnostics</option>
                <option value="Bay 02 - Fluidics Dock">Bay 02 - Fluidics Dock</option>
                <option value="Bay 06 - Chassis Rig & Alignment">Bay 06 - Chassis Rig & Alignment</option>
                <option value="Bay 01 - Master Assembly">Bay 01 - Master Assembly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Security PIN / Access Key</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="••••"
                  className="w-full h-10 px-3 rounded-lg bg-[#070e1d] border border-white/10 font-mono text-xs text-white tracking-widest focus:outline-none focus:border-orange-500/50"
                />
              </div>
            </div>
          </div>

          {/* Security Tier Indicator */}
          <div className="p-3 rounded-xl bg-[#0c1322] border border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Terminal Authorization Level:</span>
            </div>
            <span className="font-mono text-emerald-400 font-bold">
              ISO 9001 / ASE Master Sign-off
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 mt-1 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_28px_rgba(249,115,22,0.6)] cursor-pointer transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authenticating Terminal...</span>
            ) : isSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Station Unlocked! Opening Bay Terminal...</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Authenticate & Open Workstation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer split */}
        <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Hardware Token Verified</span>
          </div>
          <span className="text-slate-500">Terminal ID #B4-DX99</span>
        </div>
      </div>
    </div>
  );
};
