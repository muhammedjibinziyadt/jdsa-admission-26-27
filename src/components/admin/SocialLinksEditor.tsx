import { useState, useEffect } from 'react';
import { Save, Loader2, MessageCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WebsiteContent } from '@/hooks/useWebsiteContent';

// Custom icons for social platforms
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

interface SocialLinksEditorProps {
  content: WebsiteContent;
  onSave: (content: WebsiteContent) => Promise<void>;
  saving: boolean;
}

interface SocialSettings {
  whatsapp: string;
  facebook: string;
  youtube: string;
  instagram: string;
  whatsappEnabled: boolean;
  facebookEnabled: boolean;
  youtubeEnabled: boolean;
  instagramEnabled: boolean;
}

const SocialLinksEditor = ({ content, onSave, saving }: SocialLinksEditorProps) => {
  const [socialSettings, setSocialSettings] = useState<SocialSettings>({
    whatsapp: '',
    facebook: '',
    youtube: '',
    instagram: '',
    whatsappEnabled: true,
    facebookEnabled: true,
    youtubeEnabled: true,
    instagramEnabled: true
  });

  useEffect(() => {
    if (content?.social) {
      setSocialSettings({
        whatsapp: content.social.whatsapp || '',
        facebook: content.social.facebook || '',
        youtube: content.social.youtube || '',
        instagram: content.social.instagram || '',
        whatsappEnabled: (content.social as SocialSettings).whatsappEnabled !== false,
        facebookEnabled: (content.social as SocialSettings).facebookEnabled !== false,
        youtubeEnabled: (content.social as SocialSettings).youtubeEnabled !== false,
        instagramEnabled: (content.social as SocialSettings).instagramEnabled !== false
      });
    }
  }, [content]);

  const handleSave = async () => {
    const updatedContent = {
      ...content,
      social: socialSettings
    };
    await onSave(updatedContent);
  };

  const socialPlatforms = [
    {
      key: 'whatsapp' as const,
      label: 'WhatsApp',
      enabledKey: 'whatsappEnabled' as const,
      Icon: MessageCircle,
      color: 'bg-green-500',
      placeholder: '919544124059 (രാജ്യ കോഡ് ഉൾപ്പെടെ)',
      description: 'രാജ്യ കോഡ് ഉൾപ്പെടെ നമ്പർ നൽകുക (ഉദാ: 919544124059)'
    },
    {
      key: 'facebook' as const,
      label: 'Facebook',
      enabledKey: 'facebookEnabled' as const,
      Icon: FacebookIcon,
      color: 'bg-blue-600',
      placeholder: 'https://facebook.com/yourpage',
      description: 'പേജ് URL നൽകുക'
    },
    {
      key: 'youtube' as const,
      label: 'YouTube',
      enabledKey: 'youtubeEnabled' as const,
      Icon: YoutubeIcon,
      color: 'bg-red-600',
      placeholder: 'https://youtube.com/@yourchannel',
      description: 'ചാനൽ URL നൽകുക'
    },
    {
      key: 'instagram' as const,
      label: 'Instagram',
      enabledKey: 'instagramEnabled' as const,
      Icon: InstagramIcon,
      color: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600',
      placeholder: 'https://instagram.com/yourprofile',
      description: 'പ്രൊഫൈൽ URL നൽകുക'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
        <h3 className="font-semibold text-foreground mb-2">സോഷ്യൽ മീഡിയ ലിങ്കുകൾ</h3>
        <p className="text-sm text-muted-foreground mb-6">
          ഫൂട്ടറിൽ കാണിക്കുന്ന സോഷ്യൽ മീഡിയ ലിങ്കുകൾ ഇവിടെ മാറ്റാം. 
          ഓരോ പ്ലാറ്റ്‌ഫോമും വ്യക്തിഗതമായി ഓൺ/ഓഫ് ചെയ്യാം.
        </p>

        <div className="space-y-6">
          {socialPlatforms.map(platform => (
            <div key={platform.key} className="border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`${platform.color} text-white p-2 rounded-lg`}>
                    {platform.key === 'whatsapp' ? (
                      <platform.Icon className="w-5 h-5" />
                    ) : (
                      <platform.Icon />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{platform.label}</h4>
                    <p className="text-xs text-muted-foreground">{platform.description}</p>
                  </div>
                </div>
                
                {/* Enable/Disable Toggle */}
                <button
                  onClick={() => setSocialSettings(prev => ({
                    ...prev,
                    [platform.enabledKey]: !prev[platform.enabledKey]
                  }))}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    socialSettings[platform.enabledKey] 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {socialSettings[platform.enabledKey] ? (
                    <>
                      <ToggleRight className="w-4 h-4" />
                      ഓൺ
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4" />
                      ഓഫ്
                    </>
                  )}
                </button>
              </div>
              
              <input
                type="text"
                value={socialSettings[platform.key]}
                onChange={(e) => setSocialSettings(prev => ({
                  ...prev,
                  [platform.key]: e.target.value
                }))}
                placeholder={platform.placeholder}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                disabled={!socialSettings[platform.enabledKey]}
              />
            </div>
          ))}
        </div>

        <Button 
          onClick={handleSave} 
          className="mt-6 rounded-xl w-full" 
          disabled={saving}
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          മാറ്റങ്ങൾ സേവ് ചെയ്യുക
        </Button>
      </div>

      {/* Preview */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
        <h3 className="font-semibold text-foreground mb-4">പ്രിവ്യൂ (ഫൂട്ടറിൽ ഇങ്ങനെ കാണും)</h3>
        <div className="flex justify-center gap-4 p-6 bg-primary/10 rounded-xl">
          {socialPlatforms.map(platform => {
            const isEnabled = socialSettings[platform.enabledKey] && socialSettings[platform.key];
            if (!isEnabled) return null;
            
            return (
              <div
                key={platform.key}
                className={`${platform.color} text-white p-3 rounded-full shadow-lg flex items-center justify-center`}
              >
                {platform.key === 'whatsapp' ? (
                  <platform.Icon className="w-5 h-5" />
                ) : (
                  <platform.Icon />
                )}
              </div>
            );
          })}
          {!socialPlatforms.some(p => socialSettings[p.enabledKey] && socialSettings[p.key]) && (
            <p className="text-muted-foreground text-sm">ഒരു ലിങ്കും ഓൺ ചെയ്തിട്ടില്ല</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialLinksEditor;