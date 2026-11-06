import React, { useState } from 'react';
import { ViewMode } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  ShieldAlert, 
  UserCheck, 
  CheckCircle2,
  FileSpreadsheet,
  Receipt
} from 'lucide-react';

interface AdminLoginViewProps {
  onNavigate: (view: ViewMode) => void;
  onLoginSuccess: (adminData: {
    id: string;
    name: string;
    email: string;
    title: string;
  }) => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onNavigate,
  onLoginSuccess,
}) => {
  const [adminEmail, setAdminEmail] = useState('director.becker@apex.io');
  const [adminPass, setAdminPass] = useState('ApexMasterAdmin2026!');
  const [adminPin, setAdminPin] = useState('992-SEC');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const demoAdmins = [
    {
      id: 'adm-01',
      name: 'Director Kurt Becker',
      email: 'director.becker@apex.io',
      title: 'Managing Director & Chief Engineer',
      pass: 'ApexMasterAdmin2026!',
      pin: '992-SEC',
    },
    {
      id: 'adm-02',
      name: 'Sarah Jenkins',
      email: 's.jenkins@apex.io',
      title: 'Workshop Billing & Settlement Director',
      pass: 'ApexBillingController!',
      pin: '884-LED',
    },
  ];

  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!adminEmail.trim() || !adminPass.trim()) {
      setErrorMsg('Please enter both administrative email and master security passkey.');
      return;
    }

    const matched = demoAdmins.find(
      (a) => a.email.toLowerCase() === adminEmail.toLowerCase()
    );

    if (matched) {
      onLoginSuccess(matched);
    } else {
      onLoginSuccess({
        id: `adm-${Date.now()}`,
        name: adminEmail.split('@')[0].toUpperCase(),
        email: adminEmail,
        title: 'Authorized Workshop Admin',
      });
    }
  };

  const handleQuickDemo = (adm: typeof demoAdmins[0]) => {
    setAdminEmail(adm.email);
    setAdminPass(adm.pass);
    setAdminPin(adm.pin);
    onLoginSuccess(adm);
  };

  return (
    <div className="min-h-screen bg-[#0c1322] text-[#dce2f7] flex flex-col justify-between relative overflow-hidden select-none">
      {/* Ambient Radial Lights */}
      <div className="fixed top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[150px] pointer-events-none"></div>

      {/* Top Header Bar */}
      <header className="px-6 py-4 border-b border-white/5 bg-[#0c1322]/80 backdrop-blur-xl flex items-center justify-between z-20">
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-orange-500 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm tracking-tight leading-none">ApexMoto</div>
            <div className="text-[9px] uppercase tracking-wider text-purple-400 font-bold mt-0.5">
              EXECUTIVE ADMIN CONSOLE
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
        <div className="w-full max-w-lg bg-[#141b2b]/95 border border-purple-500/30 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_30px_rgba(168,85,247,0.15)] overflow-hidden backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
          {/* Card Top Banner */}
          <div className="p-6 pb-5 bg-gradient-to-b from-purple-500/10 to-transparent border-b border-white/5 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono mb-3">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span>HIGH CLEARANCE LEVEL 5 REQUIRED</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Workshop Admin Login
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Access the financial ledger, certified vehicle settlement queue, tax invoice generator, and workshop operational dispatch.
            </p>
          </div>

          <div className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                  Admin Authority Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="director.becker@apex.io"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                  Master Security Passkey
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30"
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

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                  Hardware Token / Station Key
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="e.g. 992-SEC"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500/60"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(168,85,247,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Credentials & Enter Admin Console</span>
              </button>

              {/* Quick Presets */}
              <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold text-center">
                  ⚡ AUTHORIZED DEMO ADMINISTRATORS
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                  {demoAdmins.map((adm) => (
                    <button
                      key={adm.id}
                      type="button"
                      onClick={() => handleQuickDemo(adm)}
                      className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-purple-500/30 transition-all text-left group cursor-pointer"
                    >
                      <div className="text-[11px] font-bold text-white group-hover:text-purple-300 truncate">
                        {adm.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {adm.title}
                      </div>
                      <div className="text-[9px] font-mono text-purple-400/90 mt-1">
                        PIN: {adm.pin}
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
                  onClick={() => onNavigate('mechanic-login')}
                  className="text-blue-400 hover:underline cursor-pointer"
                >
                  Mechanic Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-white/5 bg-[#0c1322]/80 backdrop-blur-xl flex items-center justify-between text-xs text-slate-500 z-10">
        <div>ApexMoto Secure Operational Governance • RBAC Authority Enforced</div>
        <div className="font-mono text-[11px] text-purple-400">
          CLEARANCE: LEVEL-5 MASTER
        </div>
      </footer>
    </div>
  );
};
