import React, { useState } from 'react';
import { ViewMode, WorkOrder, UserRole } from '../types';
import { 
  Check, 
  Video, 
  Download, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Wrench,
  Key,
  Gauge,
  Receipt
} from 'lucide-react';

interface WorkOrdersViewProps {
  workOrders: WorkOrder[];
  onNavigate: (view: ViewMode) => void;
  onOpenLiveCam: () => void;
  onOpenConcierge: () => void;
  currentRole?: UserRole;
}

export const WorkOrdersView: React.FC<WorkOrdersViewProps> = ({
  workOrders,
  onNavigate,
  onOpenLiveCam,
  onOpenConcierge,
  currentRole = 'customer',
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(workOrders[0].id);
  const [filterType, setFilterType] = useState<'all' | 'active' | 'archived'>('active');

  const selectedOrder = workOrders.find((o) => o.id === selectedOrderId) || workOrders[0];

  const filteredOrders = workOrders.filter((o) => {
    if (filterType === 'active') return o.status === 'In Progress' || o.status === 'Pending';
    if (filterType === 'archived') return o.status === 'Completed' || o.status === 'Delivered';
    return true;
  });

  const handleDownloadPDF = () => {
    // Generate text/pdf voucher download
    const content = `APEXMOTO PRECISION WORK ORDER
=======================================
Work Order ID: ${selectedOrder.id.toUpperCase()}
Telemetry Token: ${selectedOrder.token}
Vehicle: ${selectedOrder.vehicleName}
Status: ${selectedOrder.status}
Lead Technician: ${selectedOrder.leadTechnician.name} (${selectedOrder.leadTechnician.cert})
Assigned Station: ${selectedOrder.assignedBay}
Est. Clearance: ${selectedOrder.estCompletion}

SERVICE STAGES:
${selectedOrder.steps.map(s => `- [${s.status.toUpperCase()}] ${s.title} (${s.time})\n  ${s.description}`).join('\n')}

TECHNICIAN NOTE:
${selectedOrder.technicianLog?.note || 'Standard telemetry verification passed.'}

ISO 9001 Certified • Apex Diagnostic Systems
=======================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Work_Order_${selectedOrder.token}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header (Image 13) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-orange-400 font-bold">
              TELEMETRY CENTER / RO SCHEDULE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Active Work Orders & Dispatch
          </h1>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/[0.04] border border-white/5 text-xs">
          <span className="text-slate-400 px-2 text-[11px] font-medium">Filter Orders:</span>
          <button
            onClick={() => setFilterType('active')}
            className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
              filterType === 'active' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Active (2)
          </button>
          <button
            onClick={() => setFilterType('archived')}
            className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
              filterType === 'archived' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Archived (2)
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Queue & Right Timeline Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Docket Queue (5 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1 text-xs">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
              CUSTOMER DOCKET QUEUE
            </span>
            <span className="text-orange-400 font-mono text-[11px]">
              {workOrders.length} Orders Synced
            </span>
          </div>

          <div className="space-y-2.5">
            {workOrders.map((order) => {
              const isSelected = order.id === selectedOrderId;
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#191f2f] border-orange-500/50 shadow-[0_8px_25px_rgba(0,0,0,0.5),0_0_15px_rgba(249,115,22,0.15)]'
                      : 'bg-[#141b2b]/80 border-white/5 hover:border-white/20 hover:bg-[#191f2f]/60'
                  }`}
                >
                  {/* Top line token & status */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-[11px] font-semibold text-slate-300">
                      {order.token}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        order.status === 'In Progress'
                          ? 'bg-blue-500/15 border border-blue-500/30 text-blue-300'
                          : order.status === 'Pending'
                          ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                          : order.status === 'Completed'
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                          : 'bg-purple-500/15 border border-purple-500/30 text-purple-300'
                      }`}
                    >
                      ● {order.status}
                    </span>
                  </div>

                  <h2 className="text-sm font-bold text-white tracking-tight">
                    {order.vehicleName}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {order.serviceTitle}
                  </p>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-[11px] text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-orange-400" />
                      <span>{order.date}</span>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? 'text-orange-400 translate-x-1' : 'text-slate-600'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Telemetry Track & Detailed Timeline (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-[#191f2f]/90 border border-white/10 p-6 space-y-6 shadow-2xl">
          {/* Header of Detail View */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 font-bold">
                  TELEMETRY TRACK
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
              </div>
              <h2 className="text-2xl font-black text-white font-mono tracking-tight">
                {selectedOrder.token}
              </h2>
              <div className="text-xs text-slate-300 font-medium mt-1">
                {selectedOrder.vehicleName} Coupe
              </div>
            </div>

            {/* Technician Info Box */}
            <div className="p-3 rounded-xl bg-[#070e1d] border border-white/10 text-xs space-y-1.5 min-w-[220px]">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="material-symbols-outlined text-orange-400 text-sm">engineering</span>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Technician</div>
                  <div className="font-semibold text-white">
                    {selectedOrder.leadTechnician.name} ({selectedOrder.leadTechnician.id})
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-300 pt-1.5 border-t border-white/5">
                <span className="material-symbols-outlined text-blue-400 text-sm">garage</span>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Assigned Bay</div>
                  <div className="font-semibold text-white">{selectedOrder.assignedBay}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stepped Timeline (Image 13) */}
          <div className="space-y-6 relative pl-3">
            {/* Vertical connector line */}
            <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-white/10"></div>

            {/* Step 1 */}
            <div className="relative flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 z-10 shadow-[0_0_12px_rgba(59,130,246,0.5)]">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white tracking-wide">
                    1. Check-In & Diagnostics
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/15 text-blue-300 font-semibold">
                    Completed - 08:30 AM
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Vehicle check-in & initial OBD-II scan finished. Zero stored engine fault codes detected across CAN-bus network.
                </p>
              </div>
            </div>

            {/* Step 2 (Active Step with progress bar) */}
            <div className="relative flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 z-10 shadow-[0_0_16px_rgba(249,115,22,0.6)]">
                <Wrench className="w-4 h-4" />
              </div>
              <div className="flex-1 pt-1 p-4 rounded-xl bg-white/[0.03] border border-orange-500/30">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-orange-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping"></span>
                    <span>2. Precision Calibration</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange-500/20 text-orange-400 font-bold uppercase tracking-wider">
                    Active Execution
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Currently executing: Micro-machining front carbon-ceramic rotors & high-temp synthetic fluidics pressure flush.
                </p>

                {/* Progress Bar inside Active Execution */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Brake Rotor Machining Process</span>
                    <span className="text-orange-400 font-bold tabular-nums">68%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full w-[68%]"></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                    <span>Target Tolerances: <strong className="text-emerald-400 font-semibold">±0.002mm</strong></span>
                    <span>Est. Bay Clearance: <strong className="text-white font-semibold">16:30</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/20 text-slate-400 flex items-center justify-center shrink-0 z-10">
                <Gauge className="w-4 h-4" />
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300">
                    3. Road Dyno & Certification
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">Scheduled ~16:45</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Final multi-point safety validation, telemetry high-rpm pull test, and electronic friction coefficient signoff.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/20 text-slate-400 flex items-center justify-center shrink-0 z-10">
                <Key className="w-4 h-4" />
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300">
                    4. Client Handover
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">Estimated 17:30</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Contactless smart key release scheduled at Bay Secure Locker #04 with biometric signature prompt.
                </p>
              </div>
            </div>
          </div>

          {/* Technician Log Card with Verified Snapshot (Image 13) */}
          {selectedOrder.technicianLog && (
            <div className="p-4 rounded-xl bg-[#070e1d] border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Snapshot Image */}
                <div className="relative w-36 aspect-video sm:aspect-square sm:w-28 rounded-lg overflow-hidden border border-white/10 shrink-0">
                  <img
                    src={selectedOrder.technicianLog.camImage}
                    alt="Rotor Cam 04"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/70 text-[9px] font-mono text-orange-400">
                    {selectedOrder.technicianLog.camLabel}
                  </span>
                </div>

                {/* Log Description */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-slate-400 uppercase font-semibold">
                      TECHNICIAN LOG {selectedOrder.technicianLog.id}
                    </span>
                    <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Snapshot</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "{selectedOrder.technicianLog.note}"
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-500 font-mono">
                      {selectedOrder.technicianLog.timeAgo}
                    </span>
                    <button
                      onClick={onOpenConcierge}
                      className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Message {selectedOrder.technicianLog.techName}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action CTAs (Image 13) */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-white/5">
            <button
              onClick={onOpenLiveCam}
              className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(249,115,22,0.4)] transition-all cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Live Bay Webcam</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>Download Work Order PDF</span>
            </button>
            {(selectedOrder.status === 'Completed' || selectedOrder.status === 'Delivered') && (
              <button
                onClick={() => onNavigate(currentRole === 'admin' ? 'admin' : 'invoices')}
                className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span>
                  {currentRole === 'admin' 
                    ? (selectedOrder.invoiced ? 'View Invoice (Admin)' : 'Generate Invoice (Admin)') 
                    : 'View Digital Invoice'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
