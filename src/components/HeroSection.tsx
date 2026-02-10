import { Phone, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroContent {
  title: string;
  subtitle: string;
  phone1: string;
  phone2: string;
  ctaText: string;
  backgroundImage?: string;
}

interface HeroSectionProps {
  content: HeroContent;
}

const HeroSection = ({ content }: HeroSectionProps) => {
  return (
    <section id="home" className="relative h-[25vh] md:h-[250px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${content.backgroundImage || heroBg})` }}
      />
      
      {/* Simple Overlay */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Admission Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm mb-8 animate-fade-up">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-gold-light font-medium tracking-wide text-sm">
            {content.ctaText || 'Admissions Open 2025-26'}
          </span>
        </div>
        
        {/* Main Heading */}
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-fade-up animation-delay-200 leading-tight">
          <span className="block mb-2">{content.title || 'ജവ്ഹറത്തുൽ ഉലൂം'}</span>
          <span className="gold-text">{content.subtitle || 'സുഫ്ഫാ ദർസ്'}</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8 animate-fade-up animation-delay-400 font-light leading-relaxed">
          വിജ്ഞാനത്തിന്റെയും മൂല്യങ്ങളുടെയും സമന്വയത്തിലൂടെ 
          <br className="hidden md:block" />
          പുതിയ തലമുറയെ രൂപപ്പെടുത്തുന്ന വിദ്യാഭ്യാസ കേന്ദ്രം
        </p>
        
        {/* Contact Numbers */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-fade-up animation-delay-600">
          <a 
            href={`tel:${content.phone1?.replace(/\s/g, '')}`} 
            className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/15 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg gold-bg flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <span className="text-primary-foreground font-semibold">{content.phone1}</span>
          </a>
          
          <a 
            href={`tel:${content.phone2?.replace(/\s/g, '')}`} 
            className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/15 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg gold-bg flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <span className="text-primary-foreground font-semibold">{content.phone2}</span>
          </a>
        </div>
        
        {/* CTA Button */}
        <div className="animate-fade-up animation-delay-800">
          <Button 
            size="lg" 
            className="gold-bg text-primary font-semibold px-10 py-6 text-lg rounded-xl shadow-gold hover:opacity-90 transition-opacity"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            കൂടുതൽ അറിയാൻ
            <ArrowDown className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-gold" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;