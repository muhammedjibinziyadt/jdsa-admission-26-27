import { useState } from 'react';
import { Lock, User, LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "പിശക്!",
        description: "യൂസർനെയിമും പാസ്‌വേഡും നൽകുക",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const success = await onLogin(username, password);
    setLoading(false);

    if (!success) {
      toast({
        title: "ലോഗിൻ പരാജയപ്പെട്ടു!",
        description: "തെറ്റായ യൂസർനെയിം അല്ലെങ്കിൽ പാസ്‌വേഡ്",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl emerald-gradient flex items-center justify-center mx-auto mb-4 shadow-elevated">
            <Lock className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            അഡ്മിൻ ലോഗിൻ
          </h1>
          <p className="text-muted-foreground mt-2">
            ജവഹറത്തുൽ ഉലൂം സുഫ്ഫാ ദർസ്
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-8 shadow-soft border border-border/50">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                യൂസർനെയിം
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="യൂസർനെയിം നൽകുക"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                പാസ്‌വേഡ്
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="പാസ്‌വേഡ് നൽകുക"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-6 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ലോഗിൻ ചെയ്യുന്നു...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  ലോഗിൻ
                </>
              )}
            </Button>
          </div>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-6">
          സുരക്ഷിത അഡ്മിൻ പോർട്ടൽ
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
