import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Settings } from "lucide-react";

const navLinks = [
  { href: "#home", label: "ഹോം", isSection: true },
  { href: "#about", label: "ഞങ്ങളെക്കുറിച്ച്", isSection: true },
  { href: "#courses", label: "കോഴ്‌സുകൾ", isSection: true },
  { href: "/suffa", label: "സുഫ്ഫ", isSection: false },
  { href: "#gallery", label: "ഗാലറി", isSection: true },
  { href: "#route-map", label: "റൂട്ട് മാപ്പ്", isSection: true },
  { href: "#admission-form", label: "അഡ്മിഷൻ", isSection: true },
  { href: "#contact", label: "ബന്ധപ്പെടുക", isSection: true },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (link: typeof navLinks[0]) => {
    setIsMobileMenuOpen(false);
    
    if (!link.isSection) {
      // It's a page link, navigate directly
      navigate(link.href);
      return;
    }

    // It's a section link
    if (location.pathname !== '/') {
      // Navigate to home first, then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(link.href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // Already on home, just scroll
      const element = document.querySelector(link.href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-lg shadow-soft py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick({ href: "#home", label: "ഹോം", isSection: true })}
            className="flex items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-xl emerald-gradient flex items-center justify-center shadow-soft group-hover:shadow-elevated transition-shadow">
              <span className="text-primary-foreground font-display font-bold text-lg">ج</span>
            </div>
            <div className="hidden sm:block">
              <span className={`font-display font-semibold text-lg block leading-tight ${isScrolled ? "text-foreground" : "text-primary-foreground"}`}>
                ജൗഹറത്തുൽ ഉലൂം
              </span>
              <span className={`text-xs font-medium ${isScrolled ? "text-muted-foreground" : "text-primary-foreground/70"}`}>
                സുഫ്ഫ ദർസ്
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-primary/10 ${
                  isScrolled
                    ? "text-foreground hover:text-primary"
                    : "text-primary-foreground hover:text-gold-light"
                }`}
              >
                {link.label}
              </button>
            ))}
            
            {/* Admin Link */}
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-primary/10 ${
                isScrolled
                  ? "text-foreground hover:text-primary"
                  : "text-primary-foreground hover:text-gold-light"
              }`}
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${
              isScrolled ? "text-foreground hover:bg-muted" : "text-primary-foreground hover:bg-primary-foreground/10"
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-card/98 backdrop-blur-lg border-t border-border shadow-elevated animate-fade-up">
            <div className="container mx-auto px-4 py-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link)}
                  className="block w-full text-left px-4 py-3 rounded-xl font-medium text-foreground hover:bg-muted hover:text-primary transition-all"
                >
                  {link.label}
                </button>
              ))}
              <Link
                to="/admin"
                className="block w-full text-left px-4 py-3 rounded-xl font-medium text-foreground hover:bg-muted hover:text-primary transition-all"
              >
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
