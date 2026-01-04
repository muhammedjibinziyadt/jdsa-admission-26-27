import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Edit3, 
  Image as ImageIcon, 
  Trash2, 
  Plus, 
  Save,
  X,
  BookOpen,
  Settings,
  MapPin,
  FileText,
  Users,
  Share2,
  Phone,
  Mail,
  Clock,
  Home,
  MessageSquare,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// All editable sections
interface SiteContent {
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  admissionBadge: string;
  ctaButton: string;
  
  // Contact Info
  phone1: string;
  phone2: string;
  email: string;
  timing: string;
  location: string;
  
  // About Section
  aboutBadge: string;
  aboutTitle: string;
  aboutHighlight: string;
  aboutDescription: string;
  missionQuote: string;
  missionSource: string;
  
  // Courses Section
  coursesBadge: string;
  coursesTitle: string;
  coursesHighlight: string;
  coursesDescription: string;
  
  // Student Benefits
  benefitsBadge: string;
  benefitsTitle: string;
  benefitsHighlight: string;
  benefitsDescription: string;
  
  // Gallery Section
  galleryBadge: string;
  galleryTitle: string;
  galleryHighlight: string;
  galleryDescription: string;
  
  // Contact Section
  contactBadge: string;
  contactTitle: string;
  contactHighlight: string;
  contactDescription: string;
  helplineTitle: string;
  helplineSubtitle: string;
  enquiryTitle: string;
  
  // Route Map
  mapLink: string;
  mapTitle: string;
  mapDescription: string;
  
  // Footer
  footerDescription: string;
  footerCopyright: string;
  
  // Social Links
  whatsapp: string;
  facebook: string;
  youtube: string;
  instagram: string;
}

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

interface Course {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  syllabus: string;
  imageUrl: string;
  featured: boolean;
}

interface AboutFeature {
  id: number;
  title: string;
  description: string;
}

interface Benefit {
  id: number;
  title: string;
  description: string;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "courses" | "benefits" | "gallery" | "contact" | "map" | "footer" | "social">("hero");
  
