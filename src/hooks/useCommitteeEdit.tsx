import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useCommitteeAuth, CommitteeId } from '@/hooks/useCommittees';

/**
 * Returns whether the current viewer can edit content for this committee.
 * Main admin OR a member logged into THIS committee.
 * Fines section uses isAdmin directly — never this hook.
 */
export function useCommitteeEdit(id: CommitteeId) {
  const { isAuthenticated: isAdmin } = useAdminAuth();
  const { isLoggedIn } = useCommitteeAuth(id);
  return { canEdit: isAdmin || isLoggedIn, isAdmin, isCommitteeMember: isLoggedIn };
}
