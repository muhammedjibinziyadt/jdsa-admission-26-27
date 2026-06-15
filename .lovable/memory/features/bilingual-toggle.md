---
name: Bilingual language toggle
description: Site-wide Malayalam/English toggle, scope of translation, and helper utilities
type: feature
---
- Toggle component: `src/components/LanguageToggle.tsx` (മല / EN pill, visible in nav).
- Hook: `useLanguage()` from `src/hooks/useLanguage.tsx` — `lang` ('M'|'E'), `t(m,e)`, persisted in `localStorage.site_lang`.
- Translated so far (titles/eyebrows + key CTAs only): Navigation, About, Benefits, Gallery, RouteMap, Footer (quick links + contact heading), CommitteeHub header/tabs.
- PDFs: `src/utils/siteLang.ts` exposes `tx(m,e)` for non-React contexts. Applied to generateSectionPDF + generateRecordPDF headers/footers. generateApplicationPDF / generateStudentPDF / generateFineReceipt already render bilingual labels inline.
- NOT translated yet (intentional, scope=key buttons only): form labels/placeholders, admin panels, portal/committee body content, AI assistant prompts, toast messages.
