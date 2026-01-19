import { 
  Users, 
  Image as ImageIcon, 
  BookOpen, 
  ClipboardList, 
  Eye,
  Heart,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { WebsiteContent } from '@/hooks/useWebsiteContent';

interface AdminDashboardProps {
  content: WebsiteContent;
  admissionsCount: number;
  pendingAdmissions: number;
  galleryLikesCount?: number;
}

export function AdminDashboard({ 
  content, 
  admissionsCount, 
  pendingAdmissions,
  galleryLikesCount = 0 
}: AdminDashboardProps) {
  const stats = [
    {
      title: 'മൊത്തം അപേക്ഷകൾ',
      value: admissionsCount,
      icon: ClipboardList,
      color: 'bg-blue-500/20 text-blue-500',
      trend: '+12% this month'
    },
    {
      title: 'പെൻഡിംഗ് അപേക്ഷകൾ',
      value: pendingAdmissions,
      icon: Users,
      color: 'bg-amber-500/20 text-amber-500',
      alert: pendingAdmissions > 0
    },
    {
      title: 'ഗാലറി ഇമേജുകൾ',
      value: content.gallery?.length || 0,
      icon: ImageIcon,
      color: 'bg-purple-500/20 text-purple-500'
    },
    {
      title: 'കോഴ്‌സുകൾ',
      value: content.courses?.length || 0,
      icon: BookOpen,
      color: 'bg-green-500/20 text-green-500'
    },
    {
      title: 'ഗാലറി ലൈക്കുകൾ',
      value: galleryLikesCount,
      icon: Heart,
      color: 'bg-red-500/20 text-red-500'
    },
    {
      title: 'ഫീച്ചേഡ് കോഴ്‌സുകൾ',
      value: content.courses?.filter(c => c.featured).length || 0,
      icon: TrendingUp,
      color: 'bg-teal-500/20 text-teal-500'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">ഡാഷ്‌ബോർഡ്</h2>
        <p className="text-muted-foreground mt-1">വെബ്സൈറ്റിന്റെ ഓവർവ്യൂ</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className={`bg-card rounded-2xl p-6 border border-border/50 shadow-soft ${
              stat.alert ? 'ring-2 ring-amber-500/50' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.alert && (
                <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-medium">
                  ശ്രദ്ധിക്കുക
                </span>
              )}
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.title}</div>
            {stat.trend && (
              <div className="text-xs text-green-500 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
        <h3 className="font-semibold text-foreground mb-4">ക്വിക്ക് ആക്ഷനുകൾ</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction 
            icon={ClipboardList} 
            label="അപേക്ഷകൾ കാണുക" 
            count={pendingAdmissions}
          />
          <QuickAction 
            icon={ImageIcon} 
            label="ഗാലറി മാനേജ്" 
          />
          <QuickAction 
            icon={BookOpen} 
            label="കോഴ്‌സുകൾ എഡിറ്റ്" 
          />
          <QuickAction 
            icon={Eye} 
            label="വെബ്സൈറ്റ് കാണുക" 
            external
          />
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-secondary" />
            സ്പ്ലാഷ് സ്ക്രീൻ സ്റ്റാറ്റസ്
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground">സ്പ്ലാഷ് സ്ക്രീൻ</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                content.splash?.enabled !== false 
                  ? 'bg-green-500/20 text-green-500' 
                  : 'bg-red-500/20 text-red-500'
              }`}>
                {content.splash?.enabled !== false ? 'ആക്ടീവ്' : 'ഓഫ്'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground">അഡ്മിഷൻ സ്റ്റാറ്റസ്</span>
              <span className="text-foreground font-medium">
                {content.splash?.admissionStatus || 'അഡ്മിഷൻ ആരംഭിച്ചു'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            ഗാലറി സ്റ്റാറ്റിസ്റ്റിക്സ്
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground">ലൈക്ക് ബട്ടൺ</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                content.gallerySettings?.likesEnabled !== false 
                  ? 'bg-green-500/20 text-green-500' 
                  : 'bg-red-500/20 text-red-500'
              }`}>
                {content.gallerySettings?.likesEnabled !== false ? 'ഓൺ' : 'ഓഫ്'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground">ഡൌൺലോഡ് ബട്ടൺ</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                content.gallerySettings?.downloadEnabled !== false 
                  ? 'bg-green-500/20 text-green-500' 
                  : 'bg-red-500/20 text-red-500'
              }`}>
                {content.gallerySettings?.downloadEnabled !== false ? 'ഓൺ' : 'ഓഫ്'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ 
  icon: Icon, 
  label, 
  count, 
  external 
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  label: string; 
  count?: number;
  external?: boolean;
}) {
  return (
    <button className="p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors text-left group relative">
      <Icon className="w-5 h-5 text-secondary mb-2 group-hover:scale-110 transition-transform" />
      <span className="text-sm text-foreground font-medium">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
          {count}
        </span>
      )}
      {external && (
        <span className="absolute top-2 right-2 text-muted-foreground text-xs">↗</span>
      )}
    </button>
  );
}
