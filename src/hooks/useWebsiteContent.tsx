import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Default content for the website
// Form field types for dynamic form
export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'file';
  required: boolean;
  placeholder?: string;
  options?: string[]; // For select type
  order: number;
}

const defaultFormFields: FormField[] = [
  { id: 'studentName', name: 'studentName', label: 'വിദ്യാർത്ഥിയുടെ പേര്', type: 'text', required: true, placeholder: 'പൂർണ്ണ നാമം', order: 1 },
  { id: 'studentAge', name: 'studentAge', label: 'വയസ്സ്', type: 'number', required: true, placeholder: 'വയസ്സ്', order: 2 },
  { id: 'dateOfBirth', name: 'dateOfBirth', label: 'ജനനതീയതി', type: 'date', required: true, order: 3 },
  { id: 'guardianName', name: 'guardianName', label: 'രക്ഷിതാവിന്റെ പേര്', type: 'text', required: true, placeholder: 'രക്ഷിതാവിന്റെ പൂർണ്ണ നാമം', order: 4 },
  { id: 'guardianPhone', name: 'guardianPhone', label: 'ഫോൺ നമ്പർ', type: 'text', required: true, placeholder: '+91 XXXXX XXXXX', order: 5 },
  { id: 'guardianEmail', name: 'guardianEmail', label: 'ഇമെയിൽ', type: 'text', required: false, placeholder: 'email@example.com', order: 6 },
  { id: 'address', name: 'address', label: 'മേൽവിലാസം', type: 'textarea', required: true, placeholder: 'പൂർണ്ണ മേൽവിലാസം', order: 7 },
  { id: 'madarasaLevel', name: 'madarasaLevel', label: 'മദ്രസ എത്ര വരെ പഠിച്ചു', type: 'text', required: false, placeholder: 'ഉദാ: 5-ാം ക്ലാസ്', order: 8 },
  { id: 'madarasaName', name: 'madarasaName', label: 'മദ്രസയുടെ പേര്', type: 'text', required: false, placeholder: 'മദ്രസയുടെ പേര്', order: 9 },
  { id: 'previousSchool', name: 'previousSchool', label: 'മുൻ സ്കൂൾ', type: 'text', required: false, placeholder: 'മുൻ വിദ്യാലയത്തിന്റെ പേര്', order: 10 },
  { id: 'additionalInfo', name: 'additionalInfo', label: 'അധിക വിവരങ്ങൾ', type: 'textarea', required: false, placeholder: 'എന്തെങ്കിലും പ്രത്യേക കാര്യങ്ങൾ അറിയിക്കണമെങ്കിൽ ഇവിടെ എഴുതുക...', order: 11 },
];

const defaultInstitutionRules = `സ്ഥാപനത്തിന്റെ അച്ചടക്ക നിയമങ്ങൾ

1. എല്ലാ വിദ്യാർത്ഥികളും സമയം കൃത്യമായി പാലിക്കണം.

2. ക്ലാസ്സിൽ അച്ചടക്കം പാലിക്കുകയും അധ്യാപകരെ ബഹുമാനിക്കുകയും വേണം.

3. മൊബൈൽ ഫോൺ ക്ലാസ്സിൽ കൊണ്ടുവരുന്നത് നിരോധിച്ചിരിക്കുന്നു.

4. യൂണിഫോം ധരിക്കൽ നിർബന്ധമാണ്.

5. മറ്റ് വിദ്യാർത്ഥികളോട് സൗഹാർദ്ദപരമായി പെരുമാറണം.

6. സ്ഥാപനത്തിന്റെ സ്വത്തുക്കൾ സൂക്ഷിക്കാൻ ബാധ്യസ്ഥരാണ്.

7. അവധി ദിവസങ്ങളിൽ മുൻകൂട്ടി അനുമതി വാങ്ങണം.

8. പരീക്ഷകളിൽ ക്രമക്കേട് നടത്തുന്നത് ശിക്ഷാർഹമാണ്.

9. രക്ഷിതാക്കൾ മാസത്തിൽ ഒരിക്കലെങ്കിലും സ്ഥാപനം സന്ദർശിക്കണം.

10. മേൽപ്പറഞ്ഞ നിയമങ്ങൾ ലംഘിച്ചാൽ ശിക്ഷാനടപടി സ്വീകരിക്കും.`;

