import React, { useState } from 'react';
import { Search, Bell, CheckCircle2, ShieldCheck, ChevronDown, User, LogOut, Wrench, Gauge, Receipt, Lock } from 'lucide-react';
import { ViewMode, UserRole, CustomerUser } from '../types';

interface HeaderProps {
  onOpenRegister: () => void;
  onOpenMechanicLogin?: () => void;
  onOpenLogin?: (initialId?: string) => void;
  onNavigate: (view: ViewMode) => void;
  currentView: ViewMode;
  currentRole?: UserRole;
  onLogout?: () => void;
  breadcrumbs?: string;
  bayStatus?: string;
  customerUser?: CustomerUser;
  adminUser?: { id: string; name: string; email: string; title: string };
  mechanicUser?: { id: string; name: string; badgeId: string; station: string; title: string };
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRegister,
  onOpenMechanicLogin,
  onOpenLogin,
  onNavigate,
  currentRole = 'customer',
  onLogout,
  breadcrumbs,
  bayStatus = 'BAY LOCKED & SYNCED',
  customerUser,
  adminUser,
  mechanicUser,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: '1',
      title: 'Dyno Bench Calibration Underway',
      desc: 'Porsche 911 GT3 (992) RPM pull #2 completed safely at 8,900 RPM.',
      time: '4 mins ago',
      unread: true,
    },
    {
      id: '2',
      title: 'Brake Runout Clearance Passed',
      desc: 'Front rotor micro-lathing verified within ±0.002mm tolerance.',
      time: '18 mins ago',
      unread: true,
    },
    {
      id: '3',
      title: 'Parts Allocated to Bay 04',
      desc: '2x Castrol SRF Racing Brake Fluid allocated by Tech Alex Vance.',
      time: '42 mins ago',
      unread: false,
    },
  ];

  // Helper for initials
  const getInitials = (name?: string) => {
    if (!name) return 'AP';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 px-6 border-b border-white/5 bg-[#0c1322]/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-20">
      {/* Left: Global Search or Breadcrumbs */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search telemetry, RO#, VIN..."
            className="w-full h-9.5 pl-10 pr-12 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-[#64748b] focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-[#64748b] bg-white/[0.05] border border-white/10 rounded">
            ⌘K
          </kbd>
        </div>

        {breadcrumbs && (
          <div className="hidden lg:flex items-center gap-2 text-xs text-[#64748b] whitespace-nowrap">
            <span>{breadcrumbs}</span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Bay Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{bayStatus}</span>
        </div>

        {/* Live Telemetry Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] flex items-center justify-center text-[#94a3b8] hover:text-white transition-all cursor-pointer relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_6px_#f97316]"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#191f2f] border border-white/10 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-2">
                <span className="text-xs font-semibold text-white">Live Telemetry Alerts</span>
                <span className="text-[10px] text-orange-400 font-mono">3 New</span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setShowNotifications(false);
                      if (currentRole === 'customer') onNavigate('customer-portal');
                      else if (currentRole === 'mechanic') onNavigate('mechanic');
                      else if (currentRole === 'admin') onNavigate('admin');
                    }}
                    className={`p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                      n.unread ? 'bg-white/[0.04] border border-orange-500/20' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-medium text-white mb-0.5">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-[#64748b]">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8] leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            {/* Dynamic avatar based on active role */}
            {currentRole === 'customer' && (
              <>
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                  {getInitials(customerUser?.name || 'Marcus Sterling')}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {customerUser?.name || 'Marcus Sterling'}
                  </div>
                  <div className="text-[10px] text-orange-400 font-medium leading-none flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                    <span>{customerUser?.tier || 'Client Access'}</span>
                  </div>
                </div>
              </>
            )}

            {currentRole === 'admin' && (
              <>
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                  {getInitials(adminUser?.name || 'Kurt Becker')}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {adminUser?.name || 'Director Becker'}
                  </div>
                  <div className="text-[10px] text-purple-400 font-medium leading-none flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-purple-400"></span>
                    <span>Admin • Level 5</span>
                  </div>
                </div>
              </>
            )}

            {currentRole === 'mechanic' && (
              <>
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                  {getInitials(mechanicUser?.name || 'Alex Vance')}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {mechanicUser?.name || 'Alex Vance'}
                  </div>
                  <div className="text-[10px] text-blue-400 font-medium leading-none flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                    <span>Master Tech • Bay 04</span>
                  </div>
                </div>
              </>
            )}

            {!currentRole && (
              <>
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold shadow-inner">
                  ?
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold text-white leading-tight">Guest User</div>
                  <div className="text-[10px] text-slate-400 font-medium leading-none">
                    Unauthenticated
                  </div>
                </div>
              </>
            )}

            <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#191f2f] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              {currentRole === 'customer' ? (
                <>
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <div className="text-xs font-semibold text-white">{customerUser?.name || 'Marcus Sterling'}</div>
                    <div className="text-[11px] text-[#64748b]">{customerUser?.email || 'm.sterling@apex.io'}</div>
                    <div className="text-[10px] text-orange-400 font-mono mt-0.5">● Client Access Active</div>
                  </div>
                  {/* Customer specific navigation items - NO ADMIN, NO MECHANIC */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('customer-portal');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-orange-400 hover:text-orange-300 hover:bg-white/[0.04] rounded-lg text-left cursor-pointer font-medium"
                  >
                    <Gauge className="w-3.5 h-3.5 text-orange-400" />
                    <span>Vehicle Status & Pre-Book</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('vehicles');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#94a3b8] hover:text-white hover:bg-white/[0.04] rounded-lg text-left cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Garage Assets</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('invoices');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#94a3b8] hover:text-white hover:bg-white/[0.04] rounded-lg text-left cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>My Invoices & Receipts</span>
                  </button>
                  <div className="my-1.5 border-t border-white/5"></div>
                  {/* Switch to other individual logins */}
                  <div className="px-3 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Apex Identity & Portals
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onOpenLogin) onOpenLogin();
                      else onNavigate('login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-orange-400 hover:bg-white/[0.04] rounded-lg text-left cursor-pointer"
                  >
                    <Lock className="w-3 h-3 text-orange-400" />
                    <span>Universal ID Modal Sign In</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenRegister();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-lg text-left cursor-pointer"
                  >
                    <User className="w-3 h-3 text-amber-400" />
                    <span>Register New Apex ID</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onOpenLogin) onOpenLogin('TECH-08');
                      else onNavigate('mechanic-login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-blue-400 hover:bg-white/[0.04] rounded-lg text-left cursor-pointer"
                  >
                    <Wrench className="w-3 h-3" />
                    <span>Mechanic Terminal Login</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onOpenLogin) onOpenLogin('ADM-01');
                      else onNavigate('admin-login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-purple-400 hover:bg-white/[0.04] rounded-lg text-left cursor-pointer"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>Admin Console Login</span>
                  </button>
                  <div className="my-1 border-t border-white/5"></div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onLogout) onLogout();
                      else onNavigate('customer-login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-white/[0.04] rounded-lg text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of Client Account</span>
                  </button>
                </>
              ) : currentRole === 'mechanic' ? (
                <>
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <div className="text-xs font-semibold text-white">{mechanicUser?.name || 'Alex Vance'}</div>
                    <div className="text-[11px] text-blue-400 font-mono">{mechanicUser?.badgeId || '#TECH-08-ALX'}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{mechanicUser?.station || 'Bay 04 — Dyno & Brake'}</div>
                  </div>
                  {/* Mechanic specific navigation - NO ADMIN */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('mechanic');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-white/[0.04] rounded-lg text-left cursor-pointer font-medium"
                  >
                    <Wrench className="w-3.5 h-3.5 text-blue-400" />
                    <span>Mechanic Workstation</span>
                  </button>
                  <div className="my-1.5 border-t border-white/5"></div>
                  <div className="px-3 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Switch Login Portal
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('customer-login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-orange-400 hover:bg-white/[0.04] rounded-lg text-left cursor-pointer"
                  >
                    <User className="w-3 h-3" />
                    <span>Customer Portal Login</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('admin-login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-purple-400 hover:bg-white/[0.04] rounded-lg text-left cursor-pointer"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>Admin Console Login</span>
                  </button>
                  <div className="my-1 border-t border-white/5"></div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onLogout) onLogout();
                      else onNavigate('mechanic-login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-white/[0.04] rounded-lg text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of Terminal</span>
                  </button>
                </>
              ) : currentRole === 'admin' ? (
                <>
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <div className="text-xs font-semibold text-white">{adminUser?.name || 'Director Kurt Becker'}</div>
                    <div className="text-[11px] text-[#64748b]">{adminUser?.email || 'director.becker@apex.io'}</div>
                    <div className="text-[10px] text-purple-400 font-mono mt-0.5">● Level 5 Admin Access</div>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('admin');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-purple-400 hover:text-purple-300 hover:bg-white/[0.04] rounded-lg text-left cursor-pointer font-medium"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Admin Workstation</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('invoices');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#94a3b8] hover:text-white hover:bg-white/[0.04] rounded-lg text-left cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Billing Ledger</span>
                  </button>
                  <div className="my-1.5 border-t border-white/5"></div>
                  <div className="px-3 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Switch Login Portal
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('customer-login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-orange-400 hover:bg-white/[0.04] rounded-lg text-left cursor-pointer"
                  >
                    <User className="w-3 h-3" />
                    <span>Customer Portal Login</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('mechanic-login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-blue-400 hover:bg-white/[0.04] rounded-lg text-left cursor-pointer"
                  >
                    <Wrench className="w-3 h-3" />
                    <span>Mechanic Terminal Login</span>
                  </button>
                  <div className="my-1 border-t border-white/5"></div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onLogout) onLogout();
                      else onNavigate('admin-login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-white/[0.04] rounded-lg text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of Admin Console</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <div className="text-xs font-semibold text-white">Select Access Portal</div>
                    <div className="text-[10px] text-slate-400">Please sign in with your role</div>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('customer-login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-orange-400 hover:bg-white/[0.04] rounded-lg text-left cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-orange-400" />
                    <span>Customer Portal Login</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('mechanic-login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-blue-400 hover:bg-white/[0.04] rounded-lg text-left cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5 text-blue-400" />
                    <span>Mechanic Terminal Login</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('admin-login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-purple-400 hover:bg-white/[0.04] rounded-lg text-left cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Admin Workstation Login</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
