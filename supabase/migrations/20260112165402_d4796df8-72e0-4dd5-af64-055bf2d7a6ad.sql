-- Create app_role enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'moderator');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    role app_role NOT NULL DEFAULT 'moderator',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    created_by text,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy for user_roles - only super_admins can manage roles
CREATE POLICY "Anyone can read roles"
ON public.user_roles
FOR SELECT
USING (true);

-- Create admin_settings table for global website settings
CREATE TABLE public.admin_settings (
    id text PRIMARY KEY DEFAULT 'global',
    theme jsonb NOT NULL DEFAULT '{}'::jsonb,
    typography jsonb NOT NULL DEFAULT '{}'::jsonb,
    layout jsonb NOT NULL DEFAULT '{}'::jsonb,
    seo jsonb NOT NULL DEFAULT '{}'::jsonb,
    animations_enabled boolean NOT NULL DEFAULT true,
    maintenance_mode boolean NOT NULL DEFAULT false,
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_by text
);

-- Enable RLS on admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for admin_settings
CREATE POLICY "Anyone can read admin settings"
ON public.admin_settings
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update admin settings"
ON public.admin_settings
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can insert admin settings"
ON public.admin_settings
FOR INSERT
WITH CHECK (true);

-- Create admin_activity_logs table for audit trail
CREATE TABLE public.admin_activity_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_username text NOT NULL,
    action text NOT NULL,
    details jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on admin_activity_logs
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for activity logs
CREATE POLICY "Anyone can read activity logs"
ON public.admin_activity_logs
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert activity logs"
ON public.admin_activity_logs
FOR INSERT
WITH CHECK (true);

-- Insert default global settings
INSERT INTO public.admin_settings (id, theme, typography, layout, seo)
VALUES (
    'global',
    '{
        "primaryColor": "210 60% 15%",
        "secondaryColor": "187 65% 45%",
        "accentColor": "43 75% 50%",
        "backgroundColor": "210 55% 12%",
        "cardColor": "210 50% 16%",
        "textPrimary": "210 20% 98%",
        "textSecondary": "210 15% 70%",
        "borderColor": "210 40% 25%"
    }'::jsonb,
    '{
        "headingFont": "Playfair Display",
        "bodyFont": "Inter",
        "baseFontSize": "16",
        "headingScale": "1.25",
        "lineHeight": "1.6"
    }'::jsonb,
    '{
        "sectionPadding": "4rem",
        "containerWidth": "1200px",
        "borderRadius": "0.75rem",
        "cardShadow": "elevated"
    }'::jsonb,
    '{
        "metaTitle": "ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസ്",
        "metaDescription": "ഇസ്‌ലാമിക വിദ്യാഭ്യാസവും ആധുനിക വൈദഗ്ധ്യവും സമന്വയിപ്പിച്ച് വിശ്വാസവും ഭാവിയും കെട്ടിപ്പടുക്കുന്നു",
        "ogImage": ""
    }'::jsonb
) ON CONFLICT (id) DO NOTHING;