const defaultContent = {
  splash: {
    buttonText: 'Click to Open',
    buttonSubtitle: 'ഞങ്ങളുടെ വിദ്യാഭ്യാസ സ്ഥാപനം അറിയാൻ ടാപ് ചെയ്യുക',
    institutionName: 'ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസ്',
    institutionSubtitle: '',
    tagline: 'വിശ്വാസവും വിജ്ഞാനവും കരുത്താക്കുന്ന വിദ്യാഭ്യാസം',
    admissionStatus: 'അഡ്മിഷൻ ആരംഭിച്ചു',
    enabled: true
  },
  coursesSection: {
    title: 'പഠന പാഠ്യന്തര വിഷയങ്ങൾ',
    subtitle: 'പഠന പദ്ധതികൾ',
    description: 'സമഗ്രമായ വിദ്യാഭ്യാസ പദ്ധതിയിലൂടെ വിദ്യാർത്ഥികളെ എല്ലാ മേഖലകളിലും മികവുറ്റവരാക്കുന്നു'
  },
  hero: {
    title: 'ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസ്',
    subtitle: 'ഇസ്‌ലാമിക വിദ്യാഭ്യാസവും ആധുനിക വൈദഗ്ധ്യവും സമന്വയിപ്പിച്ച് വിശ്വാസവും ഭാവിയും കെട്ടിപ്പടുക്കുന്നു',
    phone1: '+91 95441 24059',
    phone2: '+91 82811 02606',
    ctaText: 'പ്രവേശനം ആരംഭിച്ചു',
    backgroundImage: '/placeholder.svg'
  },
  about: {
    title: 'ഞങ്ങളെ കുറിച്ച്',
    subtitle: 'മൂല്യാധിഷ്ഠിത വിദ്യാഭ്യാസത്തിന്റെ കേന്ദ്രം',
    description: 'ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസ് ഇസ്‌ലാമിക പാരമ്പര്യവും ആധുനിക വിദ്യാഭ്യാസവും സമന്വയിപ്പിച്ച് വിദ്യാർത്ഥികളെ സമഗ്രമായി വളർത്തിയെടുക്കുന്നു. മതപരമായ അറിവിനൊപ്പം പ്രായോഗിക കഴിവുകളും നേതൃത്വ ഗുണങ്ങളും വികസിപ്പിക്കാൻ ഞങ്ങൾ പ്രതിജ്ഞാബദ്ധരാണ്.',
    features: [
      { title: 'മൂല്യാധിഷ്ഠിത വിദ്യാഭ്യാസം', description: 'ധാർമ്മിക മൂല്യങ്ങളിൽ അധിഷ്ഠിതമായ പഠനം' },
      { title: 'വ്യക്തിത്വ വികസനം', description: 'വിദ്യാർത്ഥികളുടെ സമഗ്ര വ്യക്തിത്വ വികസനം' },
      { title: 'സന്തുലിത പഠനം', description: 'മതപരവും പ്രായോഗികവുമായ അറിവുകൾ' }
    ],
    image: '/placeholder.svg'
  },
  courses: [
    { id: '1', title: 'സുഫ്ഫാ കോഴ്‌സിന് കീഴിലെ ദർസ്', subtitle: 'ഇസ്‌ലാമിക പഠനം', description: 'പരമ്പരാഗത ഇസ്‌ലാമിക വിദ്യാഭ്യാസം ആധുനിക രീതിയിൽ', image: '/placeholder.svg', syllabus: '', featured: true },
    { id: '2', title: 'ഖുർആൻ പഠനം', subtitle: 'എഴുത്തും വായനയും', description: 'ഖുർആൻ പാരായണവും എഴുത്തും പഠിക്കാം', image: '/placeholder.svg', syllabus: '', featured: true },
    { id: '3', title: 'കമ്പ്യൂട്ടർ പഠനം', subtitle: 'ഡിജിറ്റൽ സാക്ഷരത', description: 'ആധുനിക കമ്പ്യൂട്ടർ കഴിവുകൾ നേടാം', image: '/placeholder.svg', syllabus: '', featured: true },
    { id: '4', title: 'ലൈബ്രറി സൗകര്യം', subtitle: 'വിജ്ഞാന ഭണ്ഡാരം', description: 'വിപുലമായ പുസ്തക ശേഖരം', image: '/placeholder.svg', syllabus: '', featured: false },
    { id: '5', title: 'കാന്റീൻ സൗകര്യം', subtitle: 'ആരോഗ്യകരമായ ഭക്ഷണം', description: 'ശുദ്ധമായ ഭക്ഷണം ന്യായമായ വിലയിൽ', image: '/placeholder.svg', syllabus: '', featured: false },
    { id: '6', title: 'വഅള് പരിശീലനം', subtitle: 'മത പ്രഭാഷണം', description: 'മത പ്രഭാഷണ കഴിവുകൾ വികസിപ്പിക്കാം', image: '/placeholder.svg', syllabus: '', featured: false },
    { id: '7', title: 'വ്യക്തിത്വ വികസനം', subtitle: 'Personality Development', description: 'വിദ്യാർത്ഥികളുടെ സമഗ്ര വ്യക്തിത്വ വികസനം', image: '/placeholder.svg', syllabus: '', featured: false }
  ],
  trainingCategories: [
    {
      id: 'speech-training',
      name: 'പ്രസംഗ പരിശീലനം',
      description: 'ആത്മവിശ്വാസത്തോടെ പ്രസംഗിക്കാൻ പഠിക്കാം',
      icon: 'Mic',
      enabled: true,
      order: 1,
      subjects: [
        { id: 'speech-1', title: 'അറബി പ്രസംഗം', description: 'അറബി ഭാഷയിൽ പ്രസംഗ പരിശീലനം', order: 1 },
        { id: 'speech-2', title: 'മലയാളം പ്രസംഗം', description: 'മലയാളത്തിൽ പ്രസംഗ പരിശീലനം', order: 2 },
        { id: 'speech-3', title: 'ഇംഗ്ലീഷ് പ്രസംഗം', description: 'ഇംഗ്ലീഷ് ഭാഷയിൽ പ്രസംഗ പരിശീലനം', order: 3 },
        { id: 'speech-4', title: 'ദർസ് പ്രസംഗം', description: 'മത പ്രഭാഷണ പരിശീലനം', order: 4 },
      ]
    },
    {
      id: 'writing-training',
      name: 'എഴുത്ത് പരിശീലനം',
      description: 'മനോഹരമായ കൈയെഴുത്ത് കഴിവുകൾ',
      icon: 'PenTool',
      enabled: true,
      order: 2,
      subjects: [
        { id: 'writing-1', title: 'അറബി കാലിഗ്രഫി', description: 'അറബി എഴുത്ത് കല', order: 1 },
        { id: 'writing-2', title: 'മലയാളം കൈയെഴുത്ത്', description: 'മലയാളം എഴുത്ത് പരിശീലനം', order: 2 },
        { id: 'writing-3', title: 'ഇംഗ്ലീഷ് കൈയെഴുത്ത്', description: 'ഇംഗ്ലീഷ് എഴുത്ത് പരിശീലനം', order: 3 },
        { id: 'writing-4', title: 'ക്രിയേറ്റീവ് റൈറ്റിംഗ്', description: 'സർഗ്ഗാത്മക എഴുത്ത് പരിശീലനം', order: 4 },
      ]
    }
  ],
  benefits: [
    { id: '1', title: 'അച്ചടക്കം', description: 'ജീവിതത്തിന്റെ അടിസ്ഥാനം', icon: 'Shield' },
    { id: '2', title: 'അറിവ്', description: 'വിജയത്തിന്റെ താക്കോൽ', icon: 'BookOpen' },
    { id: '3', title: 'ആത്മവിശ്വാസം', description: 'നേതൃത്വത്തിന്റെ അടിത്തറ', icon: 'Star' },
    { id: '4', title: 'ധാർമ്മികത', description: 'സ്വഭാവ മഹിമയുടെ കേന്ദ്രം', icon: 'Heart' }
  ],
  gallery: [] as { id: string; url: string; alt: string }[],
  gallerySettings: {
    likesEnabled: true,
    downloadEnabled: true
  },
  contact: {
    phone1: '+91 95441 24059',
    phone2: '+91 82811 02606',
    email: 'info@jawharathululoom.com',
    address: 'ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസ്',
    timing: 'രാവിലെ 6:00 മുതൽ വൈകുന്നേരം 6:00 വരെ'
  },
  map: {
    embedUrl: 'https://maps.app.goo.gl/ZN8C3epBni6h3hKn9?g_st=aw',
    address: 'ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസ്',
    landmarks: [
      { id: '1', number: '1', title: 'അടുത്തുള്ള ലാൻഡ്മാർക്ക്', description: 'പ്രധാന റോഡിൽ നിന്ന് 500 മീറ്റർ' },
      { id: '2', number: '2', title: 'ബസ് സ്റ്റോപ്പ്', description: 'സമീപത്തുള്ള ബസ് സ്റ്റോപ്പ് 200 മീറ്റർ' },
      { id: '3', number: '3', title: 'പാർക്കിംഗ്', description: 'സൗജന്യ പാർക്കിംഗ് സൗകര്യം ലഭ്യമാണ്' },
    ],
    landmarksEnabled: true
  },
  footer: {
    copyright: '© 2024 ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസ്. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.',
    tagline: 'വിശ്വാസവും വിജ്ഞാനവും കരുത്താക്കുന്ന വിദ്യാഭ്യാസം'
  },
  social: {
    whatsapp: '919544124059',
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
    instagram: 'https://instagram.com'
  },
  admissionForm: {
    title: 'വിദ്യാർത്ഥി അഡ്മിഷൻ അപേക്ഷ',
    subtitle: 'പ്രവേശനം 2025-26',
    description: 'എല്ലാ വിവരങ്ങളും കൃത്യമായി പൂരിപ്പിക്കുക. * അടയാളപ്പെടുത്തിയ ഫീൽഡുകൾ നിർബന്ധമാണ്.',
    fields: defaultFormFields,
    institutionRules: defaultInstitutionRules,
    rulesTitle: 'സ്ഥാപനത്തിന്റെ അച്ചടക്ക നിയമങ്ങൾ',
    approvalText: 'ഞാൻ മേൽപ്പറഞ്ഞ നിയമങ്ങൾ വായിക്കുകയും അംഗീകരിക്കുകയും ചെയ്തു',
    submitButtonText: 'അപേക്ഷ സമർപ്പിക്കുക'
  }
};

export type WebsiteContent = typeof defaultContent;

export function useWebsiteContent() {
  const [content, setContent] = useState<WebsiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load content from database
  const loadContent = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .eq('id', 'main')
        .maybeSingle();

      if (error) throw error;

      if (data?.content) {
        setContent({ ...defaultContent, ...(data.content as Partial<WebsiteContent>) });
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save content to database
  const saveContent = useCallback(async (newContent: WebsiteContent) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase
        .from('website_content') as any)
        .upsert({
          id: 'main',
          content: newContent,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setContent(newContent);
      toast({
        title: "സേവ് ചെയ്തു!",
        description: "മാറ്റങ്ങൾ വിജയകരമായി സേവ് ചെയ്തു",
      });
      return true;
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "പിശക്!",
        description: "മാറ്റങ്ങൾ സേവ് ചെയ്യാൻ കഴിഞ്ഞില്ല",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  // Subscribe to realtime updates
  useEffect(() => {
    loadContent();

    const channel = supabase
      .channel('website-content-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'website_content'
        },
        () => {
          loadContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadContent]);

  return { content, loading, saveContent, refreshContent: loadContent };
}
