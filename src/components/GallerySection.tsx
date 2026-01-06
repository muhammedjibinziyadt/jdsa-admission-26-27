import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

interface GallerySectionProps {
  images: GalleryImage[];
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

const GallerySection = ({ images }: GallerySectionProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const galleryImages = images && images.length > 0 ? images : defaultImages;

  const currentIndex = selectedImage !== null 
    ? galleryImages.findIndex(img => img.id === selectedImage) 
    : -1;

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setSelectedImage(galleryImages[currentIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (currentIndex < galleryImages.length - 1) {
      setSelectedImage(galleryImages[currentIndex + 1].id);
    }
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
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={image.id}
              onClick={() => setSelectedImage(image.id)}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer card-hover ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className={`relative ${index === 0 ? 'aspect-square md:aspect-auto md:h-full min-h-[300px]' : 'aspect-square'}`}>
                <img 
                  src={image.url} 
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-primary-foreground font-medium text-lg">
                    {image.alt}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Lightbox */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6 text-primary-foreground" />
          </button>
          
          {/* Navigation */}
          {currentIndex > 0 && (
            <button 
              className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            >
              <ChevronLeft className="w-6 h-6 text-primary-foreground" />
            </button>
          )}
          {currentIndex < galleryImages.length - 1 && (
            <button 
              className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
            >
              <ChevronRight className="w-6 h-6 text-primary-foreground" />
            </button>
          )}
          
          {/* Image */}
          <img 
            src={galleryImages.find(img => img.id === selectedImage)?.url}
            alt={galleryImages.find(img => img.id === selectedImage)?.alt}
            className="max-w-full max-h-[80vh] rounded-2xl shadow-elevated object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default GallerySection;
