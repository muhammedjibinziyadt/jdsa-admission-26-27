import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = useCallback(async (file: File, folder: string = 'gallery'): Promise<string | null> => {
    try {
      setUploading(true);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      toast({
        title: "അപ്‌ലോഡ് വിജയകരം!",
        description: "ഇമേജ് അപ്‌ലോഡ് ചെയ്തു",
      });

      return data.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "അപ്‌ലോഡ് പരാജയപ്പെട്ടു",
        description: "ഇമേജ് അപ്‌ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  }, [toast]);

  const deleteImage = useCallback(async (url: string): Promise<boolean> => {
    try {
      // Extract path from URL
      const urlParts = url.split('/storage/v1/object/public/images/');
      if (urlParts.length < 2) return false;
      
      const path = urlParts[1];
      
      const { error } = await supabase.storage
        .from('images')
        .remove([path]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }, []);

  return { uploadImage, deleteImage, uploading };
}
