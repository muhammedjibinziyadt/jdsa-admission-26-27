import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowLeftToLine, ArrowRight, BookOpen, BookText, ChevronDown, ChevronLeft, ChevronRight, Eye, EyeOff, Expand, LibraryBig, LoaderCircle, LockKeyhole, Maximize, Minus, RotateCcw, Search, Shrink, X, ZoomIn, ZoomOut } from 'lucide-react';
import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOnlineLibrary } from '@/hooks/useOnlineLibrary';
import { libraryRequest, OnlineBook } from '@/utils/onlineLibrary';

GlobalWorkerOptions.workerSrc = workerUrl;

function Reader({ book, token, onClose }: { book: OnlineBook; token: string; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(() => Number(localStorage.getItem(`library-page-${book.id}`)) || 1);
  const [count, setCount] = useState(book.total_pages);
  const [scale, setScale] = useState(1);
  const [fitMode, setFitMode] = useState('page');
  const [landscape, setLandscape] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [turning, setTurning] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let task: ReturnType<PDFDocumentProxy['getPage']> extends Promise<infer _T> ? { cancel: () => void } | null : null = null;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const { url } = await libraryRequest<{ url: string }>('read-url', { id: book.id }, token);
        const document = await getDocument({ url }).promise;
        if (cancelled) {
          await document.destroy();
          return;
        }
        pdfRef.current = document;
        setCount(document.numPages);
        setPage(current => Math.min(current, document.numPages));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'പുസ്തകം തുറക്കാനായില്ല');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
      if (task) task.cancel();
      const document = pdfRef.current;
      pdfRef.current = null;
      if (document) void document.destroy();
    };
  }, [book.id, token]);

  useEffect(() => {
    let cancelled = false;
    let renderTask: { cancel: () => void } | null = null;
    const drawPage = async () => {
      const pdf = pdfRef.current;
      const canvas = canvasRef.current;
      const stage = stageRef.current;
      if (!pdf || !canvas || !stage) return;
      setLoading(true);
      try {
        const pdfPage = await pdf.getPage(page);
        const baseViewport = pdfPage.getViewport({ scale: 1 });
        const availableWidth = Math.max(260, stage.clientWidth - 48);
        const availableHeight = Math.max(300, stage.clientHeight - 48);
        const widthScale = availableWidth / baseViewport.width;
        const heightScale = availableHeight / baseViewport.height;
        const fitScale = fitMode === 'width' ? widthScale : fitMode === 'screen' ? Math.min(widthScale, heightScale) : Math.min(widthScale, heightScale);
        const viewport = pdfPage.getViewport({ scale: fitScale * scale });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('ഈ പേജ് കാണിക്കാൻ സാധിക്കുന്നില്ല');
        const transform = dpr === 1 ? undefined : [dpr, 0, 0, dpr, 0, 0] as [number, number, number, number, number, number];
        renderTask = pdfPage.render({ canvasContext: context, viewport, transform });
        await renderTask.promise;
        if (!cancelled) {
          localStorage.setItem(`library-page-${book.id}`, String(page));
          setError('');
        }
      } catch (e) {
        if (!cancelled && !(e instanceof Error && e.name === 'RenderingCancelledException')) setError(e instanceof Error ? e.message : 'പേജ് കാണാനായില്ല');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void drawPage();
    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [book.id, fitMode, landscape, page, scale]);

  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);

  const turn = (delta: number) => {
    const next = Math.min(count, Math.max(1, page + delta));
    if (next === page) return;
    setTurning(true);
    window.setTimeout(() => setTurning(false), 420);
    setPage(next);
  };

  const toggleFullscreen = async () => {
    if (!stageRef.current) return;
    if (!document.fullscreenElement) await stageRef.current.requestFullscreen?.();
    else await document.exitFullscreen?.();
  };

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-background" dir={book.reading_direction}>
      <header className="flex min-h-16 items-center gap-3 border-b border-border bg-card px-3 sm:px-6">
        <Button variant="ghost" size="icon" aria-label="Close reader" onClick={onClose}><X className="h-5 w-5" /></Button>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold sm:text-base">{book.title}</h2>
          <p className="truncate text-xs text-muted-foreground">{book.author}</p>
        </div>
        <Button variant="outline" size="icon" aria-label="Zoom out" onClick={() => setScale(value => Math.max(0.6, Number((value - 0.15).toFixed(2))))}><ZoomOut className="h-4 w-4" /></Button>
        <span className="min-w-12 text-center text-xs text-muted-foreground">{Math.round(scale * 100)}%</span>
        <Button variant="outline" size="icon" aria-label="Zoom in" onClick={() => setScale(value => Math.min(2.5, Number((value + 0.15).toFixed(2))))}><ZoomIn className="h-4 w-4" /></Button>
        <Select value={fitMode} onValueChange={setFitMode}>
          <SelectTrigger className="hidden w-36 sm:flex"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="page">Fit to page</SelectItem>
            <SelectItem value="width">Fit to width</SelectItem>
            <SelectItem value="screen">Fit to screen</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" aria-label={landscape ? 'Portrait reading mode' : 'Landscape reading mode'} onClick={() => setLandscape(value => !value)}><RotateCcw className="h-4 w-4" /></Button>
        <Button variant="outline" size="icon" aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} onClick={() => void toggleFullscreen()}>{fullscreen ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}</Button>
      </header>
      <main ref={stageRef} className={`relative flex min-h-0 flex-1 items-center justify-center overflow-auto bg-muted/50 p-3 sm:p-8 ${landscape ? 'reader-landscape' : ''}`}>
        <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-4 -translate-x-1/2 bg-gradient-to-r from-foreground/10 via-foreground/5 to-transparent md:block" />
        {loading && <div className="absolute z-10 flex items-center gap-2 rounded-md bg-card/90 px-4 py-3 text-sm text-muted-foreground shadow-soft"><LoaderCircle className="h-4 w-4 animate-spin" /> പേജ് തുറക്കുന്നു…</div>}
        {error ? <p role="alert" className="max-w-md text-center text-sm text-destructive">{error}</p> : <canvas key={page} ref={canvasRef} className={`reader-page relative block max-h-full bg-card shadow-elevated ${turning ? 'reader-page-turn' : ''}`} />}
      </main>
      <footer className="flex min-h-16 items-center justify-center gap-4 border-t border-border bg-card px-3">
        <Button variant="outline" size="icon" aria-label="Previous page" disabled={page <= 1 || loading} onClick={() => turn(-1)}><ChevronLeft className="h-4 w-4" /></Button>
        <span className="min-w-32 text-center text-sm tabular-nums">{page} / {count}</span>
        <Button variant="outline" size="icon" aria-label="Next page" disabled={page >= count || loading} onClick={() => turn(1)}><ChevronRight className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" aria-label="Reset zoom" onClick={() => setScale(1)}><Minus className="h-4 w-4" /></Button>
      </footer>
    </div>
  );
}

