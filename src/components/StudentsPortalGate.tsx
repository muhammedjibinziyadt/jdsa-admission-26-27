import { useState, useEffect } from "react";
import { Lock, Loader2, AlertCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "studentsPortalUnlocked";

export function useStudentsPortalAuth() {
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    setUnlocked(sessionStorage.getItem(SESSION_KEY) === "true");
  }, []);
  const lock = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
  };
  const unlock = () => {
    sessionStorage.setItem(SESSION_KEY, "true");
    setUnlocked(true);
  };
  return { unlocked, lock, unlock };
}

interface Props {
  onUnlock: () => void;
}

export default function StudentsPortalGate({ onUnlock }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error: dbError } = await supabase
        .from("portal_settings")
        .select("password")
        .eq("id", "students_portal")
        .maybeSingle();
      if (dbError) throw dbError;
      const stored = data?.password ?? "JDSA9582";
      if (password === stored) {
        sessionStorage.setItem(SESSION_KEY, "true");
        onUnlock();
      } else {
        setError("തെറ്റായ പാസ്‌വേഡ്. വീണ്ടും ശ്രമിക്കുക.");
      }
    } catch {
      setError("എന്തോ പിഴവ് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">സ്റ്റുഡൻസ് പോർട്ടൽ</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            തുടരാൻ പാസ്‌വേഡ് നൽകുക
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="portal-pw">പാസ്‌വേഡ്</Label>
            <Input
              id="portal-pw"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading || !password}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "പ്രവേശിക്കുക"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function PortalLockButton({ onLock }: { onLock: () => void }) {
  return (
    <Button variant="outline" size="sm" onClick={onLock} className="gap-2">
      <LogOut className="w-4 h-4" />
      ലോക്ക്
    </Button>
  );
}
