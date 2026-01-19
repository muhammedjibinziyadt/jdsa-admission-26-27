import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save, RotateCcw } from 'lucide-react';
import { TypographySettings } from '@/hooks/useAdminSettings';

interface TypographyEditorProps {
  typography: TypographySettings;
  onSave: (typography: TypographySettings) => Promise<boolean>;
  saving: boolean;
}

const fontOptions = [
  { value: 'Playfair Display', label: 'Playfair Display', type: 'serif' },
  { value: 'Inter', label: 'Inter', type: 'sans' },
  { value: 'Space Grotesk', label: 'Space Grotesk', type: 'sans' },
  { value: 'Lora', label: 'Lora', type: 'serif' },
  { value: 'Poppins', label: 'Poppins', type: 'sans' },
  { value: 'Roboto', label: 'Roboto', type: 'sans' },
  { value: 'Open Sans', label: 'Open Sans', type: 'sans' },
  { value: 'Noto Sans Malayalam', label: 'Noto Sans Malayalam', type: 'sans' },
  { value: 'Manjari', label: 'Manjari (Malayalam)', type: 'sans' },
  { value: 'Chilanka', label: 'Chilanka (Malayalam)', type: 'handwriting' },
  { value: 'Noto Nastaliq Urdu', label: 'Noto Nastaliq Urdu (Arabic)', type: 'arabic' },
  { value: 'Amiri', label: 'Amiri (Arabic)', type: 'arabic' }
];

const fontSizes = ['14', '15', '16', '17', '18'];
const lineHeights = ['1.4', '1.5', '1.6', '1.7', '1.8'];
const headingScales = ['1.125', '1.2', '1.25', '1.333', '1.5'];

export function TypographyEditor({ typography, onSave, saving }: TypographyEditorProps) {
  const [localTypography, setLocalTypography] = useState<TypographySettings>(typography);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalTypography(typography);
  }, [typography]);

  useEffect(() => {
    const changed = JSON.stringify(localTypography) !== JSON.stringify(typography);
    setHasChanges(changed);
  }, [localTypography, typography]);

  const handleReset = () => {
    setLocalTypography(typography);
  };

  const handleSave = async () => {
    const success = await onSave(localTypography);
    if (success) {
      setHasChanges(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">ടൈപ്പോഗ്രാഫി സെറ്റിംഗ്സ്</h2>
          <p className="text-muted-foreground mt-1">ഫോണ്ടുകളും ടെക്സ്റ്റ് സ്റ്റൈലുകളും നിയന്ത്രിക്കുക</p>
        </div>
        <div className="flex gap-3">
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

      {/* Font Selection */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-6">
        <h3 className="font-semibold text-foreground">ഫോണ്ട് സെലക്ഷൻ</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              ഹെഡിംഗ് ഫോണ്ട്
            </label>
            <select
              value={localTypography.headingFont}
              onChange={(e) => setLocalTypography({ ...localTypography, headingFont: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              {fontOptions.map(font => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-2">
              H1, H2, H3 തുടങ്ങിയ ഹെഡിംഗുകൾക്ക് ഉപയോഗിക്കും
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              ബോഡി ഫോണ്ട്
            </label>
            <select
              value={localTypography.bodyFont}
              onChange={(e) => setLocalTypography({ ...localTypography, bodyFont: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              {fontOptions.map(font => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-2">
              പാരഗ്രാഫുകളും സാധാരണ ടെക്സ്റ്റും
            </p>
          </div>
        </div>
      </div>

      {/* Font Sizes */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-6">
        <h3 className="font-semibold text-foreground">ഫോണ്ട് സൈസ്</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              ബേസ് ഫോണ്ട് സൈസ് (px)
            </label>
            <select
              value={localTypography.baseFontSize}
              onChange={(e) => setLocalTypography({ ...localTypography, baseFontSize: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              {fontSizes.map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              ഹെഡിംഗ് സ്കെയിൽ
            </label>
            <select
              value={localTypography.headingScale}
              onChange={(e) => setLocalTypography({ ...localTypography, headingScale: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              {headingScales.map(scale => (
                <option key={scale} value={scale}>{scale}x</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-2">
              ഹെഡിംഗ് ലെവലുകൾ തമ്മിലുള്ള അനുപാതം
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              ലൈൻ ഹൈറ്റ്
            </label>
            <select
              value={localTypography.lineHeight}
              onChange={(e) => setLocalTypography({ ...localTypography, lineHeight: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              {lineHeights.map(height => (
                <option key={height} value={height}>{height}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
        <h3 className="font-semibold text-foreground mb-6">പ്രിവ്യൂ</h3>
        
        <div className="space-y-6 p-6 bg-background rounded-xl">
          <h1 
            className="text-3xl font-bold"
            style={{ 
              fontFamily: localTypography.headingFont,
              lineHeight: localTypography.lineHeight
            }}
          >
            ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസ്
          </h1>
          
          <h2 
            className="text-2xl font-semibold"
            style={{ 
              fontFamily: localTypography.headingFont,
              lineHeight: localTypography.lineHeight
            }}
          >
            ഇസ്‌ലാമിക വിദ്യാഭ്യാസത്തിന്റെ കേന്ദ്രം
          </h2>
          
          <h3 
            className="text-xl font-medium"
            style={{ 
              fontFamily: localTypography.headingFont,
              lineHeight: localTypography.lineHeight
            }}
          >
            കോഴ്‌സുകളും സൗകര്യങ്ങളും
          </h3>
          
          <p 
            className="text-muted-foreground"
            style={{ 
              fontFamily: localTypography.bodyFont,
              fontSize: `${localTypography.baseFontSize}px`,
              lineHeight: localTypography.lineHeight
            }}
          >
            ഇസ്‌ലാമിക പാരമ്പര്യവും ആധുനിക വിദ്യാഭ്യാസവും സമന്വയിപ്പിച്ച് വിദ്യാർത്ഥികളെ സമഗ്രമായി 
            വളർത്തിയെടുക്കുന്നു. മതപരമായ അറിവിനൊപ്പം പ്രായോഗിക കഴിവുകളും നേതൃത്വ ഗുണങ്ങളും 
            വികസിപ്പിക്കാൻ ഞങ്ങൾ പ്രതിജ്ഞാബദ്ധരാണ്.
          </p>
          
          <p 
            className="text-sm text-muted-foreground"
            style={{ 
              fontFamily: localTypography.bodyFont,
              lineHeight: localTypography.lineHeight
            }}
          >
            Arabic Sample: بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
        </div>
      </div>
    </div>
  );
}
