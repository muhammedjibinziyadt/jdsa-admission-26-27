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
  Sparkles
} from "lucide-react";

const courses = [
  {
    icon: BookOpenCheck,
    title: "സുഫ്ഫാ കോഴ്‌സിന് കീഴിലെ ദർസ്",
    description: "പരമ്പരാഗത ഇസ്ലാമിക വിദ്യാഭ്യാസ പദ്ധതിയിലൂടെ ആഴത്തിലുള്ള മതപഠനം",
    color: "from-emerald-600 to-emerald-800",
    featured: true
  },
  {
    icon: BookText,
    title: "ഖുര്‍ആൻ പഠനം",
    description: "ഖുർആൻ എഴുത്തും വായനയും തജ്‌വീദും",
    color: "from-teal-500 to-teal-700",
    featured: false
  },
  {
    icon: Monitor,
    title: "കമ്പ്യൂട്ടർ പഠനം",
    description: "ആധുനിക ലോകത്തേക്കുള്ള ഡിജിറ്റൽ കഴിവുകൾ",
    color: "from-blue-500 to-blue-700",
    featured: false
  },
  {
    icon: PenTool,
    title: "എഴുത്ത്പഠനം",
    description: "കൈയെഴുത്തും എഴുത്തു വൈദഗ്ധ്യവും",
    color: "from-amber-500 to-amber-700",
    featured: false
  },
  {
    icon: Mic,
    title: "പ്രസംഗ പരിശീലനം",
    description: "പബ്ലിക് സ്പീക്കിംഗും ദർസ് പരിശീലനവും",
    color: "from-purple-500 to-purple-700",
    featured: false
  },
  {
    icon: GraduationCap,
    title: "വഅള് പരിശീലനം",
    description: "മത പ്രഭാഷണ കലയും ആശയവിനിമയവും",
    color: "from-rose-500 to-rose-700",
    featured: false
  },
  {
    icon: Users,
    title: "വ്യക്തിത്വ വികസനം",
    description: "നേതൃത്വ ഗുണങ്ങളും സ്വഭാവ രൂപീകരണവും",
    color: "from-indigo-500 to-indigo-700",
    featured: false
  },
  {
    icon: Library,
    title: "ലൈബ്രറി സൗകര്യം",
    description: "വിപുലമായ ഗ്രന്ഥശേഖരവും വായനാ സൗകര്യവും",
    color: "from-cyan-500 to-cyan-700",
    featured: false
  },
  {
    icon: Coffee,
    title: "കാന്റീൻ സൗകര്യം",
    description: "ആരോഗ്യകരമായ ഭക്ഷണവും സ്നാക്കുകളും",
    color: "from-orange-500 to-orange-700",
    featured: false
  }
];

const CoursesSection = () => {
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
            പഠന പദ്ധതികൾ
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            ഞങ്ങളുടെ 
            <span className="gold-text"> കോഴ്‌സുകൾ</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            സമഗ്രമായ വിദ്യാഭ്യാസ പദ്ധതിയിലൂടെ വിദ്യാർത്ഥികളെ 
            എല്ലാ മേഖലകളിലും മികവുറ്റവരാക്കുന്നു
          </p>
        </div>
        
        {/* Featured Course */}
        <div className="mb-12">
          {courses.filter(c => c.featured).map((course) => (
            <div 
              key={course.title}
              className="relative group overflow-hidden rounded-3xl p-1"
            >
              <div className="absolute inset-0 emerald-gradient opacity-95 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-card/5 backdrop-blur-sm rounded-[1.4rem] p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Icon */}
                  <div className="w-24 h-24 rounded-2xl gold-bg flex items-center justify-center shadow-gold flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <course.icon className="w-12 h-12 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <div className="text-center lg:text-left flex-1">
                    <div className="inline-block px-3 py-1 rounded-full bg-gold/20 text-gold-light text-xs font-semibold mb-3 uppercase tracking-wide">
                      മുഖ്യ കോഴ്‌സ്
                    </div>
                    <h3 className="font-display text-2xl lg:text-3xl font-bold text-primary-foreground mb-4">
                      {course.title}
                    </h3>
                    <p className="text-primary-foreground/80 text-lg leading-relaxed max-w-2xl">
                      {course.description}. ഈ കോഴ്‌സിൽ വിദ്യാർത്ഥികൾക്ക് ഇസ്ലാമിക 
                      ശാസ്ത്രങ്ങളിൽ ആഴത്തിലുള്ള പരിജ്ഞാനം നേടാനും 
                      പ്രായോഗിക ജീവിതത്തിൽ അവ പ്രയോഗിക്കാനും സാധിക്കും.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Courses Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.filter(c => !c.featured).map((course, index) => (
            <div 
              key={course.title}
              className="group relative bg-card rounded-2xl p-6 shadow-soft card-hover border border-border/50 overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-5 shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                <course.icon className="w-7 h-7 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {course.description}
              </p>
              
              {/* Decorative corner */}
              <div className={`absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br ${course.color} opacity-0 group-hover:opacity-10 transition-all duration-500 group-hover:-bottom-8 group-hover:-right-8`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
