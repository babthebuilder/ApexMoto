import React, { useState } from 'react';
import { ViewMode, WorkOrder, InvoiceItem, Vehicle } from '../types';
import { GenerateInvoiceModal } from '../components/GenerateInvoiceModal';
import { 
  ShieldCheck, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Download, 
  Search, 
  Filter, 
  Plus, 
  Car, 
  Wrench, 
  ArrowLeft, 
  Eye, 
  Check, 
  CreditCard, 
  FileText, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Printer
} from 'lucide-react';

interface AdminPortalViewProps {
  onNavigate: (view: ViewMode) => void;
  workOrders: WorkOrder[];
  invoices: InvoiceItem[];
  vehicles: Vehicle[];
  onUpdateWorkOrder: (order: WorkOrder) => void;
  onAddInvoice: (newInvoice: InvoiceItem, updatedOrder?: WorkOrder) => void;
  onUpdateInvoiceStatus: (invoiceId: string, status: 'Paid' | 'Pending') => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  onNavigate,
  workOrders,
  invoices,
  vehicles,
  onUpdateWorkOrder,
  onAddInvoice,
  onUpdateInvoiceStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'completed-vehicles' | 'ledger' | 'bays'>('completed-vehicles');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unbilled' | 'invoiced'>('all');
  
  // Modal states
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<WorkOrder | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<InvoiceItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Completed or Delivered Work Orders
  const completedOrders = workOrders.filter(
    (order) => order.status === 'Completed' || order.status === 'Delivered'
  );

  // Unbilled completed work orders
  const unbilledCompletedOrders = completedOrders.filter((o) => !o.invoiced);

  // Total revenue billed across all invoices
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  // Estimated unbilled completed revenue (based on approx $700 avg)
  const unbilledEstimatedValue = unbilledCompletedOrders.reduce((sum, o) => sum + (o.basePrice || 640), 0);

  // Filter completed vehicles list
  const filteredCompletedOrders = completedOrders.filter((order) => {
    if (statusFilter === 'unbilled' && order.invoiced) return false;
    if (statusFilter === 'invoiced' && !order.invoiced) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.token.toLowerCase().includes(q) ||
        order.vehicleName.toLowerCase().includes(q) ||
        order.serviceTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filter ledger invoices
  const filteredInvoices = invoices.filter((inv) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inv.number.toLowerCase().includes(q) ||
      inv.bookingRef.toLowerCase().includes(q) ||
      inv.vehicleName.toLowerCase().includes(q) ||
      inv.serviceDescription.toLowerCase().includes(q)
    );
  });

  const handleOpenGenerateForOrder = (order: WorkOrder) => {
    setSelectedOrderForInvoice(order);
    setIsGenerateModalOpen(true);
  };

  const handleManualInvoiceOpen = () => {
    setSelectedOrderForInvoice(null);
    setIsGenerateModalOpen(true);
  };

  const handleGenerateSuccess = (newInvoice: InvoiceItem, updatedOrder?: WorkOrder) => {
    onAddInvoice(newInvoice, updatedOrder);
    showToast(`Invoice ${newInvoice.number} generated successfully for ${newInvoice.vehicleName}!`);
  };

