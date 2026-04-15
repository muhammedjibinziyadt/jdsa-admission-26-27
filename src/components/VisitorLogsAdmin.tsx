import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Globe, Monitor, Smartphone, Tablet, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VisitorLog {
  id: string;
  ip_address: string | null;
  city: string | null;
  country: string | null;
  page_visited: string;
  device_type: string | null;
  browser_name: string | null;
  visited_at: string;
}

export default function VisitorLogsAdmin() {
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('visitor_logs')
      .select('*')
      .order('visited_at', { ascending: false })
      .limit(500);

    if (!error && data) {
      setLogs(data as VisitorLog[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getDeviceIcon = (type: string | null) => {
    if (type === 'Mobile') return <Smartphone className="w-4 h-4" />;
    if (type === 'Tablet') return <Tablet className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Visitor Logs</h3>
          <span className="text-sm text-muted-foreground">({logs.length} records)</span>
        </div>
        <Button variant="outline" size="sm" onClick={fetchLogs} className="rounded-lg">
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      {logs.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No visitor logs yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 font-medium">IP Address</th>
                <th className="text-left px-4 py-3 font-medium">Location</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Time</th>
                <th className="text-left px-4 py-3 font-medium">Page</th>
                <th className="text-left px-4 py-3 font-medium">Device</th>
                <th className="text-left px-4 py-3 font-medium">Browser</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{log.ip_address || '-'}</td>
                  <td className="px-4 py-3">
                    {log.city && log.country ? `${log.city}, ${log.country}` : log.country || '-'}
                  </td>
                  <td className="px-4 py-3">{formatDate(log.visited_at)}</td>
                  <td className="px-4 py-3">{formatTime(log.visited_at)}</td>
                  <td className="px-4 py-3">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                      {log.page_visited}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {getDeviceIcon(log.device_type)}
                      <span className="text-xs">{log.device_type || '-'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">{log.browser_name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
