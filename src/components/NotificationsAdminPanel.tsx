import NotificationsBanner from '@/components/committee/NotificationsBanner';

/**
 * Admin-only management view: shows notifications for each committee scope
 * with full add/edit/delete (still password-gated by useAdminGate, which auto-passes when admin is logged in).
 */
export default function NotificationsAdminPanel() {
  const scopes: { id: string; label: string }[] = [
    { id: 'central', label: 'Central Committee' },
    { id: 'jawahir', label: 'Al Jawahir Committee' },
    { id: 'samaja', label: 'Samaj Committee' },
    { id: 'library', label: 'Library Committee' },
  ];
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-border p-4">
        <h2 className="font-semibold text-slate-800">Committee Notifications</h2>
        <p className="text-xs text-muted-foreground mt-1">Send notices to a specific committee or to all committees. Notifications appear at the top of each committee page.</p>
      </div>
      {scopes.map((s) => (
        <div key={s.id}>
          <p className="text-xs font-medium text-muted-foreground mb-1 px-1">{s.label}</p>
          <NotificationsBanner committeeId={s.id} showAdminControls />
        </div>
      ))}
    </div>
  );
}
