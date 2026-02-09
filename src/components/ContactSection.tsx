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
    <section id="contact" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold-dark text-sm font-medium mb-4">
            ബന്ധപ്പെടുക
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            അഡ്മിഷൻ 
            <span className="gold-text"> എടുക്കാം</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            നിങ്ങളുടെ കുട്ടിയുടെ ഭാവി രൂപപ്പെടുത്താൻ ഇന്നുതന്നെ ഞങ്ങളെ ബന്ധപ്പെടുക
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          {/* Main CTA Card */}
          <div className="bg-card rounded-xl p-8 shadow-soft border border-border mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl emerald-gradient flex items-center justify-center">
                <Phone className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  അഡ്മിഷൻ ഹെൽപ്‌ലൈൻ
                </h3>
                <p className="text-muted-foreground text-sm">ഇപ്പോൾ വിളിക്കൂ</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <a 
                href={`tel:${content.phone1?.replace(/\s/g, '')}`}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-10 h-10 rounded-lg gold-bg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold text-lg text-foreground">{content.phone1}</span>
              </a>
              <a 
                href={`tel:${content.phone2?.replace(/\s/g, '')}`}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-10 h-10 rounded-lg gold-bg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold text-lg text-foreground">{content.phone2}</span>
              </a>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl p-6 shadow-soft">
              <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-display font-semibold text-foreground mb-1">ഇമെയിൽ</h4>
              <p className="text-muted-foreground text-sm">{content.email}</p>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-soft">
              <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-display font-semibold text-foreground mb-1">സമയം</h4>
              <p className="text-muted-foreground text-sm">{content.timing}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;