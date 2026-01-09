import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Star, GraduationCap } from 'lucide-react';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';

interface SplashScreenProps {
  onEnter: () => void;
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const { content } = useWebsiteContent();

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(onEnter, 600);
  };

  // Get splash content from website content or use defaults
  const splashContent = content.splash || {
    buttonText: 'Click to Open',
    institutionName: 'ജൗഹറത്തുൽ ഉലൂം',
    institutionSubtitle: 'സുഫ്ഫ ദർസ്',
    tagline: 'വിശ്വാസവും വിജ്ഞാനവും കരുത്താക്കുന്ന വിദ്യാഭ്യാസം'
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-600 ${
        isExiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, hsl(158 64% 15%) 0%, hsl(158 50% 25%) 50%, hsl(38 78% 35%) 100%)'
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="flowing-shape flowing-shape-1 w-96 h-96 -top-20 -left-20 animate-float" />
        <div className="flowing-shape flowing-shape-2 w-80 h-80 top-1/4 right-10 animate-float animation-delay-400" />
        <div className="flowing-shape flowing-shape-1 w-64 h-64 bottom-10 left-1/4 animate-float animation-delay-800" />
        
        {/* Islamic pattern overlay */}
        <div className="absolute inset-0 islamic-pattern opacity-10" />
      </div>

      <div className="relative text-center px-6 max-w-2xl mx-auto">
        {/* Logo/Icon */}
        <div className="mb-8 animate-fade-up">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-secondary/20 animate-glow" />
            <div className="relative w-28 h-28 rounded-full gold-bg flex items-center justify-center shadow-xl">
              <BookOpen className="w-14 h-14 text-primary" />
            </div>
            
            {/* Orbiting icons */}
            <div className="absolute w-44 h-44 animate-spin" style={{ animationDuration: '20s' }}>
              <Star className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-secondary" />
              <GraduationCap className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 text-secondary" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 animate-fade-up animation-delay-200">
          <span className="gold-text">{splashContent.institutionName}</span>
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-primary-foreground/90 mb-6 animate-fade-up animation-delay-400">
          {splashContent.institutionSubtitle}
        </h2>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 animate-fade-up animation-delay-600 leading-relaxed">
          {splashContent.tagline}
        </p>

        {/* Enter Button */}
        <div className="animate-fade-up animation-delay-800">
          <Button
            onClick={handleEnter}
            size="lg"
            className="gold-bg text-primary font-semibold text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-glow"
          >
            <span className="mr-2">🚪</span>
            {splashContent.buttonText}
          </Button>
        </div>

        {/* Contact numbers */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 text-primary-foreground/70 animate-fade-up animation-delay-800">
          <a href="tel:+919544124059" className="hover:text-secondary transition-colors">
            📞 +91 95441 24059
          </a>
          <span className="hidden md:inline">•</span>
          <a href="tel:+918281102606" className="hover:text-secondary transition-colors">
            📞 +91 82811 02606
          </a>
        </div>
      </div>
    </div>
  );
}
