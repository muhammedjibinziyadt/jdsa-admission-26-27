import { useCallback, useEffect, useState } from 'react';
import { libraryRequest, OnlineBook } from '@/utils/onlineLibrary';

const SESSION_KEY = 'online-library-session';

export function useOnlineLibrary() {
  const [token, setToken] = useState(() => sessionStorage.getItem(SESSION_KEY));
  const [books, setBooks] = useState<OnlineBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const unlock = useCallback(async (password: string) => {
    setError('');
    try {
      const result = await libraryRequest<{ token: string }>('unlock', { password });
      sessionStorage.setItem(SESSION_KEY, result.token);
      setToken(result.token);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'പ്രവേശനം സാധിച്ചില്ല');
      return false;
    }
  }, []);

  const lock = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setToken(null);
    setBooks([]);
  }, []);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const result = await libraryRequest<{ books: OnlineBook[] }>('catalog', {}, token);
      setBooks(result.books);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'പുസ്തകങ്ങൾ ലഭിച്ചില്ല');
      if (e instanceof Error && e.message.includes('password')) lock();
    } finally {
      setLoading(false);
    }
  }, [lock, token]);

  useEffect(() => { void refresh(); }, [refresh]);
  return { token, books, loading, error, unlock, lock, refresh };
}

export function useLibraryAdminSession(enabled: boolean) {
  const [token, setToken] = useState(() => sessionStorage.getItem('online-library-admin-session'));
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verify = useCallback(async (password: string) => {
    setLoading(true);
    setError('');
    try {
      const result = await libraryRequest<{ token: string }>('admin-verify', { password });
      sessionStorage.setItem('online-library-admin-session', result.token);
      setToken(result.token);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'അഡ്മിൻ പരിശോധന പരാജയപ്പെട്ടു');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('online-library-admin-session');
    setToken(null);
    setUsername('');
  }, []);

  useEffect(() => {
    if (!enabled || !token) return;
    libraryRequest<{ username: string }>('admin-current', {}, token)
      .then(result => setUsername(result.username))
      .catch(() => logout());
  }, [enabled, logout, token]);

  return { token, username, loading, error, verify, logout };
}