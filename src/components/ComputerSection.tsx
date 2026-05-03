import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import TimetableDisplay from '@/components/TimetableDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Keyboard, Image as ImageIcon, ArrowLeft, Lock, Unlock, CheckCircle2, XCircle,
  Play, Upload, Trash2, Loader2, Pencil, Save, Plus, User as UserIcon, Award
} from 'lucide-react';

type Student = {
  id: string;
  name: string;
  photo_url: string | null;
  score: number | null;
  remarks: string | null;
  sort_order: number;
};

type ClassRow = {
  id: string;
  student_id: string;
  class_number: number;
  title: string | null;
  youtube_url: string | null;
  locked: boolean;
  completed: boolean;
};

type Poster = {
  id: string;
  student_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
};

const TABS = [
  { id: 'typing', label: 'Typing', icon: Keyboard },
  { id: 'photoshop', label: 'Photoshop', icon: ImageIcon },
] as const;

type Tab = typeof TABS[number]['id'];

export default function ComputerSection() {
  const [tab, setTab] = useState<Tab>('typing');
  const [selected, setSelected] = useState<Student | null>(null);

  return (
    <div className="space-y-4">
      {/* Sub-section tabs */}
      <div className="flex gap-2 bg-white rounded-2xl p-2 border border-emerald-100 shadow-sm">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => { setTab(id); setSelected(null); }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active ? 'bg-emerald-600 text-white shadow' : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {tab === 'typing' && <TimetableDisplay />}
      {tab === 'photoshop' && (
        selected
          ? <StudentProfile student={selected} onBack={() => setSelected(null)} onChange={(s) => setSelected(s)} />
          : <PhotoshopList onSelect={setSelected} />
      )}
    </div>
  );
}

