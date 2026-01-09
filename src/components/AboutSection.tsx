import { BookOpen, Heart, Users, Star } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "മതപരമായ വിദ്യാഭ്യാസം",
    description: "ഖുർആൻ, ഹദീസ്, ഫിഖ്ഹ് എന്നിവയിൽ ആഴത്തിലുള്ള പഠനം"
  },
  {
    icon: Heart,
    title: "മൂല്യാധിഷ്ഠിത പരിശീലനം",
    description: "സ്വഭാവ രൂപീകരണവും ധാർമിക മൂല്യങ്ങളും"
  },
  {
    icon: Users,
    title: "സമഗ്ര വികസനം",
    description: "വ്യക്തിത്വ വികസനവും നേതൃത്വ പരിശീലനവും"
  },
  {
    icon: Star,
    title: "ആധുനിക കഴിവുകൾ",
    description: "കമ്പ്യൂട്ടർ പഠനവും പ്രായോഗിക വൈദഗ്ധ്യവും"
  }
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 lg:py-32 relative overflow-hidden cream-gradient">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 islamic-pattern opacity-30" />
      
      {/* Floating Shapes */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            ഞങ്ങളെക്കുറിച്ച്
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            വിജ്ഞാനത്തിന്റെ 
            <span className="gold-text"> വെളിച്ചം</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            ജവ്ഹറത്തുൽ ഉലൂം സുഫ്ഫാ ദർസ് ഇസ്ലാമിക വിദ്യാഭ്യാസത്തിന്റെയും ആധുനിക 
            കഴിവുകളുടെയും സമന്വയത്തിലൂടെ വിദ്യാർത്ഥികളെ ഭാവിയിലേക്ക് സജ്ജമാക്കുന്നു.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group relative bg-card rounded-3xl p-8 shadow-soft card-hover border border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl emerald-gradient flex items-center justify-center mb-6 shadow-soft group-hover:shadow-elevated transition-shadow group-hover:scale-110 duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              
              {/* Content */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              
              {/* Decorative line */}
              <div className="absolute bottom-0 left-8 right-8 h-1 rounded-full bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
        
        {/* Mission Statement */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 emerald-gradient rounded-3xl opacity-95" />
          <div className="relative p-10 lg:p-16 text-center">
            <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl text-primary-foreground font-medium leading-relaxed mb-6">
              "വിദ്യ അഭ്യസിക്കുന്നത് ഓരോ മുസ്ലിമിനും ഫർദാണ്"
            </blockquote>
            <cite className="text-gold-light text-lg font-medium not-italic">
              — نبوی حدیث
            </cite>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
