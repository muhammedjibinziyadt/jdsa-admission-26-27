import { useState, useEffect } from 'react';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';

interface SplashScreenProps {
  onEnter: () => void;
}

// Floating Book Icon Component
const FloatingBook = ({ className = "", delay = 0 }: { className?: string; delay?: number }) => (
  <svg 
    viewBox="0 0 64 64" 
    className={`absolute opacity-20 ${className}`}
    style={{ 
      animation: `floatBook 8s ease-in-out infinite`,
      animationDelay: `${delay}s`
    }}
  >
    <path 
      d="M8 12v40c0 2 2 4 4 4h40c2 0 4-2 4-4V12c0-2-2-4-4-4H12c-2 0-4 2-4 4z" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className="text-emerald-600"
    />
    <path 
      d="M32 8v48M16 20h12M16 28h12M16 36h12M36 20h12M36 28h12M36 36h12" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round"
      className="text-emerald-500"
    />
  </svg>
);

// Animated Pencil Component
const AnimatedPencil = ({ className = "" }: { className?: string }) => (
  <svg 
    viewBox="0 0 64 64" 
    className={`absolute opacity-15 ${className}`}
    style={{ animation: 'pencilDraw 12s ease-in-out infinite' }}
  >
    <path 
      d="M48 8L56 16L20 52L8 56L12 44L48 8Z" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-emerald-600"
    />
    <path 
      d="M44 12L52 20" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className="text-emerald-500"
    />
  </svg>
);

// Graduation Cap Component
const GraduationCap = ({ className = "" }: { className?: string }) => (
  <svg 
    viewBox="0 0 64 64" 
    className={`absolute opacity-15 ${className}`}
    style={{ animation: 'capFloat 10s ease-in-out infinite' }}
  >
    <path 
      d="M32 8L4 22L32 36L60 22L32 8Z" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className="text-emerald-600"
    />
    <path 
      d="M16 28v16c0 6 7 12 16 12s16-6 16-12V28" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className="text-emerald-500"
    />
    <path 
      d="M52 24v20M52 44l4 8h-8l4-8" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round"
      className="text-emerald-400"
    />
  </svg>
);

// Knowledge Sparkles Component
const KnowledgeSparkles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-emerald-400/30"
        style={{
          left: `${15 + i * 15}%`,
          top: `${20 + (i % 3) * 25}%`,
          animation: `sparkle 4s ease-in-out infinite`,
          animationDelay: `${i * 0.8}s`
        }}
      />
    ))}
  </div>
);

