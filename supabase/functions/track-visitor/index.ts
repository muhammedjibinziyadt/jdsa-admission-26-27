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
    const { page_visited, device_type, browser_name, visitor_name, visitor_email } = body;

    if (!page_visited || typeof page_visited !== 'string') {
      return new Response(JSON.stringify({ error: 'page_visited is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('cf-connecting-ip') 
      || req.headers.get('x-real-ip') 
      || 'Unknown';

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
      // Geo lookup failed
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { error } = await supabase.from('visitor_logs').insert({
      ip_address: ip,
      city,
      country,
      page_visited: String(page_visited).slice(0, 100),
      device_type: device_type ? String(device_type).slice(0, 50) : 'Unknown',
      browser_name: browser_name ? String(browser_name).slice(0, 50) : 'Unknown',
      visitor_name: visitor_name ? String(visitor_name).slice(0, 200) : null,
      visitor_email: visitor_email ? String(visitor_email).slice(0, 255) : null,
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
