import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';
import { useGalleryLikes } from '@/hooks/useGalleryLikes';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Suffa = () => {
  const { content, loading } = useWebsiteContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const suffaContent = content.suffa || {
    title: 'സുഫ്ഫ',
    subtitle: 'ഇസ്‌ലാമിക വിദ്യാഭ്യാസത്തിന്റെ ചരിത്രപരമായ പാരമ്പര്യം',
    description: `സുഫ്ഫ എന്നത് പ്രവാചകൻ മുഹമ്മദ് നബി(സ)യുടെ കാലത്ത് മദീനയിലെ മസ്ജിദ് നബവിയോട് ചേർന്ന് സ്ഥാപിതമായ ഒരു വിദ്യാഭ്യാസ കേന്ദ്രമായിരുന്നു. 

ഈ സ്ഥലം ദരിദ്രരായ മുഹാജിറുകൾക്ക് (മക്കയിൽ നിന്ന് മദീനയിലേക്ക് പലായനം ചെയ്തവർ) താമസസ്ഥലമായും വിദ്യാഭ്യാസ കേന്ദ്രമായും പ്രവർത്തിച്ചു. അഹ്‌ലുസ്സുഫ്ഫ (സുഫ്ഫയിലെ ജനങ്ങൾ) എന്ന് അറിയപ്പെട്ട ഈ സഹാബികൾ പ്രവാചകനിൽ നിന്ന് നേരിട്ട് ഇസ്‌ലാമിക വിജ്ഞാനം നേടി.

ഇന്ന്, സുഫ്ഫ എന്ന ആശയം ഇസ്‌ലാമിക വിദ്യാഭ്യാസ സ്ഥാപനങ്ങളുടെ മാതൃകയായി കണക്കാക്കപ്പെടുന്നു. ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസ് ഈ പാരമ്പര്യം തുടർന്നുകൊണ്ട്, ആധുനിക കാലഘട്ടത്തിൽ ഇസ്‌ലാമിക വിദ്യാഭ്യാസം പ്രദാനം ചെയ്യുന്നു.`,
    sections: [] as { id: string; heading: string; content: string }[],
    images: [] as { id: string; url: string; alt: string }[],
    downloadEnabled: true
  };

  const images = suffaContent.images || [];
  const { getLikeCount, isLiked, toggleLike } = useGalleryLikes();

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (translateX > 50) {
      handlePrev();
    } else if (translateX < -50) {
      handleNext();
    }
    setTranslateX(0);
  };

  const handleDownload = async (url: string, alt: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${alt || 'suffa-image'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation content={content} />

      {/* Featured Image — always first, immersive */}
      {images.length > 0 && (
        <section className="pt-16">
          <div className="relative w-full">
            <div
              ref={containerRef}
              className="overflow-hidden"
              onMouseDown={(e) => handleDragStart(e.clientX)}
              onMouseMove={(e) => handleDragMove(e.clientX)}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
              onTouchEnd={handleDragEnd}
            >
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{
                  transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
                }}
              >
                {images.map((image) => (
                  <div key={image.id} className="w-full flex-shrink-0 relative">
                    <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-muted overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        draggable={false}
                      />
                    </div>

                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleLike(image.id); }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                          isLiked(image.id) ? 'bg-red-500/90 text-white' : 'bg-card/80 text-foreground hover:bg-card'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked(image.id) ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">{getLikeCount(image.id)}</span>
                      </button>
                      {suffaContent.downloadEnabled && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDownload(image.url, image.alt); }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card/80 text-foreground hover:bg-card transition-all"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button variant="outline" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-card/80 shadow-soft hover:bg-card" onClick={handlePrev}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-card/80 shadow-soft hover:bg-card" onClick={handleNext}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}

            {/* Dots */}
            {images.length > 1 && (
              <div className="flex justify-center gap-2 py-4 bg-background">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Hero / Title */}
      <section className={`${images.length > 0 ? 'py-10' : 'pt-24 pb-10'} px-4`}>
        <div className="container mx-auto max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>ഹോം</span>
          </Link>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {suffaContent.title}
          </h1>

          {suffaContent.subtitle && (
            <p className="text-xl text-muted-foreground font-medium">
              {suffaContent.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-foreground/90 whitespace-pre-line leading-relaxed text-lg">
              {suffaContent.description}
            </p>
          </div>

          {/* Additional Sections */}
          {suffaContent.sections && suffaContent.sections.length > 0 && (
            <div className="space-y-8 mb-12">
              {suffaContent.sections.map((section) => (
                <div key={section.id} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                  <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                    {section.heading}
                  </h2>
                  <p className="text-foreground/80 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Suhba Subsection */}
          <div className="mt-16 border-t border-border/50 pt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  സുഹ്ബ
                </h2>
                <p className="text-sm text-muted-foreground">സുഫ്ഫയുടെ ഭാഗം</p>
              </div>
            </div>

            <p className="text-foreground/90 leading-relaxed text-lg mb-6">
              സുഹ്ബ എന്നത് ആത്മീയ സഹവാസത്തിന്റെയും പരസ്പര പഠനത്തിന്റെയും ഒരു പാരമ്പര്യമാണ്. 
              ഉസ്താദുമാരുടെയും വിദ്യാർത്ഥികളുടെയും ഇടയിലെ ആത്മീയ ബന്ധവും അറിവ് 
              കൈമാറ്റവും ഈ ഭാഗത്ത് ഊന്നിപ്പറയുന്നു. ഇസ്‌ലാമിക പാരമ്പര്യത്തിൽ സുഹ്ബ 
              ഒരു പ്രധാന പഠന രീതിയായി കണക്കാക്കപ്പെടുന്നു.
            </p>

            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
              <p className="text-foreground/80 leading-relaxed">
                ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസിൽ, സുഹ്ബയുടെ ഈ മഹത്തായ പാരമ്പര്യം 
                നിലനിർത്തിക്കൊണ്ട്, വിദ്യാർത്ഥികൾക്ക് ഗുരുക്കന്മാരുമായി 
                നേരിട്ടുള്ള ആത്മീയ സഹവാസത്തിനുള്ള അവസരം ഒരുക്കുന്നു.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer content={content.footer} contact={content.contact} social={content.social} />
    </main>
  );
};

export default Suffa;
