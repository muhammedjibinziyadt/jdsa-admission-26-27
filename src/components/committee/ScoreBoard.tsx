import { Award, MessageSquare } from 'lucide-react';
import { Committee } from '@/hooks/useCommittees';

export default function ScoreBoard({ committee, gradient }: { committee: Committee; gradient: string }) {
  const pct = committee.max_score > 0 ? Math.min(100, (committee.score / committee.max_score) * 100) : 0;
  return (
    <div className={`rounded-2xl p-5 text-white shadow-lg bg-gradient-to-br ${gradient}`}>
      <div className="flex items-center gap-2 mb-2">
        <Award className="w-5 h-5" />
        <h3 className="text-sm font-semibold tracking-wide uppercase opacity-90">Performance Score</h3>
      </div>
      <div className="flex items-end gap-2 mb-3">
        <span className="text-5xl font-bold leading-none">{committee.score}</span>
        <span className="text-xl opacity-80 mb-1">/ {committee.max_score}</span>
      </div>
      <div className="h-2 rounded-full bg-white/20 overflow-hidden mb-3">
        <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      {committee.remark && (
        <div className="flex items-start gap-2 bg-white/10 rounded-lg p-2.5">
          <MessageSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-80" />
          <p className="text-sm leading-relaxed">{committee.remark}</p>
        </div>
      )}
    </div>
  );
}
