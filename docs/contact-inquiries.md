# Boat and partner contact inquiries

Public boat and partner pages share Name, Email, Phone (optional), and Message (optional).
Partner custom fields appear after these contact fields; their answers are retained.
Validation errors retain the entered values. Once an inquiry is saved, the form confirms receipt even if email delivery is delayed.

## Setup

1. Apply `supabase/migrations/20261006083709_boat_partner_contact_inquiries.sql` to the website's Supabase project, after the existing Partners migrations.
   Apply `supabase/migrations/20261006130630_optional_boat_inquiry_message.sql` before enabling optional messages for boat inquiries.
   Apply `supabase/migrations/20261006135819_inquiry_workflow_status_internal_note.sql` to add account-only workflow fields across boat, partner, charter and transportation inquiries.
   Apply `supabase/migrations/20261006141836_bulk_inquiry_delete_access.sql` to allow signed-in account users to delete boat and partner inquiries.
2. Set `SUPABASE_SECRET_KEY` on the server, using a current `sb_secret_…` key from the **same project** as `NEXT_PUBLIC_SUPABASE_URL`. The legacy `SUPABASE_SERVICE_ROLE_KEY` remains supported during migration. If API keys are managed separately from the host, `SUPABASE_DB_URL` can use Supabase's transaction pooler instead. Never prefix these secrets with `NEXT_PUBLIC_`.
3. Configure the existing mail settings in `.env.example`: `GMAIL_HOST`, `GMAIL_PORT`, `GMAIL_USERNAME`, `GMAIL_PASSWORD`, and encryption/from settings as required by the SMTP provider.
4. `NOTIFICATION_TO_EMAIL` accepts a JSON array or comma-separated email addresses. In Vercel, enter the JSON value directly, without surrounding shell quotes; Vercel stores those quotes as part of the value. Every configured recipient receives each inquiry. No email is sent to the visitor or the dealer unless that address is in the notification list.

Use the same settings in the hosting environment. Restart the development server after changing secrets.

## Storage and delivery

- Boat submissions are stored in `boat_inquiries`, linked by `boat_id`.
- Partner submissions remain in `partner_inquiries`, linked by `partner_id`.
- Each stores `name`, `email`, `phone`, `message`, custom `answers`, and page context.
- The server validates that the boat is available or the partner is published before accepting an inquiry.
- Only server routes insert inquiries. Invited account users can read them; anonymous clients cannot read contact data or edit delivery state.
- Email includes all supplied fields, the boat/partner name, and a link to its page. Reply goes to the visitor's email address.
- The database is saved **before** email is attempted. Once saved, a toast confirms receipt. An SMTP failure returns HTTP 202 with `notification: "pending"` instead of asking the visitor to send the inquiry again.
- A database lease prevents concurrent requests delivering the same inquiry. `notification_delivered_to` records each successful recipient so a retry only sends to outstanding recipients. `notification_sent_at` records completion. Expired leases can be retried after five minutes.
- Invited account users can review Boat brokerage and Partner inquiries at `/account?tab=boat-inquiries` and `/account?tab=partner-inquiries`. Pending notifications can be retried there after mail configuration is restored. The retry route requires an authenticated account and a same-origin request.
- All four inquiry inboxes use **Pending**, **Completed** and **Rejected**. New requests start Pending. Existing charter and transportation requests marked Confirmed become Completed; Cancelled become Rejected; other earlier statuses become Pending.
- The internal note is separate from the visitor's message. It is visible and editable only to signed-in account users, and is never sent in the inquiry email. Boat and partner account clients can update only status and internal note. Public charter and transportation forms, including submissions by signed-in visitors, have column-level insert access only to visitor fields, so they cannot set either workflow field.
- Account users can select individual inquiries or all displayed inquiries, then change their status or delete them in bulk. Deletion requires a confirmation dialog and cannot be undone.
- There is no background retry scheduler. As with SMTP generally, a process failure between mail acceptance and recording delivery can cause one duplicate email; a stable Message-ID is used for each inquiry/recipient.

Historical partner inquiries are preserved and are not resent.

## Verification

`node scripts/verify-contact-inquiries-local.mjs` runs against the local Supabase stack and an isolated SMTP sink. Add `--direct-db` to exercise `SUPABASE_DB_URL` instead of the Supabase API. It starts its own Next server on port 3002, overrides all email settings, and cleans up its fixtures and build output. It checks both forms' database payloads and recipients, custom answers, validation, inactive/sold boats, drafts, anonymous access, repeated/concurrent submissions, and authenticated retry after partial SMTP failure. Add `--serve` to keep the fixtures available for browser checks, then stop with Ctrl+C.

Verified on 6 October 2026: the integration checks passed, as did TypeScript and scoped ESLint. Browser checks passed at 1440px and 390px for both forms: labelled controls, toast-only validation, focus on the invalid field, retained values after failure, reuse of the retry ID, and successful submission/clearing.
