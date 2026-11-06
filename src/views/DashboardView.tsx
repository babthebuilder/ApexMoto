import React, { useState } from 'react';
import { ViewMode, WorkOrder, Vehicle } from '../types';
import { HERO_IMAGE } from '../data/mockData';
import { 
  Wrench, 
  Calendar, 
  Car, 
  Clock, 
  UserCheck, 
  Maximize2, 
  CheckCircle2, 
  ChevronRight, 
  MessageSquare, 
  PhoneCall, 
  FileText,
  AlertCircle,
  Video
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenLiveCam: () => void;
  onOpenConcierge: () => void;
  vehicles: Vehicle[];
  activeWorkOrder: WorkOrder;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenLiveCam,
  onOpenConcierge,
  vehicles,
  activeWorkOrder,
}) => {
  const [showTechNote, setShowTechNote] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-orange-400 font-bold">
              TELEMETRY HUB 04
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, Marcus
          </h1>
          <p className="text-xs text-[#94a3b8] flex items-center gap-2 mt-0.5">
            <span className="material-symbols-outlined text-xs text-blue-400 animate-pulse">sensors</span>
            <span>Live telemetry connection active • Workshop Bay 04 Synced</span>
          </p>
        </div>

        {/* Quick Action */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('book')}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-[0_4px_16px_rgba(249,115,22,0.35)] hover:shadow-[0_6px_22px_rgba(249,115,22,0.5)] transition-all cursor-pointer"
          >
            <span>+ Book New Service</span>
          </button>
        </div>
      </div>

      {/* Top 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Active Jobs */}
        <div 
          onClick={() => onNavigate('bookings')}
          className="p-4 rounded-xl bg-[#191f2f]/80 border border-white/10 hover:border-orange-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">ACTIVE JOBS</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Wrench className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">01</span>
            <span className="text-xs text-blue-400 font-medium">In Progress</span>
          </div>
          <div className="text-xs text-[#94a3b8] mt-2">
            Porsche 911 GT3 (992) • <span className="text-white font-mono">68% complete</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2.5">
            <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full w-[68%]"></div>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div 
          onClick={() => onNavigate('bookings')}
          className="p-4 rounded-xl bg-[#191f2f]/80 border border-white/10 hover:border-orange-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">UPCOMING BOOKINGS</span>
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">02</span>
            <span className="text-xs text-orange-400 font-medium">Scheduled</span>
          </div>
          <div className="text-xs text-[#94a3b8] mt-2">
            Next: <strong className="text-white">Oct 14</strong> • BMW M4 Competition
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1.5">
            <span className="material-symbols-outlined text-xs text-orange-400">precision_manufacturing</span>
            <span>Prep bay reserved in advance</span>
          </div>
        </div>

        {/* Garage Assets */}
        <div 
          onClick={() => onNavigate('vehicles')}
          className="p-4 rounded-xl bg-[#191f2f]/80 border border-white/10 hover:border-orange-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">GARAGE ASSETS</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Car className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">03</span>
            <span className="text-xs text-slate-300 font-medium">Vehicles Linked</span>
          </div>
          <div className="text-xs text-[#94a3b8] mt-2">
            2 Active on Road • 1 Track Archived
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span>911 GT3</span>
            <span>•</span>
            <span>M4 Comp</span>
            <span>•</span>
            <span>RS6</span>
          </div>
        </div>
      </div>

      {/* Main Active Job Card (Image 16) */}
      <div className="rounded-2xl bg-[#191f2f]/90 border border-white/10 shadow-xl p-5 sm:p-6 overflow-hidden">
        {/* Top Header of Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 mt-0.5">
              <span className="material-symbols-outlined text-xl">sports_score</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {activeWorkOrder.vehicleName}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-orange-400 font-semibold">
                  APX-911-GT
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Order <strong className="text-white font-mono">{activeWorkOrder.id.toUpperCase()}</strong> • {activeWorkOrder.serviceTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-left md:text-right">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold flex items-center md:justify-end gap-1">
                <UserCheck className="w-3 h-3 text-orange-400" />
                <span>LEAD TECHNICIAN</span>
              </div>
              <div className="text-xs font-bold text-white">
                {activeWorkOrder.leadTechnician.name}{' '}
                <span className="text-orange-400 font-normal">({activeWorkOrder.leadTechnician.cert})</span>
              </div>
            </div>

            <div className="text-left md:text-right pl-4 border-l border-white/10">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold flex items-center md:justify-end gap-1">
                <Clock className="w-3 h-3 text-blue-400" />
                <span>EST. COMPLETION</span>
              </div>
              <div className="text-xs font-bold text-white">
                Today, 16:30 <span className="text-emerald-400 font-normal">(42m rem.)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Split Section: Live Camera + Stage Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
          {/* Left: Live Camera Viewport (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div 
              onClick={onOpenLiveCam}
              className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-white/10 group cursor-pointer shadow-lg"
            >
              <img
                src={HERO_IMAGE}
                alt="Bay 04 Live Cam"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Tag top left */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-white">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span>CAM 04 LIVE</span>
              </div>

              {/* Overlay bottom controls */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] font-mono text-white/90">
                <div className="bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                  FPS: 60 • 4K HDR
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLiveCam();
                  }}
                  className="flex items-center gap-1 bg-black/60 hover:bg-black/80 px-2 py-0.5 rounded backdrop-blur-sm text-white cursor-pointer transition-colors"
                >
                  <Maximize2 className="w-3 h-3 text-orange-400" />
                  <span>Expand Feed</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={onOpenLiveCam}
                className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Video className="w-3.5 h-3.5 text-orange-400" />
                <span>Live Bay Cam Feed</span>
              </button>
              <button
                onClick={() => setShowTechNote(!showTechNote)}
                className="py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Tech Alex Note</span>
              </button>
            </div>

            {showTechNote && (
              <div className="mt-2.5 p-3 rounded-lg bg-[#070e1d] border border-orange-500/30 text-xs text-slate-300 space-y-1 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[11px] text-orange-400 font-semibold font-mono">
                  <span>NOTE FROM ALEX VANCE (#08)</span>
                  <span>18m ago</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  "Front left rotor showed 0.08mm micro-variance. Lathing sweep configured to factory spec. Brake fluid boiled test scored 210°C—flush is running smoothly."
                </p>
              </div>
            )}
          </div>

          {/* Right: Stage Detail & Progress (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-orange-400">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>Current: Stage 3 of 4 Active</span>
                </div>
                <div className="text-xl font-bold text-white font-mono tabular-nums">
                  68%
                </div>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight">
                High-Torque Caliper Alignment & Bleed
              </h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed mt-1">
                Hydraulic pressure verification across quad-piston ceramic assemblies. Laser micrometric disc alignment within 0.02mm tolerance parameters.
              </p>

              {/* Multi-stage Progress Meter */}
              <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden mt-4 relative">
                <div className="bg-gradient-to-r from-blue-500 via-orange-400 to-amber-400 h-full rounded-full w-[68%]"></div>
              </div>

              {/* 4 Stages Pills / Checklist */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-left">
                  <div className="text-[10px] font-mono text-emerald-400 font-semibold">01 INTAKE & SCAN</div>
                  <div className="text-xs font-bold text-emerald-300 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Passed</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-left">
                  <div className="text-[10px] font-mono text-emerald-400 font-semibold">02 ROTOR MEASURE</div>
                  <div className="text-xs font-bold text-emerald-300 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Passed</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-orange-500/15 border border-orange-500/30 text-left">
                  <div className="text-[10px] font-mono text-orange-400 font-semibold">03 CALIPER TORQUE</div>
                  <div className="text-xs font-bold text-orange-300 mt-0.5 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping"></span>
                    <span>In Action</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-left opacity-60">
                  <div className="text-[10px] font-mono text-slate-400 font-semibold">04 TRACK ROAD DYNO</div>
                  <div className="text-xs font-medium text-slate-400 mt-0.5">Queued</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Target Bay Clearance: <strong className="text-white font-mono">16:30 EST</strong>
              </span>
              <button
                onClick={() => onNavigate('bookings')}
                className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Full Telemetry Timeline</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Appointments (Image 16) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-400" />
          <h2 className="text-base font-bold text-white tracking-tight">Scheduled Appointments</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Appointment 1: BMW M4 */}
          <div className="p-4 rounded-xl bg-[#191f2f]/80 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <span className="material-symbols-outlined text-base">oil_barrel</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">2022 BMW M4 Competition</h3>
                    <div className="text-[11px] font-mono text-slate-400">BK-20261014-B981</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  ● Pending
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5 text-xs">
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">SERVICE PACKAGE</div>
                  <div className="text-slate-200 font-medium">Oil & Fluidics Precision Flush</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">SCHEDULED DATE</div>
                  <div className="text-slate-200 font-medium">Oct 14, 2026 @ 09:00 AM</div>
                </div>
                <div className="mt-2">
                  <div className="text-[10px] uppercase font-mono text-slate-400">DEDICATED SLOT</div>
                  <div className="text-slate-200 font-medium">Bay 02 • Fluidics Dock</div>
                </div>
                <div className="mt-2">
                  <div className="text-[10px] uppercase font-mono text-slate-400">ESTIMATED DURATION</div>
                  <div className="text-slate-200 font-medium">2h 15m</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/5 text-xs">
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>OEM Liqui-Moly synthetic reserved</span>
              </span>
              <button
                onClick={() => onNavigate('book')}
                className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Reschedule
              </button>
            </div>
          </div>

          {/* Appointment 2: Audi RS6 */}
          <div className="p-4 rounded-xl bg-[#191f2f]/80 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <span className="material-symbols-outlined text-base">tune</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">2024 Audi RS6 Avant</h3>
                    <div className="text-[11px] font-mono text-slate-400">BK-20261102-C412</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 border border-blue-500/30 text-blue-300">
                  ● Received
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5 text-xs">
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">SERVICE PACKAGE</div>
                  <div className="text-slate-200 font-medium">Winter Tire & 3D Wheel Align</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">SCHEDULED DATE</div>
                  <div className="text-slate-200 font-medium">Nov 02, 2026 @ 11:30 AM</div>
                </div>
                <div className="mt-2">
                  <div className="text-[10px] uppercase font-mono text-slate-400">DEDICATED SLOT</div>
                  <div className="text-slate-200 font-medium">Bay 06 • Chassis Rig</div>
                </div>
                <div className="mt-2">
                  <div className="text-[10px] uppercase font-mono text-slate-400">ESTIMATED DURATION</div>
                  <div className="text-slate-200 font-medium">1h 45m</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/5 text-xs">
              <span className="text-[11px] text-slate-300 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-orange-400">inventory_2</span>
                <span>Pirelli Sottozero 3 in inventory</span>
              </span>
              <button
                onClick={() => onNavigate('book')}
                className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Concierge Hotline Card (Image 16) */}
      <div className="rounded-xl bg-[#141b2b] border border-orange-500/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold shadow-[0_0_12px_rgba(249,115,22,0.4)]">
            <span className="material-symbols-outlined text-xl">support_agent</span>
          </div>
          <div>
            <div className="text-xs font-bold text-white">Marcus, your Apex Concierge is online</div>
            <div className="text-[11px] text-slate-400">Questions about the GT3 caliper calibration? Direct hotline connected to Bay 04.</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenConcierge}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-orange-400" />
            <span>Voice Channel</span>
          </button>
          <button
            onClick={onOpenConcierge}
            className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_2px_12px_rgba(249,115,22,0.3)] cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Instant Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};
