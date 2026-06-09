import { useState, useEffect, useRef } from "react";
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
  Home,
  MessageSquare,
  Loader2,
  LogOut,
  Upload,
  Check,
  Eye,
  EyeOff,
  ClipboardList,
  Play,
  GripVertical,
  Download,
  Search,
  Award,
  Palette

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWebsiteContent, WebsiteContent } from "@/hooks/useWebsiteContent";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useAdmissions } from "@/hooks/useAdmissions";
import AdminLogin from "@/components/AdminLogin";
import { generateApplicationPDF } from "@/utils/generateApplicationPDF";
import AdminSettings from "@/components/AdminSettings";
import { Switch } from "@/components/ui/switch";
import StudentsAdminPanel from "@/components/StudentsAdminPanel";
import PortalPasswordAdmin from "@/components/PortalPasswordAdmin";
import AIAssistantAdmin from "@/components/AIAssistantAdmin";
import TimetableAdmin from "@/components/TimetableAdmin";
import BookStoreAdmin from "@/components/BookStoreAdmin";
import CommitteeAdmin from "@/components/CommitteeAdmin";
import CommitteesAdminPanel from "@/components/CommitteesAdminPanel";
import NotificationsAdminPanel from "@/components/NotificationsAdminPanel";
import ThemeAdmin from "@/components/ThemeAdmin";

