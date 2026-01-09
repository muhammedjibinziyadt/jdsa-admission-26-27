import { Shield, Brain, Award, HeartHandshake } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "അച്ചടക്കം",
    description: "ജീവിതത്തിന്റെ എല്ലാ മേഖലകളിലും അച്ചടക്കം പാലിക്കാനുള്ള കഴിവ്"
  },
  {
    icon: Brain,
    title: "വിജ്ഞാനം",
    description: "മത-ലൗകിക വിദ്യകളിൽ ആഴത്തിലുള്ള പരിജ്ഞാനം"
  },
  {
    icon: Award,
    title: "ആത്മവിശ്വാസം",
    description: "പൊതുസമൂഹത്തിൽ ആത്മവിശ്വാസത്തോടെ ഇടപെടാനുള്ള ശേഷി"
  },
  {
    icon: HeartHandshake,
    title: "സ്വഭാവഗുണം",
    description: "ഇസ്ലാമിക മൂല്യങ്ങളിൽ അധിഷ്ഠിതമായ സ്വഭാവ രൂപീകരണം"
  }
];

const StudentBenefits = () => {
  return (
    <section className="py-24 lg:py-32 relative bg-muted/30 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              വിദ്യാർത്ഥി നേട്ടങ്ങൾ
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              ഞങ്ങളുടെ വിദ്യാർത്ഥികൾ 
              <span className="gold-text"> നേടുന്നത്</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              ജവ്ഹറത്തുൽ ഉലൂമിലെ വിദ്യാഭ്യാസം വിദ്യാർത്ഥികളെ സമഗ്രമായി 
              വളർത്തുന്നു. അവർ അറിവിലും പെരുമാറ്റത്തിലും മികവുറ്റവരായി 
              സമൂഹത്തിൽ ഉയർന്നുവരുന്നു.
            </p>
            
            {/* Benefits List */}
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div 
                  key={benefit.title}
                  className="flex items-start gap-4 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl emerald-gradient flex items-center justify-center shadow-soft flex-shrink-0 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Visual Element */}
          <div className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main Circle */}
              <div className="absolute inset-8 rounded-full emerald-gradient shadow-elevated flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="font-display text-6xl font-bold text-primary-foreground mb-2">
                    100+
                  </div>
                  <div className="text-primary-foreground/80 text-lg">
                    വിദ്യാർത്ഥികൾ
                  </div>
                </div>
              </div>
              
              {/* Orbiting Elements */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full gold-bg shadow-gold flex items-center justify-center animate-float">
                <span className="text-primary font-display font-bold text-2xl">📚</span>
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-teal shadow-soft flex items-center justify-center animate-float animation-delay-400">
                <span className="text-2xl">🎓</span>
              </div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-18 h-18 rounded-full bg-accent shadow-soft flex items-center justify-center animate-float animation-delay-200">
                <span className="text-2xl">✨</span>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-card border border-border shadow-soft flex items-center justify-center animate-float animation-delay-600">
                <span className="text-2xl">🌙</span>
              </div>
              
              {/* Background rings */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/10 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-gold/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentBenefits;
