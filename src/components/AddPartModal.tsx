import React, { useState } from 'react';
import { X, Minus, Plus, FileText, Check } from 'lucide-react';
import { INVENTORY_PARTS } from '../data/mockData';

interface AddPartModalProps {
  isOpen: boolean;
  jobId?: string;
  onClose: () => void;
  onConfirm: (partData: {
    partName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    note: string;
  }) => void;
}

export const AddPartModal: React.FC<AddPartModalProps> = ({
  isOpen,
  jobId = '#JOB-98210',
  onClose,
  onConfirm,
}) => {
  const [selectedPartId, setSelectedPartId] = useState(INVENTORY_PARTS[0].id);
  const [quantity, setQuantity] = useState(2);
  const [note, setNote] = useState('Flushed front & rear circuits');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentPart = INVENTORY_PARTS.find((p) => p.id === selectedPartId) || INVENTORY_PARTS[0];
  const allocatedTotal = quantity * currentPart.unitPrice;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm({
        partName: currentPart.name,
        quantity,
        unitPrice: currentPart.unitPrice,
        total: allocatedTotal,
        note,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-[#191f2f]/95 border border-white/10 shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top-lit edge specular line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Add Part / Component</h3>
            <p className="text-xs text-orange-400/90 font-medium">Assigning to Job {jobId}</p>
          </div>
        </div>

        {/* Form Body */}
        <div className="space-y-4">
          {/* Inventory Component Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Select Inventory Component
            </label>
            <select
              value={selectedPartId}
              onChange={(e) => setSelectedPartId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500/50 cursor-pointer"
            >
              {INVENTORY_PARTS.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#141b2b] text-white">
                  {p.name}
                </option>
              ))}
            </select>

            {/* Current Stock Tag */}
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>Current Stock: {currentPart.stock} units available in {currentPart.location}</span>
            </div>
          </div>

          {/* Quantity & Unit Price Split */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Quantity Stepper */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Quantity to Allocate</label>
              <div className="flex items-center h-10 rounded-lg bg-[#070e1d] border border-white/10 px-2 justify-between">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-sm font-bold text-white tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(currentPart.stock, quantity + 1))}
                  className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Unit Price Display */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Unit Price</label>
              <div className="h-10 px-3 rounded-lg bg-[#070e1d] border border-white/10 flex items-center justify-between text-xs">
                <span className="font-mono font-semibold text-white tabular-nums">${currentPart.unitPrice.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Track Spec OEM</span>
              </div>
            </div>
          </div>

          {/* Allocated Total Row */}
          <div className="p-3 rounded-lg bg-[#070e1d]/80 border border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Allocated Total ({quantity} units x ${currentPart.unitPrice.toFixed(2)}):
            </span>
            <span className="font-mono text-base font-bold text-white tabular-nums">
              ${allocatedTotal.toFixed(2)}
            </span>
          </div>

          {/* Technician Note */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Technician Allocation Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Flushed front & rear circuits"
              className="w-full h-10 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_4px_16px_rgba(249,115,22,0.35)] hover:shadow-[0_6px_22px_rgba(249,115,22,0.5)] cursor-pointer transition-all"
          >
            {isSubmitting ? (
              <span>Allocating...</span>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Confirm & Allocate Part</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
