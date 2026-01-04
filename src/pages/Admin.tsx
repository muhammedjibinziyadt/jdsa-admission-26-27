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
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// Editable content state
interface EditableContent {
  heroTitle: string;
  heroSubtitle: string;
  phone1: string;
  phone2: string;
  aboutTitle: string;
  aboutDescription: string;
  email: string;
  timing: string;
  location: string;
  mapLink: string;
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
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"content" | "gallery" | "courses" | "map" | "forms">("content");
  
  // Editable content
  const [content, setContent] = useState<EditableContent>({
    heroTitle: "ജവ്ഹറത്തുൽ ഉലൂം സുഫ്ഫാ ദർസ്",
    heroSubtitle: "വിജ്ഞാനത്തിന്റെയും മൂല്യങ്ങളുടെയും സമന്വയത്തിലൂടെ പുതിയ തലമുറയെ രൂപപ്പെടുത്തുന്ന വിദ്യാഭ്യാസ കേന്ദ്രം",
    phone1: "+91 95441 24059",
    phone2: "+91 82811 02606",
    aboutTitle: "വിജ്ഞാനത്തിന്റെ വെളിച്ചം",
    aboutDescription: "ജവ്ഹറത്തുൽ ഉലൂം സുഫ്ഫാ ദർസ് ഇസ്ലാമിക വിദ്യാഭ്യാസത്തിന്റെയും ആധുനിക കഴിവുകളുടെയും സമന്വയത്തിലൂടെ വിദ്യാർത്ഥികളെ ഭാവിയിലേക്ക് സജ്ജമാക്കുന്നു.",
    email: "info@jawharathululoom.com",
    timing: "രാവിലെ 8:00 - വൈകുന്നേരം 5:00",
    location: "ജവ്ഹറത്തുൽ ഉലൂം സുഫ്ഫാ ദർസ്, കേരളം, ഇന്ത്യ",
    mapLink: "https://maps.app.goo.gl/ZN8C3epBni6h3hKn9?g_st=aw"
  });

