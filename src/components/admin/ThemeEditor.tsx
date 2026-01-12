import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save, RotateCcw, Eye } from 'lucide-react';
import { ThemeSettings } from '@/hooks/useAdminSettings';

interface ThemeEditorProps {
  theme: ThemeSettings;
  onSave: (theme: ThemeSettings) => Promise<boolean>;
  saving: boolean;
}

interface ColorPickerProps {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
}

function hslToHex(hsl: string): string {
  const match = hsl.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
  if (!match) return '#000000';
  
  const h = parseFloat(match[1]);
  const s = parseFloat(match[2]) / 100;
  const l = parseFloat(match[3]) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0 0% 0%';

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function ColorPicker({ label, description, value, onChange }: ColorPickerProps) {
  const hexValue = hslToHex(value);
  
  return (
    <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
      <div className="flex-1">
        <label className="font-medium text-foreground">{label}</label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-lg border-2 border-border shadow-sm"
          style={{ backgroundColor: `hsl(${value})` }}
        />
        <input
          type="color"
          value={hexValue}
          onChange={(e) => onChange(hexToHsl(e.target.value))}
          className="w-12 h-10 rounded-lg cursor-pointer border-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-40 px-3 py-2 text-sm bg-background border border-border rounded-lg font-mono"
          placeholder="H S% L%"
        />
      </div>
    </div>
  );
}

const presetThemes = {
  navy: {
    name: 'നേവി ബ്ലൂ',
    primaryColor: '210 60% 15%',
    secondaryColor: '187 65% 45%',
    accentColor: '43 75% 50%',
    backgroundColor: '210 55% 12%',
    cardColor: '210 50% 16%',
    textPrimary: '210 20% 98%',
    textSecondary: '210 15% 70%',
    borderColor: '210 40% 25%'
  },
  emerald: {
    name: 'എമറാൾഡ് ഗ്രീൻ',
    primaryColor: '158 64% 22%',
    secondaryColor: '158 50% 35%',
    accentColor: '38 78% 52%',
    backgroundColor: '158 40% 10%',
    cardColor: '158 35% 14%',
    textPrimary: '42 40% 97%',
    textSecondary: '158 20% 65%',
    borderColor: '158 30% 25%'
  },
  royal: {
    name: 'റോയൽ പർപ്പിൾ',
    primaryColor: '270 60% 25%',
    secondaryColor: '280 50% 45%',
    accentColor: '45 80% 55%',
    backgroundColor: '270 50% 10%',
    cardColor: '270 45% 15%',
    textPrimary: '270 20% 98%',
    textSecondary: '270 15% 70%',
    borderColor: '270 35% 25%'
  },
  ocean: {
    name: 'ഓഷ്യൻ ബ്ലൂ',
    primaryColor: '200 70% 20%',
    secondaryColor: '195 65% 45%',
    accentColor: '40 85% 55%',
    backgroundColor: '200 60% 8%',
    cardColor: '200 55% 12%',
    textPrimary: '200 15% 98%',
    textSecondary: '200 20% 70%',
    borderColor: '200 40% 22%'
  }
};

export function ThemeEditor({ theme, onSave, saving }: ThemeEditorProps) {
  const [localTheme, setLocalTheme] = useState<ThemeSettings>(theme);
  const [previewMode, setPreviewMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  useEffect(() => {
    const changed = JSON.stringify(localTheme) !== JSON.stringify(theme);
    setHasChanges(changed);
  }, [localTheme, theme]);

  // Live preview
  useEffect(() => {
    if (previewMode) {
      const root = document.documentElement;
      root.style.setProperty('--primary', localTheme.primaryColor);
      root.style.setProperty('--secondary', localTheme.secondaryColor);
      root.style.setProperty('--accent', localTheme.accentColor);
      root.style.setProperty('--background', localTheme.backgroundColor);
      root.style.setProperty('--card', localTheme.cardColor);
      root.style.setProperty('--foreground', localTheme.textPrimary);
      root.style.setProperty('--muted-foreground', localTheme.textSecondary);
      root.style.setProperty('--border', localTheme.borderColor);
    }
  }, [localTheme, previewMode]);

  const handleReset = () => {
    setLocalTheme(theme);
    if (previewMode) {
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
  };

  const handleApplyPreset = (preset: typeof presetThemes.navy) => {
    setLocalTheme(preset);
  };

  const handleSave = async () => {
    const success = await onSave(localTheme);
    if (success) {
      setHasChanges(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">കളർ തീം സെറ്റിംഗ്സ്</h2>
          <p className="text-muted-foreground mt-1">വെബ്സൈറ്റിന്റെ മുഴുവൻ നിറ ഘടന നിയന്ത്രിക്കുക</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="rounded-xl"
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'പ്രിവ്യൂ ഓഫ്' : 'ലൈവ് പ്രിവ്യൂ'}
          </Button>
          {hasChanges && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="rounded-xl"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              റീസെറ്റ്
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="rounded-xl"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            സേവ് ചെയ്യുക
          </Button>
        </div>
      </div>

      {/* Preset Themes */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
        <h3 className="font-semibold text-foreground mb-4">പ്രീസെറ്റ് തീമുകൾ</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(presetThemes).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handleApplyPreset(preset)}
              className="p-4 rounded-xl border border-border/50 hover:border-secondary transition-all text-left group"
            >
              <div className="flex gap-1 mb-3">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: `hsl(${preset.primaryColor})` }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: `hsl(${preset.secondaryColor})` }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: `hsl(${preset.accentColor})` }} />
              </div>
              <span className="font-medium text-foreground group-hover:text-secondary transition-colors">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Pickers */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-4">
        <h3 className="font-semibold text-foreground mb-4">കളർ കസ്റ്റമൈസേഷൻ</h3>
        
        <ColorPicker
          label="പ്രൈമറി കളർ"
          description="പ്രധാന ബ്രാൻഡ് നിറം"
          value={localTheme.primaryColor}
          onChange={(v) => setLocalTheme({ ...localTheme, primaryColor: v })}
        />
        
        <ColorPicker
          label="സെക്കൻഡറി കളർ (ടീൽ)"
          description="ഹൈലൈറ്റുകൾക്കും ആക്സന്റുകൾക്കും"
          value={localTheme.secondaryColor}
          onChange={(v) => setLocalTheme({ ...localTheme, secondaryColor: v })}
        />
        
        <ColorPicker
          label="ആക്സന്റ് കളർ (ഗോൾഡ്)"
          description="പ്രത്യേക ഹൈലൈറ്റുകൾക്ക്"
          value={localTheme.accentColor}
          onChange={(v) => setLocalTheme({ ...localTheme, accentColor: v })}
        />
        
        <ColorPicker
          label="ബാക്ക്‌ഗ്രൗണ്ട് കളർ"
          description="പേജ് ബാക്ക്‌ഗ്രൗണ്ട്"
          value={localTheme.backgroundColor}
          onChange={(v) => setLocalTheme({ ...localTheme, backgroundColor: v })}
        />
        
        <ColorPicker
          label="കാർഡ് കളർ"
          description="കാർഡുകളുടെ ബാക്ക്‌ഗ്രൗണ്ട്"
          value={localTheme.cardColor}
          onChange={(v) => setLocalTheme({ ...localTheme, cardColor: v })}
        />
        
        <ColorPicker
          label="ടെക്സ്റ്റ് പ്രൈമറി"
          description="ഹെഡിംഗ്സും പ്രധാന ടെക്സ്റ്റും"
          value={localTheme.textPrimary}
          onChange={(v) => setLocalTheme({ ...localTheme, textPrimary: v })}
        />
        
        <ColorPicker
          label="ടെക്സ്റ്റ് സെക്കൻഡറി"
          description="വിവരണങ്ങളും മ്യൂട്ടഡ് ടെക്സ്റ്റും"
          value={localTheme.textSecondary}
          onChange={(v) => setLocalTheme({ ...localTheme, textSecondary: v })}
        />
        
        <ColorPicker
          label="ബോർഡർ കളർ"
          description="കാർഡ് ബോർഡറുകൾക്ക്"
          value={localTheme.borderColor}
          onChange={(v) => setLocalTheme({ ...localTheme, borderColor: v })}
        />
      </div>

      {/* Preview Card */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
        <h3 className="font-semibold text-foreground mb-4">പ്രിവ്യൂ</h3>
        <div 
          className="rounded-xl p-6 space-y-4"
          style={{ backgroundColor: `hsl(${localTheme.backgroundColor})` }}
        >
          <div 
            className="rounded-lg p-4"
            style={{ 
              backgroundColor: `hsl(${localTheme.cardColor})`,
              borderColor: `hsl(${localTheme.borderColor})`,
              borderWidth: '1px'
            }}
          >
            <h4 
              className="text-lg font-bold mb-2"
              style={{ color: `hsl(${localTheme.textPrimary})` }}
            >
              സാമ്പിൾ ഹെഡിംഗ്
            </h4>
            <p 
              className="text-sm mb-4"
              style={{ color: `hsl(${localTheme.textSecondary})` }}
            >
              ഇത് ഒരു സാമ്പിൾ ടെക്സ്റ്റ് ആണ്. നിറങ്ങൾ എങ്ങനെ കാണപ്പെടുന്നുവെന്ന് പരിശോധിക്കുക.
            </p>
            <div className="flex gap-3">
              <button 
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ 
                  backgroundColor: `hsl(${localTheme.secondaryColor})`,
                  color: `hsl(${localTheme.backgroundColor})`
                }}
              >
                പ്രൈമറി ബട്ടൺ
              </button>
              <button 
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ 
                  backgroundColor: `hsl(${localTheme.accentColor})`,
                  color: `hsl(${localTheme.backgroundColor})`
                }}
              >
                ആക്സന്റ് ബട്ടൺ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
