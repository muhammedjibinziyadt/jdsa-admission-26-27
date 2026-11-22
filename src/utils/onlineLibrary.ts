import { supabase } from '@/integrations/supabase/client';

export interface OnlineBook {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  total_pages: number;
  publication_date: string | null;
  book_language: string;
  reading_direction: 'ltr' | 'rtl';
  visibility: 'published' | 'unpublished';
  page_format: 'a4-portrait' | 'a4-landscape' | 'a5-portrait' | 'a5-landscape' | 'custom' | 'original';
  custom_page_width: number | null;
  custom_page_height: number | null;
  display_order: number;
  cover_path: string | null;
  pdf_path?: string;
  cover_url?: string | null;
  created_at?: string;
}

export interface AdminBookDraft extends Omit<OnlineBook, 'id' | 'created_at' | 'cover_url'> {
  id?: string;
}

export async function libraryRequest<T>(action: string, payload: Record<string, unknown> = {}, token?: string | null): Promise<T> {
  const { data, error } = await supabase.functions.invoke('online-reading-library', {
    body: { action, ...payload },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (error) {
    const context = error.context as Response | undefined;
    if (context) {
      try {
        const body = await context.clone().json() as { error?: string };
        if (body.error) throw new Error(body.error);
      } catch (nestedError) {
        if (nestedError instanceof Error && nestedError.message !== 'Unexpected end of JSON input') throw nestedError;
      }
    }
    throw error;
  }
  if (data?.error) throw new Error(String(data.error));
  return data as T;
}

export async function uploadLibraryFile(file: File, token: string, onProgress?: (progress: number) => void) {
  const { path, signedUrl } = await libraryRequest<{ path: string; signedUrl: string }>('admin-upload-url', {
    name: file.name,
    type: file.type,
    size: file.size,
  }, token);
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.setRequestHeader('Cache-Control', 'max-age=3600');
    xhr.upload.onprogress = event => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error('ഫയൽ അപ്‌ലോഡ് ചെയ്യാനായില്ല'));
    xhr.onerror = () => reject(new Error('ഫയൽ അപ്‌ലോഡ് ചെയ്യാനായില്ല'));
    xhr.send(file);
  });
  onProgress?.(100);
  return path;
}