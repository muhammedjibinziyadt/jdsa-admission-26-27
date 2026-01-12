import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Activity, Clock, User, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityLogEntry {
  id: string;
  admin_username: string;
  action: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: any;
  created_at: string;
}

export function ActivityLog() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error loading activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('theme') || action.includes('color')) return '🎨';
    if (action.includes('content') || action.includes('edit')) return '✏️';
    if (action.includes('gallery') || action.includes('image')) return '🖼️';
    if (action.includes('admission')) return '📝';
    if (action.includes('login')) return '🔐';
    if (action.includes('settings')) return '⚙️';
    return '📋';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">ആക്ടിവിറ്റി ലോഗ്</h2>
        <p className="text-muted-foreground mt-1">അഡ്മിൻ പ്രവർത്തനങ്ങളുടെ രേഖ</p>
      </div>

      {logs.length === 0 ? (
        <div className="bg-card rounded-2xl p-12 border border-border/50 shadow-soft text-center">
          <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">ആക്ടിവിറ്റികൾ ഇല്ല</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden">
          <div className="divide-y divide-border/50">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{getActionIcon(log.action)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{log.action}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {log.admin_username}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm')}
                      </span>
                    </div>
                    
                    {Object.keys(log.details).length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-2 font-mono">
                        {JSON.stringify(log.details, null, 2).substring(0, 200)}
                        {JSON.stringify(log.details).length > 200 && '...'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
