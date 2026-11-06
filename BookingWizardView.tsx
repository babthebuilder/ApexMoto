import React, { useState } from 'react';
import { ViewMode, Vehicle, ServicePackage } from '../types';
import { SERVICE_PACKAGES } from '../data/mockData';
import { Check, ArrowRight, ArrowLeft, Calendar, Clock, ShieldCheck, Car, Sliders } from 'lucide-react';

interface BookingWizardViewProps {
  vehicles: Vehicle[];
  onNavigate: (view: ViewMode) => void;
  onBookingCompleted: (vehicle: Vehicle, pkg: ServicePackage, token: string) => void;
  preselectedPackage?: ServicePackage;
  preselectedVehicle?: Vehicle;
}

export const BookingWizardView: React.FC<BookingWizardViewProps> = ({
  vehicles,
  onNavigate,
  onBookingCompleted,
  preselectedPackage,
  preselectedVehicle,
}) => {
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(preselectedVehicle || vehicles[0]);
  const [selectedPkg, setSelectedPkg] = useState<ServicePackage>(preselectedPackage || SERVICE_PACKAGES[0]);
  const [selectedDate, setSelectedDate] = useState('2026-09-28');
  const [selectedTime, setSelectedTime] = useState('11:30 AM EST');
  const [selectedBay, setSelectedBay] = useState('Bay 04 - Dyno & Multi-Sensor Calibration');

  const handleFinish = () => {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const token = `BK-20260928-${randomHex}`;
    onBookingCompleted(selectedVehicle, selectedPkg, token);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-orange-400 font-bold">
            BAY RESERVATION PROTOCOL
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Schedule Precision Service
          </h1>
        </div>

        {/* Stepper Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s
                  ? 'bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.5)]'
                  : step > s
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/10 text-slate-400'
              }`}
            >
              {step > s ? <Check className="w-3.5 h-3.5" /> : s}
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Card Container */}
      <div className="rounded-2xl bg-[#191f2f]/90 border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
        {/* Step 1: Vehicle Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-orange-400" />
                <span>Step 1: Select Registered Vehicle</span>
              </h2>
              <span className="text-xs text-slate-400">Choose vehicle from your garage</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedVehicle.id === v.id
                      ? 'bg-orange-500/10 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                      <span className="text-orange-400 font-bold">{v.plate}</span>
                      <span>{v.mileage}</span>
                    </div>
                    <div className="text-sm font-bold text-white">{v.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{v.specs}</div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-emerald-400">Health: {v.healthScore}%</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedVehicle.id === v.id
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-white/20'
                      }`}
                    >
                      {selectedVehicle.id === v.id && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Package Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-orange-400" />
                <span>Step 2: Choose Service Calibration Package</span>
              </h2>
              <span className="text-xs text-slate-400">All tiers include CAN-bus diagnostics</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {SERVICE_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPkg.id === pkg.id
                      ? 'bg-orange-500/10 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{pkg.title}</span>
                      <span className="text-sm font-bold text-orange-400 font-mono">${pkg.price}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {pkg.description}
                    </p>
                    <div className="space-y-1">
                      {pkg.features.map((f, i) => (
                        <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-orange-400" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <span>Duration: {pkg.duration}</span>
                    <span className="text-orange-400 font-semibold">
                      {selectedPkg.id === pkg.id ? 'Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Date, Time & Final Lock */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-400" />
              <span>Step 3: Select Bay Station & Timing</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Arrival Slot</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="09:00 AM EST">09:00 AM EST - Priority Staging</option>
                  <option value="11:30 AM EST">11:30 AM EST - Standard Slot</option>
                  <option value="01:30 PM EST">01:30 PM EST - Afternoon Staging</option>
                  <option value="03:00 PM EST">03:00 PM EST - Express Run</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Workshop Bay Assignment</label>
              <select
                value={selectedBay}
                onChange={(e) => setSelectedBay(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="Bay 04 - Dyno & Multi-Sensor Calibration">Bay 04 - Dyno & Multi-Sensor Calibration (Lead: Alex Vance)</option>
                <option value="Bay 02 - Fluidics Dock">Bay 02 - Fluidics Dock (Lead: Stefan Ruiz)</option>
                <option value="Bay 06 - Chassis Rig & Alignment">Bay 06 - Chassis Rig & Alignment (Lead: Marco Leone)</option>
              </select>
            </div>

            {/* Summary Review */}
            <div className="p-4 rounded-xl bg-[#0c1322] border border-white/10 space-y-2">
              <div className="text-xs font-bold text-white">Reservation Summary</div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Vehicle:</span>
                <span className="font-semibold text-white">{selectedVehicle.name} ({selectedVehicle.plate})</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Service Package:</span>
                <span className="font-semibold text-white">{selectedPkg.title}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Hold Amount:</span>
                <span className="font-bold text-orange-400 font-mono">${selectedPkg.price}.00 HOLD</span>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-400 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-[0_4px_16px_rgba(249,115,22,0.4)] cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_4px_24px_rgba(249,115,22,0.5)] cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm & Lock Bay Slot</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
