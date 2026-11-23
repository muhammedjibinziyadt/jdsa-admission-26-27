import { useEffect, useMemo, useRef, useState } from 'react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { ArrowDown, ArrowUp, BookOpen, Eye, FilePlus2, ImagePlus, KeyRound, LoaderCircle, LockKeyhole, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { libraryRequest, uploadLibraryFile, type AdminBookDraft, type OnlineBook } from '@/utils/onlineLibrary';
import { useLibraryAdminSession } from '@/hooks/useOnlineLibrary';

GlobalWorkerOptions.workerSrc = workerUrl;

const PAGE_FORMATS = [
  ['original', 'Original PDF dimensions'],
  ['a4-portrait', 'A4 Portrait'],
  ['a4-landscape', 'A4 Landscape'],
  ['a5-portrait', 'A5 Portrait'],
  ['a5-landscape', 'A5 Landscape'],
  ['custom', 'Custom page size'],
] as const;

const emptyBook = (): AdminBookDraft => ({
  title: '', author: '', description: '', category: 'General', cover_path: null, pdf_path: '', total_pages: 1,
  publication_date: '', book_language: 'ml', reading_direction: 'ltr', visibility: 'unpublished',
  page_format: 'original', custom_page_width: null, custom_page_height: null, display_order: 0,
});

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

