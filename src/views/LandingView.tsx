import React from 'react';
import { ViewMode, ServicePackage } from '../types';
import { SERVICE_PACKAGES, HERO_IMAGE } from '../data/mockData';
import { 
  Check, 
  ArrowRight, 
  Phone, 
  Video, 
  ShieldCheck, 
  Award, 
  Clock, 
  Cpu, 
  Zap, 
  Sparkles,
  ChevronRight,
  Calendar,
  Wrench,
  User,
  Car,
  Lock
} from 'lucide-react';

interface LandingViewProps {
  onNavigate: (view: ViewMode) => void;
  onSelectPackageForBooking: (pkg: ServicePackage) => void;
  onOpenLiveCam: () => void;
  onOpenRegister: () => void;
  onOpenLogin?: (initialId?: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  onSelectPackageForBooking,
  onOpenLiveCam,
  onOpenRegister,
  onOpenLogin,
}) => {
  return (
    <div className="min-h-screen bg-[#0c1322] text-[#dce2f7] flex flex-col selection:bg-orange-500/30">
      {/* Top Bar Contract: 3 zones */}
      <header className="h-16 px-6 lg:px-12 border-b border-white/5 bg-[#0c1322]/90 backdrop-blur-xl flex items-center justify-between sticky top-0 z-40">
        {/* Zone 1: Brand Wordmark */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-[0_0_12px_rgba(249,115,22,0.4)]">
            <span className="material-symbols-outlined text-white text-lg">speed</span>
          </div>
          <span className="font-bold text-lg text-white tracking-tight">APEXMOTO</span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#94a3b8]">
          <a href="#packages" className="hover:text-white transition-colors">Services</a>
          <a href="#protocol" className="hover:text-white transition-colors">How It Works</a>
          <a href="#packages" className="hover:text-white transition-colors">Pricing</a>
          <button 
            onClick={() => onNavigate('bookings')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            Workshop Bays
          </button>
        </nav>

        {/* Zone 3: Actions - Universal Gateway & Quick Logins */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => (onOpenLogin ? onOpenLogin() : onNavigate('login'))}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In (Apex ID)</span>
          </button>

          <button
            onClick={onOpenRegister}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Register ID</span>
          </button>

          <div className="h-4 w-px bg-white/10 hidden md:block"></div>

          <button
            onClick={() => (onOpenLogin ? onOpenLogin('CUST-101') : onNavigate('customer-login'))}
            className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition-all cursor-pointer"
            title="Fast fill Client ID"
          >
            <User className="w-3 h-3" />
            <span>Client</span>
          </button>

          <button
            onClick={() => (onOpenLogin ? onOpenLogin('TECH-08') : onNavigate('mechanic-login'))}
            className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all cursor-pointer"
            title="Fast fill Bay 04 Tech ID"
          >
            <Wrench className="w-3 h-3" />
            <span>Mechanic</span>
          </button>

          <button
            onClick={() => (onOpenLogin ? onOpenLogin('ADM-01') : onNavigate('admin-login'))}
            className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all cursor-pointer"
            title="Fast fill Director Admin ID"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]"></span>
            <span>LIVE WORKSHOP TELEMETRY SYSTEM ACTIVE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl leading-[1.15]">
            Next-Gen Automotive <br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
              Precision & Care
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Experience transparent digital multi-point diagnostics, certified master technicians, and live bay telematics from intake to ignition.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => (onOpenLogin ? onOpenLogin() : onNavigate('login'))}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Universal ID Sign In</span>
            </button>

            <button
              onClick={onOpenRegister}
              className="px-5 py-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Register ID (Auto-Assigned)</span>
            </button>

            <button
              onClick={() => (onOpenLogin ? onOpenLogin('CUST-101') : onNavigate('customer-login'))}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm text-slate-400">speed</span>
              <span>Track Live Vehicle</span>
            </button>
          </div>

          {/* Hero Bay Cam Video / Frame */}
          <div className="relative w-full max-w-4xl aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] group mt-4">
            <img
              src={HERO_IMAGE}
              alt="Bay 04 Dyno Calibration Active"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Top Left Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              <span className="font-mono uppercase text-[11px] tracking-wider">
                BAY 04 • DYNO STRESS TEST ACTIVE
              </span>
            </div>

            {/* Top Right Expand Live Cam */}
            <button
              onClick={onOpenLiveCam}
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-xs text-white transition-all cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-orange-400" />
              <span>Expand 4K Feed</span>
            </button>

            {/* Bottom Overlay Stats */}
            <div className="absolute bottom-4 inset-x-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/90">
              <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <div>CAN-BUS THROUGHPUT: <strong className="text-orange-400">1.28 GB/s</strong></div>
                <div className="hidden sm:block text-slate-400">|</div>
                <div className="hidden sm:block">TORQUE TOLERANCE: <strong className="text-emerald-400">±0.002mm</strong></div>
              </div>
              <button
                onClick={() => onNavigate('book')}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-sans text-xs font-semibold flex items-center gap-1.5 shadow-[0_4px_16px_rgba(249,115,22,0.4)] transition-all cursor-pointer"
              >
                <span>Reserve Bay Slot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4 Stat Boxes (Image 5) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl mt-6">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-left relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="material-symbols-outlined text-orange-400 text-lg">build_circle</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">99.4% Fix Rate</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums">15k+</div>
              <div className="text-xs text-slate-400 mt-0.5">Vehicles Tuned & Serviced</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-left relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">Fast Lane</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums">2.4 Hrs</div>
              <div className="text-xs text-slate-400 mt-0.5">Average Turnaround Window</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-left relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <Award className="w-4 h-4 text-orange-400" />
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">ASE Master</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono">5-Star</div>
              <div className="text-xs text-slate-400 mt-0.5">Certified Master Technicians</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-left relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <Video className="w-4 h-4 text-orange-400" />
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">4K Feeds</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono">Live Bay Cam</div>
              <div className="text-xs text-slate-400 mt-0.5">Real-Time Mobile Streaming</div>
            </div>
          </div>
        </section>

        {/* Individual Role Portals & Isolated Access Control */}
        <section className="space-y-4 pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 text-xs font-mono">
              <Lock className="w-3.5 h-3.5 text-orange-400" />
              <span>ROLE-BASED INDIVIDUAL ACCESS ARCHITECTURE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Individual Portal Authentication
            </h2>
            <p className="text-xs text-slate-400">
              Isolated logins and strict role boundaries for Customers, Certified Workshop Mechanics, and Workshop Directors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {/* 1: Customer Portal */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-orange-500/10 via-[#141b2b] to-[#141b2b] border border-orange-500/30 flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden group hover:border-orange-500/50 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-md">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase">
                    Client Access
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Customer Portal</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Personal garage assets, live bay dyno telemetry, stage checklist, smart key release codes, and service pre-bookings.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3 h-3" />
                    <span>Live vehicle telemetry & pre-booking</span>
                  </div>
                  <div className="text-rose-400 text-[10px] mt-1">
                    ✕ No access to mechanic terminal or admin desk
                  </div>
                </div>
              </div>

              <button
                onClick={() => (onOpenLogin ? onOpenLogin('CUST-101') : onNavigate('customer-login'))}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
              >
                <span>Sign In as Client (CUST-101)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2: Mechanic Bay Terminal */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-500/10 via-[#141b2b] to-[#141b2b] border border-blue-500/30 flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden group hover:border-blue-500/50 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-md">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                    Tech Bay 04
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Mechanic Workstation</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Internal technician terminal for Bay 04 execution, OBD telemetry logging, parts allocation, and dyno validation.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5 text-blue-400">
                    <Check className="w-3 h-3" />
                    <span>Station diagnostics & work order ops</span>
                  </div>
                  <div className="text-rose-400 text-[10px] mt-1">
                    ✕ Strictly prohibited from executive admin page
                  </div>
                </div>
              </div>

              <button
                onClick={() => (onOpenLogin ? onOpenLogin('TECH-08') : onNavigate('mechanic-login'))}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                <span>Sign In as Bay Tech (TECH-08)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3: Executive Admin Workstation */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-500/10 via-[#141b2b] to-[#141b2b] border border-purple-500/30 flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden group hover:border-purple-500/50 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase">
                    Level 5 Master
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Admin Workstation</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Workshop settlement desk, official tax invoice generation for completed bay ROs, financial ledger, and fleet governance.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5 text-purple-400">
                    <Check className="w-3 h-3" />
                    <span>Completed vehicle invoicing & audit</span>
                  </div>
                  <div className="text-emerald-400 text-[10px] mt-1">
                    ✓ Full workshop administration clearance
                  </div>
                </div>
              </div>

              <button
                onClick={() => (onOpenLogin ? onOpenLogin('ADM-01') : onNavigate('admin-login'))}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
              >
                <span>Sign In as Admin (ADM-01)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Packages Section (Image 5) */}
        <section id="packages" className="space-y-6 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-orange-400 font-semibold">
                STANDARD OF EXCELLENCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Precision Calibration & Care Packages
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Transparent flat-rate pricing. Every tier is backed by digital telemetry reports and an ASE-certified 24-month nationwide warranty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICE_PACKAGES.slice(0, 5).map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-xl bg-[#191f2f]/80 border border-white/10 p-5 flex flex-col justify-between hover:border-orange-500/40 transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                      <span className="material-symbols-outlined text-lg">{pkg.icon}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase">Starting at</div>
                      <div className="text-xl font-bold text-white font-mono tabular-nums">${pkg.price}</div>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight group-hover:text-orange-300 transition-colors">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {pkg.description}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <button
                    onClick={() => onSelectPackageForBooking(pkg)}
                    className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-orange-500 hover:text-white border border-white/10 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer group-hover:bg-orange-500/20 group-hover:border-orange-500/40"
                  >
                    <span>Quick Select</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Front Axle Calibration Graphic Card (Image 5) */}
            <div className="rounded-xl bg-[#141b2b]/90 border border-white/10 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                  <span>FRONT AXLE</span>
                  <span className="text-emerald-400">CALIBRATED ±0.02°</span>
                </div>
                {/* SVG Visual Chassis Axle */}
                <div className="py-6 flex items-center justify-center">
                  <svg className="w-56 h-20 text-orange-500" viewBox="0 0 200 60" fill="none">
                    {/* Left Wheel */}
                    <rect x="10" y="10" width="18" height="40" rx="3" stroke="#60a5fa" strokeWidth="2" fill="rgba(96,165,250,0.1)" />
                    {/* Right Wheel */}
                    <rect x="172" y="10" width="18" height="40" rx="3" stroke="#60a5fa" strokeWidth="2" fill="rgba(96,165,250,0.1)" />
                    {/* Axle Rod */}
                    <line x1="28" y1="30" x2="172" y2="30" stroke="#f97316" strokeWidth="2" strokeDasharray="4 2" />
                    {/* Center Differential circle */}
                    <circle cx="100" cy="30" r="10" stroke="#f97316" strokeWidth="2" fill="#191f2f" />
                    <circle cx="100" cy="30" r="4" fill="#f97316" />
                  </svg>
                </div>
                <div className="text-center text-xs text-slate-400 font-mono">
                  Multi-axis dynamic load compensation enabled
                </div>
              </div>

              <button
                onClick={() => onNavigate('book')}
                className="w-full mt-4 py-2 px-3 rounded-lg bg-orange-500/20 border border-orange-500/30 text-xs font-semibold text-orange-300 hover:bg-orange-500 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Custom Diagnostics Setup</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* 3-Step Protocol Section (Image 5) */}
        <section id="protocol" className="space-y-6 pt-8">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-orange-400 font-semibold">
              UNRIVALED TRANSPARENCY
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              The Frictionless 3-Step Protocol
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              No waiting in oily waiting rooms. No opaque surprises on checkout. Stay in total control via our mobile telemetry interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-400 font-mono">01</span>
                <span className="material-symbols-outlined text-slate-400">calendar_month</span>
              </div>
              <h3 className="text-base font-bold text-white">Instant Online Booking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select desired maintenance packages, input VIN or vehicle specs, and reserve a dedicated clean workshop bay arrival slot in seconds.
              </p>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Guaranteed Bay Reservation Lock</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-400 font-mono">02</span>
                <span className="material-symbols-outlined text-slate-400">videocam</span>
              </div>
              <h3 className="text-base font-bold text-white">Real-Time Digital Bay Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitor live technician video feeds, read sensor logs as they populate, and approve or decline add-on recommendations with 1-tap digital transparency.
              </p>
              <div className="text-[11px] text-blue-400 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" />
                <span>Live Photo & Video Inspection Feeds</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-400 font-mono">03</span>
                <span className="material-symbols-outlined text-slate-400">credit_card</span>
              </div>
              <h3 className="text-base font-bold text-white">Transparent Touchless Checkout</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review itemized parts/labor accounting, access PDF diagnostic records, and complete contactless payment with smart key release at our pickup hub.
              </p>
              <div className="text-[11px] text-purple-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>24-Month / 24,000-Mile Nationwide Warranty</span>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications Row (Image 5) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
          <div className="p-4 rounded-xl bg-[#141b2b] border border-white/5 text-center">
            <span className="material-symbols-outlined text-orange-400 text-2xl mb-1">verified</span>
            <div className="text-xs font-bold text-white">Bosch Certified</div>
            <div className="text-[11px] text-slate-400">Official Diagnostics Hub</div>
          </div>
          <div className="p-4 rounded-xl bg-[#141b2b] border border-white/5 text-center">
            <span className="material-symbols-outlined text-blue-400 text-2xl mb-1">security</span>
            <div className="text-xs font-bold text-white">OEM Safe</div>
            <div className="text-[11px] text-slate-400">Maintains Factory Warranty</div>
          </div>
          <div className="p-4 rounded-xl bg-[#141b2b] border border-white/5 text-center">
            <span className="material-symbols-outlined text-emerald-400 text-2xl mb-1">clean_hands</span>
            <div className="text-xs font-bold text-white">Clean Room Bays</div>
            <div className="text-[11px] text-slate-400">ISO 14644 Climate-Controlled</div>
          </div>
          <div className="p-4 rounded-xl bg-[#141b2b] border border-white/5 text-center">
            <span className="material-symbols-outlined text-purple-400 text-2xl mb-1">ev_station</span>
            <div className="text-xs font-bold text-white">EV Lounge & DC Fast</div>
            <div className="text-[11px] text-slate-400">Complimentary 350kW Level 3</div>
          </div>
        </section>

        {/* Call to action (Image 5) */}
        <section className="rounded-2xl bg-gradient-to-r from-[#191f2f] to-[#141b2b] border border-white/10 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to Experience Precision Auto Care?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Reserve your specialized workshop bay today. Enjoy instant live bay telemetry, guaranteed completion timeframes, and certified master care.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:18005552739"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-orange-400" />
              <span>+1 (800) 555-APEX</span>
            </a>
            <button
              onClick={() => onNavigate('book')}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-[0_4px_20px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_28px_rgba(249,115,22,0.6)] transition-all cursor-pointer"
            >
              Book Bay Now
            </button>
          </div>
        </section>
      </main>

      {/* Footer (Image 5) */}
      <footer className="border-t border-white/5 bg-[#0c1322] px-6 lg:px-12 py-8 mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="material-symbols-outlined text-orange-400 text-sm">speed</span>
              <span className="font-bold text-white tracking-wider">APEXMOTO</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Next-generation precision automotive diagnostics, performance tuning, and service workflow telematics.
            </p>
            <div className="text-[10px] text-slate-600">
              © 2026 ApexMoto Precision Telemetry. All rights reserved.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px]">
            <button onClick={() => onNavigate('customer-login')} className="hover:text-white transition-colors cursor-pointer text-orange-400">
              Customer Portal Login
            </button>
            <button onClick={() => onNavigate('mechanic-login')} className="hover:text-white transition-colors cursor-pointer text-blue-400">
              Mechanic Terminal Login
            </button>
            <button onClick={() => onNavigate('admin-login')} className="hover:text-white transition-colors cursor-pointer text-purple-400">
              Admin Console Login
            </button>
            <span className="text-slate-600">|</span>
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
