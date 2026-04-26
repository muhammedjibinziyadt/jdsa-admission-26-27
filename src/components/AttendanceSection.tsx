import { useState, useRef, useMemo } from 'react';
import { ArrowLeft, Plus, Camera, Trash2, Pencil, CheckCircle, XCircle, CalendarDays, Loader2, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { useAttendanceStudents, useStudentDetail, type AttendanceStudent, type LeaveRecord } from '@/hooks/useAttendance';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AttendanceSection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (selectedId) {
    return <StudentProfile studentId={selectedId} onBack={() => setSelectedId(null)} />;
  }
  return <StudentList onSelect={setSelectedId} />;
}

// ──────────────────────────── LIST ────────────────────────────
function StudentList({ onSelect }: { onSelect: (id: string) => void }) {
  const { isAuthenticated } = useAdminAuth();
  const { students, loading, addStudent, deleteStudent } = useAttendanceStudents();
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const ok = await addStudent(newName.trim());
    if (ok) { setNewName(''); setAdding(false); }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
            <User className="w-5 h-5" /> വിദ്യാർത്ഥികൾ
          </h2>
          {isAuthenticated && (
            <Button size="sm" onClick={() => setAdding(true)} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-1" /> ചേർക്കുക
            </Button>
          )}
        </div>

        {!isAuthenticated && (
          <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" /> എഡിറ്റ് ചെയ്യാൻ അഡ്മിൻ ലോഗിൻ ആവശ്യമാണ്
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-emerald-600" /></div>
        ) : students.length === 0 ? (
          <p className="text-gray-500 text-center py-8">വിദ്യാർത്ഥികൾ ഇല്ല</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {students.map((s, i) => (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className="group relative bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-left hover:bg-emerald-100/70 hover:border-emerald-300 transition-all"
              >
                <div className="aspect-square w-full rounded-lg overflow-hidden bg-emerald-200/60 mb-2 flex items-center justify-center">
                  {s.photo_url ? (
                    <img src={s.photo_url} alt={s.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <User className="w-8 h-8 text-emerald-500/70" />
                  )}
                </div>
                <div className="text-xs font-medium text-emerald-900 truncate">{i + 1}. {s.name}</div>
                {isAuthenticated && (
                  <button
                    onClick={(e) => { e.stopPropagation(); if (confirm(`Delete ${s.name}?`)) deleteStudent(s.id); }}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent>
          <DialogHeader><DialogTitle>പുതിയ വിദ്യാർത്ഥി</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Label>പേര്</Label>
            <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Student name" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdding(false)}>റദ്ദാക്കുക</Button>
            <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">ചേർക്കുക</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ──────────────────────────── PROFILE ────────────────────────────
function StudentProfile({ studentId, onBack }: { studentId: string; onBack: () => void }) {
  const { isAuthenticated } = useAdminAuth();
  const { student, records, leaves, loading, summary, upsertRecord, deleteRecord, addLeave, updateLeave, deleteLeave } = useStudentDetail(studentId);
  const { uploadPhoto, updateStudent } = useAttendanceStudents();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handlePhoto = async (file: File) => {
    setUploading(true);
    const url = await uploadPhoto(file);
    if (url && student) await updateStudent(student.id, { photo_url: url });
    setUploading(false);
    window.location.reload(); // simplest way to refresh detail too
  };

  if (loading || !student) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-emerald-600" /></div>;
  }

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900">
        <ArrowLeft className="w-4 h-4" /> തിരികെ
      </button>

      {/* Photo + Name */}
      <Card className="p-5 bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-emerald-200/60 flex items-center justify-center border-2 border-emerald-300">
              {student.photo_url ? (
                <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-emerald-500/70" />
              )}
            </div>
            {isAuthenticated && (
              <>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow hover:bg-emerald-700"
                  aria-label="Upload photo"
                >
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handlePhoto(e.target.files[0])} />
              </>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-emerald-900 truncate">{student.name}</h3>
            <p className="text-xs text-emerald-700/70">വിദ്യാർത്ഥി പ്രൊഫൈൽ</p>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center bg-emerald-50 border-emerald-200">
          <div className="text-2xl font-bold text-emerald-700">{summary.present}</div>
          <div className="text-xs text-emerald-700/80 mt-1">സന്നിഹിതം</div>
        </Card>
        <Card className="p-3 text-center bg-rose-50 border-rose-200">
          <div className="text-2xl font-bold text-rose-700">{summary.absent}</div>
          <div className="text-xs text-rose-700/80 mt-1">അസാന്നിഹിതം</div>
        </Card>
        <Card className="p-3 text-center bg-amber-50 border-amber-200">
          <div className="text-2xl font-bold text-amber-700">{summary.leave}</div>
          <div className="text-xs text-amber-700/80 mt-1">അവധി</div>
        </Card>
      </div>

      {/* Attendance */}
      <AttendanceBlock
        studentId={studentId}
        records={records}
        isAdmin={isAuthenticated}
        onSave={upsertRecord}
        onDelete={deleteRecord}
      />

      {/* Leaves */}
      <LeaveBlock
        studentId={studentId}
        leaves={leaves}
        isAdmin={isAuthenticated}
        onAdd={addLeave}
        onUpdate={updateLeave}
        onDelete={deleteLeave}
      />
    </div>
  );
}

// ──────────────────────────── ATTENDANCE BLOCK ────────────────────────────
function AttendanceBlock({ studentId, records, isAdmin, onSave, onDelete }: {
  studentId: string;
  records: ReturnType<typeof useStudentDetail>['records'];
  isAdmin: boolean;
  onSave: (rec: any) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ entry_date: today, status: 'present' as 'present' | 'absent', time_in: '', time_out: '', notes: '' });

  const submit = async () => {
    const ok = await onSave({ student_id: studentId, ...form, time_in: form.time_in || null, time_out: form.time_out || null, notes: form.notes || null });
    if (ok) setOpen(false);
  };

  return (
    <Card className="p-5 border-emerald-100">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-emerald-800 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> അറ്റൻഡൻസ്</h4>
        {isAdmin && <Button size="sm" onClick={() => setOpen(true)} className="bg-emerald-600 hover:bg-emerald-700"><Plus className="w-3.5 h-3.5 mr-1" /> മാർക്ക്</Button>}
      </div>

      {records.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">റെക്കോർഡുകൾ ഇല്ല</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {records.map(r => (
            <div key={r.id} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${r.status === 'present' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
              <div className="flex items-center gap-2 min-w-0">
                {r.status === 'present' ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-800">{formatDate(r.entry_date)}</div>
                  {(r.time_in || r.time_out) && (
                    <div className="text-[11px] text-gray-500">{r.time_in || '—'} → {r.time_out || '—'}</div>
                  )}
                </div>
              </div>
              {isAdmin && (
                <button onClick={() => onDelete(r.id)} className="p-1 text-rose-500 hover:bg-rose-100 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>അറ്റൻഡൻസ് മാർക്ക് ചെയ്യുക</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label>തീയതി</Label>
              <Input type="date" value={form.entry_date} onChange={e => setForm(p => ({ ...p, entry_date: e.target.value }))} />
            </div>
            <div>
              <Label>സ്റ്റാറ്റസ്</Label>
              <div className="flex gap-2 mt-1">
                <button type="button" onClick={() => setForm(p => ({ ...p, status: 'present' }))} className={`flex-1 py-2 rounded-lg border text-sm font-medium ${form.status === 'present' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200'}`}>സന്നിഹിതം</button>
                <button type="button" onClick={() => setForm(p => ({ ...p, status: 'absent' }))} className={`flex-1 py-2 rounded-lg border text-sm font-medium ${form.status === 'absent' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-gray-600 border-gray-200'}`}>അസാന്നിഹിതം</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Time In</Label>
                <Input type="time" value={form.time_in} onChange={e => setForm(p => ({ ...p, time_in: e.target.value }))} />
              </div>
              <div>
                <Label>Time Out</Label>
                <Input type="time" value={form.time_out} onChange={e => setForm(p => ({ ...p, time_out: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>റദ്ദാക്കുക</Button>
            <Button onClick={submit} className="bg-emerald-600 hover:bg-emerald-700">സേവ് ചെയ്യുക</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ──────────────────────────── LEAVE BLOCK ────────────────────────────
function LeaveBlock({ studentId, leaves, isAdmin, onAdd, onUpdate, onDelete }: {
  studentId: string;
  leaves: LeaveRecord[];
  isAdmin: boolean;
  onAdd: (l: any) => Promise<boolean>;
  onUpdate: (id: string, p: any) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LeaveRecord | null>(null);
  const today = new Date().toISOString().split('T')[0];
  const blank = { start_date: today, end_date: today, total_days: 1, reason: '', return_date: '' };
  const [form, setForm] = useState(blank);

  const computedDays = useMemo(() => {
    const a = new Date(form.start_date).getTime();
    const b = new Date(form.end_date).getTime();
    if (!a || !b || b < a) return form.total_days;
    return Math.floor((b - a) / 86400000) + 1;
  }, [form.start_date, form.end_date, form.total_days]);

  const openAdd = () => { setEditing(null); setForm(blank); setOpen(true); };
  const openEdit = (l: LeaveRecord) => {
    setEditing(l);
    setForm({ start_date: l.start_date, end_date: l.end_date, total_days: l.total_days, reason: l.reason || '', return_date: l.return_date || '' });
    setOpen(true);
  };

  const submit = async () => {
    const payload = {
      start_date: form.start_date,
      end_date: form.end_date,
      total_days: computedDays,
      reason: form.reason || null,
      return_date: form.return_date || null,
    };
    const ok = editing
      ? await onUpdate(editing.id, payload)
      : await onAdd({ student_id: studentId, ...payload });
    if (ok) setOpen(false);
  };

  return (
    <Card className="p-5 border-amber-100">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-amber-800 flex items-center gap-2"><CalendarDays className="w-4 h-4" /> അവധി ചരിത്രം</h4>
        {isAdmin && <Button size="sm" onClick={openAdd} className="bg-amber-600 hover:bg-amber-700"><Plus className="w-3.5 h-3.5 mr-1" /> ചേർക്കുക</Button>}
      </div>

      {leaves.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">അവധി രേഖകൾ ഇല്ല</p>
      ) : (
        <div className="space-y-2">
          {leaves.map(l => (
            <div key={l.id} className="px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-amber-900">
                    {formatDate(l.start_date)} → {formatDate(l.end_date)}
                    <span className="ml-2 text-[11px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">{l.total_days} ദിവസം</span>
                  </div>
                  {l.reason && <div className="text-xs text-amber-800/80 mt-0.5">കാരണം: {l.reason}</div>}
                  {l.return_date && <div className="text-xs text-emerald-700 mt-0.5">തിരികെ: {formatDate(l.return_date)}</div>}
                </div>
                {isAdmin && (
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(l)} className="p-1 text-amber-700 hover:bg-amber-100 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => onDelete(l.id)} className="p-1 text-rose-500 hover:bg-rose-100 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'അവധി എഡിറ്റ്' : 'പുതിയ അവധി'}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>തുടക്കം</Label>
                <Input type="date" value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} />
              </div>
              <div>
                <Label>അവസാനം</Label>
                <Input type="date" value={form.end_date} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>ആകെ ദിവസങ്ങൾ ({computedDays})</Label>
              <Input type="number" min={1} value={form.total_days} onChange={e => setForm(p => ({ ...p, total_days: parseInt(e.target.value) || 1 }))} />
            </div>
            <div>
              <Label>കാരണം</Label>
              <Input value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} placeholder="Sick / Personal / ..." />
            </div>
            <div>
              <Label>തിരികെ വന്ന തീയതി</Label>
              <Input type="date" value={form.return_date} onChange={e => setForm(p => ({ ...p, return_date: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>റദ്ദാക്കുക</Button>
            <Button onClick={submit} className="bg-amber-600 hover:bg-amber-700">സേവ് ചെയ്യുക</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return d; }
}
