import { Phone, Mail, Heart } from "lucide-react";

interface FooterContent {
  copyright: string;
  tagline: string;
}

interface ContactInfo {
  phone1: string;
  phone2: string;
  email: string;
}

interface FooterProps {
  content: FooterContent;
  contact: ContactInfo;
}

const Footer = ({ content, contact }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-primary text-primary-foreground">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 gold-bg" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-xl gold-bg flex items-center justify-center">
                <span className="text-primary font-display font-bold text-xl">ج</span>
              </div>
              <div>
              <span className="font-display font-semibold text-xl block leading-tight">
                  ജൗഹറത്തുൽ ഉലൂം
                </span>
                <span className="text-primary-foreground/70 text-sm">
                  സുഫ്ഫ ദർസ്
                </span>
              </div>
            </div>
            <p className="text-primary-foreground/70 leading-relaxed">
              {content.tagline || 'വിജ്ഞാനത്തിന്റെയും മൂല്യങ്ങളുടെയും സമന്വയത്തിലൂടെ പുതിയ തലമുറയെ രൂപപ്പെടുത്തുന്ന വിദ്യാഭ്യാസ കേന്ദ്രം'}
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">ദ്രുത ലിങ്കുകൾ</h4>
            <div className="space-y-3">
              {[
                { href: "#home", label: "ഹോം" },
                { href: "#about", label: "ഞങ്ങളെക്കുറിച്ച്" },
                { href: "#courses", label: "കോഴ്‌സുകൾ" },
                { href: "#gallery", label: "ഗാലറി" },
                { href: "#contact", label: "ബന്ധപ്പെടുക" },
              ].map((link) => (
                <a 
                  key={link.href}
                  href={link.href}
                  className="block text-primary-foreground/70 hover:text-gold-light transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">ബന്ധപ്പെടുക</h4>
            <div className="space-y-4">
              <a 
                href={`tel:${contact.phone1?.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-gold-light transition-colors"
              >
                <Phone className="w-5 h-5" />
                {contact.phone1}
              </a>
              <a 
                href={`tel:${contact.phone2?.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-gold-light transition-colors"
              >
                <Phone className="w-5 h-5" />
                {contact.phone2}
              </a>
              <a 
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-gold-light transition-colors"
              >
                <Mail className="w-5 h-5" />
                {contact.email}
              </a>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/60 text-sm text-center md:text-left">
              {content.copyright || `© ${currentYear} ജവ്ഹറത്തുൽ ഉലൂം സുഫ്ഫാ ദർസ്. എല്ലാ അവകാശങ്ങളും സംരക്ഷിതം.`}
            </p>
            <p className="text-primary-foreground/60 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-gold" fill="currentColor" /> for education
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
