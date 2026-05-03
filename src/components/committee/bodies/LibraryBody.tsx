import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit2, Loader2, Book, Calendar, BookOpen, ScrollText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useCommitteeEdit } from '@/hooks/useCommitteeEdit';
import { useCommitteeTable, uploadCommitteeFile } from '@/hooks/useCommitteeTable';
import EditEntryDialog from '@/components/committee/EditEntryDialog';

interface LBook { id: string; name: string; author: string | null; photo_url: string | null; status: 'available' | 'missing'; }
interface Program { id: string; title: string; description: string | null; entry_date: string; }
interface Issue { id: string; student_name: string; book_name: string; issue_date: string; issue_time: string | null; notes: string | null; status: 'taken' | 'returned' | 'not_taken'; return_date: string | null; return_time: string | null; day_name: string | null; }

const STUDENT_LIST = [
  'Muhammad Navas', 'Muhammad Jibin Ziyad', 'Muhammad Anshid', 'Muhammad Jareer',
  'Muhammad Shimlal', 'Muhammad Sidan', 'Muhammad Sinan', 'Muhammad Shafi P',
  'Muhammad Ameen', 'Muhammad Shereef', 'Muhammad Jubair', 'Muhammad Afham',
  'Muhammad Jinshad', 'Muhammad Shafi K', 'Salman Faris',
];
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export default function LibraryBody() {
  const { canEdit } = useCommitteeEdit('library');
  const books = useCommitteeTable<LBook>('library_books');
  const programs = useCommitteeTable<Program>('library_programs', 'entry_date');
  const issues = useCommitteeTable<Issue>('library_book_issues', 'issue_date');

  const [bookForm, setBookForm] = useState({ name: '', author: '', status: 'available' as 'available' | 'missing' });
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progForm, setProgForm] = useState({ title: '', description: '' });
  const [issueForm, setIssueForm] = useState({
    student_name: '',
    book_name: '',
    issue_date: new Date().toISOString().slice(0, 10),
    issue_time: new Date().toTimeString().slice(0, 5),
    notes: '',
  });

  const [editBook, setEditBook] = useState<LBook | null>(null);
  const [editProg, setEditProg] = useState<Program | null>(null);
  const [editIssue, setEditIssue] = useState<Issue | null>(null);

  return (
    <>
      {/* BOOK LIST + STATUS */}
      <section className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5">
        <h3 className="text-sm font-semibold text-purple-800 flex items-center gap-2 mb-4"><Book className="w-4 h-4" /> പുസ്തക ലിസ്റ്റ്</h3>
        {canEdit && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!bookForm.name.trim()) return;
            setUploading(true);
            const photo_url = bookFile ? await uploadCommitteeFile('library', bookFile, 'books') : null;
            const ok = await books.insert({ name: bookForm.name, author: bookForm.author || null, photo_url, status: bookForm.status } as any);
            if (ok) { setBookForm({ name: '', author: '', status: 'available' }); setBookFile(null); }
            setUploading(false);
          }} className="space-y-2 mb-4 p-3 bg-purple-50 rounded-xl">
            <Input placeholder="Book name" value={bookForm.name} onChange={(e) => setBookForm({ ...bookForm, name: e.target.value })} className="rounded-lg" />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Author (optional)" value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} className="rounded-lg" />
              <select value={bookForm.status} onChange={(e) => setBookForm({ ...bookForm, status: e.target.value as any })} className="px-3 py-2 rounded-lg border border-purple-200 bg-white text-sm">
                <option value="available">Available</option>
                <option value="missing">Missing</option>
              </select>
            </div>
            <Input type="file" accept="image/*" onChange={(e) => setBookFile(e.target.files?.[0] || null)} className="rounded-lg" />
            <Button size="sm" type="submit" disabled={uploading} className="bg-purple-600 hover:bg-purple-700">{uploading ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Plus className="w-3.5 h-3.5 mr-1" />} Add Book</Button>
          </form>
        )}
        {books.loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : books.rows.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">പുസ്തകങ്ങൾ ഇല്ല</p>
        ) : (
          <div className="space-y-2">{books.rows.map((b) => {
            const missing = b.status === 'missing';
            return (
              <div key={b.id} className={`p-3 rounded-lg border flex items-center gap-3 ${missing ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50/40 border-emerald-200'}`}>
                {b.photo_url ? <img src={b.photo_url} alt={b.name} className="w-10 h-12 object-cover rounded flex-shrink-0" /> : <div className="w-10 h-12 bg-purple-100 flex items-center justify-center rounded text-purple-400 flex-shrink-0"><BookOpen className="w-5 h-5" /></div>}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{b.name}</p>
                  {b.author && <p className="text-[11px] text-gray-500 truncate">{b.author}</p>}
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full inline-flex items-center gap-1 ${missing ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                  {missing ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                  {missing ? 'MISSING' : 'AVAILABLE'}
                </span>
                {canEdit && (
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={async () => { await books.update(b.id, { status: missing ? 'available' : 'missing' } as any); }} className="text-xs text-gray-500 hover:text-purple-600" title="Toggle status"><CheckCircle2 className="w-4 h-4" /></button>
                    <button onClick={() => setEditBook(b)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => books.remove(b.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            );
          })}</div>
        )}
      </section>

      {/* BOOK ISSUE RECORDS */}
      <section className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5">
        <h3 className="text-sm font-semibold text-purple-800 flex items-center gap-2 mb-4"><ScrollText className="w-4 h-4" /> ബുക്ക് ഇഷ്യൂ റെക്കോർഡ്</h3>
        {canEdit && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!issueForm.student_name.trim() || !issueForm.book_name.trim()) return;
            const ok = await issues.insert({
              student_name: issueForm.student_name,
              book_name: issueForm.book_name,
              issue_date: issueForm.issue_date,
              issue_time: issueForm.issue_time || null,
              notes: issueForm.notes || null,
            } as any);
            if (ok) setIssueForm({ student_name: '', book_name: '', issue_date: new Date().toISOString().slice(0, 10), issue_time: new Date().toTimeString().slice(0, 5), notes: '' });
          }} className="space-y-2 mb-4 p-3 bg-purple-50 rounded-xl">
            <Input placeholder="Student name" value={issueForm.student_name} onChange={(e) => setIssueForm({ ...issueForm, student_name: e.target.value })} className="rounded-lg" />
            <Input placeholder="Book name" value={issueForm.book_name} onChange={(e) => setIssueForm({ ...issueForm, book_name: e.target.value })} className="rounded-lg" />
            <div className="grid grid-cols-2 gap-2">
              <Input type="date" value={issueForm.issue_date} onChange={(e) => setIssueForm({ ...issueForm, issue_date: e.target.value })} className="rounded-lg" />
              <Input type="time" value={issueForm.issue_time} onChange={(e) => setIssueForm({ ...issueForm, issue_time: e.target.value })} className="rounded-lg" />
            </div>
            <Input placeholder="Notes (optional)" value={issueForm.notes} onChange={(e) => setIssueForm({ ...issueForm, notes: e.target.value })} className="rounded-lg" />
            <Button size="sm" type="submit" className="bg-purple-600 hover:bg-purple-700"><Plus className="w-3.5 h-3.5 mr-1" /> Record Issue</Button>
          </form>
        )}
        {issues.loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : issues.rows.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">റെക്കോർഡുകൾ ഇല്ല</p>
        ) : (
          <div className="space-y-2">{issues.rows.map((i) => (
            <div key={i.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{i.student_name}</p>
                <p className="text-xs text-purple-700">{i.book_name}</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {new Date(i.issue_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}{i.issue_time ? ` · ${i.issue_time}` : ''}
                </p>
                {i.notes && <p className="text-xs text-gray-500 mt-0.5">{i.notes}</p>}
              </div>
              {canEdit && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditIssue(i)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => issues.remove(i.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      {/* PROGRAMS */}
      <section className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5">
        <h3 className="text-sm font-semibold text-purple-800 flex items-center gap-2 mb-4"><Calendar className="w-4 h-4" /> പ്രോഗ്രാമുകൾ</h3>
        {canEdit && (
          <form onSubmit={async (e) => { e.preventDefault(); if (!progForm.title.trim()) return; const ok = await programs.insert({ title: progForm.title, description: progForm.description || null } as any); if (ok) setProgForm({ title: '', description: '' }); }} className="space-y-2 mb-4 p-3 bg-purple-50 rounded-xl">
            <Input placeholder="Program title" value={progForm.title} onChange={(e) => setProgForm({ ...progForm, title: e.target.value })} className="rounded-lg" />
            <textarea placeholder="Description" value={progForm.description} onChange={(e) => setProgForm({ ...progForm, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-purple-200 text-sm" rows={2} />
            <Button size="sm" type="submit" className="bg-purple-600 hover:bg-purple-700"><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
          </form>
        )}
        {programs.rows.length === 0 ? <p className="text-center text-sm text-gray-400 py-4">പ്രോഗ്രാമുകൾ ഇല്ല</p> : (
          <div className="space-y-2">{programs.rows.map((p) => (
            <div key={p.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between gap-3">
              <div className="flex-1 min-w-0"><p className="font-medium text-sm">{p.title}</p>{p.description && <p className="text-xs text-gray-600">{p.description}</p>}<p className="text-xs text-gray-400 mt-1">{new Date(p.entry_date).toLocaleDateString('en-IN')}</p></div>
              {canEdit && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditProg(p)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => programs.remove(p.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      <EditEntryDialog open={!!editBook} onOpenChange={(v) => { if (!v) setEditBook(null); }} title="Edit Book"
        fields={[{ key: 'name', label: 'Name' }, { key: 'author', label: 'Author' }, { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Available', value: 'available' }, { label: 'Missing', value: 'missing' }] }]}
        initialValues={editBook ? { name: editBook.name, author: editBook.author || '', status: editBook.status || 'available' } : {}}
        onSave={async (vals) => { if (editBook) await books.update(editBook.id, { name: vals.name, author: vals.author || null, status: vals.status } as any); }} />
      <EditEntryDialog open={!!editProg} onOpenChange={(v) => { if (!v) setEditProg(null); }} title="Edit Program"
        fields={[{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'entry_date', label: 'Date', type: 'date' }]}
        initialValues={editProg ? { title: editProg.title, description: editProg.description || '', entry_date: editProg.entry_date } : {}}
        onSave={async (vals) => { if (editProg) await programs.update(editProg.id, { title: vals.title, description: vals.description || null, entry_date: vals.entry_date } as any); }} />
      <EditEntryDialog open={!!editIssue} onOpenChange={(v) => { if (!v) setEditIssue(null); }} title="Edit Issue Record"
        fields={[{ key: 'student_name', label: 'Student' }, { key: 'book_name', label: 'Book' }, { key: 'issue_date', label: 'Date', type: 'date' }, { key: 'issue_time', label: 'Time' }, { key: 'notes', label: 'Notes', type: 'textarea' }]}
        initialValues={editIssue ? { student_name: editIssue.student_name, book_name: editIssue.book_name, issue_date: editIssue.issue_date, issue_time: editIssue.issue_time || '', notes: editIssue.notes || '' } : {}}
        onSave={async (vals) => { if (editIssue) await issues.update(editIssue.id, { student_name: vals.student_name, book_name: vals.book_name, issue_date: vals.issue_date, issue_time: vals.issue_time || null, notes: vals.notes || null } as any); }} />
    </>
  );
}
