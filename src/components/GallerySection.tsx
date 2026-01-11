import { useState, useRef, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Heart, Download, Loader2 } from "lucide-react";
import { useGalleryLikes } from "@/hooks/useGalleryLikes";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

interface GallerySettings {
  likesEnabled?: boolean;
  downloadEnabled?: boolean;
}

interface GallerySectionProps {
  images: GalleryImage[];
  settings?: GallerySettings;
}

// Default fallback images if none in database
const defaultImages = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&h=400&fit=crop",
    alt: "ക്ലാസ് റൂം പഠനം"
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
    alt: "ലൈബ്രറി"
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop",
    alt: "ഗ്രന്ഥപഠനം"
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
    alt: "വിദ്യാർത്ഥികൾ"
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop",
    alt: "ക്ലാസ് മുറി"
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&h=400&fit=crop",
    alt: "പ്രാർത്ഥന"
  }
];

const GallerySection = ({ images, settings }: GallerySectionProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const { toggleLike, getLikeCount, isLiked, loading: likesLoading } = useGalleryLikes();
  
  const galleryImages = images && images.length > 0 ? images : defaultImages;
  const likesEnabled = settings?.likesEnabled !== false;
  const downloadEnabled = settings?.downloadEnabled !== false;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage) {
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'Escape') setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex]);

  const lightboxIndex = selectedImage !== null 
    ? galleryImages.findIndex(img => img.id === selectedImage) 
    : -1;

  const goToPrevious = useCallback(() => {
    if (lightboxIndex > 0) {
      setSelectedImage(galleryImages[lightboxIndex - 1].id);
    }
  }, [lightboxIndex, galleryImages]);

  const goToNext = useCallback(() => {
    if (lightboxIndex < galleryImages.length - 1) {
      setSelectedImage(galleryImages[lightboxIndex + 1].id);
    }
  }, [lightboxIndex, galleryImages]);

  // Slider navigation
  const scrollToIndex = (index: number) => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.offsetWidth < 640 ? 280 : 320;
      const gap = 16;
      sliderRef.current.scrollTo({
        left: index * (cardWidth + gap),
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const handlePrevSlide = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  };

  const handleNextSlide = () => {
    const maxIndex = Math.max(0, galleryImages.length - 1);
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    scrollToIndex(newIndex);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // Update current index on scroll
  const handleScroll = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.offsetWidth < 640 ? 280 : 320;
      const gap = 16;
      const newIndex = Math.round(sliderRef.current.scrollLeft / (cardWidth + gap));
      setCurrentIndex(Math.min(newIndex, galleryImages.length - 1));
    }
  };

  // Download image
  const handleDownload = async (image: GalleryImage, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${image.alt || 'image'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(image.url, '_blank');
    }
  };

  // Handle like
  const handleLike = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(imageId);
  };

  return (
    <section id="gallery" className="py-24 lg:py-32 relative cream-gradient">
      {/* Pattern Background */}
      <div className="absolute inset-0 islamic-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <ImageIcon className="w-4 h-4" />
            ഗാലറി
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            നിമിഷങ്ങൾ 
            <span className="gold-text"> ഓർമ്മകളായി</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            ഞങ്ങളുടെ സ്ഥാപനത്തിന്റെ വിവിധ പ്രവർത്തനങ്ങളുടെ ഓർമ്മകൾ
          </p>
        </div>
        
        {/* Gallery Slider Container */}
        <div className="relative">
          {/* Navigation Arrows - Desktop */}
          <button
            onClick={handlePrevSlide}
            disabled={currentIndex === 0}
            className="hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-card shadow-lg border border-border items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40 disabled:hover:bg-card disabled:hover:text-foreground"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleNextSlide}
            disabled={currentIndex >= galleryImages.length - 1}
            className="hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-card shadow-lg border border-border items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40 disabled:hover:bg-card disabled:hover:text-foreground"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slider */}
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 cursor-grab active:cursor-grabbing"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {galleryImages.map((image) => (
              <div 
                key={image.id}
                onClick={() => setSelectedImage(image.id)}
                className="flex-shrink-0 w-[280px] sm:w-[320px] group relative overflow-hidden rounded-2xl cursor-pointer bg-card shadow-soft border border-border/50 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={image.url} 
                    alt={image.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Action Buttons Overlay */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {likesEnabled && (
                      <button
                        onClick={(e) => handleLike(image.id, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md transition-all duration-200 ${
                          isLiked(image.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 text-foreground hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked(image.id) ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">
                          {likesLoading ? '...' : getLikeCount(image.id)}
                        </span>
                      </button>
                    )}
                    
                    {downloadEnabled && (
                      <button
                        onClick={(e) => handleDownload(image, e)}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-foreground hover:bg-primary hover:text-primary-foreground backdrop-blur-md transition-all duration-200"
                        title="ഡൗൺലോഡ്"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Caption */}
                <div className="p-4">
                  <p className="text-foreground font-medium text-sm line-clamp-1">
                    {image.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-6 bg-primary' 
                    : 'bg-primary/30 hover:bg-primary/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Lightbox */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          {/* Navigation */}
          {lightboxIndex > 0 && (
            <button 
              className="absolute left-2 md:left-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}
          {lightboxIndex < galleryImages.length - 1 && (
            <button 
              className="absolute right-2 md:right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}
          
          {/* Image Container */}
          <div className="relative max-w-[90vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <img 
              src={galleryImages.find(img => img.id === selectedImage)?.url}
              alt={galleryImages.find(img => img.id === selectedImage)?.alt}
              className="max-w-full max-h-[80vh] rounded-xl shadow-2xl object-contain"
            />
            
            {/* Lightbox Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">
                  {galleryImages.find(img => img.id === selectedImage)?.alt}
                </span>
                <div className="flex items-center gap-3">
                  {likesEnabled && (
                    <button
                      onClick={(e) => handleLike(selectedImage, e)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        isLiked(selectedImage)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/20 text-white hover:bg-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked(selectedImage) ? 'fill-current' : ''}`} />
                      <span>{getLikeCount(selectedImage)}</span>
                    </button>
                  )}
                  {downloadEnabled && (
                    <button
                      onClick={(e) => handleDownload(galleryImages.find(img => img.id === selectedImage)!, e)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white hover:bg-primary transition-all"
                    >
                      <Download className="w-5 h-5" />
                      <span>ഡൗൺലോഡ്</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm">
            {lightboxIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
      
      {/* Custom scrollbar hide style */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default GallerySection;