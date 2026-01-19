import { 
  Home, 
  Palette, 
  Type, 
  Layout, 
  Image as ImageIcon, 
  FileText,
  Users,
  Settings,
  Shield,
  Activity,
  Sparkles,
  BookOpen,
  ClipboardList,
  Phone,
  MapPin,
  Share2,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type AdminTab = 
  | 'dashboard'
  | 'theme'
  | 'typography'
  | 'layout'
  | 'content'
  | 'hero'
  | 'about'
  | 'courses'
  | 'benefits'
  | 'gallery'
  | 'contact'
  | 'map'
  | 'footer'
  | 'social'
  | 'splash'
  | 'form'
  | 'admissions'
  | 'seo'
  | 'users'
  | 'activity';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  newAdmissionCount?: number;
}

const menuSections = [
  {
    title: 'ഡാഷ്‌ബോർഡ്',
    items: [
      { id: 'dashboard' as const, label: 'ഓവർവ്യൂ', icon: Home }
    ]
  },
  {
    title: 'ഡിസൈൻ കൺട്രോൾ',
    items: [
      { id: 'theme' as const, label: 'കളർ തീം', icon: Palette },
      { id: 'typography' as const, label: 'ടൈപ്പോഗ്രാഫി', icon: Type },
      { id: 'layout' as const, label: 'ലേഔട്ട്', icon: Layout }
    ]
  },
  {
    title: 'കണ്ടെന്റ് മാനേജ്മെന്റ്',
    items: [
      { id: 'splash' as const, label: 'സ്പ്ലാഷ് സ്ക്രീൻ', icon: Sparkles },
      { id: 'hero' as const, label: 'ഹീറോ സെക്ഷൻ', icon: Home },
      { id: 'about' as const, label: 'അബൗട്ട്', icon: FileText },
      { id: 'courses' as const, label: 'കോഴ്‌സുകൾ', icon: BookOpen },
      { id: 'benefits' as const, label: 'നേട്ടങ്ങൾ', icon: Users },
      { id: 'gallery' as const, label: 'ഗാലറി', icon: ImageIcon },
      { id: 'contact' as const, label: 'കോൺടാക്ട്', icon: Phone },
      { id: 'map' as const, label: 'മാപ്പ്', icon: MapPin },
      { id: 'footer' as const, label: 'ഫൂട്ടർ', icon: FileText },
      { id: 'social' as const, label: 'സോഷ്യൽ മീഡിയ', icon: Share2 }
    ]
  },
  {
    title: 'അഡ്മിഷൻ',
    items: [
      { id: 'form' as const, label: 'ഫോം സെറ്റിംഗ്സ്', icon: ClipboardList },
      { id: 'admissions' as const, label: 'അപേക്ഷകൾ', icon: ClipboardList, hasBadge: true }
    ]
  },
  {
    title: 'സെറ്റിംഗ്സ്',
    items: [
      { id: 'seo' as const, label: 'SEO & മെറ്റ', icon: Globe },
      { id: 'users' as const, label: 'യൂസർ മാനേജ്മെന്റ്', icon: Shield },
      { id: 'activity' as const, label: 'ആക്ടിവിറ്റി ലോഗ്', icon: Activity }
    ]
  }
];

export function AdminSidebar({ activeTab, onTabChange, newAdmissionCount = 0 }: AdminSidebarProps) {
  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border/50 p-4 space-y-6 overflow-y-auto">
      {menuSections.map((section) => (
        <div key={section.title}>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
            {section.title}
          </h3>
          <div className="space-y-1">
            {section.items.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'secondary' : 'ghost'}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'w-full justify-start gap-3 rounded-xl relative',
                  activeTab === item.id && 'bg-secondary/20 text-secondary'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.hasBadge && newAdmissionCount > 0 && (
                  <span className="absolute right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                    {newAdmissionCount}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
