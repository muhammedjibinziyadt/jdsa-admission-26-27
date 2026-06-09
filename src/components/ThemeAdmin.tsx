import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Palette, Check, Eye, RotateCcw, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme, THEME_PRESETS, hexToHsl, hslToHex } from '@/hooks/useTheme';

export default function ThemeAdmin() {
  const { theme, applyPreview, resetPreview, save } = useTheme();
  const [draft, setDraft] = useState(theme);
  const [previewing, setPreviewing] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectPreset = (p: typeof THEME_PRESETS[0]) => {
    const next = { preset: p.id, primary: p.primary, secondary: p.secondary, accent: p.accent };
    setDraft(next);
    applyPreview(next);
    setPreviewing(true);
  };

  const updateColor = (key: 'primary' | 'secondary' | 'accent', hex: string) => {
    const hsl = hexToHsl(hex);
    const next = { ...draft, preset: 'custom', [key]: hsl };
    setDraft(next);
    applyPreview(next);
    setPreviewing(true);
  };

  const handlePreview = () => { applyPreview(draft); setPreviewing(true); };
  const handleReset = () => { resetPreview(); setDraft(theme); setPreviewing(false); };

  const handleApply = async () => {
    setSaving(true);
    await save(draft);
    setSaving(false);
    setPreviewing(false);
    toast.success('Theme applied across the website');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Palette className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-display font-semibold">Theme Manager</h2>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Preset Themes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {THEME_PRESETS.map((p) => {
            const active = draft.preset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => selectPreset(p)}
                className={`text-left rounded-xl border-2 transition p-3 hover:shadow-md ${active ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
              >
                <div className="flex gap-1.5 mb-2">
                  <div className="w-10 h-10 rounded-lg" style={{ background: `hsl(${p.primary})` }} />
                  <div className="w-10 h-10 rounded-lg" style={{ background: `hsl(${p.secondary})` }} />
                  <div className="w-10 h-10 rounded-lg border border-border" style={{ background: `hsl(${p.accent})` }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{p.label}</span>
                  {active && <Check className="w-4 h-4 text-primary" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Custom Colors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['primary', 'secondary', 'accent'] as const).map((k) => (
            <div key={k} className="border border-border rounded-xl p-3">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{k}</label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="color"
                  value={hslToHex(draft[k])}
                  onChange={(e) => updateColor(k, e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer border border-border"
                />
                <Input value={draft[k]} onChange={(e) => { const n = { ...draft, preset: 'custom', [k]: e.target.value }; setDraft(n); applyPreview(n); setPreviewing(true); }} className="font-mono text-xs" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-border rounded-xl p-4 bg-muted/30">
        <p className="text-xs font-medium text-muted-foreground mb-3">Live Preview</p>
        <div className="flex flex-wrap gap-2">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <span className="px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm">Accent Badge</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
        <Button onClick={handlePreview} variant="outline"><Eye className="w-4 h-4 mr-2" />Preview</Button>
        <Button onClick={handleReset} variant="outline" disabled={!previewing}><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
        <Button onClick={handleApply} disabled={saving} className="ml-auto">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Apply Theme
        </Button>
      </div>
    </div>
  );
}
