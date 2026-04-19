import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { CommitteeId, useCommittee, COMMITTEE_META } from '@/hooks/useCommittees';
import ScoreBoard from './ScoreBoard';
import LoginCard from './LoginCard';

export default function CommitteePageShell({
  id,
  children,
}: {
  id: CommitteeId;
  children: React.ReactNode;
}) {
  const { committee, loading } = useCommittee(id);
  const meta = COMMITTEE_META[id];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className={`bg-gradient-to-r ${meta.gradient} text-white py-5`}>
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/students-portal" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-2">
            <ArrowLeft className="w-4 h-4" /> Students Portal
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <span>{meta.emoji}</span> {meta.name}
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl space-y-5">
        {loading || !committee ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        ) : (
          <>
            <ScoreBoard committee={committee} gradient={meta.gradient} />
            <LoginCard id={id} />
            {children}
          </>
        )}
      </main>
    </div>
  );
}
