---
name: Multi-Committee System
description: Four committees (Central, Al Jawahir, Samaja, Library) with login, content management, and admin-controlled performance scoring
type: feature
---
The Students Portal "കമ്മിറ്റി" tab shows a 2x2 grid of 4 committees. Each opens its own route at /committee/{slug}. Slugs: central, jawahir, samaja, library.

**Per committee page:**
- Header banner with committee name + emoji + gradient
- Score Board card (top): Score / Max Score with progress bar + optional remark
- Login card: single password per committee, stored in `committees` table; session via sessionStorage key `committee_session_{id}`
- Content sections (only logged-in members can add/delete; public can view all):
  - Central: inherits legacy CommitteeSection (photo/finance/items/constitution) + updates, item usage records, minutes book
  - Al Jawahir: magazine PDFs (with cover), initiatives, contributors
  - Samaja: weekly photos, bookings, initiatives, monthly award winners
  - Library: books (name+photo), programs, student essay activities

**Admin control:**
- New "Committees (പുതിയത്)" tab in /admin manages all 4 committees: set/change passwords, assign score, max_score, remark
- Old "കമ്മിറ്റി (Legacy)" tab still manages the original photo/finance/items/constitution data (now nested inside Central Committee page)

**Tables:** committees, central_updates, central_item_usage, central_minutes, jawahir_magazines, jawahir_initiatives, jawahir_contributors, samaja_photos, samaja_bookings, samaja_initiatives, samaja_awards, library_books, library_programs, library_activities

**Storage buckets:** jawahir, samaja, library (all public)

**Default passwords:** central2025, jawahir2025, samaja2025, library2025 (admin should change them)
