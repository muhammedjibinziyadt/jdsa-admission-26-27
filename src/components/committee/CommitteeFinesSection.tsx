import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit2, Loader2, Receipt, Download, Printer, CheckCircle2, XCircle } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generateFineReceipt } from '@/utils/generateFineReceipt';
import EditEntryDialog from './EditEntryDialog';

interface Fine {
  id: string;
  committee_id: string;
  fine_date: string;
  day_name: string | null;
  person_name: string;
  reason: string;
  amount: number;
  payment_status: 'paid' | 'unpaid';
  created_at: string;
}

interface Props {
  committeeId: string;
  committeeName: string;
}

const dayName = (d: string) => new Date(d).toLocaleDateString('en-IN', { weekday: 'long' });

export default function CommitteeFinesSection({ committeeId, committeeName }: Props) {
  const { isAuthenticated } = useAdminAuth();
  const [rows, setRows] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fine_date: new Date().toISOString().slice(0, 10),
    person_name: '',
    reason: '',
    amount: '',
    payment_status: 'unpaid' as 'paid' | 'unpaid',
  });
  const [editing, setEditing] = useState<Fine | null>(null);

  const fetchFines = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('committee_fines')
      .select('*')
      .eq('committee_id', committeeId)
      .order('fine_date', { ascending: false })
      .order('created_at', { ascending: false });
    if (!error && data) setRows(data as Fine[]);
    setLoading(false);
  };

  useEffect(() => { fetchFines(); /* eslint-disable-next-line */ }, [committeeId]);

  const submitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.person_name.trim() || !form.reason.trim() || !form.amount) return;
    const { error } = await (supabase as any).from('committee_fines').insert({
      committee_id: committeeId,
      fine_date: form.fine_date,
      day_name: dayName(form.fine_date),
      person_name: form.person_name.trim(),
      reason: form.reason.trim(),
      amount: Number(form.amount),
      payment_status: form.payment_status,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Fine added');
    setForm({ fine_date: new Date().toISOString().slice(0, 10), person_name: '', reason: '', amount: '', payment_status: 'unpaid' });
    fetchFines();
  };

  const togglePaid = async (f: Fine) => {
    const next = f.payment_status === 'paid' ? 'unpaid' : 'paid';
    const { error } = await (supabase as any).from('committee_fines').update({ payment_status: next }).eq('id', f.id);
    if (error) { toast.error(error.message); return; }
    toast.success(next === 'paid' ? 'Marked as Paid' : 'Marked as Unpaid');
    fetchFines();
  };

  const removeFine = async (id: string) => {
    if (!window.confirm('Delete this fine entry?')) return;
    const { error } = await (supabase as any).from('committee_fines').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted');
    fetchFines();
  };

  const saveEdit = async (vals: Record<string, any>) => {
    if (!editing) return;
    const { error } = await (supabase as any).from('committee_fines').update({
      fine_date: vals.fine_date,
      day_name: dayName(vals.fine_date),
      person_name: vals.person_name,
      reason: vals.reason,
      amount: Number(vals.amount) || 0,
      payment_status: vals.payment_status === 'paid' ? 'paid' : 'unpaid',
    }).eq('id', editing.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Updated');
    setEditing(null);
    fetchFines();
  };

  const buildReceipt = (f: Fine) => generateFineReceipt({
    fine_date: f.fine_date,
    day_name: f.day_name,
    person_name: f.person_name,
    reason: f.reason,
    amount: Number(f.amount),
    committee_name: committeeName,
    receipt_no: f.id.slice(0, 8).toUpperCase(),
    payment_status: f.payment_status,
  });

  const downloadReceipt = (f: Fine) => buildReceipt(f).save(`fine-receipt-${f.id.slice(0, 6)}.pdf`);
  const printReceipt = (f: Fine) => {
    const doc = buildReceipt(f);
    doc.autoPrint();
    const blobUrl = doc.output('bloburl');
    window.open(blobUrl as any, '_blank');
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-rose-200 p-5">
      <h3 className="text-sm font-semibold text-rose-800 flex items-center gap-2 mb-1">
        <Receipt className="w-4 h-4" /> Fine / Penalty
      </h3>
      <p className="text-xs text-gray-500 mb-4">Recent fines for {committeeName}</p>

      {isAuthenticated && (
        <form onSubmit={submitNew} className="space-y-2 mb-4 p-3 bg-rose-50 rounded-xl">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Date</Label>
              <Input type="date" value={form.fine_date} onChange={(e) => setForm({ ...form, fine_date: e.target.value })} className="rounded-lg" />
            </div>
            <div>
              <Label className="text-xs">Amount (₹)</Label>
              <Input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="rounded-lg" />
            </div>
          </div>
          <Input placeholder="Person / Committee name" value={form.person_name} onChange={(e) => setForm({ ...form, person_name: e.target.value })} className="rounded-lg" />
          <textarea placeholder="Reason for fine" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-rose-200 text-sm" rows={2} />
          <div>
            <Label className="text-xs">Payment Status</Label>
            <select
              value={form.payment_status}
              onChange={(e) => setForm({ ...form, payment_status: e.target.value as 'paid' | 'unpaid' })}
              className="w-full px-3 py-2 rounded-lg border border-rose-200 bg-white text-sm"
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <Button size="sm" type="submit" className="bg-rose-600 hover:bg-rose-700">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Fine
          </Button>
        </form>
      )}

      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
      ) : rows.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-4">പിഴകൾ ഇല്ല</p>
      ) : (
        <div className="space-y-2">
          {rows.map((f) => {
            const paid = f.payment_status === 'paid';
            const themeBorder = paid ? 'border-emerald-200' : 'border-rose-200';
            const themeBg = paid ? 'bg-emerald-50/40' : 'bg-rose-50/40';
            const amountColor = paid ? 'text-emerald-700' : 'text-rose-700';
            const stripe = paid ? 'bg-emerald-500' : 'bg-rose-500';
            return (
              <div key={f.id} className={`relative overflow-hidden p-3 pl-4 rounded-lg border ${themeBorder} ${themeBg}`}>
                <span className={`absolute left-0 top-0 bottom-0 w-1.5 ${stripe}`} />
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-800">{f.person_name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${paid ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                        {paid ? 'PAID' : 'UNPAID'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 whitespace-pre-wrap">{f.reason}</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {new Date(f.fine_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · {f.day_name || dayName(f.fine_date)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-base font-bold ${amountColor}`}>₹{Number(f.amount).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  <button onClick={() => downloadReceipt(f)} className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-white">
                    <Download className="w-3 h-3" /> Receipt
                  </button>
                  <button onClick={() => printReceipt(f)} className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-white">
                    <Printer className="w-3 h-3" /> Print
                  </button>
                  {isAuthenticated && (
                    <>
                      <button onClick={() => togglePaid(f)} className={`text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border ${paid ? 'border-rose-300 text-rose-700 hover:bg-rose-50' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'}`}>
                        {paid ? <><XCircle className="w-3 h-3" /> Mark Unpaid</> : <><CheckCircle2 className="w-3 h-3" /> Mark Paid</>}
                      </button>
                      <button onClick={() => setEditing(f)} className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => removeFine(f.id)} className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border border-rose-300 text-rose-700 hover:bg-rose-50">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <EditEntryDialog
        open={!!editing}
        onOpenChange={(v) => { if (!v) setEditing(null); }}
        title="Edit Fine Entry"
        fields={[
          { key: 'fine_date', label: 'Date', type: 'date' },
          { key: 'person_name', label: 'Person / Committee Name' },
          { key: 'reason', label: 'Reason', type: 'textarea' },
          { key: 'amount', label: 'Amount (₹)', type: 'number' },
          { key: 'payment_status', label: 'Payment Status', type: 'select', options: [
            { label: 'Unpaid', value: 'unpaid' },
            { label: 'Paid', value: 'paid' },
          ]},
        ]}
        initialValues={editing ? {
          fine_date: editing.fine_date,
          person_name: editing.person_name,
          reason: editing.reason,
          amount: editing.amount,
          payment_status: editing.payment_status || 'unpaid',
        } : {}}
        onSave={saveEdit}
      />
    </section>
  );
}
