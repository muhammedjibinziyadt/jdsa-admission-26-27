import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardColor: string;
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  [key: string]: string;
}

export interface TypographySettings {
  headingFont: string;
  bodyFont: string;
  baseFontSize: string;
  headingScale: string;
  lineHeight: string;
  [key: string]: string;
}

export interface LayoutSettings {
  sectionPadding: string;
  containerWidth: string;
  borderRadius: string;
  cardShadow: string;
  [key: string]: string;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  [key: string]: string;
}

export interface AdminSettings {
  theme: ThemeSettings;
  typography: TypographySettings;
  layout: LayoutSettings;
  seo: SEOSettings;
  animations_enabled: boolean;
  maintenance_mode: boolean;
}

const defaultSettings: AdminSettings = {
  theme: {
    primaryColor: '210 60% 15%',
    secondaryColor: '187 65% 45%',
    accentColor: '43 75% 50%',
    backgroundColor: '210 55% 12%',
    cardColor: '210 50% 16%',
    textPrimary: '210 20% 98%',
    textSecondary: '210 15% 70%',
    borderColor: '210 40% 25%'
  },
  typography: {
    headingFont: 'Playfair Display',
    bodyFont: 'Inter',
    baseFontSize: '16',
    headingScale: '1.25',
    lineHeight: '1.6'
  },
  layout: {
    sectionPadding: '4rem',
    containerWidth: '1200px',
    borderRadius: '0.75rem',
    cardShadow: 'elevated'
  },
  seo: {
    metaTitle: 'ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസ്',
    metaDescription: 'ഇസ്‌ലാമിക വിദ്യാഭ്യാസവും ആധുനിക വൈദഗ്ധ്യവും സമന്വയിപ്പിച്ച് വിശ്വാസവും ഭാവിയും കെട്ടിപ്പടുക്കുന്നു',
    ogImage: ''
  },
  animations_enabled: true,
  maintenance_mode: false
};

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('id', 'global')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          theme: { ...defaultSettings.theme, ...(data.theme as ThemeSettings || {}) },
          typography: { ...defaultSettings.typography, ...(data.typography as TypographySettings || {}) },
          layout: { ...defaultSettings.layout, ...(data.layout as LayoutSettings || {}) },
          seo: { ...defaultSettings.seo, ...(data.seo as SEOSettings || {}) },
          animations_enabled: data.animations_enabled ?? true,
          maintenance_mode: data.maintenance_mode ?? false
        });
      }
    } catch (error) {
      console.error('Error loading admin settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSettings = useCallback(async (newSettings: Partial<AdminSettings>) => {
    setSaving(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('admin_settings') as any).upsert({
        id: 'global',
        theme: updatedSettings.theme,
        typography: updatedSettings.typography,
        layout: updatedSettings.layout,
        seo: updatedSettings.seo,
        animations_enabled: updatedSettings.animations_enabled,
        maintenance_mode: updatedSettings.maintenance_mode,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;

      setSettings(updatedSettings);
      
      // Apply theme changes to CSS variables
      applyThemeToDOM(updatedSettings.theme);
      
      toast({
        title: 'സേവ് ചെയ്തു!',
        description: 'സെറ്റിംഗ്സ് വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു'
      });
      
      return true;
    } catch (error) {
      console.error('Error saving admin settings:', error);
      toast({
        title: 'പിശക്!',
        description: 'സെറ്റിംഗ്സ് സേവ് ചെയ്യാൻ കഴിഞ്ഞില്ല',
        variant: 'destructive'
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [settings, toast]);

  const logActivity = useCallback(async (action: string, details?: Record<string, unknown>) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('admin_activity_logs') as any).insert({
        admin_username: 'admin',
        action,
        details: details || {}
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Apply theme on initial load
  useEffect(() => {
    if (!loading) {
      applyThemeToDOM(settings.theme);
    }
  }, [loading, settings.theme]);

  return { 
    settings, 
    loading, 
    saving, 
    saveSettings, 
    refreshSettings: loadSettings,
    logActivity 
  };
}

// Function to apply theme settings to DOM
function applyThemeToDOM(theme: ThemeSettings) {
  const root = document.documentElement;
  
  root.style.setProperty('--primary', theme.primaryColor);
  root.style.setProperty('--secondary', theme.secondaryColor);
  root.style.setProperty('--accent', theme.accentColor);
  root.style.setProperty('--background', theme.backgroundColor);
  root.style.setProperty('--card', theme.cardColor);
  root.style.setProperty('--foreground', theme.textPrimary);
  root.style.setProperty('--muted-foreground', theme.textSecondary);
  root.style.setProperty('--border', theme.borderColor);
}
