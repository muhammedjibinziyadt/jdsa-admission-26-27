import { Phone, Mail, Heart, MessageCircle } from "lucide-react";

interface FooterContent {
  copyright: string;
  tagline: string;
}

interface ContactInfo {
  phone1: string;
  phone2: string;
  email: string;
}

interface SocialLinks {
  whatsapp?: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
  whatsappEnabled?: boolean;
  facebookEnabled?: boolean;
  youtubeEnabled?: boolean;
  instagramEnabled?: boolean;
}

interface FooterProps {
  content: FooterContent;
  contact: ContactInfo;
  social?: SocialLinks;
}

// Custom icons for social platforms
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
  const currentYear = new Date().getFullYear();
  
  // Build social links array with visibility check
  const socialLinks = [
    {
      name: "WhatsApp",
      url: social?.whatsapp ? `https://wa.me/${social.whatsapp}` : '',
      Icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      show: !!social?.whatsapp && social?.whatsappEnabled !== false
    },
    {
      name: "Facebook",
      url: social?.facebook || '',
      Icon: FacebookIcon,
      color: "bg-blue-600 hover:bg-blue-700",
      show: !!social?.facebook && social?.facebookEnabled !== false
    },
    {
      name: "YouTube",
      url: social?.youtube || '',
      Icon: YoutubeIcon,
      color: "bg-red-600 hover:bg-red-700",
      show: !!social?.youtube && social?.youtubeEnabled !== false
    },
    {
      name: "Instagram",
      url: social?.instagram || '',
      Icon: InstagramIcon,
      color: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-700",
      show: !!social?.instagram && social?.instagramEnabled !== false
    }
  ];

  const visibleSocialLinks = socialLinks.filter(link => link.show);
  
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
        
        {/* Social Media Icons */}
        {visibleSocialLinks.length > 0 && (
          <div className="flex justify-center gap-4 mb-8">
            {visibleSocialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${social.color} text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center`}
                aria-label={social.name}
              >
                {social.name === "WhatsApp" ? (
                  <MessageCircle className="w-5 h-5" />
                ) : (
                  <social.Icon />
                )}
              </a>
            ))}
          </div>
        )}
        
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