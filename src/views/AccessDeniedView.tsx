import React from 'react';
import { ViewMode, UserRole } from '../types';
import { ShieldAlert, ArrowLeft, Lock, ArrowRight, Wrench, ShieldCheck, User } from 'lucide-react';

interface AccessDeniedViewProps {
  currentRole: UserRole;
  attemptedView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  currentRole,
  attemptedView,
  onNavigate,
}) => {
  const isCustomer = currentRole === 'customer';
  const isMechanic = currentRole === 'mechanic';
  const isAdmin = currentRole === 'admin';
  const isUnauthenticated = !currentRole;

  // Determine specific restriction context
  let title = 'Access Restricted';
  let badgeLabel = 'SECURITY PROTOCOL 403: RESTRICTED ACCESS';
  let description = 'You do not have the required role clearance to access this sector.';
  let primaryActionLabel = 'Return to Authorized Portal';
  let primaryActionView: ViewMode = 'landing';

  if (isCustomer) {
    if (attemptedView === 'admin') {
      title = 'Restricted Admin Console';
      badgeLabel = 'CUSTOMER CLEARANCE ENFORCED';
      description = 'You are signed in as a Customer. Customers do not have permission to access the Workshop Executive Console or Billing Settlement Desk.';
      primaryActionLabel = 'Back to Customer Portal';
      primaryActionView = 'customer-portal';
    } else if (attemptedView === 'mechanic') {
      title = 'Restricted Workshop Bay';
      badgeLabel = 'CUSTOMER CLEARANCE ENFORCED';
      description = 'You are signed in as a Customer. Workshop diagnostic terminals and telemetry bays are restricted to certified mechanics only.';
      primaryActionLabel = 'Back to Customer Portal';
      primaryActionView = 'customer-portal';
    } else {
      title = 'Access Restricted';
      primaryActionLabel = 'Back to Customer Portal';
      primaryActionView = 'customer-portal';
    }
  } else if (isMechanic) {
    if (attemptedView === 'admin') {
      title = 'Restricted Executive Console';
      badgeLabel = 'MECHANIC CLEARANCE ENFORCED';
      description = 'You are signed in as a Workshop Mechanic. Technicians are authorized only for bay telemetry and job work orders, and do not have access to the Executive Admin Console.';
      primaryActionLabel = 'Back to Mechanic Workstation';
      primaryActionView = 'mechanic';
    } else {
      title = 'Restricted Client Domain';
      badgeLabel = 'MECHANIC CLEARANCE ENFORCED';
      description = 'You are signed in as a Workshop Mechanic. Technician accounts operate exclusively in the bay workstation and cannot access customer accounts or private garage assets.';
      primaryActionLabel = 'Back to Mechanic Workstation';
      primaryActionView = 'mechanic';
    }
  } else if (isUnauthenticated) {
    title = 'Authentication Required';
    badgeLabel = 'RBAC AUTHENTICATION REQUIRED';
    description = `Please log in with the appropriate credentials to access the ${attemptedView.toUpperCase()} portal.`;
    primaryActionLabel = 'Go to Public Home';
    primaryActionView = 'landing';
  }

  return (
    <div className="min-h-screen bg-[#0c1322] text-[#dce2f7] flex flex-col justify-between relative overflow-hidden select-none">
      {/* Ambient Red Glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-rose-600/10 blur-[160px] pointer-events-none"></div>

      <header className="px-6 py-4 border-b border-white/5 bg-[#0c1322]/80 backdrop-blur-xl flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Lock className="w-4 h-4" />
          </div>
          <span className="font-bold text-white tracking-tight">Apex RBAC Security Perimeter</span>
        </div>

        <button
          onClick={() => onNavigate(primaryActionView)}
          className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{primaryActionLabel}</span>
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-lg bg-[#141b2b]/95 border border-rose-500/30 rounded-3xl p-8 text-center space-y-5 shadow-2xl backdrop-blur-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(244,63,94,0.3)]">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-[11px] mb-2 font-bold">
              <span>{badgeLabel}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {title}
            </h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs font-mono space-y-1 text-slate-400">
            <div className="flex justify-between">
              <span>Active Role:</span>
              <span className="font-bold text-white uppercase">
                {currentRole ? currentRole : 'UNAUTHENTICATED'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Requested Sector:</span>
              <span className="text-rose-400 font-bold uppercase">{attemptedView}</span>
            </div>
            <div className="flex justify-between">
              <span>Required Role:</span>
              <span className="text-emerald-400 font-bold uppercase">
                {attemptedView === 'admin'
                  ? 'ADMIN'
                  : attemptedView === 'mechanic'
                  ? 'MECHANIC'
                  : 'CUSTOMER'}
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => onNavigate(primaryActionView)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
            >
              <span>{primaryActionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Alternative Individual Login Portals */}
            <div className="pt-3 border-t border-white/5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2">
                Need to sign in with a different role?
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onNavigate('customer-login')}
                  className="py-2 px-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[11px] font-medium transition-colors cursor-pointer flex flex-col items-center gap-1"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Customer Login</span>
                </button>

                <button
                  onClick={() => onNavigate('mechanic-login')}
                  className="py-2 px-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[11px] font-medium transition-colors cursor-pointer flex flex-col items-center gap-1"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Mechanic Login</span>
                </button>

                <button
                  onClick={() => onNavigate('admin-login')}
                  className="py-2 px-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[11px] font-medium transition-colors cursor-pointer flex flex-col items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Login</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="px-6 py-4 border-t border-white/5 bg-[#0c1322]/80 text-center text-xs text-slate-500">
        Strict RBAC Segmentation Active • Customer & Mechanic Isolation Enforced
      </footer>
    </div>
  );
};
