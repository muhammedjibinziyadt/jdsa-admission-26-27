import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit2, Loader2, BookOpen, Lightbulb, Upload, Download, ExternalLink, PenSquare, Keyboard, Check, X } from 'lucide-react';
import { useCommitteeEdit } from '@/hooks/useCommitteeEdit';
import { useCommitteeTable, uploadCommitteeFile } from '@/hooks/useCommitteeTable';
import EditEntryDialog from '@/components/committee/EditEntryDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Magazine { id: string; title: string; issue_date: string; pdf_url: string; cover_url: string | null; }
interface Initiative { id: string; title: string; description: string | null; entry_date: string; }
interface Student { id: string; name: string; sort_order: number; }
interface Submission { id: string; student_id: string; year_month: string; submitted: boolean; }

// April=Writing (month index 3), May=Typing (4), alternates.
function monthTypeFor(year: number, monthIdx0: number): 'writing' | 'typing' {
  // April (idx 3) → writing. Even-from-April → writing, odd → typing.
  const offset = ((monthIdx0 - 3) % 12 + 12) % 12;
  return offset % 2 === 0 ? 'writing' : 'typing';
}
function fmtYearMonth(year: number, monthIdx0: number) {
  return `${year}-${String(monthIdx0 + 1).padStart(2, '0')}`;
}

