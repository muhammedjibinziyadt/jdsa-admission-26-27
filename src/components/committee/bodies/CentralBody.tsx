import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit2, Loader2, FileText, ClipboardList, Package, Wallet, BookText, Check, Clock } from 'lucide-react';
import CommitteeSection from '@/components/CommitteeSection';
import { useCommitteeEdit } from '@/hooks/useCommitteeEdit';
import { useCommitteeTable } from '@/hooks/useCommitteeTable';
import EditEntryDialog from '@/components/committee/EditEntryDialog';

interface Update { id: string; title: string; content: string | null; entry_date: string; }
interface ItemUsage { id: string; item_name: string; used_by: string | null; quantity: number | null; notes: string | null; entry_date: string; }
interface Minute { id: string; meeting_date: string; notes: string; }
interface Fund { id: string; person_name: string; fund_type: 'paid' | 'pending'; reason: string | null; amount: number; entry_date: string; }
interface Report { id: string; title: string; description: string | null; entry_date: string; }

export default function CentralBody() {
  const { canEdit } = useCommitteeEdit('central');
  const updates = useCommitteeTable<Update>('central_updates', 'entry_date');
  const usage = useCommitteeTable<ItemUsage>('central_item_usage', 'entry_date');
  const minutes = useCommitteeTable<Minute>('central_minutes', 'meeting_date');
  const funds = useCommitteeTable<Fund>('central_fund_book', 'entry_date');
  const reports = useCommitteeTable<Report>('central_reports', 'entry_date');

  const [updateForm, setUpdateForm] = useState({ title: '', content: '' });
  const [usageForm, setUsageForm] = useState({ item_name: '', used_by: '', quantity: '', notes: '' });
  const [minuteForm, setMinuteForm] = useState({ meeting_date: new Date().toISOString().slice(0, 10), notes: '' });
  const [fundForm, setFundForm] = useState({ person_name: '', fund_type: 'pending' as 'paid' | 'pending', reason: '', amount: '', entry_date: new Date().toISOString().slice(0, 10) });
  const [reportForm, setReportForm] = useState({ title: '', description: '', entry_date: new Date().toISOString().slice(0, 10) });

  const [editUpdate, setEditUpdate] = useState<Update | null>(null);
  const [editUsage, setEditUsage] = useState<ItemUsage | null>(null);
  const [editMinute, setEditMinute] = useState<Minute | null>(null);
  const [editFund, setEditFund] = useState<Fund | null>(null);
  const [editReport, setEditReport] = useState<Report | null>(null);
  const [openReport, setOpenReport] = useState<Report | null>(null);

  const totalPaid = funds.rows.filter(f => f.fund_type === 'paid').reduce((s, f) => s + Number(f.amount), 0);
  const totalPending = funds.rows.filter(f => f.fund_type === 'pending').reduce((s, f) => s + Number(f.amount), 0);

  return (
    <>
      <CommitteeSection />

      {/* FUND BOOK */}
      <section className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5">
        <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-2 mb-3">
          <Wallet className="w-4 h-4" /> ഫണ്ട് ബുക്ക്
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
            <p className="text-[11px] text-emerald-700 font-medium">Total Paid</p>
            <p className="text-lg font-bold text-emerald-700">₹{totalPaid.toFixed(2)}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
            <p className="text-[11px] text-amber-700 font-medium">Total Pending</p>
            <p className="text-lg font-bold text-amber-700">₹{totalPending.toFixed(2)}</p>
          </div>
        </div>
        {canEdit && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!fundForm.person_name.trim() || !fundForm.amount) return;
            const ok = await funds.insert({
              person_name: fundForm.person_name,
              fund_type: fundForm.fund_type,
              reason: fundForm.reason || null,
              amount: Number(fundForm.amount),
              entry_date: fundForm.entry_date,
            } as any);
            if (ok) setFundForm({ person_name: '', fund_type: 'pending', reason: '', amount: '', entry_date: new Date().toISOString().slice(0, 10) });
          }} className="space-y-2 mb-4 p-3 bg-emerald-50 rounded-xl">
            <Input placeholder="Name (who paid / who should pay)" value={fundForm.person_name} onChange={(e) => setFundForm({ ...fundForm, person_name: e.target.value })} className="rounded-lg" />
            <div className="grid grid-cols-2 gap-2">
              <select value={fundForm.fund_type} onChange={(e) => setFundForm({ ...fundForm, fund_type: e.target.value as any })} className="px-3 py-2 rounded-lg border border-emerald-200 bg-white text-sm">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
              <Input type="number" min="0" step="0.01" placeholder="Amount" value={fundForm.amount} onChange={(e) => setFundForm({ ...fundForm, amount: e.target.value })} className="rounded-lg" />
            </div>
            <Input placeholder="Reason (printing / rent / ...)" value={fundForm.reason} onChange={(e) => setFundForm({ ...fundForm, reason: e.target.value })} className="rounded-lg" />
            <Input type="date" value={fundForm.entry_date} onChange={(e) => setFundForm({ ...fundForm, entry_date: e.target.value })} className="rounded-lg" />
            <Button size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700"><Plus className="w-3.5 h-3.5 mr-1" /> Add Entry</Button>
          </form>
        )}
        {funds.loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : funds.rows.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">എൻട്രികൾ ഇല്ല</p>
        ) : (
          <div className="space-y-2">{funds.rows.map((f) => {
            const paid = f.fund_type === 'paid';
            return (
              <div key={f.id} className={`p-3 rounded-lg border flex justify-between gap-3 ${paid ? 'bg-emerald-50/40 border-emerald-200' : 'bg-amber-50/40 border-amber-200'}`}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm text-gray-800">{f.person_name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${paid ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}>
                      {paid ? <Check className="w-3 h-3 inline" /> : <Clock className="w-3 h-3 inline" />} {paid ? 'PAID' : 'PENDING'}
                    </span>
                  </div>
                  {f.reason && <p className="text-xs text-gray-600 mt-0.5">{f.reason}</p>}
                  <p className="text-[11px] text-gray-400 mt-1">{new Date(f.entry_date).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-base font-bold ${paid ? 'text-emerald-700' : 'text-amber-700'}`}>₹{Number(f.amount).toFixed(2)}</p>
                  {canEdit && (
                    <div className="flex gap-1 mt-1 justify-end">
                      <button onClick={async () => { await funds.update(f.id, { fund_type: paid ? 'pending' : 'paid' } as any); }} className="text-xs text-gray-500 hover:text-emerald-600" title={paid ? 'Mark Pending' : 'Mark Paid'}>
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditFund(f)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => funds.remove(f.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}</div>
        )}
      </section>

      {/* REPORT BOOK */}
      <section className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5">
        <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-2 mb-4">
          <BookText className="w-4 h-4" /> റിപ്പോർട്ട് ബുക്ക്
        </h3>
        {canEdit && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!reportForm.title.trim()) return;
            const ok = await reports.insert({
              title: reportForm.title,
              description: reportForm.description || null,
              entry_date: reportForm.entry_date,
            } as any);
            if (ok) setReportForm({ title: '', description: '', entry_date: new Date().toISOString().slice(0, 10) });
          }} className="space-y-2 mb-4 p-3 bg-emerald-50 rounded-xl">
            <Input placeholder="Report title" value={reportForm.title} onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })} className="rounded-lg" />
            <Input type="date" value={reportForm.entry_date} onChange={(e) => setReportForm({ ...reportForm, entry_date: e.target.value })} className="rounded-lg" />
            <textarea placeholder="Full report description" value={reportForm.description} onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm" rows={4} />
            <Button size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700"><Plus className="w-3.5 h-3.5 mr-1" /> Add Report</Button>
          </form>
        )}
        {reports.loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : reports.rows.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">റിപ്പോർട്ടുകൾ ഇല്ല</p>
        ) : (
          <div className="space-y-2">{reports.rows.map((r) => (
            <div key={r.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between gap-3">
              <button onClick={() => setOpenReport(r)} className="text-left flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">{r.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(r.entry_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </button>
              {canEdit && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditReport(r)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => reports.remove(r.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      {/* UPDATES */}
      <section className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5">
        <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-2 mb-4">
          <ClipboardList className="w-4 h-4" /> കമ്മിറ്റി അപ്‌ഡേറ്റുകൾ
        </h3>
        {canEdit && (
          <form onSubmit={async (e) => { e.preventDefault(); if (!updateForm.title.trim()) return; const ok = await updates.insert({ title: updateForm.title, content: updateForm.content || null } as any); if (ok) setUpdateForm({ title: '', content: '' }); }} className="space-y-2 mb-4 p-3 bg-emerald-50 rounded-xl">
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
              {canEdit && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditUpdate(u)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => updates.remove(u.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      {/* ITEM USAGE */}
      <section className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5">
        <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-2 mb-4">
          <Package className="w-4 h-4" /> ഓഫീസ് ഇനങ്ങളുടെ ഉപയോഗം
        </h3>
        {canEdit && (
          <form onSubmit={async (e) => { e.preventDefault(); if (!usageForm.item_name.trim()) return; const ok = await usage.insert({ item_name: usageForm.item_name, used_by: usageForm.used_by || null, quantity: usageForm.quantity ? Number(usageForm.quantity) : null, notes: usageForm.notes || null } as any); if (ok) setUsageForm({ item_name: '', used_by: '', quantity: '', notes: '' }); }} className="space-y-2 mb-4 p-3 bg-emerald-50 rounded-xl">
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
              {canEdit && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditUsage(u)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => usage.remove(u.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      {/* MINUTES */}
      <section className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5">
        <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4" /> മിനിറ്റ്സ് ബുക്ക്
        </h3>
        {canEdit && (
          <form onSubmit={async (e) => { e.preventDefault(); if (!minuteForm.notes.trim()) return; const ok = await minutes.insert({ meeting_date: minuteForm.meeting_date, notes: minuteForm.notes } as any); if (ok) setMinuteForm({ meeting_date: new Date().toISOString().slice(0, 10), notes: '' }); }} className="space-y-2 mb-4 p-3 bg-emerald-50 rounded-xl">
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
              {canEdit && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditMinute(m)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => minutes.remove(m.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      {/* Report viewer */}
      {openReport && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setOpenReport(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs text-emerald-700 font-semibold mb-1">{new Date(openReport.entry_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            <h4 className="text-lg font-bold text-gray-900 mb-3">{openReport.title}</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{openReport.description || '—'}</p>
            <div className="mt-4 text-right"><Button size="sm" variant="outline" onClick={() => setOpenReport(null)}>Close</Button></div>
          </div>
        </div>
      )}

      <EditEntryDialog open={!!editUpdate} onOpenChange={(v) => { if (!v) setEditUpdate(null); }} title="Edit Update"
        fields={[{ key: 'title', label: 'Title' }, { key: 'content', label: 'Details', type: 'textarea' }, { key: 'entry_date', label: 'Date', type: 'date' }]}
        initialValues={editUpdate ? { title: editUpdate.title, content: editUpdate.content || '', entry_date: editUpdate.entry_date } : {}}
        onSave={async (vals) => { if (editUpdate) await updates.update(editUpdate.id, { title: vals.title, content: vals.content || null, entry_date: vals.entry_date } as any); }} />
      <EditEntryDialog open={!!editUsage} onOpenChange={(v) => { if (!v) setEditUsage(null); }} title="Edit Usage"
        fields={[{ key: 'item_name', label: 'Item' }, { key: 'used_by', label: 'Used by' }, { key: 'quantity', label: 'Quantity', type: 'number' }, { key: 'notes', label: 'Notes', type: 'textarea' }, { key: 'entry_date', label: 'Date', type: 'date' }]}
        initialValues={editUsage ? { item_name: editUsage.item_name, used_by: editUsage.used_by || '', quantity: editUsage.quantity ?? '', notes: editUsage.notes || '', entry_date: editUsage.entry_date } : {}}
        onSave={async (vals) => { if (editUsage) await usage.update(editUsage.id, { item_name: vals.item_name, used_by: vals.used_by || null, quantity: vals.quantity === '' ? null : Number(vals.quantity), notes: vals.notes || null, entry_date: vals.entry_date } as any); }} />
      <EditEntryDialog open={!!editMinute} onOpenChange={(v) => { if (!v) setEditMinute(null); }} title="Edit Minutes"
        fields={[{ key: 'meeting_date', label: 'Meeting Date', type: 'date' }, { key: 'notes', label: 'Notes', type: 'textarea' }]}
        initialValues={editMinute ? { meeting_date: editMinute.meeting_date, notes: editMinute.notes } : {}}
        onSave={async (vals) => { if (editMinute) await minutes.update(editMinute.id, { meeting_date: vals.meeting_date, notes: vals.notes } as any); }} />
      <EditEntryDialog open={!!editFund} onOpenChange={(v) => { if (!v) setEditFund(null); }} title="Edit Fund Entry"
        fields={[{ key: 'person_name', label: 'Name' }, { key: 'fund_type', label: 'Status', type: 'select', options: [{ label: 'Pending', value: 'pending' }, { label: 'Paid', value: 'paid' }] }, { key: 'amount', label: 'Amount', type: 'number' }, { key: 'reason', label: 'Reason' }, { key: 'entry_date', label: 'Date', type: 'date' }]}
        initialValues={editFund ? { person_name: editFund.person_name, fund_type: editFund.fund_type, amount: editFund.amount, reason: editFund.reason || '', entry_date: editFund.entry_date } : {}}
        onSave={async (vals) => { if (editFund) await funds.update(editFund.id, { person_name: vals.person_name, fund_type: vals.fund_type, amount: Number(vals.amount) || 0, reason: vals.reason || null, entry_date: vals.entry_date } as any); }} />
      <EditEntryDialog open={!!editReport} onOpenChange={(v) => { if (!v) setEditReport(null); }} title="Edit Report"
        fields={[{ key: 'title', label: 'Title' }, { key: 'entry_date', label: 'Date', type: 'date' }, { key: 'description', label: 'Description', type: 'textarea' }]}
        initialValues={editReport ? { title: editReport.title, entry_date: editReport.entry_date, description: editReport.description || '' } : {}}
        onSave={async (vals) => { if (editReport) await reports.update(editReport.id, { title: vals.title, entry_date: vals.entry_date, description: vals.description || null } as any); }} />
    </>
  );
}
