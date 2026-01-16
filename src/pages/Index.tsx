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
import ApprovedApplications from "@/components/ApprovedApplications";
import AdmissionFormSection from "@/components/AdmissionFormSection";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { useAdmissions } from "@/hooks/useAdmissions";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { content, loading } = useWebsiteContent();
  const { getApprovedAdmissions } = useAdmissions();
  const { settings: siteSettings } = useSiteSettings();

  useEffect(() => {
    const entered = sessionStorage.getItem('hasEntered');
    if (entered === 'true') {
      setShowSplash(false);
    }
  }, []);

  // Check if splash screen is disabled
  const splashEnabled = content?.splash?.enabled !== false;

  const handleEnter = () => {
    sessionStorage.setItem('hasEntered', 'true');
    setShowSplash(false);
  };

  if (showSplash && splashEnabled) {
    return <SplashScreen onEnter={handleEnter} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const approvedApplications = getApprovedAdmissions();

  return (
    <main className={`min-h-screen ${siteSettings.animations_enabled ? '' : 'no-animations'}`}>
      <Navigation content={content} />
      <HeroSection content={content.hero} />
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
      <AdmissionFormSection />
      <ContactSection content={content.contact} />
      <Footer content={content.footer} contact={content.contact} social={content.social} />
    </main>
  );
};

export default Index;
