# Tracking in the account

Open `/account?tab=tracking`. Every authenticated, invitation-only account can read the reports. The endpoint `/api/admin/tracking` checks authentication before reading provider configuration and returns private, non-cacheable HTTP responses.

## Connect the existing Google properties

1. In Google Cloud, create a service account in your project. Enable **Google Analytics Data API** and **Google Search Console API**.
2. Create/download its JSON key. Keep it outside source control and chat.
3. In GA4 → Admin → Property access management, add the JSON's `client_email` with **Viewer** access.
4. In Search Console → Settings → Users and permissions, add that email to the relevant property (restricted read access is sufficient for reporting).
5. Add server-only settings to `.env.local` (and your hosting environment for production):

```dotenv
GA4_PROPERTY_ID=123456789
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
SEARCH_CONSOLE_SITE_URL=sc-domain:exeleroyachting.com
GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account","client_email":"…","private_key":"-----BEGIN PRIVATE KEY-----\n…\n-----END PRIVATE KEY-----\n"}'
ANALYTICS_TIME_ZONE=Europe/Sofia
ANALYTICS_HOSTNAMES=exeleroyachting.com,www.exeleroyachting.com
```

Use the numeric **property ID** for reporting and the `G-…` measurement ID for the public web stream. They must belong to the same GA4 property. Match the Search Console property exactly; a URL property may instead be `https://www.exeleroyachting.com/`. Keep the JSON on one line inside single quotes. Set `ANALYTICS_TIME_ZONE` to your GA4 property's reporting time zone. Restart the server after changing its environment.

In the GA4 web stream's Enhanced measurement settings, keep **Page loads** and **Page changes based on browser history events** enabled. The site relies on GA4's automatic page views for client-side navigation; do not add a second manual page-view trigger.

No Google credential uses a `NEXT_PUBLIC_` prefix. The OAuth scopes are read-only. Requests go from this server directly to Google's fixed API URLs. Tokens and keys never enter a browser response or logs.

## Connect Microsoft Clarity reporting

Generate a Data Export token under Clarity → Settings → Data Export and store it as the server-only `CLARITY_API_TOKEN`. The project ID remains in `NEXT_PUBLIC_CLARITY_PROJECT_ID` because the public consented tag and dashboard link use it.

Clarity's export covers a rolling one-to-three-day window and permits ten requests per project each day. The Tracking screen requests the last 72 hours and shares a six-hour server cache across users, periods and page drill-downs. It displays sessions, visitors, pages per session, average scroll depth, dead clicks, rage clicks, script errors and detected bot sessions. Missing metrics remain an em dash rather than being inferred.

## Reports

- Defaults to the current calendar month, ending today. Select earlier months, individual days, or Today. Month reports show daily traffic; daily reports show hourly traffic, without future hours for today.
- Visits = sessions; visitors = total users; page views = screen/page views. Unique visitors for the selected period come from a separate aggregate query; daily visitors are not summed.
- Popular pages returns the top 100 by views, with local search and progressive display. Open a page to apply an exact page-path filter to all GA4 panels and an escaped page-URL filter to search queries. Query-string variants are combined.
- Recharts renders traffic and distributions for source/medium, channels and regions. Each pie shows six leading categories plus the remaining returned categories as Other. Percentages use that distribution's returned visits. Google thresholding, sampling or truncated dimensions are indicated.
- Search Console shows up to 100 queries sorted by clicks, with impressions, CTR and average position. It uses Pacific calendar dates. Recent data can be delayed; private queries may be withheld; historical retention is controlled by Google. Empty or unavailable data is never replaced by example numbers.
- Production hostnames are explicitly filtered, and account/auth/API pages excluded from GA4 reports. Configure hostnames if the website changes domains.
- Current periods cache for five minutes, closed periods for one hour, in a bounded server-process cache. Concurrent requests share a pending request. Errors are not cached; Retry attempts the provider again. Reloading successful cached data preserves its fetch timestamp. Google can revise recent data after collection.
- The two providers fail independently. A missing Search Console connection does not hide traffic reports, and vice versa.
- Clarity provides the rolling 72-hour visitor-experience panel and a direct link to recordings and heatmaps. On the public production site, both analytics tags load only after a visitor chooses **Allow analytics** in the existing cookie banner. Admin and sign-in paths are excluded from GA4 and Clarity collection.

## Verification

`node scripts/verify-analytics.mjs` runs deterministic fixtures for date validation, calendar boundaries, unique-user aggregation, pie totals, hourly bounds, OAuth signing, upstream filters, partial errors and cache coalescing. It does not access live Google or Supabase data.

`scripts/verify-tracking-local.mjs` checks authentication and response privacy against an explicitly local Supabase instance. It must not run against the shared hosted database.

## Primary references

- [GA4 batch reports](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/batchRunReports)
- [GA4 dimensions and metrics](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)
- [Search Console query API](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
- [Service-account OAuth](https://developers.google.com/identity/protocols/oauth2/service-account)
- [Clarity Data Export API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-data-export-api)
