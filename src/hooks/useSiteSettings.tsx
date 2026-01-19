import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export interface AdminSettings {
  theme: ThemeSettings;
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
  animations_enabled: true,
  maintenance_mode: false
};

// Function to apply theme settings to DOM
export function applyThemeToDOM(theme: ThemeSettings) {
  const root = document.documentElement;
  
  if (theme.primaryColor) root.style.setProperty('--primary', theme.primaryColor);
  if (theme.secondaryColor) root.style.setProperty('--secondary', theme.secondaryColor);
  if (theme.accentColor) root.style.setProperty('--accent', theme.accentColor);
  if (theme.backgroundColor) root.style.setProperty('--background', theme.backgroundColor);
  if (theme.cardColor) root.style.setProperty('--card', theme.cardColor);
  if (theme.textPrimary) root.style.setProperty('--foreground', theme.textPrimary);
  if (theme.textSecondary) root.style.setProperty('--muted-foreground', theme.textSecondary);
  if (theme.borderColor) root.style.setProperty('--border', theme.borderColor);
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('id', 'global')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const loadedSettings: AdminSettings = {
          theme: { ...defaultSettings.theme, ...(data.theme as ThemeSettings || {}) },
          animations_enabled: data.animations_enabled ?? true,
          maintenance_mode: data.maintenance_mode ?? false
        };
        setSettings(loadedSettings);
        applyThemeToDOM(loadedSettings.theme);
      }
    } catch (error) {
      console.error('Error loading site settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return { settings, loading, refreshSettings: loadSettings };
}
