# Supabase cached egress investigation

On 21 October 2026 the Supabase Free plan dashboard showed **29.11 GB cached egress** against a 5 GB allowance for the 21 September–21 October billing period. Uncached egress was about 0.64 GB. The organization displayed a services-restricted banner. Cached egress is primarily public Storage traffic, not database response traffic; see [Supabase's egress guide](https://supabase.com/docs/guides/platform/manage-your-usage/egress).

The Free plan retains request logs for only one day, so the exact request paths behind the 15–17 October peak cannot be recovered. The available 24-hour API Gateway logs do identify an ongoing source: one raw 2.23 MB `boat_images` JPEG received 285 requests, including 243 successful 2xx responses and 42 quota-rejected 4xx responses. The request samples identify `facebookexternalhit` and Viber clients. Two other listing JPEG paths received 197 and 92 requests. A database check confirmed all three are the first image selected for their boat's social preview. The 2.23 MB file alone could transfer roughly 0.54 GB if each successful request received the complete file; the log count is not a byte total and may include partial or conditional responses.

The cause in the application was that listing metadata published the original Supabase Storage URL as `og:image` and `twitter:image`, and Vehicle JSON-LD included every original photo URL. Social preview crawlers followed those URLs directly, bypassing the site's image optimizer. Regular listing cards and the detail gallery had already been switched to responsive `next/image` delivery in the earlier egress fix.

The Storage inventory contained 145 image objects referenced by `boat_images` rows, totaling 60.94 MB; 61 other image objects totaling 20.61 MB; and 13 brochures totaling 16.46 MB. These figures describe stored bytes, not egress. The other images may include upload drafts or old direct links, so they should not be deleted solely based on the lack of a `boat_images` row.

## Fix

- Social metadata for Supabase Storage images and Drive listing images now points to this site's `/_next/image` endpoint at 1200 px and quality 70. The URL is absolute so link preview crawlers can fetch it.
- Vehicle JSON-LD now publishes optimized, site-hosted image URLs.
- The boat detail fetch is memoized within a request, so metadata and page rendering share the same database reads.
- Public partner cards, partner pages, and the share preview no longer bypass `next/image` for remote photos. Image `sizes` are set for responsive variants.
- Existing source images remain available for the site's optimizer, brochures, and previously shared direct links. Changing the application cannot invalidate a direct Storage URL already cached by an external service.

This moves repeat social preview downloads to the site's image cache. A new source image still causes an initial Supabase download when the optimizer fills its cache. Existing billing-period usage cannot be reversed. Staying under 5 GB in a future 30-day period requires average cached egress below about 167 MB/day; monitor both Supabase cached egress and the site's image optimization/data transfer after deployment. Check the API Gateway **Pathname** breakdown over the available 24-hour window for remaining high-volume `/storage/v1/object/public/` URLs. A second phase may migrate legacy images away from the public bucket if direct links continue to drive the quota.
