import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Award, Lock, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import { useCommittees, COMMITTEE_META, CommitteeId } from '@/hooks/useCommittees';

export default function CommitteesAdminPanel() {
  const { committees, loading, updateCommittee } = useCommittees();
  const [drafts, setDrafts] = useState<Record<string, { password: string; score: number; max_score: number; remark: string; showPw: boolean }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (committees.length) {
      const init: typeof drafts = {};
      committees.forEach((c) => { init[c.id] = { password: c.password, score: c.score, max_score: c.max_score, remark: c.remark || '', showPw: false }; });
      setDrafts(init);
    }
  }, [committees]);

  const save = async (id: CommitteeId) => {
    const d = drafts[id]; if (!d) return;
    setSavingId(id);
    await updateCommittee(id, { password: d.password, score: d.score, max_score: d.max_score, remark: d.remark || null });
    setSavingId(null);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-2xl p-5 border border-border">
        <h2 className="text-lg font-semibold mb-1 flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> Committee Management</h2>
        <p className="text-sm text-muted-foreground">Set passwords and assign performance scores for each committee. Members log in to their committee page using these passwords.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(['central', 'jawahir', 'samaja', 'library'] as CommitteeId[]).map((id) => {
          const meta = COMMITTEE_META[id];
          const d = drafts[id];
          if (!d) return null;
          return (
            <div key={id} className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className={`bg-gradient-to-r ${meta.gradient} px-5 py-3 text-white`}>
                <h3 className="font-semibold flex items-center gap-2"><span>{meta.emoji}</span> {meta.name}</h3>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><Lock className="w-3 h-3" /> Committee Password</Label>
                  <div className="flex gap-2">
                    <Input
                      type={d.showPw ? 'text' : 'password'}
                      value={d.password}
                      onChange={(e) => setDrafts({ ...drafts, [id]: { ...d, password: e.target.value } })}
                      className="rounded-lg"
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => setDrafts({ ...drafts, [id]: { ...d, showPw: !d.showPw } })}>
                      {d.showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Score</Label>
                    <Input type="number" value={d.score} onChange={(e) => setDrafts({ ...drafts, [id]: { ...d, score: Number(e.target.value) || 0 } })} className="rounded-lg" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Max Score</Label>
                    <Input type="number" value={d.max_score} onChange={(e) => setDrafts({ ...drafts, [id]: { ...d, max_score: Number(e.target.value) || 100 } })} className="rounded-lg" />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Performance Remark</Label>
                  <textarea value={d.remark} onChange={(e) => setDrafts({ ...drafts, [id]: { ...d, remark: e.target.value } })} placeholder="e.g., Excellent performance" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" rows={2} />
                </div>

                <Button onClick={() => save(id)} disabled={savingId === id} className="w-full">
                  {savingId === id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
