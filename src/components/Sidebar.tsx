import React from 'react';
import { ViewMode, UserRole } from '../types';
import { 
  LayoutDashboard, 
  Car, 
  CalendarPlus, 
  ClipboardList, 
  Receipt, 
  Headset, 
  Wrench,
  Globe,
  ShieldCheck,
  Gauge,
  LogOut,
  User
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  currentRole?: UserRole;
  onNavigate: (view: ViewMode) => void;
  onOpenConcierge: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  currentRole = 'customer',
  onNavigate,
  onOpenConcierge,
  onLogout,
}) => {
  const customerNavItems = [
    {
      id: 'dashboard' as ViewMode,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'customer-portal' as ViewMode,
      label: 'Vehicle Status & Pre-Book',
      icon: Gauge,
    },
    {
      id: 'vehicles' as ViewMode,
      label: 'My Vehicles',
      icon: Car,
    },
    {
      id: 'book' as ViewMode,
      label: 'Book Service',
      icon: CalendarPlus,
    },
    {
      id: 'bookings' as ViewMode,
      label: 'My Bookings',
      icon: ClipboardList,
    },
    {
      id: 'invoices' as ViewMode,
      label: 'My Invoices',
      icon: Receipt,
    },
  ];

  const adminNavItems = [
    {
      id: 'admin' as ViewMode,
      label: 'Admin Workstation',
      icon: ShieldCheck,
    },
    {
      id: 'invoices' as ViewMode,
      label: 'Billing Ledger',
      icon: Receipt,
    },
    {
      id: 'bookings' as ViewMode,
      label: 'RO Schedule & Bays',
      icon: ClipboardList,
    },
    {
      id: 'vehicles' as ViewMode,
      label: 'Fleet Registry',
      icon: Car,
    },
  ];

  const mechanicNavItems = [
    {
      id: 'mechanic' as ViewMode,
      label: 'Mechanic Workstation',
      icon: Wrench,
    },
  ];

  const navItems = 
    currentRole === 'admin' 
      ? adminNavItems 
      : currentRole === 'mechanic'
      ? mechanicNavItems
      : customerNavItems;

  return (
    <aside className="w-64 shrink-0 bg-[#0c1322] border-r border-white/5 min-h-screen flex flex-col justify-between p-4 z-30 select-none">
      <div className="space-y-6">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 px-2 py-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)] group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-white text-xl">speed</span>
          </div>
          <div>
            <div className="font-bold text-white text-lg tracking-tight leading-none">ApexMoto</div>
            <div className="text-[10px] uppercase tracking-wider text-orange-400/90 font-semibold mt-0.5">
              Precision Care
            </div>
          </div>
        </div>

        {/* Current Role Indicator Pill */}
        <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">Clearance:</span>
          <span className={`font-bold uppercase ${
            currentRole === 'admin'
              ? 'text-purple-400'
              : currentRole === 'mechanic'
              ? 'text-blue-400'
              : currentRole === 'customer'
              ? 'text-orange-400'
              : 'text-slate-400'
          }`}>
            {currentRole ? `● ${currentRole}` : 'Guest'}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_4px_16px_rgba(249,115,22,0.35)] font-semibold'
                    : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#64748b]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom telemetry card & Concierge */}
      <div className="space-y-3 pt-6 border-t border-white/5">
        {/* Switch View Quick Buttons */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.03] rounded-lg border border-white/5 text-[10px] text-[#94a3b8]">
          <button
            onClick={() => onNavigate('landing')}
            title="Public Landing Page"
            className="flex-1 flex items-center justify-center gap-0.5 py-1 rounded hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
          >
            <Globe className="w-3 h-3" />
            <span>Public</span>
          </button>

          {currentRole === 'customer' && (
            <>
              <span className="text-white/20">|</span>
              <button
                onClick={() => onNavigate('customer-portal')}
                title="Customer Live Telemetry & Pre-Book"
                className={`flex-1 flex items-center justify-center gap-0.5 py-1 rounded transition-colors cursor-pointer ${
                  currentView === 'customer-portal'
                    ? 'bg-orange-500/20 text-orange-400 font-medium'
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <Gauge className="w-3 h-3" />
                <span>Status</span>
              </button>
              <span className="text-white/20">|</span>
              <button
                onClick={onLogout ? onLogout : () => onNavigate('customer-login')}
                title="Sign out of client account"
                className="flex-1 flex items-center justify-center gap-0.5 py-1 rounded hover:bg-rose-500/20 hover:text-rose-300 transition-colors cursor-pointer text-slate-400"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </>
          )}

          {currentRole === 'mechanic' && (
            <>
              <span className="text-white/20">|</span>
              <button
                onClick={() => onNavigate('mechanic')}
                title="Mechanic Workstation Terminal"
                className={`flex-1 flex items-center justify-center gap-0.5 py-1 rounded transition-colors cursor-pointer ${
                  currentView === 'mechanic'
                    ? 'bg-blue-500/20 text-blue-300 font-medium'
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <Wrench className="w-3 h-3" />
                <span>Terminal</span>
              </button>
              <span className="text-white/20">|</span>
              <button
                onClick={onLogout ? onLogout : () => onNavigate('mechanic-login')}
                title="Sign out of mechanic terminal"
                className="flex-1 flex items-center justify-center gap-0.5 py-1 rounded hover:bg-rose-500/20 hover:text-rose-300 transition-colors cursor-pointer text-slate-400"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </>
          )}

          {currentRole === 'admin' && (
            <>
              <span className="text-white/20">|</span>
              <button
                onClick={() => onNavigate('admin')}
                title="Admin Workstation Console"
                className={`flex-1 flex items-center justify-center gap-0.5 py-1 rounded transition-colors cursor-pointer ${
                  currentView === 'admin'
                    ? 'bg-purple-500/20 text-purple-300 font-medium'
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Admin</span>
              </button>
              <span className="text-white/20">|</span>
              <button
                onClick={onLogout ? onLogout : () => onNavigate('admin-login')}
                title="Sign out of admin console"
                className="flex-1 flex items-center justify-center gap-0.5 py-1 rounded hover:bg-rose-500/20 hover:text-rose-300 transition-colors cursor-pointer text-slate-400"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </>
          )}

          {!currentRole && (
            <>
              <span className="text-white/20">|</span>
              <button
                onClick={() => onNavigate('customer-login')}
                title="Sign In"
                className="flex-1 flex items-center justify-center gap-0.5 py-1 rounded hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                <User className="w-3 h-3" />
                <span>Login</span>
              </button>
            </>
          )}
        </div>

        {/* Live Service Line Indicator */}
        <div 
          onClick={() => {
            if (currentRole === 'admin' || currentRole === 'customer') {
              onNavigate('bookings');
            } else if (currentRole === 'mechanic') {
              onNavigate('mechanic');
            }
          }}
          className="p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:border-orange-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#64748b] font-semibold">
            <span>Service Line</span>
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]"></span>
          </div>
          <div className="text-xs font-semibold text-white mt-1 group-hover:text-orange-300 transition-colors">
            Bay 04 Active
          </div>
          <div className="text-[11px] text-[#94a3b8] truncate">
            911 GT3 RS Diagnostics
          </div>
        </div>

        {/* Concierge Desk Button */}
        <button
          onClick={onOpenConcierge}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#94a3b8] hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
        >
          <Headset className="w-4 h-4 text-orange-400" />
          <span>Concierge Desk</span>
        </button>
      </div>
    </aside>
  );
};
