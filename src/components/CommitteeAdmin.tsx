import { useState, useRef } from 'react';
import { useCommittee, FinanceRecord, ItemRecord } from '@/hooks/useCommittee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, Trash2, Plus, Image as ImageIcon, FileText, Save, X, TrendingUp, TrendingDown, Wallet, Package, Users, Edit3 } from 'lucide-react';

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function CommitteeAdmin() {
  const c = useCommittee();
  const photoRef = useRef<HTMLInputElement>(null);
  const constRef = useRef<HTMLInputElement>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [constBusy, setConstBusy] = useState(false);

  // Finance form
  const [fForm, setFForm] = useState({ title: '', amount: '', type: 'income' as 'income' | 'expense', entry_date: new Date().toISOString().slice(0, 10), description: '' });
  const [editingFinance, setEditingFinance] = useState<string | null>(null);

  // Item form
  const [iForm, setIForm] = useState({ name: '', quantity: '', notes: '' });
  const [iFile, setIFile] = useState<File | null>(null);
  const [itemBusy, setItemBusy] = useState(false);
  const itemFileRef = useRef<HTMLInputElement>(null);

  if (c.loading) return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  // Photo upload
  const handlePhotoUpload = async (file: File) => {
    setPhotoBusy(true);
    const url = await c.uploadFile(file, 'photos');
    if (url) await c.saveSettings({ group_photo_url: url });
    setPhotoBusy(false);
    if (photoRef.current) photoRef.current.value = '';
  };
  const handleConstUpload = async (file: File) => {
    setConstBusy(true);
    const url = await c.uploadFile(file, 'constitution');
    if (url) await c.saveSettings({ constitution_url: url });
    setConstBusy(false);
    if (constRef.current) constRef.current.value = '';
  };

  // Finance handlers
  const submitFinance = async () => {
    if (!fForm.title.trim() || !fForm.amount) return;
    const payload = {
      title: fForm.title.trim(),
      amount: Number(fForm.amount),
      type: fForm.type,
      entry_date: fForm.entry_date,
      description: fForm.description.trim() || null,
    };
    const ok = editingFinance
      ? await c.updateFinance(editingFinance, payload)
      : await c.addFinance(payload);
    if (ok) {
      setFForm({ title: '', amount: '', type: 'income', entry_date: new Date().toISOString().slice(0, 10), description: '' });
      setEditingFinance(null);
    }
  };

  const startEditFinance = (f: FinanceRecord) => {
    setEditingFinance(f.id);
    setFForm({
      title: f.title,
      amount: String(f.amount),
      type: f.type,
      entry_date: f.entry_date,
      description: f.description || '',
    });
  };

  // Item handlers
  const submitItem = async () => {
    if (!iForm.name.trim()) return;
    setItemBusy(true);
    let photo_url: string | null = null;
    if (iFile) photo_url = await c.uploadFile(iFile, 'items');
    const ok = await c.addItem({
      name: iForm.name.trim(),
      photo_url,
      quantity: iForm.quantity ? Number(iForm.quantity) : null,
      notes: iForm.notes.trim() || null,
    });
    setItemBusy(false);
    if (ok) {
      setIForm({ name: '', quantity: '', notes: '' });
      setIFile(null);
      if (itemFileRef.current) itemFileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">കമ്മിറ്റി മാനേജ്മെന്റ്</h2>
        <p className="text-sm text-muted-foreground">കമ്മിറ്റി ഫോട്ടോ, ധനകാര്യം, ഇനങ്ങൾ, ഭരണഘടന</p>
      </div>

      {/* Committee Photo */}
      <section className="bg-card rounded-2xl border border-border/50 p-5 space-y-3 shadow-soft">
        <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /><h3 className="font-semibold">കമ്മിറ്റി ഫോട്ടോ</h3></div>
        {c.settings?.group_photo_url && (
          <img src={c.settings.group_photo_url} alt="Committee" className="w-full max-w-md rounded-xl border" />
        )}
        <div className="flex gap-2 flex-wrap">
          <input ref={photoRef} type="file" accept="image/*" hidden onChange={e => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])} />
          <Button onClick={() => photoRef.current?.click()} disabled={photoBusy} size="sm" className="rounded-lg">
            {photoBusy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            {c.settings?.group_photo_url ? 'ഫോട്ടോ മാറ്റുക' : 'ഫോട്ടോ അപ്‌ലോഡ്'}
          </Button>
          {c.settings?.group_photo_url && (
            <Button onClick={() => c.saveSettings({ group_photo_url: null })} variant="outline" size="sm" className="rounded-lg text-rose-600">
              <Trash2 className="w-4 h-4 mr-2" /> റിമൂവ്
            </Button>
          )}
        </div>
      </section>

      {/* Finance */}
      <section className="bg-card rounded-2xl border border-border/50 p-5 space-y-4 shadow-soft">
        <div className="flex items-center gap-2"><Wallet className="w-4 h-4 text-primary" /><h3 className="font-semibold">വരവ് & ചെലവ്</h3></div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
            <div className="text-xs text-emerald-600 flex items-center justify-center gap-1"><TrendingUp className="w-3 h-3" />Income</div>
            <p className="text-sm font-bold text-emerald-700">{fmt(c.totals.income)}</p>
          </div>
          <div className="rounded-xl bg-rose-50 border border-rose-100 p-3 text-center">
            <div className="text-xs text-rose-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />Expense</div>
            <p className="text-sm font-bold text-rose-700">{fmt(c.totals.expense)}</p>
          </div>
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-center">
            <div className="text-xs text-blue-600 flex items-center justify-center gap-1"><Wallet className="w-3 h-3" />Balance</div>
            <p className="text-sm font-bold text-blue-700">{fmt(c.balance)}</p>
          </div>
        </div>

        {/* Form */}
        <div className="grid sm:grid-cols-2 gap-3 p-4 bg-muted/40 rounded-xl">
          <div>
            <Label>ടൈറ്റിൽ *</Label>
            <Input value={fForm.title} onChange={e => setFForm(p => ({ ...p, title: e.target.value }))} placeholder="Donation / Stationery" />
          </div>
          <div>
            <Label>തുക *</Label>
            <Input type="number" value={fForm.amount} onChange={e => setFForm(p => ({ ...p, amount: e.target.value }))} placeholder="0" />
          </div>
          <div>
            <Label>ടൈപ്പ്</Label>
            <select value={fForm.type} onChange={e => setFForm(p => ({ ...p, type: e.target.value as 'income' | 'expense' }))}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
              <option value="income">Income (വരവ്)</option>
              <option value="expense">Expense (ചെലവ്)</option>
            </select>
          </div>
          <div>
            <Label>തീയതി</Label>
            <Input type="date" value={fForm.entry_date} onChange={e => setFForm(p => ({ ...p, entry_date: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <Label>വിവരണം (ഓപ്ഷണൽ)</Label>
            <Input value={fForm.description} onChange={e => setFForm(p => ({ ...p, description: e.target.value }))} placeholder="Notes" />
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <Button onClick={submitFinance} size="sm" className="rounded-lg">
              {editingFinance ? <><Save className="w-4 h-4 mr-2" />അപ്ഡേറ്റ്</> : <><Plus className="w-4 h-4 mr-2" />ചേർക്കുക</>}
            </Button>
            {editingFinance && (
              <Button onClick={() => { setEditingFinance(null); setFForm({ title: '', amount: '', type: 'income', entry_date: new Date().toISOString().slice(0, 10), description: '' }); }} variant="outline" size="sm" className="rounded-lg">
                <X className="w-4 h-4 mr-2" />റദ്ദാക്കുക
              </Button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {c.finances.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">റെക്കോർഡുകൾ ഇല്ല</p>
          ) : c.finances.map(f => (
            <div key={f.id} className="flex items-center justify-between gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{f.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(f.entry_date).toLocaleDateString('en-IN')}{f.description && ` · ${f.description}`}</p>
              </div>
              <span className={`text-sm font-semibold whitespace-nowrap ${f.type === 'income' ? 'text-emerald-700' : 'text-rose-700'}`}>
                {f.type === 'income' ? '+' : '−'} {fmt(Number(f.amount))}
              </span>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEditFinance(f)}><Edit3 className="w-3.5 h-3.5" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-600" onClick={() => c.deleteFinance(f.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Items */}
      <section className="bg-card rounded-2xl border border-border/50 p-5 space-y-4 shadow-soft">
        <div className="flex items-center gap-2"><Package className="w-4 h-4 text-primary" /><h3 className="font-semibold">ഓഫീസ് ഇനങ്ങൾ</h3></div>

        <div className="grid sm:grid-cols-2 gap-3 p-4 bg-muted/40 rounded-xl">
          <div>
            <Label>ഇനത്തിന്റെ പേര് *</Label>
            <Input value={iForm.name} onChange={e => setIForm(p => ({ ...p, name: e.target.value }))} placeholder="Item name" />
          </div>
          <div>
            <Label>എണ്ണം</Label>
            <Input type="number" value={iForm.quantity} onChange={e => setIForm(p => ({ ...p, quantity: e.target.value }))} placeholder="Quantity" />
          </div>
          <div className="sm:col-span-2">
            <Label>കുറിപ്പുകൾ</Label>
            <Input value={iForm.notes} onChange={e => setIForm(p => ({ ...p, notes: e.target.value }))} placeholder="Notes" />
          </div>
          <div className="sm:col-span-2">
            <Label>ഫോട്ടോ</Label>
            <input ref={itemFileRef} type="file" accept="image/*" onChange={e => setIFile(e.target.files?.[0] || null)} className="block w-full text-sm" />
            {iFile && <p className="text-xs text-muted-foreground mt-1">{iFile.name}</p>}
          </div>
          <div className="sm:col-span-2">
            <Button onClick={submitItem} disabled={itemBusy} size="sm" className="rounded-lg">
              {itemBusy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />} ഇനം ചേർക്കുക
            </Button>
          </div>
        </div>

        {c.items.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">ഇനങ്ങൾ ഇല്ല</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {c.items.map(item => (
              <div key={item.id} className="rounded-xl border bg-muted/20 overflow-hidden">
                {item.photo_url ? (
                  <img src={item.photo_url} alt={item.name} className="w-full aspect-square object-cover" />
                ) : (
                  <div className="w-full aspect-square bg-muted flex items-center justify-center"><ImageIcon className="w-8 h-8 text-muted-foreground" /></div>
                )}
                <div className="p-2">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  {item.quantity != null && <p className="text-xs text-muted-foreground">എണ്ണം: {item.quantity}</p>}
                  {item.notes && <p className="text-xs text-muted-foreground truncate">{item.notes}</p>}
                  <Button size="sm" variant="ghost" className="text-rose-600 mt-1 h-7 px-2" onClick={() => c.deleteItem(item.id)}>
                    <Trash2 className="w-3 h-3 mr-1" /> ഡിലീറ്റ്
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Constitution */}
      <section className="bg-card rounded-2xl border border-border/50 p-5 space-y-3 shadow-soft">
        <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /><h3 className="font-semibold">ഭരണഘടന (Constitution PDF)</h3></div>
        {c.settings?.constitution_url && (
          <a href={c.settings.constitution_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline break-all">
            നിലവിലെ ഫയൽ കാണുക
          </a>
        )}
        <div className="flex gap-2 flex-wrap">
          <input ref={constRef} type="file" accept="application/pdf,.pdf" hidden onChange={e => e.target.files?.[0] && handleConstUpload(e.target.files[0])} />
          <Button onClick={() => constRef.current?.click()} disabled={constBusy} size="sm" className="rounded-lg">
            {constBusy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            {c.settings?.constitution_url ? 'ഭരണഘടന മാറ്റുക' : 'PDF അപ്‌ലോഡ്'}
          </Button>
          {c.settings?.constitution_url && (
            <Button onClick={() => c.saveSettings({ constitution_url: null })} variant="outline" size="sm" className="rounded-lg text-rose-600">
              <Trash2 className="w-4 h-4 mr-2" /> റിമൂവ്
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
