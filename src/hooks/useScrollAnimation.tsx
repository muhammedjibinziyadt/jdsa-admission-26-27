import { useEffect, useRef, useState, useCallback } from 'react';

type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';

interface ScrollAnimationOptions {
  direction?: AnimationDirection;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const {
    direction = 'up',
    delay = 0,
    duration = 600,
    threshold = 0.15,
    once = true,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, once]);

  const getTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(30px)';
      case 'down': return 'translateY(-30px)';
      case 'left': return 'translateX(40px)';
      case 'right': return 'translateX(-40px)';
      case 'scale': return 'scale(0.95)';
      case 'fade': return 'translateY(0)';
      default: return 'translateY(30px)';
    }
  };

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate(0) scale(1)' : getTransform(),
    transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
    willChange: 'opacity, transform',
  };

  return { ref, style, isVisible };
};

// Helper component for wrapping elements with scroll animation
interface ScrollAnimateProps {
  children: React.ReactNode;
  direction?: AnimationDirection;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

export const ScrollAnimate = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  className = '',
  threshold = 0.15,
}: ScrollAnimateProps) => {
  const { ref, style } = useScrollAnimation({ direction, delay, duration, threshold });

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
};
