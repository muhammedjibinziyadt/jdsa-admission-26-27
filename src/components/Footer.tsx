import { Phone, Mail, Heart, MessageCircle, BookOpen } from "lucide-react";
import { ScrollAnimate } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/hooks/useLanguage";

interface FooterContent { copyright: string; tagline: string; }
interface ContactInfo { phone1: string; phone2: string; email: string; }
interface SocialLinks { whatsapp?: string; facebook?: string; youtube?: string; instagram?: string; }
interface FooterProps { content: FooterContent; contact: ContactInfo; social?: SocialLinks; }

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

const Footer = ({ content, contact, social }: FooterProps) => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "WhatsApp", url: social?.whatsapp ? `https://wa.me/${social.whatsapp}` : null, Icon: MessageCircle, color: "bg-green-500 hover:bg-green-600", show: !!social?.whatsapp },
    { name: "Facebook", url: social?.facebook, Icon: FacebookIcon, color: "bg-blue-600 hover:bg-blue-700", show: !!social?.facebook },
    { name: "YouTube", url: social?.youtube, Icon: YoutubeIcon, color: "bg-red-600 hover:bg-red-700", show: !!social?.youtube },
    { name: "Instagram", url: social?.instagram, Icon: InstagramIcon, color: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600", show: !!social?.instagram }
  ];

  const visibleLinks = socialLinks.filter(link => link.show);
  
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-14">
        <ScrollAnimate direction="up" threshold={0.1}>
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl gold-bg flex items-center justify-center">
                  <span className="text-primary font-display font-bold text-lg">ج</span>
                </div>
                <div>
                  <span className="font-display font-semibold text-xl block leading-tight">ജൗഹറത്തുൽ ഉലൂം</span>
                  <span className="text-primary-foreground/60 text-sm">സുഫ്ഫ ദർസ്</span>
                </div>
              </div>
              <p className="text-primary-foreground/60 leading-relaxed">
                {content.tagline || 'വിജ്ഞാനത്തിന്റെയും മൂല്യങ്ങളുടെയും സമന്വയത്തിലൂടെ പുതിയ തലമുറയെ രൂപപ്പെടുത്തുന്ന വിദ്യാഭ്യാസ കേന്ദ്രം'}
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-display font-semibold text-lg mb-5">{t('ദ്രുത ലിങ്കുകൾ', 'Quick Links')}</h4>
              <div className="space-y-2.5">
                {[
                  { href: "#home", label: t("ഹോം", "Home") },
                  { href: "#about", label: t("ഞങ്ങളെക്കുറിച്ച്", "About Us") },
                  { href: "#courses", label: t("കോഴ്‌സുകൾ", "Courses") },
                  { href: "#gallery", label: t("ഗാലറി", "Gallery") },
                  { href: "#contact", label: t("ബന്ധപ്പെടുക", "Contact") },
                ].map((link) => (
                  <a key={link.href} href={link.href} className="block text-primary-foreground/60 hover:text-gold-light transition-colors">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="font-display font-semibold text-lg mb-5">{t('ബന്ധപ്പെടുക', 'Contact')}</h4>
              <div className="space-y-3">
                <a href={`tel:${contact.phone1?.replace(/\s/g, '')}`} className="flex items-center gap-3 text-primary-foreground/60 hover:text-gold-light transition-colors">
                  <Phone className="w-4 h-4" /> {contact.phone1}
                </a>
                <a href={`tel:${contact.phone2?.replace(/\s/g, '')}`} className="flex items-center gap-3 text-primary-foreground/60 hover:text-gold-light transition-colors">
                  <Phone className="w-4 h-4" /> {contact.phone2}
                </a>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-primary-foreground/60 hover:text-gold-light transition-colors">
                  <Mail className="w-4 h-4" /> {contact.email}
                </a>
              </div>
            </div>
          </div>
        </ScrollAnimate>

        {/* Social */}
        {visibleLinks.length > 0 && (
          <div className="flex justify-center gap-3 mb-8">
            {visibleLinks.map((s) => (
              <a key={s.name} href={s.url || '#'} target="_blank" rel="noopener noreferrer"
                className={`${s.color} text-white p-2.5 rounded-full transition-opacity hover:opacity-90 flex items-center justify-center`}
                aria-label={s.name}>
                {s.name === "WhatsApp" ? <MessageCircle className="w-5 h-5" /> : <s.Icon />}
              </a>
            ))}
          </div>
        )}
        
        {/* Al Jawahir Magazine Box */}
        <ScrollAnimate direction="up" delay={100} threshold={0.1}>
          <div className="flex justify-center mb-10">
            <a
              href="https://aljawahirmagazinejdsa.rf.gd/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full max-w-lg bg-[#faf7f2] rounded-2xl p-8 text-center shadow-soft hover:shadow-elevated transition-shadow duration-300 group"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h4 className="font-display font-semibold text-lg text-primary mb-2">
                Explore Our Other Official Website
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                Read more exclusive articles, reflections, and magazine content from Al Jawahir.
              </p>
              <span className="inline-block px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium group-hover:opacity-90 transition-opacity">
                Visit Website
              </span>
            </a>
          </div>
        </ScrollAnimate>

        <div className="border-t border-primary-foreground/10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/50 text-sm">
              {content.copyright || `© ${currentYear} ജവ്ഹറത്തുൽ ഉലൂം സുഫ്ഫാ ദർസ്. എല്ലാ അവകാശങ്ങളും സംരക്ഷിതം.`}
            </p>
            <p className="text-primary-foreground/50 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-gold" fill="currentColor" /> for education
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
