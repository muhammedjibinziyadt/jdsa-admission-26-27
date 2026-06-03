import { useEffect, useRef, useState } from 'react';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function AIAssistant() {
  const [enabled, setEnabled] = useState(false);
  const [welcome, setWelcome] = useState('അസ്സലാമു അലൈക്കും! എങ്ങനെ സഹായിക്കാം?');
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from('ai_assistant_settings').select('*').eq('id', 'global').maybeSingle().then(({ data }) => {
      if (data) {
        setEnabled(!!data.enabled);
        if (data.welcome_message) setWelcome(data.welcome_message);
      }
    });
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) setMessages([{ role: 'assistant', content: welcome }]);
  }, [open, welcome, messages.length]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages]);

  if (!enabled) return null;

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Msg = { role: 'user', content: text };
    const history = [...messages.filter((m) => m.role !== 'assistant' || messages.indexOf(m) !== 0 ? true : true), userMsg];
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    let assistantSoFar = '';
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: history.map((m) => ({ role: m.role, content: m.content })) }),
      });
      if (resp.status === 429) { toast.error('Too many requests. Please wait.'); setLoading(false); return; }
      if (resp.status === 402) { toast.error('AI credits exhausted. Contact admin.'); setLoading(false); return; }
      if (!resp.ok || !resp.body) throw new Error('Failed');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      setMessages((m) => [...m, { role: 'assistant', content: '' }]);
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
              setMessages((m) => m.map((mm, i) => i === m.length - 1 ? { ...mm, content: assistantSoFar } : mm));
            }
          } catch { buffer = line + '\n' + buffer; break; }
        }
      }
    } catch (e) {
      toast.error('AI Assistant error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white shadow-2xl flex items-center justify-center hover:scale-105 transition"
        aria-label="AI Assistant"
      >
        {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[60] w-[calc(100vw-2.5rem)] sm:w-96 h-[70vh] max-h-[560px] bg-white rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-primary to-purple-600 text-white flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <div className="flex-1">
              <p className="font-semibold text-sm">AI Assistant</p>
              <p className="text-[10px] opacity-80">Ask anything about our website</p>
            </div>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${m.role === 'user' ? 'ml-auto bg-primary text-primary-foreground rounded-br-sm' : 'mr-auto bg-white border border-border rounded-bl-sm'}`}>
                {m.content || (loading && i === messages.length - 1 ? <Loader2 className="w-4 h-4 animate-spin" /> : '')}
              </div>
            ))}
          </div>
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
