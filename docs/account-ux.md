# Account workspace UX

## Intent brief

- Audience: invited site administrators, primarily on desktop, with usable mobile access.
- Primary job: understand traffic for a month or day, then inspect a page.
- Secondary jobs: manage partner pages, drafts and contact forms; reach listings and inquiries quickly.
- Success: reports always identify their period and source; page details retain the period; editing does not silently lose work.
- Data: GA4 supplies traffic and acquisition; Search Console supplies search queries. Clarity remains available for recordings. Never substitute generated numbers for unavailable reports.

## Rationale

Use a compact grouped sidebar and a full-width workspace instead of the public breadcrumb hero. Put date controls before data. Show four summary metrics, then traffic, popular pages, acquisition and search. Page details use the same report with a clear back action. Remove visitor-friction metrics and the old snapshot footnotes.

Partners has a searchable library followed by a focused editor. A new partner begins in draft. Basics are immediately visible; images, page content and form fields use disclosure sections. Publishing is the primary action; saving a draft is secondary. Existing avatar controls move into Account settings.

## Wireframes

```text
EXELERO / Site admin                              View website
──────────────────────────────────────────────────────────────
Overview        │ Tracking                     Clarity ↗
  Tracking      │ [This month] [Today] [Month/Day] [date] [‹ ›]
Website         │ 1–5 October 2026 · All pages
  Partners      │ Visits      Visitors      Views      Engagement
  Boat listings │ ┌ Traffic over time ────────────────┐
  Add a boat    │ │ Recharts area chart / data table  │
Inquiries       │ └───────────────────────────────────┘
  Charter       │ Popular pages          Views Visitors  Details
  Transport     │ /new-yachts            …     …         →
Settings        │ Sources pie     Channels pie     Regions pie
  Dealers       │ Search queries      Clicks Impressions CTR Position
  Account       │
Sign out        │

Partners                                      [Add partner]
[Search partners] [All / Published / Draft]
[Logo · Name · Status] [Logo · Name · Status] →
Partner name                                         Draft
[Basics: labelled fields in two columns]
[Images: preview + dropzone] [Page content] [Contact form]
Unsaved changes                        [Save draft] [Publish]
```

## Component specification

- Sidebar: 224px desktop, grouped links with icon and text, active state and `aria-current`. Mobile menu is an inline disclosure, not an overlay. All invited accounts can reach every section.
- Report controls: month/day granularity, native month/date inputs, previous/next and Today/This month shortcuts. Future periods disabled. Period travels in the URL with the selected page.
- Metrics: sessions labelled Visits, total users labelled Visitors, page views, engagement rate; totals requested directly, never summed from daily unique users.
- Traffic: area chart, daily points for months and hourly points for days. Text data table allows accessible inspection and opening a daily report.
- Popular pages: five columns maximum; path is an explicit detail button. Details update all GA4 panels and filter search queries to the page.
- Pies: sources, channels and regions. Six leading segments plus Other; visible text legend includes count and percentage. Empty reports do not render a fabricated pie.
- Search: top queries, clicks, impressions, CTR, average position. Distinct connection/empty states, with concise freshness and Pacific-time information.
- Partner editor: four disclosure sections, bounded custom form fields, visible image recommendations, draft/published badge, publication link only for published records. Confirm discarding edits or unpublishing. Disable conflicting actions during uploads/saves.
- Styles: shared cool neutral/deep blue tokens from DESIGN.md; SourceSans3; 8px corners, 1px borders, 44px controls. No decorative shadows.

## State checklist

- [x] Initial reports: shaped loading skeleton and labelled busy state.
- [x] Changing dates/pages: hide old report to avoid mislabelling its period; cancel stale fetches.
- [x] GA4 and Search Console: independent ready, empty, not-connected and unavailable states.
- [x] Failed action: toast with useful reason; persistent neutral recovery action where needed.
- [x] Today: identifies provisional data; hours later than current property time are absent.
- [x] Historical dates: no invented data before the providers' retained history.
- [x] Partners: loading, empty library, no search matches, load failure and retry.
- [x] Partner writes/uploads: immediate busy labels, toast success/error, preserve edits on error.
- [x] Navigation/unload with partner changes: discard confirmation.

## Accessibility

Explicit labels above inputs; semantic headings, tables and buttons; text with status colours; visible focus rings; no hover-only actions. Recharts accessibility support plus tabular alternatives and labelled legends. Mobile tables scroll inside their own container. Reduced motion disables chart animation (charts are static by default).

## Open configuration

User confirmed GA4 and Search Console and is adding server credentials. Use Europe/Amsterdam for period selection unless ANALYTICS_TIME_ZONE is set to the GA4 property time zone. Show Google's returned property time zone. Search Console uses Pacific dates and may omit recent or privacy-filtered queries. No visitor collection changes are part of this work.

## Expanded account scope

The user requested the same treatment for every account section. Dealers get labelled fields, search, save feedback and recoverable loading. Listings get search/status filters and explicit visibility/availability controls. Charter and transportation inquiries share a compact six-column inbox with search and status filters; preview and edit retain all original fields, grouped into Contact, Request and Boat details. Add/edit boat forms use disclosure groups for the existing fields and uploads, preserving draft/media functionality. Account settings retain avatar, email, password and passkeys, with clear labels and separated security actions. All tables have scroll containers on smaller screens. Errors use toasts.

