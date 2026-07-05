import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Trash2, Upload, RefreshCw, Download, FileText, Image as ImageIcon, Music, Save, X, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useQuizSettings, QuizQuestion, QuizStudent, QuizSubmission } from '@/hooks/useQuiz';
import { downloadAllResultsPDF, downloadResultsCSV, downloadSingleResultPDF } from '@/utils/quizExports';

type Tab = 'control' | 'students' | 'questions' | 'results' | 'leaderboard';

export default function QuizAdmin() {
  const [tab, setTab] = useState<Tab>('control');
  const tabs: { id: Tab; label: string }[] = [
    { id: 'control', label: 'നിയന്ത്രണം' },
    { id: 'students', label: 'വിദ്യാർത്ഥികൾ' },
    { id: 'questions', label: 'ചോദ്യങ്ങൾ' },
    { id: 'results', label: 'ഫലങ്ങൾ' },
    { id: 'leaderboard', label: 'റാങ്കിംഗ്' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-6 h-6 text-primary"/>
        <h2 className="text-2xl font-bold">സമസ്ത ക്വിസ് — അഡ്മിൻ</h2>
      </div>
      <div className="flex gap-2 flex-wrap border-b pb-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'control' && <ControlPanel/>}
      {tab === 'students' && <StudentsPanel/>}
      {tab === 'questions' && <QuestionsPanel/>}
      {tab === 'results' && <ResultsPanel/>}
      {tab === 'leaderboard' && <LeaderboardPanel/>}
    </div>
  );
}

function ControlPanel() {
  const { settings, save, loading } = useQuizSettings();
  const [local, setLocal] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (settings) setLocal(settings); }, [settings]);

  if (loading || !local) return <Loader2 className="w-6 h-6 animate-spin"/>;

  const onSave = async () => {
    setSaving(true);
    const ok = await save({
      enabled: local.enabled,
      is_open: local.is_open,
      start_at: local.start_at,
      end_at: local.end_at,
      timer_mode: local.timer_mode,
      time_limit_seconds: local.time_limit_seconds,
      title_ml: local.title_ml,
      title_en: local.title_en,
      intro_ml: local.intro_ml,
      intro_en: local.intro_en,
    });
    setSaving(false);
    toast[ok ? 'success' : 'error'](ok ? 'സേവ് ചെയ്തു' : 'പരാജയം');
  };

  const toLocalInput = (iso: string | null) => iso ? new Date(iso).toISOString().slice(0,16) : '';
  const fromLocalInput = (v: string) => v ? new Date(v).toISOString() : null;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-card border rounded-xl p-4 space-y-3">
        <h3 className="font-semibold">പ്രവർത്തനനില</h3>
        <label className="flex items-center justify-between">Enable Quiz <Switch checked={local.enabled} onCheckedChange={v => setLocal({ ...local, enabled: v })}/></label>
        <label className="flex items-center justify-between">Open Quiz <Switch checked={local.is_open} onCheckedChange={v => setLocal({ ...local, is_open: v })}/></label>
      </div>
      <div className="bg-card border rounded-xl p-4 space-y-3">
        <h3 className="font-semibold">സമയം</h3>
        <div>
          <label className="text-sm">തുടക്കം</label>
          <Input type="datetime-local" value={toLocalInput(local.start_at)} onChange={e => setLocal({ ...local, start_at: fromLocalInput(e.target.value) })}/>
        </div>
        <div>
          <label className="text-sm">അവസാനം</label>
          <Input type="datetime-local" value={toLocalInput(local.end_at)} onChange={e => setLocal({ ...local, end_at: fromLocalInput(e.target.value) })}/>
        </div>
      </div>
      <div className="bg-card border rounded-xl p-4 space-y-3">
        <h3 className="font-semibold">ടൈമർ</h3>
        <select value={local.timer_mode} onChange={e => setLocal({ ...local, timer_mode: e.target.value as any })} className="w-full border rounded-md px-3 py-2 bg-background">
          <option value="per_question">ഓരോ ചോദ്യത്തിന്</option>
          <option value="whole_quiz">മൊത്തം ക്വിസിന്</option>
        </select>
        <div>
          <label className="text-sm">സെക്കൻഡുകൾ</label>
          <div className="flex gap-2 flex-wrap mt-1">
            {[30,60,120,180,300,600].map(s => (
              <button key={s} type="button" onClick={() => setLocal({ ...local, time_limit_seconds: s })}
                className={`px-3 py-1 rounded-md text-sm border ${local.time_limit_seconds === s ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>{s}s</button>
            ))}
          </div>
          <Input type="number" min={5} className="mt-2" value={local.time_limit_seconds} onChange={e => setLocal({ ...local, time_limit_seconds: parseInt(e.target.value || '0') })}/>
        </div>
      </div>
      <div className="bg-card border rounded-xl p-4 space-y-3 md:col-span-2">
        <h3 className="font-semibold">തലക്കെട്ട് & പരിചയം</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <Input value={local.title_ml} onChange={e => setLocal({ ...local, title_ml: e.target.value })} placeholder="തലക്കെട്ട് (മലയാളം)"/>
          <Input value={local.title_en} onChange={e => setLocal({ ...local, title_en: e.target.value })} placeholder="Title (English)"/>
          <Textarea rows={2} value={local.intro_ml} onChange={e => setLocal({ ...local, intro_ml: e.target.value })} placeholder="പരിചയം (മലയാളം)"/>
          <Textarea rows={2} value={local.intro_en} onChange={e => setLocal({ ...local, intro_en: e.target.value })} placeholder="Intro (English)"/>
        </div>
      </div>
      <div className="md:col-span-2">
        <Button onClick={onSave} disabled={saving} className="w-full md:w-auto">{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2"/>}സേവ് ചെയ്യുക</Button>
      </div>
    </div>
  );
}

function StudentsPanel() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [u, setU] = useState(''); const [n, setN] = useState('');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('quiz_students').select('*').order('display_name');
    setStudents((data || []) as any); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!u.trim() || !n.trim()) return;
    const { error } = await supabase.from('quiz_students').insert({ username: u.trim().toLowerCase(), display_name: n.trim() } as any);
    if (error) return toast.error(error.message);
    setU(''); setN(''); load(); toast.success('ചേർത്തു');
  };
  const del = async (id: string) => {
    if (!confirm('നീക്കം ചെയ്യണോ?')) return;
    await supabase.from('quiz_students').delete().eq('id', id); load();
  };
  const reset = async (id: string) => {
    await supabase.from('quiz_students').update({ used: false, used_at: null } as any).eq('id', id); load();
    toast.success('റീസെറ്റ് ചെയ്തു');
  };
  const toggleEnabled = async (s: any) => {
    await supabase.from('quiz_students').update({ enabled: !s.enabled } as any).eq('id', s.id); load();
  };
  const saveEdit = async () => {
    if (!editing) return;
    const { error } = await supabase.from('quiz_students').update({
      username: editing.username.trim().toLowerCase(),
      display_name: editing.display_name.trim(),
    } as any).eq('id', editing.id);
    if (error) return toast.error(error.message);
    setEditing(null); load(); toast.success('അപ്ഡേറ്റ് ചെയ്തു');
  };

  const filtered = students.filter(s =>
    !q.trim() || s.username.toLowerCase().includes(q.toLowerCase()) || (s.display_name || '').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="bg-card border rounded-xl p-4 flex flex-col md:flex-row gap-2">
        <Input value={u} onChange={e => setU(e.target.value)} placeholder="username"/>
        <Input value={n} onChange={e => setN(e.target.value)} placeholder="Display name"/>
        <Button onClick={add}><Plus className="w-4 h-4 mr-1"/>ചേർക്കുക</Button>
      </div>
      <Input value={q} onChange={e => setQ(e.target.value)} placeholder="തിരയുക / Search…" />

      {editing && (
        <div className="bg-card border-2 border-primary/40 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">യൂസർനെയിം എഡിറ്റ്</h3>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="w-4 h-4"/></Button>
          </div>
          <Input value={editing.username} onChange={e => setEditing({ ...editing, username: e.target.value })} placeholder="username"/>
          <Input value={editing.display_name} onChange={e => setEditing({ ...editing, display_name: e.target.value })} placeholder="Display name"/>
          <Button onClick={saveEdit}><Save className="w-4 h-4 mr-2"/>സേവ്</Button>
        </div>
      )}

      {loading ? <Loader2 className="w-6 h-6 animate-spin"/> : (
        <div className="bg-card border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50"><tr><th className="p-3 text-left">പേര്</th><th className="p-3 text-left">യൂസർനെയിം</th><th className="p-3">സ്ഥിതി</th><th className="p-3">സജീവം</th><th className="p-3"></th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-t">
                  <td className="p-3">{s.display_name}</td>
                  <td className="p-3 font-mono text-xs">{s.username}</td>
                  <td className="p-3 text-center">{s.used ? <span className="text-red-600">ഉപയോഗിച്ചു</span> : <span className="text-emerald-600">സജീവം</span>}</td>
                  <td className="p-3 text-center"><Switch checked={s.enabled !== false} onCheckedChange={() => toggleEnabled(s)}/></td>
                  <td className="p-3 text-right space-x-1 whitespace-nowrap">
                    <Button size="sm" variant="outline" onClick={() => setEditing({ id: s.id, username: s.username, display_name: s.display_name })}>എഡിറ്റ്</Button>
                    {s.used && <Button size="sm" variant="outline" onClick={() => reset(s.id)}><RefreshCw className="w-3 h-3"/></Button>}
                    <Button size="sm" variant="destructive" onClick={() => del(s.id)}><Trash2 className="w-3 h-3"/></Button>
                  </td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">ഇല്ല</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function QuestionsPanel() {
  const [items, setItems] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<QuizQuestion | null>(null);
  const { uploadImage, uploading } = useImageUpload();
  const fileRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('quiz_questions').select('*').order('order_index');
    setItems((data || []) as any); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const startNew = () => setEditing({
    id: '', order_index: items.length, type: 'mcq',
    question_text: '', image_url: null, audio_url: null,
    options: ['', '', '', ''], correct_index: 0,
  });
  const startEdit = (q: QuizQuestion) => setEditing({ ...q, options: [...q.options] });

  const save = async () => {
    if (!editing) return;
    if (!editing.question_text.trim()) return toast.error('ചോദ്യം നൽകുക');
    const payload: any = { ...editing }; delete payload.id;
    const op = editing.id
      ? supabase.from('quiz_questions').update(payload).eq('id', editing.id)
      : supabase.from('quiz_questions').insert(payload);
    const { error } = await op;
    if (error) return toast.error(error.message);
    setEditing(null); load(); toast.success('സേവ് ചെയ്തു');
  };
  const del = async (id: string) => {
    if (!confirm('നീക്കം ചെയ്യണോ?')) return;
    await supabase.from('quiz_questions').delete().eq('id', id); load();
  };

  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f || !editing) return;
    const url = await uploadImage(f, 'quiz'); if (url) setEditing({ ...editing, image_url: url });
    e.target.value = '';
  };
  const onPickAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f || !editing) return;
    const url = await uploadImage(f, 'quiz-audio'); if (url) setEditing({ ...editing, audio_url: url });
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">{items.length} ചോദ്യങ്ങൾ</p>
        <Button onClick={startNew}><Plus className="w-4 h-4 mr-1"/>പുതിയത്</Button>
      </div>

      {editing && (
        <div className="bg-card border-2 border-primary/40 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{editing.id ? 'എഡിറ്റ്' : 'പുതിയ ചോദ്യം'}</h3>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="w-4 h-4"/></Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value as any })} className="border rounded-md px-3 py-2 bg-background">
              <option value="mcq">MCQ (Text)</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="text">Text only</option>
            </select>
            <Input type="number" value={editing.order_index} onChange={e => setEditing({ ...editing, order_index: parseInt(e.target.value || '0') })} placeholder="Order"/>
          </div>
          <Textarea rows={3} value={editing.question_text} onChange={e => setEditing({ ...editing, question_text: e.target.value })} placeholder="ചോദ്യം"/>

          <div className="grid md:grid-cols-2 gap-2">
            <div>
              <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                <ImageIcon className="w-4 h-4 mr-1"/>{editing.image_url ? 'ഇമേജ് മാറ്റുക' : 'ഇമേജ് ചേർക്കുക'}
              </Button>
              <input ref={fileRef} type="file" accept="image/*" onChange={onPickImage} className="hidden"/>
              {editing.image_url && <div className="mt-2 relative"><img src={editing.image_url} className="max-h-32 rounded border"/><button onClick={() => setEditing({ ...editing, image_url: null })} className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1"><X className="w-3 h-3"/></button></div>}
            </div>
            <div>
              <Button type="button" variant="outline" size="sm" onClick={() => audioRef.current?.click()} disabled={uploading}>
                <Music className="w-4 h-4 mr-1"/>{editing.audio_url ? 'ഓഡിയോ മാറ്റുക' : 'ഓഡിയോ ചേർക്കുക'}
              </Button>
              <input ref={audioRef} type="file" accept="audio/*" onChange={onPickAudio} className="hidden"/>
              {editing.audio_url && <div className="mt-2 flex items-center gap-2"><audio src={editing.audio_url} controls className="flex-1"/><button onClick={() => setEditing({ ...editing, audio_url: null })}><X className="w-3 h-3"/></button></div>}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">ഉത്തരങ്ങൾ</p>
            {editing.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="radio" name="correct" checked={editing.correct_index === i} onChange={() => setEditing({ ...editing, correct_index: i })}/>
                <Input value={opt} onChange={e => {
                  const ops = [...editing.options]; ops[i] = e.target.value;
                  setEditing({ ...editing, options: ops });
                }} placeholder={`Option ${String.fromCharCode(65+i)}`}/>
                {editing.options.length > 2 && (
                  <Button size="sm" variant="ghost" onClick={() => {
                    const ops = editing.options.filter((_, j) => j !== i);
                    setEditing({ ...editing, options: ops, correct_index: Math.min(editing.correct_index, ops.length-1) });
                  }}><Trash2 className="w-3 h-3"/></Button>
                )}
              </div>
            ))}
            {editing.options.length < 6 && (
              <Button size="sm" variant="outline" onClick={() => setEditing({ ...editing, options: [...editing.options, ''] })}>
                <Plus className="w-3 h-3 mr-1"/>ഓപ്ഷൻ
              </Button>
            )}
          </div>
          <Button onClick={save}><Save className="w-4 h-4 mr-2"/>സേവ്</Button>
        </div>
      )}

      {loading ? <Loader2 className="w-6 h-6 animate-spin"/> : (
        <div className="space-y-2">
          {items.map((q, i) => (
            <div key={q.id} className="bg-card border rounded-xl p-3 flex items-start gap-3">
              <div className="text-xs font-mono bg-muted rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">{i+1}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{q.question_text}</p>
                <p className="text-xs text-muted-foreground">{q.options.length} options · ശരി: {String.fromCharCode(65 + q.correct_index)} · {q.type}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => startEdit(q)}>എഡിറ്റ്</Button>
              <Button size="sm" variant="destructive" onClick={() => del(q.id)}><Trash2 className="w-3 h-3"/></Button>
            </div>
          ))}
          {!items.length && <p className="text-sm text-muted-foreground text-center py-8">ചോദ്യങ്ങൾ ഇല്ല</p>}
        </div>
      )}
    </div>
  );
}

function ResultsPanel() {
  const [rows, setRows] = useState<QuizSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('quiz_submissions').select('*').order('submitted_at', { ascending: false });
    setRows((data || []) as any); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const stats = {
    total: rows.length,
    highest: rows.reduce((m, r) => Math.max(m, r.score), 0),
    avg: rows.length ? (rows.reduce((s, r) => s + r.score, 0) / rows.length).toFixed(1) : '0',
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin"/>;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="സമർപ്പിച്ചവർ" value={stats.total}/>
        <StatCard label="ഉയർന്ന സ്കോർ" value={stats.highest}/>
        <StatCard label="ശരാശരി" value={stats.avg}/>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => downloadAllResultsPDF(rows)}><Download className="w-4 h-4 mr-1"/>എല്ലാം PDF</Button>
        <Button variant="outline" size="sm" onClick={() => downloadResultsCSV(rows)}><FileText className="w-4 h-4 mr-1"/>CSV</Button>
        <Button variant="outline" size="sm" onClick={() => window.print()}>Print</Button>
        <Button variant="outline" size="sm" onClick={load}><RefreshCw className="w-4 h-4"/></Button>
      </div>
      <div className="bg-card border rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-muted/50"><tr>
            <th className="p-2 text-left">പേര്</th><th className="p-2">യൂസർ</th><th className="p-2">മൊബൈൽ</th>
            <th className="p-2">സ്കോർ</th><th className="p-2">ശരി/തെറ്റ്</th><th className="p-2">സമയം</th><th></th>
          </tr></thead>
          <tbody>
            {rows.map(s => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.full_name}</td>
                <td className="p-2 font-mono text-xs">{s.username}</td>
                <td className="p-2">{s.mobile}</td>
                <td className="p-2 text-center font-bold">{s.score}/{s.total}</td>
                <td className="p-2 text-center text-xs">{s.correct_count}/{s.wrong_count}</td>
                <td className="p-2 text-xs">{new Date(s.submitted_at).toLocaleString()}</td>
                <td className="p-2 text-right"><Button size="sm" variant="ghost" onClick={() => downloadSingleResultPDF(s)}><Download className="w-3 h-3"/></Button></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">ഫലങ്ങൾ ഇല്ല</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeaderboardPanel() {
  const [rows, setRows] = useState<QuizSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from('quiz_submissions').select('*').order('score', { ascending: false }).then(({ data }) => {
      setRows((data || []) as any); setLoading(false);
    });
  }, []);
  if (loading) return <Loader2 className="w-6 h-6 animate-spin"/>;
  const medals = ['🥇','🥈','🥉'];
  return (
    <div className="space-y-2">
      {rows.map((s, i) => (
        <div key={s.id} className={`bg-card border rounded-xl p-3 flex items-center gap-3 ${i<3?'border-amber-400/60':''}`}>
          <div className="text-2xl w-10 text-center">{medals[i] || `#${i+1}`}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{s.full_name}</p>
            <p className="text-xs text-muted-foreground">{s.username} · {s.mobile}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{s.score}<span className="text-sm text-muted-foreground">/{s.total}</span></div>
            <div className="text-xs text-muted-foreground">ശരി {s.correct_count}</div>
          </div>
        </div>
      ))}
      {!rows.length && <p className="text-center py-8 text-muted-foreground">ഫലങ്ങൾ ഇല്ല</p>}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-card border rounded-xl p-3 text-center">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
