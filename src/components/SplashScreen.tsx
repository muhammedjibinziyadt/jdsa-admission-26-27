import { useState, useEffect } from 'react';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';

interface SplashScreenProps {
  onEnter: () => void;
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { content } = useWebsiteContent();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(onEnter, 500);
  };

  const defaultSplash = {
    buttonText: 'Click to Open',
    buttonSubtitle: 'ഞങ്ങളുടെ വിദ്യാഭ്യാസ സ്ഥാപനം അറിയാൻ ടാപ് ചെയ്യുക',
    institutionName: 'ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസ്',
    institutionSubtitle: '',
    tagline: 'വിശ്വാസവും വിജ്ഞാനവും കരുത്താക്കുന്ന വിദ്യാഭ്യാസം',
    admissionStatus: 'അഡ്മിഷൻ ആരംഭിച്ചു',
    enabled: true
  };
  
  const splashContent = { ...defaultSplash, ...content.splash };

  if (splashContent.enabled === false) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ 
        background: 'linear-gradient(160deg, hsl(158, 45%, 18%) 0%, hsl(158, 40%, 24%) 100%)'
      }}
    >
      {/* Main Card */}
      <div 
        className={`relative z-10 mx-4 w-full max-w-md transition-all duration-500 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } ${isExiting ? 'opacity-0 -translate-y-4' : ''}`}
      >
        <div 
          className="relative overflow-hidden rounded-2xl bg-white"
          style={{ boxShadow: '0 20px 60px -15px hsla(158, 60%, 10%, 0.4)' }}
        >
          {/* Green header */}
          <div 
            className="relative h-28 flex items-end justify-center pb-0"
            style={{ background: 'linear-gradient(145deg, hsl(158, 50%, 30%), hsl(158, 45%, 36%))' }}
          >
            <div className="absolute bottom-0 translate-y-1/2">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center bg-white"
                style={{ boxShadow: '0 4px 16px -4px hsla(158, 50%, 25%, 0.3)' }}
              >
                <svg viewBox="0 0 32 32" className="w-8 h-8" style={{ color: 'hsl(158, 50%, 30%)' }}>
                  <path d="M4 6v20c0 1 1 2 2 2h20c1 0 2-1 2-2V6c0-1-1-2-2-2H6c-1 0-2 1-2 2z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M16 4v24M8 10h6M8 14h6M8 18h6M18 10h6M18 14h6M18 18h6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-12 pb-8 px-8">
            {splashContent.admissionStatus && (
              <div className="flex justify-center mb-4">
                <span 
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white"
                  style={{ background: 'hsl(158, 50%, 35%)' }}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  {splashContent.admissionStatus}
                </span>
              </div>
            )}

            <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 leading-tight" style={{ color: 'hsl(158, 35%, 22%)' }}>
              {splashContent.institutionName}
            </h1>
            
            {splashContent.institutionSubtitle && (
              <h2 className="text-lg md:text-xl text-center mb-2" style={{ color: 'hsl(158, 40%, 35%)' }}>
                {splashContent.institutionSubtitle}
              </h2>
            )}

            {splashContent.tagline && (
              <p className="text-center text-sm mb-8 leading-relaxed text-muted-foreground">
                {splashContent.tagline}
              </p>
            )}

            {/* Clean flat button */}
            <button
              onClick={handleEnter}
              className="group w-full rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              <div 
                className="py-4 px-6 rounded-xl transition-all duration-200"
                style={{ background: 'hsl(158, 50%, 35%)' }}
              >
                <span className="flex items-center justify-center gap-3 text-white font-semibold text-lg">
                  {splashContent.buttonText}
                  <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </button>

            {/* Contact */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="tel:+919544124059" className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors hover:bg-accent" style={{ color: 'hsl(158, 40%, 30%)' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm font-medium">+91 95441 24059</span>
              </a>
              <a href="tel:+918281102606" className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors hover:bg-accent" style={{ color: 'hsl(158, 40%, 30%)' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm font-medium">+91 82811 02606</span>
              </a>
            </div>

            {splashContent.buttonSubtitle && (
              <p className="text-center text-xs text-muted-foreground mt-4">
                {splashContent.buttonSubtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}