---
name: Attendance System
description: Students Portal sub-section with photo profiles, daily attendance marking, and leave tracking with summary
type: feature
---

Students Portal "അറ്റൻഡൻസ്" tab — full student tracking system.

**Tables:** `attendance_students` (name, photo_url, sort_order), `attendance_records` (entry_date, status: present/absent, time_in, time_out — UNIQUE on student_id+entry_date), `attendance_leaves` (start_date, end_date, total_days, reason, return_date).

**Storage:** public bucket `attendance` for student photos.

**Seeded students (15):** Muhammad Navas, Jibin Ziyad, Anshid, Jareer, Shimlal, Sidan, Sinan, Shafi P, Ameen, Shereef, Jubair, Afham, Jinshad, Shafi K, Salman Faris.

**UI:** Grid of clickable student cards → profile page with photo (admin can upload via camera button), summary cards (Present / Absent / Leave totals), attendance history, and leave history. Admin-gated via `useAdminAuth` (sessionStorage). Public users get read-only view.

**Routes:** Lives inside `/students-portal` as a tab — no separate route.
