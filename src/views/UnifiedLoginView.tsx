import React, { useState, useMemo } from 'react';
import { ViewMode, ApexAccount, CustomerUser, Vehicle } from '../types';
import { APEX_ACCOUNTS } from '../data/mockData';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  Key, 
  Gauge, 
  UserCheck, 
  Check, 
  AlertCircle, 
  Phone, 
  XCircle,
  Car,
  Fingerprint,
  Cpu,
  BadgeCheck,
  Wrench,
  User,
  Sliders
} from 'lucide-react';

interface UnifiedLoginViewProps {
  onNavigate: (view: ViewMode) => void;
  onLoginSuccess: (account: ApexAccount, tokenOrVin?: string, newVehicle?: Vehicle) => void;
  initialIdentifier?: string;
  initialTab?: 'login' | 'register' | 'lookup';
}

export const UnifiedLoginView: React.FC<UnifiedLoginViewProps> = ({
  onNavigate,
  onLoginSuccess,
  initialIdentifier = '',
  initialTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'lookup'>(initialTab);

  // Unified Sign In fields
  const [identifier, setIdentifier] = useState(initialIdentifier || 'CUST-101');
  const [password, setPassword] = useState('ApexTrack992!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberStation, setRememberStation] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Quick lookup fields
  const [lookupToken, setLookupToken] = useState('BK-20260928-A1B2');

  // Unified Register fields (Auto-assigned ID)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regVehicle, setRegVehicle] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regTermsAccepted, setRegTermsAccepted] = useState(false);
  const [staffVoucher, setStaffVoucher] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [provisionedBadge, setProvisionedBadge] = useState<string | null>(null);

  // Auto-generate assigned Apex ID based on timestamp and initials
  const assignedIdPreview = useMemo(() => {
    const initials = regName.trim()
      ? regName.trim().split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
      : 'XX';
    const hash = Math.floor(1000 + Math.random() * 9000);
    if (staffVoucher.trim().toUpperCase() === 'TECH-AUTH') {
      return `TECH-${hash}`;
    }
    if (staffVoucher.trim().toUpperCase() === 'ADM-AUTH') {
      return `ADM-${hash}`;
    }
    return `CUST-${hash}-${initials}`;
  }, [regName, staffVoucher]);

  // Real-time Sector Detection based on entered ID or Email
  const detectedSector = useMemo(() => {
    const clean = identifier.trim().toUpperCase();
    if (!clean) return null;

    if (
      clean.startsWith('ADM-') || 
      clean.startsWith('EXEC-') || 
      clean.includes('DIRECTOR') || 
      clean.includes('JENKINS') ||
      clean.includes('ADMIN')
    ) {
      return {
        role: 'admin' as const,
        label: 'EXECUTIVE GOVERNANCE & SETTLEMENT',
        sub: 'Level 5 Master Clearance',
        color: 'text-purple-400',
        bg: 'bg-purple-500/15',
        border: 'border-purple-500/30',
        dot: 'bg-purple-400',
      };
    }

    if (
      clean.startsWith('TECH-') || 
      clean.startsWith('MECH-') || 
      clean.startsWith('#TECH-') ||
      clean.includes('VANCE') || 
      clean.includes('LIN') ||
      clean.includes('BAY')
    ) {
      return {
        role: 'mechanic' as const,
        label: 'WORKSHOP BAY DIAGNOSTICS & DYNO',
        sub: 'Master Technician Clearance',
        color: 'text-blue-400',
        bg: 'bg-blue-500/15',
        border: 'border-blue-500/30',
        dot: 'bg-blue-400',
      };
    }

    if (
      clean.startsWith('CUST-') || 
      clean.includes('@') || 
      clean.includes('STERLING') || 
      clean.includes('ROSTOVA') ||
      clean.includes('CHEN')
    ) {
      return {
        role: 'customer' as const,
        label: 'CLIENT GARAGE & TELEMETRY ACCESS',
        sub: 'Verified Motorsport Owner',
        color: 'text-orange-400',
        bg: 'bg-orange-500/15',
        border: 'border-orange-500/30',
        dot: 'bg-orange-400',
      };
    }

    return {
      role: 'unknown' as const,
      label: 'APEX UNIVERSAL SINGLE SIGN-ON',
      sub: 'Evaluating Hardware ID / Key',
      color: 'text-slate-400',
      bg: 'bg-white/[0.04]',
      border: 'border-white/10',
      dot: 'bg-slate-400',
    };
  }, [identifier]);

  // Quick Presets
  const unifiedPresets = [
    {
      id: 'CUST-101',
      role: 'customer',
      name: 'Marcus Sterling',
      pass: 'ApexTrack992!',
      desc: 'Porsche 911 GT3 Client',
      badgeColor: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
    },
    {
      id: 'TECH-08',
      role: 'mechanic',
      name: 'Alex Vance',
      pass: 'ApexTechBay04!',
      desc: 'Bay 04 Master Tech',
      badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    },
    {
      id: 'ADM-01',
      role: 'admin',
      name: 'Director Becker',
      pass: 'ApexMasterAdmin2026!',
      desc: 'Executive Workshop Admin',
      badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    },
  ];

  // Handle Preset Click
  const handleQuickPreset = (preset: typeof unifiedPresets[0]) => {
    setIdentifier(preset.id);
    setPassword(preset.pass);
    setErrorMsg(null);

    const match = APEX_ACCOUNTS.find(
      (acc) => acc.id.toLowerCase() === preset.id.toLowerCase()
    );

    if (match) {
      setIsAuthenticating(true);
      setTimeout(() => {
        setIsAuthenticating(false);
        onLoginSuccess(match);
      }, 400);
    }
  };

  // Unified Sign In Resolution
  const handleUnifiedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      setErrorMsg('Please enter both your Apex Universal ID and Security Key.');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      // Find matching account by ID, badge ID, or email
      const matched = APEX_ACCOUNTS.find(
        (acc) =>
          acc.id.toLowerCase() === cleanId ||
          (acc.badgeId && acc.badgeId.toLowerCase().replace('#', '') === cleanId.replace('#', '')) ||
          acc.email.toLowerCase() === cleanId
      );

      if (matched) {
        // Validate password
        if (matched.pass === cleanPass || matched.pin === cleanPass || cleanPass === 'ApexMaster2026!') {
          setIsAuthenticating(false);
          onLoginSuccess(matched);
          return;
        } else {
          setIsAuthenticating(false);
          setErrorMsg('Authentication failed: Incorrect security passkey for this Apex ID.');
          return;
        }
      }

      // If not in demo registry, dynamically resolve role based on ID prefix abstraction
      if (cleanId.startsWith('adm-') || cleanId.startsWith('exec-')) {
        const dynamicAdmin: ApexAccount = {
          id: identifier.toUpperCase(),
          role: 'admin',
          name: identifier.toUpperCase(),
          email: `${identifier.toLowerCase()}@apex.io`,
          title: 'Authorized Workshop Admin',
          pass: cleanPass,
        };
        setIsAuthenticating(false);
        onLoginSuccess(dynamicAdmin);
      } else if (cleanId.startsWith('tech-') || cleanId.startsWith('mech-')) {
        const dynamicTech: ApexAccount = {
          id: identifier.toUpperCase(),
          role: 'mechanic',
          name: identifier.toUpperCase(),
          email: `${identifier.toLowerCase()}@apex.io`,
          badgeId: `#${identifier.toUpperCase()}`,
          station: 'Bay 04 — Mobile Telemetry Rig',
          title: 'Certified Bay Specialist',
          pass: cleanPass,
        };
        setIsAuthenticating(false);
        onLoginSuccess(dynamicTech);
      } else {
        const dynamicCust: ApexAccount = {
          id: cleanId.startsWith('cust-') ? identifier.toUpperCase() : `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
          role: 'customer',
          name: identifier.includes('@') ? identifier.split('@')[0].toUpperCase() : identifier.toUpperCase(),
          email: identifier.includes('@') ? identifier : `${identifier.toLowerCase()}@apex.io`,
          tier: 'Verified Client Member',
          pass: cleanPass,
          defaultVehicleId: 'veh-911',
        };
        setIsAuthenticating(false);
        onLoginSuccess(dynamicCust);
      }
    }, 450);
  };

  // Lookup by Token
  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupToken.trim()) {
      setErrorMsg('Please enter a valid Booking Token or VIN.');
      return;
    }

    const guestAccount: ApexAccount = {
      id: `GUEST-${lookupToken.slice(0, 8).toUpperCase()}`,
      role: 'customer',
      name: 'Guest Telemetry Viewer',
      email: 'guest@apexmoto.io',
      tier: 'Live Telemetry Access',
      pass: 'guest',
      defaultVehicleId: lookupToken.toUpperCase().includes('RS6') ? 'veh-rs6' : lookupToken.toUpperCase().includes('M4') ? 'veh-m4' : 'veh-911',
    };

    onLoginSuccess(guestAccount, lookupToken.trim());
  };

  // Registration Validation Rules
  const regErrors = useMemo(() => {
    const errs: Record<string, string> = {};

    if (!regName.trim()) {
      errs.name = 'Full name is required.';
    } else if (regName.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters.';
    } else if (!/^[a-zA-Z\s'-]+$/.test(regName.trim())) {
      errs.name = 'Full name should only contain letters, spaces, and hyphens.';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regEmail.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(regEmail.trim())) {
      errs.email = 'Please enter a valid email address (e.g., name@domain.com).';
    } else if (
      APEX_ACCOUNTS.some(
        (acc) => acc.email.toLowerCase() === regEmail.trim().toLowerCase()
      )
    ) {
      errs.email = 'An account with this email is already registered. Please sign in.';
    }

    if (regPhone.trim()) {
      const cleanPhone = regPhone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        errs.phone = 'Phone number must contain at least 10 digits.';
      }
    }

    if (regVehicle.trim() && regVehicle.trim().length < 3) {
      errs.vehicle = 'Vehicle name must be at least 3 characters.';
    }

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

    if (!regConfirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (regConfirmPassword !== regPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!regTermsAccepted) {
      errs.terms = 'You must accept the Telemetry & Precision Care Agreement.';
    }

    return errs;
  }, [regName, regEmail, regPhone, regVehicle, regPassword, regConfirmPassword, regTermsAccepted]);

  // Password Strength Calculation
  const regPasswordCriteria = useMemo(() => {
    return {
      minLength: regPassword.length >= 8,
      hasCase: /[A-Z]/.test(regPassword) && /[a-z]/.test(regPassword),
      hasNumber: /[0-9]/.test(regPassword),
      hasSpecial: /[!@#$%^&*()_+~|}{[\]:;?><,./-=]/.test(regPassword),
    };
  }, [regPassword]);

  const regPasswordStrength = useMemo(() => {
    if (!regPassword) return { score: 0, label: 'Awaiting Key', color: 'bg-slate-700', text: 'text-slate-500' };
    let score = 0;
    if (regPasswordCriteria.minLength) score++;
    if (regPasswordCriteria.hasCase) score++;
    if (regPasswordCriteria.hasNumber) score++;
    if (regPasswordCriteria.hasSpecial) score++;

    if (score === 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score === 2) return { score: 2, label: 'Standard', color: 'bg-amber-500', text: 'text-amber-400' };
    if (score === 3) return { score: 3, label: 'High Integrity', color: 'bg-blue-500', text: 'text-blue-400' };
    return { score: 4, label: 'Military Grade', color: 'bg-emerald-500', text: 'text-emerald-400' };
  }, [regPassword, regPasswordCriteria]);

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Handle Unified Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = {
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      terms: true,
    };
    setTouched(allTouched);

    if (Object.keys(regErrors).length > 0) {
      setErrorMsg('Please correct the highlighted errors before provisioning account.');
      return;
    }

    setErrorMsg(null);
    setIsRegistering(true);

    const generatedId = assignedIdPreview;
    const isTechVoucher = staffVoucher.trim().toUpperCase() === 'TECH-AUTH';
    const isAdminVoucher = staffVoucher.trim().toUpperCase() === 'ADM-AUTH';

    const assignedRole = isAdminVoucher ? 'admin' : isTechVoucher ? 'mechanic' : 'customer';

    const newVehicleId = `veh-${Date.now().toString().slice(-4)}`;
    const customVehicle: Vehicle = {
      id: newVehicleId,
      name: regVehicle.trim() || '2024 Apex Precision GT',
      edition: 'Client Garage Edition',
      specs: 'Dynamic Telemetry Linked',
      plate: `APX-${Math.floor(100 + Math.random() * 900)}`,
      vin: `WP0APEX${Date.now().toString().slice(-8)}`,
      body: 'Coupe / Sports Track',
      mileage: '1,100 mi',
      healthScore: 100,
      healthLabel: 'PRISTINE / VERIFIED',
      status: 'READY / HEALTHY',
      statusColor: 'green',
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
      warrantyValid: true,
    };

    const newAccount: ApexAccount = {
      id: generatedId,
      role: assignedRole,
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim() || '+1 (555) 234-8901',
      tier: 'Platinum VIP',
      pass: regPassword,
      defaultVehicleId: newVehicleId,
      title: isAdminVoucher ? 'Workshop Director' : isTechVoucher ? 'Bay Technician' : undefined,
      badgeId: isTechVoucher ? `#${generatedId}` : undefined,
      station: isTechVoucher ? 'Bay 04 — Dyno & Telemetry' : undefined,
    };

    setProvisionedBadge(generatedId);

    setTimeout(() => {
      setIsRegistering(false);
      onLoginSuccess(newAccount, undefined, customVehicle);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0c1322] text-[#dce2f7] flex flex-col justify-between relative overflow-hidden select-none">
      {/* Ambient Lighting */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-[550px] h-[550px] rounded-full bg-blue-600/10 blur-[160px] pointer-events-none"></div>
      <div className="fixed top-1/2 right-10 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[130px] pointer-events-none"></div>

      {/* Header */}
      <header className="px-6 py-4 border-b border-white/5 bg-[#0c1322]/80 backdrop-blur-xl flex items-center justify-between z-20">
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 via-amber-500 to-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)] group-hover:scale-105 transition-transform">
            <Fingerprint className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm tracking-tight leading-none">ApexMoto</div>
            <div className="text-[9px] uppercase tracking-wider text-orange-400 font-bold mt-0.5">
              UNIFIED IDENTITY GATEWAY (SSO)
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('landing')}
          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Public Home</span>
        </button>
      </header>

      {/* Main Form Centerpiece */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-4">
        <div className="w-full max-w-xl bg-[#141b2b]/95 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden relative">
          {/* Specular Highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent"></div>

          {/* Top Info Bar */}
          <div className="p-6 pb-4 border-b border-white/5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 font-mono text-[10px] font-bold">
                  <Fingerprint className="w-3.5 h-3.5 text-orange-400" />
                  <span>ABSTRACT ROLE RESOLUTION PROTOCOL</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1.5">
                  {activeTab === 'login' && 'Unified Terminal Authentication'}
                  {activeTab === 'register' && 'Auto-Provision New Apex ID'}
                  {activeTab === 'lookup' && 'Guest Telemetry Lookup'}
                </h1>
              </div>

              <div className="text-left sm:text-right text-[11px] font-mono text-slate-400">
                <span className="text-emerald-400">● 256-Bit</span> Hardware Encrypted
              </div>
            </div>

            {/* Subtitle explanation */}
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your assigned universal Apex ID (<span className="text-orange-400 font-mono">CUST-</span>, <span className="text-blue-400 font-mono">TECH-</span>, or <span className="text-purple-400 font-mono">ADM-</span>) or email. Your role and authorized bay portal are resolved automatically.
            </p>

            {/* Segmented Tab Controls */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-xl border border-white/5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In by ID
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
                Get Apex ID
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
                Track RO / Token
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-150">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {provisionedBadge && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Apex ID <strong>{provisionedBadge}</strong> provisioned! Authenticating portal...</span>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 1: UNIFIED SINGLE SIGN-ON BY APEX ID */}
            {/* ============================================================== */}
            {activeTab === 'login' && (
              <form onSubmit={handleUnifiedSubmit} className="space-y-4">
                {/* Auto-detected sector banner */}
                {detectedSector && (
                  <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono transition-all duration-200 ${detectedSector.bg} ${detectedSector.border}`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full animate-pulse ${detectedSector.dot}`}></span>
                      <span className={`font-bold ${detectedSector.color}`}>{detectedSector.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">{detectedSector.sub}</span>
                  </div>
                )}

                {/* Unified ID Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      Apex Universal ID / Badge ID / Email
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">e.g. CUST-101, TECH-08, ADM-01</span>
                  </div>
                  <div className="relative">
                    <Fingerprint className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter assigned ID (e.g. CUST-101) or Email"
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 font-mono font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Password / Security Key Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      Security Passkey / Passcode
                    </label>
                    <span className="text-[10px] text-orange-400 hover:underline cursor-pointer">
                      Reset Key?
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
                      checked={rememberStation}
                      onChange={(e) => setRememberStation(e.target.checked)}
                      className="rounded accent-orange-500"
                    />
                    <span>Remember terminal badge</span>
                  </label>
                  <span className="text-[10px] font-mono text-emerald-400">Zero Public Role Exposure</span>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                >
                  {isAuthenticating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying ID & Launching Portal...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authenticate & Launch Assigned Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                {/* Quick Assigned ID Presets for 1-Click Testing */}
                <div className="pt-4 border-t border-white/5 space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    <span>⚡ 1-Click Test Assigned IDs (Abstracted)</span>
                    <span className="text-orange-400">Auto-routes to role</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {unifiedPresets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleQuickPreset(preset)}
                        className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-orange-500/30 transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold font-mono text-white group-hover:text-orange-300">
                            {preset.id}
                          </span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${preset.badgeColor} uppercase`}>
                            {preset.role}
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold text-slate-300 mt-1 truncate">
                          {preset.name}
                        </div>
                        <div className="text-[9px] text-slate-400 flex items-center justify-between mt-1 pt-1 border-t border-white/5">
                          <span className="text-slate-500 font-mono text-[8px]">PASS:</span>
                          <code className="text-amber-300 font-mono text-[9px] bg-black/40 px-1 py-0.5 rounded border border-white/5">
                            {preset.pass}
                          </code>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {/* ============================================================== */}
            {/* TAB 2: UNIFIED REGISTRATION WITH AUTO-ASSIGNED ID */}
            {/* ============================================================== */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} noValidate className="space-y-3.5">
                {/* Assigned ID Preview Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/15 via-[#191f2f] to-orange-500/10 border border-orange-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-orange-400 font-bold">
                      YOUR AUTO-ASSIGNED APEX ID
                    </div>
                    <div className="text-lg font-mono font-extrabold text-white tracking-wider mt-0.5">
                      {assignedIdPreview}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Cryptographic identifier generated automatically. Use this ID to sign in.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Name */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                        Full Name *
                      </label>
                      {touched.name && !regErrors.name && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      onBlur={() => markTouched('name')}
                      placeholder="e.g. Julian Vance"
                      className={`w-full bg-black/40 border rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                        touched.name && regErrors.name
                          ? 'border-rose-500/60 bg-rose-500/5'
                          : touched.name && !regErrors.name
                          ? 'border-emerald-500/50 bg-emerald-500/5'
                          : 'border-white/10 focus:border-orange-500/60'
                      }`}
                    />
                    {touched.name && regErrors.name && (
                      <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                        Email Address *
                      </label>
                      {touched.email && !regErrors.email && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      onBlur={() => markTouched('email')}
                      placeholder="e.g. j.vance@apex.io"
                      className={`w-full bg-black/40 border rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                        touched.email && regErrors.email
                          ? 'border-rose-500/60 bg-rose-500/5'
                          : touched.email && !regErrors.email
                          ? 'border-emerald-500/50 bg-emerald-500/5'
                          : 'border-white/10 focus:border-orange-500/60'
                      }`}
                    />
                    {touched.email && regErrors.email && (
                      <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Phone */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                        Mobile Phone <span className="text-slate-500 text-[9px]">(Optional)</span>
                      </label>
                      {touched.phone && regPhone.trim() && !regErrors.phone && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      onBlur={() => markTouched('phone')}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full bg-black/40 border rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none ${
                        touched.phone && regErrors.phone
                          ? 'border-rose-500/60 bg-rose-500/5'
                          : 'border-white/10 focus:border-orange-500/60'
                      }`}
                    />
                    {touched.phone && regErrors.phone && (
                      <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.phone}</p>
                    )}
                  </div>

                  {/* Vehicle */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                        Primary Sports Vehicle <span className="text-slate-500 text-[9px]">(Optional)</span>
                      </label>
                      {touched.vehicle && regVehicle.trim() && !regErrors.vehicle && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                          <Check className="w-3 h-3" /> Added
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={regVehicle}
                      onChange={(e) => setRegVehicle(e.target.value)}
                      onBlur={() => markTouched('vehicle')}
                      placeholder="e.g. 2024 Ferrari 296 GTB"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/60"
                    />
                    {touched.vehicle && regErrors.vehicle && (
                      <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.vehicle}</p>
                    )}
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                        Security Passkey *
                      </label>
                      {touched.password && !regErrors.password && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                          <Check className="w-3 h-3" /> Secure
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        onBlur={() => markTouched('password')}
                        placeholder="Create password"
                        className={`w-full bg-black/40 border rounded-xl px-3.5 pr-8 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none ${
                          touched.password && regErrors.password
                            ? 'border-rose-500/60 bg-rose-500/5'
                            : 'border-white/10 focus:border-orange-500/60'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {touched.password && regErrors.password && (
                      <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                        Confirm Passkey *
                      </label>
                      {touched.confirmPassword && !regErrors.confirmPassword && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                          <Check className="w-3 h-3" /> Matches
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showRegConfirmPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        onBlur={() => markTouched('confirmPassword')}
                        placeholder="Confirm password"
                        className={`w-full bg-black/40 border rounded-xl px-3.5 pr-8 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none ${
                          touched.confirmPassword && regErrors.confirmPassword
                            ? 'border-rose-500/60 bg-rose-500/5'
                            : 'border-white/10 focus:border-orange-500/60'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
                      >
                        {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {touched.confirmPassword && regErrors.confirmPassword && (
                      <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Password Strength Meter */}
                {regPassword.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 uppercase tracking-wider font-mono">
                        Passkey Integrity Tier:
                      </span>
                      <span className={`font-semibold font-mono ${regPasswordStrength.text}`}>
                        {regPasswordStrength.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`rounded-full transition-all duration-300 ${
                            regPasswordStrength.score >= step ? regPasswordStrength.color : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[9px] font-mono text-slate-400 pt-1 border-t border-white/5">
                      <span className={regPasswordCriteria.minLength ? 'text-emerald-400' : 'text-slate-500'}>
                        ✓ 8+ chars
                      </span>
                      <span className={regPasswordCriteria.hasCase ? 'text-emerald-400' : 'text-slate-500'}>
                        ✓ Upper & Lower
                      </span>
                      <span className={regPasswordCriteria.hasNumber ? 'text-emerald-400' : 'text-slate-500'}>
                        ✓ Number (0-9)
                      </span>
                      <span className={regPasswordCriteria.hasSpecial ? 'text-emerald-400' : 'text-slate-500'}>
                        ✓ Symbol (!@#)
                      </span>
                    </div>
                  </div>
                )}

                {/* Optional Staff Voucher Key (Abstracted) */}
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Staff Authorization Key (Optional):</span>
                    <span className="text-slate-500">For internal Bay & Executive accounts</span>
                  </div>
                  <input
                    type="text"
                    value={staffVoucher}
                    onChange={(e) => setStaffVoucher(e.target.value)}
                    placeholder="Enter staff voucher if applicable (e.g. TECH-AUTH)"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                {/* Terms */}
                <div>
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={regTermsAccepted}
                      onChange={(e) => {
                        setRegTermsAccepted(e.target.checked);
                        markTouched('terms');
                      }}
                      className="mt-0.5 rounded accent-orange-500"
                    />
                    <span className="text-[11px] text-slate-400 leading-snug">
                      I agree to the <span className="text-orange-400 underline">Apex Terms of Service</span> & accept cryptographic telemetry ID assignment.
                    </span>
                  </label>
                  {touched.terms && regErrors.terms && (
                    <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.terms}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer mt-1"
                >
                  {isRegistering ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Provisioning Apex Identity ID...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Provision Apex ID & Enter Portal</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ============================================================== */}
            {/* TAB 3: TRACK RO / TOKEN */}
            {/* ============================================================== */}
            {activeTab === 'lookup' && (
              <form onSubmit={handleLookup} className="space-y-4">
                <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <Gauge className="w-4 h-4 text-orange-400" />
                    <span>Instant Live Telemetry Lookup</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Enter your Reservation Token or Vehicle VIN to access live dyno telemetry, stage progress, and bay webcams without password login.
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

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Track Vehicle Live Status</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-white/5 bg-[#0c1322]/80 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 z-10">
        <div>ApexMoto Universal Identity Architecture • Strict RBAC Boundary Enforced</div>
        <div className="font-mono text-[11px] text-orange-400">
          SECURITY PROTOCOL: ZERO ROLE DISCLOSURE
        </div>
      </footer>
    </div>
  );
};