const Admin = () => {
  const { isAuthenticated, loading: authLoading, login, logout } = useAdminAuth();
  const { content, loading, saveContent } = useWebsiteContent();
  const { uploadImage, deleteImage, uploading } = useImageUpload();
  const { admissions, updateAdmission, deleteAdmission, newAdmissionCount } = useAdmissions();
  
  const [activeTab, setActiveTab] = useState<"hero" | "slider" | "about" | "courses" | "benefits" | "gallery" | "suffa" | "contact" | "map" | "footer" | "social" | "admissions" | "form" | "search" | "settings" | "students" | "timetable" | "bookstore" | "committee" | "committees" | "notifications">("hero");
  
  // Local editing state
  const [localContent, setLocalContent] = useState<WebsiteContent | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const [tempCourse, setTempCourse] = useState<WebsiteContent['courses'][0] | null>(null);
  const [editingFeature, setEditingFeature] = useState<number | null>(null);
  const [tempFeature, setTempFeature] = useState<WebsiteContent['about']['features'][0] | null>(null);
  const [editingBenefit, setEditingBenefit] = useState<string | null>(null);
  const [tempBenefit, setTempBenefit] = useState<WebsiteContent['benefits'][0] | null>(null);
  const [newImageAlt, setNewImageAlt] = useState("");
  const [newSliderImageAlt, setNewSliderImageAlt] = useState("");
  const [saving, setSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sliderFileInputRef = useRef<HTMLInputElement>(null);

  // Sync local content with database content
  useEffect(() => {
    if (content && !localContent) {
      setLocalContent(content);
    }
  }, [content, localContent]);

  // Update local content when database content changes
  useEffect(() => {
    if (content) {
      setLocalContent(content);
    }
  }, [content]);

  // Show login if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  const handleSaveToDatabase = async (updatedContent: WebsiteContent) => {
    setSaving(true);
    await saveContent(updatedContent);
    setSaving(false);
  };

  // Hero section handlers
  const handleEditHeroField = (field: string, value: string) => {
    setEditingField(field);
    setTempValue(value);
  };

  const handleSaveHeroField = async (field: keyof WebsiteContent['hero']) => {
    if (!localContent) return;
    const updatedContent = {
      ...localContent,
      hero: { ...localContent.hero, [field]: tempValue }
    };
    setLocalContent(updatedContent);
    setEditingField(null);
    await handleSaveToDatabase(updatedContent);
  };

  // About section handlers
  const handleSaveAboutField = async (field: keyof WebsiteContent['about']) => {
    if (!localContent) return;
    const updatedContent = {
      ...localContent,
      about: { ...localContent.about, [field]: tempValue }
    };
    setLocalContent(updatedContent);
    setEditingField(null);
    await handleSaveToDatabase(updatedContent);
  };

  // About Features handlers
  const handleEditFeature = (index: number, feature: WebsiteContent['about']['features'][0]) => {
    setEditingFeature(index);
    setTempFeature({ ...feature });
  };

  const handleSaveFeature = async () => {
    if (!localContent || editingFeature === null || !tempFeature) return;
    const updatedFeatures = [...localContent.about.features];
    updatedFeatures[editingFeature] = tempFeature;
    const updatedContent = {
      ...localContent,
      about: { ...localContent.about, features: updatedFeatures }
    };
    setLocalContent(updatedContent);
    setEditingFeature(null);
    setTempFeature(null);
    await handleSaveToDatabase(updatedContent);
  };

  const handleDeleteFeature = async (index: number) => {
    if (!localContent) return;
    const updatedFeatures = localContent.about.features.filter((_, i) => i !== index);
    const updatedContent = {
      ...localContent,
      about: { ...localContent.about, features: updatedFeatures }
    };
    setLocalContent(updatedContent);
    await handleSaveToDatabase(updatedContent);
  };

  const handleAddFeature = async () => {
    if (!localContent) return;
    const newFeature = { title: "പുതിയ ഫീച്ചർ", description: "വിവരണം" };
    const updatedContent = {
      ...localContent,
      about: { ...localContent.about, features: [...localContent.about.features, newFeature] }
    };
    setLocalContent(updatedContent);
    await handleSaveToDatabase(updatedContent);
  };

  // Course handlers
  const handleEditCourse = (course: WebsiteContent['courses'][0]) => {
    setEditingCourse(course.id);
    setTempCourse({ ...course });
  };

  const handleSaveCourse = async () => {
    if (!localContent || !tempCourse) return;
    const updatedCourses = localContent.courses.map(c => c.id === tempCourse.id ? tempCourse : c);
    const updatedContent = { ...localContent, courses: updatedCourses };
    setLocalContent(updatedContent);
    setEditingCourse(null);
    setTempCourse(null);
    await handleSaveToDatabase(updatedContent);
  };

  const handleDeleteCourse = async (id: string) => {
    if (!localContent) return;
    const updatedCourses = localContent.courses.filter(c => c.id !== id);
    const updatedContent = { ...localContent, courses: updatedCourses };
    setLocalContent(updatedContent);
    await handleSaveToDatabase(updatedContent);
  };

  const handleAddCourse = async () => {
    if (!localContent) return;
    const newId = String(Date.now());
    const newCourse = {
      id: newId,
      title: "പുതിയ കോഴ്‌സ്",
      subtitle: "",
      description: "കോഴ്‌സ് വിവരണം",
      image: "/placeholder.svg",
      syllabus: "",
      featured: false
    };
    const updatedContent = { ...localContent, courses: [...localContent.courses, newCourse] };
    setLocalContent(updatedContent);
    await handleSaveToDatabase(updatedContent);
  };

  // Benefits handlers
  const handleEditBenefit = (benefit: WebsiteContent['benefits'][0]) => {
    setEditingBenefit(benefit.id);
    setTempBenefit({ ...benefit });
  };

  const handleSaveBenefit = async () => {
    if (!localContent || !tempBenefit) return;
    const updatedBenefits = localContent.benefits.map(b => b.id === tempBenefit.id ? tempBenefit : b);
    const updatedContent = { ...localContent, benefits: updatedBenefits };
    setLocalContent(updatedContent);
    setEditingBenefit(null);
    setTempBenefit(null);
    await handleSaveToDatabase(updatedContent);
  };

  const handleDeleteBenefit = async (id: string) => {
    if (!localContent) return;
    const updatedBenefits = localContent.benefits.filter(b => b.id !== id);
    const updatedContent = { ...localContent, benefits: updatedBenefits };
    setLocalContent(updatedContent);
    await handleSaveToDatabase(updatedContent);
  };

  const handleAddBenefit = async () => {
    if (!localContent) return;
    const newId = String(Date.now());
    const newBenefit = { id: newId, title: "പുതിയ നേട്ടം", description: "വിവരണം", icon: "Star" };
    const updatedContent = { ...localContent, benefits: [...localContent.benefits, newBenefit] };
    setLocalContent(updatedContent);
    await handleSaveToDatabase(updatedContent);
  };

  // Gallery handlers with file upload (supports multiple files)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !localContent) return;

    const uploadPromises = Array.from(files).map(async (file, index) => {
      const url = await uploadImage(file, 'gallery');
      if (url) {
        return { 
          id: String(Date.now() + index), 
          url, 
          alt: newImageAlt || `Gallery Image ${localContent.gallery.length + index + 1}` 
        };
      }
      return null;
    });

    const uploadedImages = (await Promise.all(uploadPromises)).filter(img => img !== null);
    
    if (uploadedImages.length > 0) {
      const updatedContent = { 
        ...localContent, 
        gallery: [...localContent.gallery, ...uploadedImages] 
      };
      setLocalContent(updatedContent);
      setNewImageAlt("");
      await handleSaveToDatabase(updatedContent);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteImage = async (id: string) => {
    if (!localContent) return;
    const image = localContent.gallery.find(img => img.id === id);
    if (image) {
      await deleteImage(image.url);
    }
    const updatedGallery = localContent.gallery.filter(img => img.id !== id);
    const updatedContent = { ...localContent, gallery: updatedGallery };
    setLocalContent(updatedContent);
    await handleSaveToDatabase(updatedContent);
  };

  // Slider handlers with file upload (supports multiple files)
  const handleSliderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !localContent) return;

    const uploadPromises = Array.from(files).map(async (file, index) => {
      const url = await uploadImage(file, 'slider');
      if (url) {
        return { 
          id: String(Date.now() + index), 
          url, 
          alt: newSliderImageAlt || `Slider Image ${(localContent.heroSlider?.images?.length || 0) + index + 1}` 
        };
      }
      return null;
    });

    const uploadedImages = (await Promise.all(uploadPromises)).filter(img => img !== null);
    
    if (uploadedImages.length > 0) {
      const existingImages = localContent.heroSlider?.images || [];
      const updatedContent = { 
        ...localContent, 
        heroSlider: {
          ...localContent.heroSlider,
          images: [...existingImages, ...uploadedImages],
          enabled: true
        }
      };
      setLocalContent(updatedContent);
      setNewSliderImageAlt("");
      await handleSaveToDatabase(updatedContent);
    }
    if (sliderFileInputRef.current) sliderFileInputRef.current.value = '';
  };

  const handleDeleteSliderImage = async (id: string) => {
    if (!localContent) return;
    const image = localContent.heroSlider?.images?.find(img => img.id === id);
    if (image) {
      await deleteImage(image.url);
    }
    const updatedImages = localContent.heroSlider?.images?.filter(img => img.id !== id) || [];
    const updatedContent = { 
      ...localContent, 
      heroSlider: {
        ...localContent.heroSlider,
        images: updatedImages
      }
    };
    setLocalContent(updatedContent);
    await handleSaveToDatabase(updatedContent);
  };

  // Contact handlers
  const handleSaveContactField = async (field: keyof WebsiteContent['contact']) => {
    if (!localContent) return;
    const updatedContent = {
      ...localContent,
      contact: { ...localContent.contact, [field]: tempValue }
    };
    setLocalContent(updatedContent);
    setEditingField(null);
    await handleSaveToDatabase(updatedContent);
  };

  // Map handlers
  const handleSaveMapField = async (field: keyof WebsiteContent['map']) => {
    if (!localContent) return;
    const updatedContent = {
      ...localContent,
      map: { ...localContent.map, [field]: tempValue }
    };
    setLocalContent(updatedContent);
    setEditingField(null);
    await handleSaveToDatabase(updatedContent);
  };

  // Footer handlers
  const handleSaveFooterField = async (field: keyof WebsiteContent['footer']) => {
    if (!localContent) return;
    const updatedContent = {
      ...localContent,
      footer: { ...localContent.footer, [field]: tempValue }
    };
    setLocalContent(updatedContent);
    setEditingField(null);
    await handleSaveToDatabase(updatedContent);
  };

  // Social handlers
  const handleSaveSocialField = async (field: keyof WebsiteContent['social']) => {
    if (!localContent) return;
    const updatedContent = {
      ...localContent,
      social: { ...localContent.social, [field]: tempValue }
    };
    setLocalContent(updatedContent);
    setEditingField(null);
    await handleSaveToDatabase(updatedContent);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  const tabs = [
    { id: "hero" as const, label: "ഹീറോ", icon: Home },
    { id: "slider" as const, label: "സ്ലൈഡർ", icon: Play },
    { id: "about" as const, label: "അബൗട്ട്", icon: MessageSquare },
    { id: "courses" as const, label: "കോഴ്‌സുകൾ", icon: BookOpen },
    { id: "benefits" as const, label: "നേട്ടങ്ങൾ", icon: Users },
    { id: "gallery" as const, label: "ഗാലറി", icon: ImageIcon },
    { id: "suffa" as const, label: "സുഫ്ഫ", icon: BookOpen },
    { id: "contact" as const, label: "കോൺടാക്ട്", icon: Phone },
    { id: "map" as const, label: "മാപ്പ്", icon: MapPin },
    { id: "footer" as const, label: "ഫൂട്ടർ", icon: FileText },
    { id: "social" as const, label: "സോഷ്യൽ", icon: Share2 },
    { id: "form" as const, label: "ഫോം സെറ്റിംഗ്സ്", icon: ClipboardList },
    { id: "search" as const, label: "സെർച്ച്", icon: Search },
    { id: "admissions" as const, label: "അപേക്ഷകൾ", icon: ClipboardList, badge: newAdmissionCount },
    { id: "students" as const, label: "Students Portal", icon: Users },
    { id: "timetable" as const, label: "ടൈം ടേബിൾ", icon: ClipboardList },
    { id: "bookstore" as const, label: "ബുക്ക് സ്റ്റോർ", icon: BookOpen },
    { id: "committee" as const, label: "കമ്മിറ്റി (Legacy)", icon: Users },
    { id: "committees" as const, label: "Committees (പുതിയത്)", icon: Award },
    { id: "notifications" as const, label: "Notifications", icon: MessageSquare },
    { id: "settings" as const, label: "ക്രമീകരണം", icon: Settings },
  ];

  if (loading || !localContent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderFieldEditor = (
    fieldKey: string,
    label: string,
    value: string,
    onSave: () => void,
    multiline?: boolean
  ) => (
    <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">{label}</label>
          {editingField === fieldKey ? (
            <div className="space-y-3">
              {multiline ? (
                <textarea
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
                  rows={4}
                />
              ) : (
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              )}
              <div className="flex gap-2">
                <Button size="sm" onClick={onSave} className="rounded-lg" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                  സേവ്
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel} className="rounded-lg">
                  <X className="w-4 h-4 mr-1" />റദ്ദാക്കുക
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-foreground">{value}</p>
          )}
        </div>
        {editingField !== fieldKey && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setEditingField(fieldKey);
              setTempValue(value);
            }}
            className="text-primary hover:text-primary"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        )}
      </div>
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
          <div className="flex items-center gap-4">
            {saving && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">സേവ് ചെയ്യുന്നു...</span>
              </div>
            )}
            <Button variant="outline" onClick={logout} className="rounded-xl">
              <LogOut className="w-4 h-4 mr-2" />
              ലോഗൗട്ട്
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className="rounded-xl whitespace-nowrap relative"
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Hero Tab */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">ഹീറോ സെക്ഷൻ എഡിറ്റ് ചെയ്യുക</h2>
            <div className="space-y-4">
              {renderFieldEditor("hero.title", "ടൈറ്റിൽ", localContent.hero.title, () => handleSaveHeroField("title"))}
              {renderFieldEditor("hero.subtitle", "സബ്‌ടൈറ്റിൽ", localContent.hero.subtitle, () => handleSaveHeroField("subtitle"), true)}
              {renderFieldEditor("hero.phone1", "ഫോൺ 1", localContent.hero.phone1, () => handleSaveHeroField("phone1"))}
              {renderFieldEditor("hero.phone2", "ഫോൺ 2", localContent.hero.phone2, () => handleSaveHeroField("phone2"))}
              {renderFieldEditor("hero.ctaText", "CTA ബട്ടൺ ടെക്സ്റ്റ്", localContent.hero.ctaText, () => handleSaveHeroField("ctaText"))}
            </div>
          </div>
        )}

        {/* Slider Tab */}
        {activeTab === "slider" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">ഹീറോ സ്ലൈഡർ</h2>
            
            {/* Slider Settings */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
              <h3 className="font-medium text-foreground mb-4">സ്ലൈഡർ സെറ്റിംഗ്സ്</h3>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localContent.heroSlider?.enabled !== false}
                    onChange={async (e) => {
                      const updatedContent = {
                        ...localContent,
                        heroSlider: { 
                          ...localContent.heroSlider,
                          enabled: e.target.checked 
                        }
                      };
                      setLocalContent(updatedContent);
                      await handleSaveToDatabase(updatedContent);
                    }}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-foreground font-medium">സ്ലൈഡർ എനേബിൾ ചെയ്യുക</span>
                    <p className="text-xs text-muted-foreground">ഇമേജുകൾ ഉണ്ടെങ്കിൽ ഹീറോ സെക്ഷനു പകരം സ്ലൈഡർ കാണിക്കും</p>
                  </div>
                </label>
                <div className="flex items-center gap-3">
                  <label className="text-foreground font-medium">ഓട്ടോപ്ലേ ഇന്റർവൽ (സെക്കന്റ്):</label>
                  <select
                    value={(localContent.heroSlider?.autoPlayInterval || 5000) / 1000}
                    onChange={async (e) => {
                      const updatedContent = {
                        ...localContent,
                        heroSlider: { 
                          ...localContent.heroSlider,
                          autoPlayInterval: parseInt(e.target.value) * 1000 
                        }
                      };
                      setLocalContent(updatedContent);
                      await handleSaveToDatabase(updatedContent);
                    }}
                    className="px-4 py-2 rounded-xl border border-border bg-background"
                  >
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="10">10</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Slider Image Upload */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
              <h3 className="font-medium text-foreground mb-4">സ്ലൈഡർ ഇമേജ് അപ്‌ലോഡ് ചെയ്യുക</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="ഇമേജ് വിവരണം (Alt Text)"
                  value={newSliderImageAlt}
                  onChange={(e) => setNewSliderImageAlt(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background"
                />
                <div className="flex gap-4">
                  <input
                    ref={sliderFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSliderImageUpload}
                    className="hidden"
                    id="slider-upload"
                    multiple
                  />
                  <label
                    htmlFor="slider-upload"
                    className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                  >
                    {uploading ? (
                      <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
                    ) : (
                      <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {uploading ? 'അപ്‌ലോഡ് ചെയ്യുന്നു...' : 'ക്ലിക്ക് ചെയ്ത് ഇമേജ് തിരഞ്ഞെടുക്കുക'}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP (ഒന്നിലധികം തിരഞ്ഞെടുക്കാം)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Slider Images Grid with Reorder */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-foreground">സ്ലൈഡർ ഇമേജുകൾ ({localContent.heroSlider?.images?.length || 0})</h3>
                <p className="text-xs text-muted-foreground">ഓർഡർ മാറ്റാൻ ഇമേജുകൾ ഡ്രാഗ് ചെയ്യുക</p>
              </div>
              {(!localContent.heroSlider?.images || localContent.heroSlider.images.length === 0) ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>ഇമേജുകൾ ഇല്ല. മുകളിൽ ഇമേജുകൾ അപ്‌ലോഡ് ചെയ്യുക.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {localContent.heroSlider.images.map((image, index) => (
                    <div 
                      key={image.id} 
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', index.toString());
                        e.currentTarget.classList.add('opacity-50');
                      }}
                      onDragEnd={(e) => {
                        e.currentTarget.classList.remove('opacity-50');
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('ring-2', 'ring-primary');
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove('ring-2', 'ring-primary');
                      }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('ring-2', 'ring-primary');
                        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                        const toIndex = index;
                        if (fromIndex !== toIndex) {
                          const newImages = [...(localContent.heroSlider?.images || [])];
                          const [movedItem] = newImages.splice(fromIndex, 1);
                          newImages.splice(toIndex, 0, movedItem);
                          const updatedContent = { 
                            ...localContent, 
                            heroSlider: {
                              ...localContent.heroSlider,
                              images: newImages
                            }
                          };
                          setLocalContent(updatedContent);
                          await handleSaveToDatabase(updatedContent);
                        }
                      }}
                      className="group relative bg-muted rounded-xl overflow-hidden border border-border/50 cursor-move transition-all"
                    >
                      <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <GripVertical className="w-4 h-4 text-primary-foreground/70" />
                      </div>
                      <img src={image.url} alt={image.alt} className="w-full aspect-video object-cover" />
                      <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteSliderImage(image.id)} className="rounded-lg" disabled={saving}>
                          <Trash2 className="w-4 h-4 mr-1" />ഡിലീറ്റ്
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">അബൗട്ട് സെക്ഷൻ</h2>
            <div className="space-y-4">
              {renderFieldEditor("about.title", "ടൈറ്റിൽ", localContent.about.title, () => handleSaveAboutField("title"))}
              {renderFieldEditor("about.subtitle", "സബ്‌ടൈറ്റിൽ", localContent.about.subtitle, () => handleSaveAboutField("subtitle"))}
              {renderFieldEditor("about.description", "വിവരണം", localContent.about.description, () => handleSaveAboutField("description"), true)}
            </div>
            
            {/* About Features */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-semibold text-foreground">ഫീച്ചറുകൾ</h3>
                <Button onClick={handleAddFeature} className="rounded-xl" disabled={saving}>
                  <Plus className="w-4 h-4 mr-2" />ചേർക്കുക
                </Button>
              </div>
              <div className="space-y-4">
                {localContent.about.features.map((feature, index) => (
                  <div key={index} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                    {editingFeature === index && tempFeature ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={tempFeature.title}
                          onChange={(e) => setTempFeature({ ...tempFeature, title: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background"
                          placeholder="ടൈറ്റിൽ"
                        />
                        <textarea
                          value={tempFeature.description}
                          onChange={(e) => setTempFeature({ ...tempFeature, description: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background resize-none"
                          rows={2}
                          placeholder="വിവരണം"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveFeature} className="rounded-lg" disabled={saving}>
                            {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                            സേവ്
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setEditingFeature(null); setTempFeature(null); }} className="rounded-lg">
                            <X className="w-4 h-4 mr-1" />റദ്ദാക്കുക
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-foreground">{feature.title}</h4>
                          <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditFeature(index, feature)}>
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteFeature(index)} disabled={saving}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
            
            {/* Course Section Settings */}
            <div className="space-y-4">
              <h3 className="font-display text-lg font-semibold text-foreground">സെക്ഷൻ സെറ്റിംഗ്സ്</h3>
              {renderFieldEditor(
                "coursesSection.title", 
                "സെക്ഷൻ ടൈറ്റിൽ", 
                localContent.coursesSection?.title || 'പഠന പാഠ്യന്തര വിഷയങ്ങൾ', 
                async () => {
                  if (!localContent) return;
                  const updatedContent = {
                    ...localContent,
                    coursesSection: { 
                      ...localContent.coursesSection, 
                      title: tempValue 
                    }
                  };
                  setLocalContent(updatedContent);
                  setEditingField(null);
                  await handleSaveToDatabase(updatedContent);
                }
              )}
              {renderFieldEditor(
                "coursesSection.subtitle", 
                "സെക്ഷൻ സബ്‌ടൈറ്റിൽ (ബാഡ്ജ്)", 
                localContent.coursesSection?.subtitle || 'പഠന പദ്ധതികൾ', 
                async () => {
                  if (!localContent) return;
                  const updatedContent = {
                    ...localContent,
                    coursesSection: { 
                      ...localContent.coursesSection, 
                      subtitle: tempValue 
                    }
                  };
                  setLocalContent(updatedContent);
                  setEditingField(null);
                  await handleSaveToDatabase(updatedContent);
                }
              )}
              {renderFieldEditor(
                "coursesSection.description", 
                "സെക്ഷൻ വിവരണം", 
                localContent.coursesSection?.description || 'സമഗ്രമായ വിദ്യാഭ്യാസ പദ്ധതിയിലൂടെ വിദ്യാർത്ഥികളെ എല്ലാ മേഖലകളിലും മികവുറ്റവരാക്കുന്നു', 
                async () => {
                  if (!localContent) return;
                  const updatedContent = {
                    ...localContent,
                    coursesSection: { 
                      ...localContent.coursesSection, 
                      description: tempValue 
                    }
                  };
                  setLocalContent(updatedContent);
                  setEditingField(null);
                  await handleSaveToDatabase(updatedContent);
                },
                true
              )}
            </div>
            
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-semibold text-foreground">കോഴ്‌സുകൾ</h3>
                <Button onClick={handleAddCourse} className="rounded-xl" disabled={saving}>
                  <Plus className="w-4 h-4 mr-2" />പുതിയ കോഴ്‌സ്
                </Button>
              </div>
              <div className="space-y-4">
                {localContent.courses.map(course => (
                  <div key={course.id} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                    {editingCourse === course.id && tempCourse ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={tempCourse.title}
                          onChange={(e) => setTempCourse({ ...tempCourse, title: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background"
                          placeholder="ടൈറ്റിൽ"
                        />
                        <input
                          type="text"
                          value={tempCourse.subtitle}
                          onChange={(e) => setTempCourse({ ...tempCourse, subtitle: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background"
                          placeholder="സബ്‌ടൈറ്റിൽ"
                        />
                        <textarea
                          value={tempCourse.description}
                          onChange={(e) => setTempCourse({ ...tempCourse, description: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background resize-none"
                          rows={2}
                          placeholder="വിവരണം"
                        />
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={tempCourse.featured}
                            onChange={(e) => setTempCourse({ ...tempCourse, featured: e.target.checked })}
                            className="rounded"
                          />
                          <span className="text-sm">ഫീച്ചേഡ് കോഴ്‌സ്</span>
                        </label>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveCourse} className="rounded-lg" disabled={saving}>
                            {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                            സേവ്
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setEditingCourse(null); setTempCourse(null); }} className="rounded-lg">
                            <X className="w-4 h-4 mr-1" />റദ്ദാക്കുക
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">{course.title}</h4>
                            {course.featured && <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">Featured</span>}
                          </div>
                          {course.subtitle && <p className="text-sm text-muted-foreground">{course.subtitle}</p>}
                          <p className="text-muted-foreground text-sm mt-1">{course.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditCourse(course)}>
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteCourse(course.id)} disabled={saving}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-semibold text-foreground">നേട്ടങ്ങൾ</h3>
                <Button onClick={handleAddBenefit} className="rounded-xl" disabled={saving}>
                  <Plus className="w-4 h-4 mr-2" />ചേർക്കുക
                </Button>
              </div>
              <div className="space-y-4">
                {localContent.benefits.map(benefit => (
                  <div key={benefit.id} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                    {editingBenefit === benefit.id && tempBenefit ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={tempBenefit.title}
                          onChange={(e) => setTempBenefit({ ...tempBenefit, title: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background"
                          placeholder="ടൈറ്റിൽ"
                        />
                        <textarea
                          value={tempBenefit.description}
                          onChange={(e) => setTempBenefit({ ...tempBenefit, description: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background resize-none"
                          rows={2}
                          placeholder="വിവരണം"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveBenefit} className="rounded-lg" disabled={saving}>
                            {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                            സേവ്
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setEditingBenefit(null); setTempBenefit(null); }} className="rounded-lg">
                            <X className="w-4 h-4 mr-1" />റദ്ദാക്കുക
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                          <p className="text-muted-foreground text-sm">{benefit.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditBenefit(benefit)}>
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteBenefit(benefit.id)} disabled={saving}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gallery Tab with File Upload */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">ഗാലറി സെക്ഷൻ</h2>
            
            {/* Gallery Settings */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
              <h3 className="font-medium text-foreground mb-4">ഗാലറി സെറ്റിംഗ്സ്</h3>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localContent.gallerySettings?.likesEnabled !== false}
                    onChange={async (e) => {
                      const updatedContent = {
                        ...localContent,
                        gallerySettings: { 
                          ...localContent.gallerySettings,
                          likesEnabled: e.target.checked 
                        }
                      };
                      setLocalContent(updatedContent);
                      await handleSaveToDatabase(updatedContent);
                    }}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-foreground font-medium">ലൈക്ക് ബട്ടൺ</span>
                    <p className="text-xs text-muted-foreground">ഇമേജുകൾക്ക് ലൈക്ക് ചെയ്യാൻ അനുവദിക്കുക</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localContent.gallerySettings?.downloadEnabled !== false}
                    onChange={async (e) => {
                      const updatedContent = {
                        ...localContent,
                        gallerySettings: { 
                          ...localContent.gallerySettings,
                          downloadEnabled: e.target.checked 
                        }
                      };
                      setLocalContent(updatedContent);
                      await handleSaveToDatabase(updatedContent);
                    }}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-foreground font-medium">ഡൗൺലോഡ് ബട്ടൺ</span>
                    <p className="text-xs text-muted-foreground">ഇമേജുകൾ ഡൗൺലോഡ് ചെയ്യാൻ അനുവദിക്കുക</p>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Image Upload */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
              <h3 className="font-medium text-foreground mb-4">ഡിവൈസിൽ നിന്ന് ഇമേജ് അപ്‌ലോഡ് ചെയ്യുക</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="ഇമേജ് വിവരണം (Alt Text)"
                  value={newImageAlt}
                  onChange={(e) => setNewImageAlt(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background"
                />
                <div className="flex gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="gallery-upload"
                    multiple
                  />
                  <label
                    htmlFor="gallery-upload"
                    className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                  >
                    {uploading ? (
                      <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
                    ) : (
                      <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {uploading ? 'അപ്‌ലോഡ് ചെയ്യുന്നു...' : 'ക്ലിക്ക് ചെയ്ത് ഇമേജ് തിരഞ്ഞെടുക്കുക'}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP (ഒന്നിലധികം തിരഞ്ഞെടുക്കാം)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Gallery Grid with Reorder */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-foreground">അപ്‌ലോഡ് ചെയ്ത ഇമേജുകൾ ({localContent.gallery.length})</h3>
                <p className="text-xs text-muted-foreground">ഓർഡർ മാറ്റാൻ ഇമേജുകൾ ഡ്രാഗ് ചെയ്യുക</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {localContent.gallery.map((image, index) => (
                  <div 
                    key={image.id} 
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', index.toString());
                      e.currentTarget.classList.add('opacity-50');
                    }}
                    onDragEnd={(e) => {
                      e.currentTarget.classList.remove('opacity-50');
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('ring-2', 'ring-primary');
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('ring-2', 'ring-primary');
                    }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('ring-2', 'ring-primary');
                      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                      const toIndex = index;
                      if (fromIndex !== toIndex) {
                        const newGallery = [...localContent.gallery];
                        const [movedItem] = newGallery.splice(fromIndex, 1);
                        newGallery.splice(toIndex, 0, movedItem);
                        const updatedContent = { ...localContent, gallery: newGallery };
                        setLocalContent(updatedContent);
                        await handleSaveToDatabase(updatedContent);
                      }
                    }}
                    className="group relative bg-muted rounded-xl overflow-hidden border border-border/50 cursor-move transition-all"
                  >
                    <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    <img src={image.url} alt={image.alt} className="w-full aspect-video object-cover" />
                    <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(image.id)} className="rounded-lg" disabled={saving}>
                        <Trash2 className="w-4 h-4 mr-1" />ഡിലീറ്റ്
                      </Button>
                    </div>
                    <div className="p-3 bg-card">
                      <p className="text-sm text-foreground truncate">{image.alt}</p>
                    </div>
                  </div>
                ))}
              </div>
              {localContent.gallery.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>ഇമേജുകൾ ഇല്ല. മുകളിൽ നിന്ന് അപ്‌ലോഡ് ചെയ്യുക.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Suffa Tab */}
        {activeTab === "suffa" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">സുഫ്ഫ പേജ് സെറ്റിംഗ്സ്</h2>
            <div className="space-y-4">
              {renderFieldEditor("suffa.title", "ടൈറ്റിൽ", localContent.suffa?.title || 'സുഫ്ഫ', async () => {
                const updatedContent = {
                  ...localContent,
                  suffa: { ...localContent.suffa, title: tempValue }
                };
                setLocalContent(updatedContent);
                setEditingField(null);
                await handleSaveToDatabase(updatedContent);
              })}
              {renderFieldEditor("suffa.subtitle", "സബ്‌ടൈറ്റിൽ", localContent.suffa?.subtitle || '', async () => {
                const updatedContent = {
                  ...localContent,
                  suffa: { ...localContent.suffa, subtitle: tempValue }
                };
                setLocalContent(updatedContent);
                setEditingField(null);
                await handleSaveToDatabase(updatedContent);
              })}
              {renderFieldEditor("suffa.description", "വിവരണം", localContent.suffa?.description || '', async () => {
                const updatedContent = {
                  ...localContent,
                  suffa: { ...localContent.suffa, description: tempValue }
                };
                setLocalContent(updatedContent);
                setEditingField(null);
                await handleSaveToDatabase(updatedContent);
              }, true)}
            </div>

            {/* Suffa Image Upload */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft mt-6">
              <h3 className="font-medium text-foreground mb-4">സുഫ്ഫ പേജ് ഇമേജുകൾ</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;
                      const uploadPromises = Array.from(files).map(async (file, index) => {
                        const url = await uploadImage(file, 'suffa');
                        if (url) {
                          return { id: String(Date.now() + index), url, alt: `Suffa Image ${(localContent.suffa?.images || []).length + index + 1}` };
                        }
                        return null;
                      });
                      const uploadedImages = (await Promise.all(uploadPromises)).filter(img => img !== null);
                      if (uploadedImages.length > 0) {
                        const updatedContent = {
                          ...localContent,
                          suffa: { ...localContent.suffa, images: [...(localContent.suffa?.images || []), ...uploadedImages] }
                        };
                        setLocalContent(updatedContent);
                        await handleSaveToDatabase(updatedContent);
                      }
                      e.target.value = '';
                    }}
                    className="hidden"
                    id="suffa-upload"
                    multiple
                  />
                  <label htmlFor="suffa-upload" className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                    {uploading ? <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" /> : <Upload className="w-8 h-8 text-muted-foreground mb-2" />}
                    <span className="text-sm text-muted-foreground">{uploading ? 'അപ്‌ലോഡ് ചെയ്യുന്നു...' : 'ഇമേജുകൾ അപ്‌ലോഡ് ചെയ്യുക'}</span>
                  </label>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                {(localContent.suffa?.images || []).map((image: { id: string; url: string; alt: string }) => (
                  <div key={image.id} className="group relative bg-muted rounded-xl overflow-hidden">
                    <img src={image.url} alt={image.alt} className="w-full aspect-video object-cover" />
                    <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="sm" variant="destructive" onClick={async () => {
                        await deleteImage(image.url);
                        const updatedImages = (localContent.suffa?.images || []).filter((img: { id: string }) => img.id !== image.id);
                        const updatedContent = { ...localContent, suffa: { ...localContent.suffa, images: updatedImages } };
                        setLocalContent(updatedContent);
                        await handleSaveToDatabase(updatedContent);
                      }} className="rounded-lg" disabled={saving}>
                        <Trash2 className="w-4 h-4 mr-1" />ഡിലീറ്റ്
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">കോൺടാക്ട് സെക്ഷൻ</h2>
            <div className="space-y-4">
              {renderFieldEditor("contact.phone1", "ഫോൺ 1", localContent.contact.phone1, () => handleSaveContactField("phone1"))}
              {renderFieldEditor("contact.phone2", "ഫോൺ 2", localContent.contact.phone2, () => handleSaveContactField("phone2"))}
              {renderFieldEditor("contact.email", "ഇമെയിൽ", localContent.contact.email, () => handleSaveContactField("email"))}
              {renderFieldEditor("contact.address", "വിലാസം", localContent.contact.address, () => handleSaveContactField("address"), true)}
              {renderFieldEditor("contact.timing", "സമയം", localContent.contact.timing, () => handleSaveContactField("timing"))}
            </div>
          </div>
        )}

        {/* Map Tab */}
        {activeTab === "map" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">മാപ്പ് സെക്ഷൻ</h2>
            <div className="space-y-4">
              {renderFieldEditor("map.embedUrl", "മാപ്പ് URL", localContent.map.embedUrl, () => handleSaveMapField("embedUrl"))}
              {renderFieldEditor("map.address", "വിലാസം", localContent.map.address, () => handleSaveMapField("address"), true)}
            </div>

            {/* Landmarks Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-semibold text-foreground">ലാൻഡ്മാർക്കുകൾ (സ്റ്റെപ്സ്)</h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localContent.map.landmarksEnabled !== false}
                      onChange={async (e) => {
                        const updatedContent = {
                          ...localContent,
                          map: { ...localContent.map, landmarksEnabled: e.target.checked }
                        };
                        setLocalContent(updatedContent);
                        await handleSaveToDatabase(updatedContent);
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-muted-foreground">ലാൻഡ്മാർക്കുകൾ കാണിക്കുക</span>
                  </label>
                  <Button 
                    onClick={async () => {
                      const landmarks = localContent.map.landmarks || [];
                      const newLandmark = {
                        id: String(Date.now()),
                        number: String(landmarks.length + 1),
                        title: 'പുതിയ ലാൻഡ്മാർക്ക്',
                        description: 'വിവരണം ചേർക്കുക'
                      };
                      const updatedContent = {
                        ...localContent,
                        map: { ...localContent.map, landmarks: [...landmarks, newLandmark] }
                      };
                      setLocalContent(updatedContent);
                      await handleSaveToDatabase(updatedContent);
                    }} 
                    className="rounded-xl" 
                    disabled={saving}
                  >
                    <Plus className="w-4 h-4 mr-2" />ചേർക്കുക
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {(localContent.map.landmarks || []).map((landmark: { id: string; number: string; title: string; description: string }, index: number) => (
                  <div key={landmark.id} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                    <div className="grid sm:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1 block">നമ്പർ</label>
                        <input
                          type="text"
                          value={landmark.number}
                          onChange={(e) => {
                            const landmarks = [...(localContent.map.landmarks || [])];
                            landmarks[index] = { ...landmark, number: e.target.value };
                            setLocalContent({
                              ...localContent,
                              map: { ...localContent.map, landmarks }
                            });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-center font-bold"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground mb-1 block">ടൈറ്റിൽ</label>
                        <input
                          type="text"
                          value={landmark.title}
                          onChange={(e) => {
                            const landmarks = [...(localContent.map.landmarks || [])];
                            landmarks[index] = { ...landmark, title: e.target.value };
                            setLocalContent({
                              ...localContent,
                              map: { ...localContent.map, landmarks }
                            });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={async () => {
                            const landmarks = (localContent.map.landmarks || []).filter((_: unknown, i: number) => i !== index);
                            const updatedContent = {
                              ...localContent,
                              map: { ...localContent.map, landmarks }
                            };
                            setLocalContent(updatedContent);
                            await handleSaveToDatabase(updatedContent);
                          }}
                          disabled={saving}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">വിവരണം</label>
                      <input
                        type="text"
                        value={landmark.description}
                        onChange={(e) => {
                          const landmarks = [...(localContent.map.landmarks || [])];
                          landmarks[index] = { ...landmark, description: e.target.value };
                          setLocalContent({
                            ...localContent,
                            map: { ...localContent.map, landmarks }
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {(localContent.map.landmarks || []).length > 0 && (
                <Button 
                  onClick={() => handleSaveToDatabase(localContent)} 
                  className="mt-4 rounded-lg" 
                  disabled={saving}
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                  മാറ്റങ്ങൾ സേവ് ചെയ്യുക
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Footer Tab */}
        {activeTab === "footer" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">ഫൂട്ടർ സെക്ഷൻ</h2>
            <div className="space-y-4">
              {renderFieldEditor("footer.copyright", "കോപ്പിറൈറ്റ്", localContent.footer.copyright, () => handleSaveFooterField("copyright"))}
              {renderFieldEditor("footer.tagline", "ടാഗ്‌ലൈൻ", localContent.footer.tagline, () => handleSaveFooterField("tagline"))}
            </div>
          </div>
        )}

        {/* Social Tab */}
        {activeTab === "social" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">സോഷ്യൽ മീഡിയ ലിങ്കുകൾ</h2>
            <div className="space-y-4">
              {renderFieldEditor("social.whatsapp", "WhatsApp നമ്പർ", localContent.social.whatsapp, () => handleSaveSocialField("whatsapp"))}
              {renderFieldEditor("social.facebook", "Facebook URL", localContent.social.facebook, () => handleSaveSocialField("facebook"))}
              {renderFieldEditor("social.youtube", "YouTube URL", localContent.social.youtube, () => handleSaveSocialField("youtube"))}
              {renderFieldEditor("social.instagram", "Instagram URL", localContent.social.instagram, () => handleSaveSocialField("instagram"))}
            </div>
          </div>
        )}

        {/* Form Settings Tab */}
        {activeTab === "form" && localContent.admissionForm && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">അഡ്മിഷൻ ഫോം സെറ്റിംഗ്സ്</h2>
            
            {/* Form Title & Description */}
            <div className="space-y-4">
              {renderFieldEditor("form.title", "ഫോം ടൈറ്റിൽ", localContent.admissionForm.title || '', async () => {
                if (!localContent) return;
                const updatedContent = {
                  ...localContent,
                  admissionForm: { ...localContent.admissionForm, title: tempValue }
                };
                setLocalContent(updatedContent);
                setEditingField(null);
                await handleSaveToDatabase(updatedContent);
              })}
              {renderFieldEditor("form.subtitle", "സബ്‌ടൈറ്റിൽ", localContent.admissionForm.subtitle || '', async () => {
                if (!localContent) return;
                const updatedContent = {
                  ...localContent,
                  admissionForm: { ...localContent.admissionForm, subtitle: tempValue }
                };
                setLocalContent(updatedContent);
                setEditingField(null);
                await handleSaveToDatabase(updatedContent);
              })}
            </div>

            {/* Institution Rules */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
              <h3 className="font-semibold text-foreground mb-4">സ്ഥാപന നിയമങ്ങൾ (അച്ചടക്ക രേഖ)</h3>
              <textarea
                value={localContent.admissionForm.institutionRules || ''}
                onChange={(e) => {
                  const updatedContent = {
                    ...localContent,
                    admissionForm: { ...localContent.admissionForm, institutionRules: e.target.value }
                  };
                  setLocalContent(updatedContent);
                }}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
                rows={12}
                placeholder="സ്ഥാപന നിയമങ്ങൾ ഇവിടെ എഴുതുക..."
              />
              <Button 
                onClick={() => handleSaveToDatabase(localContent)} 
                className="mt-4 rounded-lg" 
                disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                നിയമങ്ങൾ സേവ് ചെയ്യുക
              </Button>
            </div>

            {/* Approval Text */}
            {renderFieldEditor("form.approvalText", "അംഗീകാര ടെക്സ്റ്റ്", localContent.admissionForm.approvalText || '', async () => {
              if (!localContent) return;
              const updatedContent = {
                ...localContent,
                admissionForm: { ...localContent.admissionForm, approvalText: tempValue }
              };
              setLocalContent(updatedContent);
              setEditingField(null);
              await handleSaveToDatabase(updatedContent);
            })}
          </div>
        )}

        {/* Admissions Tab */}
        {activeTab === "admissions" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">അഡ്മിഷൻ അപേക്ഷകൾ</h2>
            
            {admissions.length === 0 ? (
              <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-soft text-center">
                <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">അപേക്ഷകൾ ഇല്ല</p>
              </div>
            ) : (
              <div className="space-y-4">
                {admissions.map(admission => {
                  // Parse additional_info for documents
                  let additionalData: { documents?: { photo?: string; aadhaar?: string; birthCertificate?: string; tc?: string }; madarasaLevel?: string; madarasaName?: string; notes?: string } = {};
                  try {
                    if (admission.additional_info) {
                      additionalData = JSON.parse(admission.additional_info);
                    }
                  } catch { additionalData = {}; }
                  
                  const docs = additionalData.documents || {};
                  
                  return (
                    <div key={admission.id} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                      <div className="flex flex-col gap-4">
                        {/* Header with photo and basic info */}
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          {admission.image_url && (
                            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 border-border">
                              <img src={admission.image_url} alt={admission.student_name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-foreground text-lg">{admission.student_name}</h4>
                              {admission.approved ? (
                                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs flex items-center gap-1">
                                  <Check className="w-3 h-3" /> അംഗീകരിച്ചു
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                                  കാത്തിരിക്കുന്നു
                                </span>
                              )}
                            </div>
                            
                            <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <p><strong>രക്ഷിതാവ്:</strong> {admission.guardian_name}</p>
                              <p><strong>ഫോൺ:</strong> {admission.guardian_phone}</p>
                              <p><strong>വയസ്സ്:</strong> {admission.age || '-'}</p>
                              {additionalData.madarasaLevel && <p><strong>മദ്രസ ലെവൽ:</strong> {additionalData.madarasaLevel}</p>}
                              {additionalData.madarasaName && <p><strong>മദ്രസ:</strong> {additionalData.madarasaName}</p>}
                              {admission.address && <p className="sm:col-span-2"><strong>വിലാസം:</strong> {admission.address}</p>}
                            </div>
                            
                            <p className="text-xs text-muted-foreground">
                              സമർപ്പിച്ചത്: {new Date(admission.created_at).toLocaleDateString('ml-IN')}
                            </p>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex gap-2 flex-shrink-0 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => generateApplicationPDF(admission)}
                              className="rounded-lg text-primary border-primary hover:bg-primary/10"
                            >
                              <Download className="w-4 h-4 mr-1" />PDF
                            </Button>
                            <Button
                              size="sm"
                              variant={admission.approved ? "outline" : "default"}
                              onClick={() => updateAdmission(admission.id, { approved: !admission.approved })}
                              className="rounded-lg"
                            >
                              {admission.approved ? <><EyeOff className="w-4 h-4 mr-1" />മറയ്ക്കുക</> : <><Eye className="w-4 h-4 mr-1" />അംഗീകരിക്കുക</>}
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteAdmission(admission.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Documents Section */}
                        {(docs.photo || docs.aadhaar || docs.birthCertificate || docs.tc) && (
                          <div className="border-t border-border pt-4">
                            <h5 className="text-sm font-medium text-foreground mb-3">📄 ഡോക്യുമെന്റുകൾ</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {docs.photo && (
                                <a href={docs.photo} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                  <img src={docs.photo} alt="Photo" className="w-12 h-12 object-cover rounded mb-2" />
                                  <span className="text-xs text-muted-foreground">ഫോട്ടോ</span>
                                </a>
                              )}
                              {docs.aadhaar && (
                                <a href={docs.aadhaar} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                  <FileText className="w-8 h-8 text-primary mb-2" />
                                  <span className="text-xs text-muted-foreground">ആധാർ</span>
                                </a>
                              )}
                              {docs.birthCertificate && (
                                <a href={docs.birthCertificate} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                  <FileText className="w-8 h-8 text-primary mb-2" />
                                  <span className="text-xs text-muted-foreground">ജനന സർട്ടിഫിക്കറ്റ്</span>
                                </a>
                              )}
                              {docs.tc && (
                                <a href={docs.tc} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                  <FileText className="w-8 h-8 text-primary mb-2" />
                                  <span className="text-xs text-muted-foreground">TC</span>
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Search Settings Tab */}
        {activeTab === "search" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">സെർച്ച് സെറ്റിംഗ്സ്</h2>
            
            {/* Enable/Disable Search */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">സെർച്ച് പ്രവർത്തനക്ഷമമാക്കുക</label>
                  <p className="text-xs text-muted-foreground">വെബ്സൈറ്റിൽ ഗ്ലോബൽ സെർച്ച് ബാർ കാണിക്കുക</p>
                </div>
                <Switch
                  checked={localContent.searchSettings?.enabled !== false}
                  onCheckedChange={async (checked) => {
                    const updatedContent = {
                      ...localContent,
                      searchSettings: {
                        ...localContent.searchSettings,
                        enabled: checked,
                        excludedSections: localContent.searchSettings?.excludedSections || []
                      }
                    };
                    setLocalContent(updatedContent);
                    await handleSaveToDatabase(updatedContent);
                  }}
                />
              </div>
            </div>

            {/* Exclude Sections */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
              <label className="text-sm font-medium text-foreground block mb-4">സെർച്ചിൽ നിന്ന് ഒഴിവാക്കേണ്ട സെക്ഷനുകൾ</label>
              <p className="text-xs text-muted-foreground mb-4">സെർച്ച് ഫലങ്ങളിൽ നിന്ന് ഒഴിവാക്കേണ്ട സെക്ഷനുകൾ തിരഞ്ഞെടുക്കുക</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: 'home', label: 'ഹോം' },
                  { id: 'about', label: 'ഞങ്ങളെക്കുറിച്ച്' },
                  { id: 'courses', label: 'കോഴ്‌സുകൾ' },
                  { id: 'benefits', label: 'നേട്ടങ്ങൾ' },
                  { id: 'gallery', label: 'ഗാലറി' },
                  { id: 'routeMap', label: 'റൂട്ട് മാപ്പ്' },
                  { id: 'contact', label: 'ബന്ധപ്പെടുക' },
                  { id: 'admission', label: 'അഡ്മിഷൻ' },
                  { id: 'suffa', label: 'സുഫ്ഫ' }
                ].map((section) => {
                  const isExcluded = localContent.searchSettings?.excludedSections?.includes(section.id) || false;
                  return (
                    <label
                      key={section.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isExcluded
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isExcluded}
                        onChange={async (e) => {
                          const currentExcluded = localContent.searchSettings?.excludedSections || [];
                          let newExcluded: string[];
                          
                          if (e.target.checked) {
                            newExcluded = [...currentExcluded, section.id];
                          } else {
                            newExcluded = currentExcluded.filter(id => id !== section.id);
                          }
                          
                          const updatedContent = {
                            ...localContent,
                            searchSettings: {
                              ...localContent.searchSettings,
                              enabled: localContent.searchSettings?.enabled !== false,
                              excludedSections: newExcluded
                            }
                          };
                          setLocalContent(updatedContent);
                          await handleSaveToDatabase(updatedContent);
                        }}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-foreground">{section.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            
            {/* Search Info */}
            <div className="bg-muted/30 rounded-2xl p-6 border border-border/30">
              <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                സെർച്ച് വിവരങ്ങൾ
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• തത്സമയ സെർച്ച് - ടൈപ്പ് ചെയ്യുമ്പോൾ ഫലങ്ങൾ കാണിക്കും</li>
                <li>• മലയാളവും ഇംഗ്ലീഷും സപ്പോർട്ട് ചെയ്യുന്നു</li>
                <li>• പേജുകൾ, സെക്ഷനുകൾ, കോഴ്‌സുകൾ, ഗാലറി എന്നിവയിൽ തിരയും</li>
                <li>• മൊബൈൽ, ഡെസ്ക്ടോപ്പ് എന്നിവയിൽ പ്രവർത്തിക്കും</li>
              </ul>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && <AdminSettings />}
        {activeTab === "students" && (
          <div className="space-y-6">
            <PortalPasswordAdmin />
            <AIAssistantAdmin />
            <StudentsAdminPanel />
          </div>
        )}
        {activeTab === "timetable" && <TimetableAdmin />}
        {activeTab === "bookstore" && <BookStoreAdmin />}
        {activeTab === "committee" && <CommitteeAdmin />}
        {activeTab === "committees" && <CommitteesAdminPanel />}
        {activeTab === "notifications" && <NotificationsAdminPanel />}
      </div>
    </div>
  );
};

export default Admin;
