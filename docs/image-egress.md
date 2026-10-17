# Listing image egress

The October 2026 Supabase dashboard showed 18.524 GB of Cached Egress and 0.488 GB of Egress against separate 5 GB Free allowances. These are measured usage totals; moving a request between the two classes would not undo past usage. At 19.012 GB combined, reducing image bytes and repeat origin requests is necessary to fit both allowances in a future billing cycle. See [Supabase's egress guide](https://supabase.com/docs/guides/platform/manage-your-usage/egress).

An audit of the public `boat_images` rows found 141 legacy Supabase image URLs totaling about 63 MB of source files. The largest sampled file was 6.34 MB. The boat detail page also downloaded every full-size photo simply to read its dimensions. The hero used a raw image URL, and full-screen viewers used source URLs. These paths bypassed the site's responsive image delivery.

The current implementation removes the eager dimension downloads, serves the listing hero and thumbnails through `next/image`, and opens full-screen photos through the optimized image endpoint. `minimumCacheTTL` is 31 days for immutable listing image paths. In a local production build, the 6.34 MB sample became an 80 KB WebP at 1200 px and a 173 KB WebP at 1920 px. The optimized responses carry a 31-day cache lifetime.

After deployment, compare Supabase Cached Egress and Egress over a new billing period. Also monitor Vercel's [image optimization usage](https://vercel.com/docs/image-optimization/limits-and-pricing) and data transfer. If Supabase traffic remains high, inspect Storage request paths in logs to identify any remaining direct image consumers. The current billing-period total will not fall retroactively, and future free-tier usage depends on traffic and cache misses.
