import React, { useState, useEffect } from 'react';
import { 
  X, 
  Receipt, 
  Car, 
  Wrench, 
  User, 
  DollarSign, 
  Plus, 
  Trash2, 
  Check, 
  Download, 
  ShieldCheck, 
  Printer, 
  Clock, 
  FileText,
  CreditCard,
  Percent,
  Sparkles
} from 'lucide-react';
import { WorkOrder, InvoiceItem, Vehicle } from '../types';

interface LineItem {
  id: string;
  description: string;
  type: 'service' | 'part' | 'fee';
  quantity: number;
  unitPrice: number;
  total: number;
}

interface GenerateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder?: WorkOrder | null;
  completedVehicles?: Vehicle[];
  onGenerateSuccess: (newInvoice: InvoiceItem, updatedOrder?: WorkOrder) => void;
}

export const GenerateInvoiceModal: React.FC<GenerateInvoiceModalProps> = ({
  isOpen,
  onClose,
  workOrder,
  completedVehicles = [],
  onGenerateSuccess,
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customerName, setCustomerName] = useState('Marcus Sterling');
  const [customerEmail, setCustomerEmail] = useState('m.sterling@apex.io');
  const [vehicleName, setVehicleName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Apple Pay (•••• 9021)');
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [notes, setNotes] = useState(
    'All dyno telemetry parameters validated within ±0.002mm engineering tolerances. Apex 12-Month / 12,000-Mile Track Warranty active.'
  );

  // Line items
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [applyTax, setApplyTax] = useState(true);
  const [epaFee, setEpaFee] = useState(12.50);
  const [telemetryFee, setTelemetryFee] = useState(7.50);

  // New item inputs
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState(50);
  const [newItemType, setNewItemType] = useState<'service' | 'part' | 'fee'>('part');
  const [showAddItem, setShowAddItem] = useState(false);

  // Prepopulate when opened
  useEffect(() => {
    if (isOpen) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setInvoiceNumber(`INV-2026-${randomSuffix}`);

      if (workOrder) {
        setVehicleName(workOrder.vehicleName);
        setBookingRef(workOrder.token || workOrder.id.toUpperCase());
        setCustomerName(workOrder.customerName || 'Marcus Sterling');
        setCustomerEmail(workOrder.customerEmail || 'm.sterling@apex.io');

        const initialItems: LineItem[] = [];

        // Base service package
        initialItems.push({
          id: 'item-base',
          description: `${workOrder.serviceTitle} (Workshop Bay 04 Calibration)`,
          type: 'service',
          quantity: 1,
          unitPrice: workOrder.basePrice || 640.0,
          total: workOrder.basePrice || 640.0,
        });

        // Allocated parts
        if (workOrder.allocatedParts && workOrder.allocatedParts.length > 0) {
          workOrder.allocatedParts.forEach((part, idx) => {
            initialItems.push({
              id: `part-${idx}`,
              description: part.name,
              type: 'part',
              quantity: part.quantity,
              unitPrice: part.unitPrice,
              total: part.total,
            });
          });
        } else {
          // Default track parts if none explicitly allocated
          initialItems.push({
            id: 'part-default-1',
            description: 'Castrol SRF Racing Brake Fluid (SKU: CSRF-500)',
            type: 'part',
            quantity: 2,
            unitPrice: 78.0,
            total: 156.0,
          });
        }

        setLineItems(initialItems);
      } else {
        // Fallback for generic manual invoice
        setVehicleName(completedVehicles[0]?.name || '2023 Porsche 911 GT3 (992)');
        setBookingRef(`BK-${Date.now().toString().slice(-8)}`);
        setLineItems([
          {
            id: 'item-1',
            description: '120-Point Precision Diagnostic & Sensor Calibration',
            type: 'service',
            quantity: 1,
            unitPrice: 640.0,
            total: 640.0,
          },
          {
            id: 'item-2',
            description: 'Castrol SRF Racing Brake Fluid (2x 500ml Bottles)',
            type: 'part',
            quantity: 2,
            unitPrice: 78.0,
            total: 156.0,
          },
        ]);
      }
    }
  }, [isOpen, workOrder, completedVehicles]);

  if (!isOpen) return null;

  // Financial calculations
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = applyTax ? taxableSubtotal * 0.0825 : 0;
  const feesTotal = epaFee + telemetryFee;
  const grandTotal = taxableSubtotal + taxAmount + feesTotal;

  const handleAddLineItem = () => {
    if (!newItemDesc.trim()) return;
    const itemTotal = newItemQty * newItemPrice;
    setLineItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        description: newItemDesc,
        type: newItemType,
        quantity: newItemQty,
        unitPrice: newItemPrice,
        total: itemTotal,
      },
    ]);
    setNewItemDesc('');
    setNewItemQty(1);
    setNewItemPrice(50);
    setShowAddItem(false);
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCreateInvoice = () => {
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    const laborItems = lineItems.filter((i) => i.type === 'service');
    const partItems = lineItems.filter((i) => i.type === 'part');

    const laborCost = laborItems.reduce((s, i) => s + i.total, 0);
    const partsCost = partItems.reduce((s, i) => s + i.total, 0);

    const newInvoice: InvoiceItem = {
      id: `inv-${Date.now()}`,
      number: invoiceNumber,
      bookingRef: bookingRef,
      vehicleName: vehicleName,
      serviceDescription: lineItems
        .filter((i) => i.type === 'service')
        .map((i) => i.description)
        .join(', ') || 'Precision Workshop Care & Diagnostics',
      dateIssued: formattedDate,
      paymentMethod: paymentMethod,
      amount: grandTotal,
      status: paymentStatus,
      customerName: customerName,
      customerEmail: customerEmail,
      laborCost: laborCost,
      partsCost: partsCost,
      allocatedPartsList: partItems.map((p) => ({
        name: p.description,
        qty: p.quantity,
        unitPrice: p.unitPrice,
        total: p.total,
      })),
      taxAmount: taxAmount,
      discount: discountAmount,
      notes: notes,
      generatedBy: 'Admin Workshop Console (Billing Desk)',
    };

    let updatedOrder: WorkOrder | undefined;
    if (workOrder) {
      updatedOrder = {
        ...workOrder,
        invoiced: true,
        invoiceId: newInvoice.id,
        invoiceNumber: newInvoice.number,
      };
    }

    onGenerateSuccess(newInvoice, updatedOrder);
    onClose();
  };

  const handleDownloadDraft = () => {
    const textContent = `=====================================================
APEXMOTO PRECISION CARE - OFFICIAL TAX INVOICE
=====================================================
INVOICE NUMBER:    ${invoiceNumber}
DATE ISSUED:       ${new Date().toLocaleDateString()}
BOOKING / RO REF:  ${bookingRef}
CUSTOMER:          ${customerName} (${customerEmail})
VEHICLE:           ${vehicleName}
STATUS:            ${paymentStatus.toUpperCase()}
PAYMENT METHOD:    ${paymentMethod}
GENERATED BY:      Apex Admin Workstation Operations
=====================================================
LINE ITEMS & ALLOCATED COMPONENTS:
${lineItems
  .map(
    (i, idx) =>
      `${(idx + 1).toString().padStart(2, '0')}. [${i.type.toUpperCase()}] ${i.description.padEnd(45)} | Qty: ${i.quantity} x $${i.unitPrice.toFixed(2)} = $${i.total.toFixed(2)}`
  )
  .join('\n')}

-----------------------------------------------------
SUBTOTAL:                              $${subtotal.toFixed(2)} USD
DISCOUNT (${discountPercent}%):                       -$${discountAmount.toFixed(2)} USD
STATE SALES TAX (8.25%):                $${taxAmount.toFixed(2)} USD
EPA HAZARDOUS WASTE SURCHARGE:          $${epaFee.toFixed(2)} USD
CAN-BUS TELEMETRY CERTIFICATION:        $${telemetryFee.toFixed(2)} USD
-----------------------------------------------------
TOTAL AMOUNT BILLED:                   $${grandTotal.toFixed(2)} USD
=====================================================
ENGINEER NOTES & WARRANTY DISCLAIMER:
"${notes}"

Encrypted Telemetry Signoff: SHA256-${Date.now().toString(16).toUpperCase()}
ApexMoto Precision Motorsport Calibration Centers
=====================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-[#141b2b] border border-orange-500/30 rounded-2xl shadow-[0_0_50px_rgba(249,115,22,0.2)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-6 bg-gradient-to-r from-[#192238] via-[#141b2b] to-[#192238] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30">
                  Admin Workstation
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Completed Vehicle Settlement
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                Generate Certified Tax Invoice
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top Row: Meta Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Invoice Number */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-orange-400 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Booking / RO Ref */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Booking / RO Ref
              </label>
              <input
                type="text"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Customer */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Vehicle */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Completed Vehicle
              </label>
              <input
                type="text"
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-xl bg-white/[0.02] border border-white/10 overflow-hidden">
            <div className="p-3.5 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Billed Services & Allocated Parts ({lineItems.length})
                </h3>
              </div>
              <button
                onClick={() => setShowAddItem(!showAddItem)}
                className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-300 hover:bg-orange-500 hover:text-white text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Item</span>
              </button>
            </div>

            {/* Add Custom Item Row Form */}
            {showAddItem && (
              <div className="p-3 bg-orange-500/5 border-b border-orange-500/20 grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                <div className="sm:col-span-5">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Description</label>
                  <input
                    type="text"
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    placeholder="e.g. Brake Fluid Flush, Track Alignment..."
                    className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-white text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Type</label>
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value as any)}
                    className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-white text-xs"
                  >
                    <option value="service">Service</option>
                    <option value="part">Part</option>
                    <option value="fee">Fee</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-white text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Unit ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-white text-xs"
                  />
                </div>
                <div className="sm:col-span-1 flex items-end">
                  <button
                    onClick={handleAddLineItem}
                    className="w-full py-1 bg-orange-500 hover:bg-orange-600 text-white rounded font-bold text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="divide-y divide-white/5 text-xs">
              {lineItems.map((item) => (
                <div key={item.id} className="p-3.5 flex items-center justify-between hover:bg-white/[0.01]">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                        item.type === 'service'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : item.type === 'part'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="font-medium text-white">{item.description}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-slate-400 font-mono">
                      {item.quantity} x ${item.unitPrice.toFixed(2)}
                    </div>
                    <div className="font-mono font-bold text-white tabular-nums w-20 text-right">
                      ${item.total.toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleRemoveLineItem(item.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Surcharges, Tax & Discount Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Payment & Settlement Controls */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-orange-400" />
                Settlement & Payment Configuration
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                  >
                    <option value="Apple Pay (•••• 9021)">Apple Pay (•••• 9021)</option>
                    <option value="Visa (•••• 4412)">Visa (•••• 4412)</option>
                    <option value="Mastercard (•••• 8192)">Mastercard (•••• 8192)</option>
                    <option value="Wire Transfer / ACH">Wire Transfer / ACH</option>
                    <option value="Corporate Fleet Account">Corporate Fleet Account</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                  >
                    <option value="Paid">Mark as Paid (Settled)</option>
                    <option value="Pending">Mark as Pending (Net 15)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Warranty & Compliance Note</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[11px] text-slate-300 focus:outline-none focus:border-orange-500/50 resize-none"
                />
              </div>
            </div>

            {/* Right: Tax, Surcharges & Grand Total */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Subtotal (Labor & Parts):</span>
                <span className="font-bold tabular-nums">${subtotal.toFixed(2)}</span>
              </div>

              {/* Discount Input */}
              <div className="flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span>Loyalty Discount (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Math.max(0, Math.min(100, Number(e.target.value))))}
                    className="w-14 bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-center text-xs text-white"
                  />
                </div>
                <span className="text-emerald-400 font-semibold">
                  -${discountAmount.toFixed(2)}
                </span>
              </div>

              {/* Tax Toggle */}
              <div className="flex items-center justify-between text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyTax}
                    onChange={(e) => setApplyTax(e.target.checked)}
                    className="rounded accent-orange-500"
                  />
                  <span>State Sales Tax (8.25%)</span>
                </label>
                <span className="tabular-nums">${taxAmount.toFixed(2)}</span>
              </div>

              {/* Surcharges */}
              <div className="flex items-center justify-between text-slate-400">
                <span>EPA Hazardous Waste Surcharge:</span>
                <span className="tabular-nums">${epaFee.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span>CAN-Bus Telemetry Protocol Fee:</span>
                <span className="tabular-nums">${telemetryFee.toFixed(2)}</span>
              </div>

              {/* Divider & Grand Total */}
              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-sans text-slate-400">Grand Total (USD)</div>
                  <div className="text-xl font-bold font-mono text-orange-400 tabular-nums">
                    ${grandTotal.toFixed(2)}
                  </div>
                </div>
                <div className="text-right text-[10px] font-sans text-slate-400">
                  <div>Cryptographic Seal: ACTIVE</div>
                  <div className="text-emerald-400 font-bold">256-Bit Hardware Encrypted</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-black/40 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={handleDownloadDraft}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-orange-400" />
            <span>Preview & Download Text Invoice</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleCreateInvoice}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Generate & Post Invoice to Ledger</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
