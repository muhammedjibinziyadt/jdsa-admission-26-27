import { Shield, Brain, Award, HeartHandshake, BookOpen, Star, Heart, Users } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Brain,
  Award,
  HeartHandshake,
  BookOpen,
  Star,
  Heart,
  Users,
};

interface Benefit {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

interface StudentBenefitsProps {
  benefits: Benefit[];
}

const defaultIcons = [Shield, Brain, Award, HeartHandshake];

const StudentBenefits = ({ benefits }: StudentBenefitsProps) => {
  return (
    <section className="py-24 lg:py-32 relative bg-muted/30 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            വിദ്യാർത്ഥി നേട്ടങ്ങൾ
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            ഞങ്ങളുടെ വിദ്യാർത്ഥികൾ 
            <span className="gold-text"> നേടുന്നത്</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            ജവ്ഹറത്തുൽ ഉലൂമിലെ വിദ്യാഭ്യാസം വിദ്യാർത്ഥികളെ സമഗ്രമായി 
            വളർത്തുന്നു. അവർ അറിവിലും പെരുമാറ്റത്തിലും മികവുറ്റവരായി 
            സമൂഹത്തിൽ ഉയർന്നുവരുന്നു.
          </p>
        </div>
        
        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => {
            const IconComponent = iconMap[benefit.icon || ''] || defaultIcons[index % defaultIcons.length];
            return (
              <div 
                key={benefit.id}
                className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 text-center hover:shadow-elevated transition-shadow"
              >
                <div className="w-16 h-16 rounded-xl emerald-gradient flex items-center justify-center shadow-soft mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StudentBenefits;