## Inquiry access migration

Local verification found the inquiry tables had submission policies but no authenticated management policies. `supabase/migrations/20261005140000_account_inquiry_management.sql` adds read/update/delete access only for the authenticated role, matching the invitation-only account rule. It leaves anonymous submissions unchanged. Apply it to the hosted project with its owner SQL session if these policies are absent there; it is safe to re-run. Local verification applies this migration to the isolated local database only.

## Review and verification

- UX review: corrected the public header positioning leaking into the account, mobile table wrapping, partner checkbox styles, hidden navigation focus, conflicting primary-button styles, and missing default avatar. Long form sections, draft states, explicit labels, confirmation/retry actions and 44px primary controls were checked.
- React review: tabs mount only while active; Google providers fetch concurrently; report fetches abort on parameter changes; caches are bounded; stable boat-editor close callbacks prevent a parent render from reloading unsaved edits.
- TypeScript: `npx tsc --noEmit --incremental false` passed.
- ESLint: zero errors; 32 existing warnings elsewhere in the project.
- Deterministic reporting tests passed, including signed OAuth, calendar boundaries, page/host filtering, period-wide unique users, missing providers and request coalescing.
- Local HTTP checks passed for authenticated access, anonymous denial, private/no-store responses, future-date rejection and credential privacy.
- Isolated browser on port 3002: desktop/month/today/page-detail charts with explicit test fixtures; 390px mobile layout; partner filtering, unsaved navigation confirmation and custom-field draft save; actual local charter/transportation/dealer updates; boat listing filters and editor state retention; account settings. Visuals inspected after fixes. Temporary test records are removed after verification.
- Live Google reports are unverified until the three requested settings are provided. Hosted inquiry access needs the new migration. The local boat fixture uses the older local schema; no hosted boat mutation was performed.

## Partner media and selector refinement

The partner library is a single horizontal row above the full-width editor. Each card shows its logo, name and publication status; the selected card has an outline, check and pressed state. Overflow stays inside the row on small screens. Search and status filters remain above it, with a clear-filters action for no matches.

The logo row keeps touch, trackpad and keyboard scrolling with no visible scrollbar. The account workspace fills the available page width and overrides the public homepage's `main` overflow rule: content expands naturally to the document end rather than clipping or creating a nested panel scroller.

Both the component download and partner fetch show the same shaped skeleton: heading, filters, logo row and form sections. It has an accessible loading status and respects reduced motion. Fields use explicit labels, associated help, 48px inputs, optional markers and a URL prefix. Image controls support click, keyboard and drag/drop; previews, replace/remove, type/size rejection toasts and indeterminate upload progress preserve the current image if upload fails. Logo/breadcrumb images remain required for publishing; the content image is optional.

### Refinement review and verification

No blocking UX issues remain in this change. Visual review corrected the bundled white Zhik logo on light surfaces and the duplicate URL-field border. Rejected files report errors in toasts; drag-over guidance clears after drop. Native file inputs are hidden from the accessibility tree because the labelled dropzone supplies the keyboard control.

- TypeScript and focused ESLint checks passed.
- Isolated local browser: loading skeleton, seven logos in one horizontal row, card selection, no-result recovery and 390px layout without page overflow.
- Keyboard file selection and actual drag-and-drop storage upload passed; wrong types and files over 10 MB show toasts. Upload progress disables conflicting actions.
- A draft retained its uploaded logo; image removal could be discarded; a failed replacement retained the saved image.
- Final desktop and mobile images were inspected. Temporary local account, draft, uploaded asset and test server were removed. Hosted records were not modified.

Layout follow-up verified at 1920px, 1440px and 390px: the panel reaches the page edge, its height includes all expanded sections, both overflow axes are visible, the logo scrollbar is hidden, and keyboard navigation reaches the last partner. No document-level horizontal overflow; bottom save actions remain reachable.

## Charter panel alignment

Charter inquiries reuse the Partners panel proportions: full-width workspace, 24px group spacing, white surfaces with 8px corners, labelled 48px fields and blue primary actions. The list and footer form one panel. Search/status filters match Partners; the table can scroll horizontally on narrow screens with its scrollbar hidden. Both component and data loading use the same shaped skeleton.

The existing view/edit dialog keeps its actions and validation, with Contact/Request panels and optional field labels. Its body expands with the content, removing the nested height limit and scroll container; the modal itself retains normal page scrolling and its keyboard focus trap. Transportation retains its existing presentation.

Charter verification: TypeScript, focused ESLint and Sass compilation passed. Browser checks covered skeleton loading, 48px inputs with 8px corners, search recovery, toast validation, a saved status update, 1658px-long details with visible overflow, and 390px mobile layout with stacked fields and no page overflow. Desktop and mobile captures were inspected; no blocking UX issues found. Verification used temporary local inquiries and an isolated server; hosted records were not changed.
