import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit2, Loader2, Receipt, Download, Printer, CheckCircle2, XCircle, User, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generateFineReceipt } from '@/utils/generateFineReceipt';
import { useAdminGate } from '@/hooks/useAdminGate';
import { COMMITTEE_META, CommitteeId } from '@/hooks/useCommittees';
import EditEntryDialog from './EditEntryDialog';

interface CFine {
  id: string;
  committee_id: string;
  fine_date: string;
  day_name: string | null;
  person_name: string;
  reason: string;
  amount: number;
  payment_status: 'paid' | 'unpaid';
}
interface IFine {
  id: string;
  fine_date: string;
  day_name: string | null;
  person_name: string;
  reason: string;
  amount: number;
  payment_status: 'paid' | 'unpaid';
  notes: string | null;
}

const dayName = (d: string) => new Date(d).toLocaleDateString('en-IN', { weekday: 'long' });

export default function FineHubBody() {
  const [tab, setTab] = useState<'committee' | 'individual'>('committee');
  const { requireAdmin } = useAdminGate();

  // ─── Committee Fines ─────────────────────────────────
  const [cFines, setCFines] = useState<CFine[]>([]);
  const [loadingC, setLoadingC] = useState(true);
  const [cForm, setCForm] = useState({
    committee_id: 'central' as CommitteeId,
    fine_date: new Date().toISOString().slice(0, 10),
    person_name: '',
    reason: '',
    amount: '',
    payment_status: 'unpaid' as 'paid' | 'unpaid',
  });
  const [editC, setEditC] = useState<CFine | null>(null);

  const fetchCFines = async () => {
    setLoadingC(true);
    const { data } = await (supabase as any)
      .from('committee_fines').select('*')
      .order('fine_date', { ascending: false }).order('created_at', { ascending: false });
    if (data) setCFines(data as CFine[]);
    setLoadingC(false);
  };

  // ─── Individual Fines ───────────────────────────────
  const [iFines, setIFines] = useState<IFine[]>([]);
  const [loadingI, setLoadingI] = useState(true);
  const [iForm, setIForm] = useState({
    fine_date: new Date().toISOString().slice(0, 10),
    person_name: '',
    reason: '',
    amount: '',
    payment_status: 'unpaid' as 'paid' | 'unpaid',
    notes: '',
  });
  const [editI, setEditI] = useState<IFine | null>(null);

  const fetchIFines = async () => {
    setLoadingI(true);
    const { data } = await (supabase as any)
      .from('individual_fines').select('*')
      .order('fine_date', { ascending: false }).order('created_at', { ascending: false });
    if (data) setIFines(data as IFine[]);
    setLoadingI(false);
  };

  useEffect(() => { fetchCFines(); fetchIFines(); }, []);

  // ─── Receipt helpers ─────────────────────────────────
  const buildReceipt = (f: { fine_date: string; day_name: string | null; person_name: string; reason: string; amount: number; payment_status: 'paid' | 'unpaid'; id: string }, committeeName: string) =>
    generateFineReceipt({
      fine_date: f.fine_date, day_name: f.day_name, person_name: f.person_name,
      reason: f.reason, amount: Number(f.amount), committee_name: committeeName,
      receipt_no: f.id.slice(0, 8).toUpperCase(), payment_status: f.payment_status,
    });
  const dl = (doc: ReturnType<typeof generateFineReceipt>, id: string) => doc.save(`fine-receipt-${id.slice(0, 6)}.pdf`);
  const pr = (doc: ReturnType<typeof generateFineReceipt>) => { doc.autoPrint(); window.open(doc.output('bloburl') as any, '_blank'); };

  // ─── Committee Fine actions ─────────────────────────
  const submitC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cForm.person_name.trim() || !cForm.reason.trim() || !cForm.amount) return;
    requireAdmin(async () => {
      const { error } = await (supabase as any).from('committee_fines').insert({
        committee_id: cForm.committee_id,
        fine_date: cForm.fine_date, day_name: dayName(cForm.fine_date),
        person_name: cForm.person_name.trim(), reason: cForm.reason.trim(),
        amount: Number(cForm.amount), payment_status: cForm.payment_status,
      });
      if (error) return toast.error(error.message);
      toast.success('Fine added');
      setCForm({ ...cForm, person_name: '', reason: '', amount: '', payment_status: 'unpaid' });
      fetchCFines();
    });
  };
  const togglePaidC = (f: CFine) => requireAdmin(async () => {
    const next = f.payment_status === 'paid' ? 'unpaid' : 'paid';
    await (supabase as any).from('committee_fines').update({ payment_status: next }).eq('id', f.id);
    toast.success(next === 'paid' ? 'Marked Paid' : 'Marked Unpaid');
    fetchCFines();
  });
  const removeC = (id: string) => requireAdmin(async () => {
    if (!window.confirm('Delete this fine?')) return;
    await (supabase as any).from('committee_fines').delete().eq('id', id);
    toast.success('Deleted'); fetchCFines();
  });
  const saveEditC = async (vals: Record<string, any>) => {
    if (!editC) return;
    await (supabase as any).from('committee_fines').update({
      committee_id: vals.committee_id,
      fine_date: vals.fine_date, day_name: dayName(vals.fine_date),
      person_name: vals.person_name, reason: vals.reason,
      amount: Number(vals.amount) || 0,
      payment_status: vals.payment_status === 'paid' ? 'paid' : 'unpaid',
    }).eq('id', editC.id);
    toast.success('Updated'); setEditC(null); fetchCFines();
  };

  // ─── Individual Fine actions ────────────────────────
  const submitI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!iForm.person_name.trim() || !iForm.reason.trim() || !iForm.amount) return;
    requireAdmin(async () => {
      const { error } = await (supabase as any).from('individual_fines').insert({
        fine_date: iForm.fine_date, day_name: dayName(iForm.fine_date),
        person_name: iForm.person_name.trim(), reason: iForm.reason.trim(),
        amount: Number(iForm.amount), payment_status: iForm.payment_status,
        notes: iForm.notes || null,
      });
      if (error) return toast.error(error.message);
      toast.success('Fine added');
      setIForm({ ...iForm, person_name: '', reason: '', amount: '', notes: '', payment_status: 'unpaid' });
      fetchIFines();
    });
  };
  const togglePaidI = (f: IFine) => requireAdmin(async () => {
    const next = f.payment_status === 'paid' ? 'unpaid' : 'paid';
    await (supabase as any).from('individual_fines').update({ payment_status: next }).eq('id', f.id);
    fetchIFines();
  });
  const removeI = (id: string) => requireAdmin(async () => {
    if (!window.confirm('Delete this fine?')) return;
    await (supabase as any).from('individual_fines').delete().eq('id', id);
    fetchIFines();
  });
  const saveEditI = async (vals: Record<string, any>) => {
    if (!editI) return;
    await (supabase as any).from('individual_fines').update({
      fine_date: vals.fine_date, day_name: dayName(vals.fine_date),
      person_name: vals.person_name, reason: vals.reason,
      amount: Number(vals.amount) || 0,
      payment_status: vals.payment_status === 'paid' ? 'paid' : 'unpaid',
      notes: vals.notes || null,
    }).eq('id', editI.id);
    toast.success('Updated'); setEditI(null); fetchIFines();
  };

  // ─── Aggregation ───
  const cByCommittee = (Object.keys(COMMITTEE_META) as CommitteeId[]).map((id) => {
    const list = cFines.filter(f => f.committee_id === id);
    const total = list.reduce((s, f) => s + Number(f.amount), 0);
    const unpaid = list.filter(f => f.payment_status !== 'paid').reduce((s, f) => s + Number(f.amount), 0);
    return { id, list, total, unpaid };
  });

  return (
    <>
      {/* Sub-tabs */}
      <div className="flex gap-2 bg-white rounded-2xl border border-rose-200 p-1.5 shadow-sm">
        <button
          onClick={() => setTab('committee')}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition ${
            tab === 'committee' ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow' : 'text-rose-700 hover:bg-rose-50'
          }`}
        >
          <Users className="w-4 h-4" /> Committee Fine
        </button>
        <button
          onClick={() => setTab('individual')}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition ${
            tab === 'individual' ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow' : 'text-rose-700 hover:bg-rose-50'
          }`}
        >
          <User className="w-4 h-4" /> Individual Fine
        </button>
      </div>

      {tab === 'committee' && (
        <>
          {/* Add form */}
          <section className="bg-white rounded-2xl border border-rose-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-rose-800 flex items-center gap-2 mb-3">
              <Plus className="w-4 h-4" /> Add Committee Fine <span className="text-[10px] text-rose-500 font-normal">(admin)</span>
            </h3>
            <form onSubmit={submitC} className="space-y-2 p-3 bg-rose-50 rounded-xl">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Committee</Label>
                  <select value={cForm.committee_id} onChange={(e) => setCForm({ ...cForm, committee_id: e.target.value as CommitteeId })} className="w-full px-3 py-2 rounded-lg border border-rose-200 bg-white text-sm">
                    {(Object.keys(COMMITTEE_META) as CommitteeId[]).map((id) => (
                      <option key={id} value={id}>{COMMITTEE_META[id].name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Date</Label>
                  <Input type="date" value={cForm.fine_date} onChange={(e) => setCForm({ ...cForm, fine_date: e.target.value })} className="rounded-lg" />
                </div>
              </div>
              <Input placeholder="Person / Committee name" value={cForm.person_name} onChange={(e) => setCForm({ ...cForm, person_name: e.target.value })} className="rounded-lg" />
              <textarea placeholder="Reason for fine" value={cForm.reason} onChange={(e) => setCForm({ ...cForm, reason: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-rose-200 text-sm" rows={2} />
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" min="0" step="0.01" placeholder="Amount (₹)" value={cForm.amount} onChange={(e) => setCForm({ ...cForm, amount: e.target.value })} className="rounded-lg" />
                <select value={cForm.payment_status} onChange={(e) => setCForm({ ...cForm, payment_status: e.target.value as any })} className="px-3 py-2 rounded-lg border border-rose-200 bg-white text-sm">
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <Button size="sm" type="submit" className="bg-rose-600 hover:bg-rose-700">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Committee Fine
              </Button>
            </form>
          </section>

          {/* Per-committee summary */}
          <section className="bg-white rounded-2xl border border-rose-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-rose-800 mb-3">Summary by Committee</h3>
            <div className="grid grid-cols-2 gap-2">
              {cByCommittee.map((row) => (
                <div key={row.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                  <p className="text-[11px] font-semibold text-gray-600 truncate">{COMMITTEE_META[row.id].emoji} {COMMITTEE_META[row.id].name}</p>
                  <p className="text-lg font-bold text-rose-700">₹{row.total.toFixed(2)}</p>
                  <p className="text-[10px] text-amber-700">Unpaid ₹{row.unpaid.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Per-committee list */}
          {loadingC ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : cFines.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-6">No fines yet</p>
          ) : (
            cByCommittee.filter(r => r.list.length > 0).map((row) => (
              <section key={row.id} className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm">
                <h3 className={`text-sm font-semibold flex items-center gap-2 mb-3 bg-gradient-to-r ${COMMITTEE_META[row.id].gradient} text-white px-3 py-2 rounded-lg`}>
                  <span>{COMMITTEE_META[row.id].emoji}</span> {COMMITTEE_META[row.id].name}
                </h3>
                <div className="space-y-2">
                  {row.list.map((f) => {
                    const paid = f.payment_status === 'paid';
                    return (
                      <div key={f.id} className={`relative overflow-hidden p-3 pl-4 rounded-lg border ${paid ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40'}`}>
                        <span className={`absolute left-0 top-0 bottom-0 w-1.5 ${paid ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-gray-800">{f.person_name}</p>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${paid ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>{paid ? 'PAID' : 'UNPAID'}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-0.5 whitespace-pre-wrap">{f.reason}</p>
                            <p className="text-[11px] text-gray-400 mt-1">{new Date(f.fine_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · {f.day_name || dayName(f.fine_date)}</p>
                          </div>
                          <p className={`text-base font-bold ${paid ? 'text-emerald-700' : 'text-rose-700'}`}>₹{Number(f.amount).toFixed(2)}</p>
                        </div>
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          <button onClick={() => dl(buildReceipt(f, COMMITTEE_META[row.id].name), f.id)} className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-white"><Download className="w-3 h-3" /> Receipt</button>
                          <button onClick={() => pr(buildReceipt(f, COMMITTEE_META[row.id].name))} className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-white"><Printer className="w-3 h-3" /> Print</button>
                          <button onClick={() => togglePaidC(f)} className={`text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border ${paid ? 'border-rose-300 text-rose-700' : 'border-emerald-300 text-emerald-700'}`}>{paid ? <><XCircle className="w-3 h-3" /> Mark Unpaid</> : <><CheckCircle2 className="w-3 h-3" /> Mark Paid</>}</button>
                          <button onClick={() => setEditC(f)} className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border border-blue-300 text-blue-700"><Edit2 className="w-3 h-3" /> Edit</button>
                          <button onClick={() => removeC(f.id)} className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border border-rose-300 text-rose-700"><Trash2 className="w-3 h-3" /> Delete</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </>
      )}

      {tab === 'individual' && (
        <>
          <section className="bg-white rounded-2xl border border-rose-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-rose-800 flex items-center gap-2 mb-3">
              <Plus className="w-4 h-4" /> Add Individual Fine <span className="text-[10px] text-rose-500 font-normal">(admin)</span>
            </h3>
            <form onSubmit={submitI} className="space-y-2 p-3 bg-rose-50 rounded-xl">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Student name" value={iForm.person_name} onChange={(e) => setIForm({ ...iForm, person_name: e.target.value })} className="rounded-lg" />
                <Input type="date" value={iForm.fine_date} onChange={(e) => setIForm({ ...iForm, fine_date: e.target.value })} className="rounded-lg" />
              </div>
              <textarea placeholder="Reason" value={iForm.reason} onChange={(e) => setIForm({ ...iForm, reason: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-rose-200 text-sm" rows={2} />
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" min="0" step="0.01" placeholder="Amount (₹)" value={iForm.amount} onChange={(e) => setIForm({ ...iForm, amount: e.target.value })} className="rounded-lg" />
                <select value={iForm.payment_status} onChange={(e) => setIForm({ ...iForm, payment_status: e.target.value as any })} className="px-3 py-2 rounded-lg border border-rose-200 bg-white text-sm">
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <Input placeholder="Notes (optional)" value={iForm.notes} onChange={(e) => setIForm({ ...iForm, notes: e.target.value })} className="rounded-lg" />
              <Button size="sm" type="submit" className="bg-rose-600 hover:bg-rose-700"><Plus className="w-3.5 h-3.5 mr-1" /> Add Individual Fine</Button>
            </form>
          </section>

          <section className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-rose-800 flex items-center gap-2 mb-3"><Receipt className="w-4 h-4" /> Individual Fines</h3>
            {loadingI ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : iFines.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-6">No individual fines</p>
            ) : (
              <div className="space-y-2">
                {iFines.map((f) => {
                  const paid = f.payment_status === 'paid';
                  return (
                    <div key={f.id} className={`relative overflow-hidden p-3 pl-4 rounded-lg border ${paid ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40'}`}>
                      <span className={`absolute left-0 top-0 bottom-0 w-1.5 ${paid ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-gray-800">{f.person_name}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${paid ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>{paid ? 'PAID' : 'UNPAID'}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5 whitespace-pre-wrap">{f.reason}</p>
                          {f.notes && <p className="text-[11px] text-gray-500 mt-0.5 italic">{f.notes}</p>}
                          <p className="text-[11px] text-gray-400 mt-1">{new Date(f.fine_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · {f.day_name || dayName(f.fine_date)}</p>
                        </div>
                        <p className={`text-base font-bold ${paid ? 'text-emerald-700' : 'text-rose-700'}`}>₹{Number(f.amount).toFixed(2)}</p>
                      </div>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        <button onClick={() => dl(buildReceipt({ ...f, id: f.id }, 'Individual'), f.id)} className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-white"><Download className="w-3 h-3" /> Receipt</button>
                        <button onClick={() => pr(buildReceipt({ ...f, id: f.id }, 'Individual'))} className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-white"><Printer className="w-3 h-3" /> Print</button>
                        <button onClick={() => togglePaidI(f)} className={`text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border ${paid ? 'border-rose-300 text-rose-700' : 'border-emerald-300 text-emerald-700'}`}>{paid ? <><XCircle className="w-3 h-3" /> Mark Unpaid</> : <><CheckCircle2 className="w-3 h-3" /> Mark Paid</>}</button>
                        <button onClick={() => setEditI(f)} className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border border-blue-300 text-blue-700"><Edit2 className="w-3 h-3" /> Edit</button>
                        <button onClick={() => removeI(f.id)} className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border border-rose-300 text-rose-700"><Trash2 className="w-3 h-3" /> Delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}

      <EditEntryDialog
        open={!!editC}
        onOpenChange={(v) => { if (!v) setEditC(null); }}
        title="Edit Committee Fine"
        fields={[
          { key: 'committee_id', label: 'Committee', type: 'select', options: (Object.keys(COMMITTEE_META) as CommitteeId[]).map((id) => ({ label: COMMITTEE_META[id].name, value: id })) },
          { key: 'fine_date', label: 'Date', type: 'date' },
          { key: 'person_name', label: 'Person / Committee Name' },
          { key: 'reason', label: 'Reason', type: 'textarea' },
          { key: 'amount', label: 'Amount (₹)', type: 'number' },
          { key: 'payment_status', label: 'Payment Status', type: 'select', options: [{ label: 'Unpaid', value: 'unpaid' }, { label: 'Paid', value: 'paid' }] },
        ]}
        initialValues={editC ? { committee_id: editC.committee_id, fine_date: editC.fine_date, person_name: editC.person_name, reason: editC.reason, amount: editC.amount, payment_status: editC.payment_status || 'unpaid' } : {}}
        onSave={(vals) => requireAdmin(() => saveEditC(vals))}
      />
      <EditEntryDialog
        open={!!editI}
        onOpenChange={(v) => { if (!v) setEditI(null); }}
        title="Edit Individual Fine"
        fields={[
          { key: 'fine_date', label: 'Date', type: 'date' },
          { key: 'person_name', label: 'Student Name' },
          { key: 'reason', label: 'Reason', type: 'textarea' },
          { key: 'amount', label: 'Amount (₹)', type: 'number' },
          { key: 'payment_status', label: 'Payment Status', type: 'select', options: [{ label: 'Unpaid', value: 'unpaid' }, { label: 'Paid', value: 'paid' }] },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ]}
        initialValues={editI ? { fine_date: editI.fine_date, person_name: editI.person_name, reason: editI.reason, amount: editI.amount, payment_status: editI.payment_status || 'unpaid', notes: editI.notes || '' } : {}}
        onSave={(vals) => requireAdmin(() => saveEditI(vals))}
      />
    </>
  );
}
