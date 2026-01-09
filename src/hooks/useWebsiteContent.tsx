import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Default content for the website
const defaultContent = {
  splash: {
    buttonText: 'Click to Open',
    institutionName: 'ജൗഹറത്തുൽ ഉലൂം',
    institutionSubtitle: 'സുഫ്ഫ ദർസ്',
    tagline: 'വിശ്വാസവും വിജ്ഞാനവും കരുത്താക്കുന്ന വിദ്യാഭ്യാസം'
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
    {
      id: '1',
      title: 'സുഫ്ഫാ കോഴ്‌സിന് കീഴിലെ ദർസ്',
      subtitle: 'ഇസ്‌ലാമിക പഠനം',
      description: 'പരമ്പരാഗത ഇസ്‌ലാമിക വിദ്യാഭ്യാസം ആധുനിക രീതിയിൽ',
      image: '/placeholder.svg',
      syllabus: '',
      featured: true
    },
    {
      id: '2',
      title: 'ഖുർആൻ പഠനം',
      subtitle: 'എഴുത്തും വായനയും',
      description: 'ഖുർആൻ പാരായണവും എഴുത്തും പഠിക്കാം',
      image: '/placeholder.svg',
      syllabus: '',
      featured: true
    },
    {
      id: '3',
      title: 'കമ്പ്യൂട്ടർ പഠനം',
      subtitle: 'ഡിജിറ്റൽ സാക്ഷരത',
      description: 'ആധുനിക കമ്പ്യൂട്ടർ കഴിവുകൾ നേടാം',
      image: '/placeholder.svg',
      syllabus: '',
      featured: true
    },
    {
      id: '4',
      title: 'എഴുത്ത് പഠനം',
      subtitle: 'Handwriting & Writing Skills',
      description: 'മനോഹരമായ കൈയെഴുത്ത് കഴിവുകൾ',
      image: '/placeholder.svg',
      syllabus: '',
      featured: false
    },
    {
      id: '5',
      title: 'പ്രസംഗ പരിശീലനം',
      subtitle: 'Public Speaking & Dars Training',
      description: 'ആത്മവിശ്വാസത്തോടെ പ്രസംഗിക്കാൻ പഠിക്കാം',
      image: '/placeholder.svg',
      syllabus: '',
      featured: false
    },
    {
      id: '6',
      title: 'ലൈബ്രറി സൗകര്യം',
      subtitle: 'വിജ്ഞാന ഭണ്ഡാരം',
      description: 'വിപുലമായ പുസ്തക ശേഖരം',
      image: '/placeholder.svg',
      syllabus: '',
      featured: false
    },
    {
      id: '7',
      title: 'കാന്റീൻ സൗകര്യം',
      subtitle: 'ആരോഗ്യകരമായ ഭക്ഷണം',
      description: 'ശുദ്ധമായ ഭക്ഷണം ന്യായമായ വിലയിൽ',
      image: '/placeholder.svg',
      syllabus: '',
      featured: false
    },
    {
      id: '8',
      title: 'വഅള് പരിശീലനം',
      subtitle: 'മത പ്രഭാഷണം',
      description: 'മത പ്രഭാഷണ കഴിവുകൾ വികസിപ്പിക്കാം',
      image: '/placeholder.svg',
      syllabus: '',
      featured: false
    },
    {
      id: '9',
      title: 'വ്യക്തിത്വ വികസനം',
      subtitle: 'Personality Development',
      description: 'വിദ്യാർത്ഥികളുടെ സമഗ്ര വ്യക്തിത്വ വികസനം',
      image: '/placeholder.svg',
      syllabus: '',
      featured: false
    }
  ],
  benefits: [
    { id: '1', title: 'അച്ചടക്കം', description: 'ജീവിതത്തിന്റെ അടിസ്ഥാനം', icon: 'Shield' },
    { id: '2', title: 'അറിവ്', description: 'വിജയത്തിന്റെ താക്കോൽ', icon: 'BookOpen' },
    { id: '3', title: 'ആത്മവിശ്വാസം', description: 'നേതൃത്വത്തിന്റെ അടിത്തറ', icon: 'Star' },
    { id: '4', title: 'ധാർമ്മികത', description: 'സ്വഭാവ മഹിമയുടെ കേന്ദ്രം', icon: 'Heart' }
  ],
  gallery: [] as { id: string; url: string; alt: string }[],
  contact: {
    phone1: '+91 95441 24059',
    phone2: '+91 82811 02606',
    email: 'info@jawharathululoom.com',
    address: 'ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസ്',
    timing: 'രാവിലെ 6:00 മുതൽ വൈകുന്നേരം 6:00 വരെ'
  },
  map: {
    embedUrl: 'https://maps.app.goo.gl/ZN8C3epBni6h3hKn9?g_st=aw',
    address: 'ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസ്'
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
      const { error } = await supabase
        .from('website_content')
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
