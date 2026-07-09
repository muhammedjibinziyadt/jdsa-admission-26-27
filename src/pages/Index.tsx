import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import Navigation from "@/components/Navigation";
import HeroSlider from "@/components/HeroSlider";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CoursesSection from "@/components/CoursesSection";
import StudentBenefits from "@/components/StudentBenefits";
import GallerySection from "@/components/GallerySection";
import RouteMapSection from "@/components/RouteMapSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ApprovedApplications from "@/components/ApprovedApplications";
import AdmissionCTA from "@/components/AdmissionCTA";
import HomeQuizBell from "@/components/HomeQuizBell";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { useAdmissions } from "@/hooks/useAdmissions";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { content, loading } = useWebsiteContent();
  const { getApprovedAdmissions } = useAdmissions();

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
    return <BrandedLoader />;
  }

  const approvedApplications = getApprovedAdmissions();

  const hasSliderImages = content.heroSlider?.enabled && content.heroSlider?.images && content.heroSlider.images.length > 0;

  return (
    <main className="min-h-screen">
      <Navigation content={content} />
      <HomeQuizBell />
      {hasSliderImages ? (
        <HeroSlider 
          images={content.heroSlider.images} 
          autoPlayInterval={content.heroSlider?.autoPlayInterval || 5000}
        />
      ) : (
        <HeroSection content={content.hero} />
      )}
      <AboutSection content={content.about} />
      <CoursesSection 
        courses={content.courses} 
        sectionTitle={content.coursesSection?.title}
        sectionSubtitle={content.coursesSection?.subtitle}
        sectionDescription={content.coursesSection?.description}
      />
      <StudentBenefits benefits={content.benefits} />
      {approvedApplications.length > 0 && (
        <ApprovedApplications applications={approvedApplications} />
      )}
      <GallerySection images={content.gallery} settings={content.gallerySettings} />
      <RouteMapSection content={content.map} />
      <AdmissionCTA />
      <ContactSection content={content.contact} />
      <Footer content={content.footer} contact={content.contact} social={content.social} />
    </main>
  );
};

export default Index;
