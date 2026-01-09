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
      <SocialButtons 
        links={{
          whatsapp: "919544124059",
          facebook: "https://facebook.com/jawharathululoom",
          youtube: "https://youtube.com/@jawharathululoom",
          instagram: "https://instagram.com/jawharathululoom"
        }}
      />
    </main>
  );
};

export default Index;
