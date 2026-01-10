import { Phone, Mail, Clock } from "lucide-react";

interface ContactContent {
  phone1: string;
  phone2: string;
  email: string;
  address: string;
  timing: string;
}

interface ContactSectionProps {
  content: ContactContent;
}

const ContactSection = ({ content }: ContactSectionProps) => {
  return (
    <section id="contact" className="py-24 lg:py-32 relative bg-background">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cream to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold-dark text-sm font-medium mb-4">
            ബന്ധപ്പെടുക
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            അഡ്മിഷൻ 
            <span className="gold-text"> എടുക്കാം</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            നിങ്ങളുടെ കുട്ടിയുടെ ഭാവി രൂപപ്പെടുത്താൻ ഇന്നുതന്നെ ഞങ്ങളെ ബന്ധപ്പെടുക
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          {/* Contact Info */}
          <div>
            {/* Main CTA Card */}
            <div className="relative overflow-hidden rounded-3xl p-1 mb-8">
              <div className="absolute inset-0 gold-bg" />
              <div className="relative bg-card rounded-[1.4rem] p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl emerald-gradient flex items-center justify-center shadow-soft">
                    <Phone className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      അഡ്മിഷൻ ഹെൽപ്‌ലൈൻ
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      ഇപ്പോൾ വിളിക്കൂ
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <a 
                    href={`tel:${content.phone1?.replace(/\s/g, '')}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full gold-bg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-lg text-foreground">{content.phone1}</span>
                  </a>
                  <a 
                    href={`tel:${content.phone2?.replace(/\s/g, '')}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full gold-bg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-lg text-foreground">{content.phone2}</span>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Additional Contact Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-display font-semibold text-foreground mb-1">ഇമെയിൽ</h4>
                <p className="text-muted-foreground text-sm">{content.email}</p>
              </div>
              
              <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-display font-semibold text-foreground mb-1">സമയം</h4>
                <p className="text-muted-foreground text-sm">{content.timing}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