  // Gallery images
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
    { id: 1, title: "സുഫ്ഫാ കോഴ്‌സിന് കീഴിലെ ദർസ്", subtitle: "", description: "ഇസ്ലാമിക വിദ്യാഭ്യാസത്തിന്റെ അടിസ്ഥാനം ഉറപ്പിക്കുന്ന സമഗ്ര പഠന പരിപാടി.", syllabus: "", imageUrl: "" },
    { id: 2, title: "ഖുർആൻ പഠനം", subtitle: "എഴുത്തും വായനയും", description: "തജ്‌വീദ് നിയമങ്ങൾ അനുസരിച്ചുള്ള ഖുർആൻ പാരായണം.", syllabus: "", imageUrl: "" },
    { id: 3, title: "കമ്പ്യൂട്ടർ പഠനം", subtitle: "", description: "ആധുനിക സാങ്കേതിക വിദ്യകളിൽ പ്രാവീണ്യം.", syllabus: "", imageUrl: "" },
    { id: 4, title: "എഴുത്ത് പഠനം", subtitle: "Handwriting & Writing Skills", description: "മനോഹരമായ കൈയക്ഷരം, ക്രിയാത്മക എഴുത്ത് കഴിവുകൾ.", syllabus: "", imageUrl: "" },
    { id: 5, title: "പ്രസംഗ പരിശീലനം", subtitle: "Public Speaking & Dars Training", description: "പൊതുവേദികളിൽ ആത്മവിശ്വാസത്തോടെ സംസാരിക്കാൻ.", syllabus: "", imageUrl: "" },
    { id: 6, title: "ലൈബ്രറി സൗകര്യം", subtitle: "", description: "വിവിധ വിഷയങ്ങളിലുള്ള പുസ്തകങ്ങൾ.", syllabus: "", imageUrl: "" },
    { id: 7, title: "കാന്റീൻ സൗകര്യം", subtitle: "", description: "ശുചിത്വപൂർണ്ണമായ അന്തരീക്ഷത്തിൽ ആരോഗ്യകരമായ ഭക്ഷണം.", syllabus: "", imageUrl: "" },
    { id: 8, title: "വഅള് പരിശീലനം", subtitle: "", description: "മതപരമായ പ്രഭാഷണങ്ങൾ നടത്താനുള്ള കഴിവ്.", syllabus: "", imageUrl: "" },
    { id: 9, title: "വിദ്യാർത്ഥികളുടെ വ്യക്തിത്വ വികസനം", subtitle: "", description: "നേതൃത്വ ഗുണങ്ങൾ, ടീം വർക്ക്, സമയ മാനേജ്‌മെന്റ്.", syllabus: "", imageUrl: "" }
  ]);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [editingCourse, setEditingCourse] = useState<number | null>(null);
  const [tempCourse, setTempCourse] = useState<Course | null>(null);

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  const handleEdit = (field: string, value: string) => {
    setEditingField(field);
    setTempValue(value);
  };

  const handleSave = (field: keyof EditableContent) => {
    setContent(prev => ({ ...prev, [field]: tempValue }));
    setEditingField(null);
    toast({
      title: "സേവ് ചെയ്തു!",
      description: "മാറ്റങ്ങൾ വിജയകരമായി സേവ് ചെയ്തു.",
    });
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleDeleteImage = (id: number) => {
    setGalleryImages(prev => prev.filter(img => img.id !== id));
    toast({
      title: "ഇമേജ് ഡിലീറ്റ് ചെയ്തു!",
      description: "ഗാലറിയിൽ നിന്നും ഇമേജ് നീക്കം ചെയ്തു.",
    });
  };

  const handleAddImage = () => {
    if (newImageUrl && newImageAlt) {
      const newId = Math.max(...galleryImages.map(img => img.id), 0) + 1;
      setGalleryImages(prev => [...prev, { id: newId, src: newImageUrl, alt: newImageAlt }]);
      setNewImageUrl("");
      setNewImageAlt("");
      toast({
        title: "ഇമേജ് ചേർത്തു!",
        description: "പുതിയ ഇമേജ് ഗാലറിയിലേക്ക് ചേർത്തു.",
      });
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
      toast({
        title: "കോഴ്‌സ് അപ്‌ഡേറ്റ് ചെയ്തു!",
        description: "കോഴ്‌സ് വിവരങ്ങൾ സേവ് ചെയ്തു.",
      });
    }
  };

  const handleDeleteCourse = (id: number) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    toast({
      title: "കോഴ്‌സ് ഡിലീറ്റ് ചെയ്തു!",
      description: "കോഴ്‌സ് നീക്കം ചെയ്തു.",
    });
  };

  const handleAddCourse = () => {
    const newId = Math.max(...courses.map(c => c.id), 0) + 1;
    const newCourse: Course = {
      id: newId,
      title: "പുതിയ കോഴ്‌സ്",
      subtitle: "",
      description: "കോഴ്‌സ് വിവരണം ഇവിടെ ചേർക്കുക",
      syllabus: "",
      imageUrl: ""
    };
    setCourses(prev => [...prev, newCourse]);
    toast({
      title: "കോഴ്‌സ് ചേർത്തു!",
      description: "പുതിയ കോഴ്‌സ് ചേർത്തു. ഇപ്പോൾ എഡിറ്റ് ചെയ്യുക.",
    });
  };

  const contentFields = [
    { key: "heroTitle" as const, label: "ഹീറോ ടൈറ്റിൽ", value: content.heroTitle },
    { key: "heroSubtitle" as const, label: "ഹീറോ സബ്‌ടൈറ്റിൽ", value: content.heroSubtitle },
    { key: "phone1" as const, label: "ഫോൺ നമ്പർ 1", value: content.phone1 },
    { key: "phone2" as const, label: "ഫോൺ നമ്പർ 2", value: content.phone2 },
    { key: "aboutTitle" as const, label: "അബൗട്ട് ടൈറ്റിൽ", value: content.aboutTitle },
    { key: "aboutDescription" as const, label: "അബൗട്ട് വിവരണം", value: content.aboutDescription },
    { key: "email" as const, label: "ഇമെയിൽ", value: content.email },
    { key: "timing" as const, label: "സമയം", value: content.timing },
    { key: "location" as const, label: "സ്ഥലം", value: content.location },
  ];

  const tabs = [
    { id: "content" as const, label: "ഉള്ളടക്കം", icon: Edit3 },
    { id: "gallery" as const, label: "ഗാലറി", icon: ImageIcon },
    { id: "courses" as const, label: "കോഴ്‌സുകൾ", icon: BookOpen },
    { id: "map" as const, label: "റൂട്ട് മാപ്പ്", icon: MapPin },
    { id: "forms" as const, label: "ഫോം ഫീൽഡുകൾ", icon: FileText },
  ];

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
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(tab => (
            <Button 
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className="rounded-xl"
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
              ടെക്സ്റ്റ് & അക്ഷരത്തെറ്റുകൾ തിരുത്തുക
            </h2>
            {contentFields.map(field => (
              <div key={field.key} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      {field.label}
                    </label>
                    {editingField === field.key ? (
                      <div className="space-y-3">
                        <textarea
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                          rows={field.key.includes("Description") || field.key.includes("Subtitle") ? 4 : 2}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSave(field.key)} className="rounded-lg">
                            <Save className="w-4 h-4 mr-1" />
                            സേവ്
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel} className="rounded-lg">
                            <X className="w-4 h-4 mr-1" />
                            റദ്ദാക്കുക
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-foreground">{field.value}</p>
                    )}
                  </div>
                  {editingField !== field.key && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleEdit(field.key, field.value)}
                      className="text-primary hover:text-primary"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              ഗാലറി ഇമേജുകൾ
            </h2>
            
            {/* Add New Image */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
              <h3 className="font-medium text-foreground mb-4">പുതിയ ഇമേജ് ചേർക്കുക</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  type="url"
                  placeholder="ഇമേജ് URL"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
                <input
                  type="text"
                  placeholder="ഇമേജ് വിവരണം (Alt text)"
                  value={newImageAlt}
                  onChange={(e) => setNewImageAlt(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <Button onClick={handleAddImage} className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                ഇമേജ് ചേർക്കുക
              </Button>
            </div>

            {/* Gallery Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map(image => (
                <div key={image.id} className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 shadow-soft">
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteImage(image.id)}
                      className="rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      ഡിലീറ്റ്
                    </Button>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-foreground">{image.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                കോഴ്‌സുകൾ മാനേജ് ചെയ്യുക
              </h2>
              <Button onClick={handleAddCourse} className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                പുതിയ കോഴ്‌സ്
              </Button>
            </div>
            
            <div className="space-y-4">
              {courses.map(course => (
                <div key={course.id} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                  {editingCourse === course.id && tempCourse ? (
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">ടൈറ്റിൽ</label>
                          <input
                            type="text"
                            value={tempCourse.title}
                            onChange={(e) => setTempCourse({ ...tempCourse, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">സബ്‌ടൈറ്റിൽ</label>
                          <input
                            type="text"
                            value={tempCourse.subtitle}
                            onChange={(e) => setTempCourse({ ...tempCourse, subtitle: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">വിവരണം</label>
                        <textarea
                          value={tempCourse.description}
                          onChange={(e) => setTempCourse({ ...tempCourse, description: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">സിലബസ് (ഓപ്ഷണൽ)</label>
                        <textarea
                          value={tempCourse.syllabus}
                          onChange={(e) => setTempCourse({ ...tempCourse, syllabus: e.target.value })}
                          rows={3}
                          placeholder="സിലബസ് വിവരങ്ങൾ ഇവിടെ ചേർക്കുക..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">ഇമേജ് URL (ഓപ്ഷണൽ)</label>
                        <input
                          type="url"
                          value={tempCourse.imageUrl}
                          onChange={(e) => setTempCourse({ ...tempCourse, imageUrl: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveCourse} className="rounded-lg">
                          <Save className="w-4 h-4 mr-1" />
                          സേവ്
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setEditingCourse(null); setTempCourse(null); }} className="rounded-lg">
                          <X className="w-4 h-4 mr-1" />
                          റദ്ദാക്കുക
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-display text-lg font-semibold text-foreground">{course.title}</h3>
                        {course.subtitle && <p className="text-sm text-primary mb-1">{course.subtitle}</p>}
                        <p className="text-muted-foreground text-sm">{course.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEditCourse(course)} className="text-primary">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteCourse(course.id)} className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map Tab */}
        {activeTab === "map" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              റൂട്ട് മാപ്പ് സെറ്റിംഗ്സ്
            </h2>
            
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Google Maps ലിങ്ക്</label>
                  {editingField === "mapLink" ? (
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="https://maps.app.goo.gl/..."
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave("mapLink")} className="rounded-lg">
                          <Save className="w-4 h-4 mr-1" />
                          സേവ്
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel} className="rounded-lg">
                          <X className="w-4 h-4 mr-1" />
                          റദ്ദാക്കുക
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-foreground break-all">{content.mapLink}</p>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEdit("mapLink", content.mapLink)}
                        className="text-primary hover:text-primary flex-shrink-0"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">സ്ഥലം / വിലാസം</label>
                  {editingField === "location" ? (
                    <div className="space-y-3">
                      <textarea
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave("location")} className="rounded-lg">
                          <Save className="w-4 h-4 mr-1" />
                          സേവ്
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel} className="rounded-lg">
                          <X className="w-4 h-4 mr-1" />
                          റദ്ദാക്കുക
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-foreground">{content.location}</p>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEdit("location", content.location)}
                        className="text-primary hover:text-primary"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Forms Tab */}
        {activeTab === "forms" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              അഡ്മിഷൻ ഫോം ഫീൽഡുകൾ
            </h2>
            
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
              <p className="text-muted-foreground mb-4">
                അഡ്മിഷൻ ഫോമിൽ ഇപ്പോൾ ലഭ്യമായ ഫീൽഡുകൾ:
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "വിദ്യാർത്ഥിയുടെ പേര്",
                  "വയസ്സ്",
                  "ജനനതീയതി",
                  "ലിംഗഭേദം",
                  "രക്ഷിതാവിന്റെ പേര്",
                  "ബന്ധം",
                  "ഫോൺ നമ്പർ",
                  "ഇമെയിൽ",
                  "മേൽവിലാസം",
                  "ആധാർ കാർഡ് നമ്പർ",
                  "ആധാർ കാർഡ് അപ്‌ലോഡ്",
                  "ജനന സർട്ടിഫിക്കറ്റ് അപ്‌ലോഡ്",
                  "സ്കൂൾ TC അപ്‌ലോഡ്",
                  "കോഴ്‌സ് തിരഞ്ഞെടുപ്പ്",
                  "അധിക വിവരങ്ങൾ"
                ].map((field, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm text-foreground">{field}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground mt-6">
                * ഡോക്യുമെന്റ് അപ്‌ലോഡ് ഫീച്ചർ ഇപ്പോൾ ലഭ്യമാണ്. Lovable Cloud ഉപയോഗിച്ച് ഡാറ്റാബേസിൽ സേവ് ചെയ്യാൻ Cloud enable ചെയ്യുക.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
