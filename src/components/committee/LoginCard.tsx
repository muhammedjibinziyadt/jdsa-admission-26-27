import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Loader2, LogOut } from 'lucide-react';
import { useCommitteeAuth, CommitteeId } from '@/hooks/useCommittees';

export default function LoginCard({ id }: { id: CommitteeId }) {
  const { isLoggedIn, login, logout } = useCommitteeAuth(id);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(password);
    setLoading(false);
    if (ok) { setPassword(''); setOpen(false); }
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
        <span className="text-sm text-emerald-700 font-medium flex items-center gap-2">
          <Lock className="w-4 h-4" /> അംഗങ്ങളായി ലോഗിൻ ചെയ്തു
        </span>
        <Button size="sm" variant="ghost" onClick={logout} className="text-emerald-700 h-8">
          <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
        </Button>
      </div>
    );
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="outline" className="w-full rounded-xl border-dashed">
        <Lock className="w-4 h-4 mr-2" /> അംഗങ്ങൾക്കായി ലോഗിൻ
      </Button>
    );
  }

  return (
    <form onSubmit={handle} className="flex gap-2 items-center bg-card border border-border rounded-xl p-2">
      <Input
        type="password"
        autoFocus
        placeholder="Committee password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-lg"
      />
      <Button type="submit" size="sm" disabled={loading || !password} className="rounded-lg">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Login'}
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={() => { setOpen(false); setPassword(''); }}>×</Button>
    </form>
  );
}
