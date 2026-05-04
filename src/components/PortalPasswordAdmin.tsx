import { useEffect, useState } from "react";
import { Lock, Loader2, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_PASSWORD = "JDSA9582";

export default function PortalPasswordAdmin() {
  const { toast } = useToast();
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("portal_settings")
      .select("password")
      .eq("id", "students_portal")
      .maybeSingle();
    setCurrent(data?.password ?? DEFAULT_PASSWORD);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (value: string) => {
    if (!value.trim()) {
      toast({ title: "പാസ്‌വേഡ് ശൂന്യമാകരുത്", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("portal_settings")
      .upsert({ id: "students_portal", password: value, updated_at: new Date().toISOString() });
    setLoading(false);
    if (error) {
      toast({ title: "അപ്‌ഡേറ്റ് പരാജയപ്പെട്ടു", description: error.message, variant: "destructive" });
      return;
    }
    setCurrent(value);
    setNewPw("");
    setSaved(true);
    toast({ title: "പാസ്‌വേഡ് അപ്‌ഡേറ്റ് ചെയ്തു" });
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Lock className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">സ്റ്റുഡൻസ് പോർട്ടൽ പാസ്‌വേഡ്</h3>
          <p className="text-xs text-muted-foreground">പോർട്ടൽ ആക്സസ് നിയന്ത്രിക്കുന്ന പാസ്‌വേഡ്</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>നിലവിലെ പാസ്‌വേഡ്</Label>
        <div className="px-3 py-2 bg-muted rounded-md font-mono text-sm">{current || "—"}</div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-portal-pw">പുതിയ പാസ്‌വേഡ്</Label>
        <Input
          id="new-portal-pw"
          type="text"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          placeholder="പുതിയ പാസ്‌വേഡ് നൽകുക"
          disabled={loading}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => save(newPw)} disabled={loading || !newPw} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
          അപ്‌ഡേറ്റ് ചെയ്യുക
        </Button>
        <Button
          variant="outline"
          onClick={() => save(DEFAULT_PASSWORD)}
          disabled={loading}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          ഡിഫോൾട്ട് ({DEFAULT_PASSWORD})
        </Button>
      </div>
    </div>
  );
}
