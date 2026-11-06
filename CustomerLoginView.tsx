import React, { useState, useMemo } from 'react';
import { ViewMode, CustomerUser, Vehicle } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Car, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft,
  Key,
  Shield,
  Gauge,
  UserCheck,
  Check,
  AlertCircle,
  Phone,
  Info,
  XCircle,
  Fingerprint
} from 'lucide-react';

interface CustomerLoginViewProps {
  onNavigate: (view: ViewMode) => void;
  onLoginSuccess: (user: CustomerUser, tokenOrVin?: string, newVehicle?: Vehicle) => void;
}

export const CustomerLoginView: React.FC<CustomerLoginViewProps> = ({
  onNavigate,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'lookup' | 'register'>('signin');

  // Sign in fields
  const [email, setEmail] = useState('m.sterling@apex.io');
  const [password, setPassword] = useState('ApexTrack992!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick lookup fields
  const [lookupToken, setLookupToken] = useState('BK-20260928-A1B2');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regVehicle, setRegVehicle] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regTermsAccepted, setRegTermsAccepted] = useState(false);

  // Auto-generate assigned Apex ID preview based on initials and random salt
  const assignedApexId = useMemo(() => {
    const initials = regName.trim()
      ? regName
          .trim()
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : 'MK';
    const hash = Math.floor(1000 + Math.random() * 9000);
    return `CUST-${hash}-${initials}`;
  }, [regName]);

  // Field touched tracking for inline validation
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);

  const demoAccounts: {
    user: CustomerUser;
    vehicleName: string;
    vehicleId: string;
    pass: string;
    tag: string;
  }[] = [
    {
      user: {
        id: 'CUST-101',
        name: 'Marcus Sterling',
        email: 'm.sterling@apex.io',
        phone: '+1 (555) 234-8901',
        tier: 'Platinum VIP',
        defaultVehicleId: 'veh-911',
        registeredDate: 'March 2025',
      },
      vehicleName: '2023 Porsche 911 GT3 (In Bay 04)',
      vehicleId: 'veh-911',
      pass: 'ApexTrack992!',
      tag: 'ACTIVE RO IN BAY 04',
    },
    {
      user: {
        id: 'CUST-102',
        name: 'Elena Rostova',
        email: 'e.rostova@quattro.de',
        phone: '+1 (555) 871-3329',
        tier: 'Gold Member',
        defaultVehicleId: 'veh-rs6',
        registeredDate: 'June 2025',
      },
      vehicleName: '2024 Audi RS6 Avant (Healthy)',
      vehicleId: 'veh-rs6',
      pass: 'V8BiTurbo2026!',
      tag: 'READY / HEALTHY',
    },
    {
      user: {
        id: 'CUST-103',
        name: 'David Chen',
        email: 'd.chen@bavarian.io',
        phone: '+1 (555) 412-9904',
        tier: 'Track Club',
        defaultVehicleId: 'veh-m4',
        registeredDate: 'January 2026',
      },
      vehicleName: '2022 BMW M4 Competition',
      vehicleId: 'veh-m4',
      pass: 'BimmerM4Comp!',
      tag: 'SCHEDULED PRE-BOOKING',
    },
  ];

  // ==========================================
  // REAL-TIME VALIDATION RULES
  // ==========================================
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};

    // 1. Full Name
    if (!regName.trim()) {
      errs.name = 'Full name is required.';
    } else if (regName.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters.';
    } else if (!/^[a-zA-Z\s'-]+$/.test(regName.trim())) {
      errs.name = 'Full name should only contain letters, spaces, and hyphens.';
    }

    // 2. Email Address
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regEmail.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(regEmail.trim())) {
      errs.email = 'Please enter a valid email address (e.g., name@domain.com).';
    } else if (
      demoAccounts.some(
        (acc) => acc.user.email.toLowerCase() === regEmail.trim().toLowerCase()
      )
    ) {
      errs.email = 'An account with this email is already registered. Please sign in instead.';
    }

    // 3. Phone (Optional, but if filled, must be at least 10 digits)
    if (regPhone.trim()) {
      const cleanPhone = regPhone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        errs.phone = 'Phone number must contain at least 10 digits.';
      }
    }

    // 4. Vehicle (Optional, but if filled, at least 3 chars)
    if (regVehicle.trim() && regVehicle.trim().length < 3) {
      errs.vehicle = 'Vehicle name must be at least 3 characters.';
    }

    // 5. Password
    if (!regPassword) {
      errs.password = 'Password is required.';
    } else if (regPassword.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    } else if (!/[A-Z]/.test(regPassword)) {
      errs.password = 'Must include at least one uppercase letter (A-Z).';
    } else if (!/[a-z]/.test(regPassword)) {
      errs.password = 'Must include at least one lowercase letter (a-z).';
    } else if (!/[0-9]/.test(regPassword)) {
      errs.password = 'Must include at least one number (0-9).';
    } else if (!/[!@#$%^&*()_+~|}{[\]:;?><,./-=]/.test(regPassword)) {
      errs.password = 'Must include at least one symbol (!@#$%...).';
    }

    // 6. Confirm Password
    if (!regConfirmPassword) {
      errs.confirmPassword = 'Confirm password is required.';
    } else if (regConfirmPassword !== regPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    // 7. Terms & Conditions
    if (!regTermsAccepted) {
      errs.terms = 'You must accept the Terms of Service & Telematics Agreement.';
    }

    return errs;
  }, [regName, regEmail, regPhone, regVehicle, regPassword, regConfirmPassword, regTermsAccepted]);

  // Password Strength Calculations
  const passwordCriteria = useMemo(() => {
    return {
      minLength: regPassword.length >= 8,
      hasCase: /[A-Z]/.test(regPassword) && /[a-z]/.test(regPassword),
      hasNumber: /[0-9]/.test(regPassword),
      hasSpecial: /[!@#$%^&*()_+~|}{[\]:;?><,./-=]/.test(regPassword),
    };
  }, [regPassword]);

  const passwordStrength = useMemo(() => {
    if (!regPassword) return { score: 0, label: 'Awaiting Key', color: 'bg-slate-700', text: 'text-slate-500' };
    let score = 0;
    if (passwordCriteria.minLength) score++;
    if (passwordCriteria.hasCase) score++;
    if (passwordCriteria.hasNumber) score++;
    if (passwordCriteria.hasSpecial) score++;

    if (score === 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-500', text: 'text-blue-400' };
    return { score: 4, label: 'Military Grade', color: 'bg-emerald-500', text: 'text-emerald-400' };
  }, [regPassword, passwordCriteria]);

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Sign In Handler
  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const cleanInput = email.trim().toLowerCase();
    const matched = demoAccounts.find(
      (acc) =>
        acc.user.email.toLowerCase() === cleanInput ||
        acc.user.id.toLowerCase() === cleanInput ||
        acc.user.id.toLowerCase().replace('cust-', '') === cleanInput.replace('cust-', '')
    );

    if (matched) {
      onLoginSuccess(matched.user, matched.user.defaultVehicleId);
    } else {
      const customUser: CustomerUser = {
        id: `cust-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        tier: 'Apex Club Member',
        defaultVehicleId: 'veh-911',
      };
      onLoginSuccess(customUser);
    }
  };

  const handleQuickDemoLogin = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.user.email);
    setPassword(acc.pass);
    onLoginSuccess(acc.user, acc.vehicleId);
  };

  const handleLookup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!lookupToken.trim()) {
      setErrorMsg('Please enter a valid Booking Token or VIN.');
      return;
    }

    const guestUser: CustomerUser = {
      id: 'guest-tracker',
      name: 'Guest Telemetry Viewer',
      email: 'guest@apexmoto.io',
      tier: 'Live Telemetry Access',
      defaultVehicleId: lookupToken.toUpperCase().includes('RS6') ? 'veh-rs6' : lookupToken.toUpperCase().includes('M4') ? 'veh-m4' : 'veh-911',
    };

    onLoginSuccess(guestUser, lookupToken.trim());
  };

  // Customer Registration Handler with Full Validation
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched to trigger inline error messages
    const allTouched = {
      name: true,
      email: true,
      phone: true,
      vehicle: true,
      password: true,
      confirmPassword: true,
      terms: true,
    };
    setTouched(allTouched);

    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      setErrorMsg(`Please correct the ${errorKeys.length} highlighted error${errorKeys.length > 1 ? 's' : ''} to proceed.`);
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    const newVehicleId = `veh-cust-${Date.now().toString().slice(-4)}`;
    const customCarName = regVehicle.trim() || '2024 Apex Precision GT';

    const customVehicle: Vehicle = {
      id: newVehicleId,
      name: customCarName,
      edition: 'Client Garage Edition',
      specs: 'Telemetry Sync Active • Precision Workshop Direct',
      plate: `APX-${Math.floor(100 + Math.random() * 900)}`,
      vin: `WP0APEX${Date.now().toString().slice(-8)}`,
      body: 'Coupe / Sports',
      mileage: '1,240 mi',
      healthScore: 100,
      healthLabel: 'HEALTHY / ZERO DTCS',
      status: 'READY / HEALTHY',
      statusColor: 'green',
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
      warrantyValid: true,
    };

    const newUser: CustomerUser = {
      id: assignedApexId,
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim() || '+1 (555) 234-8901',
      tier: 'Platinum Member',
      defaultVehicleId: newVehicleId,
      registeredDate: 'October 2026',
    };

    setRegSuccessMessage(`Account registered successfully! Assigned Apex ID: ${assignedApexId}`);

    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(newUser, undefined, customVehicle);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#0c1322] text-[#dce2f7] flex flex-col justify-between relative overflow-hidden select-none">
      {/* Ambient Radial Lights */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[160px] pointer-events-none"></div>

      {/* Top Header Bar */}
      <header className="px-6 py-4 border-b border-white/5 bg-[#0c1322]/80 backdrop-blur-xl flex items-center justify-between z-20">
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-[0_0_12px_rgba(249,115,22,0.4)] group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-white text-base">speed</span>
          </div>
          <div>
            <div className="font-bold text-white text-sm tracking-tight leading-none">ApexMoto</div>
            <div className="text-[9px] uppercase tracking-wider text-orange-400 font-bold mt-0.5">
              CUSTOMER PORTAL ACCESS
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('landing')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Home</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-4">
        <div className="w-full max-w-xl bg-[#141b2b]/95 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden relative">
          {/* Specular Highlight Line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

          {/* Header Banner */}
          <div className="p-6 pb-4 border-b border-white/5 space-y-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
                  <span>APEX CLIENT TELEMATICS SYSTEM</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1.5">
                  {activeTab === 'signin' && 'Client Portal Sign In'}
                  {activeTab === 'lookup' && 'Live Telemetry Vehicle Lookup'}
                  {activeTab === 'register' && 'New Client Registration & Garage Setup'}
                </h1>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span className="font-mono text-[11px]">SHA-256 Auth</span>
              </div>
            </div>

            {/* Segmented Tab Controls */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-xl border border-white/5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'signin'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('lookup');
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'lookup'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Track by Token
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-150">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {regSuccessMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{regSuccessMessage}</span>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 1: Client Sign In */}
            {/* ============================================================== */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                    Client Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. m.sterling@apex.io"
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      Account Password
                    </label>
                    <span className="text-[10px] text-orange-400 hover:underline cursor-pointer">
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-orange-500"
                    />
                    <span>Remember this station</span>
                  </label>
                  <span className="text-[11px] font-mono text-emerald-400">TLS 1.3 Hardware Protected</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                >
                  <span>Sign In & View Vehicle Status</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* 1-Click Quick Preset Accounts */}
                <div className="pt-4 border-t border-white/5 space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold text-center">
                    ⚡ QUICK DEMO CLIENT ACCOUNTS
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {demoAccounts.map((acc) => (
                      <button
                        key={acc.user.id}
                        type="button"
                        onClick={() => handleQuickDemoLogin(acc)}
                        className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-orange-500/30 transition-all text-left group cursor-pointer"
                      >
                        <div className="text-[11px] font-bold text-white group-hover:text-orange-300 truncate">
                          {acc.user.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {acc.vehicleName.split('(')[0]}
                        </div>
                        <div className="text-[9px] font-mono text-orange-400/90 mt-1 truncate">
                          {acc.tag}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {/* ============================================================== */}
            {/* TAB 2: Quick Lookup by Token */}
            {/* ============================================================== */}
            {activeTab === 'lookup' && (
              <form onSubmit={handleLookup} className="space-y-4">
                <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <Gauge className="w-4 h-4 text-orange-400" />
                    <span>Instant Live Telemetry Lookup</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Have an active service order or dropping off a vehicle? Enter your Reservation Token or Vehicle VIN to access live dyno telemetry, stage progress, and bay webcams without password login.
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                    Booking Token or Vehicle VIN
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={lookupToken}
                      onChange={(e) => setLookupToken(e.target.value)}
                      placeholder="e.g. BK-20260928-A1B2 or VIN: WP0AF2A97PS..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs font-mono font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/60"
                      required
                    />
                  </div>
                </div>

                {/* Quick Token Presets */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-500">SAMPLE TOKENS IN WORKSHOP:</div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { token: 'BK-20260928-A1B2', desc: 'Porsche 911 GT3 (Bay 04)' },
                      { token: 'BK-20260928-B4C1', desc: 'Audi RS6 Avant' },
                      { token: 'BK-20260929-C7D2', desc: 'BMW M4 Competition' },
                    ].map((item) => (
                      <button
                        key={item.token}
                        type="button"
                        onClick={() => setLookupToken(item.token)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] font-mono text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Key className="w-3 h-3 text-orange-400" />
                        <span>{item.token}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Track Vehicle Live Status</span>
                </button>
              </form>
            )}

            {/* ============================================================== */}
            {/* TAB 3: New Customer Registration with Comprehensive Validation */}
            {/* ============================================================== */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} noValidate className="space-y-4">
                {/* Auto-Assigned Apex ID Banner */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/15 via-[#191f2f] to-orange-500/10 border border-orange-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-orange-400 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                      <span>AUTO-ASSIGNED APEX CLIENT ID</span>
                    </div>
                    <div className="text-base sm:text-lg font-mono font-extrabold text-white tracking-wider mt-0.5">
                      {assignedApexId}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Assigned automatically based on initials & cryptographic hash — no manual role selection required
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                </div>

                {/* Notice banner */}
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[11px] text-orange-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Register an Apex client account to track real-time telemetry, manage sports vehicles, and pre-book workshop bays.</span>
                </div>

                {/* 1. Full Name & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Full Name Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        Full Name <span className="text-rose-400">*</span>
                      </label>
                      {touched.name && !errors.name && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        onBlur={() => markTouched('name')}
                        placeholder="e.g. Julian Vance"
                        className={`w-full bg-black/40 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                          touched.name && errors.name
                            ? 'border-rose-500/60 bg-rose-500/5 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                            : touched.name && !errors.name
                            ? 'border-emerald-500/50 bg-emerald-500/5 focus:border-emerald-500'
                            : 'border-white/10 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30'
                        }`}
                      />
                      {touched.name && errors.name && (
                        <AlertCircle className="w-4 h-4 text-rose-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      )}
                    </div>
                    {touched.name && errors.name && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 animate-in fade-in duration-100">
                        <XCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email Address Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        Email Address <span className="text-rose-400">*</span>
                      </label>
                      {touched.email && !errors.email && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        onBlur={() => markTouched('email')}
                        placeholder="e.g. j.vance@apex.io"
                        className={`w-full bg-black/40 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                          touched.email && errors.email
                            ? 'border-rose-500/60 bg-rose-500/5 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                            : touched.email && !errors.email
                            ? 'border-emerald-500/50 bg-emerald-500/5 focus:border-emerald-500'
                            : 'border-white/10 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30'
                        }`}
                      />
                      {touched.email && errors.email && (
                        <AlertCircle className="w-4 h-4 text-rose-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      )}
                    </div>
                    {touched.email && errors.email && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 animate-in fade-in duration-100">
                        <XCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Mobile Phone & Primary Sports Vehicle Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Phone Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        Mobile Phone <span className="text-slate-500 text-[9px]">(For Bay SMS Alerts)</span>
                      </label>
                      {touched.phone && regPhone.trim() && !errors.phone && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        onBlur={() => markTouched('phone')}
                        placeholder="+1 (555) 000-0000"
                        className={`w-full bg-black/40 border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                          touched.phone && errors.phone
                            ? 'border-rose-500/60 bg-rose-500/5 focus:border-rose-500'
                            : touched.phone && regPhone.trim() && !errors.phone
                            ? 'border-emerald-500/50 bg-emerald-500/5'
                            : 'border-white/10 focus:border-orange-500/60'
                        }`}
                      />
                    </div>
                    {touched.phone && errors.phone && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <XCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Primary Vehicle Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        Primary Sports Vehicle <span className="text-slate-500 text-[9px]">(Garage Sync)</span>
                      </label>
                      {touched.vehicle && regVehicle.trim() && !errors.vehicle && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Added
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Car className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={regVehicle}
                        onChange={(e) => setRegVehicle(e.target.value)}
                        onBlur={() => markTouched('vehicle')}
                        placeholder="e.g. 2024 Ferrari 296 GTB"
                        className={`w-full bg-black/40 border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                          touched.vehicle && errors.vehicle
                            ? 'border-rose-500/60 bg-rose-500/5 focus:border-rose-500'
                            : touched.vehicle && regVehicle.trim() && !errors.vehicle
                            ? 'border-emerald-500/50 bg-emerald-500/5'
                            : 'border-white/10 focus:border-orange-500/60'
                        }`}
                      />
                    </div>
                    {touched.vehicle && errors.vehicle && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <XCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.vehicle}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* 3. Password & Confirm Password Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        Account Password <span className="text-rose-400">*</span>
                      </label>
                      {touched.password && !errors.password && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Secure
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        onBlur={() => markTouched('password')}
                        placeholder="Create a strong password"
                        className={`w-full bg-black/40 border rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                          touched.password && errors.password
                            ? 'border-rose-500/60 bg-rose-500/5 focus:border-rose-500'
                            : touched.password && !errors.password
                            ? 'border-emerald-500/50 bg-emerald-500/5 focus:border-emerald-500'
                            : 'border-white/10 focus:border-orange-500/60'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {touched.password && errors.password && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <XCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.password}</span>
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        Confirm Password <span className="text-rose-400">*</span>
                      </label>
                      {touched.confirmPassword && !errors.confirmPassword && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Matches
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showRegConfirmPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        onBlur={() => markTouched('confirmPassword')}
                        placeholder="Re-type your password"
                        className={`w-full bg-black/40 border rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                          touched.confirmPassword && errors.confirmPassword
                            ? 'border-rose-500/60 bg-rose-500/5 focus:border-rose-500'
                            : touched.confirmPassword && !errors.confirmPassword
                            ? 'border-emerald-500/50 bg-emerald-500/5 focus:border-emerald-500'
                            : 'border-white/10 focus:border-orange-500/60'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <XCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.confirmPassword}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Live Password Strength Meter & Checklist */}
                {regPassword.length > 0 && (
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono text-[10px] uppercase">
                        Telemetry Key Security:
                      </span>
                      <span className={`font-bold font-mono text-xs ${passwordStrength.text}`}>
                        {passwordStrength.label}
                      </span>
                    </div>

                    {/* Progress Bar 4 segments */}
                    <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`rounded-full transition-all duration-300 ${
                            passwordStrength.score >= step ? passwordStrength.color : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Criteria checklist */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-slate-400 pt-1 border-t border-white/5 font-mono">
                      <div className={`flex items-center gap-1.5 ${passwordCriteria.minLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {passwordCriteria.minLength ? <Check className="w-3 h-3" /> : <span className="w-3 text-center">•</span>}
                        <span>8+ Characters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordCriteria.hasCase ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {passwordCriteria.hasCase ? <Check className="w-3 h-3" /> : <span className="w-3 text-center">•</span>}
                        <span>Uppercase & Lowercase</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordCriteria.hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {passwordCriteria.hasNumber ? <Check className="w-3 h-3" /> : <span className="w-3 text-center">•</span>}
                        <span>Number (0-9)</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordCriteria.hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {passwordCriteria.hasSpecial ? <Check className="w-3 h-3" /> : <span className="w-3 text-center">•</span>}
                        <span>Special Symbol (!@#$)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Terms of Service Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={regTermsAccepted}
                      onChange={(e) => {
                        setRegTermsAccepted(e.target.checked);
                        markTouched('terms');
                      }}
                      className="mt-0.5 rounded accent-orange-500 cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-300 leading-snug group-hover:text-white transition-colors">
                      I agree to the <span className="text-orange-400 underline cursor-pointer">Apex Precision Terms of Service</span>, <span className="text-orange-400 underline cursor-pointer">Privacy Charter</span>, and authorize encrypted workshop bay telemetry access.
                    </span>
                  </label>
                  {touched.terms && errors.terms && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <XCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.terms}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer mt-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Encrypting & Registering Client...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Create Account & Enter Customer Portal</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <span className="text-xs text-slate-400">Already registered? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signin');
                      setErrorMsg(null);
                    }}
                    className="text-xs text-orange-400 font-semibold hover:underline cursor-pointer"
                  >
                    Sign In to Existing Profile
                  </button>
                </div>
              </form>
            )}

            {/* Switch to Other Portals */}
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
              <span>Looking for another portal?</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('mechanic-login')}
                  className="text-blue-400 hover:underline cursor-pointer font-medium"
                >
                  Mechanic Login
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => onNavigate('admin-login')}
                  className="text-purple-400 hover:underline cursor-pointer font-medium"
                >
                  Admin Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info Bar */}
      <footer className="px-6 py-4 border-t border-white/5 bg-[#0c1322]/80 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 z-10">
        <div>ApexMoto Precision Motorsport Engineering • Telemetry Protocol v4.8</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('mechanic-login')}
            className="text-slate-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            Mechanic Terminal Login
          </button>
          <span>•</span>
          <button
            onClick={() => onNavigate('admin-login')}
            className="text-slate-400 hover:text-purple-300 transition-colors cursor-pointer"
          >
            Admin Workstation Login
          </button>
        </div>
      </footer>
    </div>
  );
};
