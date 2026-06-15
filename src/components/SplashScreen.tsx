import { useState, useEffect } from 'react';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';
import {
  BookOpen, GraduationCap, Lightbulb, Laptop, PenTool, Pencil,
  FileText, Brain, Sparkles, Atom, Compass, Award,
} from 'lucide-react';

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
    setTimeout(onEnter, 600);
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

  // Orbiting icon configuration (parallax depth via duration + radius)
  const orbits = [
    { Icon: BookOpen,      r: 38, d: 22, delay: 0,    size: 28, tint: 'rgba(255,215,140,0.95)' },
    { Icon: PenTool,       r: 44, d: 28, delay: -4,   size: 24, tint: 'rgba(180,230,255,0.9)' },
    { Icon: Lightbulb,     r: 34, d: 26, delay: -9,   size: 26, tint: 'rgba(255,235,150,1)' },
    { Icon: GraduationCap, r: 46, d: 30, delay: -14,  size: 28, tint: 'rgba(255,255,255,0.95)' },
    { Icon: Laptop,        r: 40, d: 24, delay: -18,  size: 26, tint: 'rgba(170,255,220,0.95)' },
    { Icon: Brain,         r: 36, d: 32, delay: -6,   size: 24, tint: 'rgba(255,200,220,0.95)' },
    { Icon: Atom,          r: 48, d: 34, delay: -11,  size: 24, tint: 'rgba(180,210,255,0.95)' },
    { Icon: Compass,       r: 32, d: 20, delay: -16,  size: 22, tint: 'rgba(255,220,180,0.95)' },
  ];

  // Floating papers / pencils drifting in the background
  const drifters = [
    { Icon: FileText, top: '12%', left: '8%',  d: 14, delay: 0,   size: 22 },
    { Icon: Pencil,   top: '18%', left: '85%', d: 17, delay: -3,  size: 22 },
    { Icon: Sparkles, top: '70%', left: '10%', d: 12, delay: -5,  size: 20 },
    { Icon: Award,    top: '78%', left: '82%', d: 16, delay: -2,  size: 22 },
    { Icon: FileText, top: '34%', left: '92%', d: 19, delay: -8,  size: 18 },
    { Icon: Pencil,   top: '58%', left: '4%',  d: 15, delay: -6,  size: 20 },
  ];

  return (
    <div
      className={`splash-root fixed inset-0 z-50 overflow-hidden transition-opacity duration-500 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Animated gradient background */}
      <div className="splash-bg" />
      <div className="splash-rays" aria-hidden />
      <div className="splash-grid" aria-hidden />

      {/* Particles */}
      <div className="splash-particles" aria-hidden>
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            style={{
              left: `${(i * 53) % 100}%`,
              animationDelay: `${(i * 0.35).toFixed(2)}s`,
              animationDuration: `${8 + (i % 6)}s`,
              width: `${3 + (i % 4)}px`,
              height: `${3 + (i % 4)}px`,
            }}
          />
        ))}
      </div>

      {/* Drifting paper/pencil icons */}
      {drifters.map(({ Icon, top, left, d, delay, size }, i) => (
        <div
          key={`drift-${i}`}
          className="splash-drift"
          style={{
            top, left,
            animationDuration: `${d}s`,
            animationDelay: `${delay}s`,
          }}
        >
          <Icon style={{ width: size, height: size }} />
        </div>
      ))}

      {/* Center scene */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        {/* Orbiting icons stage */}
        <div
          className={`splash-stage ${isLoaded ? 'is-in' : ''} ${isExiting ? 'is-out' : ''}`}
          aria-hidden
        >
          <div className="splash-aura" />
          <div className="splash-aura splash-aura-2" />

          {orbits.map(({ Icon, r, d, delay, size, tint }, i) => (
            <div
              key={i}
              className="orbit-wrap"
              style={{
                animationDuration: `${d}s`,
                animationDelay: `${delay}s`,
              }}
            >
              <div
                className="orbit-item"
                style={{
                  transform: `translate(-50%,-50%) translateY(-${r}vmin)`,
                  color: tint,
                  filter: `drop-shadow(0 0 8px ${tint})`,
                }}
              >
                <Icon style={{ width: size, height: size }} />
              </div>
            </div>
          ))}

          {/* Centerpiece open book */}
          <div className="splash-book">
            <div className="book-glow" />
            <svg viewBox="0 0 220 160" className="book-svg">
              <defs>
                <linearGradient id="pageGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fffaf0" />
                  <stop offset="100%" stopColor="#f1e4c3" />
                </linearGradient>
                <linearGradient id="spineGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#caa463" />
                  <stop offset="100%" stopColor="#7a5a26" />
                </linearGradient>
                <radialGradient id="auraGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,215,140,0.55)" />
                  <stop offset="100%" stopColor="rgba(255,215,140,0)" />
                </radialGradient>
              </defs>
              {/* book base shadow */}
              <ellipse cx="110" cy="148" rx="92" ry="6" fill="rgba(0,0,0,0.35)" />
              {/* left page */}
              <path d="M110 30 C 70 22, 30 28, 14 38 L 14 132 C 30 122, 70 128, 110 136 Z"
                fill="url(#pageGrad)" stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
              {/* right page */}
              <path d="M110 30 C 150 22, 190 28, 206 38 L 206 132 C 190 122, 150 128, 110 136 Z"
                fill="url(#pageGrad)" stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
              {/* page lines */}
              {[44,56,68,80,92,104].map((y,idx)=>(
                <g key={idx} className="page-line" style={{ animationDelay: `${idx*0.15}s` }}>
                  <line x1="26" x2={26 + 60 - idx*4} y1={y} y2={y} stroke="#c9a96a" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1={134 + idx*4} x2="194" y1={y} y2={y} stroke="#c9a96a" strokeWidth="1.2" strokeLinecap="round" />
                </g>
              ))}
              {/* spine */}
              <path d="M108 30 L 112 30 L 112 136 L 108 136 Z" fill="url(#spineGrad)" />
              {/* turning page */}
              <g className="turning-page" style={{ transformOrigin: '110px 30px' }}>
                <path d="M110 30 C 150 22, 190 28, 206 38 L 206 132 C 190 122, 150 128, 110 136 Z"
                  fill="url(#pageGrad)" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
              </g>
              {/* aura over book */}
              <circle cx="110" cy="80" r="80" fill="url(#auraGrad)" className="book-aura-pulse" />
            </svg>

            {/* Rising knowledge particles from the book */}
            <div className="book-rise" aria-hidden>
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} style={{
                  left: `${20 + i * 8}%`,
                  animationDelay: `${(i * 0.45).toFixed(2)}s`,
                  animationDuration: `${5 + (i % 3)}s`,
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Foreground card */}
        <div
          className={`relative z-10 w-full max-w-md transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          } ${isExiting ? 'opacity-0 -translate-y-4 scale-95' : ''}`}
        >
          <div className="splash-card">
            <div className="splash-card-shine" aria-hidden />

            <div className="flex justify-center mb-4">
              <div className="splash-logo">
                <BookOpen className="w-7 h-7" />
              </div>
            </div>

            {splash.admissionStatus && (
              <div className="flex justify-center mb-4">
                <span className="splash-status">
                  <span className="splash-status-dot" />
                  {splash.admissionStatus}
                </span>
              </div>
            )}

            <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 leading-tight text-white">
              {splash.institutionName}
            </h1>

            {splash.institutionSubtitle && (
              <h2 className="text-lg md:text-xl text-center mb-2 text-white/85">
                {splash.institutionSubtitle}
              </h2>
            )}

            {splash.tagline && (
              <p className="text-center text-sm mb-6 leading-relaxed text-white/75">
                {splash.tagline}
              </p>
            )}

            <button onClick={handleEnter} className="splash-btn group">
              <span className="splash-btn-shine" aria-hidden />
              <span className="relative flex items-center justify-center gap-3 text-white font-semibold text-lg">
                {splash.buttonText}
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <a href="tel:+919544124059" className="splash-contact">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm font-medium">+91 95441 24059</span>
              </a>
              <a href="tel:+918281102606" className="splash-contact">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm font-medium">+91 82811 02606</span>
              </a>
            </div>

            {splash.buttonSubtitle && (
              <p className="text-center text-xs text-white/65 mt-4">
                {splash.buttonSubtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .splash-root { isolation: isolate; }
        .splash-bg {
          position: absolute; inset: -10%;
          background:
            radial-gradient(ellipse at 20% 20%, hsl(158, 60%, 28%) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 30%, hsl(200, 70%, 30%) 0%, transparent 55%),
            radial-gradient(ellipse at 50% 90%, hsl(38, 70%, 28%) 0%, transparent 55%),
            linear-gradient(160deg, hsl(220, 45%, 10%) 0%, hsl(158, 45%, 14%) 100%);
          animation: splashShift 18s ease-in-out infinite alternate;
          filter: saturate(1.05);
        }
        @keyframes splashShift {
          0%   { transform: translate3d(0,0,0) scale(1); }
          100% { transform: translate3d(-2%, 1%, 0) scale(1.05); }
        }
        .splash-rays {
          position: absolute; inset: 0; pointer-events: none;
          background: conic-gradient(from 90deg at 50% 60%,
            rgba(255,215,140,0.0) 0deg,
            rgba(255,215,140,0.10) 20deg,
            rgba(255,215,140,0.0) 60deg,
            rgba(180,230,255,0.10) 180deg,
            rgba(255,215,140,0.0) 240deg,
            rgba(255,215,140,0.10) 300deg,
            rgba(255,215,140,0.0) 360deg);
          mix-blend-mode: screen;
          animation: rayRotate 40s linear infinite;
          opacity: .55;
        }
        @keyframes rayRotate { to { transform: rotate(360deg); } }
        .splash-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.6), transparent 70%);
          opacity: .35;
        }

        .splash-particles { position: absolute; inset: 0; pointer-events: none; }
        .splash-particles span {
          position: absolute; bottom: -20px; border-radius: 999px;
          background: radial-gradient(circle, rgba(255,235,180,0.95), rgba(255,235,180,0));
          animation: floatUp linear infinite;
          opacity: .85;
        }
        @keyframes floatUp {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: .9; }
          100% { transform: translateY(-110vh) translateX(20px); opacity: 0; }
        }

        .splash-drift {
          position: absolute; color: rgba(255,255,255,0.55);
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.35));
          animation: driftFloat ease-in-out infinite;
        }
        @keyframes driftFloat {
          0%, 100% { transform: translate(0,0) rotate(-6deg); }
          50%      { transform: translate(12px,-18px) rotate(8deg); }
        }

        .splash-stage {
          position: absolute; inset: 0; display: grid; place-items: center;
          opacity: 0; transform: scale(0.85);
          transition: opacity 800ms ease, transform 1000ms cubic-bezier(.2,.8,.2,1);
        }
        .splash-stage.is-in { opacity: 1; transform: scale(1); }
        .splash-stage.is-out { opacity: 0; transform: scale(1.1); }

        .splash-aura {
          position: absolute; width: 56vmin; height: 56vmin; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,215,140,0.35), rgba(255,215,140,0) 70%);
          animation: auraPulse 6s ease-in-out infinite;
          filter: blur(8px);
        }
        .splash-aura-2 {
          width: 80vmin; height: 80vmin;
          background: radial-gradient(circle, rgba(120,200,255,0.18), rgba(120,200,255,0) 70%);
          animation-duration: 9s;
        }
        @keyframes auraPulse {
          0%,100% { transform: scale(1); opacity: .9; }
          50%     { transform: scale(1.08); opacity: 1; }
        }

        .orbit-wrap {
          position: absolute; top: 50%; left: 50%;
          width: 0; height: 0;
          animation: orbitSpin linear infinite;
          transform-origin: 0 0;
        }
        @keyframes orbitSpin { to { transform: rotate(360deg); } }
        .orbit-item {
          position: absolute; top: 0; left: 0;
          animation: counterSpin linear infinite;
          animation-duration: inherit;
        }
        @keyframes counterSpin { to { transform: translate(-50%,-50%) translateY(var(--r,-40vmin)) rotate(-360deg); } }
        /* override: keep icon upright while wrap rotates */
        .orbit-wrap .orbit-item { animation: counterUp linear infinite; animation-duration: inherit; }
        @keyframes counterUp { to { transform: rotate(-360deg) translateY(0); } }

        .splash-book {
          position: absolute; width: min(46vmin, 320px); aspect-ratio: 220/160;
          display: grid; place-items: center;
          animation: bookFloat 6s ease-in-out infinite;
        }
        @keyframes bookFloat {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-8px); }
        }
        .book-glow {
          position: absolute; inset: -20%;
          background: radial-gradient(circle, rgba(255,215,140,0.55), rgba(255,215,140,0) 60%);
          filter: blur(12px);
          animation: auraPulse 5s ease-in-out infinite;
        }
        .book-svg { position: relative; width: 100%; height: 100%; filter: drop-shadow(0 20px 30px rgba(0,0,0,0.45)); }
        .turning-page {
          transform-box: fill-box;
          animation: pageTurn 5s cubic-bezier(.4,0,.2,1) infinite;
        }
        @keyframes pageTurn {
          0%   { transform: rotateY(0deg); opacity: 1; }
          40%  { transform: rotateY(-150deg); opacity: 1; }
          50%  { transform: rotateY(-180deg); opacity: 0; }
          51%  { transform: rotateY(0deg); opacity: 0; }
          60%  { opacity: 1; }
          100% { transform: rotateY(0deg); opacity: 1; }
        }
        .book-aura-pulse { animation: auraPulse 4s ease-in-out infinite; transform-origin: 110px 80px; }
        .page-line { opacity: 0; animation: pageLineIn .8s ease-out forwards; }
        @keyframes pageLineIn { to { opacity: 1; } }

        .book-rise { position: absolute; inset: 0; pointer-events: none; }
        .book-rise span {
          position: absolute; bottom: 40%; width: 6px; height: 6px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,225,160,1), rgba(255,225,160,0));
          animation: riseFade linear infinite;
        }
        @keyframes riseFade {
          0%   { transform: translateY(0) scale(.6); opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: translateY(-180px) scale(1.2); opacity: 0; }
        }

        /* Foreground glass card */
        .splash-card {
          position: relative; overflow: hidden;
          border-radius: 24px;
          background: linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04));
          backdrop-filter: blur(18px) saturate(1.2);
          -webkit-backdrop-filter: blur(18px) saturate(1.2);
          border: 1px solid rgba(255,255,255,0.18);
          box-shadow:
            0 30px 80px -20px rgba(0,0,0,0.55),
            inset 0 1px 0 rgba(255,255,255,0.18);
          padding: 28px 24px 24px;
        }
        .splash-card-shine {
          position: absolute; inset: -1px; border-radius: inherit; pointer-events: none;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%);
          background-size: 200% 100%;
          animation: cardShine 6s linear infinite;
          mix-blend-mode: overlay;
        }
        @keyframes cardShine { to { background-position: -200% 0; } }

        .splash-logo {
          width: 56px; height: 56px; border-radius: 18px;
          display: grid; place-items: center;
          color: hsl(38, 90%, 60%);
          background: linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,235,200,0.85));
          box-shadow: 0 12px 30px -8px rgba(255,200,120,0.55), inset 0 1px 0 rgba(255,255,255,0.9);
          animation: logoBob 4s ease-in-out infinite;
        }
        @keyframes logoBob {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50%     { transform: translateY(-4px) rotate(2deg); }
        }

        .splash-status {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px; border-radius: 999px;
          color: #fff; font-weight: 600; font-size: 13px;
          background: linear-gradient(135deg, hsl(158, 70%, 38%), hsl(158, 60%, 28%));
          box-shadow: 0 8px 20px -6px rgba(20,180,120,0.55);
        }
        .splash-status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 0 0 rgba(255,255,255,0.7);
          animation: statusPing 1.6s ease-out infinite;
        }
        @keyframes statusPing {
          0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.6); }
          70%  { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }

        .splash-btn {
          position: relative; overflow: hidden;
          width: 100%; padding: 16px 22px; border-radius: 14px;
          background: linear-gradient(135deg, hsl(38, 85%, 55%), hsl(28, 80%, 48%));
          box-shadow:
            0 20px 40px -12px rgba(255,160,60,0.55),
            inset 0 1px 0 rgba(255,255,255,0.35);
          transition: transform .2s ease, box-shadow .25s ease;
        }
        .splash-btn:hover { transform: translateY(-2px); box-shadow: 0 26px 50px -14px rgba(255,160,60,0.7), inset 0 1px 0 rgba(255,255,255,0.4); }
        .splash-btn:active { transform: translateY(0) scale(.98); }
        .splash-btn-shine {
          position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.45) 50%, transparent 65%);
          transform: translateX(-100%);
          animation: btnShine 3.2s ease-in-out infinite;
        }
        @keyframes btnShine {
          0%   { transform: translateX(-100%); }
          60%  { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }

        .splash-contact {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 10px;
          color: #fff;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.15);
          transition: background .2s ease, transform .2s ease;
        }
        .splash-contact:hover { background: rgba(255,255,255,0.18); transform: translateY(-1px); }

        @media (max-width: 640px) {
          .splash-book { width: min(60vmin, 260px); }
          .splash-grid { background-size: 32px 32px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .splash-bg, .splash-rays, .orbit-wrap, .turning-page, .book-aura-pulse,
          .splash-aura, .splash-aura-2, .splash-particles span, .splash-drift,
          .book-rise span, .splash-card-shine, .splash-btn-shine, .splash-logo,
          .splash-book, .splash-status-dot {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
