import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Clock, CheckCircle2, Loader2, Send, CalendarDays, Info, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuizSettings, isQuizLive, fetchQuestions, validateUsername, submitQuiz, QuizQuestion, QuizSettings } from '@/hooks/useQuiz';
import { getQuizTheme } from '@/utils/quizThemes';
import { toast } from 'sonner';

type Stage = 'landing' | 'gate' | 'warning' | 'profile' | 'quiz' | 'done';

export default function Quiz() {
  const { t, lang } = useLanguage();
  const { settings, loading } = useQuizSettings();
  const [stage, setStage] = useState<Stage>('landing');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [validating, setValidating] = useState(false);

  const [profile, setProfile] = useState({ full_name: '', mobile: '' });
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);

  const live = isQuizLive(settings);
  const theme = getQuizTheme(settings?.theme);
  const pick = (ml?: string | null, en?: string | null) => (lang === 'E' ? en : ml) || '';
  const title = pick(settings?.title_ml, settings?.title_en);
  const subtitle = pick(settings?.subtitle_ml, settings?.subtitle_en);
  const description = pick(settings?.description_ml, settings?.description_en);
  const instructions = pick(settings?.instructions_ml, settings?.instructions_en);
  const resultsMessage = pick(settings?.results_message_ml, settings?.results_message_en);

  // Load questions once stage = quiz
  useEffect(() => {
    if (stage === 'quiz' && questions.length === 0) {
      fetchQuestions().then(qs => {
        setQuestions(qs);
        if (settings?.timer_mode === 'whole_quiz') setTimeLeft(settings.time_limit_seconds);
        else if (settings?.timer_mode === 'per_question' && qs.length > 0) setTimeLeft(settings.time_limit_seconds);
      });
    }
  }, [stage, questions.length, settings]);

  // Timer
  useEffect(() => {
    if (stage !== 'quiz' || !settings || questions.length === 0) return;
    if (timeLeft <= 0) {
      if (settings.timer_mode === 'whole_quiz') {
        handleSubmit();
      } else {
        if (current < questions.length - 1) {
          setCurrent(c => c + 1);
          setTimeLeft(settings.time_limit_seconds);
        } else {
          handleSubmit();
        }
      }
      return;
    }
    const id = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, stage, settings, questions.length, current]);

  const handleGate = async () => {
    if (!username.trim()) { toast.error(t('യൂസർനെയിം നൽകുക', 'Enter username')); return; }
    setValidating(true);
    const r = await validateUsername(username);
    setValidating(false);
    if (!r.valid) {
      if (r.reason === 'used') {
        toast.error(t('ഈ യൂസർനെയിം ഇതിനകം ഉപയോഗിച്ചു', 'This username has already been used'));
      } else if (r.reason === 'disabled') {
        toast.error(t('ഈ യൂസർനെയിം നിർജ്ജീവമാണ്', 'This username is disabled'));
      } else {
        toast.error(t('തെറ്റായ യൂസർനെയിം', 'Invalid username'));
      }
      return;
    }
    setDisplayName(r.display_name || '');
    setProfile(p => ({ ...p, full_name: r.display_name || '' }));
    setStage('warning');
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await submitQuiz({
        username,
        full_name: profile.full_name || displayName,
        mobile: profile.mobile,
        answers,
      });
      setResult({ score: res.score, total: res.total });
      try { localStorage.setItem(`quiz_done_${username.toLowerCase()}`, '1'); } catch {}
      setStage('done');
    } catch (e: any) {
      toast.error(e.message || t('സമർപ്പിക്കാൻ കഴിഞ്ഞില്ല', 'Failed to submit'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className={`relative min-h-screen bg-gradient-to-br ${theme.bg} overflow-hidden`}>
      <Particles colors={theme.particles} />
      {theme.chakra && <ChakraOrnament />}
      <div className="relative max-w-3xl mx-auto px-4 py-6">{children}</div>
    </div>
  );

  if (!settings?.enabled) {
    return (
      <Shell>
        <div className="max-w-md mx-auto text-center space-y-4 py-24">
          <h1 className="text-2xl font-bold">{t('ക്വിസ് ലഭ്യമല്ല', 'Quiz Not Available')}</h1>
          <p className="text-muted-foreground">{t('ക്വിസ് നിലവിൽ പ്രവർത്തനത്തിലില്ല.', 'The quiz is not currently active.')}</p>
          <Link to="/"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2"/>{t('ഹോം','Home')}</Button></Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex items-center justify-between mb-4">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4 mr-1"/>{t('ഹോം','Home')}</Link>
        {stage === 'quiz' && settings.timer_mode === 'whole_quiz' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-mono text-sm">
            <Clock className="w-4 h-4"/>{formatTime(timeLeft)}
          </div>
        )}
      </div>

      {stage !== 'quiz' && (
        <EventHeader
          settings={settings}
          title={title}
          subtitle={subtitle}
          theme={theme}
        />
      )}

      {stage === 'landing' && (
        <div className="space-y-4 max-w-xl mx-auto">
          {description && (
            <div className="bg-card/80 backdrop-blur border rounded-2xl p-5 shadow-sm">
              <p className="text-sm leading-relaxed whitespace-pre-line text-center">{description}</p>
            </div>
          )}
          {instructions && (
            <div className={`bg-card/80 backdrop-blur border rounded-2xl p-5 shadow-sm ring-1 ${theme.ring}`}>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><Info className="w-4 h-4"/>{t('നിർദ്ദേശങ്ങൾ','Instructions')}</h3>
              <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">{instructions}</p>
            </div>
          )}

          {live ? (
            <Button onClick={() => setStage('gate')} size="lg" className="w-full text-base h-12">
              <Sparkles className="w-4 h-4 mr-2"/>{t('ക്വിസ് ആരംഭിക്കുക','Start Quiz')}
            </Button>
          ) : (
            <div className="bg-card/80 backdrop-blur border rounded-2xl p-6 text-center space-y-3">
              <p className="font-medium">
                {settings.start_at && new Date(settings.start_at).getTime() > Date.now()
                  ? t('ക്വിസ് ഉടൻ ആരംഭിക്കും','The quiz starts soon')
                  : t('ക്വിസ് നിലവിൽ അടച്ചിരിക്കുന്നു.','The quiz is currently closed.')}
              </p>
              {settings.show_countdown !== false && settings.start_at && new Date(settings.start_at).getTime() > Date.now() && (
                <Countdown target={settings.start_at} />
              )}
              {settings.start_at && <p className="text-xs text-muted-foreground">{t('തുടങ്ങുന്നത്','Starts')}: {new Date(settings.start_at).toLocaleString()}</p>}
              {settings.end_at && <p className="text-xs text-muted-foreground">{t('അവസാനിക്കുന്നത്','Ends')}: {new Date(settings.end_at).toLocaleString()}</p>}
            </div>
          )}
        </div>
      )}

      {stage === 'gate' && (
        <div className="bg-card/90 backdrop-blur border rounded-2xl p-6 md:p-8 shadow-sm space-y-4 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-center">{t('യൂസർനെയിം പ്രവേശിക്കുക', 'Enter Your Username')}</h2>
          <Input value={username} onChange={e => setUsername(e.target.value)} placeholder={t('യൂസർനെയിം', 'Username')} autoFocus onKeyDown={e => e.key === 'Enter' && handleGate()} />
          <Button onClick={handleGate} disabled={validating} className="w-full">
            {validating ? <Loader2 className="w-4 h-4 animate-spin"/> : t('തുടരുക','Continue')}
          </Button>
        </div>
      )}

      {stage === 'warning' && (
        <div className="bg-card/90 backdrop-blur border-2 border-amber-500/40 rounded-2xl p-6 md:p-8 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="flex justify-center"><AlertTriangle className="w-14 h-14 text-amber-500"/></div>
          <p className="text-center text-base font-medium leading-relaxed">
            ⚠️ {t('നിങ്ങൾക്ക് ഈ ക്വിസിൽ ഒരു തവണ മാത്രമേ പങ്കെടുക്കാൻ കഴിയൂ. സമർപ്പിച്ച ശേഷം പുനഃപങ്കാളിത്തം സാധ്യമല്ല.',
                 'You can enter this quiz only one time. Once submitted, you cannot participate again.')}
          </p>
          <p className="text-sm text-muted-foreground text-center">{t('സ്വാഗതം','Welcome')}, <b>{displayName}</b></p>
          <Button onClick={() => setStage('profile')} className="w-full">{t('സമ്മതിക്കുന്നു, തുടരുക','I understand, continue')}</Button>
        </div>
      )}

      {stage === 'profile' && (
        <div className="bg-card/90 backdrop-blur border rounded-2xl p-6 md:p-8 shadow-sm space-y-4 max-w-lg mx-auto">
          <h2 className="text-xl font-semibold">{t('നിങ്ങളുടെ വിവരങ്ങൾ','Your Information')}</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">{t('പൂർണ്ണനാമം','Full Name')} *</label>
              <Input value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t('മൊബൈൽ നമ്പർ','Mobile Number')} *</label>
              <Input type="tel" value={profile.mobile} onChange={e => setProfile({ ...profile, mobile: e.target.value })} />
            </div>
          </div>
          <Button
            onClick={() => {
              if (!profile.full_name.trim() || !profile.mobile.trim()) { toast.error(t('പേരും മൊബൈൽ നമ്പറും ആവശ്യമാണ്','Name and mobile required')); return; }
              setStage('quiz');
            }}
            className="w-full"
          >{t('ക്വിസ് ആരംഭിക്കുക','Start Quiz')}</Button>
        </div>
      )}

      {stage === 'quiz' && questions.length === 0 && (
        <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary"/></div>
      )}

      {stage === 'quiz' && questions.length > 0 && (
        <QuizBody
          questions={questions}
          current={current}
          setCurrent={setCurrent}
          answers={answers}
          setAnswers={setAnswers}
          perQuestionSeconds={settings.timer_mode === 'per_question' ? settings.time_limit_seconds : null}
          timeLeft={settings.timer_mode === 'per_question' ? timeLeft : null}
          resetTimer={() => settings.timer_mode === 'per_question' && setTimeLeft(settings.time_limit_seconds)}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}

      {stage === 'done' && (
        <div className="bg-card/90 backdrop-blur border rounded-2xl p-8 shadow-sm text-center max-w-lg mx-auto space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto"/>
          <h2 className="text-2xl font-bold">{t('സമർപ്പിച്ചു!','Submitted!')}</h2>
          <p className="leading-relaxed whitespace-pre-line">
            {resultsMessage || t(
              'നിങ്ങളുടെ ഉത്തരങ്ങൾ വിജയകരമായി സമർപ്പിച്ചു.\nവിജയികളെ പിന്നീട് മാർക്ക് അടിസ്ഥാനത്തിൽ അറിയിക്കുന്നതാണ്.',
              'Your answers have been submitted successfully.\nWinners will be announced later based on scores.'
            )}
          </p>
          <Link to="/"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2"/>{t('ഹോം','Home')}</Button></Link>
        </div>
      )}
    </Shell>
  );
}

function EventHeader({ settings, title, subtitle, theme }: {
  settings: QuizSettings;
  title: string;
  subtitle: string;
  theme: ReturnType<typeof getQuizTheme>;
}) {
  return (
    <header className="text-center mb-8">
      {settings.banner_url && (
        <img src={settings.banner_url} alt={title} loading="lazy"
          className="w-full max-h-52 object-cover rounded-2xl border mb-5 shadow-sm"/>
      )}
      {settings.logo_url && (
        <img src={settings.logo_url} alt="" loading="lazy"
          className="w-20 h-20 mx-auto mb-3 object-contain drop-shadow"/>
      )}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
        {settings.category && (
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${theme.badge}`}>{theme.emoji} {settings.category}</span>
        )}
        {settings.event_date_label && (
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted inline-flex items-center gap-1">
            <CalendarDays className="w-3 h-3"/>{settings.event_date_label}
          </span>
        )}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
      <div className={`h-1 w-28 mx-auto mt-3 rounded-full bg-gradient-to-r ${theme.accent}`} />
      {subtitle && <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-xl mx-auto">{subtitle}</p>}
      {settings.organizer && <p className="mt-2 text-xs text-muted-foreground/80">{settings.organizer}</p>}
    </header>
  );
}

function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const cells = [d, h, m, s];
  const labels = ['D', 'H', 'M', 'S'];
  return (
    <div className="flex items-center justify-center gap-2">
      {cells.map((v, i) => (
        <div key={i} className="min-w-[54px] rounded-xl bg-foreground text-background px-2 py-2">
          <div className="text-xl font-mono font-bold leading-none">{v.toString().padStart(2, '0')}</div>
          <div className="text-[10px] opacity-70 mt-1">{labels[i]}</div>
        </div>
      ))}
    </div>
  );
}

function Particles({ colors }: { colors: string[] }) {
  const dots = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    left: `${(i * 7 + 5) % 96}%`,
    size: 5 + ((i * 3) % 7),
    delay: `${(i % 7) * 0.8}s`,
    duration: `${9 + (i % 5) * 2}s`,
    color: colors[i % colors.length],
  })), [colors]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {dots.map((d, i) => (
        <span key={i}
          className="absolute bottom-[-10%] rounded-full opacity-30 animate-[quiz-float_12s_linear_infinite]"
          style={{ left: d.left, width: d.size, height: d.size, background: d.color, animationDelay: d.delay, animationDuration: d.duration }}
        />
      ))}
    </div>
  );
}

function ChakraOrnament() {
  return (
    <div className="pointer-events-none absolute -top-16 -right-16 opacity-[0.12]" aria-hidden>
      <svg width="260" height="260" viewBox="0 0 100 100" className="animate-[spin_28s_linear_infinite]">
        <circle cx="50" cy="50" r="46" fill="none" stroke="#1e3a8a" strokeWidth="3" />
        <circle cx="50" cy="50" r="6" fill="#1e3a8a" />
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1="50" y1="50" x2="50" y2="6" stroke="#1e3a8a" strokeWidth="1.4"
            transform={`rotate(${i * 15} 50 50)`} />
        ))}
      </svg>
    </div>
  );
}

function formatTime(s: number) {
  const m = Math.floor(Math.max(0, s) / 60);
  const r = Math.max(0, s) % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

function QuizBody({ questions, current, setCurrent, answers, setAnswers, perQuestionSeconds, timeLeft, resetTimer, onSubmit, submitting }: {
  questions: QuizQuestion[];
  current: number;
  setCurrent: (n: number | ((n: number) => number)) => void;
  answers: Record<string, number>;
  setAnswers: (a: Record<string, number> | ((p: Record<string, number>) => Record<string, number>)) => void;
  perQuestionSeconds: number | null;
  timeLeft: number | null;
  resetTimer: () => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const { t } = useLanguage();
  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  if (!q) return null;

  const choose = (idx: number) => {
    setAnswers(p => ({ ...p, [q.id]: idx }));
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      resetTimer();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{t('ചോദ്യം','Question')} {current + 1} / {questions.length}</span>
        {perQuestionSeconds !== null && timeLeft !== null && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary font-mono"><Clock className="w-3 h-3"/>{formatTime(timeLeft)}</span>
        )}
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="bg-card/90 backdrop-blur border rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
        <h2 className="text-lg md:text-xl font-semibold leading-relaxed">{q.question_text}</h2>
        {q.image_url && <img src={q.image_url} alt="" className="w-full rounded-xl border max-h-80 object-contain bg-muted/30"/>}
        {q.audio_url && <audio controls src={q.audio_url} className="w-full"/>}

        <div className="space-y-2">
          {q.options.map((opt, idx) => {
            const selected = answers[q.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => choose(idx)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${selected ? 'border-primary bg-primary/10 font-medium' : 'border-border hover:border-primary/50 bg-background'}`}
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 mr-3 text-xs font-bold">{String.fromCharCode(65 + idx)}</span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        {current < questions.length - 1 ? (
          <Button onClick={next} disabled={answers[q.id] === undefined}>{t('അടുത്തത്','Next')}</Button>
        ) : (
          <Button onClick={onSubmit} disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin"/> : <><Send className="w-4 h-4 mr-2"/>{t('സമർപ്പിക്കുക','Submit')}</>}
          </Button>
        )}
      </div>
    </div>
  );
}
