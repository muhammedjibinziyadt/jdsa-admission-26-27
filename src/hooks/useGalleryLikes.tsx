import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Generate or retrieve device ID for like tracking
const getDeviceId = (): string => {
  const storageKey = 'gallery_device_id';
  let deviceId = localStorage.getItem(storageKey);
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem(storageKey, deviceId);
  }
  return deviceId;
};

interface LikeCount {
  [imageId: string]: number;
}

interface LikedImages {
  [imageId: string]: boolean;
}

export function useGalleryLikes() {
  const [likeCounts, setLikeCounts] = useState<LikeCount>({});
  const [likedImages, setLikedImages] = useState<LikedImages>({});
  const [loading, setLoading] = useState(true);
  const deviceId = getDeviceId();

  // Load all like counts and user's liked images
  const loadLikes = useCallback(async () => {
    try {
      // Get all likes count grouped by image_id
      const { data: allLikes, error: countError } = await supabase
        .from('gallery_likes')
        .select('image_id');

      if (countError) throw countError;

      // Count likes per image
      const counts: LikeCount = {};
      allLikes?.forEach(like => {
        counts[like.image_id] = (counts[like.image_id] || 0) + 1;
      });
      setLikeCounts(counts);

      // Get user's liked images
      const { data: userLikes, error: userError } = await supabase
        .from('gallery_likes')
        .select('image_id')
        .eq('device_id', deviceId);

      if (userError) throw userError;

      const liked: LikedImages = {};
      userLikes?.forEach(like => {
        liked[like.image_id] = true;
      });
      setLikedImages(liked);
    } catch (error) {
      console.error('Error loading likes:', error);
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  // Toggle like for an image
  const toggleLike = useCallback(async (imageId: string) => {
    const isLiked = likedImages[imageId];

    // Optimistic update
    setLikedImages(prev => ({ ...prev, [imageId]: !isLiked }));
    setLikeCounts(prev => ({
      ...prev,
      [imageId]: (prev[imageId] || 0) + (isLiked ? -1 : 1)
    }));

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('gallery_likes')
          .delete()
          .eq('image_id', imageId)
          .eq('device_id', deviceId);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('gallery_likes')
          .insert({ image_id: imageId, device_id: deviceId });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      setLikedImages(prev => ({ ...prev, [imageId]: isLiked }));
      setLikeCounts(prev => ({
        ...prev,
        [imageId]: (prev[imageId] || 0) + (isLiked ? 1 : -1)
      }));
    }
  }, [deviceId, likedImages]);

  // Subscribe to realtime updates
  useEffect(() => {
    loadLikes();

    const channel = supabase
      .channel('gallery-likes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gallery_likes'
        },
        () => {
          loadLikes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadLikes]);

  return {
    likeCounts,
    likedImages,
    toggleLike,
    loading,
    getLikeCount: (imageId: string) => likeCounts[imageId] || 0,
    isLiked: (imageId: string) => likedImages[imageId] || false
  };
}