  // Site Content
  const [content, setContent] = useState<SiteContent>({
    // Hero
    heroTitle: "ജവ്ഹറത്തുൽ ഉലൂം",
    heroSubtitle: "സുഫ്ഫാ ദർസ്",
    heroDescription: "വിജ്ഞാനത്തിന്റെയും മൂല്യങ്ങളുടെയും സമന്വയത്തിലൂടെ പുതിയ തലമുറയെ രൂപപ്പെടുത്തുന്ന വിദ്യാഭ്യാസ കേന്ദ്രം",
    admissionBadge: "Admissions Open 2025-26",
    ctaButton: "കൂടുതൽ അറിയാൻ",
    
    // Contact
    phone1: "+91 95441 24059",
    phone2: "+91 82811 02606",
    email: "info@jawharathululoom.com",
    timing: "രാവിലെ 8:00 - വൈകുന്നേരം 5:00",
    location: "ജവ്ഹറത്തുൽ ഉലൂം സുഫ്ഫാ ദർസ്, കേരളം, ഇന്ത്യ",
    
    // About
    aboutBadge: "ഞങ്ങളെക്കുറിച്ച്",
    aboutTitle: "വിജ്ഞാനത്തിന്റെ",
    aboutHighlight: "വെളിച്ചം",
    aboutDescription: "ജവ്ഹറത്തുൽ ഉലൂം സുഫ്ഫാ ദർസ് ഇസ്ലാമിക വിദ്യാഭ്യാസത്തിന്റെയും ആധുനിക കഴിവുകളുടെയും സമന്വയത്തിലൂടെ വിദ്യാർത്ഥികളെ ഭാവിയിലേക്ക് സജ്ജമാക്കുന്നു.",
    missionQuote: "വിദ്യ അഭ്യസിക്കുന്നത് ഓരോ മുസ്ലിമിനും ഫർദാണ്",
    missionSource: "— نبوی حدیث",
    
    // Courses
    coursesBadge: "പഠന പദ്ധതികൾ",
    coursesTitle: "ഞങ്ങളുടെ",
    coursesHighlight: "കോഴ്‌സുകൾ",
    coursesDescription: "സമഗ്രമായ വിദ്യാഭ്യാസ പദ്ധതിയിലൂടെ വിദ്യാർത്ഥികളെ എല്ലാ മേഖലകളിലും മികവുറ്റവരാക്കുന്നു",
    
    // Benefits
    benefitsBadge: "വിദ്യാർത്ഥി നേട്ടങ്ങൾ",
    benefitsTitle: "എന്തുകൊണ്ട്",
    benefitsHighlight: "ഞങ്ങളെ തിരഞ്ഞെടുക്കണം?",
    benefitsDescription: "ഞങ്ങളുടെ സ്ഥാപനത്തിൽ നിന്ന് വിദ്യാർത്ഥികൾക്ക് ലഭിക്കുന്ന പ്രധാന നേട്ടങ്ങൾ",
    
    // Gallery
    galleryBadge: "ഫോട്ടോ ഗാലറി",
    galleryTitle: "ഞങ്ങളുടെ",
    galleryHighlight: "നിമിഷങ്ങൾ",
    galleryDescription: "വിദ്യാഭ്യാസ യാത്രയിലെ മനോഹരമായ നിമിഷങ്ങൾ",
    
    // Contact
    contactBadge: "ബന്ധപ്പെടുക",
    contactTitle: "അഡ്മിഷൻ",
    contactHighlight: "എടുക്കാം",
    contactDescription: "നിങ്ങളുടെ കുട്ടിയുടെ ഭാവി രൂപപ്പെടുത്താൻ ഇന്നുതന്നെ ഞങ്ങളെ ബന്ധപ്പെടുക",
    helplineTitle: "അഡ്മിഷൻ ഹെൽപ്‌ലൈൻ",
    helplineSubtitle: "ഇപ്പോൾ വിളിക്കൂ",
    enquiryTitle: "അഡ്മിഷൻ അന്വേഷണം",
    
    // Map
    mapLink: "https://maps.app.goo.gl/ZN8C3epBni6h3hKn9?g_st=aw",
    mapTitle: "ഞങ്ങളുടെ സ്ഥാനം",
    mapDescription: "ഞങ്ങളെ എങ്ങനെ എത്തിച്ചേരാം",
    
    // Footer
    footerDescription: "വിജ്ഞാനത്തിന്റെയും മൂല്യങ്ങളുടെയും സമന്വയത്തിലൂടെ പുതിയ തലമുറയെ രൂപപ്പെടുത്തുന്ന വിദ്യാഭ്യാസ കേന്ദ്രം",
    footerCopyright: "ജവ്ഹറത്തുൽ ഉലൂം സുഫ്ഫാ ദർസ്",
    
    // Social
    whatsapp: "919544124059",
    facebook: "https://facebook.com/jawharathululoom",
    youtube: "https://youtube.com/@jawharathululoom",
    instagram: "https://instagram.com/jawharathululoom"
  });

