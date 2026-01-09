import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Star, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';
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
    buttonText: 'Click to Open Website',
    buttonSubtitle: 'Tap to explore our institution',
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
        background: 'linear-gradient(135deg, hsl(158 64% 12%) 0%, hsl(158 50% 20%) 40%, hsl(38 78% 30%) 100%)'
      }}
    >
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating shapes */}
        <div className="absolute w-[600px] h-[600px] -top-40 -left-40 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl animate-float" />
        <div className="absolute w-[500px] h-[500px] top-1/3 -right-32 rounded-full bg-gradient-to-bl from-secondary/20 to-transparent blur-3xl animate-float animation-delay-400" />
        <div className="absolute w-[400px] h-[400px] -bottom-20 left-1/4 rounded-full bg-gradient-to-tr from-gold/20 to-transparent blur-3xl animate-float animation-delay-800" />
        
        {/* Islamic pattern overlay */}
        <div className="absolute inset-0 islamic-pattern opacity-5" />
        
        {/* Sparkle effects */}
        <div className="absolute top-20 left-20 animate-pulse">
          <Sparkles className="w-4 h-4 text-secondary/50" />
        </div>
        <div className="absolute top-40 right-32 animate-pulse animation-delay-400">
          <Sparkles className="w-3 h-3 text-secondary/40" />
        </div>
        <div className="absolute bottom-32 left-40 animate-pulse animation-delay-800">
          <Sparkles className="w-5 h-5 text-secondary/30" />
        </div>
      </div>

      <div className="relative text-center px-6 max-w-2xl mx-auto">
        {/* Logo/Icon with enhanced styling */}
        <div className="mb-10 animate-fade-up">
          <div className="relative inline-flex items-center justify-center">
            {/* Outer glow ring */}
            <div className="absolute w-40 h-40 rounded-full bg-gradient-to-r from-secondary/30 to-gold/30 animate-pulse blur-xl" />
            
            {/* Main logo container */}
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-gold via-secondary to-gold-dark flex items-center justify-center shadow-2xl border-4 border-white/10">
              <BookOpen className="w-16 h-16 text-primary drop-shadow-lg" />
            </div>
            
            {/* Orbiting icons */}
            <div className="absolute w-48 h-48 animate-spin" style={{ animationDuration: '25s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center shadow-lg">
                <Star className="w-4 h-4 text-secondary" />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-4 h-4 text-secondary" />
              </div>
            </div>
          </div>
        </div>

        {/* Title with enhanced typography */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-3 animate-fade-up animation-delay-200 tracking-tight">
          <span className="bg-gradient-to-r from-gold via-secondary to-gold-light bg-clip-text text-transparent drop-shadow-lg">
            {splashContent.institutionName}
          </span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-white/90 mb-6 animate-fade-up animation-delay-400">
          {splashContent.institutionSubtitle}
        </h2>

        {/* Tagline with decorative line */}
        <div className="animate-fade-up animation-delay-600 mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-secondary/50" />
            <Star className="w-4 h-4 text-secondary/70" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-secondary/50" />
          </div>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-lg mx-auto">
            {splashContent.tagline}
          </p>
        </div>

        {/* Professional Enter Button */}
        <div className="animate-fade-up animation-delay-800">
          <Button
            onClick={handleEnter}
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-gold via-secondary to-gold-dark text-primary font-bold text-lg md:text-xl px-12 py-7 rounded-2xl shadow-2xl hover:shadow-gold/30 transition-all duration-500 hover:scale-105 border-2 border-white/20"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <span className="relative flex items-center gap-3">
              {splashContent.buttonText || 'Click to Open Website'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
          
          {/* Button subtitle */}
          {splashContent.buttonSubtitle && (
            <p className="mt-4 text-sm text-white/50">
              {splashContent.buttonSubtitle}
            </p>
          )}
        </div>

        {/* Contact numbers with enhanced styling */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-up animation-delay-800">
          <a 
            href="tel:+919544124059" 
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300 backdrop-blur-sm border border-white/10"
          >
            <span className="text-lg">📞</span>
            <span>+91 95441 24059</span>
          </a>
          <a 
            href="tel:+918281102606" 
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300 backdrop-blur-sm border border-white/10"
          >
            <span className="text-lg">📞</span>
            <span>+91 82811 02606</span>
          </a>
        </div>
      </div>
    </div>
  );
}
