import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TimetableEntry {
  id: string;
  category: 'calling' | 'typing' | 'cleaning';
  day: string;
  time_slot: string;
  activity: string;
  sort_order: number;
  created_at: string;
}

export function useTimetables() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('timetables')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('day', { ascending: true });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setEntries(data as TimetableEntry[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, []);

  const addEntry = async (entry: Omit<TimetableEntry, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('timetables').insert(entry);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    }
    toast({ title: 'Added successfully' });
    fetchEntries();
    return true;
  };

  const updateEntry = async (id: string, updates: Partial<TimetableEntry>) => {
    const { error } = await supabase.from('timetables').update(updates).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    }
    toast({ title: 'Updated successfully' });
    fetchEntries();
    return true;
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase.from('timetables').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    }
    toast({ title: 'Deleted successfully' });
    fetchEntries();
    return true;
  };

  return { entries, loading, addEntry, updateEntry, deleteEntry, refetch: fetchEntries };
}
