# Exelero Yachting UI conventions

Extracted from the existing website and Partners admin; this records the current direction rather than a redesign.

## Character

- Typography: retain the locally loaded SourceSans3 body family. Admin data uses a strong weight and size contrast so the numbers are easy to scan.
- Colour: deep blue actions with cool, muted neutrals, matching Partners.
- Space: tight labels within groups, generous separation between sections.
- Finish: thin borders and modest rounded corners; no decorative shadows.

## Existing website tokens

The global palette lives in `public/assets/scss/abstracts/_variables.scss`; font loading lives in `base/_typography.scss`. Public pages retain their current scoped theme variants and typography.

- `--content-color: 77, 89, 99` on the default and `car-color` themes keeps body copy readable on light backgrounds. This affects the public homepage and other pages using those themes; dark-theme overrides remain separate.
- `--bs-link-color-rgb: var(--theme-color)` uses the same blue as footer links for Bootstrap-styled links across the public site.

## Admin summary tokens

The Tracking stylesheet scopes these extracted admin tokens. They provide a reference for future admin components without changing existing public pages.

| Token | Value | Reason |
| --- | --- | --- |
| `--admin-text` | `#19313c` | Existing Partners foreground, readable on white |
| `--admin-muted` | `#60747b` | Existing help text colour |
| `--admin-accent` | `#146a88` | Existing primary action; 6.09:1 contrast on white |
| `--admin-surface` | `#fff` | Existing editor and control background |
| `--admin-border` | `#d8e0e3` | Existing subtle section boundary |
| `--admin-soft` | `#f5f8f8` | Existing neutral input and hover background |
| `--admin-warning`, `--admin-warning-bg` | `#755500`, `#fff6dc` | Existing warning colours, reserved for actionable notices |
| `--admin-radius` | `8px` | Existing editor radius |
| `--admin-font` | `SourceSans3, sans-serif` | Reuses the locally loaded body font |
| `--admin-small`, `--admin-body` | `13px`, `15px` | Compact metadata and readable admin labels |
| `--admin-section`, `--admin-heading`, `--admin-value` | `20px`, `28px`, `38px` | Section hierarchy and prominent KPI values |
| `--admin-tight`, `--admin-gap`, `--admin-space`, `--admin-group`, `--admin-section-gap` | `4px`, `8px`, `16px`, `24px`, `32px` | Compression within groups and separation between sections |

## Controls and voice

- Primary: filled blue; secondary: white with a border; inline links: underlined.
- Controls have 44px minimum height, visible keyboard focus, and an immediate loading label.
- Sentence case, direct verbs, specific errors with a recovery action.
- Missing metrics display a dash; loading, no traffic, and failed connections are distinct states.

## Account workspace

`AdminShell.module.scss` scopes the shared account styles. A 224px grouped sidebar sits beside the workspace; at 800px it becomes an inline menu disclosure. Content uses 24–32px section spacing, white surfaces and 44px controls. Listings and inquiries use searchable tables; long forms use named disclosure sections. Status includes text. Form errors and mutation feedback use toasts.

Recharts uses a restrained categorical palette: `#146a88`, `#3f8d91`, `#b77838`, `#74639c`, `#a55869`, `#6e8350`, `#8b969d`. Every chart has visible text values or a table alternative. Chart animation is disabled.
