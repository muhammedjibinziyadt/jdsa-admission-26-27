import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AttendanceStudent {
  id: string;
  name: string;
  photo_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  entry_date: string;
  status: 'present' | 'absent' | 'leave';
  time_in: string | null;
  time_out: string | null;
  notes: string | null;
  created_at: string;
}

export interface LeaveRecord {
  id: string;
  student_id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string | null;
  return_date: string | null;
  created_at: string;
}

export function useAttendanceStudents() {
  const [students, setStudents] = useState<AttendanceStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('attendance_students')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error) setStudents(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const addStudent = async (name: string) => {
    const max = Math.max(0, ...students.map(s => s.sort_order));
    const { error } = await supabase.from('attendance_students').insert({ name, sort_order: max + 1 });
    if (error) { toast({ title: 'പിശക്', description: error.message, variant: 'destructive' }); return false; }
    toast({ title: 'വിജയം', description: 'വിദ്യാർത്ഥി ചേർത്തു' });
    await fetchStudents();
    return true;
  };

  const updateStudent = async (id: string, patch: Partial<AttendanceStudent>) => {
    const { error } = await supabase.from('attendance_students').update(patch).eq('id', id);
    if (error) { toast({ title: 'പിശക്', description: error.message, variant: 'destructive' }); return false; }
    await fetchStudents();
    return true;
  };

  const deleteStudent = async (id: string) => {
    const { error } = await supabase.from('attendance_students').delete().eq('id', id);
    if (error) { toast({ title: 'പിശക്', description: error.message, variant: 'destructive' }); return false; }
    toast({ title: 'ഡിലീറ്റ് ചെയ്തു' });
    await fetchStudents();
    return true;
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const path = `students/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('attendance').upload(path, file);
    if (error) { toast({ title: 'അപ്‌ലോഡ് പിശക്', description: error.message, variant: 'destructive' }); return null; }
    const { data } = supabase.storage.from('attendance').getPublicUrl(path);
    return data.publicUrl;
  };

  return { students, loading, addStudent, updateStudent, deleteStudent, uploadPhoto, refresh: fetchStudents };
}

export function useStudentDetail(studentId: string | undefined) {
  const [student, setStudent] = useState<AttendanceStudent | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAll = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    const [s, r, l] = await Promise.all([
      supabase.from('attendance_students').select('*').eq('id', studentId).maybeSingle(),
      supabase.from('attendance_records').select('*').eq('student_id', studentId).order('entry_date', { ascending: false }),
      supabase.from('attendance_leaves').select('*').eq('student_id', studentId).order('start_date', { ascending: false }),
    ]);
    if (s.data) setStudent(s.data);
    setRecords((r.data as AttendanceRecord[]) || []);
    setLeaves((l.data as LeaveRecord[]) || []);
    setLoading(false);
  }, [studentId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Attendance CRUD
  const upsertRecord = async (rec: Omit<AttendanceRecord, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('attendance_records').upsert(rec, { onConflict: 'student_id,entry_date' });
    if (error) { toast({ title: 'പിശക്', description: error.message, variant: 'destructive' }); return false; }
    toast({ title: 'വിജയം', description: 'അറ്റൻഡൻസ് സേവ് ചെയ്തു' });
    await fetchAll();
    return true;
  };

  const deleteRecord = async (id: string) => {
    const { error } = await supabase.from('attendance_records').delete().eq('id', id);
    if (error) { toast({ title: 'പിശക്', description: error.message, variant: 'destructive' }); return false; }
    await fetchAll();
    return true;
  };

  // Leave CRUD
  const addLeave = async (leave: Omit<LeaveRecord, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('attendance_leaves').insert(leave);
    if (error) { toast({ title: 'പിശക്', description: error.message, variant: 'destructive' }); return false; }
    toast({ title: 'വിജയം', description: 'അവധി ചേർത്തു' });
    await fetchAll();
    return true;
  };

  const updateLeave = async (id: string, patch: Partial<LeaveRecord>) => {
    const { error } = await supabase.from('attendance_leaves').update(patch).eq('id', id);
    if (error) { toast({ title: 'പിശക്', description: error.message, variant: 'destructive' }); return false; }
    await fetchAll();
    return true;
  };

  const deleteLeave = async (id: string) => {
    const { error } = await supabase.from('attendance_leaves').delete().eq('id', id);
    if (error) { toast({ title: 'പിശക്', description: error.message, variant: 'destructive' }); return false; }
    await fetchAll();
    return true;
  };

  // Summary
  const summary = {
    present: records.filter(r => r.status === 'present').length,
    absent: records.filter(r => r.status === 'absent').length,
    leave: leaves.reduce((sum, l) => sum + (l.total_days || 0), 0),
  };

  return { student, records, leaves, loading, summary, upsertRecord, deleteRecord, addLeave, updateLeave, deleteLeave, refresh: fetchAll };
}
