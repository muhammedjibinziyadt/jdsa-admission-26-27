import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ADMIN_TOKEN_KEY = 'online-library-admin-session';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    supabase.functions.invoke('online-reading-library', { body: { action: 'admin-current' }, headers: { Authorization: `Bearer ${token}` } })
      .then(({ data, error }) => {
        const valid = !error && typeof data?.username === 'string';
        setIsAuthenticated(valid);
        if (!valid) sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      })
      .catch(() => {
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('online-reading-library', { body: { action: 'admin-login', username, password } });
      if (error) throw error;
      if (data?.token) {
        sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
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
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, loading, login, logout };
}
