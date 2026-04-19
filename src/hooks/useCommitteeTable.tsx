import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useCommitteeTable<T extends { id: string }>(table: string, orderBy = 'created_at', ascending = false) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).from(table).select('*').order(orderBy, { ascending });
    if (!error && data) setRows(data as T[]);
    setLoading(false);
  }, [table, orderBy, ascending]);

  useEffect(() => { fetch(); }, [fetch]);

  const insert = async (payload: Partial<T>) => {
    const { error } = await (supabase as any).from(table).insert(payload);
    if (error) { toast.error('പിശക്: ' + error.message); return false; }
    toast.success('ചേർത്തു');
    await fetch();
    return true;
  };

  const remove = async (id: string) => {
    const { error } = await (supabase as any).from(table).delete().eq('id', id);
    if (error) { toast.error('പിശക്: ' + error.message); return false; }
    toast.success('നീക്കം ചെയ്തു');
    await fetch();
    return true;
  };

  return { rows, loading, insert, remove, refresh: fetch };
}

export async function uploadCommitteeFile(bucket: string, file: File, prefix = '') {
  const ext = file.name.split('.').pop();
  const path = `${prefix}${prefix ? '/' : ''}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
  if (error) { toast.error('Upload error: ' + error.message); return null; }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
