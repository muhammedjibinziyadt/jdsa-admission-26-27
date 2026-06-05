import { useEffect, useState } from 'react';
import { Bell, Plus, Pencil, Trash2, X, Save, Loader2, AlertTriangle, Info, Megaphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAdminGate } from '@/hooks/useAdminGate';
import { useLanguage } from '@/hooks/useLanguage';

type Priority = 'normal' | 'important' | 'urgent';
interface Notif {
  id: string;
  committee_id: string; // 'central' | 'jawahir' | 'samaja' | 'library' | 'all'
  title: string;
  message: string;
  priority: Priority;
  notice_date: string;
  created_at: string;
}

const COMMITTEE_OPTIONS = [
  { id: 'all', name: 'All Committees' },
  { id: 'central', name: 'Central' },
  { id: 'jawahir', name: 'Al Jawahir' },
  { id: 'samaja', name: 'Samaj' },
  { id: 'library', name: 'Library' },
];

const PRIORITY_STYLES: Record<Priority, { box: string; chip: string; icon: any; label: string }> = {
  urgent: { box: 'bg-red-50 border-red-300', chip: 'bg-red-600 text-white', icon: AlertTriangle, label: 'Urgent' },
  important: { box: 'bg-yellow-50 border-yellow-300', chip: 'bg-yellow-500 text-white', icon: Megaphone, label: 'Important' },
  normal: { box: 'bg-white border-border', chip: 'bg-slate-200 text-slate-700', icon: Info, label: 'Normal' },
};

interface Props {
  committeeId: string; // 'central' | 'jawahir' | 'samaja' | 'library'
  showAdminControls?: boolean; // default true, with password gate
}

export default function NotificationsBanner({ committeeId, showAdminControls = true }: Props) {
  const { t } = useLanguage();
  const { requireAdmin } = useAdminGate();
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Notif | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('committee_notifications')
      .select('*')
      .in('committee_id', [committeeId, 'all'])
      .order('created_at', { ascending: false });
    if (error) { toast.error('Load failed'); }
    setItems((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [committeeId]);

  const startCreate = () => requireAdmin(() => {
    setEditing({ id: '', committee_id: committeeId, title: '', message: '', priority: 'normal', notice_date: new Date().toISOString().slice(0, 10), created_at: '' });
    setShowForm(true);
  });

  const startEdit = (n: Notif) => requireAdmin(() => { setEditing({ ...n }); setShowForm(true); });

  const remove = (id: string) => requireAdmin(async () => {
    if (!confirm('Delete this notification?')) return;
    const { error } = await supabase.from('committee_notifications').delete().eq('id', id);
    if (error) toast.error('Delete failed'); else { toast.success('Deleted'); load(); }
  });

  const save = async () => {
    if (!editing) return;
    const payload = {
      committee_id: editing.committee_id,
      title: editing.title.trim(),
      message: editing.message.trim(),
      priority: editing.priority,
      notice_date: editing.notice_date,
    };
    if (!payload.title || !payload.message) { toast.error('Title and message required'); return; }
    let err;
    if (editing.id) {
      ({ error: err } = await supabase.from('committee_notifications').update(payload).eq('id', editing.id) as any);
    } else {
      ({ error: err } = await supabase.from('committee_notifications').insert(payload as any) as any);
    }
    if (err) toast.error('Save failed'); else { toast.success('Saved'); setShowForm(false); setEditing(null); load(); }
  };

  return (
    <section className="bg-white rounded-2xl border border-border shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2 text-slate-800">
          <Bell className="w-4 h-4 text-primary" />
          {t('നോട്ടിഫിക്കേഷനുകൾ', 'Notifications')}
          {items.length > 0 && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">{items.length}</span>
          )}
        </h3>
        {showAdminControls && (
          <button onClick={startCreate} className="text-xs px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground inline-flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> {t('പുതിയത്', 'New')}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
      ) : items.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-3">{t('നോട്ടിഫിക്കേഷനുകൾ ഇല്ല', 'No notifications yet')}</p>
      ) : (
        <div className="space-y-2">
          {items.map((n) => {
            const s = PRIORITY_STYLES[n.priority];
            const Icon = s.icon;
            return (
              <div key={n.id} className={`border rounded-xl p-3 ${s.box}`}>
                <div className="flex items-start gap-2">
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${n.priority === 'urgent' ? 'text-red-600' : n.priority === 'important' ? 'text-yellow-600' : 'text-slate-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm text-slate-900">{n.title}</h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase ${s.chip}`}>{s.label}</span>
                      {n.committee_id === 'all' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">All</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{n.notice_date}</p>
                  </div>
                  {showAdminControls && (
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => startEdit(n)} className="p-1.5 rounded-lg hover:bg-white"><Pencil className="w-3.5 h-3.5 text-slate-600" /></button>
                      <button onClick={() => remove(n.id)} className="p-1.5 rounded-lg hover:bg-white"><Trash2 className="w-3.5 h-3.5 text-red-600" /></button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && editing && (
        <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{editing.id ? 'Edit Notification' : 'New Notification'}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <input className="w-full px-3 py-2 rounded-lg border border-border text-sm" placeholder="Title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            <textarea className="w-full px-3 py-2 rounded-lg border border-border text-sm" placeholder="Message" rows={4} value={editing.message} onChange={(e) => setEditing({ ...editing, message: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <select className="px-3 py-2 rounded-lg border border-border text-sm" value={editing.committee_id} onChange={(e) => setEditing({ ...editing, committee_id: e.target.value })}>
                {COMMITTEE_OPTIONS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select className="px-3 py-2 rounded-lg border border-border text-sm" value={editing.priority} onChange={(e) => setEditing({ ...editing, priority: e.target.value as Priority })}>
                <option value="normal">Normal</option>
                <option value="important">Important</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <input type="date" className="w-full px-3 py-2 rounded-lg border border-border text-sm" value={editing.notice_date} onChange={(e) => setEditing({ ...editing, notice_date: e.target.value })} />
            <button onClick={save} className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium inline-flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
