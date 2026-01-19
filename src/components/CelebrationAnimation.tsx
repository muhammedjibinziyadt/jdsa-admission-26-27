import { useEffect, useState, useCallback } from 'react';

interface CelebrationAnimationProps {
  isActive: boolean;
  duration?: number; // in seconds
  intensity?: 'light' | 'medium';
  onComplete?: () => void;
}

interface Particle {
  id: number;
  type: 'ribbon' | 'petal' | 'confetti';
  x: number;
  y: number;
  size: number;
  rotation: number;
  delay: number;
  duration: number;
  color: string;
}

const COLORS = {
  softGreen: ['hsl(145, 50%, 55%)', 'hsl(145, 45%, 65%)', 'hsl(150, 40%, 60%)'],
  white: ['hsl(0, 0%, 100%)', 'hsl(0, 0%, 95%)', 'hsl(0, 0%, 90%)'],
  lightGold: ['hsl(43, 75%, 55%)', 'hsl(45, 70%, 60%)', 'hsl(40, 65%, 65%)'],
};

const getAllColors = () => [
  ...COLORS.softGreen,
  ...COLORS.white,
  ...COLORS.lightGold,
];

export function CelebrationAnimation({ 
  isActive, 
  duration = 3, 
  intensity = 'light',
  onComplete 
}: CelebrationAnimationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const generateParticles = useCallback(() => {
    const particleCount = intensity === 'light' ? 30 : 50;
    const colors = getAllColors();
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const type = i % 3 === 0 ? 'ribbon' : i % 3 === 1 ? 'petal' : 'confetti';
      newParticles.push({
        id: i,
        type,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        size: type === 'ribbon' ? 20 + Math.random() * 15 : 8 + Math.random() * 8,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.8,
        duration: 2 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return newParticles;
  }, [intensity]);

  useEffect(() => {
    if (isActive) {
      setParticles(generateParticles());
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration * 1000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setParticles([]);
    }
  }, [isActive, duration, generateParticles, onComplete]);

  if (!isActive && !isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg) translateX(0);
            opacity: 1;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg) translateX(20px);
            opacity: 0;
          }
        }

        @keyframes sway {
          0%, 100% {
            transform: translateY(0) rotate(0deg) translateX(0);
          }
          25% {
            transform: translateY(25vh) rotate(180deg) translateX(15px);
          }
          50% {
            transform: translateY(50vh) rotate(360deg) translateX(-10px);
          }
          75% {
            transform: translateY(75vh) rotate(540deg) translateX(12px);
          }
          100% {
            transform: translateY(100vh) rotate(720deg) translateX(0);
            opacity: 0;
          }
        }

        @keyframes flutter {
          0% {
            transform: translateY(0) rotateX(0deg) rotateY(0deg) translateX(0);
            opacity: 1;
          }
          25% {
            transform: translateY(25vh) rotateX(90deg) rotateY(45deg) translateX(20px);
          }
          50% {
            transform: translateY(50vh) rotateX(180deg) rotateY(90deg) translateX(-15px);
          }
          75% {
            transform: translateY(75vh) rotateX(270deg) rotateY(135deg) translateX(10px);
          }
          100% {
            transform: translateY(100vh) rotateX(360deg) rotateY(180deg) translateX(0);
            opacity: 0;
          }
        }

        .celebration-particle {
          position: absolute;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .ribbon {
          animation: sway ease-in-out forwards;
        }

        .petal {
          animation: flutter ease-in-out forwards;
        }

        .confetti {
          animation: fall ease-out forwards;
        }
      `}</style>

      <div 
        className={`fixed inset-0 z-[60] pointer-events-none overflow-hidden transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`celebration-particle ${particle.type}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          >
            {particle.type === 'ribbon' && (
              <svg
                width={particle.size}
                height={particle.size * 2.5}
                viewBox="0 0 20 50"
                style={{ transform: `rotate(${particle.rotation}deg)` }}
              >
                <path
                  d="M10 0 C5 10, 15 15, 10 25 C5 35, 15 40, 10 50"
                  fill="none"
                  stroke={particle.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            )}
            
            {particle.type === 'petal' && (
              <svg
                width={particle.size}
                height={particle.size}
                viewBox="0 0 24 24"
                style={{ transform: `rotate(${particle.rotation}deg)` }}
              >
                <ellipse
                  cx="12"
                  cy="12"
                  rx="10"
                  ry="5"
                  fill={particle.color}
                  opacity="0.85"
                />
              </svg>
            )}
            
            {particle.type === 'confetti' && (
              <div
                style={{
                  width: particle.size,
                  height: particle.size * 0.6,
                  backgroundColor: particle.color,
                  borderRadius: '2px',
                  transform: `rotate(${particle.rotation}deg)`,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