// Notebook Lines Animation Component
const NotebookLines = ({ className = "" }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 60" 
    className={`absolute opacity-10 ${className}`}
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
        className="text-emerald-500"
        style={{
          animation: 'drawLine 3s ease-in-out infinite',
          animationDelay: `${i * 0.4}s`
        }}
      />
    ))}
  </svg>
);

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { content } = useWebsiteContent();

  useEffect(() => {
    // Small delay before showing animations
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(onEnter, 600);
  };

  // Get splash content from website content or use defaults
  const defaultSplash = {
    buttonText: 'Click to Open',
    buttonSubtitle: 'ഞങ്ങളുടെ വിദ്യാഭ്യാസ സ്ഥാപനം അറിയാൻ ടാപ് ചെയ്യുക',
    institutionName: 'ജൗഹറത്തുൽ ഉലൂം',
    institutionSubtitle: 'സുഫ്ഫ ദർസ്',
    tagline: 'വിശ്വാസവും വിജ്ഞാനവും കരുത്താക്കുന്ന വിദ്യാഭ്യാസം',
    enabled: true
  };
  
  const splashContent = { ...defaultSplash, ...content.splash };

  // If modal is disabled, don't show
  if (splashContent.enabled === false) {
    return null;
  }

  return (
    <>
      {/* CSS for educational animations */}
      <style>{`
        @keyframes floatBook {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-12px) rotate(2deg); }
          50% { transform: translateY(-8px) rotate(-1deg); }
          75% { transform: translateY(-15px) rotate(1deg); }
        }
        
        @keyframes pencilDraw {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(8px) translateY(-5px) rotate(-5deg); }
          50% { transform: translateX(4px) translateY(3px) rotate(3deg); }
          75% { transform: translateX(-4px) translateY(-8px) rotate(-3deg); }
        }
        
        @keyframes capFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.5); }
        }
        
        @keyframes drawLine {
          0% { stroke-dashoffset: 80; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -80; }
        }
        
        @keyframes cardEnter {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        @keyframes cardExit {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to { opacity: 0; transform: scale(0.9) translateY(-20px); }
        }
        
        @keyframes blobMove {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.05); }
          50% { transform: translate(-10px, 15px) scale(0.95); }
          75% { transform: translate(15px, 10px) scale(1.02); }
        }
      `}</style>

      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
          isExiting ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Background with blur effect on website behind */}
        <div 
          className={`absolute inset-0 transition-all duration-600 ${
            isExiting ? 'backdrop-blur-none' : 'backdrop-blur-md'
          }`}
          style={{ backgroundColor: 'hsla(145, 40%, 20%, 0.85)' }}
        />

        {/* Animated green blob decorations */}
        <div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-40"
          style={{ 
            background: 'radial-gradient(circle, hsla(145, 60%, 45%, 0.6) 0%, transparent 70%)',
            animation: 'blobMove 15s ease-in-out infinite',
            filter: 'blur(40px)'
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-30"
          style={{ 
            background: 'radial-gradient(circle, hsla(150, 50%, 50%, 0.5) 0%, transparent 70%)',
            animation: 'blobMove 18s ease-in-out infinite reverse',
            filter: 'blur(50px)'
          }}
        />
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-25"
          style={{ 
            background: 'radial-gradient(circle, hsla(140, 55%, 55%, 0.4) 0%, transparent 70%)',
            animation: 'blobMove 12s ease-in-out infinite',
            animationDelay: '-5s',
            filter: 'blur(35px)'
          }}
        />

        {/* Educational decorative elements - visible after load */}
        {isLoaded && !isExiting && (
          <>
            <FloatingBook className="w-20 h-20 top-[15%] left-[10%] text-white/30" delay={0} />
            <FloatingBook className="w-16 h-16 bottom-[20%] right-[8%] text-white/25" delay={2} />
            <AnimatedPencil className="w-14 h-14 top-[25%] right-[15%] text-white/20" />
            <GraduationCap className="w-24 h-24 bottom-[15%] left-[12%] text-white/20" />
            <NotebookLines className="w-32 h-20 top-[60%] right-[5%] text-white/15" />
            <KnowledgeSparkles />
          </>
        )}

        {/* Main Modal Card */}
        <div 
          className={`relative z-10 mx-4 w-full max-w-md`}
          style={{
            animation: isExiting 
              ? 'cardExit 0.5s ease-in forwards' 
              : isLoaded ? 'cardEnter 0.6s ease-out forwards' : 'none',
            opacity: isLoaded ? 1 : 0
          }}
        >
          {/* Card with clean white design */}
          <div 
            className="relative overflow-hidden bg-white rounded-3xl"
            style={{
              boxShadow: '0 25px 80px -12px hsla(145, 60%, 15%, 0.5), 0 10px 30px -5px hsla(145, 40%, 20%, 0.3)'
            }}
          >
            {/* Green decorative header with flowing shapes */}
            <div 
              className="relative h-32 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, hsl(145, 55%, 40%) 0%, hsl(150, 50%, 35%) 50%, hsl(145, 60%, 45%) 100%)'
              }}
            >
              {/* Flowing circular shapes in header */}
              <div 
                className="absolute -top-20 -right-20 w-56 h-56 rounded-full opacity-40"
                style={{ 
                  background: 'radial-gradient(circle, hsla(145, 60%, 55%, 0.8) 0%, transparent 70%)',
                  animation: 'blobMove 10s ease-in-out infinite'
                }}
              />
              <div 
                className="absolute -top-10 right-20 w-40 h-40 rounded-full opacity-50"
                style={{ 
                  background: 'radial-gradient(circle, hsla(150, 55%, 50%, 0.7) 0%, transparent 70%)',
                  animation: 'blobMove 12s ease-in-out infinite reverse'
                }}
              />
              <div 
                className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-30"
                style={{ 
                  background: 'radial-gradient(circle, hsla(140, 60%, 60%, 0.6) 0%, transparent 70%)',
                  animation: 'blobMove 8s ease-in-out infinite',
                  animationDelay: '-3s'
                }}
              />
              
              {/* Book icon in header */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white"
                  style={{
                    boxShadow: '0 8px 25px -5px hsla(145, 50%, 30%, 0.4)'
                  }}
                >
                  <svg viewBox="0 0 32 32" className="w-8 h-8" style={{ color: 'hsl(145, 55%, 40%)' }}>
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
            <div className="pt-12 pb-8 px-8">
              {/* Institution name */}
              <h1 
                className="text-2xl md:text-3xl font-bold text-center mb-1"
                style={{ color: 'hsl(145, 30%, 25%)', fontFamily: "'Playfair Display', serif" }}
              >
                {splashContent.institutionName}
              </h1>
              <h2 
                className="text-lg md:text-xl text-center mb-2"
                style={{ color: 'hsl(145, 40%, 35%)' }}
              >
                {splashContent.institutionSubtitle}
              </h2>

              {/* Subtitle/Description */}
              {splashContent.buttonSubtitle && (
                <p 
                  className="text-center text-sm mb-8 leading-relaxed"
                  style={{ color: 'hsl(0, 0%, 50%)' }}
                >
                  {splashContent.buttonSubtitle}
                </p>
              )}

              {/* Professional Green Button */}
              <button
                onClick={handleEnter}
                className="group relative w-full overflow-hidden rounded-xl transition-all duration-300 active:scale-[0.98]"
              >
                {/* Button base */}
                <div 
                  className="relative py-4 px-6 transition-all duration-300 group-hover:brightness-110"
                  style={{
                    background: 'linear-gradient(180deg, hsl(145, 55%, 45%) 0%, hsl(145, 55%, 40%) 100%)',
                    boxShadow: '0 4px 15px -3px hsla(145, 55%, 35%, 0.5), inset 0 1px 0 hsla(0, 0%, 100%, 0.2)'
                  }}
                >
                  {/* Inner highlight */}
                  <div 
                    className="absolute inset-x-4 top-1 h-1/4 rounded-full opacity-30"
                    style={{ background: 'linear-gradient(180deg, white, transparent)' }}
                  />
                  
                  {/* Button text */}
                  <span className="relative flex items-center justify-center gap-3 text-white font-semibold text-lg tracking-wide">
                    {splashContent.buttonText || 'Click to Open'}
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
                
                {/* Hover glow */}
                <div 
                  className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                  style={{ 
                    background: 'hsla(145, 55%, 45%, 0.4)',
                    filter: 'blur(12px)'
                  }}
                />
              </button>

              {/* Contact info */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a 
                  href="tel:+919544124059" 
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200 hover:bg-gray-100"
                  style={{ 
                    backgroundColor: 'hsl(145, 30%, 96%)',
                    color: 'hsl(145, 40%, 35%)'
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm font-medium">+91 95441 24059</span>
                </a>
                <a 
                  href="tel:+918281102606" 
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200 hover:bg-gray-100"
                  style={{ 
                    backgroundColor: 'hsl(145, 30%, 96%)',
                    color: 'hsl(145, 40%, 35%)'
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm font-medium">+91 82811 02606</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
