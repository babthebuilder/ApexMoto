import React, { useState } from 'react';
import { ViewMode, Vehicle, WorkOrder, ServicePackage, CustomerUser } from '../types';
import { SERVICE_PACKAGES, HERO_IMAGE, ROTOR_IMAGE } from '../data/mockData';
import { 
  Car, 
  Wrench, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Video, 
  Maximize2, 
  ShieldCheck, 
  Gauge, 
  Key, 
  Phone, 
  MessageSquare, 
  Download, 
  ChevronRight, 
  Plus, 
  Check, 
  Sliders, 
  ArrowRight, 
  LogOut, 
  ExternalLink,
  Receipt,
  Sparkles,
  Layers,
  Radio,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface CustomerPortalViewProps {
  onNavigate: (view: ViewMode) => void;
  customerUser: CustomerUser;
  vehicles: Vehicle[];
  workOrders: WorkOrder[];
  activeWorkOrder: WorkOrder;
  onOpenLiveCam: () => void;
  onOpenConcierge: () => void;
  onSelectVehicleForBooking: (veh: Vehicle) => void;
  onPreBookingComplete: (veh: Vehicle, pkg: ServicePackage, date: string, time: string, bay: string) => void;
  onLogoutCustomer: () => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  onNavigate,
  customerUser,
  vehicles,
  workOrders,
  activeWorkOrder,
  onOpenLiveCam,
  onOpenConcierge,
  onSelectVehicleForBooking,
  onPreBookingComplete,
  onLogoutCustomer,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'prebooking' | 'garage'>('status');

  // Selected vehicle for status view
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    customerUser.defaultVehicleId || vehicles[0]?.id || 'veh-911'
  );

  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // Associated work order for current vehicle (or activeWorkOrder)
  const currentVehicleOrder =
    workOrders.find((o) => o.vehicleId === currentVehicle.id) || activeWorkOrder;

  // Pre-booking form states
  const [prebookVehicleId, setPrebookVehicleId] = useState<string>(currentVehicle.id);
  const [prebookPackageId, setPrebookPackageId] = useState<string>(SERVICE_PACKAGES[0].id);
  const [prebookBay, setPrebookBay] = useState<string>('Bay 04 - Dyno & Multi-Sensor Calibration');
  const [prebookDate, setPrebookDate] = useState<string>('2026-10-08');
  const [prebookTime, setPrebookTime] = useState<string>('10:00 AM');
  const [prebookNotes, setPrebookNotes] = useState<string>('Verify front brake bias and execute high-speed RPM runout.');
  const [prebookSuccessToken, setPrebookSuccessToken] = useState<string | null>(null);

  const selectedPrebookPkg =
    SERVICE_PACKAGES.find((p) => p.id === prebookPackageId) || SERVICE_PACKAGES[0];
  const selectedPrebookVehicle =
    vehicles.find((v) => v.id === prebookVehicleId) || currentVehicle;

  const handleConfirmPreBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const token = `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    onPreBookingComplete(
      selectedPrebookVehicle,
      selectedPrebookPkg,
      prebookDate,
      prebookTime,
      prebookBay
    );
    setPrebookSuccessToken(token);
  };

  return (
    <div className="min-h-screen bg-[#0c1322] text-[#dce2f7] flex flex-col relative select-none">
      {/* Radial Ambient Backdrops */}
      <div className="fixed top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[160px] pointer-events-none"></div>

      {/* Top Customer Header Bar */}
      <header className="px-6 py-4 border-b border-white/5 bg-[#0c1322]/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-[0_0_12px_rgba(249,115,22,0.4)] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-white text-base">speed</span>
            </div>
            <div>
              <div className="font-bold text-white text-sm tracking-tight leading-none">ApexMoto</div>
              <div className="text-[9px] uppercase tracking-wider text-orange-400 font-bold mt-0.5">
                CLIENT TELEMETRY PORTAL
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/10 text-xs text-slate-400">
            <span>Welcome, <strong className="text-white">{customerUser.name}</strong></span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-orange-500/20 text-orange-400 border border-orange-500/30">
              {customerUser.tier}
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenConcierge}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-orange-400" />
            <span>Bay Concierge</span>
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors cursor-pointer"
          >
            Dashboard
          </button>

          <button
            onClick={onLogoutCustomer}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-xs text-slate-400 hover:text-rose-300 border border-white/5 transition-colors cursor-pointer flex items-center gap-1"
            title="Sign out of customer portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Active Telemetry Status Ribbon */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/15 via-[#191f2f] to-[#141b2b] border border-orange-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)] shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  TELEMETRY BAY 04 • HIGH-PRIORITY CALIBRATION
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                {currentVehicle.name} • {currentVehicle.plate}
              </h2>
            </div>
          </div>

          {/* Vehicle Switcher Pill for Client */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Select Vehicle:</span>
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicleId(v.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    v.id === selectedVehicleId
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {v.name.split(' ')[1] || v.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'status'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>Live Vehicle Status & Telemetry</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveTab('prebooking')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'prebooking'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Pre-Booking & Bay Reservation</span>
          </button>

          <button
            onClick={() => setActiveTab('garage')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'garage'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>My Garage & Records</span>
          </button>
        </div>

        {/* TAB 1: Live Vehicle Status & Telemetry Tracking */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            {/* Live Progress Stage Card (Image 16 & Image 13) */}
            <div className="rounded-3xl bg-[#191f2f]/90 border border-white/10 p-6 space-y-6 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      RO #{currentVehicleOrder.token}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {currentVehicleOrder.assignedBay}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight mt-1">
                    {currentVehicleOrder.serviceTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-mono text-slate-400">Est. Release</div>
                    <div className="text-sm font-bold font-mono text-white">
                      {currentVehicleOrder.estCompletion}
                    </div>
                  </div>

                  <button
                    onClick={onOpenLiveCam}
                    className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-2 shadow-[0_4px_16px_rgba(249,115,22,0.4)] transition-all cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>Watch Live Bay Cam</span>
                  </button>
                </div>
              </div>

              {/* Progress Bar & Stage Indicator */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Active Stage:</span>
                    <span className="text-orange-400 font-bold">
                      Stage {currentVehicleOrder.currentStage} of {currentVehicleOrder.totalStages}: {currentVehicleOrder.stageName}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-white tabular-nums">
                    {currentVehicleOrder.progressPercent}%
                  </span>
                </div>

                <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(249,115,22,0.5)]"
                    style={{ width: `${currentVehicleOrder.progressPercent}%` }}
                  ></div>
                </div>

                {/* 4 Execution Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  {currentVehicleOrder.steps.map((st) => (
                    <div
                      key={st.stepNumber}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        st.status === 'completed'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : st.status === 'active'
                          ? 'bg-orange-500/15 border-orange-500/40 text-orange-200 shadow-md'
                          : 'bg-white/[0.02] border-white/5 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                        <span className="font-bold">STEP 0{st.stepNumber}</span>
                        <span className="uppercase flex items-center gap-1 font-semibold">
                          {st.status === 'completed' && <Check className="w-3 h-3 text-emerald-400" />}
                          {st.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>}
                          {st.status}
                        </span>
                      </div>
                      <div className="font-bold text-white text-xs">{st.title}</div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {st.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Split Grid: Live Cam Preview & Vital Telemetry HUD */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 cols: Live Cam Stream with Sensor HUD */}
              <div className="lg:col-span-7 rounded-3xl bg-[#141b2b] border border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/30">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      LIVE BAY 04 FEED • 1080P 60FPS
                    </span>
                  </div>
                  <button
                    onClick={onOpenLiveCam}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Fullscreen Live Feed"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative aspect-video w-full overflow-hidden bg-black group cursor-pointer" onClick={onOpenLiveCam}>
                  <img
                    src={HERO_IMAGE}
                    alt="Live Bay Stream"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Telemetry HUD Overlays */}
                  <div className="absolute top-3 left-3 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 font-mono text-[11px] space-y-1 text-slate-300">
                    <div className="flex items-center gap-2 text-white font-bold">
                      <Radio className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                      <span>DYNO BENCH LOAD: ACTIVE</span>
                    </div>
                    <div className="text-orange-400">RPM: 7,850 • OIL TEMP: 92°C</div>
                    <div className="text-emerald-400">RUNOUT: ±0.001mm (PASSED)</div>
                  </div>

                  <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-white flex items-center gap-2">
                    <Maximize2 className="w-3.5 h-3.5 text-orange-400" />
                    <span>Click to Expand Video HUD</span>
                  </div>
                </div>

                {/* Technician Snapshot & Log */}
                {currentVehicleOrder.technicianLog && (
                  <div className="p-4 bg-black/20 border-t border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold text-xs shrink-0">
                      AV
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{currentVehicleOrder.technicianLog.techName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{currentVehicleOrder.technicianLog.timeAgo}</span>
                      </div>
                      <p className="text-slate-300 italic mt-0.5 line-clamp-1">
                        "{currentVehicleOrder.technicianLog.note}"
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right 5 cols: Telemetry Diagnostic Metrics */}
              <div className="lg:col-span-5 space-y-4">
                {/* 4 Sensor Gauges */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-[#191f2f]/80 border border-white/10 space-y-1">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">BATTERY IMPEDANCE</div>
                    <div className="text-xl font-bold font-mono text-white">14.2 V</div>
                    <div className="text-[10px] text-emerald-400">100% Health Status</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#191f2f]/80 border border-white/10 space-y-1">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">BRAKE PAD THICKNESS</div>
                    <div className="text-xl font-bold font-mono text-orange-400">11.2 mm</div>
                    <div className="text-[10px] text-slate-400">Track-rated compound</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#191f2f]/80 border border-white/10 space-y-1">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">TIRE PRESSURES</div>
                    <div className="text-xl font-bold font-mono text-white">32 / 35 PSI</div>
                    <div className="text-[10px] text-emerald-400">Nitrogen calibrated</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#191f2f]/80 border border-white/10 space-y-1">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">CAN-BUS CODES</div>
                    <div className="text-xl font-bold font-mono text-emerald-400">0 DTC</div>
                    <div className="text-[10px] text-slate-400">All modules clear</div>
                  </div>
                </div>

                {/* Smart Key Lockbox Status */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-orange-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                        Bay 04 Key Safe & Lockbox
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300">
                      SECURED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your smart key is secured inside Bay 04 Key Lockbox #4. The one-time cryptographic PIN will be delivered to your phone upon final dyno certification.
                  </p>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-slate-300 flex items-center justify-between">
                    <span>Lockbox PIN:</span>
                    <span className="text-orange-400 font-bold tracking-widest">•••• (RELEASING AT 16:30)</span>
                  </div>
                </div>

                {/* Direct Concierge Contact Button */}
                <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Need immediate assistance?</div>
                    <div className="text-[11px] text-slate-400">Speak directly with Station Master Alex Vance</div>
                  </div>
                  <button
                    onClick={onOpenConcierge}
                    className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Hotline</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Pre-Booking & Bay Reservation Flow */}
        {activeTab === 'prebooking' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-[#191f2f]/90 border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></span>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-orange-400 font-bold">
                    PRE-BOOKING & ADVANCE BAY HOLD
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Schedule Future Track Calibration & Service
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Lock in dedicated dyno station time, certified engineers, and genuine track-grade parts in advance.
                </p>
              </div>

              {/* Pre-Booking Form */}
              <form onSubmit={handleConfirmPreBooking} className="space-y-6">
                {/* Step 1: Select Vehicle */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    1. Select Vehicle from Your Linked Fleet
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {vehicles.map((veh) => {
                      const isSelected = veh.id === prebookVehicleId;
                      return (
                        <div
                          key={veh.id}
                          onClick={() => setPrebookVehicleId(veh.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-orange-500/15 border-orange-500/50 shadow-md'
                              : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-white">{veh.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-orange-400" />}
                          </div>
                          <div className="text-[11px] text-slate-400">{veh.specs}</div>
                          <div className="text-[10px] font-mono text-orange-400 mt-2">
                            PLATE: {veh.plate}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Select Care Package */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    2. Choose Precision Service Package
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SERVICE_PACKAGES.map((pkg) => {
                      const isSelected = pkg.id === prebookPackageId;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => setPrebookPackageId(pkg.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-orange-500/15 border-orange-500/50 shadow-md'
                              : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-sm">{pkg.title}</span>
                            <span className="text-sm font-mono font-bold text-orange-400">
                              ${pkg.price} USD
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {pkg.description}
                          </p>
                          <div className="text-[10px] font-mono text-slate-500 mt-2">
                            Duration: {pkg.duration}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Date, Time & Station */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={prebookDate}
                      onChange={(e) => setPrebookDate(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Time Slot
                    </label>
                    <select
                      value={prebookTime}
                      onChange={(e) => setPrebookTime(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                    >
                      <option value="09:00 AM">09:00 AM (Early Intake)</option>
                      <option value="11:30 AM">11:30 AM (Mid-Day Dyno)</option>
                      <option value="02:00 PM">02:00 PM (Afternoon Runout)</option>
                      <option value="04:30 PM">04:30 PM (Evening Fast Pass)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Station & Bay Preference
                    </label>
                    <select
                      value={prebookBay}
                      onChange={(e) => setPrebookBay(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                    >
                      <option value="Bay 04 - Dyno & Multi-Sensor Calibration">
                        Bay 04 - Dyno & Diagnostics (Alex Vance)
                      </option>
                      <option value="Bay 02 - High-Torque Chassis Rig">
                        Bay 02 - Chassis Rig (Kurt Becker)
                      </option>
                      <option value="Bay 01 - Optical Laser Alignment">
                        Bay 01 - 3D Laser Alignment
                      </option>
                    </select>
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Special Telemetry or Track Requirements (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={prebookNotes}
                    onChange={(e) => setPrebookNotes(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white resize-none"
                    placeholder="e.g. Specify tire cold pressures, suspension damping clickers, or ECU logging preferences..."
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-400">
                    <div>Guaranteed Bay Slot Hold • Free Cancellation up to 24h</div>
                    <div className="text-emerald-400 font-semibold">Zero deposit required for Platinum VIPs</div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Confirm Pre-Booking & Hold Bay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Pre-Booking Confirmation Banner */}
              {prebookSuccessToken && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Pre-Booking Reserved Successfully!</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    Your appointment for <strong>{selectedPrebookVehicle.name}</strong> on <strong>{prebookDate} at {prebookTime}</strong> in <strong>{prebookBay}</strong> is officially held.
                  </p>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-white flex items-center justify-between">
                    <span>TELEMETRY TOKEN: <strong>{prebookSuccessToken}</strong></span>
                    <button
                      onClick={() => onNavigate('bookings')}
                      className="text-orange-400 hover:underline font-semibold"
                    >
                      View in Work Orders ›
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: My Garage & Service Records */}
        {activeTab === 'garage' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-[#191f2f]/90 border border-white/10 p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-white">Registered Customer Fleet ({vehicles.length})</h3>
                  <p className="text-xs text-slate-400">All registered vehicles linked to client {customerUser.email}</p>
                </div>

                <button
                  onClick={() => onNavigate('vehicles')}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white border border-orange-500/30 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Manage Fleet in Garage</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vehicles.map((v) => (
                  <div key={v.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/40">
                      <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{v.name}</div>
                      <div className="text-xs text-slate-400">{v.specs}</div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                      <span className="font-mono text-slate-400">Plate: {v.plate}</span>
                      <button
                        onClick={() => {
                          setSelectedVehicleId(v.id);
                          setActiveTab('status');
                        }}
                        className="text-orange-400 hover:underline font-semibold"
                      >
                        Track Status ›
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
