import { useState } from 'react';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';

interface SplashScreenProps {
  onEnter: () => void;
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const { content } = useWebsiteContent();

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(onEnter, 500);
  };

  // Get splash content from website content or use defaults
  const defaultSplash = {
    buttonText: 'Click to Open',
    buttonSubtitle: 'Tap to explore our institution',
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
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Blur overlay - shows website behind with blur effect */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-md transition-all duration-500 ${
          isExiting ? 'backdrop-blur-none bg-transparent' : ''
        }`}
      />

      {/* Glassmorphism Modal */}
      <div 
        className={`relative z-10 mx-4 w-full max-w-md transform transition-all duration-500 ${
          isExiting ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'
        }`}
      >
        {/* Modal Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          {/* Gradient glow effect behind card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-gold/30 to-emerald-500/20 blur-xl opacity-60" />
          
          {/* Card content */}
          <div className="relative bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm p-8 md:p-10">
            {/* Institution logo/icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-lg border-4 border-white/30">
                <span className="text-3xl">📚</span>
              </div>
            </div>

            {/* Institution name */}
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
              {splashContent.institutionName}
            </h1>
            <h2 className="text-lg md:text-xl text-center text-gray-600 dark:text-gray-300 mb-4">
              {splashContent.institutionSubtitle}
            </h2>

            {/* Subtitle/Description */}
            {splashContent.buttonSubtitle && (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8">
                {splashContent.buttonSubtitle}
              </p>
            )}

            {/* 3D Glowing Button */}
            <button
              onClick={handleEnter}
              className="group relative w-full overflow-hidden rounded-2xl transition-all duration-300 active:scale-[0.98]"
            >
              {/* Button shadow/depth layer */}
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-2xl translate-y-2" />
              
              {/* Main button surface */}
              <div className="relative bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-2xl p-4 md:p-5 transform transition-transform duration-150 group-hover:-translate-y-0.5 group-active:translate-y-0.5">
                {/* Inner highlight */}
                <div className="absolute inset-x-4 top-2 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
                
                {/* Glow animation overlay */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-emerald-400/30 animate-pulse rounded-2xl" />
                </div>
                
                {/* Button text */}
                <span className="relative flex items-center justify-center gap-2 text-white font-bold text-lg md:text-xl tracking-wide">
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
              
              {/* Outer glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10" />
            </button>

            {/* Contact info */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a 
                href="tel:+919544124059" 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm transition-colors"
              >
                <span>📞</span>
                <span>+91 95441 24059</span>
              </a>
              <a 
                href="tel:+918281102606" 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm transition-colors"
              >
                <span>📞</span>
                <span>+91 82811 02606</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
