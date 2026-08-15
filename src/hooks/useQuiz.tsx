import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type QuizEventStatus = 'draft' | 'active' | 'closed' | 'archived';

export interface QuizEvent {
  id: string;
  slug: string;
  name: string;
  status: QuizEventStatus;
  sort_order: number;
  enabled: boolean;
  is_open: boolean;
  start_at: string | null;
  end_at: string | null;
  timer_mode: 'per_question' | 'whole_quiz';
  time_limit_seconds: number;
  title_ml: string;
  title_en: string;
  subtitle_ml: string;
  subtitle_en: string;
  intro_ml: string | null;
  intro_en: string | null;
  description_ml: string;
  description_en: string;
  instructions_ml: string;
  instructions_en: string;
  results_message_ml: string;
  results_message_en: string;
  category: string;
  organizer: string;
  event_date_label: string;
  banner_url: string | null;
  logo_url: string | null;
  theme: string;
  show_countdown: boolean;
  notification_ml: string | null;
  notification_en: string | null;
  created_at: string;
  updated_at: string;
}

export type QuizAnswerType = 'mcq' | 'text';

export interface QuizQuestion {
  id: string;
  event_id?: string;
  order_index: number;
  type: 'text' | 'image' | 'audio' | 'mcq';
  answer_type: QuizAnswerType;
  option_count: number;
  accepted_answers: string[];
  /** null / 0 => no time limit for this question */
  time_limit_seconds: number | null;
  question_text: string;
  image_url: string | null;
  audio_url: string | null;
  options: string[];
  correct_index: number;
  explanation?: string | null;
}

export interface QuizStudent {
  id: string;
  event_id: string;
  username: string;
  display_name: string;
  used: boolean;
  used_at: string | null;
  enabled?: boolean;
}

export type QuizResultState = 'visible' | 'hidden' | 'archived' | 'removed';

export interface QuizSubmission {
  id: string;
  event_id?: string;
  username: string;
  full_name: string;
  mobile: string | null;
  address: string | null;
  extra_info: string | null;
  answers: Record<string, number | string>;
  text_answers?: Record<string, string>;
  photo_url?: string | null;
  duration_seconds?: number | null;
  result_state?: QuizResultState;
  score: number;
  correct_count: number;
  wrong_count: number;
  total: number;
  submitted_at: string;
}


/** All events (admin) */
export function useQuizEvents(includeArchived = true) {
  const [events, setEvents] = useState<QuizEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('quiz_events').select('*').order('sort_order').order('created_at', { ascending: false });
    if (!includeArchived) q = q.neq('status', 'archived');
    const { data } = await q;
    setEvents((data || []) as any);
    setLoading(false);
  }, [includeArchived]);

  useEffect(() => { load(); }, [load]);

  const create = useCallback(async (patch: Partial<QuizEvent>) => {
    const { data, error } = await supabase.from('quiz_events').insert(patch as any).select().maybeSingle();
    if (!error) await load();
    return { data: data as any as QuizEvent | null, error };
  }, [load]);

  const update = useCallback(async (id: string, patch: Partial<QuizEvent>) => {
    const { error } = await supabase.from('quiz_events').update(patch as any).eq('id', id);
    if (!error) await load();
    return !error;
  }, [load]);

  const remove = useCallback(async (id: string) => {
    const { error } = await supabase.from('quiz_events').delete().eq('id', id);
    if (!error) await load();
    return !error;
  }, [load]);

  /** Duplicate event settings + questions + usernames (no submissions, usernames reset) */
  const duplicate = useCallback(async (ev: QuizEvent) => {
    const { id, created_at, updated_at, slug, name, ...rest } = ev as any;
    const stamp = Date.now().toString(36);
    const { data, error } = await supabase.from('quiz_events').insert({
      ...rest,
      slug: `${slug}-copy-${stamp}`,
      name: `${name} (Copy)`,
      status: 'draft',
      enabled: false,
      is_open: false,
    } as any).select().maybeSingle();
    if (error || !data) return { error };

    const newId = (data as any).id as string;
    const [{ data: qs }, { data: sts }] = await Promise.all([
      supabase.from('quiz_questions').select('*').eq('event_id', id),
      supabase.from('quiz_students').select('*').eq('event_id', id),
    ]);
    if (qs?.length) {
      await supabase.from('quiz_questions').insert(
        qs.map(({ id: _i, created_at: _c, event_id: _e, ...q }: any) => ({ ...q, event_id: newId })) as any
      );
    }
    if (sts?.length) {
      await supabase.from('quiz_students').insert(
        sts.map(({ id: _i, created_at: _c, event_id: _e, used: _u, used_at: _ua, ...s }: any) => ({
          ...s, event_id: newId, used: false, used_at: null,
        })) as any
      );
    }
    await load();
    return { error: null };
  }, [load]);

  return { events, loading, reload: load, create, update, remove, duplicate };
}

/** Public: events visible on the site (enabled, not archived) */
export function usePublicQuizEvents() {
  const [events, setEvents] = useState<QuizEvent[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from('quiz_events').select('*')
      .eq('enabled', true).neq('status', 'archived')
      .order('sort_order').order('created_at', { ascending: false })
      .then(({ data }) => { setEvents((data || []) as any); setLoading(false); });
  }, []);
  return { events, loading };
}

/** Public: a single event by slug */
export function useQuizEvent(slug?: string) {
  const [event, setEvent] = useState<QuizEvent | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!slug) { setEvent(null); setLoading(false); return; }
    setLoading(true);
    supabase.from('quiz_events').select('*').eq('slug', slug).maybeSingle()
      .then(({ data }) => { setEvent((data as any) || null); setLoading(false); });
  }, [slug]);
  return { event, loading };
}

export function isQuizLive(s: QuizEvent | null): boolean {
  if (!s || !s.enabled || !s.is_open || s.status === 'archived' || s.status === 'closed') return false;
  const now = Date.now();
  if (s.start_at && new Date(s.start_at).getTime() > now) return false;
  if (s.end_at && new Date(s.end_at).getTime() < now) return false;
  return true;
}

export async function fetchQuestions(eventId: string): Promise<QuizQuestion[]> {
  const { data } = await supabase.from('quiz_questions').select('*')
    .eq('event_id', eventId).order('order_index', { ascending: true });
  return (data || []) as any;
}

export async function validateUsername(eventId: string, username: string) {
  const { data, error } = await supabase.rpc('validate_quiz_username', {
    p_event_id: eventId,
    p_username: username.trim().toLowerCase(),
  });
  if (error) return { valid: false, reason: 'error' as const };
  return data as unknown as { valid: boolean; reason?: string; display_name?: string };
}

export async function submitQuiz(payload: {
  event_id: string;
  username: string;
  full_name: string;
  mobile?: string | null;
  address?: string;
  extra_info?: string;
  photo_url?: string | null;
  duration_seconds?: number | null;
  answers: Record<string, number | string>;
}) {
  const { data, error } = await supabase.rpc('submit_quiz', {
    p_event_id: payload.event_id,
    p_username: payload.username.trim().toLowerCase(),
    p_full_name: payload.full_name,
    p_mobile: payload.mobile || null,
    p_address: payload.address || null,
    p_extra_info: payload.extra_info || null,
    p_photo_url: payload.photo_url || null,
    p_duration_seconds: payload.duration_seconds ?? null,
    p_answers: payload.answers as any,
  });
  if (error) throw new Error(error.message);

  return data as unknown as { id: string; score: number; total: number; correct: number; wrong: number };
}
