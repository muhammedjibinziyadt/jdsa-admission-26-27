---
name: Multi-Committee System
description: Four committees with admin + per-committee logins, fund book, report books, monthly tracking, library issues, and admin-only fines
type: feature
---
The Students Portal "കമ്മിറ്റി" tab opens `CommitteeHub` (`/committee/:id`) with a sticky menu bar for: central, jawahir, samaja, library.

**Edit access (per-committee content):** Either main admin (`useAdminAuth`) OR committee member logged in via `LoginCard` (committee password set in /admin). Combined in `useCommitteeEdit(id) → { canEdit, isAdmin, isCommitteeMember }`. Used by all body sections + `CustomSections`.

**Fines: ADMIN ONLY.** `CommitteeFinesSection` uses `useAdminAuth` directly — committee members can view/download/print receipts but cannot add/edit/delete/toggle status.

**Per-committee features:**
- **Central** (`CentralBody`): Fund Book (paid/pending with totals), Report Book (notebook style with modal viewer), Updates, Item Usage, Minutes
- **Jawahir** (`JawahirBody`): Magazines (PDF), Monthly Article Tracking (15 students from `jawahir_students`, alternates Writing/Typing automatically — April=Writing, May=Typing, etc., red highlight if not submitted), Programs. *Donation students UI removed (table `jawahir_contributors` kept).*
- **Samaja** (`SamajaBody`): Photos, Report Book (attended/absent/speakers/details with modal viewer), Initiatives, Awards. *Booking UI removed (table `samaja_bookings` kept).*
- **Library** (`LibraryBody`): Book List with Available/Missing status, Book Issue Records (student/book/date/time), Programs.

**Tables added:** central_fund_book, central_reports, samaja_reports, jawahir_students (seeded with 15 names), jawahir_submissions, library_book_issues. `library_books.status` column added.

**Storage buckets:** committee, jawahir, samaja, library (all public).

**Receipt:** `src/utils/generateFineReceipt.ts` (jsPDF, A5, green=Paid / red=Unpaid).
