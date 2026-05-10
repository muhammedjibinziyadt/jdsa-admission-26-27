import { useEffect, useState } from "react";
import { Lock, Loader2, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_PASSWORD = "JDSA9582";

const SECTIONS: { id: string; label: string }[] = [
  { id: "committee", label: "കമ്മിറ്റി" },
  { id: "computer", label: "കമ്പ്യൂട്ടർ" },
  { id: "attendance", label: "അറ്റൻഡൻസ്" },
];

function SectionRow({ id, label }: { id: string; label: string }) {
  const { toast } = useToast();
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("portal_settings")
      .select("password")
      .eq("id", id)
      .maybeSingle();
    setCurrent(data?.password ?? DEFAULT_PASSWORD);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const save = async (value: string) => {
    if (!value.trim()) {
      toast({ title: "പാസ്‌വേഡ് ശൂന്യമാകരുത്", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("portal_settings")
      .upsert({ id, password: value, updated_at: new Date().toISOString() });
    setLoading(false);
    if (error) {
      toast({ title: "അപ്‌ഡേറ്റ് പരാജയപ്പെട്ടു", description: error.message, variant: "destructive" });
      return;
    }
    setCurrent(value);
    setNewPw("");
    setSaved(true);
    toast({ title: `${label} – പാസ്‌വേഡ് അപ്‌ഡേറ്റ് ചെയ്തു` });
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="border border-border rounded-xl p-4 space-y-3 bg-background/60">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-semibold text-foreground">{label}</h4>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted font-mono">{current || "—"}</span>
      </div>
      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[180px]">
          <Label className="text-xs">പുതിയ പാസ്‌വേഡ്</Label>
          <Input
            type="text"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            placeholder="പുതിയ പാസ്‌വേഡ്"
            disabled={loading}
          />
        </div>
        <Button size="sm" onClick={() => save(newPw)} disabled={loading || !newPw} className="gap-1">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <Check className="w-3.5 h-3.5" /> : null}
          അപ്‌ഡേറ്റ്
        </Button>
        <Button size="sm" variant="outline" onClick={() => save(DEFAULT_PASSWORD)} disabled={loading} className="gap-1">
          <RotateCcw className="w-3.5 h-3.5" />
          ഡിഫോൾട്ട്
        </Button>
      </div>
    </div>
  );
}

export default function PortalPasswordAdmin() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Lock className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">സെക്ഷൻ പാസ്‌വേഡുകൾ</h3>
          <p className="text-xs text-muted-foreground">കമ്മിറ്റി, കമ്പ്യൂട്ടർ, അറ്റൻഡൻസ് സെക്ഷനുകൾക്കായി പ്രത്യേക പാസ്‌വേഡുകൾ</p>
        </div>
      </div>
      <div className="space-y-3">
        {SECTIONS.map((s) => <SectionRow key={s.id} id={s.id} label={s.label} />)}
      </div>
      <p className="text-[11px] text-muted-foreground">ഡിഫോൾട്ട് പാസ്‌വേഡ്: <span className="font-mono">{DEFAULT_PASSWORD}</span></p>
    </div>
  );
}
