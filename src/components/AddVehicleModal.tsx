import React, { useState } from 'react';
import { X, Car, Plus, Check } from 'lucide-react';
import { Vehicle } from '../types';
import { HERO_IMAGE } from '../data/mockData';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVehicle: (vehicle: Vehicle) => void;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  onAddVehicle,
}) => {
  const [name, setName] = useState('');
  const [edition, setEdition] = useState('');
  const [specs, setSpecs] = useState('');
  const [plate, setPlate] = useState('');
  const [vin, setVin] = useState('');
  const [body, setBody] = useState('Performance Coupe');
  const [mileage, setMileage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !plate) return;

    const newVehicle: Vehicle = {
      id: `veh-${Date.now()}`,
      name,
      edition: edition || 'Customer Fleet Spec',
      specs: specs || 'Track Performance Configuration',
      plate: plate.toUpperCase(),
      vin: vin || `WP0AF2A${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      body,
      mileage: mileage ? `${mileage} mi` : '5,000 mi',
      healthScore: 99,
      healthLabel: 'Optimal',
      status: 'READY / HEALTHY',
      statusColor: 'green',
      image: HERO_IMAGE,
      warrantyValid: true,
    };

    onAddVehicle(newVehicle);
    onClose();
  };

  const handleApplyPreset = (presetName: string, presetSpecs: string, presetBody: string) => {
    setName(presetName);
    setSpecs(presetSpecs);
    setBody(presetBody);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#191f2f] border border-white/10 shadow-2xl p-6 overflow-hidden">
        {/* Specular line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Register New Vehicle</h3>
            <p className="text-xs text-slate-400">Enroll telemetry & track diagnostics</p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mb-4">
          <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Quick Presets:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleApplyPreset('Ferrari 488 Pista', '3.9L Twin-Turbo V8 • 710 HP', 'Supercar / Track')}
              className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] text-slate-300 hover:text-white hover:border-orange-500/40 cursor-pointer"
            >
              Ferrari 488 Pista
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('Porsche 718 Cayman GT4 RS', '4.0L Boxer-6 NA • 493 HP', 'Mid-Engine Coupe')}
              className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] text-slate-300 hover:text-white hover:border-orange-500/40 cursor-pointer"
            >
              Porsche GT4 RS
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('Mercedes-AMG GT Black Series', '4.0L V8 Biturbo • 720 HP', 'Coupe / Track')}
              className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] text-slate-300 hover:text-white hover:border-orange-500/40 cursor-pointer"
            >
              AMG GT Black
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Vehicle Model & Make</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 2024 Porsche 911 Dakar"
                className="w-full h-9.5 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Edition / Trim</label>
              <input
                type="text"
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
                placeholder="e.g. Rallye Design Package"
                className="w-full h-9.5 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Engine / Powertrain Specs</label>
              <input
                type="text"
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
                placeholder="e.g. 3.0L Twin-Turbo Flat-6"
                className="w-full h-9.5 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">License Plate</label>
              <input
                type="text"
                required
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="e.g. APX-911-DKR"
                className="w-full h-9.5 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50 uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Chassis / VIN</label>
              <input
                type="text"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                placeholder="e.g. WP0AF2A97RS129033"
                className="w-full h-9.5 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Current Mileage</label>
              <input
                type="text"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="e.g. 4,200"
                className="w-full h-9.5 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_4px_16px_rgba(249,115,22,0.4)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll Vehicle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
