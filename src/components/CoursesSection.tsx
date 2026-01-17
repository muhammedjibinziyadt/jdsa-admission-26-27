import { useState } from "react";
import { 
  BookOpenCheck, 
  BookText,
  Monitor,
  PenTool,
  Mic,
  Library,
  Coffee,
  GraduationCap,
  Users,
  Sparkles,
  MessageSquare,
  ChevronDown,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LearningItem {
  id: string;
  title: string;
  icon: string;
  enabled: boolean;
  order: number;
  content: string[];
}

interface CoursesSectionProps {
  learningItems?: LearningItem[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  sectionDescription?: string;
}

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  BookOpenCheck,
  BookText,
  Monitor,
  PenTool,
  Mic,
  GraduationCap,
  Users,
  Library,
  Coffee,
  MessageSquare,
  Sparkles
};

const colorList = [
  "from-emerald-600 to-emerald-800",
  "from-teal-500 to-teal-700",
  "from-amber-500 to-amber-700",
  "from-purple-500 to-purple-700",
  "from-rose-500 to-rose-700",
  "from-indigo-500 to-indigo-700"
];

const defaultLearningItems: LearningItem[] = [
  { 
    id: '1', 
    title: 'വഅള് പരിശീലനം', 
    icon: 'Mic',
    enabled: true,
    order: 1,
    content: [
      'Islamic preaching fundamentals',
      'Speech structure & delivery',
      'Voice modulation',
      'Audience engagement',
      'Practical wa\'az sessions',
      'Scholar guidance'
    ]
  },
  { 
    id: '2', 
    title: 'വ്യക്തിത്വ വികസനം', 
    icon: 'Users',
    enabled: true,
    order: 2,
    content: [
      'Islamic manners (Adab)',
      'Leadership qualities',
      'Confidence building',
      'Time management',
      'Social responsibility'
    ]
  },
  { 
    id: '3', 
    title: 'എഴുത്ത് പഠനം', 
    icon: 'PenTool',
    enabled: true,
    order: 3,
    content: [
      'Arabic & Malayalam writing',
      'Essay writing',
      'Islamic article preparation',
      'Exam-oriented writing',
      'Creative exercises'
    ]
  },
  { 
    id: '4', 
    title: 'പ്രസംഗ പരിശീലനം', 
    icon: 'MessageSquare',
    enabled: true,
    order: 4,
    content: [
      'Stage confidence',
      'Microphone handling',
      'Speech timing',
      'Body language',
      'Live practice sessions',
      'Feedback system'
    ]
  },
  { 
    id: '5', 
    title: 'ലൈബ്രറി സൗകര്യം', 
    icon: 'Library',
    enabled: true,
    order: 5,
    content: [
      'Islamic books collection',
      'Tafseer, Hadith, Fiqh',
      'Reference materials',
      'Silent reading space',
      'Regular updates'
    ]
  },
  { 
    id: '6', 
    title: 'കാന്റീൻ സൗകര്യം', 
    icon: 'Coffee',
    enabled: true,
    order: 6,
    content: [
      'Hygienic food',
      'Nutritious meals',
      'Student-friendly pricing',
      'Clean dining area',
      'Drinking water facility'
    ]
  }
];

const CoursesSection = ({ 
  learningItems = defaultLearningItems,
  sectionTitle = 'പഠന പാഠ്യന്തര വിഷയങ്ങൾ',
  sectionSubtitle = 'പഠന പദ്ധതികൾ',
  sectionDescription = 'സമഗ്രമായ വിദ്യാഭ്യാസ പദ്ധതിയിലൂടെ വിദ്യാർത്ഥികളെ എല്ലാ മേഖലകളിലും മികവുറ്റവരാക്കുന്നു'
}: CoursesSectionProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter enabled items and sort by order
  const sortedItems = [...learningItems]
    .filter(item => item.enabled)
    .sort((a, b) => a.order - b.order);

  const handleToggle = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <section id="courses" className="py-24 lg:py-32 relative bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cream to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-muted/50 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold-dark text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            {sectionSubtitle}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {sectionTitle}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {sectionDescription}
          </p>
        </div>
        
        {/* Accordion Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item, index) => {
            const IconComponent = iconMap[item.icon] || BookOpenCheck;
            const color = colorList[index % colorList.length];
            const isExpanded = expandedId === item.id;
            
            return (
              <div 
                key={item.id}
                className={cn(
                  "group relative bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden transition-all duration-300",
                  isExpanded && "ring-2 ring-primary/20"
                )}
              >
                {/* Card Header - Clickable */}
                <button
                  onClick={() => handleToggle(item.id)}
                  className="w-full p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={cn(
                        "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-soft flex-shrink-0 transition-transform duration-300",
                        color,
                        isExpanded ? "scale-110" : "group-hover:scale-110"
                      )}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      
                      {/* Title */}
                      <div>
                        <h3 className={cn(
                          "font-display text-lg font-semibold text-foreground transition-colors",
                          isExpanded ? "text-primary" : "group-hover:text-primary"
                        )}>
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {item.content.length} ഇനങ്ങൾ
                        </p>
                      </div>
                    </div>
                    
                    {/* Expand Icon */}
                    <ChevronDown className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 mt-1",
                      isExpanded && "rotate-180"
                    )} />
                  </div>
                </button>
                
                {/* Expandable Content */}
                <div className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div className="px-6 pb-6 pt-2 border-t border-border/50">
                    <ul className="space-y-3">
                      {item.content.map((contentItem, idx) => (
                        <li 
                          key={idx}
                          className="flex items-start gap-3 text-sm text-muted-foreground"
                          style={{ 
                            animationDelay: `${idx * 50}ms`,
                            animation: isExpanded ? 'fadeInUp 0.3s ease forwards' : 'none'
                          }}
                        >
                          <Check className={cn(
                            "w-4 h-4 mt-0.5 flex-shrink-0",
                            `text-${color.split('-')[1]}-600`
                          )} style={{ color: 'hsl(var(--primary))' }} />
                          <span>{contentItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Decorative gradient overlay */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br pointer-events-none transition-opacity duration-300",
                  color,
                  isExpanded ? "opacity-[0.03]" : "opacity-0 group-hover:opacity-[0.02]"
                )} />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default CoursesSection;