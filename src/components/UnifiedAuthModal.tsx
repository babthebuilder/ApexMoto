import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Check, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Lock, 
  Key, 
  ArrowRight, 
  Fingerprint, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Phone, 
  Mail, 
  Car, 
  Wrench, 
  User, 
  XCircle,
  RefreshCw,
  Sliders,
  Shield
} from 'lucide-react';
import { ApexAccount, Vehicle, ViewMode } from '../types';
import { APEX_ACCOUNTS } from '../data/mockData';

export interface UnifiedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (account: ApexAccount, tokenOrVin?: string, newVehicle?: Vehicle) => void;
  initialTab?: 'login' | 'register' | 'lookup';
  initialIdentifier?: string;
}

export const UnifiedAuthModal: React.FC<UnifiedAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialTab = 'login',
  initialIdentifier = '',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'lookup'>(initialTab);

  // Sync tab when modal opens or initialTab changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // ==========================================
  // SIGN IN STATE (ID Abstraction)
  // ==========================================
  const [identifier, setIdentifier] = useState(initialIdentifier || 'CUST-101');
  const [password, setPassword] = useState('ApexTrack992!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberStation, setRememberStation] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (initialIdentifier) {
      setIdentifier(initialIdentifier);
    }
  }, [initialIdentifier]);

  // Real-time Sector & Clearance Detection based on entered ID or Email
  const detectedClearance = useMemo(() => {
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
        sub: 'Level 5 Master Clearance • Workshop Invoicing Desk',
        color: 'text-purple-400',
        bg: 'bg-purple-500/15',
        border: 'border-purple-500/30',
        dot: 'bg-purple-400',
        badge: 'Executive Admin',
        icon: ShieldCheck,
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
        sub: 'Master Technician Clearance • Bay 04 Station Terminal',
        color: 'text-blue-400',
        bg: 'bg-blue-500/15',
        border: 'border-blue-500/30',
        dot: 'bg-blue-400',
        badge: 'Workshop Technician',
        icon: Wrench,
      };
    }

    if (
      clean.startsWith('CUST-') || 
      clean.startsWith('CLIENT-') || 
      clean.includes('@') ||
      clean.includes('STERLING') ||
      clean.includes('ALENA') ||
      clean.includes('GUEST')
    ) {
      return {
        role: 'customer' as const,
        label: 'CLIENT TELEMETRY & GARAGE ASSETS',
        sub: 'Authorized Vehicle Owner • Live Bay Telematics',
        color: 'text-orange-400',
        bg: 'bg-orange-500/15',
        border: 'border-orange-500/30',
        dot: 'bg-orange-400',
        badge: 'Client Portal',
        icon: User,
      };
    }

    return {
      role: 'unknown' as const,
      label: 'DYNAMIC IDENTITY RESOLVER',
      sub: 'Clearance will be auto-assigned upon cryptographic verification',
      color: 'text-slate-400',
      bg: 'bg-white/[0.04]',
      border: 'border-white/10',
      dot: 'bg-slate-400',
      badge: 'Unverified ID',
      icon: Key,
    };
  }, [identifier]);

  // Demo Credentials for Instant 1-Click Verification
  const quickIdPresets = [
    {
      id: 'CUST-101',
      role: 'customer',
      name: 'Marcus Sterling',
      pass: 'ApexTrack992!',
      desc: 'Porsche 911 GT3 Client',
      color: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
    },
    {
      id: 'TECH-08',
      role: 'mechanic',
      name: 'Alex Vance',
      pass: 'ApexTechBay04!',
      desc: 'Bay 04 Master Tech',
      color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    },
    {
      id: 'ADM-01',
      role: 'admin',
      name: 'Director Becker',
      pass: 'ApexMasterAdmin2026!',
      desc: 'Executive Workshop Admin',
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    },
  ];

  const handleApplyPreset = (preset: typeof quickIdPresets[0]) => {
    setIdentifier(preset.id);
    setPassword(preset.pass);
    setLoginError(null);
  };

  // Sign In Submission with ID Abstraction
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      setLoginError('Please enter both your Apex Universal ID and Security Key.');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      // 1. Look up exact registered match from APEX_ACCOUNTS
      const matched = APEX_ACCOUNTS.find(
        (acc) =>
          acc.id.toLowerCase() === cleanId ||
          (acc.badgeId && acc.badgeId.toLowerCase().replace('#', '') === cleanId.replace('#', '')) ||
          acc.email.toLowerCase() === cleanId
      );

      if (matched) {
        if (
          matched.pass === cleanPass || 
          matched.pin === cleanPass || 
          cleanPass === 'ApexMaster2026!' ||
          cleanPass === 'ApexTrack992!' ||
          cleanPass === 'ApexTechBay04!' ||
          cleanPass === 'ApexMasterAdmin2026!'
        ) {
          setIsAuthenticating(false);
          onSuccess(matched);
          onClose();
          return;
        } else {
          setIsAuthenticating(false);
          setLoginError('Authentication failed: Invalid security key for this Apex ID.');
          return;
        }
      }

      // 2. Dynamic ID Abstraction for arbitrary entered credentials
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
        onSuccess(dynamicAdmin);
        onClose();
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
        onSuccess(dynamicTech);
        onClose();
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
        onSuccess(dynamicCust);
        onClose();
      }
    }, 500);
  };

  // ==========================================
  // REGISTRATION STATE (Auto-Assigned ID & Validation)
  // ==========================================
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regVehicle, setRegVehicle] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [staffVoucher, setStaffVoucher] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [regSuccessBanner, setRegSuccessBanner] = useState<string | null>(null);
  const [regErrorSummary, setRegErrorSummary] = useState<string | null>(null);

  // Auto-generate assigned Apex ID based on initials and cryptographic salt
  const assignedIdPreview = useMemo(() => {
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
    if (staffVoucher.trim().toUpperCase() === 'TECH-AUTH') {
      return `TECH-${hash}`;
    }
    if (staffVoucher.trim().toUpperCase() === 'ADM-AUTH') {
      return `ADM-${hash}`;
    }
    return `CUST-${hash}-${initials}`;
  }, [regName, staffVoucher]);

  // Robust Validation Rules
  const regErrors = useMemo(() => {
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
      APEX_ACCOUNTS.some(
        (acc) => acc.email.toLowerCase() === regEmail.trim().toLowerCase()
      )
    ) {
      errs.email = 'An account with this email is already registered. Please sign in.';
    }

    // 3. Phone (Optional, but if provided, must be at least 10 digits)
    if (regPhone.trim()) {
      const cleanPhone = regPhone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        errs.phone = 'Phone number must contain at least 10 digits.';
      }
    }

    // 4. Vehicle (Optional, min 3 chars if entered)
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
    if (!termsAccepted) {
      errs.terms = 'You must accept the Terms of Service & Telematics Agreement.';
    }

    return errs;
  }, [regName, regEmail, regPhone, regVehicle, regPassword, regConfirmPassword, termsAccepted]);

  // Password Strength Calculation
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
    if (score === 2) return { score: 2, label: 'Standard', color: 'bg-amber-500', text: 'text-amber-400' };
    if (score === 3) return { score: 3, label: 'High Integrity', color: 'bg-blue-500', text: 'text-blue-400' };
    return { score: 4, label: 'Military Grade', color: 'bg-emerald-500', text: 'text-emerald-400' };
  }, [regPassword, passwordCriteria]);

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Handle Registration Submit with Full Validation
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields touched
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

    const errorCount = Object.keys(regErrors).length;
    if (errorCount > 0) {
      setRegErrorSummary(`Please correct the ${errorCount} highlighted error${errorCount > 1 ? 's' : ''} to proceed.`);
      return;
    }

    setRegErrorSummary(null);
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
      specs: 'Dynamic Telemetry Linked • Cryptographic Handshake OK',
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

    setRegSuccessBanner(`Identity Provisioned! Assigned Apex ID: ${generatedId}`);

    setTimeout(() => {
      setIsRegistering(false);
      onSuccess(newAccount, undefined, customVehicle);
      onClose();
    }, 850);
  };

  // ==========================================
  // LOOKUP BY TOKEN / VIN
  // ==========================================
  const [lookupToken, setLookupToken] = useState('BK-20260928-A1B2');

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupToken.trim()) {
      setLoginError('Please enter a valid Booking Token or VIN.');
      return;
    }

    const guestAccount: ApexAccount = {
      id: `GUEST-${lookupToken.slice(0, 8).toUpperCase()}`,
      role: 'customer',
      name: 'Guest Telemetry Viewer',
      email: 'guest@apexmoto.io',
      tier: 'Live Telemetry Access',
      pass: 'guest',
      defaultVehicleId: lookupToken.toUpperCase().includes('RS6') 
        ? 'veh-rs6' 
        : lookupToken.toUpperCase().includes('M4') 
        ? 'veh-m4' 
        : 'veh-911',
    };

    onSuccess(guestAccount, lookupToken.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      {/* Ambient Radial Lights */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-orange-500/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-600/10 blur-[130px] pointer-events-none"></div>

      <div className="relative w-full max-w-xl rounded-2xl bg-[#131a29]/95 border border-white/10 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] p-5 sm:p-7 overflow-hidden backdrop-blur-2xl my-auto">
        {/* Specular Top Line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent"></div>

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-orange-400 font-bold uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                <span>APEX UNIVERSAL GATEWAY</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {activeTab === 'login' && 'Single Sign-On with Apex ID'}
                {activeTab === 'register' && 'Auto-Assigned ID Registration'}
                {activeTab === 'lookup' && 'Live Telemetry Vehicle Tracker'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-xl border border-white/5 my-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setLoginError(null);
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In (Apex ID)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setLoginError(null);
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Register ID</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('lookup');
              setLoginError(null);
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'lookup'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track RO</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: UNIVERSAL LOGIN (ID Abstraction - No Role Selection Required) */}
        {/* ========================================================================= */}
        {activeTab === 'login' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Dynamic Clearance Detection Card (Abstraction in action) */}
            {detectedClearance && (
              <div
                className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-300 ${detectedClearance.bg} ${detectedClearance.border}`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center ${detectedClearance.color}`}>
                    <detectedClearance.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${detectedClearance.dot} animate-pulse`}></span>
                      <span className={`text-[10px] font-mono font-bold tracking-wider ${detectedClearance.color}`}>
                        {detectedClearance.label}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-medium">
                      {detectedClearance.sub}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-black/40 border border-white/10 text-white">
                  {detectedClearance.badge}
                </span>
              </div>
            )}

            {/* Field: Universal Apex ID or Email */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  Universal Apex ID or Email
                </label>
                <span className="text-[10px] text-orange-400 font-mono">
                  Role resolved automatically
                </span>
              </div>
              <div className="relative">
                <Fingerprint className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. CUST-101, TECH-08, ADM-01 or m.sterling@apex.io"
                  className="w-full h-10 pl-10 pr-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/60 font-mono"
                  required
                />
              </div>
            </div>

            {/* Field: Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  Security Passkey
                </label>
                <button
                  type="button"
                  onClick={() => setPassword('ApexMaster2026!')}
                  className="text-[10px] text-orange-400 hover:underline cursor-pointer font-mono"
                >
                  Master Passkey Demo
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-10 pl-10 pr-10 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/60"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberStation}
                  onChange={(e) => setRememberStation(e.target.checked)}
                  className="rounded accent-orange-500"
                />
                <span className="text-[11px]">Remember authorized workstation</span>
              </label>
              <span className="text-[10px] font-mono text-emerald-400">Zero Trust Role Isolation</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Identity & Resolving Clearance...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Launch Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Presets for Demo / Testing (No need to pick role) */}
            <div className="pt-3 border-t border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>QUICK DEMO ACCOUNTS (ROLE DETERMINED BY ID):</span>
                <span className="text-orange-400">1-Click Fast Fill</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {quickIdPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-orange-500/30 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold font-mono text-white group-hover:text-orange-300">
                        {preset.id}
                      </span>
                      <span className={`text-[8px] font-mono px-1 py-0.5 rounded border ${preset.color} uppercase`}>
                        {preset.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
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

        {/* ========================================================================= */}
        {/* TAB 2: UNIVERSAL REGISTRATION WITH AUTO-ASSIGNED ID & FULL VALIDATION */}
        {/* ========================================================================= */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} noValidate className="space-y-3 max-h-[68vh] overflow-y-auto pr-1">
            {regErrorSummary && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{regErrorSummary}</span>
              </div>
            )}

            {regSuccessBanner && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{regSuccessBanner}</span>
              </div>
            )}

            {/* Auto-Assigned ID Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-orange-500/15 via-[#0b1220] to-orange-500/10 border border-orange-500/30 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-orange-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                  <span>AUTO-ASSIGNED APEX ID</span>
                </div>
                <div className="text-base sm:text-lg font-mono font-extrabold text-white tracking-wider mt-0.5">
                  {assignedIdPreview}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Assigned automatically — no role selection needed
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                <Fingerprint className="w-5 h-5" />
              </div>
            </div>

            {/* Row 1: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Full Name */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-semibold">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  {touched.name && !regErrors.name && (
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
                    className={`w-full h-9 px-3 rounded-lg bg-black/40 border text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                      touched.name && regErrors.name
                        ? 'border-rose-500/60 bg-rose-500/5'
                        : touched.name && !regErrors.name
                        ? 'border-emerald-500/50 bg-emerald-500/5'
                        : 'border-white/10 focus:border-orange-500/60'
                    }`}
                  />
                  {touched.name && regErrors.name && (
                    <AlertCircle className="w-4 h-4 text-rose-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  )}
                </div>
                {touched.name && regErrors.name && (
                  <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.name}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-semibold">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  {touched.email && !regErrors.email && (
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
                    className={`w-full h-9 px-3 rounded-lg bg-black/40 border text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                      touched.email && regErrors.email
                        ? 'border-rose-500/60 bg-rose-500/5'
                        : touched.email && !regErrors.email
                        ? 'border-emerald-500/50 bg-emerald-500/5'
                        : 'border-white/10 focus:border-orange-500/60'
                    }`}
                  />
                  {touched.email && regErrors.email && (
                    <AlertCircle className="w-4 h-4 text-rose-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  )}
                </div>
                {touched.email && regErrors.email && (
                  <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.email}</p>
                )}
              </div>
            </div>

            {/* Row 2: Phone & Sports Vehicle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Phone */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-semibold">
                    Mobile Phone <span className="text-slate-500 text-[9px]">(Optional)</span>
                  </label>
                  {touched.phone && regPhone.trim() && !regErrors.phone && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Valid
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    onBlur={() => markTouched('phone')}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full h-9 pl-9 pr-3 rounded-lg bg-black/40 border text-xs text-white placeholder:text-slate-600 focus:outline-none ${
                      touched.phone && regErrors.phone
                        ? 'border-rose-500/60 bg-rose-500/5'
                        : 'border-white/10 focus:border-orange-500/60'
                    }`}
                  />
                </div>
                {touched.phone && regErrors.phone && (
                  <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.phone}</p>
                )}
              </div>

              {/* Sports Vehicle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-semibold">
                    Primary Sports Vehicle <span className="text-slate-500 text-[9px]">(Optional)</span>
                  </label>
                  {touched.vehicle && regVehicle.trim() && !regErrors.vehicle && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Added
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Car className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={regVehicle}
                    onChange={(e) => setRegVehicle(e.target.value)}
                    onBlur={() => markTouched('vehicle')}
                    placeholder="e.g. Porsche 911 GT3"
                    className="w-full h-9 pl-9 pr-3 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/60"
                  />
                </div>
                {touched.vehicle && regErrors.vehicle && (
                  <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.vehicle}</p>
                )}
              </div>
            </div>

            {/* Row 3: Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Passkey */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-semibold">
                    Security Passkey <span className="text-rose-400">*</span>
                  </label>
                  {touched.password && !regErrors.password && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
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
                    placeholder="Create a passkey"
                    className={`w-full h-9 px-3 pr-8 rounded-lg bg-black/40 border text-xs text-white placeholder:text-slate-600 focus:outline-none ${
                      touched.password && regErrors.password
                        ? 'border-rose-500/60 bg-rose-500/5'
                        : 'border-white/10 focus:border-orange-500/60'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {touched.password && regErrors.password && (
                  <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.password}</p>
                )}
              </div>

              {/* Confirm Passkey */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-semibold">
                    Confirm Passkey <span className="text-rose-400">*</span>
                  </label>
                  {touched.confirmPassword && !regErrors.confirmPassword && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
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
                    placeholder="Re-type passkey"
                    className={`w-full h-9 px-3 pr-8 rounded-lg bg-black/40 border text-xs text-white placeholder:text-slate-600 focus:outline-none ${
                      touched.confirmPassword && regErrors.confirmPassword
                        ? 'border-rose-500/60 bg-rose-500/5'
                        : 'border-white/10 focus:border-orange-500/60'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
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
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 uppercase tracking-wider font-mono">
                    Passkey Security Integrity:
                  </span>
                  <span className={`font-semibold ${passwordStrength.text}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1 w-full">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`rounded-full transition-all duration-300 ${
                        passwordStrength.score >= step ? passwordStrength.color : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[9px] font-mono text-slate-400 pt-1 border-t border-white/5">
                  <span className={passwordCriteria.minLength ? 'text-emerald-400' : 'text-slate-500'}>
                    ✓ 8+ chars
                  </span>
                  <span className={passwordCriteria.hasCase ? 'text-emerald-400' : 'text-slate-500'}>
                    ✓ Upper & Lower
                  </span>
                  <span className={passwordCriteria.hasNumber ? 'text-emerald-400' : 'text-slate-500'}>
                    ✓ Number (0-9)
                  </span>
                  <span className={passwordCriteria.hasSpecial ? 'text-emerald-400' : 'text-slate-500'}>
                    ✓ Symbol (!@#)
                  </span>
                </div>
              </div>
            )}

            {/* Staff Voucher Key (Optional Abstraction) */}
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Internal Staff Clearance Key (Optional):</span>
                <span className="text-slate-500">e.g. TECH-AUTH or ADM-AUTH</span>
              </div>
              <input
                type="text"
                value={staffVoucher}
                onChange={(e) => setStaffVoucher(e.target.value)}
                placeholder="Leave blank for Customer ID, or enter TECH-AUTH / ADM-AUTH"
                className="w-full h-8 px-2.5 rounded bg-black/40 border border-white/10 font-mono text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50 uppercase"
              />
            </div>

            {/* Terms checkbox */}
            <div>
              <label className="flex items-start gap-2 pt-0.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    markTouched('terms');
                  }}
                  className="mt-0.5 rounded accent-orange-500"
                />
                <span className="text-[11px] text-slate-400 leading-snug">
                  I agree to the <span className="text-orange-400 underline">Terms of Service</span> & accept cryptographic Apex ID assignment.
                </span>
              </label>
              {touched.terms && regErrors.terms && (
                <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isRegistering}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-1"
            >
              {isRegistering ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Provisioning Apex Identity ID {assignedIdPreview}...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Provision Apex ID & Enter Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: TRACK RO / TOKEN */}
        {/* ========================================================================= */}
        {activeTab === 'lookup' && (
          <form onSubmit={handleLookupSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <Search className="w-4 h-4" />
                <span>Zero-Credential Guest Vehicle Tracking</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Enter your booking token or vehicle VIN to view real-time workshop telematics, live bay cam, and dyno bench status without creating an account.
              </p>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 block mb-1">
                Booking Token or VIN
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={lookupToken}
                  onChange={(e) => setLookupToken(e.target.value)}
                  placeholder="e.g. BK-20260928-A1B2 or WP0AB2A99..."
                  className="w-full h-10 pl-10 pr-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-orange-500/60"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400">Sample Active Vehicle Tokens:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Porsche 911 GT3 RS', token: 'BK-20260928-A1B2' },
                  { label: 'Audi RS6 Avant', token: 'BK-20260925-B4C8' },
                  { label: 'BMW M4 Competition', token: 'BK-20260922-D9E3' },
                ].map((item) => (
                  <button
                    key={item.token}
                    type="button"
                    onClick={() => setLookupToken(item.token)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-mono text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Key className="w-3 h-3 text-orange-400" />
                    <span>{item.token}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Track Live Vehicle Telemetry</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
