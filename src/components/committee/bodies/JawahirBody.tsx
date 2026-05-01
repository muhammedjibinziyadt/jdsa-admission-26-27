import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit2, Loader2, BookOpen, Lightbulb, Users, Upload, Download, ExternalLink } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useCommitteeTable, uploadCommitteeFile } from '@/hooks/useCommitteeTable';
import EditEntryDialog from '@/components/committee/EditEntryDialog';

interface Magazine { id: string; title: string; issue_date: string; pdf_url: string; cover_url: string | null; }
interface Initiative { id: string; title: string; description: string | null; entry_date: string; }
interface Contributor { id: string; student_name: string; details: string | null; }

export default function JawahirBody() {
  const { isAuthenticated } = useAdminAuth();
  const magazines = useCommitteeTable<Magazine>('jawahir_magazines', 'issue_date');
  const initiatives = useCommitteeTable<Initiative>('jawahir_initiatives', 'entry_date');
  const contributors = useCommitteeTable<Contributor>('jawahir_contributors');

  const [mag, setMag] = useState({ title: '', issue_date: new Date().toISOString().slice(0, 10) });
  const [magFile, setMagFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [init, setInit] = useState({ title: '', description: '' });
  const [contrib, setContrib] = useState({ student_name: '', details: '' });

  const [editMag, setEditMag] = useState<Magazine | null>(null);
  const [editInit, setEditInit] = useState<Initiative | null>(null);
  const [editContrib, setEditContrib] = useState<Contributor | null>(null);

  return (
    <>
      <section className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5">
        <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-4"><BookOpen className="w-4 h-4" /> അൽ ജവാഹിർ മാഗസിൻ</h3>
        {isAuthenticated && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!magFile || !mag.title.trim()) return;
            setUploading(true);
            const pdf_url = await uploadCommitteeFile('jawahir', magFile, 'pdf');
            const cover_url = coverFile ? await uploadCommitteeFile('jawahir', coverFile, 'covers') : null;
            if (pdf_url) {
              const ok = await magazines.insert({ title: mag.title, issue_date: mag.issue_date, pdf_url, cover_url });
              if (ok) { setMag({ title: '', issue_date: new Date().toISOString().slice(0, 10) }); setMagFile(null); setCoverFile(null); }
            }
            setUploading(false);
          }} className="space-y-2 mb-4 p-3 bg-amber-50 rounded-xl">
            <Input placeholder="Magazine title (e.g., Issue Jan-Feb 2026)" value={mag.title} onChange={(e) => setMag({ ...mag, title: e.target.value })} className="rounded-lg" />
            <div><Label className="text-xs">Issue Date</Label><Input type="date" value={mag.issue_date} onChange={(e) => setMag({ ...mag, issue_date: e.target.value })} className="rounded-lg" /></div>
            <div><Label className="text-xs">Magazine PDF *</Label><Input type="file" accept="application/pdf" onChange={(e) => setMagFile(e.target.files?.[0] || null)} className="rounded-lg" /></div>
            <div><Label className="text-xs">Cover image (optional)</Label><Input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="rounded-lg" /></div>
            <Button size="sm" type="submit" disabled={uploading} className="bg-amber-600 hover:bg-amber-700">{uploading ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Upload className="w-3.5 h-3.5 mr-1" />} Upload Magazine</Button>
          </form>
        )}
        {magazines.loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : magazines.rows.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">മാഗസിനുകൾ ഇല്ല</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{magazines.rows.map((m) => (
            <div key={m.id} className="rounded-xl border border-gray-100 overflow-hidden bg-gray-50">
              {m.cover_url ? <img src={m.cover_url} alt={m.title} className="w-full aspect-[3/4] object-cover" /> : <div className="w-full aspect-[3/4] bg-amber-100 flex items-center justify-center text-amber-400"><BookOpen className="w-10 h-10" /></div>}
              <div className="p-2">
                <p className="text-xs font-medium text-gray-800 truncate">{m.title}</p>
                <p className="text-xs text-gray-500 mb-2">{new Date(m.issue_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                <div className="flex gap-1">
                  <a href={m.pdf_url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs bg-amber-600 text-white py-1 rounded hover:bg-amber-700"><ExternalLink className="w-3 h-3 inline" /></a>
                  <a href={m.pdf_url} download className="flex-1 text-center text-xs border border-amber-300 text-amber-700 py-1 rounded hover:bg-amber-50"><Download className="w-3 h-3 inline" /></a>
                  {isAuthenticated && (
                    <>
                      <button onClick={() => setEditMag(m)} className="px-1.5 text-blue-500 hover:text-blue-700"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => magazines.remove(m.id)} className="px-1.5 text-rose-500 hover:text-rose-700"><Trash2 className="w-3 h-3" /></button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}</div>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5">
        <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-4"><Lightbulb className="w-4 h-4" /> പ്രോഗ്രാമുകൾ / പദ്ധതികൾ</h3>
        {isAuthenticated && (
          <form onSubmit={async (e) => { e.preventDefault(); if (!init.title.trim()) return; const ok = await initiatives.insert({ title: init.title, description: init.description || null }); if (ok) setInit({ title: '', description: '' }); }} className="space-y-2 mb-4 p-3 bg-amber-50 rounded-xl">
            <Input placeholder="Title" value={init.title} onChange={(e) => setInit({ ...init, title: e.target.value })} className="rounded-lg" />
            <textarea placeholder="Description" value={init.description} onChange={(e) => setInit({ ...init, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-amber-200 text-sm" rows={2} />
            <Button size="sm" type="submit" className="bg-amber-600 hover:bg-amber-700"><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
          </form>
        )}
        {initiatives.rows.length === 0 ? <p className="text-center text-sm text-gray-400 py-4">പ്രോഗ്രാമുകൾ ഇല്ല</p> : (
          <div className="space-y-2">{initiatives.rows.map((i) => (
            <div key={i.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between gap-3">
              <div className="flex-1 min-w-0"><p className="font-medium text-sm text-gray-800">{i.title}</p>{i.description && <p className="text-xs text-gray-600 mt-0.5">{i.description}</p>}<p className="text-xs text-gray-400 mt-1">{new Date(i.entry_date).toLocaleDateString('en-IN')}</p></div>
              {isAuthenticated && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditInit(i)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => initiatives.remove(i.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5">
        <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-4"><Users className="w-4 h-4" /> സംഭാവന ചെയ്ത വിദ്യാർത്ഥികൾ</h3>
        {isAuthenticated && (
          <form onSubmit={async (e) => { e.preventDefault(); if (!contrib.student_name.trim()) return; const ok = await contributors.insert({ student_name: contrib.student_name, details: contrib.details || null }); if (ok) setContrib({ student_name: '', details: '' }); }} className="space-y-2 mb-4 p-3 bg-amber-50 rounded-xl">
            <Input placeholder="Student name" value={contrib.student_name} onChange={(e) => setContrib({ ...contrib, student_name: e.target.value })} className="rounded-lg" />
            <Input placeholder="Details (article title, issue, etc.)" value={contrib.details} onChange={(e) => setContrib({ ...contrib, details: e.target.value })} className="rounded-lg" />
            <Button size="sm" type="submit" className="bg-amber-600 hover:bg-amber-700"><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
          </form>
        )}
        {contributors.rows.length === 0 ? <p className="text-center text-sm text-gray-400 py-4">സംഭാവനക്കാർ ഇല്ല</p> : (
          <div className="space-y-2">{contributors.rows.map((c) => (
            <div key={c.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between gap-3">
              <div className="flex-1 min-w-0"><p className="font-medium text-sm text-gray-800">{c.student_name}</p>{c.details && <p className="text-xs text-gray-600">{c.details}</p>}</div>
              {isAuthenticated && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditContrib(c)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => contributors.remove(c.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      <EditEntryDialog
        open={!!editMag}
        onOpenChange={(v) => { if (!v) setEditMag(null); }}
        title="Edit Magazine"
        fields={[{ key: 'title', label: 'Title' }, { key: 'issue_date', label: 'Issue Date', type: 'date' }]}
        initialValues={editMag ? { title: editMag.title, issue_date: editMag.issue_date } : {}}
        onSave={async (vals) => { if (editMag) await magazines.update(editMag.id, { title: vals.title, issue_date: vals.issue_date } as any); }}
      />
      <EditEntryDialog
        open={!!editInit}
        onOpenChange={(v) => { if (!v) setEditInit(null); }}
        title="Edit Program"
        fields={[{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'entry_date', label: 'Date', type: 'date' }]}
        initialValues={editInit ? { title: editInit.title, description: editInit.description || '', entry_date: editInit.entry_date } : {}}
        onSave={async (vals) => { if (editInit) await initiatives.update(editInit.id, { title: vals.title, description: vals.description || null, entry_date: vals.entry_date } as any); }}
      />
      <EditEntryDialog
        open={!!editContrib}
        onOpenChange={(v) => { if (!v) setEditContrib(null); }}
        title="Edit Contributor"
        fields={[{ key: 'student_name', label: 'Student Name' }, { key: 'details', label: 'Details', type: 'textarea' }]}
        initialValues={editContrib ? { student_name: editContrib.student_name, details: editContrib.details || '' } : {}}
        onSave={async (vals) => { if (editContrib) await contributors.update(editContrib.id, { student_name: vals.student_name, details: vals.details || null } as any); }}
      />
    </>
  );
}