export default function OnlineLibrary() {
  const { token, books, loading, error, unlock, lock } = useOnlineLibrary();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [selected, setSelected] = useState<OnlineBook | null>(null);
  const [opening, setOpening] = useState(false);

  const categories = useMemo(() => [...new Set(books.map(book => book.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [books]);
  const visibleBooks = useMemo(() => {
    const text = query.trim().toLocaleLowerCase();
    return [...books]
      .filter(book => category === 'all' || book.category === category)
      .filter(book => !text || [book.title, book.author, book.category, book.description].some(value => value.toLocaleLowerCase().includes(text)))
      .sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'author' ? a.author.localeCompare(b.author) : a.display_order - b.display_order);
  }, [books, category, query, sort]);

  const submitPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    await unlock(password);
    setSubmitting(false);
  };

  const openBook = async (book: OnlineBook) => {
    setOpening(true);
    try {
      await libraryRequest<{ url: string }>('read-url', { id: book.id }, token);
      setSelected(book);
    } catch {
      return;
    } finally {
      setOpening(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link to="/bookstore" aria-label="Back to bookstore" className="rounded-sm p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
          <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-primary/10 text-primary"><LibraryBig className="h-6 w-6" /></div>
          <div className="min-w-0 flex-1"><p className="text-xs font-medium uppercase tracking-[0.12em] text-primary">Jawharathul Uloom Suffa Dars</p><h1 className="truncate font-display text-xl font-bold sm:text-2xl">ഓൺലൈൻ വായനശാല</h1></div>
          {token && <Button variant="outline" size="sm" onClick={lock}><LockKeyhole className="mr-2 h-4 w-4" /> ലോക്ക്</Button>}
        </div>
      </header>

      {!token ? (
        <main className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-10">
          <form onSubmit={submitPassword} className="w-full border border-border bg-card p-6 shadow-soft sm:p-10">
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-sm bg-primary/10 text-primary"><BookOpen className="h-7 w-7" /></div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">Reading room</p>
            <h2 className="font-display text-3xl font-semibold">വായനശാലയിലേക്ക് പ്രവേശിക്കുക</h2>
            <p className="mt-2 text-sm text-muted-foreground">വായന തുടരാൻ പ്രവേശന പാസ്‌വേഡ് നൽകുക.</p>
            <label htmlFor="library-password" className="mb-2 mt-7 block text-sm font-medium">പാസ്‌വേഡ്</label>
            <div className="relative">
              <Input id="library-password" type={showPassword ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" className="h-12 pr-12" />
              <Button type="button" variant="ghost" size="icon" aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-1 top-1" onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
            </div>
            {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
            <p className="mt-3 text-sm leading-6 text-muted-foreground">നൽകിയിരിക്കുന്ന പേജ് ഓപ്പൺ ചെയ്യുന്നതിന് വേണ്ടി 9048696090 എന്ന നമ്പറിൽ ബന്ധപ്പെടുക.</p>
            <Button type="submit" disabled={submitting || !password} className="mt-6 h-12 w-full">{submitting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <LockKeyhole className="mr-2 h-4 w-4" />}ലൈബ്രറിയിലേക്ക് പ്രവേശിക്കുക</Button>
          </form>
        </main>
      ) : (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="mb-7 flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
            <div><p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">Digital collection</p><h2 className="font-display text-3xl font-semibold">വായനയ്ക്കുള്ള പുസ്തകങ്ങൾ</h2><p className="mt-1 text-sm text-muted-foreground">{books.length} പുസ്തകങ്ങൾ</p></div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="പുസ്തകം തിരയുക" aria-label="Search books" className="pl-9 sm:w-56" /></div>
              <Select value={category} onValueChange={setCategory}><SelectTrigger className="sm:w-44"><SelectValue placeholder="വിഭാഗം" /></SelectTrigger><SelectContent><SelectItem value="all">എല്ലാ വിഭാഗങ്ങളും</SelectItem>{categories.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
              <Select value={sort} onValueChange={setSort}><SelectTrigger className="sm:w-40"><SelectValue placeholder="ക്രമീകരിക്കുക" /></SelectTrigger><SelectContent><SelectItem value="featured">തിരഞ്ഞെടുത്തത്</SelectItem><SelectItem value="title">പുസ്തകശീർഷകം</SelectItem><SelectItem value="author">രചയിതാവ്</SelectItem></SelectContent></Select>
            </div>
          </div>
          {loading ? <div className="flex min-h-48 items-center justify-center gap-2 text-muted-foreground"><LoaderCircle className="h-5 w-5 animate-spin" />ശേഖരം തുറക്കുന്നു…</div> : visibleBooks.length === 0 ? <div className="py-20 text-center text-sm text-muted-foreground">ഈ വിഭാഗത്തിൽ പ്രസിദ്ധീകരിച്ച പുസ്തകങ്ങളില്ല.</div> : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
              {visibleBooks.map(book => <article key={book.id} className="group overflow-hidden border border-border bg-card shadow-soft transition-shadow hover:shadow-elevated">
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  {book.cover_url ? <img src={book.cover_url} alt={`${book.title} cover`} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" /> : <div className="flex h-full items-center justify-center text-primary"><BookText className="h-12 w-12" /></div>}
                  <span className="absolute bottom-2 left-2 rounded-sm bg-card/90 px-2 py-1 text-xs font-medium text-foreground">{book.category}</span>
                </div>
                <div className="space-y-2 p-3 sm:p-4">
                  <h3 className="line-clamp-2 min-h-10 font-display text-base font-semibold sm:text-lg">{book.title}</h3>
                  <p className="truncate text-xs text-muted-foreground">{book.author || 'രചയിതാവിനെ നൽകിയിട്ടില്ല'}</p>
                  <p className="text-xs text-muted-foreground">{book.total_pages} പേജുകൾ</p>
                  <Button size="sm" className="w-full" disabled={opening} onClick={() => void openBook(book)}><BookOpen className="mr-2 h-4 w-4" />വായിക്കുക</Button>
                </div>
              </article>)}
            </div>
          )}
        </main>
      )}
      {selected && token && <Reader book={selected} token={token} onClose={() => setSelected(null)} />}
    </div>
  );
}