# Partners and New Yachts administration

The editor is at `/account?tab=partners`. Every authenticated account can open it and manage partners, matching the rest of the admin area. Accounts are invitation-only; public signup is disabled. Database and Storage RLS block anonymous visitors from editing or uploading assets.

## Database rollout

Apply the checked-in migrations before deploying the application. They add `partners`, `partner_inquiries`, and the `partner-assets` bucket, and migrate all seven current brands. X-Yachts and Omaya initially appear on New Yachts. Six brands appear on the homepage; Elvstrom SailWear remains available through the partner menu and its own page.

For an existing local stack, use `supabase migration up --local`. Do not reset a populated database. For the hosted project, apply the migrations through the project's normal Supabase deployment process.

No separate admin role is required. Invite accounts through the existing Supabase Auth administration process. Keep public signup disabled in the hosted project, as it is in `supabase/config.toml`.

### Storage policy ownership error

If the earlier account-access SQL failed with `42501: must be owner of table objects`, run the complete corrected `supabase/migrations/20261005104000_partners_account_access.sql` in the SQL Editor with the `postgres` role selected. It is safe to rerun even if some policies already have their new names. The single `DO` block replaces the policies atomically, and every management policy explicitly targets `authenticated`.

The failing operation is the Storage policy rename. Supabase's policy permission extension supports creating, changing expressions, and dropping policies on managed tables, but does not handle policy renames ([implementation](https://github.com/supabase/supautils/blob/master/src/table_grants.c)). The corrected migration uses `DROP POLICY IF EXISTS` and `CREATE POLICY`; it does not need changes to table ownership or RLS settings. Existing partner data and uploaded files are unaffected.

After applying it, verify the upload policy:

```sql
select policyname, roles, cmd, with_check
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and policyname = 'Account users upload partner assets';
```

It should show role `{authenticated}`, command `INSERT`, and a check restricting `bucket_id` to `partner-assets`.

## Editing and publishing

- A name is required to save a draft. New partners receive a unique page slug derived from the name and are placed after the current partners. Existing page slugs and display order remain fixed when editing. Logo, breadcrumb image and page content are additionally required to publish.
- Drafts are excluded from public queries, navigation, homepage, New Yachts and sitemap. “Unpublish to draft” hides an existing public page.
- “Show on homepage” and “Show in New Yachts” control those listings independently. Existing display order controls listing order.
- New Yachts visitors choose a brand and open its information page, which includes the configured contact form.
- Images accept JPEG, PNG or WebP up to 10 MB. Breadcrumb recommendation: 2560 × 1280 pixels (2:1), minimum 1600 × 800. Existing SVG logo assets remain supported.
- Page content uses plain text, with blank lines separating paragraphs.
- Standard forms ask for name, email, optional phone and optional message. Custom forms keep name/email and allow up to eight additional text, phone, long text or dropdown fields.
- Inquiries are stored in `partner_inquiries` and listed under Partner inquiries in the account. Existing `GMAIL_*` and `NOTIFICATION_TO_EMAIL` configuration sends email notifications. A notification failure leaves the inquiry visible in the account with an email retry action.

## Sitemap GitHub Action

`.github/workflows/refresh-sitemap.yml` runs every six hours and supports manual dispatch. It invalidates `/sitemap.xml` and requests the new XML. Admin changes also invalidate the sitemap immediately; its fallback cache lifetime is one hour.

Configure:

1. A strong random `SITEMAP_REVALIDATE_TOKEN` in the deployed app environment.
2. The same value in the GitHub Actions repository secret `SITEMAP_REVALIDATE_TOKEN`.
3. The deployed origin (without a trailing slash), such as `https://www.exeleroyachting.com`, in the repository secret `SITE_URL`.

The workflow becomes active after it is published to the repository's default branch. No remote push or deployment is performed by local implementation work.

## Local verification

With the local website running on port 3001 and local Supabase running:

```sh
node scripts/verify-partners-local.mjs
```

The check creates and removes temporary local users and records. It verifies API authorization, RLS, upload access, draft privacy, unique slugs, publishing, server-rendered homepage and New Yachts links, custom form validation and sitemap updates. It skips a successful inquiry submission if SMTP credentials are configured, to avoid sending test email externally. Use `PARTNER_TEST_SITE_URL` to choose another local port.
