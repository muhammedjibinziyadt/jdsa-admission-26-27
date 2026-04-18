import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FinanceRecord {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  entry_date: string;
  description: string | null;
  created_at: string;
}

export interface ItemRecord {
  id: string;
  name: string;
  photo_url: string | null;
  quantity: number | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
}

export interface CommitteeSettings {
  id: string;
  group_photo_url: string | null;
  constitution_url: string | null;
  updated_at: string;
}

export function useCommittee() {
  const { toast } = useToast();
  const [finances, setFinances] = useState<FinanceRecord[]>([]);
  const [items, setItems] = useState<ItemRecord[]>([]);
  const [settings, setSettings] = useState<CommitteeSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [fRes, iRes, sRes] = await Promise.all([
      supabase.from('committee_finances').select('*').order('entry_date', { ascending: false }),
      supabase.from('committee_items').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
      supabase.from('committee_settings').select('*').eq('id', 'global').maybeSingle(),
    ]);
    if (fRes.data) setFinances(fRes.data as FinanceRecord[]);
    if (iRes.data) setItems(iRes.data as ItemRecord[]);
    if (sRes.data) setSettings(sRes.data as CommitteeSettings);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('committee').upload(path, file, { upsert: false });
    if (error) {
      console.error('Upload error', error);
      toast({ title: 'അപ്‌ലോഡ് പിശക്', description: error.message, variant: 'destructive' });
      return null;
    }
    return supabase.storage.from('committee').getPublicUrl(path).data.publicUrl;
  };

  // Settings
  const saveSettings = async (patch: Partial<Pick<CommitteeSettings, 'group_photo_url' | 'constitution_url'>>) => {
    const { data, error } = await supabase
      .from('committee_settings')
      .upsert({ id: 'global', ...patch, updated_at: new Date().toISOString() })
      .select()
      .maybeSingle();
    if (error) {
      toast({ title: 'പിശക്', description: error.message, variant: 'destructive' });
      return false;
    }
    if (data) setSettings(data as CommitteeSettings);
    return true;
  };

  // Finances CRUD
  const addFinance = async (rec: Omit<FinanceRecord, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('committee_finances').insert(rec).select().single();
    if (error) { toast({ title: 'പിശക്', description: error.message, variant: 'destructive' }); return false; }
    setFinances(prev => [data as FinanceRecord, ...prev]);
    toast({ title: 'ചേർത്തു', description: 'റെക്കോർഡ് സേവ് ചെയ്തു' });
    return true;
  };
  const updateFinance = async (id: string, patch: Partial<FinanceRecord>) => {
    const { data, error } = await supabase.from('committee_finances').update(patch).eq('id', id).select().single();
    if (error) { toast({ title: 'പിശക്', description: error.message, variant: 'destructive' }); return false; }
    setFinances(prev => prev.map(f => f.id === id ? (data as FinanceRecord) : f));
    return true;
  };
  const deleteFinance = async (id: string) => {
    const { error } = await supabase.from('committee_finances').delete().eq('id', id);
    if (error) { toast({ title: 'പിശക്', description: error.message, variant: 'destructive' }); return; }
    setFinances(prev => prev.filter(f => f.id !== id));
  };

  // Items CRUD
  const addItem = async (rec: Omit<ItemRecord, 'id' | 'created_at' | 'sort_order'> & { sort_order?: number }) => {
    const { data, error } = await supabase.from('committee_items').insert(rec).select().single();
    if (error) { toast({ title: 'പിശക്', description: error.message, variant: 'destructive' }); return false; }
    setItems(prev => [data as ItemRecord, ...prev]);
    toast({ title: 'ചേർത്തു', description: 'ഇനം സേവ് ചെയ്തു' });
    return true;
  };
  const updateItem = async (id: string, patch: Partial<ItemRecord>) => {
    const { data, error } = await supabase.from('committee_items').update(patch).eq('id', id).select().single();
    if (error) { toast({ title: 'പിശക്', description: error.message, variant: 'destructive' }); return false; }
    setItems(prev => prev.map(i => i.id === id ? (data as ItemRecord) : i));
    return true;
  };
  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('committee_items').delete().eq('id', id);
    if (error) { toast({ title: 'പിശക്', description: error.message, variant: 'destructive' }); return; }
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const totals = {
    income: finances.filter(f => f.type === 'income').reduce((s, f) => s + Number(f.amount), 0),
    expense: finances.filter(f => f.type === 'expense').reduce((s, f) => s + Number(f.amount), 0),
  };
  const balance = totals.income - totals.expense;

  return {
    loading,
    finances, items, settings,
    totals, balance,
    uploadFile, saveSettings,
    addFinance, updateFinance, deleteFinance,
    addItem, updateItem, deleteItem,
    refetch: fetchAll,
  };
}
