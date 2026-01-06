import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CoursesSection from "@/components/CoursesSection";
import StudentBenefits from "@/components/StudentBenefits";
import GallerySection from "@/components/GallerySection";
import RouteMapSection from "@/components/RouteMapSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SocialButtons from "@/components/SocialButtons";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { content, loading } = useWebsiteContent();

  useEffect(() => {
    const entered = sessionStorage.getItem('hasEntered');
    if (entered === 'true') {
      setShowSplash(false);
    }
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem('hasEntered', 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onEnter={handleEnter} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection content={content.hero} />
      <AboutSection content={content.about} />
      <CoursesSection courses={content.courses} />
      <StudentBenefits benefits={content.benefits} />
      <GallerySection images={content.gallery} />
      <RouteMapSection content={content.map} />
      <ContactSection content={content.contact} />
      <Footer content={content.footer} contact={content.contact} />
      <SocialButtons links={content.social} />
    </main>
  );
};

export default Index;
