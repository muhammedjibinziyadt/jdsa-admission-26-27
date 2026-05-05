import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAdminAuth } from './useAdminAuth';

/**
 * Inline admin password gate. Used for sensitive actions (fines CRUD).
 * If admin already logged in via /admin → run action directly.
 * Otherwise prompts for the admin password and verifies against admin_credentials.
 */
export function useAdminGate() {
  const { isAuthenticated } = useAdminAuth();

  const requireAdmin = useCallback(async (action: () => any | Promise<any>): Promise<void> => {
    if (isAuthenticated) { await action(); return; }
    const pwd = window.prompt('Admin password required:');
    if (!pwd) return;
    const { data, error } = await supabase
      .from('admin_credentials')
      .select('id')
      .eq('password_hash', pwd)
      .maybeSingle();
    if (error || !data) { toast.error('Wrong admin password'); return; }
    sessionStorage.setItem('adminLoggedIn', 'true');
    await action();
  }, [isAuthenticated]);

  return { requireAdmin };
}
