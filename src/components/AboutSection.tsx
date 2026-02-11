import { BookOpen, Heart, Users, Star } from "lucide-react";
import { ScrollAnimate } from "@/hooks/useScrollAnimation";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, Heart, Users, Star,
};

interface AboutFeature {
  title: string;
  description: string;
  icon?: string;
}

interface AboutContent {
  title: string;
  subtitle: string;
  description: string;
  features: AboutFeature[];
  image?: string;
}

interface AboutSectionProps {
  content: AboutContent;
}

const defaultFeatures = [
  { icon: BookOpen, title: "മതപരമായ വിദ്യാഭ്യാസം", description: "ഖുർആൻ, ഹദീസ്, ഫിഖ്ഹ് എന്നിവയിൽ ആഴത്തിലുള്ള പഠനം" },
  { icon: Heart, title: "മൂല്യാധിഷ്ഠിത പരിശീലനം", description: "സ്വഭാവ രൂപീകരണവും ധാർമിക മൂല്യങ്ങളും" },
  { icon: Users, title: "സമഗ്ര വികസനം", description: "വ്യക്തിത്വ വികസനവും നേതൃത്വ പരിശീലനവും" },
  { icon: Star, title: "ആധുനിക കഴിവുകൾ", description: "കമ്പ്യൂട്ടർ പഠനവും പ്രായോഗിക വൈദഗ്ധ്യവും" }
];

const AboutSection = ({ content }: AboutSectionProps) => {
  const features = content.features?.length > 0 
    ? content.features.map((f, i) => ({
        ...f,
        icon: iconMap[f.icon || ''] || defaultFeatures[i % defaultFeatures.length].icon
      }))
    : defaultFeatures;

  return (
    <section id="about" className="py-20 lg:py-28 bg-secondary/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <ScrollAnimate direction="up">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/8 text-primary text-sm font-medium mb-4">
              {content.title || 'ഞങ്ങളെക്കുറിച്ച്'}
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
              വിജ്ഞാനത്തിന്റെ 
              <span className="gold-text"> വെളിച്ചം</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {content.description || 'ജവ്ഹറത്തുൽ ഉലൂം സുഫ്ഫാ ദർസ് ഇസ്ലാമിക വിദ്യാഭ്യാസത്തിന്റെയും ആധുനിക കഴിവുകളുടെയും സമന്വയത്തിലൂടെ വിദ്യാർത്ഥികളെ ഭാവിയിലേക്ക് സജ്ജമാക്കുന്നു.'}
            </p>
          </div>
        </ScrollAnimate>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = typeof feature.icon === 'function' ? feature.icon : BookOpen;
            return (
              <ScrollAnimate key={feature.title} direction="up" delay={index * 100} duration={600}>
                <div className="bg-card rounded-xl p-7 shadow-soft card-hover h-full">
                  <div className="w-12 h-12 rounded-xl emerald-gradient flex items-center justify-center mb-5">
                    <IconComponent className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
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

export default AboutSection;