export default function OnlineLibraryAdmin({ enabled }: { enabled: boolean }) {
  const session = useLibraryAdminSession(enabled);
  const [password, setPassword] = useState('');
  const [books, setBooks] = useState<OnlineBook[]>([]);
  const [storageBytes, setStorageBytes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [draft, setDraft] = useState<AdminBookDraft>(emptyBook());
  const [showForm, setShowForm] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [newAccessPassword, setNewAccessPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    if (!session.token) return;
    setLoading(true);
    try {
      const result = await libraryRequest<{ books: OnlineBook[]; storageBytes: number }>('admin-list', {}, session.token);
      setBooks(result.books);
      setStorageBytes(result.storageBytes);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'പുസ്തകങ്ങൾ ലോഡ് ചെയ്യാനായില്ല');
      session.logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void refresh(); }, [session.token]);

  const categories = useMemo(() => [...new Set(books.map(book => book.category).filter(Boolean))], [books]);

  const handlePdf = async (file: File | undefined) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('PDF ഫയൽ തിരഞ്ഞെടുക്കുക');
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      toast.error('PDF ഫയൽ 500 MB-ൽ താഴെയായിരിക്കണം');
      return;
    }
    try {
      const task = getDocument({ data: await file.arrayBuffer() });
      const pdf = await task.promise;
      if (pdf.numPages > 500) {
        await pdf.destroy();
        toast.error('ഒരു പുസ്തകത്തിന് പരമാവധി 500 പേജുകൾ');
        return;
      }
      setDraft(current => ({ ...current, total_pages: pdf.numPages, title: current.title || file.name.replace(/\.pdf$/i, '') }));
      await pdf.destroy();
      setPdfFile(file);
    } catch {
      toast.error('ഈ PDF വായിക്കാനായില്ല');
    }
  };

  const handleCover = (file: File | undefined) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('JPG, PNG, WEBP ചിത്രങ്ങൾ മാത്രം');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('കവർ ചിത്രം 10 MB-ൽ താഴെയായിരിക്കണം');
      return;
    }
    setCoverFile(file);
  };

  const beginNew = () => {
    setDraft(emptyBook());
    setPdfFile(null);
    setCoverFile(null);
    setShowForm(true);
  };

  const beginEdit = (book: OnlineBook) => {
    setDraft({ ...book, publication_date: book.publication_date ?? '', pdf_path: book.pdf_path ?? '' });
    setPdfFile(null);
    setCoverFile(null);
    setShowForm(true);
  };

  const saveBook = async () => {
    if (!session.token || !draft.title.trim() || (!draft.pdf_path && !pdfFile)) {
      toast.error('പുസ്തകത്തിന്റെ പേരും PDF-ഉം ആവശ്യമാണ്');
      return;
    }
    setSaving(true);
    setProgress(0);
    try {
      let pdfPath = draft.pdf_path;
      let coverPath = draft.cover_path;
      if (pdfFile) pdfPath = await uploadLibraryFile(pdfFile, session.token, setProgress);
      if (coverFile) coverPath = await uploadLibraryFile(coverFile, session.token, setProgress);
      await libraryRequest('admin-save', { book: { ...draft, pdf_path: pdfPath, cover_path: coverPath } }, session.token);
      toast.success(draft.id ? 'പുസ്തകവിവരങ്ങൾ അപ്‌ഡേറ്റ് ചെയ്തു' : 'പുസ്തകം ചേർത്തു');
      setShowForm(false);
      setDraft(emptyBook());
      setPdfFile(null);
      setCoverFile(null);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'സേവ് ചെയ്യാനായില്ല');
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async (book: OnlineBook) => {
    if (!session.token) return;
    try {
      await libraryRequest('admin-save', { book: { ...book, visibility: book.visibility === 'published' ? 'unpublished' : 'published' } }, session.token);
      await refresh();
      toast.success(book.visibility === 'published' ? 'പുസ്തകം പ്രസിദ്ധീകരണത്തിൽ നിന്ന് മാറ്റി' : 'പുസ്തകം പ്രസിദ്ധീകരിച്ചു');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'സ്ഥിതി മാറ്റാനായില്ല');
    }
  };

  const deleteBook = async (book: OnlineBook) => {
    if (!session.token || !window.confirm(`“${book.title}” നീക്കം ചെയ്യണോ?`)) return;
    try {
      await libraryRequest('admin-delete', { id: book.id }, session.token);
      await refresh();
      toast.success('പുസ്തകം നീക്കം ചെയ്തു');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'നീക്കം ചെയ്യാനായില്ല');
    }
  };

  const moveBook = async (book: OnlineBook, direction: -1 | 1) => {
    if (!session.token) return;
    const index = books.findIndex(item => item.id === book.id);
    const other = books[index + direction];
    if (!other) return;
    try {
      await Promise.all([
        libraryRequest('admin-save', { book: { ...book, display_order: other.display_order } }, session.token),
        libraryRequest('admin-save', { book: { ...other, display_order: book.display_order } }, session.token),
      ]);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'ക്രമം മാറ്റാനായില്ല');
    }
  };

  const preview = async (book: OnlineBook) => {
    if (!session.token) return;
    try {
      const { url } = await libraryRequest<{ url: string }>('admin-read-url', { id: book.id }, session.token);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'പ്രിവ്യൂ തുറക്കാനായില്ല');
    }
  };

  const changeAccessPassword = async () => {
    if (!session.token || newAccessPassword.length < 8 || newAccessPassword.length > 128) {
      toast.error('8 മുതൽ 128 വരെ അക്ഷരങ്ങളുള്ള പാസ്‌വേഡ് നൽകുക');
      return;
    }
    setChangingPassword(true);
    try {
      await libraryRequest('admin-password-change', { newPassword: newAccessPassword }, session.token);
      setNewAccessPassword('');
      toast.success('വായനശാല പാസ്‌വേഡ് അപ്‌ഡേറ്റ് ചെയ്തു');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'പാസ്‌വേഡ് മാറ്റാനായില്ല');
    } finally {
      setChangingPassword(false);
    }
  };

  if (!enabled) return <section className="space-y-4 border border-border bg-card p-6"><h2 className="font-display text-xl font-semibold">ഓൺലൈൻ വായനശാല മാനേജ്മെന്റ്</h2><p className="text-sm text-muted-foreground">ഈ നിയന്ത്രണങ്ങൾ Main Admin അക്കൗണ്ടിൽ മാത്രം ലഭ്യമാണ്.</p></section>;

  if (!session.token) return (
    <section className="mx-auto max-w-xl space-y-5 border border-border bg-card p-6 shadow-soft sm:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10 text-primary"><LockKeyhole className="h-6 w-6" /></div>
      <div><h2 className="font-display text-2xl font-semibold">Online Reading Library Management</h2><p className="mt-1 text-sm text-muted-foreground">Main Admin പാസ്‌വേഡ് വീണ്ടും പരിശോധിക്കുക.</p></div>
      <form onSubmit={event => { event.preventDefault(); void session.verify(password); }} className="space-y-3">
        <Label htmlFor="library-admin-password">അഡ്മിൻ പാസ്‌വേഡ്</Label>
        <Input id="library-admin-password" type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" />
        {session.error && <p role="alert" className="text-sm text-destructive">{session.error}</p>}
        <Button type="submit" disabled={!password || session.loading} className="w-full">{session.loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}പരിശോധിച്ച് തുറക്കുക</Button>
      </form>
    </section>
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-end">
        <div><p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">Main Admin</p><h2 className="font-display text-2xl font-semibold">Online Reading Library Management</h2><p className="mt-1 text-sm text-muted-foreground">പുസ്തകങ്ങൾ, പ്രസിദ്ധീകരണം, പ്രവേശന പാസ്‌വേഡ് എന്നിവ കൈകാര്യം ചെയ്യുക.</p></div>
        <Button variant="outline" onClick={session.logout}><LockKeyhole className="mr-2 h-4 w-4" />വീണ്ടും ലോക്ക് ചെയ്യുക</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="border border-border bg-card p-4"><p className="text-sm text-muted-foreground">അപ്‌ലോഡ് ചെയ്ത പുസ്തകങ്ങൾ</p><p className="mt-1 text-2xl font-semibold">{books.length}</p></div>
        <div className="border border-border bg-card p-4"><p className="text-sm text-muted-foreground">പ്രസിദ്ധീകരിച്ചത്</p><p className="mt-1 text-2xl font-semibold">{books.filter(book => book.visibility === 'published').length}</p></div>
        <div className="border border-border bg-card p-4"><p className="text-sm text-muted-foreground">ഫയൽ ഉപയോഗം</p><p className="mt-1 text-2xl font-semibold">{formatBytes(storageBytes)}</p></div>
      </div>

      <div className="flex flex-col gap-3 border border-border bg-card p-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2"><Label htmlFor="new-library-password">വായനശാലയുടെ പുതിയ പാസ്‌വേഡ്</Label><Input id="new-library-password" type="password" value={newAccessPassword} onChange={event => setNewAccessPassword(event.target.value)} minLength={8} maxLength={128} placeholder="പുതിയ പ്രവേശന പാസ്‌വേഡ്" /></div>
        <Button variant="outline" disabled={changingPassword || newAccessPassword.length < 8} onClick={() => void changeAccessPassword()}>{changingPassword ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}പാസ്‌വേഡ് മാറ്റുക</Button>
      </div>

      <div className="flex items-center justify-between gap-3"><h3 className="font-display text-xl font-semibold">പുസ്തക ശേഖരം</h3><Button onClick={beginNew}><Plus className="mr-2 h-4 w-4" />പുസ്തകം ചേർക്കുക</Button></div>
      {showForm && <div className="space-y-5 border border-border bg-card p-4 shadow-soft sm:p-6">
        <div className="flex items-center justify-between gap-3"><h3 className="font-display text-lg font-semibold">{draft.id ? 'പുസ്തകവിവരങ്ങൾ തിരുത്തുക' : 'പുതിയ ഓൺലൈൻ പുസ്തകം'}</h3><Button size="icon" variant="ghost" aria-label="Close form" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2"><Label htmlFor="book-title">പുസ്തകത്തിന്റെ പേര് *</Label><Input id="book-title" value={draft.title} onChange={event => setDraft(current => ({ ...current, title: event.target.value }))} maxLength={255} /></div>
          <div className="space-y-2"><Label htmlFor="book-author">രചയിതാവ്</Label><Input id="book-author" value={draft.author} onChange={event => setDraft(current => ({ ...current, author: event.target.value }))} maxLength={255} /></div>
          <div className="space-y-2"><Label htmlFor="book-category">വിഭാഗം</Label><Input id="book-category" list="online-book-categories" value={draft.category} onChange={event => setDraft(current => ({ ...current, category: event.target.value }))} maxLength={100} /><datalist id="online-book-categories">{categories.map(item => <option key={item} value={item} />)}</datalist></div>
          <div className="space-y-2"><Label htmlFor="book-date">പ്രസിദ്ധീകരണ തീയതി</Label><Input id="book-date" type="date" value={draft.publication_date ?? ''} onChange={event => setDraft(current => ({ ...current, publication_date: event.target.value }))} /></div>
          <div className="space-y-2"><Label htmlFor="book-language">ഭാഷ</Label><Select value={draft.book_language} onValueChange={value => setDraft(current => ({ ...current, book_language: value }))}><SelectTrigger id="book-language"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ml">മലയാളം</SelectItem><SelectItem value="ar">العربية</SelectItem><SelectItem value="en">English</SelectItem><SelectItem value="other">മറ്റുള്ളവ</SelectItem></SelectContent></Select></div>
          <div className="space-y-2"><Label htmlFor="book-direction">വായനാ ദിശ</Label><Select value={draft.reading_direction} onValueChange={value => setDraft(current => ({ ...current, reading_direction: value as 'ltr' | 'rtl' }))}><SelectTrigger id="book-direction"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ltr">ഇടത്തുനിന്ന് വലത്തേക്ക്</SelectItem><SelectItem value="rtl">വലത്തുനിന്ന് ഇടത്തേക്ക്</SelectItem></SelectContent></Select></div>
          <div className="space-y-2"><Label htmlFor="book-pages">ആകെ പേജുകൾ</Label><Input id="book-pages" type="number" min={1} max={500} value={draft.total_pages} onChange={event => setDraft(current => ({ ...current, total_pages: Number(event.target.value) }))} /></div>
          <div className="space-y-2"><Label htmlFor="book-format">പേജ് വലുപ്പം</Label><Select value={draft.page_format} onValueChange={value => setDraft(current => ({ ...current, page_format: value as AdminBookDraft['page_format'] }))}><SelectTrigger id="book-format"><SelectValue /></SelectTrigger><SelectContent>{PAGE_FORMATS.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>
          {draft.page_format === 'custom' && <><div className="space-y-2"><Label htmlFor="custom-width">വീതി (mm)</Label><Input id="custom-width" type="number" min={50} value={draft.custom_page_width ?? ''} onChange={event => setDraft(current => ({ ...current, custom_page_width: Number(event.target.value) || null }))} /></div><div className="space-y-2"><Label htmlFor="custom-height">ഉയരം (mm)</Label><Input id="custom-height" type="number" min={50} value={draft.custom_page_height ?? ''} onChange={event => setDraft(current => ({ ...current, custom_page_height: Number(event.target.value) || null }))} /></div></>}
          <div className="space-y-2"><Label htmlFor="book-visibility">പ്രസിദ്ധീകരണ നില</Label><Select value={draft.visibility} onValueChange={value => setDraft(current => ({ ...current, visibility: value as AdminBookDraft['visibility'] }))}><SelectTrigger id="book-visibility"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="published">പ്രസിദ്ധീകരിച്ചത്</SelectItem><SelectItem value="unpublished">പ്രസിദ്ധീകരിക്കാത്തത്</SelectItem></SelectContent></Select></div>
          <div className="space-y-2"><Label htmlFor="book-order">പ്രദർശന ക്രമം</Label><Input id="book-order" type="number" value={draft.display_order} onChange={event => setDraft(current => ({ ...current, display_order: Number(event.target.value) || 0 }))} /></div>
          <div className="space-y-2 sm:col-span-2 lg:col-span-3"><Label htmlFor="book-description">ചെറിയ വിവരണം</Label><Textarea id="book-description" value={draft.description} onChange={event => setDraft(current => ({ ...current, description: event.target.value }))} maxLength={5000} rows={3} /></div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input ref={pdfInputRef} type="file" accept="application/pdf,.pdf" className="sr-only" onChange={event => void handlePdf(event.target.files?.[0])} />
          <Button type="button" variant="outline" className="h-auto min-h-14 justify-start whitespace-normal py-3 text-left" onClick={() => pdfInputRef.current?.click()}><FilePlus2 className="mr-3 h-5 w-5 shrink-0" /><span>{pdfFile ? `${pdfFile.name} · ${draft.total_pages} പേജ്` : draft.pdf_path ? 'നിലവിലെ PDF നിലനിർത്തുക / പുതിയത് തിരഞ്ഞെടുക്കുക' : 'PDF പുസ്തകം തിരഞ്ഞെടുക്കുക *'}</span></Button>
          <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={event => handleCover(event.target.files?.[0])} />
          <Button type="button" variant="outline" className="h-auto min-h-14 justify-start whitespace-normal py-3 text-left" onClick={() => coverInputRef.current?.click()}><ImagePlus className="mr-3 h-5 w-5 shrink-0" /><span>{coverFile ? coverFile.name : draft.cover_path ? 'കവർ മാറ്റാൻ തിരഞ്ഞെടുക്കുക' : 'കവർ ചിത്രം തിരഞ്ഞെടുക്കുക'}</span></Button>
        </div>
        {saving && <div className="space-y-1"><div className="h-2 overflow-hidden bg-muted"><div role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} className="h-full bg-primary transition-[width]" style={{ width: `${progress}%` }} /></div><p className="text-xs text-muted-foreground">അപ്‌ലോഡ് {progress}%</p></div>}
        <div className="flex flex-wrap gap-2"><Button onClick={() => void saveBook()} disabled={saving || !draft.title.trim() || (!draft.pdf_path && !pdfFile)}>{saving ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}{draft.id ? 'മാറ്റങ്ങൾ സേവ് ചെയ്യുക' : 'പുസ്തകം ചേർക്കുക'}</Button><Button variant="outline" onClick={() => setShowForm(false)}>റദ്ദാക്കുക</Button></div>
      </div>}

      {loading ? <div className="flex justify-center py-12"><LoaderCircle className="h-6 w-6 animate-spin text-primary" /></div> : books.length === 0 ? <div className="border border-dashed border-border py-14 text-center text-sm text-muted-foreground">ഓൺലൈൻ ശേഖരത്തിൽ പുസ്തകങ്ങളില്ല.</div> : (
        <div className="divide-y divide-border border-y border-border">
          {books.map((book, index) => <article key={book.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
            <div className="flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden border border-border bg-muted text-primary">{book.cover_url ? <img src={book.cover_url} alt="" className="h-full w-full object-cover" /> : <BookOpen className="h-7 w-7" />}</div>
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h4 className="font-semibold">{book.title}</h4><span className={`border px-2 py-0.5 text-[11px] ${book.visibility === 'published' ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border bg-muted text-muted-foreground'}`}>{book.visibility === 'published' ? 'പ്രസിദ്ധീകരിച്ചത്' : 'ഡ്രാഫ്റ്റ്'}</span></div><p className="mt-1 text-sm text-muted-foreground">{book.author || 'രചയിതാവിനെ നൽകിയിട്ടില്ല'} · {book.category} · {book.total_pages} പേജുകൾ</p></div>
            <div className="flex flex-wrap items-center gap-1">
              <Button variant="ghost" size="icon" aria-label="Move book up" disabled={index === 0} onClick={() => void moveBook(book, -1)}><ArrowUp className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" aria-label="Move book down" disabled={index === books.length - 1} onClick={() => void moveBook(book, 1)}><ArrowDown className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => void preview(book)}><Eye className="mr-2 h-4 w-4" />പ്രിവ്യൂ</Button>
              <Button variant="outline" size="icon" aria-label="Edit book" onClick={() => beginEdit(book)}><Pencil className="h-4 w-4" /></Button>
              <Button variant={book.visibility === 'published' ? 'secondary' : 'default'} size="sm" onClick={() => void toggleVisibility(book)}>{book.visibility === 'published' ? 'മറയ്ക്കുക' : 'പ്രസിദ്ധീകരിക്കുക'}</Button>
              <Button variant="ghost" size="icon" aria-label="Delete book" className="text-destructive" onClick={() => void deleteBook(book)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </article>)}
        </div>
      )}
    </section>
  );
}