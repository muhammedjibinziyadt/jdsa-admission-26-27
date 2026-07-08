import { useState, useEffect } from 'react';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';
import { BookOpen, Phone, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { content } = useWebsiteContent();

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 80);
    return () => clearTimeout(t);
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
    enabled: true,
  };
  const splash = { ...defaultSplash, ...content.splash };
  if (splash.enabled === false) return null;

  return (
    <div
      className={`splash-root fixed inset-0 z-50 overflow-hidden transition-opacity duration-500 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Soft gradient background */}
      <div className="splash-bg" aria-hidden />
      <div className="splash-pattern" aria-hidden />

      {/* Subtle floating particles */}
      <div className="splash-particles" aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            style={{
              left: `${(i * 73) % 100}%`,
              animationDelay: `${(i * 0.6).toFixed(2)}s`,
              animationDuration: `${14 + (i % 5) * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-full flex items-center justify-center px-5 py-10">
        <div
          className={`w-full max-w-md transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          } ${isExiting ? 'opacity-0 -translate-y-2' : ''}`}
        >
          <div className="splash-card">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="splash-icon">
                <BookOpen className="w-7 h-7" strokeWidth={2.25} />
              </div>
            </div>

            {/* Admission badge */}
            {splash.admissionStatus && (
              <div className="flex justify-center mb-6">
                <span className="splash-badge">
                  <span className="splash-badge-dot" />
                  {splash.admissionStatus}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="splash-title">{splash.institutionName}</h1>

            {splash.institutionSubtitle && (
              <h2 className="splash-subtitle">{splash.institutionSubtitle}</h2>
            )}

            {splash.tagline && (
              <p className="splash-tagline">{splash.tagline}</p>
            )}

            {/* Primary CTA */}
            <button onClick={handleEnter} className="splash-btn group">
              <span>{splash.buttonText}</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* Contact buttons */}
            <div className="mt-5 grid gap-2.5">
              <a href="tel:+919544124059" className="splash-contact">
                <Phone className="w-4 h-4" />
                <span>+91 95441 24059</span>
              </a>
              <a href="tel:+918281102606" className="splash-contact">
                <Phone className="w-4 h-4" />
                <span>+91 82811 02606</span>
              </a>
            </div>

            {splash.buttonSubtitle && (
              <p className="splash-footnote">{splash.buttonSubtitle}</p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .splash-root {
          isolation: isolate;
          background: #f7f8fa;
        }
        .splash-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(1200px 600px at 12% 0%, rgba(16, 122, 87, 0.10), transparent 60%),
            radial-gradient(900px 500px at 100% 100%, rgba(201, 162, 76, 0.10), transparent 60%),
            linear-gradient(180deg, #fbfbfc 0%, #f4f6f8 100%);
        }
        .splash-pattern {
          position: absolute; inset: 0;
          background-image:
            radial-gradient(rgba(15, 30, 40, 0.045) 1px, transparent 1px);
          background-size: 26px 26px;
          mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.9), transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.9), transparent 75%);
        }
        .splash-particles { position: absolute; inset: 0; pointer-events: none; }
        .splash-particles span {
          position: absolute; bottom: -10px;
          width: 4px; height: 4px; border-radius: 999px;
          background: rgba(16, 122, 87, 0.28);
          animation: splashFloat linear infinite;
          opacity: 0;
        }
        @keyframes splashFloat {
          0%   { transform: translateY(0); opacity: 0; }
          10%  { opacity: 0.6; }
          100% { transform: translateY(-110vh); opacity: 0; }
        }

        .splash-card {
          position: relative;
          background: rgba(255, 255, 255, 0.78);
          -webkit-backdrop-filter: blur(14px);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(15, 30, 40, 0.06);
          border-radius: 24px;
          padding: 32px 24px 28px;
          box-shadow:
            0 1px 2px rgba(15, 30, 40, 0.04),
            0 10px 30px -12px rgba(15, 30, 40, 0.12),
            0 30px 60px -30px rgba(15, 30, 40, 0.15);
        }

        .splash-icon {
          width: 64px; height: 64px;
          border-radius: 18px;
          background: linear-gradient(160deg, #ffffff 0%, #fbf3df 100%);
          border: 1px solid rgba(201, 162, 76, 0.35);
          color: #b8862a;
          display: grid; place-items: center;
          box-shadow:
            0 8px 20px -10px rgba(201, 162, 76, 0.45),
            inset 0 1px 0 rgba(255,255,255,0.9);
          animation: iconFloat 4.5s ease-in-out infinite;
          transition: transform 0.3s ease;
        }
        .splash-icon:hover { transform: translateY(-2px) scale(1.03); }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }

        .splash-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px;
          background: rgba(16, 122, 87, 0.08);
          color: #0f6b4c;
          border: 1px solid rgba(16, 122, 87, 0.18);
          border-radius: 999px;
          font-size: 13px; font-weight: 500;
          letter-spacing: 0.01em;
        }
        .splash-badge-dot {
          width: 6px; height: 6px; border-radius: 999px;
          background: #10a06e;
          box-shadow: 0 0 0 3px rgba(16, 160, 110, 0.18);
          animation: dotPulse 2s ease-in-out infinite;
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.55; }
        }

        .splash-title {
          font-family: 'Playfair Display', serif;
          text-align: center;
          font-size: clamp(1.6rem, 5.5vw, 2rem);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.01em;
          color: #14232e;
          margin-bottom: 8px;
        }
        .splash-subtitle {
          text-align: center;
          font-size: 1.05rem;
          font-weight: 500;
          color: #4a5b68;
          margin-bottom: 8px;
        }
        .splash-tagline {
          text-align: center;
          font-size: 0.9rem;
          line-height: 1.55;
          color: #6b7a86;
          margin-bottom: 24px;
          padding: 0 4px;
        }

        .splash-btn {
          width: 100%;
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 15px 22px;
          border-radius: 14px;
          font-size: 15px; font-weight: 600;
          color: #ffffff;
          background: linear-gradient(135deg, #0f6b4c 0%, #10855d 55%, #0f6b4c 100%);
          background-size: 200% 100%;
          background-position: 0% 50%;
          border: 1px solid rgba(15, 107, 76, 0.5);
          box-shadow:
            0 8px 22px -10px rgba(15, 107, 76, 0.55),
            inset 0 1px 0 rgba(255,255,255,0.18);
          transition: transform 0.2s ease, box-shadow 0.25s ease, background-position 0.5s ease;
          cursor: pointer;
        }
        .splash-btn:hover {
          transform: translateY(-1px);
          background-position: 100% 50%;
          box-shadow:
            0 14px 28px -12px rgba(15, 107, 76, 0.6),
            inset 0 1px 0 rgba(255,255,255,0.22);
        }
        .splash-btn:active { transform: translateY(0) scale(0.99); }

        .splash-contact {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px; font-weight: 500;
          color: #24333f;
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(15, 30, 40, 0.09);
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .splash-contact:hover {
          transform: translateY(-1px);
          border-color: rgba(15, 107, 76, 0.35);
          background: rgba(255,255,255,0.9);
        }
        .splash-contact svg { color: #0f6b4c; }

        .splash-footnote {
          text-align: center;
          font-size: 12px;
          color: #7c8994;
          margin-top: 18px;
          line-height: 1.5;
        }

        @media (max-width: 380px) {
          .splash-card { padding: 26px 20px 22px; border-radius: 22px; }
          .splash-icon { width: 58px; height: 58px; border-radius: 16px; }
        }
      `}</style>
    </div>
  );
}
