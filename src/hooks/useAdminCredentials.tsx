import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ADMIN_TOKEN_KEY = 'main-admin-session';
const LIBRARY_ADMIN_TOKEN_KEY = 'online-library-admin-session';

interface UpdateResult {
  success: boolean;
  error?: string;
}

export function useAdminCredentials() {
  const [updating, setUpdating] = useState(false);

  // Validate password strength
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'പാസ്‌വേഡ് കുറഞ്ഞത് 8 അക്ഷരങ്ങൾ ഉണ്ടായിരിക്കണം';
    }
    if (!/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'പാസ്‌വേഡിൽ കുറഞ്ഞത് ഒരു നമ്പർ അല്ലെങ്കിൽ പ്രത്യേക അക്ഷരം ഉണ്ടായിരിക്കണം';
    }
    return null;
  };

  // Validate email format
  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return 'ഇമെയിൽ ആവശ്യമാണ്';
    }
    if (!emailRegex.test(email)) {
      return 'സാധുവായ ഇമെയിൽ വിലാസം നൽകുക';
    }
    return null;
  };

  // Verify current password
  const verifyCurrentPassword = async (currentPassword: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('online-reading-library', { body: { action: 'admin-verify', password: currentPassword } });
      if (error) throw error;
      if (!data?.token) return false;
      sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      sessionStorage.setItem(LIBRARY_ADMIN_TOKEN_KEY, data.token);
      return true;
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  };

  // Get current email
  const getCurrentEmail = async (): Promise<string | null> => {
    try {
      const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
      if (!token) return null;
      const { data, error } = await supabase.functions.invoke('online-reading-library', { body: { action: 'admin-current' }, headers: { Authorization: `Bearer ${token}` } });
      if (error) throw error;
      return data?.username || null;
    } catch (error) {
      console.error('Error fetching email:', error);
      return null;
    }
  };

  // Update email (username)
  const updateEmail = useCallback(async (
    newEmail: string, 
    currentPassword: string
  ): Promise<UpdateResult> => {
    setUpdating(true);
    try {
      // Validate email
      const emailError = validateEmail(newEmail);
      if (emailError) {
        return { success: false, error: emailError };
      }

      // Verify current password
      const isPasswordValid = await verifyCurrentPassword(currentPassword);
      if (!isPasswordValid) {
        return { success: false, error: 'നിലവിലെ പാസ്‌വേഡ് തെറ്റാണ്' };
      }

      // Update email
      const { data, error } = await supabase.functions.invoke('online-reading-library', { body: { action: 'admin-credentials', username: newEmail.trim(), currentPassword } });
      if (error) throw error;
      if (data?.token) {
        sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        sessionStorage.setItem(LIBRARY_ADMIN_TOKEN_KEY, data.token);
      }

      return { success: true };
    } catch (error) {
      console.error('Email update error:', error);
      return { success: false, error: 'ഇമെയിൽ അപ്‌ഡേറ്റ് ചെയ്യുന്നതിൽ പിശക്' };
    } finally {
      setUpdating(false);
    }
  }, []);

  // Update password
  const updatePassword = useCallback(async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<UpdateResult> => {
    setUpdating(true);
    try {
      // Verify current password
      const isPasswordValid = await verifyCurrentPassword(currentPassword);
      if (!isPasswordValid) {
        return { success: false, error: 'നിലവിലെ പാസ്‌വേഡ് തെറ്റാണ്' };
      }

      // Check if passwords match
      if (newPassword !== confirmPassword) {
        return { success: false, error: 'പുതിയ പാസ്‌വേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല' };
      }

      // Validate new password strength
      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        return { success: false, error: passwordError };
      }

      // Update password
      const { data, error } = await supabase.functions.invoke('online-reading-library', { body: { action: 'admin-credentials', newPassword, currentPassword } });
      if (error) throw error;
      if (data?.token) {
        sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        sessionStorage.setItem(LIBRARY_ADMIN_TOKEN_KEY, data.token);
      }

      return { success: true };
    } catch (error) {
      console.error('Password update error:', error);
      return { success: false, error: 'പാസ്‌വേഡ് അപ്‌ഡേറ്റ് ചെയ്യുന്നതിൽ പിശക്' };
    } finally {
      setUpdating(false);
    }
  }, []);

  return {
    updating,
    validatePassword,
    validateEmail,
    getCurrentEmail,
    updateEmail,
    updatePassword
  };
}
