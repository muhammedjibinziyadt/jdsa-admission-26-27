import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save, RotateCcw, Globe, Image as ImageIcon } from 'lucide-react';
import { SEOSettings } from '@/hooks/useAdminSettings';

interface SEOEditorProps {
  seo: SEOSettings;
  onSave: (seo: SEOSettings) => Promise<boolean>;
  saving: boolean;
}

export function SEOEditor({ seo, onSave, saving }: SEOEditorProps) {
  const [localSEO, setLocalSEO] = useState<SEOSettings>(seo);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSEO(seo);
  }, [seo]);

  useEffect(() => {
    const changed = JSON.stringify(localSEO) !== JSON.stringify(seo);
    setHasChanges(changed);
  }, [localSEO, seo]);

  const handleReset = () => {
    setLocalSEO(seo);
  };

  const handleSave = async () => {
    const success = await onSave(localSEO);
    if (success) {
      setHasChanges(false);
      
      // Update document title
      if (localSEO.metaTitle) {
        document.title = localSEO.metaTitle;
      }
      
      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && localSEO.metaDescription) {
        metaDesc.setAttribute('content', localSEO.metaDescription);
      }
    }
  };

  const titleLength = localSEO.metaTitle.length;
  const descriptionLength = localSEO.metaDescription.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">SEO & മെറ്റാ സെറ്റിംഗ്സ്</h2>
          <p className="text-muted-foreground mt-1">സെർച്ച് എഞ്ചിൻ ഒപ്റ്റിമൈസേഷൻ നിയന്ത്രിക്കുക</p>
        </div>
        <div className="flex gap-3">
          {hasChanges && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="rounded-xl"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              റീസെറ്റ്
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="rounded-xl"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            സേവ് ചെയ്യുക
          </Button>
        </div>
      </div>

      {/* Meta Title */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-4">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-secondary" />
          <h3 className="font-semibold text-foreground">മെറ്റാ ടൈറ്റിൽ</h3>
        </div>
        
        <div>
          <input
            type="text"
            value={localSEO.metaTitle}
            onChange={(e) => setLocalSEO({ ...localSEO, metaTitle: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary/20"
            placeholder="വെബ്സൈറ്റ് ടൈറ്റിൽ"
            maxLength={60}
          />
          <div className="flex justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              ബ്രൗസർ ടാബിലും സെർച്ച് റിസൾട്ടിലും കാണിക്കും
            </p>
            <span className={`text-xs ${titleLength > 60 ? 'text-destructive' : titleLength > 50 ? 'text-amber-500' : 'text-muted-foreground'}`}>
              {titleLength}/60
            </span>
          </div>
        </div>
      </div>

      {/* Meta Description */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-4">
        <h3 className="font-semibold text-foreground">മെറ്റാ ഡിസ്ക്രിപ്ഷൻ</h3>
        
        <div>
          <textarea
            value={localSEO.metaDescription}
            onChange={(e) => setLocalSEO({ ...localSEO, metaDescription: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary/20 resize-none"
            placeholder="വെബ്സൈറ്റിന്റെ ചെറിയ വിവരണം"
            rows={3}
            maxLength={160}
          />
          <div className="flex justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              സെർച്ച് റിസൾട്ടിൽ ടൈറ്റിലിന് താഴെ കാണിക്കും
            </p>
            <span className={`text-xs ${descriptionLength > 160 ? 'text-destructive' : descriptionLength > 140 ? 'text-amber-500' : 'text-muted-foreground'}`}>
              {descriptionLength}/160
            </span>
          </div>
        </div>
      </div>

      {/* OG Image */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-4">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-5 h-5 text-secondary" />
          <h3 className="font-semibold text-foreground">ഓപ്പൺ ഗ്രാഫ് ഇമേജ്</h3>
        </div>
        
        <div>
          <input
            type="text"
            value={localSEO.ogImage}
            onChange={(e) => setLocalSEO({ ...localSEO, ogImage: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary/20"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-muted-foreground mt-2">
            സോഷ്യൽ മീഡിയയിൽ ഷെയർ ചെയ്യുമ്പോൾ കാണിക്കുന്ന ഇമേജ് (1200x630 പിക്സൽ ശുപാർശ)
          </p>
        </div>
        
        {localSEO.ogImage && (
          <div className="mt-4">
            <img 
              src={localSEO.ogImage} 
              alt="OG Preview" 
              className="max-w-sm rounded-lg border border-border"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Search Preview */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-4">
        <h3 className="font-semibold text-foreground">Google സെർച്ച് പ്രിവ്യൂ</h3>
        
        <div className="p-4 bg-white rounded-lg border">
          <div className="text-blue-700 text-lg hover:underline cursor-pointer font-medium">
            {localSEO.metaTitle || 'വെബ്സൈറ്റ് ടൈറ്റിൽ'}
          </div>
          <div className="text-green-700 text-sm mt-1">
            https://yourwebsite.com
          </div>
          <div className="text-gray-600 text-sm mt-1 line-clamp-2">
            {localSEO.metaDescription || 'വെബ്സൈറ്റിന്റെ വിവരണം ഇവിടെ കാണിക്കും...'}
          </div>
        </div>
      </div>

      {/* Social Preview */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-4">
        <h3 className="font-semibold text-foreground">Facebook/WhatsApp ഷെയർ പ്രിവ്യൂ</h3>
        
        <div className="max-w-md border border-gray-300 rounded-lg overflow-hidden bg-white">
          {localSEO.ogImage ? (
            <img 
              src={localSEO.ogImage} 
              alt="OG Preview" 
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <div className="p-3">
            <div className="text-xs text-gray-500 uppercase">yourwebsite.com</div>
            <div className="font-bold text-gray-900 mt-1">
              {localSEO.metaTitle || 'വെബ്സൈറ്റ് ടൈറ്റിൽ'}
            </div>
            <div className="text-sm text-gray-600 mt-1 line-clamp-2">
              {localSEO.metaDescription || 'വിവരണം...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
