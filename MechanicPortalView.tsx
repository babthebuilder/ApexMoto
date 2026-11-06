import React, { useState } from 'react';
import { ViewMode, WorkOrder, InventoryItem, WorkOrderStep } from '../types';
import { INVENTORY_PARTS } from '../data/mockData';
import { AddPartModal } from '../components/AddPartModal';
import { 
  Wrench, 
  User, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  ArrowLeft,
  ChevronRight,
  FileText,
  AlertCircle,
  ShieldCheck,
  Award,
  BadgeCheck,
  Radio,
  Sliders,
  LogOut,
  Sparkles,
  Edit3,
  Check,
  X,
  Gauge,
  Calendar,
  Layers,
  Save,
  RefreshCw,
  Receipt
} from 'lucide-react';

interface MechanicPortalViewProps {
  onNavigate: (view: ViewMode) => void;
  workOrders: WorkOrder[];
  activeWorkOrder: WorkOrder;
  onSelectWorkOrder: (order: WorkOrder) => void;
  onUpdateWorkOrder: (order: WorkOrder) => void;
  onOpenMechanicLogin?: () => void;
}

export const MechanicPortalView: React.FC<MechanicPortalViewProps> = ({
  onNavigate,
  workOrders,
  activeWorkOrder,
  onSelectWorkOrder,
  onUpdateWorkOrder,
  onOpenMechanicLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'profile'>('jobs');
  const [showAddPart, setShowAddPart] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [jobsFilter, setJobsFilter] = useState<'all' | 'In Progress' | 'Pending' | 'Completed'>('all');
  const [searchJobQuery, setSearchJobQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editable fields for currently selected work order
  const [editStatus, setEditStatus] = useState<WorkOrder['status']>(activeWorkOrder.status);
  const [editProgress, setEditProgress] = useState<number>(activeWorkOrder.progressPercent);
  const [editStageName, setEditStageName] = useState<string>(activeWorkOrder.stageName);
  const [editEstCompletion, setEditEstCompletion] = useState<string>(activeWorkOrder.estCompletion);
  const [editTechNote, setEditTechNote] = useState<string>(activeWorkOrder.technicianLog?.note || '');
  const [editSteps, setEditSteps] = useState<WorkOrderStep[]>(activeWorkOrder.steps);

  const [currentTech] = useState({
    name: 'Alex Vance',
    badgeId: '#TECH-08-ALX',
    title: 'Level 4 Master Motorsport & Dyno Specialist',
    station: 'Bay 04 — Dyno & Brake Rig',
    shift: '08:00 - 17:00 UTC',
    accuracy: '99.8%',
    completedYTD: 412,
    rating: '4.98 / 5.00',
    terminalVersion: 'DIAGNOSTIC TERMINAL V4.2',
  });

  const [allocatedParts, setAllocatedParts] = useState([
    {
      id: 'ap-1',
      name: 'Castrol SRF Racing Brake Fluid (SKU: CSRF-500)',
      quantity: 2,
      unitPrice: 78.0,
      total: 156.0,
      note: 'Flushed front & rear circuits',
    },
  ]);

  // Sync edit states when activeWorkOrder changes
  const handleSelectJob = (order: WorkOrder) => {
    onSelectWorkOrder(order);
    setEditStatus(order.status);
    setEditProgress(order.progressPercent);
    setEditStageName(order.stageName);
    setEditEstCompletion(order.estCompletion);
    setEditTechNote(order.technicianLog?.note || '');
    setEditSteps(order.steps);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddPartConfirm = (partData: {
    partName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    note: string;
  }) => {
    setAllocatedParts((prev) => [
      ...prev,
      {
        id: `ap-${Date.now()}`,
        name: partData.partName,
        quantity: partData.quantity,
        unitPrice: partData.unitPrice,
        total: partData.total,
        note: partData.note,
      },
    ]);
    showToast(`Allocated ${partData.quantity}x ${partData.partName} to ${activeWorkOrder.id.toUpperCase()}`);
  };

  // Save changes from Edit Job Status Modal / Menu
  const handleSaveJobStatus = () => {
    const updated: WorkOrder = {
      ...activeWorkOrder,
      status: editStatus,
      progressPercent: editProgress,
      stageName: editStageName,
      estCompletion: editEstCompletion,
      steps: editSteps,
      technicianLog: activeWorkOrder.technicianLog
        ? {
            ...activeWorkOrder.technicianLog,
            note: editTechNote,
            timeAgo: 'Updated just now',
          }
        : undefined,
    };

    onUpdateWorkOrder(updated);
    setShowEditStatusModal(false);
    showToast(`Status updated to "${editStatus}" (${editProgress}%) & synced across portal!`);
  };

  // Quick 1-click status setter
  const handleQuickStatusChange = (status: WorkOrder['status']) => {
    setEditStatus(status);
    const updatedProgress = status === 'Completed' ? 100 : status === 'Delivered' ? 100 : activeWorkOrder.progressPercent;
    const updated: WorkOrder = {
      ...activeWorkOrder,
      status,
      progressPercent: updatedProgress,
    };
    onUpdateWorkOrder(updated);
    setEditProgress(updatedProgress);
    showToast(`Status set to ${status}!`);
  };

  // Quick advance progress (+10%)
  const handleAdvanceStage = () => {
    const nextPercent = Math.min(100, activeWorkOrder.progressPercent + 10);
    const nextStatus = nextPercent === 100 ? 'Completed' : activeWorkOrder.status;
    const updated = {
      ...activeWorkOrder,
      progressPercent: nextPercent,
      status: nextStatus,
    };
    onUpdateWorkOrder(updated);
    setEditProgress(nextPercent);
    setEditStatus(nextStatus);
    showToast(`Progress advanced to ${nextPercent}%`);
  };

  // Toggle step status
  const handleToggleStepStatus = (index: number) => {
    const newSteps = [...editSteps];
    const curr = newSteps[index].status;
    const nextStatus: WorkOrderStep['status'] = curr === 'completed' ? 'active' : curr === 'active' ? 'queued' : 'completed';
    newSteps[index] = {
      ...newSteps[index],
      status: nextStatus,
    };
    setEditSteps(newSteps);
  };

  const filteredJobs = workOrders.filter((job) => {
    if (jobsFilter !== 'all' && job.status !== jobsFilter) return false;
    if (searchJobQuery) {
      const q = searchJobQuery.toLowerCase();
      return (
        job.id.toLowerCase().includes(q) ||
        job.token.toLowerCase().includes(q) ||
        job.vehicleName.toLowerCase().includes(q) ||
        job.serviceTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0c1322] text-[#dce2f7] flex relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-6 z-50 px-4 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mechanic Sidebar (Image 11) */}
      <aside className="w-64 bg-[#0c1322] border-r border-white/5 p-4 flex flex-col justify-between shrink-0 select-none">
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.3)]">
                <span className="material-symbols-outlined text-sm">speed</span>
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-tight">ApexMoto</div>
                <div className="text-[9px] uppercase tracking-wider text-orange-400 font-bold">
                  SERVICE PORTAL
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('mechanic-login')}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Sign Out of Terminal"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section: Workstation Ops Tabs */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold mb-2">
              WORKSTATION OPS
            </div>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'jobs'
                  ? 'bg-orange-500/20 border border-orange-500/40 text-orange-400 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-orange-400" />
                <span>My Jobs</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-400">
                {workOrders.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-orange-500/20 border border-orange-500/40 text-orange-400 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4 text-orange-400" />
              <span>Mechanic Profile</span>
            </button>
          </div>
        </div>

        {/* Station Status Box (Image 11 bottom left) */}
        <div className="space-y-2">
          {onOpenMechanicLogin && (
            <button
              onClick={onOpenMechanicLogin}
              className="w-full py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-medium text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3 text-orange-400" />
              <span>Switch Tech Login</span>
            </button>
          )}

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5 font-mono">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Station</span>
              <span className="text-orange-400 font-bold">Bay 04</span>
            </div>
            <div className="text-xs font-semibold text-white">Dyno & Diagnostics</div>
            <div className="text-[10px] text-slate-400">Shift: 08:00 - 17:00</div>
            <div className="text-[9px] text-slate-500 pt-1 border-t border-white/5 uppercase">
              {currentTech.terminalVersion}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      {activeTab === 'jobs' ? (
        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-6xl">
          {/* Top Header of My Jobs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  ACTIVE RO IN {activeWorkOrder.assignedBay.toUpperCase()}
                </span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
                Job #{activeWorkOrder.id.toUpperCase()} • {activeWorkOrder.vehicleName}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Edit Status of Job Menu Button */}
              <button
                onClick={() => {
                  setEditStatus(activeWorkOrder.status);
                  setEditProgress(activeWorkOrder.progressPercent);
                  setEditStageName(activeWorkOrder.stageName);
                  setEditEstCompletion(activeWorkOrder.estCompletion);
                  setEditTechNote(activeWorkOrder.technicianLog?.note || '');
                  setEditSteps(activeWorkOrder.steps);
                  setShowEditStatusModal(true);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-[0_4px_16px_rgba(249,115,22,0.35)] transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Job Status</span>
              </button>

              <button
                onClick={() => setShowAddPart(true)}
                className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-orange-400" />
                <span>Allocate Part</span>
              </button>

              <button
                onClick={() => onNavigate('mechanic-login')}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-xs font-medium text-slate-300 hover:text-rose-300 border border-white/5 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Sign out of technician terminal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Terminal Logout</span>
              </button>
            </div>
          </div>

          {/* Quick Status Bar & Stepper */}
          <div className="rounded-2xl bg-[#191f2f]/90 border border-white/10 p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono uppercase font-semibold">Current Status:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                      activeWorkOrder.status === 'In Progress'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : activeWorkOrder.status === 'Pending'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : activeWorkOrder.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}
                  >
                    ● {activeWorkOrder.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight mt-1">
                  Stage: {activeWorkOrder.stageName}
                </h3>
              </div>

              {/* 1-Tap Status Quick Switcher Buttons */}
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
                {(['Pending', 'In Progress', 'Completed', 'Delivered'] as WorkOrder['status'][]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleQuickStatusChange(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      activeWorkOrder.status === st
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Meter with Advance Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Execution Progress</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAdvanceStage}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline"
                  >
                    + Advance (+10%)
                  </button>
                  <span className="font-bold text-orange-400 text-sm tabular-nums">
                    {activeWorkOrder.progressPercent}%
                  </span>
                </div>
              </div>

              <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${activeWorkOrder.progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Milestone Steps Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-xs">
              {activeWorkOrder.steps.map((st, idx) => (
                <div
                  key={st.stepNumber}
                  onClick={() => {
                    handleToggleStepStatus(idx);
                    const newSteps = [...activeWorkOrder.steps];
                    const nextSt = newSteps[idx].status === 'completed' ? 'active' : newSteps[idx].status === 'active' ? 'queued' : 'completed';
                    newSteps[idx] = { ...newSteps[idx], status: nextSt };
                    onUpdateWorkOrder({ ...activeWorkOrder, steps: newSteps });
                    showToast(`Step "${st.title}" toggled to ${nextSt}`);
                  }}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    st.status === 'completed'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : st.status === 'active'
                      ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                      : 'bg-white/[0.03] border-white/5 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span>STEP {st.stepNumber}</span>
                    <span className="capitalize">{st.status}</span>
                  </div>
                  <div className="font-bold truncate">{st.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Jobs Docket Queue / All Assigned Jobs Table */}
          <div className="rounded-2xl bg-[#191f2f]/80 border border-white/10 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-400" />
                <h2 className="text-sm font-bold text-white">Workshop Jobs Queue ({workOrders.length})</h2>
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1.5 text-xs">
                {(['all', 'In Progress', 'Pending', 'Completed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setJobsFilter(filter)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      jobsFilter === filter
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter === 'all' ? 'All Jobs' : filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-white/5 text-xs">
              {filteredJobs.map((job) => {
                const isCurrent = job.id === activeWorkOrder.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => handleSelectJob(job)}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors cursor-pointer ${
                      isCurrent ? 'bg-orange-500/[0.08] border-l-4 border-l-orange-500' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{job.token}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            job.status === 'In Progress'
                              ? 'bg-blue-500/15 text-blue-300'
                              : job.status === 'Pending'
                              ? 'bg-amber-500/15 text-amber-300'
                              : 'bg-emerald-500/15 text-emerald-300'
                          }`}
                        >
                          ● {job.status}
                        </span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-orange-500/20 text-orange-400 font-bold">
                            CURRENTLY OPEN
                          </span>
                        )}
                      </div>
                      <div className="text-white font-medium">{job.vehicleName}</div>
                      <div className="text-[11px] text-slate-400">{job.serviceTitle}</div>
                    </div>

                    <div className="flex items-center gap-4 sm:text-right">
                      <div>
                        <div className="text-[10px] uppercase font-mono text-slate-400">Station & Tech</div>
                        <div className="text-slate-200 font-medium">{job.assignedBay}</div>
                        <div className="text-[11px] text-orange-400 font-mono">{job.progressPercent}% Complete</div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectJob(job);
                          setShowEditStatusModal(true);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 border border-white/10 flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3 h-3 text-orange-400" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Allocated Parts Inventory List (Image 11) */}
          <div className="rounded-2xl bg-[#191f2f]/80 border border-white/10 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">Allocated Components & Parts</h2>
                <p className="text-xs text-slate-400">Items billed directly to RO #{activeWorkOrder.id.toUpperCase()}</p>
              </div>
              <button
                onClick={() => setShowAddPart(true)}
                className="px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Part / Component</span>
              </button>
            </div>

            <div className="divide-y divide-white/5 text-xs">
              {allocatedParts.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>{item.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400">
                        ALLOCATED
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 italic">"{item.note}"</div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-white font-bold tabular-nums">
                      {item.quantity} x ${item.unitPrice.toFixed(2)} = ${item.total.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-500">Track Spec OEM</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        /* Mechanic Profile View */
        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto max-w-5xl">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 font-bold">
                  MASTER TECHNICIAN DOSSIER
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                Mechanic Profile & Credentials
              </h1>
            </div>

            <div className="flex items-center gap-2.5">
              {onOpenMechanicLogin && (
                <button
                  onClick={onOpenMechanicLogin}
                  className="px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Switch Technician Login</span>
                </button>
              )}
              <button
                onClick={() => setActiveTab('jobs')}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-[0_4px_16px_rgba(249,115,22,0.4)] cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Return to Active Jobs</span>
              </button>
            </div>
          </div>

          {/* Profile Hero Card */}
          <div className="rounded-2xl bg-[#191f2f]/90 border border-white/10 p-6 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"></div>

            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center text-white text-3xl font-black shadow-[0_0_30px_rgba(249,115,22,0.5)]">
                AV
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-2 border-[#191f2f] flex items-center justify-center text-white shadow-lg" title="Active on Duty">
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {currentTech.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  {currentTech.badgeId}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ● Active On Bay Duty
                </span>
              </div>

              <p className="text-xs text-slate-300 font-medium">
                {currentTech.title}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs font-mono text-slate-300">
                <div className="p-2.5 rounded-xl bg-[#0c1322] border border-white/5">
                  <div className="text-[10px] text-slate-500 uppercase">Assigned Workstation</div>
                  <div className="font-bold text-white mt-0.5">{currentTech.station}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0c1322] border border-white/5">
                  <div className="text-[10px] text-slate-500 uppercase">Shift Schedule</div>
                  <div className="font-bold text-white mt-0.5">{currentTech.shift}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0c1322] border border-white/5">
                  <div className="text-[10px] text-slate-500 uppercase">Security Clearance</div>
                  <div className="font-bold text-orange-400 mt-0.5">Level 4 Sign-off</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance & Quality Scorecards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#191f2f]/80 border border-white/10">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
                TOLERANCE ACCURACY
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {currentTech.accuracy}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Within ±0.002mm spec</div>
            </div>

            <div className="p-4 rounded-xl bg-[#191f2f]/80 border border-white/10">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
                COMPLETED ORDERS YTD
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {currentTech.completedYTD}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">100% Quality pass</div>
            </div>

            <div className="p-4 rounded-xl bg-[#191f2f]/80 border border-white/10">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
                MASTER TECH RATING
              </div>
              <div className="text-2xl font-bold font-mono text-orange-400 tabular-nums">
                {currentTech.rating}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Based on 320 reviews</div>
            </div>

            <div className="p-4 rounded-xl bg-[#191f2f]/80 border border-white/10">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
                BAY CLEARANCE RATE
              </div>
              <div className="text-2xl font-bold font-mono text-blue-400 tabular-nums">
                100%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Zero warranty returns</div>
            </div>
          </div>

          {/* Master Certifications & Badges */}
          <div className="rounded-2xl bg-[#191f2f]/80 border border-white/10 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">
                  Verified Master Certifications & Diplomas
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ISO 9001:2015 Verified</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-xl bg-[#0c1322] border border-white/5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">ASE Master Automobile Technician</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Certified in Engine Repair (A1), Brakes (A5), Suspension (A4), and Electrical (A6).
                  </div>
                  <div className="text-[10px] font-mono text-orange-400 mt-1">Certificate #ASE-884920</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0c1322] border border-white/5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Porsche Motorsport Dyno Specialist (Tier 4)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Certified for 992 GT3 / GT3 RS dyno telemetry, ECU CAN-bus mapping, and carbon-ceramic brakes.
                  </div>
                  <div className="text-[10px] font-mono text-blue-400 mt-1">Stuttgart Factory Auth #P-992-08</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0c1322] border border-white/5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Advanced Engine Performance (L1)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Micro-tolerance diagnostic calibration, emissions testing, and turbo manifold tuning.
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-1">Ref #L1-83921</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0c1322] border border-white/5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Castrol & Motul Fluidics Master Lead</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Dry sump racing evacuation, lab viscosity certification, and thermal benchmark verification.
                  </div>
                  <div className="text-[10px] font-mono text-purple-400 mt-1">Certification #MOT-300V-EX</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Edit Job Status & Management Modal / Menu */}
      {showEditStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#191f2f] border border-white/10 shadow-2xl p-6 overflow-hidden space-y-5">
            {/* Top specular line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"></div>

            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Edit Job Status & Execution
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    RO #{activeWorkOrder.id.toUpperCase()} • {activeWorkOrder.vehicleName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditStatusModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Status Picker */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Job Life-cycle Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['In Progress', 'Pending', 'Completed', 'Delivered'] as WorkOrder['status'][]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditStatus(st)}
                      className={`p-2 rounded-lg font-semibold text-center transition-all cursor-pointer ${
                        editStatus === st
                          ? 'bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.4)]'
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Slider & Steppers */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Execution Progress Percentage
                  </label>
                  <span className="font-mono text-sm font-bold text-orange-400 tabular-nums">
                    {editProgress}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editProgress}
                  onChange={(e) => setEditProgress(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <button
                    type="button"
                    onClick={() => setEditProgress(25)}
                    className="hover:text-orange-400 cursor-pointer"
                  >
                    25% (Intake)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditProgress(50)}
                    className="hover:text-orange-400 cursor-pointer"
                  >
                    50% (Mid-service)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditProgress(68)}
                    className="hover:text-orange-400 cursor-pointer"
                  >
                    68% (Brakes)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditProgress(100)}
                    className="hover:text-orange-400 cursor-pointer text-emerald-400 font-bold"
                  >
                    100% (Done)
                  </button>
                </div>
              </div>

              {/* Active Stage Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Active Stage Description
                </label>
                <input
                  type="text"
                  value={editStageName}
                  onChange={(e) => setEditStageName(e.target.value)}
                  placeholder="e.g. High-Torque Caliper Alignment & Bleed"
                  className="w-full h-9 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Estimated Completion Time */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Estimated Bay Clearance Time
                </label>
                <input
                  type="text"
                  value={editEstCompletion}
                  onChange={(e) => setEditEstCompletion(e.target.value)}
                  placeholder="e.g. Today, 16:30 (42m rem.)"
                  className="w-full h-9 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Technician Log Note */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Technician Log & Diagnostic Note
                </label>
                <textarea
                  rows={3}
                  value={editTechNote}
                  onChange={(e) => setEditTechNote(e.target.value)}
                  placeholder="Enter observation notes, sensor tolerance data, or inspection sign-off..."
                  className="w-full p-2.5 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                ></textarea>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowEditStatusModal(false)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveJobStatus}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_4px_16px_rgba(249,115,22,0.4)] cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save & Sync Status</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Part Modal (Image 11) */}
      <AddPartModal
        isOpen={showAddPart}
        jobId={`#${activeWorkOrder.id.toUpperCase()}`}
        onClose={() => setShowAddPart(false)}
        onConfirm={handleAddPartConfirm}
      />
    </div>
  );
};
