import { useState, useEffect } from 'react';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';
import { CelebrationAnimation } from './CelebrationAnimation';

interface SplashScreenProps {
  onEnter: () => void;
}

// Floating Book Icon Component with elegant animation
const FloatingBook = ({ className = "", delay = 0 }: { className?: string; delay?: number }) => (
  <svg 
    viewBox="0 0 64 64" 
    className={`absolute ${className}`}
    style={{ 
      animation: `floatBook 8s ease-in-out infinite`,
      animationDelay: `${delay}s`
    }}
  >
    <path 
      d="M8 12v40c0 2 2 4 4 4h40c2 0 4-2 4-4V12c0-2-2-4-4-4H12c-2 0-4 2-4 4z" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
    <path 
      d="M32 8v48M16 20h12M16 28h12M16 36h12M36 20h12M36 28h12M36 36h12" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Animated Pencil Component
const AnimatedPencil = ({ className = "" }: { className?: string }) => (
  <svg 
    viewBox="0 0 64 64" 
    className={`absolute ${className}`}
    style={{ animation: 'pencilDraw 12s ease-in-out infinite' }}
  >
    <path 
      d="M48 8L56 16L20 52L8 56L12 44L48 8Z" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path 
      d="M44 12L52 20" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
  </svg>
);

// Graduation Cap Component
const GraduationCap = ({ className = "" }: { className?: string }) => (
  <svg 
    viewBox="0 0 64 64" 
    className={`absolute ${className}`}
    style={{ animation: 'capFloat 10s ease-in-out infinite' }}
  >
    <path 
      d="M32 8L4 22L32 36L60 22L32 8Z" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
    <path 
      d="M16 28v16c0 6 7 12 16 12s16-6 16-12V28" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
    <path 
      d="M52 24v20M52 44l4 8h-8l4-8" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Notebook Lines Animation Component
const NotebookLines = ({ className = "" }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 60" 
    className={`absolute ${className}`}
    style={{ animation: 'linesDraw 8s ease-in-out infinite' }}
  >
    {[0, 1, 2, 3].map((i) => (
      <line
        key={i}
        x1="10"
        y1={15 + i * 12}
        x2="90"
        y2={15 + i * 12}
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="80"
        strokeDashoffset="0"
        style={{
          animation: 'drawLine 3s ease-in-out infinite',
          animationDelay: `${i * 0.4}s`
        }}
      />
    ))}
  </svg>
);

// Knowledge Sparkles Component - Updated to teal/gold theme
const KnowledgeSparkles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1.5 h-1.5 rounded-full"
        style={{
          left: `${10 + i * 12}%`,
          top: `${15 + (i % 4) * 20}%`,
          background: i % 2 === 0 ? 'hsla(187, 65%, 50%, 0.5)' : 'hsla(43, 75%, 55%, 0.4)',
          animation: `sparkle 4s ease-in-out infinite`,
          animationDelay: `${i * 0.6}s`
        }}
      />
    ))}
  </div>
);

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { content } = useWebsiteContent();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Play welcome voice announcement
  const playWelcomeVoice = async (audioUrl: string) => {
    try {
      const audio = new Audio(audioUrl);
      audio.volume = 0.8;
      await audio.play();
    } catch (error) {
      // If audio fails, silently continue - website should still open
      console.log('Voice announcement failed to play:', error);
    }
  };

  const handleEnter = () => {
    // Play voice announcement if enabled and audio URL exists
    const voiceEnabled = splashContent.voiceEnabled !== false;
    const voiceAudioUrl = splashContent.voiceAudioUrl;
    
    if (voiceEnabled && voiceAudioUrl) {
      playWelcomeVoice(voiceAudioUrl);
    }
    
    // Trigger celebration animation
    setShowCelebration(true);
    
    // Start exit after a short delay to show celebration
    setTimeout(() => {
      setIsExiting(true);
    }, 800);
    
    // Complete exit after celebration
    setTimeout(onEnter, 2500);
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
  };

  // Get splash content with defaults
  const defaultSplash = {
    buttonText: 'Click to Open',
    buttonSubtitle: 'ഞങ്ങളുടെ വിദ്യാഭ്യാസ സ്ഥാപനം അറിയാൻ ടാപ് ചെയ്യുക',
    institutionName: 'ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസ്',
    institutionSubtitle: '',
    tagline: 'വിശ്വാസവും വിജ്ഞാനവും കരുത്താക്കുന്ന വിദ്യാഭ്യാസം',
    admissionStatus: 'അഡ്മിഷൻ ആരംഭിച്ചു',
    enabled: true,
    celebrationEnabled: true,
    celebrationDuration: 3,
    celebrationIntensity: 'light' as 'light' | 'medium',
    voiceEnabled: true,
    voiceAudioUrl: '',
    voiceText: 'ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസിലേക്ക് സ്വാഗതം'
  };
  
  const splashContent = { ...defaultSplash, ...content.splash };

  if (splashContent.enabled === false) {
    return null;
  }
  return (
    <>
      {/* Celebration Animation */}
      {splashContent.celebrationEnabled !== false && (
        <CelebrationAnimation
          isActive={showCelebration}
          duration={splashContent.celebrationDuration || 3}
          intensity={(splashContent.celebrationIntensity as 'light' | 'medium') || 'light'}
          onComplete={handleCelebrationComplete}
        />
      )}
      
      <style>{`
        @keyframes floatBook {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(2deg); }
          50% { transform: translateY(-8px) rotate(-1deg); }
          75% { transform: translateY(-18px) rotate(1deg); }
        }
        
        @keyframes pencilDraw {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(10px) translateY(-6px) rotate(-5deg); }
          50% { transform: translateX(5px) translateY(4px) rotate(3deg); }
          75% { transform: translateX(-5px) translateY(-10px) rotate(-3deg); }
        }
        
        @keyframes capFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.8); }
        }
        
        @keyframes drawLine {
          0% { stroke-dashoffset: 80; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -80; }
        }
        
        @keyframes cardEnter {
          from { opacity: 0; transform: scale(0.92) translateY(30px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        @keyframes cardExit {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to { opacity: 0; transform: scale(0.88) translateY(-30px); }
        }
        
        @keyframes blobMove {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(25px, -25px) scale(1.08); }
          50% { transform: translate(-12px, 18px) scale(0.92); }
          75% { transform: translate(18px, 12px) scale(1.04); }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px hsla(187, 65%, 45%, 0.3), 0 4px 15px hsla(210, 55%, 15%, 0.4); }
          50% { box-shadow: 0 0 35px hsla(187, 65%, 45%, 0.5), 0 4px 20px hsla(210, 55%, 15%, 0.5); }
        }

        @keyframes badge-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
          isExiting ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Deep navy blue gradient background */}
        <div 
          className={`absolute inset-0 transition-all duration-600 ${
            isExiting ? 'backdrop-blur-none' : 'backdrop-blur-md'
          }`}
          style={{ 
            background: 'linear-gradient(135deg, hsl(210, 60%, 8%) 0%, hsl(210, 55%, 14%) 50%, hsl(210, 50%, 12%) 100%)'
          }}
        />

        {/* Animated teal & gold blob decorations */}
        <div 
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{ 
            background: 'radial-gradient(circle, hsla(187, 65%, 45%, 0.2) 0%, transparent 70%)',
            animation: 'blobMove 18s ease-in-out infinite',
            filter: 'blur(60px)'
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
          style={{ 
            background: 'radial-gradient(circle, hsla(43, 75%, 50%, 0.15) 0%, transparent 70%)',
            animation: 'blobMove 22s ease-in-out infinite reverse',
            filter: 'blur(70px)'
          }}
        />
        <div 
          className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full"
          style={{ 
            background: 'radial-gradient(circle, hsla(187, 55%, 50%, 0.12) 0%, transparent 70%)',
            animation: 'blobMove 15s ease-in-out infinite',
            animationDelay: '-7s',
            filter: 'blur(50px)'
          }}
        />

        {/* Educational decorative elements */}
        {isLoaded && !isExiting && (
          <>
            <FloatingBook className="w-16 h-16 top-[12%] left-[8%] text-teal-light/25" delay={0} />
            <FloatingBook className="w-12 h-12 bottom-[18%] right-[6%] text-gold-light/20" delay={2.5} />
            <AnimatedPencil className="w-12 h-12 top-[22%] right-[12%] text-teal-light/20" />
            <GraduationCap className="w-20 h-20 bottom-[12%] left-[10%] text-gold-light/15" />
            <NotebookLines className="w-28 h-16 top-[55%] right-[4%] text-teal-light/15" />
            <KnowledgeSparkles />
          </>
        )}

        {/* Main Modal Card */}
        <div 
          className="relative z-10 mx-4 w-full max-w-md"
          style={{
            animation: isExiting 
              ? 'cardExit 0.5s ease-in forwards' 
              : isLoaded ? 'cardEnter 0.7s ease-out forwards' : 'none',
            opacity: isLoaded ? 1 : 0
          }}
        >
          {/* Card with glassmorphism effect */}
          <div 
            className="relative overflow-hidden rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, hsla(210, 50%, 18%, 0.95) 0%, hsla(210, 55%, 14%, 0.98) 100%)',
              boxShadow: '0 30px 100px -15px hsla(210, 60%, 5%, 0.7), 0 15px 40px -10px hsla(210, 50%, 10%, 0.5)',
              border: '1px solid hsla(187, 50%, 40%, 0.2)'
            }}
          >
            {/* Teal gradient header with decorative elements */}
            <div 
              className="relative h-36 overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, hsl(187, 60%, 38%) 0%, hsl(187, 55%, 32%) 50%, hsl(210, 50%, 25%) 100%)'
              }}
            >
              {/* Decorative circles */}
              <div 
                className="absolute -top-24 -right-24 w-64 h-64 rounded-full"
                style={{ 
                  background: 'radial-gradient(circle, hsla(187, 65%, 55%, 0.35) 0%, transparent 70%)',
                  animation: 'blobMove 12s ease-in-out infinite'
                }}
              />
              <div 
                className="absolute -top-12 right-16 w-44 h-44 rounded-full"
                style={{ 
                  background: 'radial-gradient(circle, hsla(43, 75%, 55%, 0.25) 0%, transparent 70%)',
                  animation: 'blobMove 15s ease-in-out infinite reverse'
                }}
              />
              <div 
                className="absolute top-8 left-8 w-36 h-36 rounded-full"
                style={{ 
                  background: 'radial-gradient(circle, hsla(187, 55%, 60%, 0.2) 0%, transparent 70%)',
                  animation: 'blobMove 10s ease-in-out infinite',
                  animationDelay: '-4s'
                }}
              />
              
              {/* Centered book icon */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(145deg, hsl(210, 50%, 16%), hsl(210, 55%, 12%))',
                    boxShadow: '0 10px 30px -8px hsla(210, 50%, 5%, 0.6), 0 0 20px hsla(187, 65%, 45%, 0.2)',
                    border: '1px solid hsla(187, 50%, 40%, 0.3)'
                  }}
                >
                  <svg viewBox="0 0 32 32" className="w-10 h-10" style={{ color: 'hsl(187, 65%, 50%)' }}>
                    <path 
                      d="M4 6v20c0 1 1 2 2 2h20c1 0 2-1 2-2V6c0-1-1-2-2-2H6c-1 0-2 1-2 2z" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5"
                    />
                    <path 
                      d="M16 4v24M8 10h6M8 14h6M8 18h6M18 10h6M18 14h6M18 18h6" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Card content */}
            <div className="pt-14 pb-8 px-8">
              {/* Admission status badge */}
              {splashContent.admissionStatus && (
                <div className="flex justify-center mb-4">
                  <span 
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
                    style={{ 
                      background: 'linear-gradient(135deg, hsl(43, 75%, 50%) 0%, hsl(45, 80%, 55%) 100%)',
                      color: 'hsl(210, 60%, 10%)',
                      animation: 'badge-pulse 3s ease-in-out infinite',
                      boxShadow: '0 4px 15px hsla(43, 75%, 50%, 0.3)'
                    }}
                  >
                    <span 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ background: 'hsl(210, 60%, 15%)' }}
                    ></span>
                    {splashContent.admissionStatus}
                  </span>
                </div>
              )}

              {/* Institution name */}
              <h1 
                className="text-2xl md:text-3xl font-bold text-center mb-2 leading-tight"
                style={{ color: 'hsl(210, 20%, 95%)' }}
              >
                {splashContent.institutionName}
              </h1>
              
              {splashContent.institutionSubtitle && (
                <h2 
                  className="text-lg md:text-xl text-center mb-2"
                  style={{ color: 'hsl(187, 60%, 55%)' }}
                >
                  {splashContent.institutionSubtitle}
                </h2>
              )}

              {/* Tagline */}
              {splashContent.tagline && (
                <p 
                  className="text-center text-sm mb-8 leading-relaxed"
                  style={{ color: 'hsl(210, 15%, 70%)' }}
                >
                  {splashContent.tagline}
                </p>
              )}

              {/* Premium Teal Button with glow */}
              <button
                onClick={handleEnter}
                className="group relative w-full overflow-hidden rounded-xl transition-all duration-300 active:scale-[0.97]"
                style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}
              >
                <div 
                  className="relative py-4 px-6 transition-all duration-300 group-hover:brightness-110"
                  style={{
                    background: 'linear-gradient(180deg, hsl(187, 60%, 45%) 0%, hsl(187, 65%, 38%) 100%)',
                    boxShadow: 'inset 0 1px 0 hsla(0, 0%, 100%, 0.2), inset 0 -1px 0 hsla(187, 70%, 25%, 0.3)'
                  }}
                >
                  {/* Inner highlight */}
                  <div 
                    className="absolute inset-x-4 top-1 h-1/4 rounded-full opacity-30"
                    style={{ background: 'linear-gradient(180deg, white, transparent)' }}
                  />
                  
                  {/* Button text */}
                  <span className="relative flex items-center justify-center gap-3 text-white font-semibold text-lg tracking-wide">
                    {splashContent.buttonText}
                    <svg 
                      className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </button>

              {/* Contact info */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a 
                  href="tel:+919544124059" 
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200 hover:scale-105"
                  style={{ 
                    backgroundColor: 'hsla(187, 50%, 35%, 0.2)',
                    color: 'hsl(187, 55%, 60%)',
                    border: '1px solid hsla(187, 50%, 40%, 0.3)'
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm font-medium">+91 95441 24059</span>
                </a>
                <a 
                  href="tel:+918281102606" 
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200 hover:scale-105"
                  style={{ 
                    backgroundColor: 'hsla(187, 50%, 35%, 0.2)',
                    color: 'hsl(187, 55%, 60%)',
                    border: '1px solid hsla(187, 50%, 40%, 0.3)'
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm font-medium">+91 82811 02606</span>
                </a>
              </div>

              {/* Subtitle text */}
              {splashContent.buttonSubtitle && (
                <p 
                  className="text-center text-xs mt-4"
                  style={{ color: 'hsl(210, 15%, 55%)' }}
                >
                  {splashContent.buttonSubtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
