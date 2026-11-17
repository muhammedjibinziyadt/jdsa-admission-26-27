# Online Reading Library & Offline Book Store

## Goal
Add a separate, password-protected online reading library while preserving the existing physical bookstore, current listings, prices, payment flow, and order management.

## Plan
1. Keep the existing bookstore inventory and purchase flow intact. Add two clear choices to `/bookstore`: **Offline Book Store** and **Online Reading Library**. The online option opens a dedicated library page.
2. Add a server-validated library password gate using the supplied initial password, a show/hide control, and the requested Malayalam contact notice. Store the password securely outside public queries. Add an Admin setting to change it, without displaying its current value.
3. Create a private online-books storage area and a separate library-books data model for metadata, publication state, file references, page format, language, and reading direction. Apply explicit grants and row-level policies; keep uploaded PDFs and covers inaccessible through public storage URLs. Limit PDF files to 500 pages and validate type and size.
4. Add an admin “Online Reading Library Management” area for adding, editing, replacing, previewing, sorting, publishing/unpublishing, and deleting online books; show upload progress, upload totals, and storage usage. Keep these operations behind server-side checks of the existing Main Admin credentials. The current browser-only admin session flag will not be treated as authorization.
5. Build the unlocked catalog with search, category filters, sorting, cover cards, and a dedicated reader. Render only visible PDF pages on demand, remember each reader’s page, and support page navigation, fullscreen, zoom, fit modes, orientation, and Arabic RTL. Use page-turn animation where the chosen reader technology supports it; honor the PDF’s original page proportions unless an admin-selected page format is specified.
6. Validate the complete flow: existing physical purchase behavior remains available; wrong/correct library passwords behave correctly; admin upload and edits persist after refresh; unpublished books stay hidden; authorized readers can open and navigate a book; non-admin users cannot manage files or metadata.

## Technical details
- Use a server-side function for password verification and sensitive admin mutations; never compare the library password in browser code or retrieve it through a public table query.
- Keep library metadata separate from the existing `books` and `book_orders` data so the two store types cannot interfere.
- Use private storage with server-issued, short-lived access for permitted reading sessions. A password gate controls the reader experience but cannot prevent an authorized reader from copying content they can view.
- Preserve the existing admin sign-in screen, but revalidate Main Admin credentials on server-only library management requests rather than trusting `sessionStorage`.
