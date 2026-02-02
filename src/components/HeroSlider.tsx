import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SliderImage {
  id: string;
  url: string;
  alt: string;
}

interface HeroSliderProps {
  images: SliderImage[];
  autoPlayInterval?: number; // in milliseconds
}

const HeroSlider = ({ images, autoPlayInterval = 5000 }: HeroSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % images.length;
    goToSlide(nextIndex);
  }, [currentIndex, images.length, goToSlide]);

  const goToPrevious = useCallback(() => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    goToSlide(prevIndex);
  }, [currentIndex, images.length, goToSlide]);

  // Auto-play logic
  useEffect(() => {
    if (images.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [images.length, isPaused, autoPlayInterval, goToNext]);

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      setIsPaused(false);
      return;
    }

    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
    
    // Resume auto-play after a delay
    setTimeout(() => setIsPaused(false), 3000);
  };

  // Mouse handlers for pause on interaction
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const handleArrowClick = (direction: 'prev' | 'next') => {
    setIsPaused(true);
    if (direction === 'prev') {
      goToPrevious();
    } else {
      goToNext();
    }
    // Resume auto-play after a delay
    setTimeout(() => setIsPaused(false), 3000);
  };

  const handleDotClick = (index: number) => {
    setIsPaused(true);
    goToSlide(index);
    // Resume auto-play after a delay
    setTimeout(() => setIsPaused(false), 3000);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section 
      ref={sliderRef}
      className="relative w-full h-screen overflow-hidden bg-background"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className="w-full h-full flex-shrink-0 relative"
          >
            <img
              src={image.url}
              alt={image.alt || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            {/* Optional overlay for better text visibility if needed */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-primary/30 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      {images.length > 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-card/30 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground hover:bg-card/50 hover:text-primary-foreground transition-all duration-300"
          onClick={() => handleArrowClick('prev')}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      )}

      {/* Right Arrow */}
      {images.length > 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-card/30 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground hover:bg-card/50 hover:text-primary-foreground transition-all duration-300"
          onClick={() => handleArrowClick('next')}
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      )}

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary-foreground scale-125 shadow-lg'
                  : 'bg-primary-foreground/50 hover:bg-primary-foreground/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}

      {/* Slide Counter (optional, for accessibility) */}
      <div className="sr-only" aria-live="polite">
        Slide {currentIndex + 1} of {images.length}
      </div>
    </section>
  );
};

export default HeroSlider;