  // Gallery Images
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
    { id: 1, src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&h=400&fit=crop", alt: "ക്ലാസ് റൂം പഠനം" },
    { id: 2, src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop", alt: "ലൈബ്രറി" },
    { id: 3, src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop", alt: "ഗ്രന്ഥപഠനം" },
    { id: 4, src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop", alt: "വിദ്യാർത്ഥികൾ" },
    { id: 5, src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop", alt: "ക്ലാസ് മുറി" },
    { id: 6, src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&h=400&fit=crop", alt: "പ്രാർത്ഥന" }
  ]);

  // Courses
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, title: "സുഫ്ഫാ കോഴ്‌സിന് കീഴിലെ ദർസ്", subtitle: "", description: "പരമ്പരാഗത ഇസ്ലാമിക വിദ്യാഭ്യാസ പദ്ധതിയിലൂടെ ആഴത്തിലുള്ള മതപഠനം", syllabus: "", imageUrl: "", featured: true },
    { id: 2, title: "ഖുർആൻ പഠനം", subtitle: "എഴുത്തും വായനയും", description: "ഖുർആൻ എഴുത്തും വായനയും തജ്‌വീദും", syllabus: "", imageUrl: "", featured: false },
    { id: 3, title: "കമ്പ്യൂട്ടർ പഠനം", subtitle: "", description: "ആധുനിക ലോകത്തേക്കുള്ള ഡിജിറ്റൽ കഴിവുകൾ", syllabus: "", imageUrl: "", featured: false },
    { id: 4, title: "എഴുത്ത് പഠനം", subtitle: "Handwriting & Writing Skills", description: "കൈയെഴുത്തും എഴുത്തു വൈദഗ്ധ്യവും", syllabus: "", imageUrl: "", featured: false },
    { id: 5, title: "പ്രസംഗ പരിശീലനം", subtitle: "Public Speaking", description: "പബ്ലിക് സ്പീക്കിംഗും ദർസ് പരിശീലനവും", syllabus: "", imageUrl: "", featured: false },
    { id: 6, title: "വഅള് പരിശീലനം", subtitle: "", description: "മത പ്രഭാഷണ കലയും ആശയവിനിമയവും", syllabus: "", imageUrl: "", featured: false },
    { id: 7, title: "വ്യക്തിത്വ വികസനം", subtitle: "", description: "നേതൃത്വ ഗുണങ്ങളും സ്വഭാവ രൂപീകരണവും", syllabus: "", imageUrl: "", featured: false },
    { id: 8, title: "ലൈബ്രറി സൗകര്യം", subtitle: "", description: "വിപുലമായ ഗ്രന്ഥശേഖരവും വായനാ സൗകര്യവും", syllabus: "", imageUrl: "", featured: false },
    { id: 9, title: "കാന്റീൻ സൗകര്യം", subtitle: "", description: "ആരോഗ്യകരമായ ഭക്ഷണവും സ്നാക്കുകളും", syllabus: "", imageUrl: "", featured: false }
  ]);

  // About Features
  const [aboutFeatures, setAboutFeatures] = useState<AboutFeature[]>([
    { id: 1, title: "മതപരമായ വിദ്യാഭ്യാസം", description: "ഖുർആൻ, ഹദീസ്, ഫിഖ്ഹ് എന്നിവയിൽ ആഴത്തിലുള്ള പഠനം" },
    { id: 2, title: "മൂല്യാധിഷ്ഠിത പരിശീലനം", description: "സ്വഭാവ രൂപീകരണവും ധാർമിക മൂല്യങ്ങളും" },
    { id: 3, title: "സമഗ്ര വികസനം", description: "വ്യക്തിത്വ വികസനവും നേതൃത്വ പരിശീലനവും" },
    { id: 4, title: "ആധുനിക കഴിവുകൾ", description: "കമ്പ്യൂട്ടർ പഠനവും പ്രായോഗിക വൈദഗ്ധ്യവും" }
  ]);

  // Benefits
  const [benefits, setBenefits] = useState<Benefit[]>([
    { id: 1, title: "അച്ചടക്കം", description: "ജീവിതത്തിന്റെ എല്ലാ മേഖലകളിലും അച്ചടക്കം പാലിക്കാൻ പരിശീലനം" },
    { id: 2, title: "വിജ്ഞാനം", description: "മതപരവും ഭൗതികവുമായ വിജ്ഞാനത്തിൽ പ്രാവീണ്യം" },
    { id: 3, title: "സ്വഭാവ ശുദ്ധി", description: "ഇസ്ലാമിക മൂല്യങ്ങളിൽ അധിഷ്ഠിതമായ സ്വഭാവ രൂപീകരണം" },
    { id: 4, title: "ആത്മവിശ്വാസം", description: "ഏത് സാഹചര്യത്തിലും ആത്മവിശ്വാസത്തോടെ പ്രവർത്തിക്കാൻ" },
    { id: 5, title: "നേതൃത്വം", description: "സമൂഹത്തിൽ നേതൃത്വം വഹിക്കാനുള്ള കഴിവ്" },
    { id: 6, title: "കഴിവ് വികസനം", description: "ആധുനിക ലോകത്തിന് ആവശ്യമായ കഴിവുകൾ" }
  ]);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [editingCourse, setEditingCourse] = useState<number | null>(null);
  const [tempCourse, setTempCourse] = useState<Course | null>(null);
  const [editingFeature, setEditingFeature] = useState<number | null>(null);
  const [tempFeature, setTempFeature] = useState<AboutFeature | null>(null);
  const [editingBenefit, setEditingBenefit] = useState<number | null>(null);
  const [tempBenefit, setTempBenefit] = useState<Benefit | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  const handleEdit = (field: string, value: string) => {
    setEditingField(field);
    setTempValue(value);
  };

  const handleSave = (field: keyof SiteContent) => {
    setContent(prev => ({ ...prev, [field]: tempValue }));
    setEditingField(null);
    toast({ title: "സേവ് ചെയ്തു!", description: "മാറ്റങ്ങൾ വിജയകരമായി സേവ് ചെയ്തു." });
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleDeleteImage = (id: number) => {
    setGalleryImages(prev => prev.filter(img => img.id !== id));
    toast({ title: "ഇമേജ് ഡിലീറ്റ് ചെയ്തു!", description: "ഗാലറിയിൽ നിന്നും ഇമേജ് നീക്കം ചെയ്തു." });
  };

  const handleAddImage = () => {
    if (newImageUrl && newImageAlt) {
      const newId = Math.max(...galleryImages.map(img => img.id), 0) + 1;
      setGalleryImages(prev => [...prev, { id: newId, src: newImageUrl, alt: newImageAlt }]);
      setNewImageUrl("");
      setNewImageAlt("");
      toast({ title: "ഇമേജ് ചേർത്തു!", description: "പുതിയ ഇമേജ് ഗാലറിയിലേക്ക് ചേർത്തു." });
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course.id);
    setTempCourse({ ...course });
  };

  const handleSaveCourse = () => {
    if (tempCourse) {
      setCourses(prev => prev.map(c => c.id === tempCourse.id ? tempCourse : c));
      setEditingCourse(null);
      setTempCourse(null);
      toast({ title: "കോഴ്‌സ് അപ്‌ഡേറ്റ് ചെയ്തു!" });
    }
  };

  const handleDeleteCourse = (id: number) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    toast({ title: "കോഴ്‌സ് ഡിലീറ്റ് ചെയ്തു!" });
  };

  const handleAddCourse = () => {
    const newId = Math.max(...courses.map(c => c.id), 0) + 1;
    setCourses(prev => [...prev, { id: newId, title: "പുതിയ കോഴ്‌സ്", subtitle: "", description: "കോഴ്‌സ് വിവരണം", syllabus: "", imageUrl: "", featured: false }]);
    toast({ title: "കോഴ്‌സ് ചേർത്തു!" });
  };

  const handleEditFeature = (feature: AboutFeature) => {
    setEditingFeature(feature.id);
    setTempFeature({ ...feature });
  };

  const handleSaveFeature = () => {
    if (tempFeature) {
      setAboutFeatures(prev => prev.map(f => f.id === tempFeature.id ? tempFeature : f));
      setEditingFeature(null);
      setTempFeature(null);
      toast({ title: "ഫീച്ചർ അപ്‌ഡേറ്റ് ചെയ്തു!" });
    }
  };

  const handleDeleteFeature = (id: number) => {
    setAboutFeatures(prev => prev.filter(f => f.id !== id));
    toast({ title: "ഫീച്ചർ ഡിലീറ്റ് ചെയ്തു!" });
  };

  const handleAddFeature = () => {
    const newId = Math.max(...aboutFeatures.map(f => f.id), 0) + 1;
    setAboutFeatures(prev => [...prev, { id: newId, title: "പുതിയ ഫീച്ചർ", description: "വിവരണം" }]);
    toast({ title: "ഫീച്ചർ ചേർത്തു!" });
  };

  const handleEditBenefit = (benefit: Benefit) => {
    setEditingBenefit(benefit.id);
    setTempBenefit({ ...benefit });
  };

  const handleSaveBenefit = () => {
    if (tempBenefit) {
      setBenefits(prev => prev.map(b => b.id === tempBenefit.id ? tempBenefit : b));
      setEditingBenefit(null);
      setTempBenefit(null);
      toast({ title: "ബെനിഫിറ്റ് അപ്‌ഡേറ്റ് ചെയ്തു!" });
    }
  };

  const handleDeleteBenefit = (id: number) => {
    setBenefits(prev => prev.filter(b => b.id !== id));
    toast({ title: "ബെനിഫിറ്റ് ഡിലീറ്റ് ചെയ്തു!" });
  };

  const handleAddBenefit = () => {
    const newId = Math.max(...benefits.map(b => b.id), 0) + 1;
    setBenefits(prev => [...prev, { id: newId, title: "പുതിയ നേട്ടം", description: "വിവരണം" }]);
    toast({ title: "നേട്ടം ചേർത്തു!" });
  };

  const tabs = [
    { id: "hero" as const, label: "ഹീറോ", icon: Home },
    { id: "about" as const, label: "അബൗട്ട്", icon: MessageSquare },
    { id: "courses" as const, label: "കോഴ്‌സുകൾ", icon: BookOpen },
    { id: "benefits" as const, label: "നേട്ടങ്ങൾ", icon: Users },
    { id: "gallery" as const, label: "ഗാലറി", icon: ImageIcon },
    { id: "contact" as const, label: "കോൺടാക്ട്", icon: Phone },
    { id: "map" as const, label: "മാപ്പ്", icon: MapPin },
    { id: "footer" as const, label: "ഫൂട്ടർ", icon: FileText },
    { id: "social" as const, label: "സോഷ്യൽ", icon: Share2 },
  ];

  const renderContentEditor = (fields: { key: keyof SiteContent; label: string; multiline?: boolean }[]) => (
    <div className="space-y-4">
      {fields.map(field => (
        <div key={field.key} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">{field.label}</label>
              {editingField === field.key ? (
                <div className="space-y-3">
                  {field.multiline ? (
                    <textarea value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none" rows={4} />
                  ) : (
                    <input type="text" value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors" />
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSave(field.key)} className="rounded-lg"><Save className="w-4 h-4 mr-1" />സേവ്</Button>
                    <Button size="sm" variant="outline" onClick={handleCancel} className="rounded-lg"><X className="w-4 h-4 mr-1" />റദ്ദാക്കുക</Button>
                  </div>
                </div>
              ) : (
                <p className="text-foreground">{content[field.key]}</p>
              )}
            </div>
            {editingField !== field.key && (
              <Button size="sm" variant="ghost" onClick={() => handleEdit(field.key, content[field.key])} className="text-primary hover:text-primary">
                <Edit3 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>ഹോം</span>
            </Link>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <h1 className="font-display text-xl font-bold text-foreground">അഡ്മിൻ ഡാഷ്‌ബോർഡ്</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <Button key={tab.id} variant={activeTab === tab.id ? "default" : "outline"} onClick={() => setActiveTab(tab.id)} className="rounded-xl whitespace-nowrap">
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Hero Tab */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">ഹീറോ സെക്ഷൻ എഡിറ്റ് ചെയ്യുക</h2>
            {renderContentEditor([
              { key: "heroTitle", label: "ടൈറ്റിൽ (ആദ്യ വരി)" },
              { key: "heroSubtitle", label: "സബ്‌ടൈറ്റിൽ (രണ്ടാം വരി)" },
              { key: "heroDescription", label: "വിവരണം", multiline: true },
              { key: "admissionBadge", label: "അഡ്മിഷൻ ബാഡ്ജ്" },
              { key: "ctaButton", label: "CTA ബട്ടൺ ടെക്സ്റ്റ്" },
              { key: "phone1", label: "ഫോൺ 1" },
              { key: "phone2", label: "ഫോൺ 2" },
            ])}
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">അബൗട്ട് സെക്ഷൻ</h2>
            {renderContentEditor([
              { key: "aboutBadge", label: "ബാഡ്ജ്" },
              { key: "aboutTitle", label: "ടൈറ്റിൽ" },
              { key: "aboutHighlight", label: "ഹൈലൈറ്റ്" },
              { key: "aboutDescription", label: "വിവരണം", multiline: true },
              { key: "missionQuote", label: "മിഷൻ ക്വോട്ട്", multiline: true },
              { key: "missionSource", label: "ക്വോട്ട് സോഴ്സ്" },
            ])}
            
            {/* About Features */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-semibold text-foreground">ഫീച്ചറുകൾ</h3>
                <Button onClick={handleAddFeature} className="rounded-xl"><Plus className="w-4 h-4 mr-2" />ചേർക്കുക</Button>
              </div>
              <div className="space-y-4">
                {aboutFeatures.map(feature => (
                  <div key={feature.id} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                    {editingFeature === feature.id && tempFeature ? (
                      <div className="space-y-4">
                        <input type="text" value={tempFeature.title} onChange={(e) => setTempFeature({ ...tempFeature, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background" placeholder="ടൈറ്റിൽ" />
                        <textarea value={tempFeature.description} onChange={(e) => setTempFeature({ ...tempFeature, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background resize-none" rows={2} placeholder="വിവരണം" />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveFeature} className="rounded-lg"><Save className="w-4 h-4 mr-1" />സേവ്</Button>
                          <Button size="sm" variant="outline" onClick={() => { setEditingFeature(null); setTempFeature(null); }} className="rounded-lg"><X className="w-4 h-4 mr-1" />റദ്ദാക്കുക</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-foreground">{feature.title}</h4>
                          <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditFeature(feature)}><Edit3 className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteFeature(feature.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">കോഴ്‌സ് സെക്ഷൻ</h2>
            {renderContentEditor([
              { key: "coursesBadge", label: "ബാഡ്ജ്" },
              { key: "coursesTitle", label: "ടൈറ്റിൽ" },
              { key: "coursesHighlight", label: "ഹൈലൈറ്റ്" },
              { key: "coursesDescription", label: "വിവരണം", multiline: true },
            ])}
            
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-semibold text-foreground">കോഴ്‌സുകൾ</h3>
                <Button onClick={handleAddCourse} className="rounded-xl"><Plus className="w-4 h-4 mr-2" />പുതിയ കോഴ്‌സ്</Button>
              </div>
              <div className="space-y-4">
                {courses.map(course => (
                  <div key={course.id} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                    {editingCourse === course.id && tempCourse ? (
                      <div className="space-y-4">
                        <input type="text" value={tempCourse.title} onChange={(e) => setTempCourse({ ...tempCourse, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background" placeholder="ടൈറ്റിൽ" />
                        <input type="text" value={tempCourse.subtitle} onChange={(e) => setTempCourse({ ...tempCourse, subtitle: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background" placeholder="സബ്‌ടൈറ്റിൽ" />
                        <textarea value={tempCourse.description} onChange={(e) => setTempCourse({ ...tempCourse, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background resize-none" rows={2} placeholder="വിവരണം" />
                        <input type="text" value={tempCourse.syllabus} onChange={(e) => setTempCourse({ ...tempCourse, syllabus: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background" placeholder="സിലബസ് URL" />
                        <input type="text" value={tempCourse.imageUrl} onChange={(e) => setTempCourse({ ...tempCourse, imageUrl: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background" placeholder="ഇമേജ് URL" />
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={tempCourse.featured} onChange={(e) => setTempCourse({ ...tempCourse, featured: e.target.checked })} className="rounded" />
                          <span className="text-sm">ഫീച്ചേഡ് കോഴ്‌സ്</span>
                        </label>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveCourse} className="rounded-lg"><Save className="w-4 h-4 mr-1" />സേവ്</Button>
                          <Button size="sm" variant="outline" onClick={() => { setEditingCourse(null); setTempCourse(null); }} className="rounded-lg"><X className="w-4 h-4 mr-1" />റദ്ദാക്കുക</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">{course.title}</h4>
                            {course.featured && <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold-dark text-xs">Featured</span>}
                          </div>
                          {course.subtitle && <p className="text-sm text-muted-foreground">{course.subtitle}</p>}
                          <p className="text-muted-foreground text-sm mt-1">{course.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditCourse(course)}><Edit3 className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteCourse(course.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Benefits Tab */}
        {activeTab === "benefits" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">നേട്ടങ്ങൾ സെക്ഷൻ</h2>
            {renderContentEditor([
              { key: "benefitsBadge", label: "ബാഡ്ജ്" },
              { key: "benefitsTitle", label: "ടൈറ്റിൽ" },
              { key: "benefitsHighlight", label: "ഹൈലൈറ്റ്" },
              { key: "benefitsDescription", label: "വിവരണം", multiline: true },
            ])}
            
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-semibold text-foreground">നേട്ടങ്ങൾ</h3>
                <Button onClick={handleAddBenefit} className="rounded-xl"><Plus className="w-4 h-4 mr-2" />ചേർക്കുക</Button>
              </div>
              <div className="space-y-4">
                {benefits.map(benefit => (
                  <div key={benefit.id} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                    {editingBenefit === benefit.id && tempBenefit ? (
                      <div className="space-y-4">
                        <input type="text" value={tempBenefit.title} onChange={(e) => setTempBenefit({ ...tempBenefit, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background" placeholder="ടൈറ്റിൽ" />
                        <textarea value={tempBenefit.description} onChange={(e) => setTempBenefit({ ...tempBenefit, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background resize-none" rows={2} placeholder="വിവരണം" />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveBenefit} className="rounded-lg"><Save className="w-4 h-4 mr-1" />സേവ്</Button>
                          <Button size="sm" variant="outline" onClick={() => { setEditingBenefit(null); setTempBenefit(null); }} className="rounded-lg"><X className="w-4 h-4 mr-1" />റദ്ദാക്കുക</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                          <p className="text-muted-foreground text-sm">{benefit.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditBenefit(benefit)}><Edit3 className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteBenefit(benefit.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">ഗാലറി സെക്ഷൻ</h2>
            {renderContentEditor([
              { key: "galleryBadge", label: "ബാഡ്ജ്" },
              { key: "galleryTitle", label: "ടൈറ്റിൽ" },
              { key: "galleryHighlight", label: "ഹൈലൈറ്റ്" },
              { key: "galleryDescription", label: "വിവരണം", multiline: true },
            ])}
            
            {/* Add New Image */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft mt-8">
              <h3 className="font-medium text-foreground mb-4">പുതിയ ഇമേജ് ചേർക്കുക</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input type="url" placeholder="ഇമേജ് URL" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} className="px-4 py-3 rounded-xl border border-border bg-background" />
                <input type="text" placeholder="ഇമേജ് വിവരണം" value={newImageAlt} onChange={(e) => setNewImageAlt(e.target.value)} className="px-4 py-3 rounded-xl border border-border bg-background" />
              </div>
              <Button onClick={handleAddImage} className="rounded-xl"><Plus className="w-4 h-4 mr-2" />ഇമേജ് ചേർക്കുക</Button>
            </div>

            {/* Gallery Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map(image => (
                <div key={image.id} className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 shadow-soft">
                  <img src={image.src} alt={image.alt} className="w-full aspect-video object-cover" />
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(image.id)} className="rounded-lg"><Trash2 className="w-4 h-4 mr-1" />ഡിലീറ്റ്</Button>
                  </div>
                  <div className="p-4"><p className="text-sm text-foreground">{image.alt}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">കോൺടാക്ട് സെക്ഷൻ</h2>
            {renderContentEditor([
              { key: "contactBadge", label: "ബാഡ്ജ്" },
              { key: "contactTitle", label: "ടൈറ്റിൽ" },
              { key: "contactHighlight", label: "ഹൈലൈറ്റ്" },
              { key: "contactDescription", label: "വിവരണം", multiline: true },
              { key: "helplineTitle", label: "ഹെൽപ്‌ലൈൻ ടൈറ്റിൽ" },
              { key: "helplineSubtitle", label: "ഹെൽപ്‌ലൈൻ സബ്‌ടൈറ്റിൽ" },
              { key: "enquiryTitle", label: "എൻക്വയറി ടൈറ്റിൽ" },
              { key: "phone1", label: "ഫോൺ 1" },
              { key: "phone2", label: "ഫോൺ 2" },
              { key: "email", label: "ഇമെയിൽ" },
              { key: "timing", label: "സമയം" },
              { key: "location", label: "സ്ഥലം", multiline: true },
            ])}
          </div>
        )}

        {/* Map Tab */}
        {activeTab === "map" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">റൂട്ട് മാപ്പ്</h2>
            {renderContentEditor([
              { key: "mapLink", label: "ഗൂഗിൾ മാപ്സ് ലിങ്ക്" },
              { key: "mapTitle", label: "മാപ്പ് ടൈറ്റിൽ" },
              { key: "mapDescription", label: "വിവരണം" },
            ])}
          </div>
        )}

        {/* Footer Tab */}
        {activeTab === "footer" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">ഫൂട്ടർ</h2>
            {renderContentEditor([
              { key: "footerDescription", label: "വിവരണം", multiline: true },
              { key: "footerCopyright", label: "കോപ്പിറൈറ്റ് ടെക്സ്റ്റ്" },
            ])}
          </div>
        )}

        {/* Social Tab */}
        {activeTab === "social" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">സോഷ്യൽ മീഡിയ ലിങ്കുകൾ</h2>
            <p className="text-muted-foreground">ഈ ലിങ്കുകൾ വെബ്സൈറ്റിന്റെ വലത് ഭാഗത്ത് ഫ്ലോട്ടിംഗ് ബട്ടണുകളായി കാണിക്കും</p>
            {renderContentEditor([
              { key: "whatsapp", label: "WhatsApp നമ്പർ (Country code ഉൾപ്പെടെ, + ഇല്ലാതെ. ഉദാ: 919544124059)" },
              { key: "facebook", label: "Facebook Page URL" },
              { key: "youtube", label: "YouTube Channel URL" },
              { key: "instagram", label: "Instagram Profile URL" },
            ])}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
