import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type CommitteeId = 'central' | 'jawahir' | 'samaja' | 'library';

export interface Committee {
  id: CommitteeId;
  name: string;
  password: string;
  score: number;
  max_score: number;
  remark: string | null;
  updated_at: string;
}

export const COMMITTEE_META: Record<CommitteeId, { name: string; slug: string; gradient: string; emoji: string }> = {
  central: { name: 'സെൻട്രൽ കമ്മിറ്റി', slug: 'central', gradient: 'from-emerald-600 to-teal-600', emoji: '🏛️' },
  jawahir: { name: 'അൽ ജവാഹിർ കമ്മിറ്റി', slug: 'jawahir', gradient: 'from-amber-600 to-orange-600', emoji: '📖' },
  samaja: { name: 'സമാജ കമ്മിറ്റി', slug: 'samaja', gradient: 'from-blue-600 to-indigo-600', emoji: '🤝' },
  library: { name: 'ലൈബ്രറി കമ്മിറ്റി', slug: 'library', gradient: 'from-purple-600 to-pink-600', emoji: '📚' },
};

const SESSION_KEY = (id: CommitteeId) => `committee_session_${id}`;

export function useCommittees() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).from('committees').select('*').order('id');
    if (!error && data) setCommittees(data as Committee[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateCommittee = async (id: CommitteeId, patch: Partial<Pick<Committee, 'password' | 'score' | 'max_score' | 'remark'>>) => {
    const { error } = await (supabase as any)
      .from('committees')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      toast.error('പിശക്: ' + error.message);
      return false;
    }
    toast.success('സേവ് ചെയ്തു');
    await fetchAll();
    return true;
  };

  return { committees, loading, refresh: fetchAll, updateCommittee };
}

export function useCommittee(id: CommitteeId) {
  const [committee, setCommittee] = useState<Committee | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOne = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).from('committees').select('*').eq('id', id).maybeSingle();
    if (!error && data) setCommittee(data as Committee);
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchOne(); }, [fetchOne]);

  return { committee, loading, refresh: fetchOne };
}

export function useCommitteeAuth(id: CommitteeId) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(sessionStorage.getItem(SESSION_KEY(id)) === '1');
  }, [id]);

  const login = async (password: string): Promise<boolean> => {
    const { data, error } = await (supabase as any).from('committees').select('password').eq('id', id).maybeSingle();
    if (error || !data) {
      toast.error('പിശക് സംഭവിച്ചു');
      return false;
    }
    if ((data as any).password === password) {
      sessionStorage.setItem(SESSION_KEY(id), '1');
      setIsLoggedIn(true);
      toast.success('ലോഗിൻ വിജയകരം');
      return true;
    }
    toast.error('തെറ്റായ പാസ്‌വേഡ്');
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY(id));
    setIsLoggedIn(false);
  };

  return { isLoggedIn, login, logout };
}
