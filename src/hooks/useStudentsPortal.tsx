import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StudentRecord {
  id: string;
  student_name: string;
  father_name: string;
  phone1: string;
  phone2: string | null;
  year_of_admission: string;
  previous_madrasa: string | null;
  address: string;
  current_education: string | null;
  photo_url: string | null;
  birth_certificate_url: string | null;
  aadhaar_url: string | null;
  created_at: string;
}

export function useStudentsPortal() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('students_portal')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching students:', error);
    } else {
      setStudents(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from('student-documents')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('student-documents')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const getSignedUrl = async (path: string): Promise<string | null> => {
    // Extract the path after the bucket URL
    const bucketUrl = '/student-documents/';
    const idx = path.indexOf(bucketUrl);
    const filePath = idx >= 0 ? path.substring(idx + bucketUrl.length) : path;

    const { data, error } = await supabase.storage
      .from('student-documents')
      .createSignedUrl(filePath, 3600);

    if (error) {
      console.error('Signed URL error:', error);
      return null;
    }
    return data.signedUrl;
  };

  const submitStudent = async (
    formData: Omit<StudentRecord, 'id' | 'created_at' | 'photo_url' | 'birth_certificate_url' | 'aadhaar_url'>,
    files: { photo?: File; birthCert?: File; aadhaar?: File }
  ): Promise<boolean> => {
    try {
      let photo_url: string | null = null;
      let birth_certificate_url: string | null = null;
      let aadhaar_url: string | null = null;

      if (files.photo) photo_url = await uploadFile(files.photo, 'photos');
      if (files.birthCert) birth_certificate_url = await uploadFile(files.birthCert, 'birth-certificates');
      if (files.aadhaar) aadhaar_url = await uploadFile(files.aadhaar, 'aadhaar');

      const { error } = await supabase.from('students_portal').insert({
        ...formData,
        photo_url,
        birth_certificate_url,
        aadhaar_url,
      });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'ഡ്യൂപ്ലിക്കേറ്റ് എൻട്രി',
            description: 'ഈ ഫോൺ നമ്പർ ഉപയോഗിച്ച് ഇതിനകം രജിസ്റ്റർ ചെയ്തിട്ടുണ്ട്.',
            variant: 'destructive',
          });
          return false;
        }
        throw error;
      }

      toast({ title: 'വിജയം!', description: 'വിദ്യാർത്ഥി രജിസ്ട്രേഷൻ വിജയകരമായി സമർപ്പിച്ചു.' });
      await fetchStudents();
      return true;
    } catch (err) {
      console.error('Submit error:', err);
      toast({ title: 'പിശക്', description: 'സമർപ്പിക്കുന്നതിൽ പിശക് സംഭവിച്ചു.', variant: 'destructive' });
      return false;
    }
  };

  const deleteStudent = async (id: string) => {
    const { error } = await supabase.from('students_portal').delete().eq('id', id);
    if (error) {
      toast({ title: 'പിശക്', description: 'ഡിലീറ്റ് ചെയ്യുന്നതിൽ പിശക്.', variant: 'destructive' });
    } else {
      toast({ title: 'ഡിലീറ്റ് ചെയ്തു', description: 'വിദ്യാർത്ഥി റെക്കോർഡ് ഡിലീറ്റ് ചെയ്തു.' });
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  return { students, loading, submitStudent, deleteStudent, fetchStudents, getSignedUrl };
}
