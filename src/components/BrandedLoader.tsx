import logoAsset from '@/assets/jdsa-logo.png.asset.json';

interface BrandedLoaderProps {
  fullScreen?: boolean;
}

export function BrandedLoader({ fullScreen = true }: BrandedLoaderProps) {
  return (
    <div
      className={
        fullScreen
          ? 'fixed inset-0 z-[60] flex items-center justify-center brand-loader-bg'
          : 'w-full flex items-center justify-center py-16 brand-loader-bg'
      }
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* Subtle floating particles */}
      <div className="brand-loader-particles" aria-hidden>
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            style={{
              left: `${(i * 83) % 100}%`,
              animationDelay: `${(i * 0.7).toFixed(2)}s`,
              animationDuration: `${12 + (i % 4) * 3}s`,
              background: i % 2 === 0 ? 'rgba(16, 122, 87, 0.35)' : 'rgba(201, 162, 76, 0.35)',
            }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="brand-loader-logo-wrap">
          <div className="brand-loader-glow" aria-hidden />
          <div className="brand-loader-ring" aria-hidden />
          <img
            src={logoAsset.url}
            alt="Jawharathul Uloom Suffa Dars"
            className="brand-loader-logo"
            draggable={false}
          />
        </div>
      </div>


      <style>{`
        .brand-loader-bg {
          background: linear-gradient(180deg, #ffffff 0%, #f4faf6 100%);
          isolation: isolate;
          overflow: hidden;
        }
        .brand-loader-particles {
          position: absolute; inset: 0; pointer-events: none;
        }
        .brand-loader-particles span {
          position: absolute; bottom: -10px;
          width: 5px; height: 5px; border-radius: 999px;
          animation: brandFloat linear infinite;
          opacity: 0;
        }
        @keyframes brandFloat {
          0%   { transform: translateY(0); opacity: 0; }
          10%  { opacity: 0.55; }
          100% { transform: translateY(-110vh); opacity: 0; }
        }

        .brand-loader-logo-wrap {
          position: relative;
          width: 160px; height: 160px;
          display: grid; place-items: center;
          animation: brandFloatY 4s ease-in-out infinite;
        }
        .brand-loader-logo {
          position: relative;
          width: 128px; height: 128px;
          object-fit: contain;
          animation: brandBreath 3.2s ease-in-out infinite;
          filter:
            drop-shadow(0 0 12px rgba(16, 122, 87, 0.35))
            drop-shadow(0 0 22px rgba(201, 162, 76, 0.25));
          z-index: 2;
        }
        .brand-loader-glow {
          position: absolute; inset: 0;
          border-radius: 50%;
          background:
            radial-gradient(circle at 50% 50%, rgba(16, 122, 87, 0.28), transparent 55%),
            radial-gradient(circle at 50% 50%, rgba(201, 162, 76, 0.22), transparent 65%);
          filter: blur(8px);
          animation: brandPulseGlow 3.2s ease-in-out infinite;
          z-index: 0;
        }
        .brand-loader-ring {
          position: absolute; inset: -6px;
          border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: #0f6b4c;
          border-right-color: rgba(201, 162, 76, 0.9);
          animation: brandSpin 2.6s linear infinite;
          z-index: 1;
        }
        @keyframes brandSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes brandBreath {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.06); }
        }
        @keyframes brandFloatY {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes brandPulseGlow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.1); }
        }

        .brand-loader-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #14232e;
          letter-spacing: 0.02em;
        }
        .brand-loader-subtext {
          margin-top: 4px;
          font-size: 0.82rem;
          color: #6b7a86;
        }

        @media (prefers-reduced-motion: reduce) {
          .brand-loader-logo, .brand-loader-ring, .brand-loader-glow, .brand-loader-logo-wrap {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default BrandedLoader;
