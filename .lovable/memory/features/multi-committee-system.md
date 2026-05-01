---
name: Multi-Committee System
description: Four committees (Central, Al Jawahir, Samaja, Library) — admin-only edit, dynamic custom sections, and per-committee fines with PDF receipts
type: feature
---
The Students Portal "കമ്മിറ്റി" tab opens a unified `CommitteeHub` (`/committee/:id`) with a sticky menu bar for the 4 committees: central, jawahir, samaja, library.

**Per committee page (top → bottom):**
- ScoreBoard (admin-controlled in /admin)
- Built-in body sections (CentralBody / JawahirBody / SamajaBody / LibraryBody) — each with Add / Edit / Delete entries
- CustomSections — dynamic sections created by admin (Events, Notices, etc.) with text + image + PDF entries
- CommitteeFinesSection — admin adds penalties; everyone can View / Download Receipt (PDF) / Print

**Edit access:** Only main admin (`useAdminAuth` from /admin login). Committee passwords from earlier iteration are no longer used for editing — `LoginCard` and `useCommitteeAuth` are dead code (kept for now). All committee body components use `useAdminAuth`.

**Editing UI:** `EditEntryDialog` (shadcn dialog) shared across all body sections, custom sections, and fines. Delete uses `window.confirm`.

**Fine receipt:** `src/utils/generateFineReceipt.ts` (jsPDF, A5). Header: "JAWHARATHUL ULOOM SUFFA DARS STUDENTS ASSOCIATION". Includes Date, Day, Committee, Name, Reason, Amount, receipt no (first 8 chars of UUID).

**Tables:** committees, central_*, jawahir_*, samaja_*, library_*, committee_fines, committee_custom_sections, committee_custom_entries.

**Storage buckets:** committee, jawahir, samaja, library (all public). Custom section files use the bucket of their committee.
