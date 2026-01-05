import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Admission {
  id: string;
  student_name: string;
  age: number | null;
  date_of_birth: string | null;
  gender: string | null;
  guardian_name: string;
  guardian_relation: string | null;
  guardian_phone: string;
  guardian_email: string | null;
  address: string | null;
  aadhaar_number: string | null;
  birth_certificate_number: string | null;
  previous_school: string | null;
  tc_number: string | null;
  selected_course: string | null;
  additional_info: string | null;
  status: string;
  notified: boolean;
  created_at: string;
}

export function useAdmissions() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdmissionCount, setNewAdmissionCount] = useState(0);
  const { toast } = useToast();

  const loadAdmissions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('admissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmissions(data || []);
      setNewAdmissionCount(data?.filter(a => !a.notified).length || 0);
    } catch (error) {
      console.error('Error loading admissions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAdmission = useCallback(async (admissionData: Omit<Admission, 'id' | 'status' | 'notified' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('admissions')
        .insert([admissionData])
        .select()
        .single();

      if (error) throw error;

      // Send WhatsApp notification
      const whatsappMessage = `🎓 പുതിയ അഡ്മിഷൻ അപേക്ഷ!\n\n👤 വിദ്യാർത്ഥി: ${admissionData.student_name}\n👨‍👩‍👧 രക്ഷിതാവ്: ${admissionData.guardian_name}\n📞 ഫോൺ: ${admissionData.guardian_phone}\n📚 കോഴ്‌സ്: ${admissionData.selected_course || 'തിരഞ്ഞെടുത്തിട്ടില്ല'}`;
      const encodedMessage = encodeURIComponent(whatsappMessage);
      window.open(`https://wa.me/919048696090?text=${encodedMessage}`, '_blank');

      toast({ title: "അപേക്ഷ സമർപ്പിച്ചു!", description: "നിങ്ങളുടെ അഡ്മിഷൻ അപേക്ഷ വിജയകരമായി സമർപ്പിച്ചു" });
      return data;
    } catch (error) {
      console.error('Error submitting admission:', error);
      toast({ title: "പിശക്!", description: "അപേക്ഷ സമർപ്പിക്കാൻ കഴിഞ്ഞില്ല", variant: "destructive" });
      return null;
    }
  }, [toast]);

  useEffect(() => {
    loadAdmissions();

    const channel = supabase
      .channel('admissions-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'admissions' }, (payload) => {
        const newAdmission = payload.new as Admission;
        setAdmissions(prev => [newAdmission, ...prev]);
        setNewAdmissionCount(prev => prev + 1);
        toast({ title: "🎓 പുതിയ അഡ്മിഷൻ!", description: `${newAdmission.student_name} അപേക്ഷ സമർപ്പിച്ചു` });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [loadAdmissions, toast]);

  return { admissions, loading, newAdmissionCount, submitAdmission, refreshAdmissions: loadAdmissions };
}
