import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Clock, CheckCircle2, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuizSettings, isQuizLive, fetchQuestions, validateUsername, submitQuiz, QuizQuestion } from '@/hooks/useQuiz';
import { toast } from 'sonner';

type Stage = 'gate' | 'warning' | 'profile' | 'quiz' | 'done';

export default function Quiz() {
  const { t, lang } = useLanguage();
  const { settings, loading } = useQuizSettings();
  const [stage, setStage] = useState<Stage>('gate');
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
  const title = lang === 'E' ? settings?.title_en : settings?.title_ml;

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
        // per-question: advance or submit
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

  if (!settings?.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background to-muted">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">{t('ക്വിസ് ലഭ്യമല്ല', 'Quiz Not Available')}</h1>
          <p className="text-muted-foreground">{t('ക്വിസ് നിലവിൽ പ്രവർത്തനത്തിലില്ല.', 'The quiz is not currently active.')}</p>
          <Link to="/"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2"/>{t('ഹോം','Home')}</Button></Link>
        </div>
      </div>
    );
  }

  if (!live) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background to-muted">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{t('ക്വിസ് നിലവിൽ അടച്ചിരിക്കുന്നു.', 'The quiz is currently closed.')}</p>
          {settings.start_at && <p className="text-sm">{t('തുടങ്ങുന്നത്','Starts')}: {new Date(settings.start_at).toLocaleString()}</p>}
          {settings.end_at && <p className="text-sm">{t('അവസാനിക്കുന്നത്','Ends')}: {new Date(settings.end_at).toLocaleString()}</p>}
          <Link to="/"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2"/>{t('ഹോം','Home')}</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4 mr-1"/>{t('ഹോം','Home')}</Link>
          {stage === 'quiz' && settings.timer_mode === 'whole_quiz' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-mono text-sm">
              <Clock className="w-4 h-4"/>{formatTime(timeLeft)}
            </div>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">{title}</h1>

        {stage === 'gate' && (
          <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm space-y-4 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-center">{t('യൂസർനെയിം പ്രവേശിക്കുക', 'Enter Your Username')}</h2>
            <Input value={username} onChange={e => setUsername(e.target.value)} placeholder={t('യൂസർനെയിം', 'Username')} autoFocus onKeyDown={e => e.key === 'Enter' && handleGate()} />
            <Button onClick={handleGate} disabled={validating} className="w-full">
              {validating ? <Loader2 className="w-4 h-4 animate-spin"/> : t('തുടരുക','Continue')}
            </Button>
          </div>
        )}

        {stage === 'warning' && (
          <div className="bg-card border-2 border-amber-500/40 rounded-2xl p-6 md:p-8 shadow-sm space-y-4 max-w-md mx-auto">
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
          <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm space-y-4 max-w-lg mx-auto">
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
          <div className="bg-card border rounded-2xl p-8 shadow-sm text-center max-w-lg mx-auto space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto"/>
            <h2 className="text-2xl font-bold">{t('സമർപ്പിച്ചു!','Submitted!')}</h2>
            <p className="leading-relaxed whitespace-pre-line">
              {t(
                'നിങ്ങളുടെ ഉത്തരങ്ങൾ വിജയകരമായി സമർപ്പിച്ചു.\nവിജയികളെ പിന്നീട് മാർക്ക് അടിസ്ഥാനത്തിൽ അറിയിക്കുന്നതാണ്.',
                'Your answers have been submitted successfully.\nWinners will be announced later based on scores.'
              )}
            </p>
            <Link to="/"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2"/>{t('ഹോം','Home')}</Button></Link>
          </div>
        )}
      </div>
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
  const prev = () => current > 0 && setCurrent(c => c - 1);

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

      <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
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
