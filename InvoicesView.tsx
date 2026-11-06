import React, { useState } from 'react';
import { ViewMode, InvoiceItem, UserRole } from '../types';
import { INITIAL_INVOICES } from '../data/mockData';
import { 
  Download, 
  Calendar, 
  Search, 
  ShieldCheck, 
  FileText, 
  Check, 
  CreditCard, 
  ArrowUpRight, 
  Lock, 
  Plus, 
  MoreVertical,
  CheckCircle2,
  Receipt
} from 'lucide-react';

interface InvoicesViewProps {
  onNavigate: (view: ViewMode) => void;
  invoices?: InvoiceItem[];
  currentRole?: UserRole;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({ 
  onNavigate, 
  invoices: invoicesProp,
  currentRole = 'customer',
}) => {
  const [localInvoices, setLocalInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES);
  const invoices = invoicesProp || localInvoices;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending'>('All');
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== 'All' && inv.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inv.number.toLowerCase().includes(q) ||
        inv.vehicleName.toLowerCase().includes(q) ||
        inv.serviceDescription.toLowerCase().includes(q) ||
        inv.bookingRef.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalBilledYTD = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const pendingInvoices = invoices.filter((inv) => inv.status === 'Pending');
  const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Invoice Number,Booking Ref,Vehicle,Service Description,Date Issued,Payment Method,Amount,Status\n' +
      filteredInvoices
        .map(
          (inv) =>
            `"${inv.number}","${inv.bookingRef}","${inv.vehicleName}","${inv.serviceDescription.replace('\n', ' - ')}","${inv.dateIssued}","${inv.paymentMethod}","${inv.amount}","${inv.status}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ApexMoto_Ledger_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadInvoice = (inv: InvoiceItem) => {
    const doc = `APEXMOTO INVOICE & TAX RECEIPT
========================================
Invoice: ${inv.number}
Booking Reference: ${inv.bookingRef}
Date Issued: ${inv.dateIssued}
Vehicle: ${inv.vehicleName}
Service: ${inv.serviceDescription}
Total Amount: $${inv.amount.toFixed(2)} USD
Payment Method: ${inv.paymentMethod}
Status: ${inv.status.toUpperCase()}

Tax Distribution Breakdown:
- State Sales Tax (8.25%): $${(inv.amount * 0.0825).toFixed(2)}
- EPA Hazardous Disposal Surcharge: $12.50
- CAN-Bus Telemetry Logging Fee: $7.50

256-Bit Hardware Encrypted Transaction
========================================`;
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header (Image 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-orange-400 font-bold">
              FINANCIAL TELEMETRY & LEDGER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Invoices & Billing History
          </h1>
          <p className="text-xs text-[#94a3b8] max-w-2xl mt-0.5">
            Real-time settlement records, digital work order attachments, and track-certified maintenance warranties.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            <span>Statement Cycle: <strong>2026</strong></span>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-[0_4px_16px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_22px_rgba(249,115,22,0.6)] transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Consolidated CSV</span>
          </button>
        </div>
      </div>

      {/* Role-Specific Action Banner */}
      {currentRole === 'admin' ? (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-orange-500/15 via-[#191f2f] to-orange-500/10 border border-orange-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Admin Billing & Vehicle Settlement Console</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-500/20 text-purple-400 font-bold">
                  ADMIN ACCESS
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Generate official tax invoices for completed bay work orders or inspect the master workshop ledger.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('admin')}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_2px_12px_rgba(249,115,22,0.4)] transition-all cursor-pointer shrink-0"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Open Admin Workstation</span>
          </button>
        </div>
      ) : (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Verified Client Maintenance Records & Receipts</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-400 font-bold">
                  CLIENT ACCOUNT
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                All maintenance invoices carry cryptographic SHA-256 warranty vouchers valid across all Apex certified facilities.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('customer-portal')}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>View Vehicle Telemetry</span>
          </button>
        </div>
      )}

      {/* 3 Top Summary Cards (Image 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* TOTAL BILLED YTD */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#191f2f]/80 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              TOTAL BILLED YTD
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
              ${totalBilledYTD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-emerald-400 font-medium">↗ +12.4%</span>
          </div>
          <div className="text-xs text-[#94a3b8] mt-2">
            {invoices.length} precision service work orders
          </div>
        </div>

        {/* OUTSTANDING BALANCE */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#191f2f]/80 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              PENDING SETTLEMENT
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
              ${pendingAmount.toFixed(2)}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              {pendingInvoices.length > 0 ? `${pendingInvoices.length} Pending` : 'All Settled'}
            </span>
          </div>
          <div className="text-xs text-[#94a3b8] mt-2">
            {pendingInvoices.length} Bay active invoice pending auth
          </div>
        </div>

        {/* ACTIVE WARRANTIES */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#191f2f]/80 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              ACTIVE WARRANTIES
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <span className="material-symbols-outlined text-lg">verified_user</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
              3 Active
            </span>
            <span className="text-xs text-slate-300 font-medium">Track & Street</span>
          </div>
          <div className="text-xs text-[#94a3b8] mt-2">
            Next renewal in 184 days
          </div>
        </div>
      </div>

      {/* Invoices Ledger Table Container (Image 3) */}
      <div className="rounded-2xl bg-[#191f2f]/80 border border-white/10 overflow-hidden shadow-xl">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by invoice #, vehicle, or date..."
              className="w-full h-9 pl-9 pr-8 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold mr-1">STATUS:</span>
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === 'All'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-white/5 text-slate-300 hover:text-white'
              }`}
            >
              All (5)
            </button>
            <button
              onClick={() => setStatusFilter('Paid')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === 'Paid'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-white/5 text-slate-300 hover:text-white'
              }`}
            >
              Paid (4)
            </button>
            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === 'Pending'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-white/5 text-slate-300 hover:text-white'
              }`}
            >
              Pending (1)
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141b2b] text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/5">
              <tr>
                <th className="py-3 px-5">INVOICE NUMBER</th>
                <th className="py-3 px-4">BOOKING REF</th>
                <th className="py-3 px-4">VEHICLE</th>
                <th className="py-3 px-4">SERVICE DESCRIPTION</th>
                <th className="py-3 px-4">DATE ISSUED</th>
                <th className="py-3 px-4">PAYMENT METHOD</th>
                <th className="py-3 px-5 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-normal">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <FileText
                        className={`w-4 h-4 ${
                          inv.status === 'Pending' ? 'text-orange-400' : 'text-blue-400'
                        }`}
                      />
                      <span className="font-mono font-bold text-white tracking-wide">
                        {inv.number}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-400">{inv.bookingRef}</td>
                  <td className="py-4 px-4 text-slate-200">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          inv.vehicleName.includes('Porsche')
                            ? 'bg-orange-400'
                            : inv.vehicleName.includes('Audi')
                            ? 'bg-blue-400'
                            : 'bg-emerald-400'
                        }`}
                      ></span>
                      <span>{inv.vehicleName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-300 whitespace-pre-line leading-relaxed">
                    {inv.serviceDescription}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-400 tabular-nums">
                    {inv.dateIssued}
                  </td>
                  <td className="py-4 px-4 text-slate-300">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inv.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-mono font-bold text-white tabular-nums text-sm">
                        ${inv.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleDownloadInvoice(inv)}
                        className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Download Invoice"
                      >
                        <Download className="w-3.5 h-3.5 text-orange-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer (Image 3) */}
        <div className="p-3.5 bg-[#141b2b] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div>
            Showing 1 - {filteredInvoices.length} of {filteredInvoices.length} records • All amounts in USD
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded bg-white/5 text-slate-400 hover:text-white transition-colors">
              Previous
            </button>
            <span className="w-6 h-6 rounded bg-orange-500 text-white font-bold flex items-center justify-center text-xs">
              1
            </span>
            <button className="px-2.5 py-1 rounded bg-white/5 text-slate-400 hover:text-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 3 Bottom Panels (Image 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: Tax & Fee Breakdown (Image 3) */}
        <div className="rounded-2xl bg-[#191f2f]/80 border border-white/10 p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-orange-400" />
                <h2 className="text-sm font-bold text-white">Tax & Fee Breakdown</h2>
              </div>
              <span className="text-[10px] font-mono text-slate-400">YTD 2026</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Audited tax distribution and environmental disposal surcharges applied under Apex track standards.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>State Sales Tax (8.25%)</span>
                <span className="font-mono font-bold text-white tabular-nums">$141.24</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>EPA Hazardous Fluid Disposal</span>
                <span className="font-mono font-bold text-white tabular-nums">$38.50</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Electronic Telemetry Protocol Fee</span>
                <span className="font-mono font-bold text-white tabular-nums">$15.00</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
              NET TAX VOLUME
            </span>
            <span className="text-base font-bold font-mono text-white tabular-nums">
              $194.74
            </span>
          </div>
        </div>

        {/* Panel 2: Archival & Accounting (Image 3) */}
        <div className="rounded-2xl bg-[#191f2f]/80 border border-white/10 p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-blue-400 text-lg">cloud_sync</span>
              <h2 className="text-sm font-bold text-white">Archival & Accounting</h2>
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Generate unified tax packages with cryptographic digital certificates for track deductible reporting.
            </p>

            {/* Spend Velocity SVG Graphic (Image 3) */}
            <div className="p-3 rounded-xl bg-[#070e1d] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">Spend Velocity (Q1-Q3)</span>
                <span className="text-emerald-400 font-semibold">Verified Ledger</span>
              </div>
              <svg className="w-full h-12 text-blue-400" viewBox="0 0 200 40" fill="none">
                <path
                  d="M0,30 Q30,35 60,25 T120,30 T160,10 T200,28"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  fill="none"
                />
                <path
                  d="M0,30 Q30,35 60,25 T120,30 T160,10 T200,28 L200,40 L0,40 Z"
                  fill="rgba(56,189,248,0.08)"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Exporting encrypted tax archive ZIP package...')}
              className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-orange-400" />
              <span>Annual ZIP Package</span>
            </button>
            <button
              onClick={() => alert('Ledger synchronized with live bay records.')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Sync Ledger"
            >
              <span className="material-symbols-outlined text-sm">sync_alt</span>
            </button>
          </div>
        </div>

        {/* Panel 3: Payment Methods (Image 3) */}
        <div className="rounded-2xl bg-[#191f2f]/80 border border-white/10 p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-bold text-white">Payment Methods</h2>
              </div>
              <button
                onClick={() => setShowAddCardModal(true)}
                className="text-[11px] text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
              >
                + Add Card
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Tokenized automotive concierge billing accounts configured for instant RO authorization.
            </p>

            {/* Saved Cards */}
            <div className="space-y-2">
              {/* Apple Pay */}
              <div className="p-2.5 rounded-xl bg-[#070e1d] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-white/5 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-sm">contactless</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <span>Apple Pay</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-orange-500/20 text-orange-400 font-bold">
                        DEFAULT
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Mastercard •••• 9021 (Exp 11/28)
                    </div>
                  </div>
                </div>
              </div>

              {/* Visa Business */}
              <div className="p-2.5 rounded-xl bg-[#070e1d] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-white/5 flex items-center justify-center text-white">
                    <CreditCard className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Visa Platinum Business</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Ending in 4412 (Exp 08/29)
                    </div>
                  </div>
                </div>
                <MoreVertical className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>256-Bit Encrypted Vault</span>
            </div>
            <button
              onClick={() => alert('Preferences saved!')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Manage Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl bg-[#191f2f] border border-white/10 p-5 space-y-4">
            <h3 className="text-base font-bold text-white">Add Concierge Payment Method</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="4000 1234 5678 9010"
                  className="w-full h-9 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full h-9 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full h-9 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => setShowAddCardModal(false)}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('New payment card tokenized and stored into 256-bit vault!');
                  setShowAddCardModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-semibold"
              >
                Save Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
