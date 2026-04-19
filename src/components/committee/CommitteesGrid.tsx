import { Link } from 'react-router-dom';
import { ChevronRight, Award, Loader2 } from 'lucide-react';
import { useCommittees, COMMITTEE_META, CommitteeId } from '@/hooks/useCommittees';

export default function CommitteesGrid() {
  const { committees, loading } = useCommittees();

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-emerald-600" /></div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {(['central', 'jawahir', 'samaja', 'library'] as CommitteeId[]).map((id) => {
        const meta = COMMITTEE_META[id];
        const c = committees.find((x) => x.id === id);
        const score = c?.score ?? 0;
        const max = c?.max_score ?? 100;
        const pct = max > 0 ? Math.min(100, (score / max) * 100) : 0;

        return (
          <Link
            key={id}
            to={`/committee/${meta.slug}`}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${meta.gradient} text-white p-5 shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{meta.emoji}</span>
              <ChevronRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-base font-semibold mb-3 leading-tight">{meta.name}</h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs opacity-90">
                <span className="flex items-center gap-1"><Award className="w-3 h-3" /> Score</span>
                <span className="font-semibold">{score}/{max}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
