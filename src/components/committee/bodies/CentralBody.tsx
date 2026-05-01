import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit2, Loader2, FileText, ClipboardList, Package } from 'lucide-react';
import CommitteeSection from '@/components/CommitteeSection';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useCommitteeTable } from '@/hooks/useCommitteeTable';
import EditEntryDialog from '@/components/committee/EditEntryDialog';

interface Update { id: string; title: string; content: string | null; entry_date: string; }
interface ItemUsage { id: string; item_name: string; used_by: string | null; quantity: number | null; notes: string | null; entry_date: string; }
interface Minute { id: string; meeting_date: string; notes: string; }

export default function CentralBody() {
  const { isAuthenticated } = useAdminAuth();
  const updates = useCommitteeTable<Update>('central_updates', 'entry_date');
  const usage = useCommitteeTable<ItemUsage>('central_item_usage', 'entry_date');
  const minutes = useCommitteeTable<Minute>('central_minutes', 'meeting_date');

  const [updateForm, setUpdateForm] = useState({ title: '', content: '' });
  const [usageForm, setUsageForm] = useState({ item_name: '', used_by: '', quantity: '', notes: '' });
  const [minuteForm, setMinuteForm] = useState({ meeting_date: new Date().toISOString().slice(0, 10), notes: '' });

  const [editUpdate, setEditUpdate] = useState<Update | null>(null);
  const [editUsage, setEditUsage] = useState<ItemUsage | null>(null);
  const [editMinute, setEditMinute] = useState<Minute | null>(null);

  return (
    <>
      <CommitteeSection />

      <section className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5">
        <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-2 mb-4">
          <ClipboardList className="w-4 h-4" /> കമ്മിറ്റി അപ്‌ഡേറ്റുകൾ
        </h3>
        {isAuthenticated && (
          <form onSubmit={async (e) => { e.preventDefault(); if (!updateForm.title.trim()) return; const ok = await updates.insert({ title: updateForm.title, content: updateForm.content || null }); if (ok) setUpdateForm({ title: '', content: '' }); }} className="space-y-2 mb-4 p-3 bg-emerald-50 rounded-xl">
            <Input placeholder="Title" value={updateForm.title} onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })} className="rounded-lg" />
            <textarea placeholder="Details" value={updateForm.content} onChange={(e) => setUpdateForm({ ...updateForm, content: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm" rows={2} />
            <Button size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700"><Plus className="w-3.5 h-3.5 mr-1" /> Add Update</Button>
          </form>
        )}
        {updates.loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : updates.rows.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">അപ്‌ഡേറ്റുകൾ ഇല്ല</p>
        ) : (
          <div className="space-y-2">{updates.rows.map((u) => (
            <div key={u.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between gap-3">
              <div className="min-w-0 flex-1"><p className="font-medium text-gray-800 text-sm">{u.title}</p>{u.content && <p className="text-xs text-gray-600 mt-0.5 whitespace-pre-wrap">{u.content}</p>}<p className="text-xs text-gray-400 mt-1">{new Date(u.entry_date).toLocaleDateString('en-IN')}</p></div>
              {isAuthenticated && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditUpdate(u)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => updates.remove(u.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5">
        <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-2 mb-4">
          <Package className="w-4 h-4" /> ഓഫീസ് ഇനങ്ങളുടെ ഉപയോഗം
        </h3>
        {isAuthenticated && (
          <form onSubmit={async (e) => { e.preventDefault(); if (!usageForm.item_name.trim()) return; const ok = await usage.insert({ item_name: usageForm.item_name, used_by: usageForm.used_by || null, quantity: usageForm.quantity ? Number(usageForm.quantity) : null, notes: usageForm.notes || null }); if (ok) setUsageForm({ item_name: '', used_by: '', quantity: '', notes: '' }); }} className="space-y-2 mb-4 p-3 bg-emerald-50 rounded-xl">
            <Input placeholder="Item name" value={usageForm.item_name} onChange={(e) => setUsageForm({ ...usageForm, item_name: e.target.value })} className="rounded-lg" />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Used by" value={usageForm.used_by} onChange={(e) => setUsageForm({ ...usageForm, used_by: e.target.value })} className="rounded-lg" />
              <Input placeholder="Qty" type="number" value={usageForm.quantity} onChange={(e) => setUsageForm({ ...usageForm, quantity: e.target.value })} className="rounded-lg" />
            </div>
            <Input placeholder="Notes" value={usageForm.notes} onChange={(e) => setUsageForm({ ...usageForm, notes: e.target.value })} className="rounded-lg" />
            <Button size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700"><Plus className="w-3.5 h-3.5 mr-1" /> Add Usage</Button>
          </form>
        )}
        {usage.loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : usage.rows.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">ഉപയോഗ റെക്കോർഡുകൾ ഇല്ല</p>
        ) : (
          <div className="space-y-2">{usage.rows.map((u) => (
            <div key={u.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between gap-3">
              <div className="min-w-0 flex-1"><p className="font-medium text-gray-800 text-sm">{u.item_name}{u.quantity != null && <span className="text-gray-500"> × {u.quantity}</span>}</p>{u.used_by && <p className="text-xs text-gray-600">By: {u.used_by}</p>}{u.notes && <p className="text-xs text-gray-500">{u.notes}</p>}<p className="text-xs text-gray-400 mt-1">{new Date(u.entry_date).toLocaleDateString('en-IN')}</p></div>
              {isAuthenticated && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditUsage(u)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => usage.remove(u.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5">
        <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4" /> മിനിറ്റ്സ് ബുക്ക്
        </h3>
        {isAuthenticated && (
          <form onSubmit={async (e) => { e.preventDefault(); if (!minuteForm.notes.trim()) return; const ok = await minutes.insert({ meeting_date: minuteForm.meeting_date, notes: minuteForm.notes }); if (ok) setMinuteForm({ meeting_date: new Date().toISOString().slice(0, 10), notes: '' }); }} className="space-y-2 mb-4 p-3 bg-emerald-50 rounded-xl">
            <div><Label className="text-xs text-emerald-700">Meeting Date</Label><Input type="date" value={minuteForm.meeting_date} onChange={(e) => setMinuteForm({ ...minuteForm, meeting_date: e.target.value })} className="rounded-lg" /></div>
            <textarea placeholder="Meeting notes / minutes" value={minuteForm.notes} onChange={(e) => setMinuteForm({ ...minuteForm, notes: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm" rows={4} />
            <Button size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700"><Plus className="w-3.5 h-3.5 mr-1" /> Add Minutes</Button>
          </form>
        )}
        {minutes.loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : minutes.rows.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">മിനിറ്റ്സ് ഇല്ല</p>
        ) : (
          <div className="space-y-2">{minutes.rows.map((m) => (
            <div key={m.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between gap-3">
              <div className="min-w-0 flex-1"><p className="text-xs font-semibold text-emerald-700 mb-1">{new Date(m.meeting_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p><p className="text-sm text-gray-700 whitespace-pre-wrap">{m.notes}</p></div>
              {isAuthenticated && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditMinute(m)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => minutes.remove(m.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      <EditEntryDialog
        open={!!editUpdate}
        onOpenChange={(v) => { if (!v) setEditUpdate(null); }}
        title="Edit Update"
        fields={[{ key: 'title', label: 'Title' }, { key: 'content', label: 'Details', type: 'textarea' }, { key: 'entry_date', label: 'Date', type: 'date' }]}
        initialValues={editUpdate ? { title: editUpdate.title, content: editUpdate.content || '', entry_date: editUpdate.entry_date } : {}}
        onSave={async (vals) => { if (editUpdate) await updates.update(editUpdate.id, { title: vals.title, content: vals.content || null, entry_date: vals.entry_date } as any); }}
      />
      <EditEntryDialog
        open={!!editUsage}
        onOpenChange={(v) => { if (!v) setEditUsage(null); }}
        title="Edit Usage"
        fields={[{ key: 'item_name', label: 'Item' }, { key: 'used_by', label: 'Used by' }, { key: 'quantity', label: 'Quantity', type: 'number' }, { key: 'notes', label: 'Notes', type: 'textarea' }, { key: 'entry_date', label: 'Date', type: 'date' }]}
        initialValues={editUsage ? { item_name: editUsage.item_name, used_by: editUsage.used_by || '', quantity: editUsage.quantity ?? '', notes: editUsage.notes || '', entry_date: editUsage.entry_date } : {}}
        onSave={async (vals) => { if (editUsage) await usage.update(editUsage.id, { item_name: vals.item_name, used_by: vals.used_by || null, quantity: vals.quantity === '' ? null : Number(vals.quantity), notes: vals.notes || null, entry_date: vals.entry_date } as any); }}
      />
      <EditEntryDialog
        open={!!editMinute}
        onOpenChange={(v) => { if (!v) setEditMinute(null); }}
        title="Edit Minutes"
        fields={[{ key: 'meeting_date', label: 'Meeting Date', type: 'date' }, { key: 'notes', label: 'Notes', type: 'textarea' }]}
        initialValues={editMinute ? { meeting_date: editMinute.meeting_date, notes: editMinute.notes } : {}}
        onSave={async (vals) => { if (editMinute) await minutes.update(editMinute.id, { meeting_date: vals.meeting_date, notes: vals.notes } as any); }}
      />
    </>
  );
}
