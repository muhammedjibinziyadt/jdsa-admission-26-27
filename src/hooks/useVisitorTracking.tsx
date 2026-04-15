import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return 'Mobile';
  if (/Tablet|iPad/i.test(ua)) return 'Tablet';
  return 'Desktop';
}

function getBrowserName(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Unknown';
}

export function useVisitorTracking(pageName: string) {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await supabase.functions.invoke('track-visitor', {
          body: {
            page_visited: pageName,
            device_type: getDeviceType(),
            browser_name: getBrowserName(),
          },
        });
      } catch (e) {
        // Silent fail - tracking should not affect UX
      }
    };

    trackVisit();
  }, [pageName]);
}
