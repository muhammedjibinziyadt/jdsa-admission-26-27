import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Receipt } from 'lucide-react';
import { useCommittees, COMMITTEE_META, CommitteeId } from '@/hooks/useCommittees';
import ScoreBoard from '@/components/committee/ScoreBoard';
import CentralBody from '@/components/committee/bodies/CentralBody';
import JawahirBody from '@/components/committee/bodies/JawahirBody';
import SamajaBody from '@/components/committee/bodies/SamajaBody';
import LibraryBody from '@/components/committee/bodies/LibraryBody';
import CustomSections from '@/components/committee/CustomSections';
import CommitteeFinesSection from '@/components/committee/CommitteeFinesSection';
import FineHubBody from '@/components/committee/FineHubBody';
import LoginCard from '@/components/committee/LoginCard';
import SectionLockGate, { useSectionLock } from '@/components/SectionLock';

type TabId = CommitteeId | 'fine';
const ORDER: TabId[] = ['central', 'jawahir', 'samaja', 'library', 'fine'];
const FINE_META = { name: 'Fine Hub', slug: 'fine', gradient: 'from-rose-600 to-pink-600', emoji: '🧾', accent: 'rose' };
const META_FOR = (id: TabId) => id === 'fine' ? FINE_META : COMMITTEE_META[id];
const BUCKET: Record<CommitteeId, string> = { central: 'committee', jawahir: 'jawahir', samaja: 'samaja', library: 'library' };

export default function CommitteeHub() {
  const { id: paramId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const initial = (ORDER.includes(paramId as TabId) ? paramId : 'central') as TabId;
  const [active, setActive] = useState<TabId>(initial);
  const committeeLock = useSectionLock('committee');

  const { committees, loading } = useCommittees();
  const meta = META_FOR(active);
  const committee = active === 'fine' ? null : committees.find((c) => c.id === active);

  if (!committeeLock.unlocked) {
    return <SectionLockGate section="committee" onUnlock={committeeLock.unlock} />;
  }

  const { committees, loading } = useCommittees();
  const meta = META_FOR(active);
  const committee = active === 'fine' ? null : committees.find((c) => c.id === active);

  const handleSelect = (id: TabId) => {
    setActive(id);
    navigate(`/committee/${id}`, { replace: true });
    setTimeout(() => {
      document.getElementById('committee-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className={`bg-gradient-to-r ${meta.gradient} text-white py-5 transition-colors`}>
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/students-portal" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-2">
            <ArrowLeft className="w-4 h-4" /> Students Portal
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <span>{meta.emoji}</span> കമ്മിറ്റി ഹബ്
          </h1>
          <p className="text-white/80 text-sm mt-1">എല്ലാ കമ്മിറ്റികളും ഒറ്റ സ്ഥലത്ത്</p>
        </div>
      </header>

      <nav className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto max-w-4xl">
          <div className="flex gap-1 overflow-x-auto px-2 py-2 scrollbar-hide">
            {ORDER.map((id) => {
              const m = META_FOR(id);
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => handleSelect(id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    isActive
                      ? `bg-gradient-to-r ${m.gradient} text-white shadow-md`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>


      <main id="committee-content" className="container mx-auto px-4 py-6 max-w-4xl space-y-5">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        ) : active === 'fine' ? (
          <FineHubBody />
        ) : committee ? (
          <>
            <LoginCard id={active as CommitteeId} />
            <ScoreBoard committee={committee} gradient={meta.gradient} />
            {active === 'central' && <CentralBody />}
            {active === 'jawahir' && <JawahirBody />}
            {active === 'samaja' && <SamajaBody />}
            {active === 'library' && <LibraryBody />}
            <CustomSections committeeId={active as CommitteeId} bucket={BUCKET[active as CommitteeId]} />
            <CommitteeFinesSection committeeId={active as CommitteeId} committeeName={meta.name} />
          </>
        ) : null}
      </main>
    </div>
  );
}
