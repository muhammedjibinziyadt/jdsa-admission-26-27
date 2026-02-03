import { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  X, 
  Home, 
  Info, 
  BookOpen, 
  GraduationCap, 
  Image, 
  MapPin, 
  Phone, 
  FileText,
  Star,
  Loader2
} from 'lucide-react';
import { useSearch, highlightMatch } from '@/hooks/useSearch';
import { WebsiteContent } from '@/hooks/useWebsiteContent';
import { cn } from '@/lib/utils';

interface GlobalSearchProps {
  content: WebsiteContent;
  isScrolled: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Info,
  BookOpen,
  GraduationCap,
  Image,
  MapPin,
  Phone,
  FileText,
  Star,
};

const GlobalSearch = ({ content, isScrolled }: GlobalSearchProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get search settings from content
  const searchSettings = content.searchSettings || { enabled: true, excludedSections: [] };
  
  const {
    query,
    results,
    isOpen,
    isSearching,
    searchEnabled,
    setIsOpen,
    handleSearch,
    clearSearch
  } = useSearch(content, searchSettings);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearSearch();
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [clearSearch]);

  // Handle result click
  const handleResultClick = useCallback((href: string) => {
    clearSearch();
    
    if (href.startsWith('/#')) {
      const sectionId = href.replace('/#', '');
      
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(href);
    }
  }, [navigate, location.pathname, clearSearch]);

  if (!searchEnabled) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input */}
      <div 
        className={cn(
          "relative flex items-center transition-all duration-300",
          isOpen ? "w-64 md:w-80" : "w-10 md:w-48"
        )}
      >
        {/* Mobile: Icon only when collapsed */}
        <button
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          className={cn(
            "md:hidden absolute left-0 p-2 rounded-xl transition-all duration-300",
            isOpen ? "opacity-0 pointer-events-none" : "opacity-100",
            isScrolled
              ? "text-foreground hover:bg-muted"
              : "text-primary-foreground hover:bg-primary-foreground/10"
          )}
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Search Input */}
        <div 
          className={cn(
            "relative flex items-center w-full transition-all duration-300",
            !isOpen && "md:flex hidden"
          )}
        >
          <Search 
            className={cn(
              "absolute left-3 w-4 h-4 transition-colors",
              isScrolled ? "text-muted-foreground" : "text-primary-foreground/70"
            )} 
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              handleSearch(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="തിരയുക..."
            className={cn(
              "w-full pl-10 pr-10 py-2 rounded-xl text-sm transition-all duration-300 outline-none",
              isScrolled
                ? "bg-muted/50 text-foreground placeholder:text-muted-foreground focus:bg-muted focus:ring-2 focus:ring-primary/20"
                : "bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-primary-foreground/20"
            )}
          />
          
          {/* Clear / Loading button */}
          {(query || isSearching) && (
            <button
              onClick={clearSearch}
              className={cn(
                "absolute right-3 p-1 rounded-full transition-colors",
                isScrolled
                  ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                  : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
              )}
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl border border-border shadow-elevated overflow-hidden z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200"
          style={{ minWidth: '280px', maxWidth: '400px' }}
        >
          {results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {results.map((result, index) => {
                const IconComponent = iconMap[result.icon || 'Star'] || Star;
                
                return (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result.href)}
                    className={cn(
                      "w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50",
                      index !== results.length - 1 && "border-b border-border/50"
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 
                        className="font-medium text-foreground text-sm line-clamp-1"
                        dangerouslySetInnerHTML={{ __html: highlightMatch(result.title, query) }}
                      />
                      <p 
                        className="text-xs text-muted-foreground line-clamp-2 mt-0.5"
                        dangerouslySetInnerHTML={{ __html: highlightMatch(result.description, query) }}
                      />
                      <span className="text-xs text-primary/70 mt-1 inline-block">
                        {result.type === 'page' && 'പേജ്'}
                        {result.type === 'section' && 'സെക്ഷൻ'}
                        {result.type === 'course' && 'കോഴ്‌സ്'}
                        {result.type === 'gallery' && 'ഗാലറി'}
                        {result.type === 'benefit' && 'നേട്ടം'}
                        {result.type === 'contact' && 'ബന്ധപ്പെടുക'}
                        {result.type === 'suffa' && 'സുഫ്ഫ'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center">
              <Search className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                "{query}" എന്നതിന് ഫലങ്ങളൊന്നും കണ്ടെത്തിയില്ല
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                മറ്റൊരു കീവേഡ് പരീക്ഷിക്കുക
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
