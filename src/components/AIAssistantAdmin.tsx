import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Loader2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function AIAssistantAdmin() {
  const [enabled, setEnabled] = useState(true);
  const [welcome, setWelcome] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('ai_assistant_settings').select('*').eq('id', 'global').maybeSingle().then(({ data }) => {
      if (data) { setEnabled(!!data.enabled); setWelcome(data.welcome_message || ''); }
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('ai_assistant_settings').upsert({ id: 'global', enabled, welcome_message: welcome, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) toast.error('Save failed'); else toast.success('AI Assistant settings saved');
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin" /></div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border p-5 space-y-4">
      <h3 className="font-semibold flex items-center gap-2"><Bot className="w-4 h-4 text-primary" /> AI Assistant</h3>
      <label className="flex items-center justify-between gap-3 p-3 bg-muted rounded-xl">
        <div>
          <p className="text-sm font-medium">Enable AI Assistant</p>
          <p className="text-xs text-muted-foreground">Show floating chat button on every page</p>
        </div>
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="w-5 h-5 accent-primary" />
      </label>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Welcome message</label>
        <Input value={welcome} onChange={(e) => setWelcome(e.target.value)} placeholder="Welcome message…" className="mt-1" />
      </div>
      <Button onClick={save} disabled={saving} className="w-full">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save
      </Button>
    </div>
  );
}
