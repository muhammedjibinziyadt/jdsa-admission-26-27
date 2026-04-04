import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Settings } from "lucide-react";
import GlobalSearch from "./GlobalSearch";
import { WebsiteContent } from "@/hooks/useWebsiteContent";

const navLinks = [
  { href: "#home", label: "ഹോം", isSection: true },
  { href: "#about", label: "ഞങ്ങളെക്കുറിച്ച്", isSection: true },
  { href: "#courses", label: "കോഴ്‌സുകൾ", isSection: true },
  { href: "/suffa", label: "സുഫ്ഫ", isSection: false },
  { href: "#gallery", label: "ഗാലറി", isSection: true },
  { href: "#route-map", label: "റൂട്ട് മാപ്പ്", isSection: true },
  { href: "#admission-form", label: "അഡ്മിഷൻ", isSection: true },
  { href: "/students-portal", label: "സ്റ്റുഡൻസ് പോർട്ടൽ", isSection: false },
  { href: "/bookstore", label: "ബുക്ക് സ്റ്റോർ", isSection: false },
  { href: "#contact", label: "ബന്ധപ്പെടുക", isSection: true },
];

interface NavigationProps {
  content?: WebsiteContent;
}

const Navigation = ({ content }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (link: typeof navLinks[0]) => {
    setIsMobileMenuOpen(false);
    if (!link.isSection) { navigate(link.href); return; }
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(link.href);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.querySelector(link.href);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-card shadow-soft py-3" : "bg-primary py-4"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => handleNavClick({ href: "#home", label: "ഹോം", isSection: true })} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg emerald-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-base">ج</span>
            </div>
            <div className="hidden sm:block">
              <span className={`font-display font-semibold text-base block leading-tight ${isScrolled ? "text-foreground" : "text-primary-foreground"}`}>
                ജൗഹറത്തുൽ ഉലൂം
              </span>
              <span className={`text-xs ${isScrolled ? "text-muted-foreground" : "text-primary-foreground/60"}`}>
                സുഫ്ഫ ദർസ്
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {content && <GlobalSearch content={content} isScrolled={isScrolled} />}
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link)}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                  isScrolled ? "text-foreground hover:text-primary hover:bg-muted" : "text-primary-foreground/90 hover:text-primary-foreground hover:bg-white/10"
                }`}
              >
                {link.label}
              </button>
            ))}
            <Link to="/admin" className={`px-3 py-2 rounded-lg transition-colors ${
              isScrolled ? "text-foreground hover:text-primary hover:bg-muted" : "text-primary-foreground/90 hover:text-primary-foreground hover:bg-white/10"
            }`}>
              <Settings className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            {content && <GlobalSearch content={content} isScrolled={isScrolled} />}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled ? "text-foreground hover:bg-muted" : "text-primary-foreground hover:bg-white/10"
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-card border-t border-border shadow-soft animate-fade-in">
            <div className="container mx-auto px-4 py-3">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link)}
                  className="block w-full text-left px-4 py-3 rounded-lg font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <Link to="/admin" className="block w-full text-left px-4 py-3 rounded-lg font-medium text-foreground hover:bg-muted hover:text-primary transition-colors">
                <Settings className="w-4 h-4 inline mr-2" />
                അഡ്മിൻ
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;