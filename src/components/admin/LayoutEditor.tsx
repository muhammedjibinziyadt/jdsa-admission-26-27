import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save, RotateCcw } from 'lucide-react';
import { LayoutSettings } from '@/hooks/useAdminSettings';

interface LayoutEditorProps {
  layout: LayoutSettings;
  animationsEnabled: boolean;
  onSave: (layout: LayoutSettings, animationsEnabled: boolean) => Promise<boolean>;
  saving: boolean;
}

const paddingOptions = ['2rem', '3rem', '4rem', '5rem', '6rem'];
const widthOptions = ['1000px', '1100px', '1200px', '1400px', '100%'];
const radiusOptions = ['0rem', '0.5rem', '0.75rem', '1rem', '1.5rem', '2rem'];
const shadowOptions = [
  { value: 'none', label: 'ഇല്ല' },
  { value: 'soft', label: 'സോഫ്റ്റ്' },
  { value: 'elevated', label: 'എലിവേറ്റഡ്' },
  { value: 'teal', label: 'ടീൽ ഗ്ലോ' },
  { value: 'gold', label: 'ഗോൾഡ് ഗ്ലോ' }
];

export function LayoutEditor({ layout, animationsEnabled, onSave, saving }: LayoutEditorProps) {
  const [localLayout, setLocalLayout] = useState<LayoutSettings>(layout);
  const [localAnimations, setLocalAnimations] = useState(animationsEnabled);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalLayout(layout);
    setLocalAnimations(animationsEnabled);
  }, [layout, animationsEnabled]);

  useEffect(() => {
    const changed = JSON.stringify(localLayout) !== JSON.stringify(layout) || 
                    localAnimations !== animationsEnabled;
    setHasChanges(changed);
  }, [localLayout, localAnimations, layout, animationsEnabled]);

  const handleReset = () => {
    setLocalLayout(layout);
    setLocalAnimations(animationsEnabled);
  };

  const handleSave = async () => {
    const success = await onSave(localLayout, localAnimations);
    if (success) {
      setHasChanges(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">ലേഔട്ട് & ഡിസൈൻ</h2>
          <p className="text-muted-foreground mt-1">സ്പേസിംഗ്, ഷാഡോ, ആനിമേഷനുകൾ നിയന്ത്രിക്കുക</p>
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

      {/* Spacing Settings */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-6">
        <h3 className="font-semibold text-foreground">സ്പേസിംഗ് & സൈസിംഗ്</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              സെക്ഷൻ പാഡിംഗ്
            </label>
            <select
              value={localLayout.sectionPadding}
              onChange={(e) => setLocalLayout({ ...localLayout, sectionPadding: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              {paddingOptions.map(padding => (
                <option key={padding} value={padding}>{padding}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-2">
              സെക്ഷനുകൾ തമ്മിലുള്ള സ്പേസ്
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              കണ്ടെയ്നർ വിഡ്ത്ത്
            </label>
            <select
              value={localLayout.containerWidth}
              onChange={(e) => setLocalLayout({ ...localLayout, containerWidth: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              {widthOptions.map(width => (
                <option key={width} value={width}>{width}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-2">
              കണ്ടെന്റിന്റെ പരമാവധി വീതി
            </p>
          </div>
        </div>
      </div>

      {/* Box Styles */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-6">
        <h3 className="font-semibold text-foreground">ബോക്സ് സ്റ്റൈലുകൾ</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              ബോർഡർ റേഡിയസ്
            </label>
            <select
              value={localLayout.borderRadius}
              onChange={(e) => setLocalLayout({ ...localLayout, borderRadius: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              {radiusOptions.map(radius => (
                <option key={radius} value={radius}>{radius}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              കാർഡ് ഷാഡോ
            </label>
            <select
              value={localLayout.cardShadow}
              onChange={(e) => setLocalLayout({ ...localLayout, cardShadow: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              {shadowOptions.map(shadow => (
                <option key={shadow.value} value={shadow.value}>{shadow.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-6">
          <label className="text-sm font-medium text-muted-foreground mb-3 block">പ്രിവ്യൂ</label>
          <div className="grid grid-cols-3 gap-4">
            {['soft', 'elevated', 'teal'].map(shadow => (
              <div 
                key={shadow}
                className={`p-4 bg-background border border-border/50 transition-all ${
                  localLayout.cardShadow === shadow ? 'ring-2 ring-secondary' : ''
                }`}
                style={{ 
                  borderRadius: localLayout.borderRadius,
                  boxShadow: shadow === 'soft' 
                    ? '0 4px 20px -4px hsla(210, 50%, 5%, 0.35)'
                    : shadow === 'elevated'
                    ? '0 12px 40px -8px hsla(210, 50%, 5%, 0.45)'
                    : '0 8px 30px -6px hsla(187, 65%, 45%, 0.3)'
                }}
              >
                <div className="text-sm font-medium text-foreground">{shadow}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animations Toggle */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">ആനിമേഷനുകൾ</h3>
            <p className="text-sm text-muted-foreground mt-1">
              പേജ് ലോഡിംഗ്, ഹോവർ ഇഫക്റ്റുകൾ, ട്രാൻസിഷനുകൾ
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localAnimations}
              onChange={(e) => setLocalAnimations(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-muted rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-secondary"></div>
          </label>
        </div>
        
        {!localAnimations && (
          <div className="mt-4 p-4 bg-muted/30 rounded-xl">
            <p className="text-sm text-muted-foreground">
              ⚠️ ആനിമേഷനുകൾ ഓഫ് ചെയ്യുമ്പോൾ വെബ്സൈറ്റ് വേഗത കൂടും, പക്ഷേ വിഷ്വൽ എഫക്റ്റുകൾ കുറയും.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
