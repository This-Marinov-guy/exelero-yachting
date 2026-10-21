# Boat listing images in Google Drive

Listing photos are optimized to WebP in the browser before upload and normalized again on the server (maximum 2000 × 2000 pixels, quality 78). The browser uploads them one at a time. A listing can be published while uploads continue; the account form shows progress and retries, and keeps the tab guarded until the queue finishes. Up to 25 photos and 15 videos can be attached. Video files and brochures continue to use the existing Supabase Storage bucket.

## Drive setup

1. For service-account uploads, put the destination folder inside a **Google Shared drive** and give the service account permission to add files. A folder merely shared from a person's My Drive will not work: [Google says service accounts have no Drive storage quota and cannot own files](https://developers.google.com/workspace/drive/api/guides/about-shareddrives). For a personal My Drive folder, configure `GOOGLE_DRIVE_OWNER_OAUTH_JSON` with an OAuth refresh token for the folder owner; uploads and deletion then use that account while the service account continues to read images.
2. Enable the Google Drive API in the service account's Google Cloud project.
3. Set `GOOGLE_DRIVE_BOAT_IMAGES_FOLDER_ID` to the destination folder ID. Set `GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON` to the complete service-account JSON as a **server-only Secret** in each deployment environment that should accept uploads. For My Drive, set `GOOGLE_DRIVE_OWNER_OAUTH_JSON` to JSON containing `client_id`, `client_secret`, and `refresh_token`, also as a server-only Secret. Do not use a `NEXT_PUBLIC_` variable or commit either JSON.
4. For local development, keep the JSON only in gitignored `.env.local` or supply it in the process environment. The supplied `google-service-account.json` file is gitignored and is not read by the application at runtime.

For the supplied personal My Drive folder, the OAuth app needs the `drive.file` scope and the folder owner's offline consent. Keep the app in **Testing** only for short-lived verification: [Google expires refresh tokens after seven days](https://developers.google.com/identity/protocols/oauth2/#expiration) for external apps in Testing. Publish the OAuth app and obtain a new refresh token before relying on it in production. Reconnecting the owner account also requires replacing `GOOGLE_DRIVE_OWNER_OAUTH_JSON`.

The OAuth app in Google Cloud project `website-511814` was moved to **In production** on 17 October 2026. The folder owner renewed consent after that change, and the renewed credential was stored in Vercel's Production Secret. Redeploy the production site after any future secret rotation so its functions receive the replacement value.

The OAuth app's homepage is `https://www.exeleroyachting.com` and its integration-specific privacy notice is `/en/listing-images-privacy`. Publish that page before moving the app from Testing to In production, then renew owner consent. Store only the renewed refresh token in the production Secret.

Uploaded files stay inside the configured folder. New listing photos go to `Listings/New uploads`; partner, profile, dealer, and service images go to their own folders. The database stores `/api/boat-images/<Drive file ID>` for each photo. The public route reads JPEG, PNG, and WebP images in this folder tree through the service account and sends a cacheable image response, so the folder does not need public sharing. The supplied folder is currently shared with anyone who has the link, which also permits direct preview. Existing Supabase image URLs remain readable.

The upload route accepts image requests up to 20 MB, but the browser compresses them below 3.5 MB before sending them to stay within typical serverless request limits. Upload failures remain visible with a retry action. When publishing before uploads finish, keep the account tab open until the progress indicator completes; browser tabs cannot finish local `File` uploads after they close.

## Existing Supabase image migration

The 21 October 2026 inventory contains 213 images (86,169,860 bytes): 206 listing-bucket files, 5 partner files, and 2 profile files. Of the 206 listing-bucket files, 145 are linked to listing rows and 61 are unlinked. The 13 non-image brochure/video objects are outside this migration. The local, byte-checked staging tree and manifest are in `.image-migration/`, which is gitignored. Keep this folder until the migration is complete.

The destination is `Website Storage/Migrated Supabase images/` with `Listings/<slug>--<boat ID>/`, `Unlinked uploads/<original prefix>/`, `Partners/`, and `Profiles/<user ID>/`. The existing root Drive images move to `Listings/Existing Drive uploads` only after the new route is deployed and each moved image is checked through that route.

The verified listing file IDs are also recorded in `src/data/migratedBoatImages.json`. Draft restoration uses this map to replace saved Supabase photo URLs with their Drive URLs, including photos that were uploaded but never linked to a listing. Keep this map with the deployment that changes the database URLs.

Use `scripts/migrate-supabase-images.mjs` with the existing server-only Drive credentials. It checks every staged file against its recorded size and SHA-256, uploads or reuses only byte-identical Drive files, and verifies Drive size, MIME type, parent folder, and MD5 through the read-only service account. It writes a resumable `verified-drive-mapping.json` to the output directory. Do not commit the credential JSON or staging files.

Run the same command with `--verify-local` (instead of `--upload`) to check the staged originals without any Drive credentials or network calls.

```bash
node scripts/migrate-supabase-images.mjs \
  --manifest=.image-migration/staged-manifest.json \
  --files='.image-migration/Migrated Supabase images' \
  --output=.image-migration/results --upload
```

Deploy this route and the new upload paths before changing database URLs. The app continues to read old Supabase URLs during that interval. Once the deployment is live, rerun the script with `--site=https://www.exeleroyachting.com` (and without `--upload`). It verifies the bytes returned by all 213 `/api/boat-images/<ID>` URLs before writing `update-image-urls.sql` and `restore-image-urls.sql`. Add `--organize-existing` to move the older direct-root Drive images into their listing folder; each moved image is verified through the deployed route, and a failed move is restored. Run the generated update SQL as one transaction in the Supabase SQL Editor. It updates only URLs still equal to the inventoried originals and aborts if any Supabase image references remain. The restore SQL returns migrated references to their original Supabase URLs if needed. The migration never deletes Supabase Storage objects. If a new Supabase image appears during the handoff, refresh the inventory and copy it before retrying the SQL.
