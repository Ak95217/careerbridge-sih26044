import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, StudentProfile } from '../types';
import { StorageService, AuthSession } from '../services/storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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

export interface OtpRegistrationDetails {
  fullName: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sendOtp: (email: string, role?: UserRole) => Promise<SendOtpResult>;
  verifyOtp: (email: string, otp: string, role?: UserRole, registrationDetails?: OtpRegistrationDetails) => Promise<VerifyOtpResult>;
  resendOtp: (email: string, role?: UserRole) => Promise<SendOtpResult>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  resetDemoState: () => void;
  isLiveSupabase: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const PENDING_EMAIL_VERIFICATION_KEY = 'sih_pending_email_verification';

const getPendingEmailVerification = (email?: string) => {
  if (!email) return null;
  try {
    const raw = localStorage.getItem(PENDING_EMAIL_VERIFICATION_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as { email: string; role: UserRole; verifiedAt: string } | null;
    return value && value.email.toLowerCase() === email.toLowerCase() ? value : null;
  } catch {
    return null;
  }
};

const setPendingEmailVerification = (email: string, role: UserRole) => {
  try {
    localStorage.setItem(PENDING_EMAIL_VERIFICATION_KEY, JSON.stringify({ email: email.toLowerCase(), role, verifiedAt: new Date().toISOString() }));
  } catch {
    // no-op
  }
};

const clearPendingEmailVerification = (email?: string) => {
  try {
    if (email) {
      const pending = getPendingEmailVerification(email);
      if (!pending) {
        localStorage.removeItem(PENDING_EMAIL_VERIFICATION_KEY);
        return;
      }
    }
    localStorage.removeItem(PENDING_EMAIL_VERIFICATION_KEY);
  } catch {
    // no-op
  }
};

const clearLegacyDemoAuthStorage = () => {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i += 1) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('demo_otp_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
  } catch {
    // no-op
  }
};

const mapSupabaseProfile = (profile: any): UserProfile => {
  const role = (profile?.role || 'student') as UserRole;
  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name || profile.fullName || 'User',
    phone: profile.phone || undefined,
    role,
    avatarUrl: profile.avatar_url || profile.avatarUrl || undefined,
    bio: profile.bio || undefined,
    createdAt: profile.created_at || new Date().toISOString(),
    updatedAt: profile.updated_at || new Date().toISOString()
  } as UserProfile;
};

const loadSupabaseProfile = async (userId: string): Promise<UserProfile | null> => {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError || !profile) {
      return null;
    }

    let fullProfile = mapSupabaseProfile(profile) as UserProfile;
    const role = fullProfile.role;

    if (role === 'student') {
      const { data: studentData } = await supabase.from('students').select('*').eq('id', userId).maybeSingle();
      fullProfile = {
        ...fullProfile,
        ...(studentData || {}),
        currentSemester: studentData?.current_semester || studentData?.currentSemester || fullProfile.currentSemester || '',
        role: 'student'
      } as UserProfile;
    } else if (role === 'company') {
      const { data: companyData } = await supabase.from('companies').select('*').eq('id', userId).maybeSingle();
      fullProfile = { ...fullProfile, ...(companyData || {}), role: 'company' } as UserProfile;
    } else if (role === 'faculty') {
      const { data: facultyData } = await supabase.from('faculty').select('*').eq('id', userId).maybeSingle();
      fullProfile = { ...fullProfile, ...(facultyData || {}), role: 'faculty' } as UserProfile;
    } else if (role === 'mentor') {
      const { data: mentorData } = await supabase.from('mentors').select('*').eq('id', userId).maybeSingle();
      fullProfile = { ...fullProfile, ...(mentorData || {}), role: 'mentor' } as UserProfile;
    }

    return fullProfile;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session on mount
  useEffect(() => {
    const initAuth = async () => {
      clearLegacyDemoAuthStorage();
      setIsLoading(true);
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const profile = await loadSupabaseProfile(session.user.id);
            if (profile) {
              setUser(profile);
              StorageService.setCurrentUser(profile);
              StorageService.setAuthSession({
                token: session.access_token,
                email: session.user.email || profile.email,
                role: profile.role,
                authenticatedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
              });
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
            devHint: data.devHint,
            deliveryMethod: data.deliveryMethod
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
      const errorMsg = 'Unable to send OTP. Please try again.';
      setError(errorMsg);
      console.error('OTP send failed:', err);
      return { success: false, error: errorMsg };
    }
  };

  // 2. Verify 6-digit OTP
  const verifyOtp = async (
    email: string,
    otp: string,
    intendedRole: UserRole = 'student',
    registrationDetails?: OtpRegistrationDetails
  ): Promise<VerifyOtpResult> => {
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
          const existingProfile = StorageService.getProfileByEmail(cleanEmail);
          let userProfile: UserProfile;
          let isNewUser = false;
          const assignedRole: UserRole = intendedRole || (data.role as UserRole) || 'student';

          if (existingProfile && existingProfile.role === assignedRole) {
            userProfile = existingProfile;
          } else {
            isNewUser = true;
            userProfile = StorageService.createProfileForRole(assignedRole, cleanEmail);
            if (registrationDetails?.fullName.trim()) {
              userProfile = { ...userProfile, fullName: registrationDetails.fullName.trim() } as UserProfile;
            }
            StorageService.updateProfile(userProfile);
          }

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
          clearPendingEmailVerification(cleanEmail);

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
      const errorMsg = 'OTP verification failed. Please try again.';
      setError(errorMsg);
      console.error('OTP verify failed:', fetchErr);
      return { success: false, error: errorMsg };
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
            devHint: data.devHint,
            deliveryMethod: data.deliveryMethod
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
      const errorMsg = 'Unable to resend OTP. Please try again.';
      setError(errorMsg);
      console.error('OTP resend failed:', fetchErr);
      return { success: false, error: errorMsg };
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
      clearPendingEmailVerification();
      StorageService.setCurrentUser(null);
      StorageService.setAuthSession(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = (newRole: UserRole) => {
    const currentEmail = user?.email || `${newRole}@example.com`;
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
