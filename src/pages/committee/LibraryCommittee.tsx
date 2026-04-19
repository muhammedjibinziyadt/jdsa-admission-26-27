import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Loader2, Book, Calendar, PenTool, Upload, BookOpen } from 'lucide-react';
import CommitteePageShell from '@/components/committee/CommitteePageShell';
import { useCommitteeAuth } from '@/hooks/useCommittees';
import { useCommitteeTable, uploadCommitteeFile } from '@/hooks/useCommitteeTable';

interface LBook { id: string; name: string; author: string | null; photo_url: string | null; }
interface Program { id: string; title: string; description: string | null; entry_date: string; }
interface Activity { id: string; student_name: string; activity_title: string; details: string | null; }

export default function LibraryCommittee() {
  const { isLoggedIn } = useCommitteeAuth('library');
  const books = useCommitteeTable<LBook>('library_books');
  const programs = useCommitteeTable<Program>('library_programs', 'entry_date');
  const activities = useCommitteeTable<Activity>('library_activities');

  const [bookForm, setBookForm] = useState({ name: '', author: '' });
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progForm, setProgForm] = useState({ title: '', description: '' });
  const [actForm, setActForm] = useState({ student_name: '', activity_title: '', details: '' });

  return (
    <CommitteePageShell id="library">
      {/* Books */}
      <section className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5">
        <h3 className="text-sm font-semibold text-purple-800 flex items-center gap-2 mb-4"><Book className="w-4 h-4" /> പുതിയ പുസ്തകങ്ങൾ</h3>
        {isLoggedIn && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!bookForm.name.trim()) return;
            setUploading(true);
            const photo_url = bookFile ? await uploadCommitteeFile('library', bookFile, 'books') : null;
            const ok = await books.insert({ name: bookForm.name, author: bookForm.author || null, photo_url });
            if (ok) { setBookForm({ name: '', author: '' }); setBookFile(null); }
            setUploading(false);
          }} className="space-y-2 mb-4 p-3 bg-purple-50 rounded-xl">
            <Input placeholder="Book name" value={bookForm.name} onChange={(e) => setBookForm({ ...bookForm, name: e.target.value })} className="rounded-lg" />
            <Input placeholder="Author (optional)" value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} className="rounded-lg" />
            <Input type="file" accept="image/*" onChange={(e) => setBookFile(e.target.files?.[0] || null)} className="rounded-lg" />
            <Button size="sm" type="submit" disabled={uploading} className="bg-purple-600 hover:bg-purple-700">{uploading ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Plus className="w-3.5 h-3.5 mr-1" />} Add Book</Button>
          </form>
        )}
        {books.rows.length === 0 ? <p className="text-center text-sm text-gray-400 py-4">പുസ്തകങ്ങൾ ഇല്ല</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{books.rows.map((b) => (
            <div key={b.id} className="rounded-xl border border-gray-100 overflow-hidden bg-gray-50 group relative">
              {b.photo_url ? <img src={b.photo_url} alt={b.name} className="w-full aspect-[3/4] object-cover" /> : <div className="aspect-[3/4] bg-purple-100 flex items-center justify-center text-purple-400"><BookOpen className="w-10 h-10" /></div>}
              <div className="p-2"><p className="text-xs font-medium text-gray-800 truncate">{b.name}</p>{b.author && <p className="text-[10px] text-gray-500 truncate">{b.author}</p>}</div>
              {isLoggedIn && <button onClick={() => books.remove(b.id)} className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3" /></button>}
            </div>
          ))}</div>
        )}
      </section>

      {/* Programs */}
      <section className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5">
        <h3 className="text-sm font-semibold text-purple-800 flex items-center gap-2 mb-4"><Calendar className="w-4 h-4" /> പ്രോഗ്രാമുകൾ</h3>
        {isLoggedIn && (
          <form onSubmit={async (e) => { e.preventDefault(); if (!progForm.title.trim()) return; const ok = await programs.insert({ title: progForm.title, description: progForm.description || null }); if (ok) setProgForm({ title: '', description: '' }); }} className="space-y-2 mb-4 p-3 bg-purple-50 rounded-xl">
            <Input placeholder="Program title" value={progForm.title} onChange={(e) => setProgForm({ ...progForm, title: e.target.value })} className="rounded-lg" />
            <textarea placeholder="Description" value={progForm.description} onChange={(e) => setProgForm({ ...progForm, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-purple-200 text-sm" rows={2} />
            <Button size="sm" type="submit" className="bg-purple-600 hover:bg-purple-700"><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
          </form>
        )}
        {programs.rows.length === 0 ? <p className="text-center text-sm text-gray-400 py-4">പ്രോഗ്രാമുകൾ ഇല്ല</p> : (
          <div className="space-y-2">{programs.rows.map((p) => (
            <div key={p.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between gap-3">
              <div className="flex-1 min-w-0"><p className="font-medium text-sm">{p.title}</p>{p.description && <p className="text-xs text-gray-600">{p.description}</p>}<p className="text-xs text-gray-400 mt-1">{new Date(p.entry_date).toLocaleDateString('en-IN')}</p></div>
              {isLoggedIn && <button onClick={() => programs.remove(p.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>}
            </div>
          ))}</div>
        )}
      </section>

      {/* Student Activities */}
      <section className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5">
        <h3 className="text-sm font-semibold text-purple-800 flex items-center gap-2 mb-4"><PenTool className="w-4 h-4" /> വിദ്യാർത്ഥി പ്രവർത്തനങ്ങൾ (ഉപന്യാസം)</h3>
        {isLoggedIn && (
          <form onSubmit={async (e) => { e.preventDefault(); if (!actForm.student_name.trim() || !actForm.activity_title.trim()) return; const ok = await activities.insert({ student_name: actForm.student_name, activity_title: actForm.activity_title, details: actForm.details || null }); if (ok) setActForm({ student_name: '', activity_title: '', details: '' }); }} className="space-y-2 mb-4 p-3 bg-purple-50 rounded-xl">
            <Input placeholder="Student name" value={actForm.student_name} onChange={(e) => setActForm({ ...actForm, student_name: e.target.value })} className="rounded-lg" />
            <Input placeholder="Essay / Activity title" value={actForm.activity_title} onChange={(e) => setActForm({ ...actForm, activity_title: e.target.value })} className="rounded-lg" />
            <Input placeholder="Details" value={actForm.details} onChange={(e) => setActForm({ ...actForm, details: e.target.value })} className="rounded-lg" />
            <Button size="sm" type="submit" className="bg-purple-600 hover:bg-purple-700"><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
          </form>
        )}
        {activities.rows.length === 0 ? <p className="text-center text-sm text-gray-400 py-4">പ്രവർത്തനങ്ങൾ ഇല്ല</p> : (
          <div className="space-y-2">{activities.rows.map((a) => (
            <div key={a.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between gap-3">
              <div className="flex-1 min-w-0"><p className="font-medium text-sm text-gray-800">{a.student_name}</p><p className="text-xs text-purple-700">{a.activity_title}</p>{a.details && <p className="text-xs text-gray-600">{a.details}</p>}</div>
              {isLoggedIn && <button onClick={() => activities.remove(a.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>}
            </div>
          ))}</div>
        )}
      </section>
    </CommitteePageShell>
  );
}