/* ========================= LIST ========================= */
function PhotoshopList({ onSelect }: { onSelect: (s: Student) => void }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('photoshop_students')
        .select('*')
        .order('sort_order', { ascending: true });
      setStudents((data as Student[]) || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-emerald-600" /></div>;

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-4">
      <h3 className="text-emerald-800 font-semibold mb-3 flex items-center gap-2">
        <ImageIcon className="w-5 h-5" /> Photoshop Class Students
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {students.map((s, i) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/60 hover:bg-emerald-100 border border-emerald-100 transition text-left"
          >
            {s.photo_url ? (
              <img src={s.photo_url} alt={s.name} className="w-12 h-12 rounded-full object-cover border border-emerald-200" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700">
                <UserIcon className="w-5 h-5" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs text-emerald-600">#{i + 1}</div>
              <div className="font-medium text-gray-800 truncate">{s.name}</div>
            </div>
            {(s.score ?? 0) > 0 && (
              <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">{s.score}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ========================= PROFILE ========================= */
function StudentProfile({ student, onBack, onChange }: {
  student: Student;
  onBack: () => void;
  onChange: (s: Student) => void;
}) {
  const { isAuthenticated: isAdmin } = useAdminAuth();
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingScore, setEditingScore] = useState(false);
  const [scoreForm, setScoreForm] = useState({ score: student.score ?? 0, remarks: student.remarks ?? '' });
  const [editingClass, setEditingClass] = useState<string | null>(null);
  const [classForm, setClassForm] = useState({ title: '', youtube_url: '' });

  const refresh = async () => {
    const [c, p] = await Promise.all([
      supabase.from('photoshop_classes').select('*').eq('student_id', student.id).order('class_number'),
      supabase.from('photoshop_posters').select('*').eq('student_id', student.id).order('created_at', { ascending: false }),
    ]);
    setClasses((c.data as ClassRow[]) || []);
    setPosters((p.data as Poster[]) || []);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, [student.id]);

  /* ---------- Photo ---------- */
  const uploadPhoto = async (file: File) => {
    const path = `students/${student.id}/photo_${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('photoshop').upload(path, file, { upsert: true });
    if (error) return toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    const { data } = supabase.storage.from('photoshop').getPublicUrl(path);
    await supabase.from('photoshop_students').update({ photo_url: data.publicUrl }).eq('id', student.id);
    onChange({ ...student, photo_url: data.publicUrl });
    toast({ title: 'Photo updated' });
  };

  /* ---------- Score ---------- */
  const saveScore = async () => {
    await supabase.from('photoshop_students')
      .update({ score: scoreForm.score, remarks: scoreForm.remarks })
      .eq('id', student.id);
    onChange({ ...student, score: scoreForm.score, remarks: scoreForm.remarks });
    setEditingScore(false);
    toast({ title: 'Score updated' });
  };

  /* ---------- Class ---------- */
  const updateClass = async (id: string, patch: Partial<ClassRow>) => {
    const { error } = await supabase.from('photoshop_classes').update(patch).eq('id', id);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  };

  const startEditClass = (c: ClassRow) => {
    setEditingClass(c.id);
    setClassForm({ title: c.title || '', youtube_url: c.youtube_url || '' });
  };
  const saveEditClass = async () => {
    if (!editingClass) return;
    await updateClass(editingClass, classForm);
    setEditingClass(null);
  };

  /* ---------- Posters ---------- */
  const uploadPoster = async (file: File) => {
    const path = `posters/${student.id}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('photoshop').upload(path, file);
    if (error) return toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    const { data } = supabase.storage.from('photoshop').getPublicUrl(path);
    await supabase.from('photoshop_posters').insert({ student_id: student.id, image_url: data.publicUrl });
    refresh();
    toast({ title: 'Poster uploaded' });
  };
  const deletePoster = async (id: string) => {
    await supabase.from('photoshop_posters').delete().eq('id', id);
    setPosters(prev => prev.filter(p => p.id !== id));
  };

  const ytEmbed = (url: string) => {
    const m = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-emerald-600" /></div>;

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-emerald-700 hover:text-emerald-900">
        <ArrowLeft className="w-4 h-4" /> Back to list
      </button>

      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 flex items-center gap-4">
        <label className={`relative ${isAdmin ? 'cursor-pointer' : ''}`}>
          {student.photo_url ? (
            <img src={student.photo_url} alt={student.name} className="w-20 h-20 rounded-full object-cover border-2 border-emerald-300" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <UserIcon className="w-8 h-8" />
            </div>
          )}
          {isAdmin && (
            <>
              <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
              <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1.5 shadow"><Upload className="w-3 h-3" /></span>
            </>
          )}
        </label>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-emerald-900">{student.name}</h3>
          <p className="text-xs text-emerald-600 mt-0.5">Photoshop Student</p>
        </div>
      </div>

      {/* Score */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-emerald-800 flex items-center gap-2"><Award className="w-4 h-4" /> Performance</h4>
          {isAdmin && !editingScore && (
            <Button size="sm" variant="ghost" onClick={() => setEditingScore(true)}><Pencil className="w-4 h-4" /></Button>
          )}
        </div>
        {editingScore ? (
          <div className="space-y-2">
            <Input type="number" max={100} value={scoreForm.score} onChange={e => setScoreForm(p => ({ ...p, score: parseInt(e.target.value) || 0 }))} placeholder="Score / 100" />
            <Textarea value={scoreForm.remarks} onChange={e => setScoreForm(p => ({ ...p, remarks: e.target.value }))} placeholder="Remarks" rows={2} />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveScore}><Save className="w-4 h-4 mr-1" /> Save</Button>
              <Button size="sm" variant="outline" onClick={() => setEditingScore(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold text-emerald-700">{student.score ?? 0}<span className="text-sm text-gray-500">/100</span></div>
            {student.remarks && <p className="text-sm text-gray-600 mt-1">{student.remarks}</p>}
          </>
        )}
      </div>

      {/* Classes */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5">
        <h4 className="font-semibold text-emerald-800 mb-3">Classes (20)</h4>
        <div className="space-y-2">
          {classes.map(c => {
            const embed = c.youtube_url ? ytEmbed(c.youtube_url) : null;
            const isEditing = editingClass === c.id;
            return (
              <div
                key={c.id}
                className={`rounded-xl border p-3 ${
                  c.locked ? 'bg-gray-50 border-gray-200' :
                  c.completed ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-700 w-6">#{c.class_number}</span>
                  <span className="flex-1 font-medium text-gray-800 text-sm truncate">{c.title || `Class ${c.class_number}`}</span>
                  {c.locked
                    ? <Lock className="w-4 h-4 text-gray-400" />
                    : c.completed
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      : <XCircle className="w-4 h-4 text-rose-500" />
                  }
                </div>

                {isEditing ? (
                  <div className="space-y-2 mt-2">
                    <Input value={classForm.title} onChange={e => setClassForm(p => ({ ...p, title: e.target.value }))} placeholder="Title (optional)" />
                    <Input value={classForm.youtube_url} onChange={e => setClassForm(p => ({ ...p, youtube_url: e.target.value }))} placeholder="YouTube URL" />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEditClass}><Save className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingClass(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {!c.locked && embed && (
                      <div className="aspect-video rounded-lg overflow-hidden mt-2">
                        <iframe src={embed} className="w-full h-full" allowFullScreen title={`Class ${c.class_number}`} />
                      </div>
                    )}
                    {!c.locked && c.youtube_url && !embed && (
                      <a href={c.youtube_url} target="_blank" rel="noreferrer" className="text-xs text-emerald-700 inline-flex items-center gap-1 mt-1">
                        <Play className="w-3 h-3" /> Open video
                      </a>
                    )}

                    {isAdmin && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Button size="sm" variant="outline" onClick={() => startEditClass(c)}>
                          <Pencil className="w-3 h-3 mr-1" /> Link
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateClass(c.id, { locked: !c.locked })}>
                          {c.locked ? <><Unlock className="w-3 h-3 mr-1" /> Unlock</> : <><Lock className="w-3 h-3 mr-1" /> Lock</>}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateClass(c.id, { completed: !c.completed })}>
                          {c.completed ? <><XCircle className="w-3 h-3 mr-1" /> Mark Incomplete</> : <><CheckCircle2 className="w-3 h-3 mr-1" /> Mark Done</>}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Posters */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-emerald-800">Posters Gallery</h4>
          {isAdmin && (
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadPoster(e.target.files[0])} />
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-full">
                <Plus className="w-3 h-3" /> Upload
              </span>
            </label>
          )}
        </div>
        {posters.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No posters yet</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {posters.map(p => (
              <div key={p.id} className="relative group rounded-lg overflow-hidden bg-gray-50 aspect-square">
                <img src={p.image_url} alt={p.caption || 'poster'} className="w-full h-full object-cover" />
                {isAdmin && (
                  <button
                    onClick={() => deletePoster(p.id)}
                    className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
