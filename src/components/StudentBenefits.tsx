import { Shield, Brain, Award, HeartHandshake, BookOpen, Star, Heart, Users } from "lucide-react";
import { ScrollAnimate } from "@/hooks/useScrollAnimation";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Brain, Award, HeartHandshake, BookOpen, Star, Heart, Users,
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
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <ScrollAnimate direction="up">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/8 text-primary text-sm font-medium mb-4">
              വിദ്യാർത്ഥി നേട്ടങ്ങൾ
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
              ഞങ്ങളുടെ വിദ്യാർത്ഥികൾ 
              <span className="gold-text"> നേടുന്നത്</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              ജവ്ഹറത്തുൽ ഉലൂമിലെ വിദ്യാഭ്യാസം വിദ്യാർത്ഥികളെ സമഗ്രമായി 
              വളർത്തുന്നു. അവർ അറിവിലും പെരുമാറ്റത്തിലും മികവുറ്റവരായി 
              സമൂഹത്തിൽ ഉയർന്നുവരുന്നു.
            </p>
          </div>
        </ScrollAnimate>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => {
            const IconComponent = iconMap[benefit.icon || ''] || defaultIcons[index % defaultIcons.length];
            return (
              <ScrollAnimate key={benefit.id} direction={index % 2 === 0 ? 'left' : 'right'} delay={index * 100} duration={650}>
                <div className="bg-card rounded-xl p-6 shadow-soft card-hover text-center h-full">
                  <div className="w-14 h-14 rounded-xl emerald-gradient flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {benefit.description}
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

export default StudentBenefits;
