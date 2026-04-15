import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { page_visited, device_type, browser_name } = body;

    // Get IP from request headers
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('cf-connecting-ip') 
      || req.headers.get('x-real-ip') 
      || 'Unknown';

    // Try to get location from IP using free API
    let city = 'Unknown';
    let country = 'Unknown';
    try {
      if (ip && ip !== 'Unknown' && ip !== '127.0.0.1') {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=city,country`);
        if (geoRes.ok) {
          const geo = await geoRes.json();
          city = geo.city || 'Unknown';
          country = geo.country || 'Unknown';
        }
      }
    } catch {
      // Geo lookup failed, continue with Unknown
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { error } = await supabase.from('visitor_logs').insert({
      ip_address: ip,
      city,
      country,
      page_visited: page_visited || '/',
      device_type: device_type || 'Unknown',
      browser_name: browser_name || 'Unknown',
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
