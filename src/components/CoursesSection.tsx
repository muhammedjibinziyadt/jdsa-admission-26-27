import { 
  BookOpenCheck, BookText, Monitor, PenTool, Mic,
  Library, Coffee, GraduationCap, Users, Sparkles
} from "lucide-react";
import { ScrollAnimate } from "@/hooks/useScrollAnimation";

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  syllabus?: string;
  featured: boolean;
}

interface CoursesSectionProps {
  courses: Course[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  sectionDescription?: string;
}

const iconList = [BookOpenCheck, BookText, Monitor, PenTool, Mic, GraduationCap, Users, Library, Coffee];

const CoursesSection = ({ 
  courses, 
  sectionTitle = 'പഠന പാഠ്യന്തര വിഷയങ്ങൾ',
  sectionSubtitle = 'പഠന പദ്ധതികൾ',
  sectionDescription = 'സമഗ്രമായ വിദ്യാഭ്യാസ പദ്ധതിയിലൂടെ വിദ്യാർത്ഥികളെ എല്ലാ മേഖലകളിലും മികവുറ്റവരാക്കുന്നു'
}: CoursesSectionProps) => {
  const featuredCourses = courses.filter(c => c.featured);
  const regularCourses = courses.filter(c => !c.featured);

  return (
    <section id="courses" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <ScrollAnimate direction="up">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold-dark text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              {sectionSubtitle}
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
              {sectionTitle}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {sectionDescription}
            </p>
          </div>
        </ScrollAnimate>
        
        {/* Featured Course */}
        <ScrollAnimate direction="scale" duration={700}>
          <div className="mb-10">
            {featuredCourses.slice(0, 1).map((course, index) => {
              const IconComponent = iconList[index % iconList.length];
              return (
                <div key={course.id} className="rounded-xl overflow-hidden emerald-gradient">
                  <div className="p-8 lg:p-10">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                      <div className="w-20 h-20 rounded-xl gold-bg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-10 h-10 text-primary" />
                      </div>
                      <div className="text-center lg:text-left flex-1">
                        <div className="inline-block px-3 py-1 rounded-full bg-white/15 text-gold-light text-xs font-semibold mb-3 uppercase tracking-wide">
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
              );
            })}
          </div>
        </ScrollAnimate>
        
        {/* Courses Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {regularCourses.map((course, index) => {
            const IconComponent = iconList[(index + 1) % iconList.length];
            return (
              <ScrollAnimate key={course.id} direction="up" delay={index * 80} duration={600}>
                <div className="bg-card rounded-xl p-6 shadow-soft card-hover h-full">
                  <div className="w-12 h-12 rounded-xl emerald-gradient flex items-center justify-center mb-5">
                    <IconComponent className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </ScrollAnimate>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
