import React, { useState } from 'react';
import { ViewMode, Vehicle } from '../types';
import { HISTORIC_SERVICE_ARCHIVE } from '../data/mockData';
import { 
  Car, 
  Plus, 
  SlidersHorizontal, 
  ShieldCheck, 
  Wrench, 
  Gauge, 
  Calendar, 
  Download, 
  FileText, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';

interface VehiclesViewProps {
  vehicles: Vehicle[];
  onNavigate: (view: ViewMode) => void;
  onOpenAddVehicle: () => void;
  onSelectVehicleForService: (vehicle: Vehicle) => void;
}

export const VehiclesView: React.FC<VehiclesViewProps> = ({
  vehicles,
  onNavigate,
  onOpenAddVehicle,
  onSelectVehicleForService,
}) => {
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredArchive = HISTORIC_SERVICE_ARCHIVE.filter((row) => {
    if (vehicleFilter !== 'all' && !row.vehicle.toLowerCase().includes(vehicleFilter.toLowerCase())) {
      return false;
    }
    if (searchFilter && !row.service.toLowerCase().includes(searchFilter.toLowerCase()) && !row.leadMechanic.toLowerCase().includes(searchFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Vehicle,Service Package,Lead Mechanic,Status,Amount\n"
      + filteredArchive.map(e => `"${e.date}","${e.vehicle}","${e.service}","${e.leadMechanic}","${e.status}","${e.amount}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ApexMoto_Service_Archive_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Top Header (Image 7) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-orange-400 font-bold">
              HANGAR & FLEET TELEMETRY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Registered Vehicles
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/5 text-xs text-slate-300 font-medium hidden sm:block">
            {vehicles.length} Active Bays Enrolled
          </div>
          <button
            onClick={() => setVehicleFilter(vehicleFilter === 'all' ? 'Porsche' : 'all')}
            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
            <span>Filter Specs</span>
          </button>
          <button
            onClick={onOpenAddVehicle}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-[0_4px_16px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_22px_rgba(249,115,22,0.6)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Vehicle</span>
          </button>
        </div>
      </div>

      {/* Vehicle Cards Grid (Image 7) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((veh) => (
          <div
            key={veh.id}
            className="rounded-2xl bg-[#191f2f]/80 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl group"
          >
            <div>
              {/* Image Preview with overlay badges */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                <img
                  src={veh.image}
                  alt={veh.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#191f2f] via-transparent to-black/40"></div>

                {/* Top Status & Mileage Badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between text-[11px] font-mono">
                  <div
                    className={`px-2.5 py-1 rounded-full backdrop-blur-md font-semibold flex items-center gap-1.5 ${
                      veh.statusColor === 'blue'
                        ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300'
                        : veh.statusColor === 'green'
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                        : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        veh.statusColor === 'blue'
                          ? 'bg-blue-400 animate-pulse'
                          : veh.statusColor === 'green'
                          ? 'bg-emerald-400'
                          : 'bg-amber-400'
                      }`}
                    ></span>
                    <span>{veh.status}</span>
                  </div>

                  <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-slate-400" />
                    <span>{veh.mileage}</span>
                  </div>
                </div>

                {/* Vehicle Title Overlay */}
                <div className="absolute bottom-3 inset-x-4">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-orange-400 font-semibold">
                    {veh.edition}
                  </div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white tracking-tight leading-tight">
                      {veh.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 border border-white/10 text-orange-300 font-bold">
                      {veh.plate}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">{veh.specs}</div>
                </div>
              </div>

              {/* Specs & VIN Details */}
              <div className="p-4 space-y-3.5">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-400">CHASSIS / VIN</div>
                    <div className="text-slate-200 font-mono font-medium truncate">{veh.vin}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-400">BODY ARCHITECTURE</div>
                    <div className="text-slate-200 font-medium truncate">{veh.body}</div>
                  </div>
                </div>

                {/* Telemetry Health Bar */}
                <div className="p-2.5 rounded-xl bg-[#070e1d]/80 border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        veh.healthScore > 95 ? 'text-emerald-400' : 'text-blue-400'
                      }`}
                    />
                    <span className="text-slate-300">Vehicle Health Telemetry</span>
                  </div>
                  <div className="font-mono font-bold text-white tabular-nums">
                    {veh.healthScore}% <span className="text-emerald-400 font-normal">{veh.healthLabel}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card Actions */}
            <div className="p-4 pt-0 flex items-center gap-2 border-t border-white/5 mt-2">
              <button
                onClick={() => onNavigate('bookings')}
                className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                View History
              </button>
              {veh.statusColor === 'blue' ? (
                <button
                  onClick={() => onNavigate('bookings')}
                  className="flex-1 py-2 px-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-all shadow-[0_2px_12px_rgba(249,115,22,0.3)] cursor-pointer"
                >
                  Live Service
                </button>
              ) : (
                <button
                  onClick={() => onSelectVehicleForService(veh)}
                  className="flex-1 py-2 px-3 rounded-lg bg-orange-500/20 hover:bg-orange-500 hover:text-white border border-orange-500/30 text-orange-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  Book Service
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Fleet Telemetry Metric Bar (Image 7) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#191f2f]/80 border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-white font-mono">{vehicles.length} Vehicles</div>
            <div className="text-[11px] text-slate-400">Active OEM Warranty</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#191f2f]/80 border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-white font-mono">1 In Service</div>
            <div className="text-[11px] text-slate-400">Bay 04 Diagnostics</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#191f2f]/80 border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-white font-mono">51,370 mi</div>
            <div className="text-[11px] text-slate-400">Combined Odometer</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#191f2f]/80 border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-white font-mono">Oct 28</div>
            <div className="text-[11px] text-slate-400">Next Recommended Slot</div>
          </div>
        </div>
      </div>

      {/* Comprehensive Service Archive (Image 7) */}
      <div className="rounded-2xl bg-[#191f2f]/80 border border-white/10 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Comprehensive Service Archive
              </h2>
              <p className="text-xs text-slate-400">
                Verified dealership grade logs, mechanical RO tallies, and certification sign-offs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-orange-400" />
              <span>Export CSV</span>
            </button>
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-orange-500/40 cursor-pointer"
            >
              <option value="all" className="bg-[#141b2b]">All Vehicles</option>
              <option value="Porsche" className="bg-[#141b2b]">Porsche 911 GT3</option>
              <option value="BMW" className="bg-[#141b2b]">BMW M4 Comp</option>
              <option value="Audi" className="bg-[#141b2b]">Audi RS6</option>
            </select>
          </div>
        </div>

        {/* Archive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141b2b] text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/5">
              <tr>
                <th className="py-3 px-5">DATE</th>
                <th className="py-3 px-4">VEHICLE</th>
                <th className="py-3 px-4">SERVICE PACKAGE</th>
                <th className="py-3 px-4">LEAD MECHANIC</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">AMOUNT</th>
                <th className="py-3 px-5 text-center">INVOICE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-normal">
              {filteredArchive.map((row) => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-5 font-mono text-slate-400 tabular-nums">
                    {row.date}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-white">
                    <div>{row.vehicle}</div>
                    <div className="text-[10px] font-mono text-slate-400">{row.sub}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <div className="font-semibold text-slate-200">{row.service}</div>
                    <div className="text-[11px] text-slate-400">{row.serviceSub}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 flex items-center justify-center font-bold text-[10px]">
                        {row.mechanicInitials}
                      </div>
                      <span className="text-slate-300 font-medium">{row.leadMechanic}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        row.statusColor === 'blue'
                          ? 'bg-blue-500/15 border border-blue-500/30 text-blue-300'
                          : row.statusColor === 'green'
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                          : 'bg-purple-500/15 border border-purple-500/30 text-purple-300'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          row.statusColor === 'blue'
                            ? 'bg-blue-400 animate-pulse'
                            : row.statusColor === 'green'
                            ? 'bg-emerald-400'
                            : 'bg-purple-400'
                        }`}
                      ></span>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white tabular-nums">
                    {row.amount}
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <button
                      onClick={() => onNavigate('invoices')}
                      className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="View Invoice"
                    >
                      <Download className="w-3.5 h-3.5 text-orange-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
