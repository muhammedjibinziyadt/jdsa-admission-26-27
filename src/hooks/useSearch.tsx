import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { WebsiteContent } from './useWebsiteContent';

export interface SearchResult {
  id: string;
  type: 'page' | 'section' | 'course' | 'gallery' | 'benefit' | 'contact' | 'suffa';
  title: string;
  description: string;
  href: string;
  matchedText: string;
  icon?: string;
}

interface SearchSettings {
  enabled: boolean;
  excludedSections: string[];
}

// Sanitize input to prevent XSS
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/[&'"]/g, '') // Remove special chars
    .trim()
    .slice(0, 100); // Limit length
};

// Escape regex special characters
const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Highlight matched text
export const highlightMatch = (text: string, query: string): string => {
  if (!query || query.length < 2) return text;
  
  const sanitizedQuery = sanitizeInput(query);
  const escapedQuery = escapeRegex(sanitizedQuery);
  
  try {
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return text.replace(regex, '<mark class="bg-primary/20 text-primary font-medium rounded px-0.5">$1</mark>');
  } catch {
    return text;
  }
};

export function useSearch(content: WebsiteContent, settings?: SearchSettings) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchEnabled = settings?.enabled !== false;
  const excludedSections = settings?.excludedSections || [];

  // Build searchable index from content
  const searchIndex = useMemo(() => {
    const items: SearchResult[] = [];

    // Check if section is excluded
    const isExcluded = (section: string) => excludedSections.includes(section);

    // Pages
    if (!isExcluded('home')) {
      items.push({
        id: 'page-home',
        type: 'page',
        title: 'ഹോം',
        description: 'മുഖ്യ പേജ് - ' + (content.hero?.title || 'ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസ്'),
        href: '/#home',
        matchedText: content.hero?.subtitle || '',
        icon: 'Home'
      });
    }

    if (!isExcluded('about')) {
      items.push({
        id: 'section-about',
        type: 'section',
        title: 'ഞങ്ങളെക്കുറിച്ച്',
        description: content.about?.description || 'ഞങ്ങളുടെ സ്ഥാപനത്തെക്കുറിച്ച്',
        href: '/#about',
        matchedText: content.about?.title + ' ' + content.about?.subtitle,
        icon: 'Info'
      });

      // About features
      content.about?.features?.forEach((feature, index) => {
        items.push({
          id: `feature-${index}`,
          type: 'section',
          title: feature.title,
          description: feature.description,
          href: '/#about',
          matchedText: feature.title + ' ' + feature.description,
          icon: 'Star'
        });
      });
    }

    // Courses
    if (!isExcluded('courses')) {
      items.push({
        id: 'section-courses',
        type: 'section',
        title: content.coursesSection?.title || 'കോഴ്‌സുകൾ',
        description: content.coursesSection?.description || 'പഠന പദ്ധതികൾ',
        href: '/#courses',
        matchedText: content.coursesSection?.subtitle || '',
        icon: 'BookOpen'
      });

      content.courses?.forEach((course) => {
        items.push({
          id: `course-${course.id}`,
          type: 'course',
          title: course.title,
          description: course.description,
          href: '/#courses',
          matchedText: course.subtitle + ' ' + course.description,
          icon: 'GraduationCap'
        });
      });
    }

    // Benefits
    if (!isExcluded('benefits')) {
      content.benefits?.forEach((benefit) => {
        items.push({
          id: `benefit-${benefit.id}`,
          type: 'benefit',
          title: benefit.title,
          description: benefit.description,
          href: '/#about',
          matchedText: benefit.title + ' ' + benefit.description,
          icon: benefit.icon
        });
      });
    }

    // Gallery
    if (!isExcluded('gallery')) {
      items.push({
        id: 'section-gallery',
        type: 'section',
        title: 'ഗാലറി',
        description: 'ഞങ്ങളുടെ സ്ഥാപനത്തിന്റെ വിവിധ ചിത്രങ്ങൾ',
        href: '/#gallery',
        matchedText: 'ഗാലറി ചിത്രങ്ങൾ ഫോട്ടോ',
        icon: 'Image'
      });

      content.gallery?.forEach((image) => {
        items.push({
          id: `gallery-${image.id}`,
          type: 'gallery',
          title: image.alt,
          description: 'ഗാലറി ചിത്രം',
          href: '/#gallery',
          matchedText: image.alt,
          icon: 'Image'
        });
      });
    }

    // Route Map
    if (!isExcluded('routeMap')) {
      items.push({
        id: 'section-routemap',
        type: 'section',
        title: 'റൂട്ട് മാപ്പ്',
        description: content.map?.address || 'ഞങ്ങളുടെ സ്ഥാനം',
        href: '/#route-map',
        matchedText: 'location map address സ്ഥലം മാപ്പ് ' + (content.map?.address || ''),
        icon: 'MapPin'
      });
    }

    // Contact
    if (!isExcluded('contact')) {
      items.push({
        id: 'section-contact',
        type: 'contact',
        title: 'ബന്ധപ്പെടുക',
        description: content.contact?.phone1 + ' | ' + (content.contact?.email || ''),
        href: '/#contact',
        matchedText: 'contact phone email ഫോൺ ബന്ധപ്പെടുക ' + content.contact?.address,
        icon: 'Phone'
      });
    }

    // Admission
    if (!isExcluded('admission')) {
      items.push({
        id: 'section-admission',
        type: 'section',
        title: 'അഡ്മിഷൻ',
        description: content.admissionForm?.title || 'വിദ്യാർത്ഥി പ്രവേശനം',
        href: '/#admission-form',
        matchedText: 'admission form apply application അഡ്മിഷൻ അപേക്ഷ പ്രവേശനം',
        icon: 'FileText'
      });
    }

    // Suffa page
    if (!isExcluded('suffa')) {
      items.push({
        id: 'page-suffa',
        type: 'suffa',
        title: content.suffa?.title || 'സുഫ്ഫ',
        description: content.suffa?.subtitle || 'ഇസ്‌ലാമിക വിദ്യാഭ്യാസത്തിന്റെ ചരിത്രപരമായ പാരമ്പര്യം',
        href: '/suffa',
        matchedText: content.suffa?.description?.slice(0, 200) || '',
        icon: 'BookOpen'
      });

      // Suffa sections
      content.suffa?.sections?.forEach((section) => {
        items.push({
          id: `suffa-section-${section.id}`,
          type: 'suffa',
          title: section.heading,
          description: section.content.slice(0, 100) + '...',
          href: '/suffa',
          matchedText: section.heading + ' ' + section.content,
          icon: 'BookOpen'
        });
      });
    }

    return items;
  }, [content, excludedSections]);

  // Search function with debouncing
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchEnabled) {
      setResults([]);
      return;
    }

    const sanitizedQuery = sanitizeInput(searchQuery);
    
    if (sanitizedQuery.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Case-insensitive partial match
    const queryLower = sanitizedQuery.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1);

    const matchedResults = searchIndex.filter(item => {
      const searchableText = (
        item.title + ' ' + 
        item.description + ' ' + 
        item.matchedText
      ).toLowerCase();

      // Match any of the query words
      return queryWords.some(word => searchableText.includes(word));
    }).slice(0, 10); // Limit results

    setResults(matchedResults);
    setIsSearching(false);
  }, [searchIndex, searchEnabled]);

  // Debounced search
  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 150); // Fast debounce for instant feel
  }, [performSearch]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    query,
    results,
    isOpen,
    isSearching,
    searchEnabled,
    setIsOpen,
    handleSearch,
    clearSearch
  };
}
