import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, StudentProfile } from '../types';
import { StorageService, AuthSession } from '../services/storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface SignupData {
  email: string;
  password?: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  // Role specific fields
  collegeName?: string;
  degree?: string;
  branch?: string;
  graduationYear?: number;
  companyName?: string;
  industry?: string;
  institutionName?: string;
  department?: string;
  designation?: string;
  organization?: string;
  title?: string;
}

export interface SendOtpResult {
  success: boolean;
  message?: string;
  error?: string;
  cooldownSeconds?: number;
  expiresInSeconds?: number;
  devHint?: string;
  deliveryMethod?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  message?: string;
  error?: string;
  attemptsLeft?: number;
  isNewUser?: boolean;
  role?: UserRole;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sendOtp: (email: string, role?: UserRole) => Promise<SendOtpResult>;
  verifyOtp: (email: string, otp: string, role?: UserRole) => Promise<VerifyOtpResult>;
  resendOtp: (email: string, role?: UserRole) => Promise<SendOtpResult>;
  loginWithDemo: (role: UserRole) => Promise<boolean>;
  login: (email: string, password?: string, intendedRole?: UserRole) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  resetDemoState: () => void;
  isLiveSupabase: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Load user profile from Supabase profiles table
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              let fullProfile: UserProfile = { ...profile, role: profile.role as UserRole };
              if (profile.role === 'student') {
                const { data: studentData } = await supabase.from('students').select('*').eq('id', session.user.id).single();
                fullProfile = { ...fullProfile, ...(studentData || {}), role: 'student' };
              } else if (profile.role === 'company') {
                const { data: companyData } = await supabase.from('companies').select('*').eq('id', session.user.id).single();
                fullProfile = { ...fullProfile, ...(companyData || {}), role: 'company' };
              }
              setUser(fullProfile);
              StorageService.setCurrentUser(fullProfile);
              setIsLoading(false);
              return;
            }
          }
        }

        // Check local session & user
        const authSession = StorageService.getAuthSession();
        const cachedUser = StorageService.getCurrentUser();

        if (authSession && cachedUser) {
          setUser(cachedUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed initializing auth session:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 1. Send OTP to Email (Backend with client fallback)
  const sendOtp = async (email: string, intendedRole: UserRole = 'student'): Promise<SendOtpResult> => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // Production / Backend OTP Dispatch
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, role: intendedRole })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return {
            success: true,
            message: data.message,
            expiresInSeconds: data.expiresInSeconds || 300,
            cooldownSeconds: data.cooldownSeconds || 60,
            deliveryMethod: data.deliveryMethod,
            devHint: data.devHint
          };
        } else {
          const errorMsg = data.error || 'Failed to dispatch verification code.';
          setError(errorMsg);
          return { success: false, error: errorMsg, cooldownSeconds: data.cooldownRemaining };
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        const errorMsg = errData.error || 'Failed to send OTP.';
        setError(errorMsg);
        return { success: false, error: errorMsg, cooldownSeconds: errData.cooldownRemaining };
      }
    } catch (err) {
      console.warn('Backend /api/auth/send-otp network error, using client demo OTP generator:', err);
    }

    // Client fallback demo generator
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const fallbackRecord = {
      email: cleanEmail,
      otp: randomOtp,
      expiresAt: Date.now() + 300 * 1000,
      attemptsLeft: 5,
      role: intendedRole
    };
    try {
      sessionStorage.setItem(`demo_otp_${cleanEmail}`, JSON.stringify(fallbackRecord));
    } catch {
      // Ignore
    }

    return {
      success: true,
      message: `Prototype Demo Mode: 6-digit OTP generated for ${cleanEmail}.`,
      expiresInSeconds: 300,
      cooldownSeconds: 60,
      deliveryMethod: 'demo',
      devHint: randomOtp
    };
  };

  // 2. Verify 6-digit OTP
  const verifyOtp = async (email: string, otp: string, intendedRole: UserRole = 'student'): Promise<VerifyOtpResult> => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    try {
      // Backend API verify
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otp: cleanOtp, role: intendedRole })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Check if user already exists
          const existingProfile = StorageService.getProfileByEmail(cleanEmail);
          let userProfile: UserProfile;
          let isNewUser = false;
          const assignedRole: UserRole = intendedRole || (data.role as UserRole) || 'student';

          if (existingProfile && existingProfile.role === assignedRole) {
            userProfile = existingProfile;
          } else {
            isNewUser = true;
            userProfile = StorageService.createProfileForRole(assignedRole, cleanEmail);
            StorageService.updateProfile(userProfile);
          }

          // Create persistent session
          const authSession: AuthSession = {
            token: data.token || `token_${Date.now()}`,
            email: cleanEmail,
            role: userProfile.role,
            authenticatedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
          };

          StorageService.setAuthSession(authSession);
          StorageService.setCurrentUser(userProfile);
          setUser(userProfile);

          return {
            success: true,
            isNewUser,
            role: userProfile.role,
            message: 'Authentication successful.'
          };
        } else {
          const errorMsg = data.error || 'Invalid OTP';
          setError(errorMsg);
          return { success: false, error: errorMsg, attemptsLeft: data.attemptsLeft };
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error || 'Invalid OTP';
        setError(errorMsg);
        return { success: false, error: errorMsg, attemptsLeft: errorData.attemptsLeft };
      }
    } catch (fetchErr) {
      console.warn('Backend /api/auth/verify-otp network error, using client fallback:', fetchErr);
    }

    // Client fallback verification
    try {
      const stored = sessionStorage.getItem(`demo_otp_${cleanEmail}`);
      if (!stored) {
        return { success: false, error: 'OTP expired. Please request a new OTP.' };
      }
      const record = JSON.parse(stored);
      if (Date.now() > record.expiresAt) {
        sessionStorage.removeItem(`demo_otp_${cleanEmail}`);
        return { success: false, error: 'OTP expired. Please request a new OTP.' };
      }

      if (record.attemptsLeft <= 0) {
        sessionStorage.removeItem(`demo_otp_${cleanEmail}`);
        return { success: false, error: 'Too many incorrect attempts. Please request a new OTP.' };
      }

      if (record.otp !== cleanOtp) {
        record.attemptsLeft -= 1;
        sessionStorage.setItem(`demo_otp_${cleanEmail}`, JSON.stringify(record));
        return {
          success: false,
          error: `Invalid OTP. ${record.attemptsLeft} attempt${record.attemptsLeft > 1 ? 's' : ''} remaining.`,
          attemptsLeft: record.attemptsLeft
        };
      }

      // Successful verification
      sessionStorage.removeItem(`demo_otp_${cleanEmail}`);
      const assignedRole: UserRole = intendedRole || record.role || 'student';
      const existingProfile = StorageService.getProfileByEmail(cleanEmail);
      let userProfile: UserProfile;
      let isNewUser = false;

      if (existingProfile && existingProfile.role === assignedRole) {
        userProfile = existingProfile;
      } else {
        isNewUser = true;
        userProfile = StorageService.createProfileForRole(assignedRole, cleanEmail);
        StorageService.updateProfile(userProfile);
      }

      const authSession: AuthSession = {
        token: `sih_client_token_${Date.now()}`,
        email: cleanEmail,
        role: userProfile.role,
        authenticatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
      };

      StorageService.setAuthSession(authSession);
      StorageService.setCurrentUser(userProfile);
      setUser(userProfile);

      return {
        success: true,
        isNewUser,
        role: userProfile.role,
        message: 'Authentication successful.'
      };
    } catch {
      return { success: false, error: 'Verification failed. Please try again.' };
    }
  };

  // 3. Resend OTP
  const resendOtp = async (email: string, intendedRole: UserRole = 'student'): Promise<SendOtpResult> => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, role: intendedRole })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return {
            success: true,
            message: data.message,
            expiresInSeconds: data.expiresInSeconds || 300,
            cooldownSeconds: data.cooldownSeconds || 60,
            deliveryMethod: data.deliveryMethod,
            devHint: data.devHint
          };
        } else {
          const errorMsg = data.error || 'Failed to resend code.';
          setError(errorMsg);
          return { success: false, error: errorMsg, cooldownSeconds: data.cooldownRemaining };
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        const errorMsg = errData.error || 'Failed to resend code.';
        setError(errorMsg);
        return { success: false, error: errorMsg, cooldownSeconds: errData.cooldownRemaining };
      }
    } catch (fetchErr) {
      console.warn('Backend /api/auth/resend-otp network error, using client fallback:', fetchErr);
    }

    // Client fallback
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const fallbackRecord = {
      email: cleanEmail,
      otp: randomOtp,
      expiresAt: Date.now() + 300 * 1000,
      attemptsLeft: 5,
      role: intendedRole
    };
    try {
      sessionStorage.setItem(`demo_otp_${cleanEmail}`, JSON.stringify(fallbackRecord));
    } catch {
      // Ignore
    }

    return {
      success: true,
      message: `Prototype Demo Mode: Fresh 6-digit OTP generated for ${cleanEmail}.`,
      expiresInSeconds: 300,
      cooldownSeconds: 60,
      deliveryMethod: 'demo',
      devHint: randomOtp
    };
  };

  // 4. Role Persona Access for active user
  const loginWithDemo = async (targetRole: UserRole): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const email = `evaluator.${targetRole}@sih.gov.in`;
      const cleanEmail = email.trim().toLowerCase();
      let roleUser = StorageService.getProfileByRole(targetRole);
      if (!roleUser) {
        roleUser = StorageService.createProfileForRole(targetRole, cleanEmail);
        StorageService.updateProfile(roleUser);
      }

      const sessionData: AuthSession = {
        token: `sih_evaluator_session_${targetRole}_${Date.now()}`,
        email: roleUser.email,
        role: targetRole,
        authenticatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
      };
      StorageService.setAuthSession(sessionData);
      StorageService.setCurrentUser(roleUser);
      setUser(roleUser);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Failed role login.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Standard login
  const login = async (email: string, _password?: string, intendedRole?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured && supabase && _password) {
        const { data, error: authErr } = await supabase.auth.signInWithPassword({
          email,
          password: _password
        });
        if (authErr) {
          setError(authErr.message);
          setIsLoading(false);
          return false;
        }
        if (data.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
          if (profile) {
            setUser(profile as UserProfile);
            StorageService.setCurrentUser(profile as UserProfile);
            setIsLoading(false);
            return true;
          }
        }
      }

      // Local Match
      const cleanEmail = email.trim().toLowerCase();
      let matched = StorageService.getProfileByEmail(cleanEmail);

      if (!matched) {
        matched = StorageService.createProfileForRole(intendedRole || 'student', cleanEmail);
        StorageService.updateProfile(matched);
      }

      const sessionData: AuthSession = {
        token: `sih_auth_session_${Date.now()}`,
        email: matched.email,
        role: matched.role,
        authenticatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
      };
      StorageService.setAuthSession(sessionData);
      StorageService.setCurrentUser(matched);
      setUser(matched);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const cleanEmail = data.email.trim().toLowerCase();
      const newProfile = StorageService.createProfileForRole(data.role, cleanEmail);
      if (data.fullName && data.fullName.trim()) {
        newProfile.fullName = data.fullName.trim();
      }
      if (data.phone) {
        newProfile.phone = data.phone;
      }
      if (data.role === 'student') {
        const sp = newProfile as StudentProfile;
        if (data.collegeName) sp.collegeName = data.collegeName;
        if (data.degree) sp.degree = data.degree;
        if (data.branch) sp.branch = data.branch;
        if (data.graduationYear) sp.graduationYear = data.graduationYear;
      }

      StorageService.updateProfile(newProfile);
      
      const sessionData: AuthSession = {
        token: `sih_auth_${Date.now()}`,
        email: newProfile.email,
        role: newProfile.role,
        authenticatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
      };
      StorageService.setAuthSession(sessionData);
      StorageService.setCurrentUser(newProfile);
      setUser(newProfile);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Signup failed');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
      StorageService.setCurrentUser(null);
      StorageService.setAuthSession(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = (newRole: UserRole) => {
    const currentEmail = user?.email || `user@${newRole}.domain`;
    let roleProfile = StorageService.getProfileByRole(newRole);
    if (!roleProfile) {
      roleProfile = StorageService.createProfileForRole(newRole, currentEmail);
      StorageService.updateProfile(roleProfile);
    }
    setUser(roleProfile);
    StorageService.setCurrentUser(roleProfile);
    const session = StorageService.getAuthSession();
    if (session) {
      StorageService.setAuthSession({ ...session, role: newRole });
    }
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    const merged = { ...user, ...updatedData, updatedAt: new Date().toISOString() } as UserProfile;
    setUser(merged);
    StorageService.updateProfile(merged);
  };

  const resetDemoState = () => {
    StorageService.resetToDefaults();
    setUser(StorageService.getCurrentUser());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: Boolean(user),
        isLoading,
        error,
        sendOtp,
        verifyOtp,
        resendOtp,
        loginWithDemo,
        login,
        signup,
        logout,
        switchRole,
        updateProfile,
        resetDemoState,
        isLiveSupabase: isSupabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
