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
  Upload
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
}

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"content" | "images" | "gallery">("content");
  
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
    location: "ജവ്ഹറത്തുൽ ഉലൂം സുഫ്ഫാ ദർസ്, കേരളം, ഇന്ത്യ"
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

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

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
            <h1 className="font-display text-xl font-bold text-foreground">അഡ്മിൻ ഡാഷ്‌ബോർഡ്</h1>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-8">
          <Button 
            variant={activeTab === "content" ? "default" : "outline"}
            onClick={() => setActiveTab("content")}
            className="rounded-xl"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            ഉള്ളടക്കം എഡിറ്റ് ചെയ്യുക
          </Button>
          <Button 
            variant={activeTab === "gallery" ? "default" : "outline"}
            onClick={() => setActiveTab("gallery")}
            className="rounded-xl"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            ഗാലറി മാനേജ്മെന്റ്
          </Button>
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
      </div>
    </div>
  );
};

export default Admin;
