import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in (session based)
    const adminSession = sessionStorage.getItem('adminLoggedIn');
    if (adminSession === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admin_credentials')
        .select('*')
        .eq('username', username)
        .eq('password_hash', password)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('adminLoggedIn');
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, loading, login, logout };
}
