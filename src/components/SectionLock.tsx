import { useState, useEffect, useCallback } from "react";
import { Lock, Loader2, AlertCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export type ProtectedSection = "committee" | "computer" | "attendance";

const SECTION_LABEL: Record<ProtectedSection, string> = {
  committee: "കമ്മിറ്റി",
  computer: "കമ്പ്യൂട്ടർ",
  attendance: "അറ്റൻഡൻസ്",
};

const sessionKey = (id: ProtectedSection) => `sectionUnlocked:${id}`;

export function useSectionLock(section: ProtectedSection) {
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    setUnlocked(sessionStorage.getItem(sessionKey(section)) === "true");
  }, [section]);
  const lock = useCallback(() => {
    sessionStorage.removeItem(sessionKey(section));
    setUnlocked(false);
  }, [section]);
  const unlock = useCallback(() => {
    sessionStorage.setItem(sessionKey(section), "true");
    setUnlocked(true);
  }, [section]);
  return { unlocked, lock, unlock };
}

export function SectionLockButton({ onLock, label = "ലോക്ക്" }: { onLock: () => void; label?: string }) {
  return (
    <Button variant="outline" size="sm" onClick={onLock} className="gap-2">
      <LogOut className="w-4 h-4" />
      {label}
    </Button>
  );
}

interface GateProps {
  section: ProtectedSection;
  onUnlock: () => void;
}

export default function SectionLockGate({ section, onUnlock }: GateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await supabase
        .from("portal_settings")
        .select("password")
        .eq("id", section)
        .maybeSingle();
      const stored = data?.password ?? "JDSA9582";
      if (password === stored) {
        sessionStorage.setItem(sessionKey(section), "true");
        onUnlock();
      } else {
        setError("തെറ്റായ പാസ്‌വേഡ്. വീണ്ടും ശ്രമിക്കുക.");
      }
    } catch {
      setError("എന്തോ പിഴവ് സംഭവിച്ചു.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{SECTION_LABEL[section]}</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            ഈ വിഭാഗം ലോക്ക് ചെയ്‌തിരിക്കുന്നു. പാസ്‌വേഡ് നൽകുക.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`pw-${section}`}>പാസ്‌വേഡ്</Label>
            <Input
              id={`pw-${section}`}
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
