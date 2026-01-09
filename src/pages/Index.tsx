import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CoursesSection from "@/components/CoursesSection";
import StudentBenefits from "@/components/StudentBenefits";
import GallerySection from "@/components/GallerySection";
import RouteMapSection from "@/components/RouteMapSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <CoursesSection />
      <StudentBenefits />
      <GallerySection />
      <RouteMapSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