export default function JawahirBody() {
  const { canEdit } = useCommitteeEdit('jawahir');
  const magazines = useCommitteeTable<Magazine>('jawahir_magazines', 'issue_date');
  const initiatives = useCommitteeTable<Initiative>('jawahir_initiatives', 'entry_date');

  const [mag, setMag] = useState({ title: '', issue_date: new Date().toISOString().slice(0, 10) });
  const [magFile, setMagFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [init, setInit] = useState({ title: '', description: '' });

  const [editMag, setEditMag] = useState<Magazine | null>(null);
  const [editInit, setEditInit] = useState<Initiative | null>(null);

  // Tracking
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [monthIdx, setMonthIdx] = useState(now.getMonth());
  const ym = fmtYearMonth(year, monthIdx);
  const monthType = monthTypeFor(year, monthIdx);
  const monthLabel = new Date(year, monthIdx, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const [students, setStudents] = useState<Student[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [trackLoading, setTrackLoading] = useState(true);
  const [newStudent, setNewStudent] = useState('');
  const [editStudent, setEditStudent] = useState<Student | null>(null);

  const fetchStudents = useCallback(async () => {
    const { data } = await (supabase as any).from('jawahir_students').select('*').order('sort_order', { ascending: true });
    if (data) setStudents(data as Student[]);
  }, []);
  const fetchSubs = useCallback(async () => {
    const { data } = await (supabase as any).from('jawahir_submissions').select('*').eq('year_month', ym);
    if (data) setSubs(data as Submission[]);
  }, [ym]);

  useEffect(() => {
    setTrackLoading(true);
    Promise.all([fetchStudents(), fetchSubs()]).finally(() => setTrackLoading(false));
  }, [fetchStudents, fetchSubs]);

  const subMap = new Map(subs.map(s => [s.student_id, s]));

  const toggleSub = async (studentId: string) => {
    if (!canEdit) return;
    const existing = subMap.get(studentId);
    if (existing) {
      const { error } = await (supabase as any).from('jawahir_submissions').update({ submitted: !existing.submitted, updated_at: new Date().toISOString() }).eq('id', existing.id);
      if (error) { toast.error(error.message); return; }
    } else {
      const { error } = await (supabase as any).from('jawahir_submissions').insert({ student_id: studentId, year_month: ym, submitted: true });
      if (error) { toast.error(error.message); return; }
    }
    fetchSubs();
  };

  const addStudent = async () => {
    if (!newStudent.trim()) return;
    const maxOrder = students.reduce((m, s) => Math.max(m, s.sort_order), 0);
    const { error } = await (supabase as any).from('jawahir_students').insert({ name: newStudent.trim(), sort_order: maxOrder + 1 });
    if (error) { toast.error(error.message); return; }
    toast.success('Added');
    setNewStudent('');
    fetchStudents();
  };
  const removeStudent = async (id: string) => {
    if (!window.confirm('Remove this student? Submission history will be deleted.')) return;
    const { error } = await (supabase as any).from('jawahir_students').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    fetchStudents(); fetchSubs();
  };

  const submittedCount = students.filter(s => subMap.get(s.id)?.submitted).length;

  return (
    <>
      {/* MAGAZINES */}
      <section className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5">
        <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-4"><BookOpen className="w-4 h-4" /> അൽ ജവാഹിർ മാഗസിൻ</h3>
        {canEdit && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!magFile || !mag.title.trim()) return;
            setUploading(true);
            const pdf_url = await uploadCommitteeFile('jawahir', magFile, 'pdf');
            const cover_url = coverFile ? await uploadCommitteeFile('jawahir', coverFile, 'covers') : null;
            if (pdf_url) {
              const ok = await magazines.insert({ title: mag.title, issue_date: mag.issue_date, pdf_url, cover_url } as any);
              if (ok) { setMag({ title: '', issue_date: new Date().toISOString().slice(0, 10) }); setMagFile(null); setCoverFile(null); }
            }
            setUploading(false);
          }} className="space-y-2 mb-4 p-3 bg-amber-50 rounded-xl">
            <Input placeholder="Magazine title" value={mag.title} onChange={(e) => setMag({ ...mag, title: e.target.value })} className="rounded-lg" />
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
                  {canEdit && (
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

      {/* MONTHLY ARTICLE TRACKING */}
      <section className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5">
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
            {monthType === 'writing' ? <PenSquare className="w-4 h-4" /> : <Keyboard className="w-4 h-4" />}
            മാസ ലേഖനം ട്രാക്കിംഗ്
          </h3>
          <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${monthType === 'writing' ? 'bg-amber-600 text-white' : 'bg-indigo-600 text-white'}`}>
            {monthType === 'writing' ? 'WRITING' : 'TYPING'} • {monthLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <select value={monthIdx} onChange={(e) => setMonthIdx(Number(e.target.value))} className="px-2 py-1.5 rounded-lg border border-amber-200 text-sm bg-white">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>{new Date(2020, i, 1).toLocaleDateString('en', { month: 'long' })}</option>
            ))}
          </select>
          <Input type="number" min="2024" max="2099" value={year} onChange={(e) => setYear(Number(e.target.value) || now.getFullYear())} className="w-24 rounded-lg" />
          <span className="text-xs text-gray-500 ml-auto">{submittedCount}/{students.length} submitted</span>
        </div>

        {trackLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {students.map((s) => {
              const sub = subMap.get(s.id);
              const submitted = !!sub?.submitted;
              return (
                <div key={s.id} className={`flex items-center justify-between gap-2 p-2.5 rounded-lg border ${submitted ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${submitted ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                      {submitted ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </span>
                    <span className="text-sm font-medium text-gray-800 truncate">{s.name}</span>
                  </div>
                  {canEdit && (
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => toggleSub(s.id)} className={`text-[10px] font-bold px-2 py-1 rounded ${submitted ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                        {submitted ? 'Mark ✖' : 'Mark ✔'}
                      </button>
                      <button onClick={() => setEditStudent(s)} className="text-blue-500 hover:text-blue-700 px-1"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => removeStudent(s.id)} className="text-rose-500 hover:text-rose-700 px-1"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {canEdit && (
          <div className="mt-3 flex gap-2">
            <Input placeholder="Add student name" value={newStudent} onChange={(e) => setNewStudent(e.target.value)} className="rounded-lg" />
            <Button size="sm" onClick={addStudent} className="bg-amber-600 hover:bg-amber-700"><Plus className="w-3.5 h-3.5" /></Button>
          </div>
        )}
      </section>

      {/* PROGRAMS */}
      <section className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5">
        <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-4"><Lightbulb className="w-4 h-4" /> പ്രോഗ്രാമുകൾ / പദ്ധതികൾ</h3>
        {canEdit && (
          <form onSubmit={async (e) => { e.preventDefault(); if (!init.title.trim()) return; const ok = await initiatives.insert({ title: init.title, description: init.description || null } as any); if (ok) setInit({ title: '', description: '' }); }} className="space-y-2 mb-4 p-3 bg-amber-50 rounded-xl">
            <Input placeholder="Title" value={init.title} onChange={(e) => setInit({ ...init, title: e.target.value })} className="rounded-lg" />
            <textarea placeholder="Description" value={init.description} onChange={(e) => setInit({ ...init, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-amber-200 text-sm" rows={2} />
            <Button size="sm" type="submit" className="bg-amber-600 hover:bg-amber-700"><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
          </form>
        )}
        {initiatives.rows.length === 0 ? <p className="text-center text-sm text-gray-400 py-4">പ്രോഗ്രാമുകൾ ഇല്ല</p> : (
          <div className="space-y-2">{initiatives.rows.map((i) => (
            <div key={i.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between gap-3">
              <div className="flex-1 min-w-0"><p className="font-medium text-sm text-gray-800">{i.title}</p>{i.description && <p className="text-xs text-gray-600 mt-0.5">{i.description}</p>}<p className="text-xs text-gray-400 mt-1">{new Date(i.entry_date).toLocaleDateString('en-IN')}</p></div>
              {canEdit && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditInit(i)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => initiatives.remove(i.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      <EditEntryDialog open={!!editMag} onOpenChange={(v) => { if (!v) setEditMag(null); }} title="Edit Magazine"
        fields={[{ key: 'title', label: 'Title' }, { key: 'issue_date', label: 'Issue Date', type: 'date' }]}
        initialValues={editMag ? { title: editMag.title, issue_date: editMag.issue_date } : {}}
        onSave={async (vals) => { if (editMag) await magazines.update(editMag.id, { title: vals.title, issue_date: vals.issue_date } as any); }} />
      <EditEntryDialog open={!!editInit} onOpenChange={(v) => { if (!v) setEditInit(null); }} title="Edit Program"
        fields={[{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'entry_date', label: 'Date', type: 'date' }]}
        initialValues={editInit ? { title: editInit.title, description: editInit.description || '', entry_date: editInit.entry_date } : {}}
        onSave={async (vals) => { if (editInit) await initiatives.update(editInit.id, { title: vals.title, description: vals.description || null, entry_date: vals.entry_date } as any); }} />
      <EditEntryDialog open={!!editStudent} onOpenChange={(v) => { if (!v) setEditStudent(null); }} title="Edit Student"
        fields={[{ key: 'name', label: 'Name' }, { key: 'sort_order', label: 'Sort Order', type: 'number' }]}
        initialValues={editStudent ? { name: editStudent.name, sort_order: editStudent.sort_order } : {}}
        onSave={async (vals) => {
          if (!editStudent) return;
          const { error } = await (supabase as any).from('jawahir_students').update({ name: vals.name, sort_order: Number(vals.sort_order) || 0 }).eq('id', editStudent.id);
          if (error) toast.error(error.message); else { toast.success('Saved'); fetchStudents(); }
        }} />
    </>
  );
}
