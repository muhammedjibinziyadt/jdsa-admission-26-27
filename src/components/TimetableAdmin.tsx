import { useState } from 'react';
import { useTimetables, TimetableEntry } from '@/hooks/useTimetables';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit3, Save, X, Loader2, Phone, Keyboard, Sparkles } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const CATEGORIES = [
  { value: 'calling', label: 'Calling', icon: Phone },
  { value: 'typing', label: 'Computer Typing', icon: Keyboard },
  { value: 'cleaning', label: 'Cleaning', icon: Sparkles },
] as const;

export default function TimetableAdmin() {
  const { entries, loading, addEntry, updateEntry, deleteEntry } = useTimetables();
  const [activeCategory, setActiveCategory] = useState<'calling' | 'typing' | 'cleaning'>('calling');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ day: 'Monday', time_slot: '', activity: '', sort_order: 0 });
  const [saving, setSaving] = useState(false);

  const filtered = entries.filter(e => e.category === activeCategory);

  const handleAdd = async () => {
    if (!form.time_slot.trim() || !form.activity.trim()) return;
    setSaving(true);
    await addEntry({ ...form, category: activeCategory });
    setSaving(false);
    setForm({ day: 'Monday', time_slot: '', activity: '', sort_order: 0 });
    setShowForm(false);
  };

  const handleUpdate = async () => {
    if (!editingId || !form.time_slot.trim() || !form.activity.trim()) return;
    setSaving(true);
    await updateEntry(editingId, form);
    setSaving(false);
    setEditingId(null);
    setForm({ day: 'Monday', time_slot: '', activity: '', sort_order: 0 });
  };

  const startEdit = (entry: TimetableEntry) => {
    setEditingId(entry.id);
    setForm({ day: entry.day, time_slot: entry.time_slot, activity: entry.activity, sort_order: entry.sort_order });
    setShowForm(false);
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-foreground">ടൈം ടേബിൾ മാനേജ്മെന്റ്</h2>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <Button
            key={cat.value}
            variant={activeCategory === cat.value ? 'default' : 'outline'}
            onClick={() => { setActiveCategory(cat.value); setShowForm(false); setEditingId(null); }}
            className="rounded-xl"
          >
            <cat.icon className="w-4 h-4 mr-2" />
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Add Button */}
      <Button onClick={() => { setShowForm(true); setEditingId(null); setForm({ day: 'Monday', time_slot: '', activity: '', sort_order: filtered.length }); }} className="rounded-xl">
        <Plus className="w-4 h-4 mr-2" /> Add Entry
      </Button>

      {/* Add/Edit Form */}
      {(showForm || editingId) && (
        <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-4">
          <h3 className="font-medium">{editingId ? 'Edit Entry' : 'New Entry'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Day</label>
              <Select value={form.day} onValueChange={v => setForm(p => ({ ...p, day: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Time Slot</label>
              <Input value={form.time_slot} onChange={e => setForm(p => ({ ...p, time_slot: e.target.value }))} placeholder="e.g. 9:00 AM - 10:00 AM" className="rounded-xl" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-muted-foreground mb-1 block">Activity</label>
              <Input value={form.activity} onChange={e => setForm(p => ({ ...p, activity: e.target.value }))} placeholder="Activity name" className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Sort Order</label>
              <Input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} className="rounded-xl" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={editingId ? handleUpdate : handleAdd} disabled={saving} className="rounded-xl">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {editingId ? 'Update' : 'Save'}
            </Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }} className="rounded-xl">
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Entries List */}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No entries for this category yet.</p>
      ) : (
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Day</th>
                <th className="text-left p-3 font-medium">Time</th>
                <th className="text-left p-3 font-medium">Activity</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(entry => (
                <tr key={entry.id} className="border-t border-border/50 hover:bg-muted/30">
                  <td className="p-3">{entry.day}</td>
                  <td className="p-3">{entry.time_slot}</td>
                  <td className="p-3">{entry.activity}</td>
                  <td className="p-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => startEdit(entry)}><Edit3 className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteEntry(entry.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