  const handleCompleteAndInvoice = (order: WorkOrder) => {
    // 1-Click: Force complete an in-progress order and open invoice generator
    const updated: WorkOrder = {
      ...order,
      status: 'Completed',
      progressPercent: 100,
      stageName: 'Completed & Certified by Admin',
    };
    onUpdateWorkOrder(updated);
    setSelectedOrderForInvoice(updated);
    setIsGenerateModalOpen(true);
    showToast(`Work Order #${order.id.toUpperCase()} marked as Completed! Generating invoice...`);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Invoice Number,Booking Ref,Vehicle,Service Description,Date Issued,Payment Method,Amount,Status\n' +
      invoices
        .map(
          (inv) =>
            `"${inv.number}","${inv.bookingRef}","${inv.vehicleName}","${inv.serviceDescription.replace(/\n/g, ' ')}","${inv.dateIssued}","${inv.paymentMethod}","${inv.amount}","${inv.status}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ApexMoto_Admin_Billing_Ledger_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadInvoiceTxt = (inv: InvoiceItem) => {
    const doc = `=====================================================
APEXMOTO PRECISION CARE - OFFICIAL TAX INVOICE
=====================================================
Invoice:           ${inv.number}
Booking Reference: ${inv.bookingRef}
Date Issued:       ${inv.dateIssued}
Vehicle:           ${inv.vehicleName}
Service:           ${inv.serviceDescription}
Total Amount:      $${inv.amount.toFixed(2)} USD
Payment Method:    ${inv.paymentMethod}
Status:            ${inv.status.toUpperCase()}
Generated By:      ${inv.generatedBy || 'Admin Workstation Settlement'}

Tax Distribution:
- State Sales Tax (8.25%): $${(inv.amount * 0.0825).toFixed(2)}
- EPA Hazardous Disposal Surcharge: $12.50
- CAN-Bus Telemetry Logging Fee: $7.50

256-Bit Hardware Encrypted Transaction
=====================================================`;
    const blob = new Blob([doc], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.number}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-6 z-50 px-4 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-orange-400 font-bold">
              ADMIN WORKSTATION • BILLING & SETTLEMENT
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Vehicle Settlement & Invoice Generation
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit completed dyno bay ROs, inspect technician logs, and generate certified tax invoices for client release.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleManualInvoiceOpen}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs shadow-[0_4px_16px_rgba(249,115,22,0.35)] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Generate Invoice</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-orange-400" />
            <span>Export Ledger CSV</span>
          </button>

          <button
            onClick={() => onNavigate('mechanic-login')}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Switch to Mechanic Terminal Login"
          >
            <Wrench className="w-3.5 h-3.5 text-blue-400" />
            <span>Mechanic Login</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Completed Awaiting Invoicing */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 via-[#191f2f]/80 to-[#191f2f]/40 border border-orange-500/30 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>AWAITING INVOICING</span>
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
          </div>
          <div className="text-3xl font-bold font-mono text-white tracking-tight">
            {unbilledCompletedOrders.length}
          </div>
          <div className="text-[11px] text-orange-300 mt-1 flex items-center gap-1">
            <span>Completed vehicles pending release</span>
          </div>
        </div>

        {/* Card 2: Estimated Unbilled Revenue */}
        <div className="p-4 rounded-2xl bg-[#191f2f]/80 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>PENDING SETTLEMENT</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-white tracking-tight">
            ${unbilledEstimatedValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Ready to be billed & dispatched
          </div>
        </div>

        {/* Card 3: Total Invoices Generated */}
        <div className="p-4 rounded-2xl bg-[#191f2f]/80 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>SETTLED INVOICES</span>
            <Receipt className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-white tracking-tight">
            {invoices.length}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            Official tax invoices in ledger
          </div>
        </div>

        {/* Card 4: Total Billed Volume */}
        <div className="p-4 rounded-2xl bg-[#191f2f]/80 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>TOTAL BILLED VOLUME</span>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-orange-400 tracking-tight">
            ${totalBilled.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            256-bit hardware verified
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 rounded-2xl bg-white/[0.03] border border-white/5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('completed-vehicles')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'completed-vehicles'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Completed Vehicles ({completedOrders.length})</span>
            {unbilledCompletedOrders.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/20 text-white font-bold">
                {unbilledCompletedOrders.length} New
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Billing Ledger & Invoices ({invoices.length})</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-2 px-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search RO, VIN, invoice..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 w-48 sm:w-56"
            />
          </div>

          {activeTab === 'completed-vehicles' && (
            <div className="flex items-center gap-1 text-xs">
              {(['all', 'unbilled', 'invoiced'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer capitalize ${
                    statusFilter === filter
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TAB 1: Completed Vehicles & Work Orders Ready for Invoicing */}
      {activeTab === 'completed-vehicles' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#191f2f]/80 border border-white/10 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  Completed Workshop Bay Vehicles Awaiting Settlement
                </h2>
                <p className="text-xs text-slate-400">
                  Select a completed vehicle RO to review allocated parts, compute taxes, and issue an official tax invoice.
                </p>
              </div>

              <span className="text-xs font-mono text-slate-400">
                {filteredCompletedOrders.length} records matching
              </span>
            </div>

            {filteredCompletedOrders.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-70" />
                <h3 className="text-sm font-bold text-white">All Completed Vehicles Have Been Settled!</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  There are no unbilled completed vehicles in the queue right now. You can check in-progress vehicles below or generate a custom invoice.
                </p>
                <button
                  onClick={handleManualInvoiceOpen}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Generate Manual Invoice</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredCompletedOrders.map((order) => {
                  const isInvoiced = !!order.invoiced;
                  return (
                    <div
                      key={order.id}
                      className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-white/[0.015] transition-colors"
                    >
                      {/* Left: Vehicle and RO details */}
                      <div className="space-y-1.5 max-w-xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 text-white border border-white/10">
                            {order.token || order.id.toUpperCase()}
                          </span>

                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            {order.status.toUpperCase()} ({order.progressPercent}%)
                          </span>

                          {isInvoiced ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                              <Receipt className="w-3 h-3" />
                              INVOICED: {order.invoiceNumber || 'INV-SETTLED'}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 animate-pulse">
                              ● AWAITING INVOICE
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-white tracking-tight">
                          {order.vehicleName}
                        </h3>

                        <div className="text-xs text-slate-300 flex items-center gap-2">
                          <span className="font-medium text-orange-300">{order.serviceTitle}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">{order.assignedBay}</span>
                        </div>

                        <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-0.5">
                          <span>Lead Tech: <strong className="text-slate-200">{order.leadTechnician.name}</strong></span>
                          <span>•</span>
                          <span>Completed: <strong className="text-slate-200">{order.date}</strong></span>
                        </div>
                      </div>

                      {/* Right: Financial & Invoicing Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:text-right">
                        <div className="space-y-0.5 sm:text-right pr-2">
                          <div className="text-[10px] uppercase font-mono text-slate-400">Est. Billable Package</div>
                          <div className="text-lg font-bold font-mono text-white tabular-nums">
                            ${(order.basePrice || 640).toFixed(2)} USD
                          </div>
                          <div className="text-[10px] text-slate-500">Includes Bay Dyno & Fluids</div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!isInvoiced ? (
                            <button
                              onClick={() => handleOpenGenerateForOrder(order)}
                              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs shadow-[0_4px_16px_rgba(249,115,22,0.4)] flex items-center gap-2 transition-all cursor-pointer"
                            >
                              <Receipt className="w-4 h-4" />
                              <span>Generate Invoice</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const found = invoices.find((i) => i.bookingRef === order.token || i.number === order.invoiceNumber);
                                if (found) {
                                  setViewingReceipt(found);
                                } else {
                                  showToast(`Invoice details saved in ledger under ${order.invoiceNumber}`);
                                }
                              }}
                              className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Invoice</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active / In-Progress Vehicles Quick Complete Panel */}
          <div className="rounded-2xl bg-[#191f2f]/60 border border-white/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Currently In-Bay Vehicles (Active Work Orders)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Admins can 1-click finalize and generate an invoice for any active vehicle in workshop bays.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {workOrders
                .filter((o) => o.status === 'In Progress' || o.status === 'Pending')
                .map((activeOrder) => (
                  <div
                    key={activeOrder.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 hover:border-white/10 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{activeOrder.vehicleName}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300">
                          {activeOrder.progressPercent}%
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">{activeOrder.serviceTitle}</div>
                    </div>

                    <button
                      onClick={() => handleCompleteAndInvoice(activeOrder)}
                      className="px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white font-semibold text-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Complete & Invoice</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Billing Ledger & All Official Invoices */}
      {activeTab === 'ledger' && (
        <div className="rounded-2xl bg-[#191f2f]/80 border border-white/10 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-orange-400" />
                Official Billing Ledger ({invoices.length} Invoices)
              </h2>
              <p className="text-xs text-slate-400">
                All certified tax receipts, payments, and settlements recorded in the Apex ledger.
              </p>
            </div>

            <button
              onClick={handleManualInvoiceOpen}
              className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Invoice</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/5 font-mono uppercase text-[10px] text-slate-400">
                <tr>
                  <th className="p-3.5 pl-5">Invoice #</th>
                  <th className="p-3.5">Booking Ref</th>
                  <th className="p-3.5">Vehicle & Customer</th>
                  <th className="p-3.5">Service Description</th>
                  <th className="p-3.5">Date Issued</th>
                  <th className="p-3.5">Payment Method</th>
                  <th className="p-3.5 text-right">Amount</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.015] transition-colors">
                    <td className="p-3.5 pl-5 font-mono font-bold text-orange-400">
                      {inv.number}
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">
                      {inv.bookingRef}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{inv.vehicleName}</div>
                      <div className="text-[11px] text-slate-400">{inv.customerName || 'Marcus Sterling'}</div>
                    </td>
                    <td className="p-3.5 text-slate-300 max-w-xs truncate">
                      {inv.serviceDescription.replace(/\n/g, ' • ')}
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono">
                      {inv.dateIssued}
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {inv.paymentMethod}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-white tabular-nums">
                      ${inv.amount.toFixed(2)}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => {
                          const nextStatus = inv.status === 'Paid' ? 'Pending' : 'Paid';
                          onUpdateInvoiceStatus(inv.id, nextStatus);
                          showToast(`Invoice ${inv.number} marked as ${nextStatus}!`);
                        }}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold cursor-pointer transition-transform active:scale-95 ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                        title="Click to toggle status"
                      >
                        ● {inv.status}
                      </button>
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingReceipt(inv)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="View Digital Receipt"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDownloadInvoiceTxt(inv)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-orange-400 transition-colors cursor-pointer"
                          title="Download Text File"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Generator Modal */}
      <GenerateInvoiceModal
        isOpen={isGenerateModalOpen}
        onClose={() => {
          setIsGenerateModalOpen(false);
          setSelectedOrderForInvoice(null);
        }}
        workOrder={selectedOrderForInvoice}
        completedVehicles={vehicles}
        onGenerateSuccess={handleGenerateSuccess}
      />

      {/* Receipt Viewer Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#141b2b] border border-orange-500/30 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-orange-400" />
                <h3 className="font-bold text-white text-base">Digital Tax Voucher</h3>
              </div>
              <button
                onClick={() => setViewingReceipt(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs space-y-2 text-slate-300">
              <div className="flex justify-between text-white font-bold pb-2 border-b border-white/10">
                <span>{viewingReceipt.number}</span>
                <span className={viewingReceipt.status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}>
                  ● {viewingReceipt.status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date Issued:</span>
                <span>{viewingReceipt.dateIssued}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Booking Ref:</span>
                <span>{viewingReceipt.bookingRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle:</span>
                <span className="text-white font-semibold">{viewingReceipt.vehicleName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span>{viewingReceipt.customerName || 'Marcus Sterling'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment:</span>
                <span>{viewingReceipt.paymentMethod}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-orange-400">
                <span>Total Amount:</span>
                <span>${viewingReceipt.amount.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleDownloadInvoiceTxt(viewingReceipt)}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Invoice File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
