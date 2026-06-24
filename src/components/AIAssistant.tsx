import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, X, Send, Loader2, Copy, Share2, History, Plus, Search, Check, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

type Msg = { role: 'user' | 'assistant'; content: string };
type Conv = { id: string; title: string; updatedAt: number; messages: Msg[] };

const STORAGE_KEY = 'aiAssistantConvs:v1';
const ACTIVE_KEY = 'aiAssistantActive:v1';

function loadConvs(): Conv[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveConvs(c: Conv[]) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch {} }

export default function AIAssistant() {
  const [enabled, setEnabled] = useState(false);
  const [welcome, setWelcome] = useState('അസ്സലാമു അലൈക്കും! എങ്ങനെ സഹായിക്കാം?');
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [convs, setConvs] = useState<Conv[]>(() => loadConvs());
  const [activeId, setActiveId] = useState<string>(() => localStorage.getItem(ACTIVE_KEY) || '');
  const [view, setView] = useState<'chat' | 'history'>('chat');
  const [search, setSearch] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from('ai_assistant_settings').select('*').eq('id', 'global').maybeSingle().then(({ data }) => {
      if (data) {
        setEnabled(!!data.enabled);
        if (data.welcome_message) setWelcome(data.welcome_message);
      }
    });
  }, []);

  useEffect(() => { saveConvs(convs); }, [convs]);
  useEffect(() => { if (activeId) localStorage.setItem(ACTIVE_KEY, activeId); }, [activeId]);

  const active = useMemo(() => convs.find(c => c.id === activeId) || null, [convs, activeId]);
  const messages: Msg[] = active?.messages.length ? active.messages : [{ role: 'assistant', content: welcome }];

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages.length, loading]);

  const SUGGESTIONS = [
    'നിസ്കാരത്തിന്റെ ശർത്തുകൾ എന്തൊക്കെ?',
    'What does Surah Al-Fatiha mean?',
    'സകാത്ത് ആർക്കൊക്കെ കൊടുക്കാം?',
    'Tell me a hadith about kindness',
  ];

  if (!enabled) return null;
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/quiz')) return null;

  const newConversation = () => {
    const c: Conv = { id: crypto.randomUUID(), title: 'New chat', updatedAt: Date.now(), messages: [] };
    setConvs(prev => [c, ...prev]);
    setActiveId(c.id);
    setView('chat');
  };

  const deleteConv = (id: string) => {
    setConvs(prev => prev.filter(c => c.id !== id));
    if (activeId === id) setActiveId('');
  };

  const updateActive = (updater: (c: Conv) => Conv) => {
    setConvs(prev => {
      let id = activeId;
      let list = prev;
      if (!id || !list.find(c => c.id === id)) {
        const c: Conv = { id: crypto.randomUUID(), title: 'New chat', updatedAt: Date.now(), messages: [] };
        list = [c, ...list];
        id = c.id;
        setActiveId(id);
      }
      return list.map(c => c.id === id ? updater(c) : c);
    });
  };

  const send = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;
    const userMsg: Msg = { role: 'user', content: text };
    updateActive(c => ({
      ...c,
      title: c.messages.length === 0 ? text.slice(0, 40) : c.title,
      messages: [...c.messages, userMsg],
      updatedAt: Date.now(),
    }));
    setInput('');
    setLoading(true);
    setView('chat');

    // fire-and-forget stats
    supabase.rpc('increment_ai_usage').then(() => {});

    let assistantSoFar = '';
    try {
      const history = [...(active?.messages || []), userMsg];
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: history.map((m) => ({ role: m.role, content: m.content })) }),
      });
      if (resp.status === 429) { toast.error('Too many requests. Please wait.'); setLoading(false); return; }
      if (resp.status === 402) { toast.error('AI credits exhausted. Contact admin.'); setLoading(false); return; }
      if (!resp.ok || !resp.body) throw new Error('Failed');

      updateActive(c => ({ ...c, messages: [...c.messages, { role: 'assistant', content: '' }] }));

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantSoFar += delta;
              updateActive(c => {
                const msgs = [...c.messages];
                msgs[msgs.length - 1] = { role: 'assistant', content: assistantSoFar };
                return { ...c, messages: msgs, updatedAt: Date.now() };
              });
            }
          } catch { buffer = line + '\n' + buffer; break; }
        }
      }
    } catch {
      toast.error('AI Assistant error');
    } finally {
      setLoading(false);
    }
  };

  const copyMsg = async (content: string, idx: number) => {
    try { await navigator.clipboard.writeText(content); setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 1500); toast.success('Copied'); } catch { toast.error('Copy failed'); }
  };
  const shareMsg = async (content: string) => {
    try {
      if (navigator.share) await navigator.share({ text: content });
      else { await navigator.clipboard.writeText(content); toast.success('Copied to clipboard'); }
    } catch {}
  };

  const filteredConvs = convs.filter(c => {
    const q = search.toLowerCase();
    if (!q) return true;
    return c.title.toLowerCase().includes(q) || c.messages.some(m => m.content.toLowerCase().includes(q));
  });

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-2xl flex items-center justify-center hover:scale-105 transition"
        aria-label="Islamic AI Assistant"
      >
        {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[60] w-[calc(100vw-2.5rem)] sm:w-[420px] h-[78vh] max-h-[640px] bg-white rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden">
          <div className="px-3 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center font-display">ج</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-tight">Islamic AI Assistant</p>
              <p className="text-[10px] opacity-80 truncate">{active?.title || 'Ask about Qur\'an, Hadith, Fiqh, or website'}</p>
            </div>
            <button onClick={() => setView(v => v === 'history' ? 'chat' : 'history')} className="p-1.5 rounded-md hover:bg-white/15" title="History"><History className="w-4 h-4" /></button>
            <button onClick={newConversation} className="p-1.5 rounded-md hover:bg-white/15" title="New chat"><Plus className="w-4 h-4" /></button>
          </div>

          {view === 'history' ? (
            <div className="flex-1 overflow-y-auto bg-gray-50 p-2">
              <div className="relative mb-2">
                <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations…" className="w-full pl-8 pr-3 py-2 rounded-lg border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {filteredConvs.length === 0 && <p className="text-xs text-center text-muted-foreground py-6">No conversations yet</p>}
              <ul className="space-y-1">
                {filteredConvs.map(c => (
                  <li key={c.id} className={`flex items-center gap-1 rounded-lg ${c.id === activeId ? 'bg-primary/10' : 'bg-white border border-border'}`}>
                    <button onClick={() => { setActiveId(c.id); setView('chat'); }} className="flex-1 text-left px-3 py-2 min-w-0">
                      <p className="text-sm font-medium truncate">{c.title}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(c.updatedAt).toLocaleString()} · {c.messages.length} msgs</p>
                    </button>
                    <button onClick={() => deleteConv(c.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={`group max-w-[88%] ${m.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                  <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-white border border-border rounded-bl-sm text-slate-800'}`}>
                    {m.role === 'assistant' ? (
                      m.content ? (
                        <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-headings:my-2">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      ) : (loading && i === messages.length - 1 ? <Loader2 className="w-4 h-4 animate-spin" /> : null)
                    ) : (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                  {m.role === 'assistant' && m.content && (
                    <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => copyMsg(m.content, i)} className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-border flex items-center gap-1 hover:bg-muted">
                        {copiedIdx === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy
                      </button>
                      <button onClick={() => shareMsg(m.content)} className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-border flex items-center gap-1 hover:bg-muted">
                        <Share2 className="w-3 h-3" /> Share
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {messages.length <= 1 && !loading && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="text-[11px] px-2.5 py-1.5 rounded-full bg-white border border-primary/30 text-primary hover:bg-primary/5">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-2 border-t border-border bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 px-3 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
