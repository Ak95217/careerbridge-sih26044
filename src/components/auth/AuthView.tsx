import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';
import { Button } from '../common/Button';
import { navigateToRoute, parseAppLocation } from '../../lib/appHistory';
import { 
  GraduationCap, 
  Building2, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Mail, 
  ArrowRight, 
  RefreshCw, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Shield,
  Copy,
  Check,
  KeyRound
} from 'lucide-react';

const isValidEmailAddress = (value: string): boolean => {
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.value = value;
  return emailInput.checkValidity();
};

export const AuthView: React.FC = () => {
  const { sendOtp, verifyOtp, resendOtp, isLoading, error: authContextError } = useAuth();
  const { showToast } = useToast();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [otpStep, setOtpStep] = useState<'email' | 'otp'>(() => {
    const route = parseAppLocation();
    return route.kind === 'auth' && route.step === 'otp' ? 'otp' : 'email';
  });
  
  // OTP state (6 individual digits)
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [cooldown, setCooldown] = useState<number>(0);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(5);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [copiedOtp, setCopiedOtp] = useState<boolean>(false);
  const [expiresIn, setExpiresIn] = useState<number>(300); // 5 minutes in seconds
  const [devHint, setDevHint] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<string | null>(null);

  useEffect(() => {
    if (authContextError) {
      setAuthError(authContextError);
    }
  }, [authContextError]);

  useEffect(() => {
    const syncAuthStepFromHash = () => {
      const route = parseAppLocation();
      if (route.kind !== 'auth') return;

      if (route.step === 'otp' && otpStep !== 'otp') {
        setOtpStep('otp');
      }

      if (route.step === 'email' && otpStep !== 'email') {
        setOtpStep('email');
        setOtpError(null);
        setOtpDigits(['', '', '', '', '', '']);
        setDevHint(null);
        setDeliveryMethod(null);
        setCopiedOtp(false);
      }
    };

    window.addEventListener('popstate', syncAuthStepFromHash);
    window.addEventListener('hashchange', syncAuthStepFromHash);
    syncAuthStepFromHash();
    return () => {
      window.removeEventListener('popstate', syncAuthStepFromHash);
      window.removeEventListener('hashchange', syncAuthStepFromHash);
    };
  }, [otpStep]);

  // Cooldown & Expiry countdown timers
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpStep === 'otp' && expiresIn > 0) {
      timer = setInterval(() => {
        setExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [otpStep, expiresIn]);

  const roleOptions: { role: UserRole; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      role: 'student',
      title: 'Student',
      desc: 'Skill mapping, gaps, internships & jobs',
      icon: <GraduationCap className="w-5 h-5 text-indigo-400" />
    },
    {
      role: 'company',
      title: 'Industry / Company',
      desc: 'Post opportunities, match candidates & hire',
      icon: <Building2 className="w-5 h-5 text-purple-400" />
    },
    {
      role: 'faculty',
      title: 'College / Faculty',
      desc: 'Institutional analytics & curriculum mapping',
      icon: <BookOpen className="w-5 h-5 text-emerald-400" />
    },
    {
      role: 'mentor',
      title: 'Mentor',
      desc: 'Guide students, track roadmaps & 1:1 prep',
      icon: <Users className="w-5 h-5 text-amber-400" />
    },
    {
      role: 'admin',
      title: 'Admin',
      desc: 'System governance & national platform stats',
      icon: <ShieldCheck className="w-5 h-5 text-slate-400" />
    }
  ];

  // =========================================================================
  // OTP AUTH HANDLERS
  // =========================================================================
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showToast('error', 'Invalid Email', 'Please provide a valid email address.');
      return;
    }

    if (authMode === 'register' && !fullName.trim()) {
      showToast('error', 'Full Name Required', 'Please enter your full name before continuing.');
      return;
    }

    setIsSendingOtp(true);
    const res = await sendOtp(cleanEmail, selectedRole);
    setIsSendingOtp(false);

    if (res.success) {
      setOtpStep('otp');
      navigateToRoute({ kind: 'auth', step: 'otp' });
      setCooldown(res.cooldownSeconds || 60);
      setExpiresIn(res.expiresInSeconds || 300);
      setAttemptsLeft(5);
      setOtpDigits(['', '', '', '', '', '']);
      setDeliveryMethod(res.deliveryMethod || null);
      if (res.devHint) {
        setDevHint(res.devHint);
      }
      showToast('success', 'OTP Code Generated', res.message || `Verification code prepared for ${cleanEmail}`);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } else {
      setOtpError(res.error || 'Failed to generate OTP code.');
      showToast('error', 'Request Failed', res.error || 'Unable to send OTP.');
      if (res.cooldownSeconds) {
        setCooldown(res.cooldownSeconds);
      }
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    setOtpError(null);
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length <= 1) {
      const newDigits = [...otpDigits];
      newDigits[index] = cleaned;
      setOtpDigits(newDigits);

      // Auto-advance
      if (cleaned && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }

      // If full 6 digits filled, trigger auto-verify
      if (cleaned && index === 5 && newDigits.every(d => d !== '')) {
        handleVerifyOtp(newDigits.join(''));
      }
    } else {
      // Handle paste
      const pasted = cleaned.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      otpInputRefs.current[nextFocus]?.focus();

      if (newDigits.every(d => d !== '')) {
        handleVerifyOtp(newDigits.join(''));
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...otpDigits];
    pastedData.split('').forEach((char, idx) => {
      if (idx < 6) newDigits[idx] = char;
    });
    setOtpDigits(newDigits);

    const focusIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[focusIndex]?.focus();

    if (pastedData.length === 6) {
      handleVerifyOtp(pastedData);
    }
  };

  const handleVerifyOtp = async (codeToVerify?: string) => {
    if (expiresIn <= 0) {
      setOtpError('OTP expired. Please request a new OTP.');
      showToast('error', 'Expired', 'OTP expired. Please request a new OTP.');
      return;
    }

    const fullOtp = codeToVerify || otpDigits.join('');
    if (fullOtp.length !== 6) {
      setOtpError('Please enter all 6 digits of the OTP.');
      return;
    }

    setIsVerifying(true);
    setOtpError(null);

    const res = await verifyOtp(
      email.trim().toLowerCase(),
      fullOtp,
      selectedRole,
      authMode === 'register' ? { fullName } : undefined
    );
    setIsVerifying(false);

    if (res.success) {
      showToast('success', 'Verified Successfully', `Authenticated as ${selectedRole.toUpperCase()}`);
    } else {
      setOtpError(res.error || 'Invalid OTP');
      if (typeof res.attemptsLeft === 'number') {
        setAttemptsLeft(res.attemptsLeft);
      }
      showToast('error', 'Verification Failed', res.error || 'Invalid OTP');
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setOtpError(null);
    setIsSendingOtp(true);
    const res = await resendOtp(email.trim().toLowerCase(), selectedRole);
    setIsSendingOtp(false);

    if (res.success) {
      setCooldown(res.cooldownSeconds || 60);
      setExpiresIn(res.expiresInSeconds || 300);
      setAttemptsLeft(5);
      setOtpDigits(['', '', '', '', '', '']);
      setDeliveryMethod(res.deliveryMethod || null);
      if (res.devHint) {
        setDevHint(res.devHint);
      }
      showToast('success', 'New OTP Code', res.message || 'Fresh 6-digit code prepared.');
      otpInputRefs.current[0]?.focus();
    } else {
      setOtpError(res.error || 'Failed to resend code.');
      showToast('error', 'Resend Failed', res.error || 'Unable to resend OTP.');
    }
  };

  const handleCopyDemoOtp = () => {
    if (devHint) {
      navigator.clipboard.writeText(devHint);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2000);
      showToast('info', 'Copied to Clipboard', `Code: ${devHint}`);
    }
  };

  const handleFillDemoOtp = () => {
    if (devHint) {
      const digits = devHint.split('');
      setOtpDigits(digits);
      handleVerifyOtp(devHint);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(79,70,229,0.12),transparent_50%)] pointer-events-none" />

      {/* Top Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3 shadow-sm backdrop-blur-xs">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Smart India Hackathon 2026 • SIH26044 Gateway
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          CareerBridge
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Unified Academia–Industry Skill & Placement Platform with Secure Email OTP Login
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        {/* Main Authentication Card */}
        <div className="bg-slate-900/95 backdrop-blur-md py-7 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-8 text-white">
          
          {/* EMAIL OTP AUTHENTICATION */}
          <>
              {/* STEP 1: ROLE SELECTION & EMAIL INPUT */}
              {otpStep === 'email' && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-400" />
                      Email OTP Authentication
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Select your role and enter your email address to receive a secure 6-digit OTP code.
                    </p>
                  </div>

                  {/* Role Picker (5 Roles) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      1. Select Stakeholder Role:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {roleOptions.map((item) => {
                        const isSelected = selectedRole === item.role;
                        return (
                          <button
                            key={item.role}
                            id={`otp-role-${item.role}`}
                            type="button"
                            onClick={() => setSelectedRole(item.role)}
                            className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                              isSelected
                                ? 'border-indigo-500 bg-indigo-950/60 ring-2 ring-indigo-500/50 shadow-md'
                                : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/60 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600/30' : 'bg-slate-800'}`}>
                                {item.icon}
                              </div>
                              <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                {item.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 leading-tight line-clamp-1">
                              {item.desc}
                            </span>
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Email Form */}
                  <form onSubmit={handleSendOtp} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        2. Email Address:
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="auth-otp-email-input"
                          type="email"
                          required
                          placeholder={
                            selectedRole === 'student'
                              ? 'name@example.com'
                              : selectedRole === 'company'
                              ? 'recruiter@example.com'
                              : selectedRole === 'faculty'
                              ? 'faculty@example.com'
                              : selectedRole === 'mentor'
                              ? 'mentor@example.com'
                              : 'admin@example.com'
                          }
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                      {authMode === 'register' && (
                        <div className="mt-3">
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Full Name:
                          </label>
                          <input
                            id="auth-registration-name-input"
                            type="text"
                            required
                            placeholder="e.g. Rahul Sharma"
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          />
                        </div>
                      )}
                      <p className="text-[11px] text-slate-400 mt-1">
                        A 6-digit code will be generated for password-less verification.
                      </p>
                    </div>

                    {otpError && (
                      <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{otpError}</span>
                      </div>
                    )}

                    <Button
                      id="btn-send-otp"
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isSendingOtp || isLoading}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 cursor-pointer"
                    >
                      Send 6-Digit OTP
                    </Button>
                  </form>

                  <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
                    <span>{authMode === 'login' ? 'New user?' : 'Already registered?'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode(authMode === 'login' ? 'register' : 'login');
                        setOtpError(null);
                      }}
                      className="font-semibold text-indigo-300 hover:text-white cursor-pointer"
                    >
                      {authMode === 'login' ? 'Create Account' : 'Continue to Login'}
                    </button>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-indigo-400" />
                      SHA-256 Hashed • Rate-Limited
                    </span>
                    <span>OTP Valid: 5 Minutes</span>
                  </div>
                </div>
              )}

              {/* STEP 2: OTP VERIFICATION */}
              {otpStep === 'otp' && (
                <div className="space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">Verify Your Email</h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Enter the 6-digit verification code sent to <span className="font-semibold text-indigo-300">{email}</span> ({selectedRole})
                      </p>
                    </div>
                    <button
                      id="btn-back-change-email"
                      type="button"
                      onClick={() => {
                        setOtpStep('email');
                        navigateToRoute({ kind: 'auth', step: 'email' });
                        setOtpError(null);
                        setOtpDigits(['', '', '', '', '', '']);
                        setDevHint(null);
                        setDeliveryMethod(null);
                        setCopiedOtp(false);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-indigo-300 hover:text-white font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-950/70 border border-indigo-700/60 hover:bg-indigo-900 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Change Email
                    </button>
                  </div>

                  {/* 6 Digit Input Cells */}
                  {devHint && (
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-amber-400/70 text-slate-100 shadow-xl">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          {deliveryMethod === 'smtp' ? 'EMAIL OTP' : 'PROTOTYPE OTP'}
                        </span>
                        <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {deliveryMethod === 'smtp' ? 'Delivered' : 'Testing Code'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-2.5">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Verification Code:</span>
                          <span className="font-mono text-xl font-black text-amber-400 tracking-[0.25em]">{devHint}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handleCopyDemoOtp}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            {copiedOtp ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedOtp ? 'Copied' : 'Copy'}
                          </button>
                          <button
                            type="button"
                            onClick={handleFillDemoOtp}
                            className="px-3 py-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            Fill & Verify
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 text-center sm:text-left">
                      Enter 6-Digit OTP:
                    </label>
                    <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpInputRefs.current[index] = el)}
                          id={`otp-input-digit-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleDigitChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={handlePaste}
                          className={`w-10 h-12 sm:w-12 sm:h-13 text-center text-xl font-extrabold rounded-xl border transition-all outline-none ${
                            digit
                              ? 'border-indigo-500 bg-indigo-950/70 text-white ring-2 ring-indigo-500/50'
                              : 'border-slate-800 bg-slate-950 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Error Message */}
                  {otpError && (
                    <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  {/* Status / Expiry & Attempts Counter */}
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {expiresIn > 0 ? (
                        <span>Expires in <strong className="text-slate-200">{formatTime(expiresIn)}</strong></span>
                      ) : (
                        <span className="text-rose-400 font-bold">OTP expired. Please request a new code.</span>
                      )}
                    </span>
                    <span className={`font-semibold ${attemptsLeft <= 2 ? 'text-rose-400' : 'text-slate-300'}`}>
                      {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} left
                    </span>
                  </div>

                  {/* Verify OTP Button */}
                  <Button
                    id="btn-verify-otp"
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={() => handleVerifyOtp()}
                    isLoading={isVerifying}
                    disabled={otpDigits.some(d => !d) || expiresIn <= 0}
                    rightIcon={<CheckCircle2 className="w-4 h-4" />}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Verify OTP
                  </Button>

                  {/* Resend Action with Cooldown */}
                  <div className="text-center pt-1">
                    {cooldown > 0 ? (
                      <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        Resend code in <span className="font-bold text-slate-200">00:{cooldown < 10 ? `0${cooldown}` : cooldown}</span>
                      </p>
                    ) : (
                      <button
                        id="btn-resend-otp"
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isSendingOtp}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1.5 p-1 rounded-md hover:bg-indigo-950/50 transition-colors cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? 'animate-spin' : ''}`} />
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}
          </>

        </div>
      </div>
    </div>
  );
};


