---
name: Theme System
description: Admin-controlled site-wide theme manager with 5 presets, custom color picker, live preview, and persistent storage in theme_settings table
type: feature
---
- Table: `theme_settings` (id='global', preset, primary_color, secondary_color, accent_color — all HSL strings).
- `ThemeProvider` (`src/hooks/useTheme.tsx`) loads theme from localStorage instantly, syncs from DB, applies CSS variables (`--primary`, `--secondary`, `--accent`, ring/sidebar tokens) to document root.
- 5 presets: Emerald+White, Dark Green+Gold, Navy+White, Maroon+Cream, Teal+Silver. Custom hex picker also available.
- Admin tab "Theme" in `/admin` uses `ThemeAdmin.tsx` — preview button applies CSS vars without saving, Apply Theme persists to DB.
