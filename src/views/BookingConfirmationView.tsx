import React, { useState } from 'react';
import { ViewMode, Vehicle, ServicePackage } from '../types';
import { 
  Check, 
  Copy, 
  CheckCheck, 
  Calendar, 
  Clock, 
  UserCheck, 
  ArrowRight, 
  LayoutDashboard, 
  Download, 
  Printer, 
  Sliders, 
  Key, 
  Radio, 
  Flag 
} from 'lucide-react';

interface BookingConfirmationViewProps {
  onNavigate: (view: ViewMode) => void;
  bookingToken?: string;
  selectedVehicle?: Vehicle;
  selectedPackage?: ServicePackage;
}

export const BookingConfirmationView: React.FC<BookingConfirmationViewProps> = ({
  onNavigate,
  bookingToken = 'BK-20260928-A1B2',
  selectedVehicle,
  selectedPackage,
}) => {
  const [copied, setCopied] = useState(false);

  const vehicleName = selectedVehicle?.name || '2023 Porsche 911 GT3';
  const vehicleSpecs = selectedVehicle?.specs || 'Chassis: WP0AF2A97PS293411 • 4.0L Boxer NA';
  const vehiclePlate = selectedVehicle?.plate || 'APX-911-GT';
  const packageName = selectedPackage?.title || '120-Point Diagnostic & Sensor Calibration';
  const packagePrice = selectedPackage?.price || 640;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadICS = () => {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ApexMoto//Precision Telemetry Booking//EN
BEGIN:VEVENT
SUMMARY:ApexMoto Service: ${vehicleName} - Bay 04
DESCRIPTION:${packageName} at ApexMoto Precision Hub. Token: ${bookingToken}
DTSTART:20260928T153000Z
DTEND:20260928T203000Z
LOCATION:ApexMoto Precision Bay 04 - Austin North
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ApexMoto_Booking_${bookingToken}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between text-xs">
        <div className="text-slate-400">
          <span>Apex Portal</span> <span className="text-slate-600">›</span>{' '}
          <span>Bookings</span> <span className="text-slate-600">›</span>{' '}
          <span className="text-orange-400 font-medium">Confirmation</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>BAY LOCKED & SYNCED</span>
        </div>
      </div>

      {/* Main Glass Confirmation Container */}
      <div className="rounded-3xl bg-[#191f2f]/85 border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] p-6 sm:p-10 space-y-8 backdrop-blur-2xl relative overflow-hidden">
        {/* Specular line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        {/* Big Success Icon and Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)]">
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
            TELEMETRY BAY RESERVATION
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Service Appointment Confirmed!
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
            Your bay reservation has been locked into the ApexMoto telemetry system with priority staging.
          </p>
        </div>

        {/* Unique Telemetry Token Box (Image 1) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c1322] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-orange-400 font-bold mb-1">
              <span className="material-symbols-outlined text-sm">qr_code_2</span>
              <span>UNIQUE TELEMETRY TOKEN</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-wide">
              {bookingToken}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Present on mobile or dash-screen at gate entry
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-2 transition-all self-start sm:self-center cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Token</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-orange-400" />
                <span>Copy Token</span>
              </>
            )}
          </button>
        </div>

        {/* 2 Middle Cards (Assigned Vehicle + Schedule & Calibration) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Assigned Vehicle */}
          <div className="p-5 rounded-2xl bg-[#141b2b]/90 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs text-orange-400">directions_car</span>
                <span>ASSIGNED VEHICLE</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 border border-white/10 text-orange-300 font-bold">
                {vehiclePlate}
              </span>
            </div>

            <div>
              <h2 className="text-base font-bold text-white tracking-tight">{vehicleName}</h2>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{vehicleSpecs}</p>
            </div>

            <div className="pt-3 border-t border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">ACTIVE STATION</span>
                <span className="text-emerald-400 font-semibold">BAY-04 / DYNO-CAL</span>
              </div>
              <div className="text-xs text-slate-300 font-medium">
                Dyno Stress & Multi-Sensor Calibration Bay
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-400 h-full rounded-full w-full"></div>
              </div>
            </div>
          </div>

          {/* Card 2: Schedule & Calibration */}
          <div className="p-5 rounded-2xl bg-[#141b2b]/90 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-blue-400" />
                <span>SCHEDULE & CALIBRATION</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                Confirmed
              </span>
            </div>

            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Monday, Sep 28, 2026</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                <strong className="text-white">11:30 AM EST</strong> • Est. Drop-off Duration: 5h
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5 text-xs">
              <div>
                <div className="text-[10px] uppercase font-mono text-slate-400">LEAD SPECIALIST</div>
                <div className="text-slate-200 font-semibold mt-0.5">Alex Vance</div>
                <div className="text-[11px] text-orange-400">Level 4 Master Tech</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-slate-400">EST. COMPLETION</div>
                <div className="text-slate-200 font-semibold mt-0.5">04:30 PM EST</div>
                <div className="text-[11px] text-emerald-400">Same-Day Turnaround</div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Package Hold Line Item (Image 1) */}
        <div className="p-4 rounded-2xl bg-[#0c1322] border border-white/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{packageName}</div>
              <div className="text-[11px] text-slate-400">
                Includes CAN-bus full scan, telemetry zeroing, and dynamic dyno bench run
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-base sm:text-lg font-mono font-bold text-white tabular-nums">
              ${packagePrice.toFixed(2)} <span className="text-[11px] text-slate-400 font-normal">HOLD</span>
            </div>
          </div>
        </div>

        {/* Arrival & Service Sequence (Image 1) */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-400 text-sm">route</span>
            <span>Arrival & Service Sequence</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl bg-[#141b2b] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-orange-400">01</span>
                <Key className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-xs font-bold text-white">Arrive at Bay #04</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Check in at Smart Locker #04 or initiate contact-free drive-in via Apex Mobile Key.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#141b2b] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-orange-400">02</span>
                <Radio className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-xs font-bold text-white">Live Telemetry Feed</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Stream live dyno readings, ECU metrics, and technician notes directly on your portal.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#141b2b] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-orange-400">03</span>
                <Flag className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xs font-bold text-white">Road-Test & Pickup</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Receive automated push alerts when calibration validation passes for instantaneous pickup.
              </p>
            </div>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => onNavigate('bookings')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_32px_rgba(249,115,22,0.6)] transition-all cursor-pointer"
          >
            <span>Track Status in Real-Time</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 text-orange-400" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Micro Actions (Image 1) */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-white/5 text-xs text-slate-400">
          <button
            onClick={handleDownloadICS}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-orange-400" />
            <span>Download Calendar Event (.ics)</span>
          </button>
          <a
            href="https://calendar.google.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Add to Google Calendar</span>
          </a>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Print Voucher</span>
          </button>
        </div>
      </div>

      {/* Footer Support Notice (Image 1) */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 px-2 gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-orange-400 text-sm">help</span>
          <span>Need to reschedule or modify performance telemetry packages? Concierge Desk is on standby 24/7.</span>
        </div>
        <button
          onClick={() => onNavigate('book')}
          className="text-orange-400 hover:text-orange-300 font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          Modify Booking →
        </button>
      </div>
    </div>
  );
};
