import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface QuizSettings {
  id: string;
  enabled: boolean;
  is_open: boolean;
  start_at: string | null;
  end_at: string | null;
  timer_mode: 'per_question' | 'whole_quiz';
  time_limit_seconds: number;
  title_ml: string;
  title_en: string;
  intro_ml: string;
  intro_en: string;
  // dynamic event fields
  subtitle_ml: string;
  subtitle_en: string;
  description_ml: string;
  description_en: string;
  category: string;
  organizer: string;
  event_date_label: string;
  banner_url: string | null;
  logo_url: string | null;
  theme: string;
  instructions_ml: string;
  instructions_en: string;
  results_message_ml: string;
  results_message_en: string;
  show_countdown: boolean;
}

export interface QuizQuestion {
  id: string;
  order_index: number;
  type: 'text' | 'image' | 'audio' | 'mcq';
  question_text: string;
  image_url: string | null;
  audio_url: string | null;
  options: string[];
  correct_index: number;
  explanation?: string | null;
}


export interface QuizStudent {
  id: string;
  username: string;
  display_name: string;
  used: boolean;
  used_at: string | null;
}

export interface QuizSubmission {
  id: string;
  username: string;
  full_name: string;
  mobile: string;
  address: string | null;
  extra_info: string | null;
  answers: Record<string, number>;
  score: number;
  correct_count: number;
  wrong_count: number;
  total: number;
  submitted_at: string;
}

export function useQuizSettings() {
  const [settings, setSettings] = useState<QuizSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('quiz_settings').select('*').eq('id', 'global').maybeSingle();
    if (data) setSettings(data as any);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = useCallback(async (patch: Partial<QuizSettings>) => {
    const { data, error } = await supabase
      .from('quiz_settings')
      .update({ ...patch, updated_at: new Date().toISOString() } as any)
      .eq('id', 'global')
      .select()
      .maybeSingle();
    if (!error && data) setSettings(data as any);
    return !error;
  }, []);

  return { settings, loading, save, reload: load };
}

export function isQuizLive(s: QuizSettings | null): boolean {
  if (!s || !s.enabled || !s.is_open) return false;
  const now = Date.now();
  if (s.start_at && new Date(s.start_at).getTime() > now) return false;
  if (s.end_at && new Date(s.end_at).getTime() < now) return false;
  return true;
}

export async function fetchQuestions(): Promise<QuizQuestion[]> {
  const { data } = await supabase.from('quiz_questions').select('*').order('order_index', { ascending: true });
  return (data || []) as any;
}

export async function validateUsername(username: string) {
  const { data, error } = await supabase.rpc('validate_quiz_username', { p_username: username.trim().toLowerCase() });
  if (error) return { valid: false, reason: 'error' as const };
  return data as { valid: boolean; reason?: string; display_name?: string };
}

export async function submitQuiz(payload: {
  username: string;
  full_name: string;
  mobile: string;
  address?: string;
  extra_info?: string;
  answers: Record<string, number>;
}) {
  const { data, error } = await supabase.rpc('submit_quiz', {
    p_username: payload.username.trim().toLowerCase(),
    p_full_name: payload.full_name,
    p_mobile: payload.mobile,
    p_address: payload.address || null,
    p_extra_info: payload.extra_info || null,
    p_answers: payload.answers as any,
  });
  if (error) throw new Error(error.message);
  return data as { id: string; score: number; total: number; correct: number; wrong: number };
}
