# Exelero Yachting: search and agent visibility audit plan

**Draft:** 3 October 2026  
**Scope:** public search visibility, AI answer discovery, crawler access, and private account/dashboard exposure.  
**Status:** technical crawl, privacy, and loading changes implemented locally. Live HTTP confirmed the production deployment still serves the pre-change code. Search performance and hosted Auth settings remain unverified.

The separate [Microsoft Clarity audit](clarity-audit.md) records the live dashboard review, consent and private-route tracking fixes, custom events, and post-deployment measurement checks.

## Confirmed business decisions

- Canonical production origin: `https://www.exeleroyachting.com`.
- Geographic priority: Southeast Europe. Start with the region in core copy; choose country-specific pages only after confirming each market's services, language, local evidence, and conversion path.
- Account creation: invitation only. Public signup routes return 410 locally, and local Supabase configuration disables self-service email/SMS signup. The hosted Supabase project's **Allow new users to sign up** setting and invite email template must be updated and verified before the production policy can be considered enforced.
- Public pages should be readable in the initial HTML by ordinary browsers and crawlers. Private account pages require a verified session and carry `noindex` headers.

## Loading findings and changes

| Finding | Local change | Verification |
| --- | --- | --- |
| A root client-only wrapper caused prerendered public pages to ship with no body copy or headings. | Render the site on the server and isolate only the browser-dependent progress bar. | Local production build now contains readable headings and body text on About, Contact, New Yachts, and Charters. |
| A full-page loading overlay delayed public content by at least roughly 720 ms. | Remove the overlay; keep a thin route progress bar for navigation. | Component removed from the public layout. |
| The home hero video was 67.6 MB and eligible for eager autoplay download. | Export a 12-second 720p loop (10.4 MB), render a 264 KB image first, and mount video after hydration only on capable desktop connections. | Media bytes reduced about 85%; video URL is absent from initial HTML. |
| The charter video was 44.5 MB and could load while its slide was hidden. | Export a 7.6 MB loop and provide the URL only while the video slide is active. | Media bytes reduced about 83%; inactive video has no `src`. |
| The boat detail page eagerly bundled PDF generation. | Load the PDF renderer and document on Download PDF action, with an in-progress state. | Local production build reports 223 KB first-load JS for a boat detail route, down from roughly 739 KB before deferral. |
| Decorative particles loaded a browser animation dependency into public pages. | Remove the effect and its direct package dependency. | Production build passes without the component. |

These are code and asset measurements. The current production deployment still serves the 67.6 MB hero video and 44.5 MB charter video. No Lighthouse or Core Web Vitals result is claimed.

## Live production crawl snapshot — 3 October 2026

Checked `https://www.exeleroyachting.com` with ordinary, Googlebot, Bingbot, and OAI-SearchBot user agents using raw HTTP. This is a response snapshot, not proof of search indexing or bot policy at all network edges.

| Route/check | Live result | Priority |
| --- | --- | --- |
| `/`, `/about`, `/services/brokerage`, `/services/charters` | 200, `index, follow`; no H1 and almost no readable body text in raw HTML. Googlebot, Bingbot, and OAI-SearchBot received the same sparse homepage pattern. | Critical: deploy the server-rendering fix and recrawl. |
| Canonicals, robots sitemap URL, and sitemap `<loc>` entries | Point to `excelero-yachting-o6627jehi-thismarinovguys-projects.vercel.app` instead of the confirmed production hostname. Brokerage canonical additionally points to `/boats`, which is not its public route. | Critical: deploy the confirmed origin and route corrections; verify every canonical and sitemap URL on production. |
| `/account` signed out | 200 with `index, follow`, a preview-domain canonical, and no `X-Robots-Tag`; the visible raw body contained only a loading/title shell, not private data. Googlebot received the same indexable response. | Critical: deploy the server auth guard and noindex headers; verify anonymous and authenticated responses. |
| `/sign-up` | 200 with `index, follow`; the public page remains reachable on the live deployment. Hosted Supabase self-registration setting was not inspected. | Critical: deploy the 410 route and disable signup in hosted Supabase Auth. |
| `robots.txt` | Disallows `/account`, `/sign-in`, and `/sign-up`, which can prevent crawlers from seeing a future noindex response; advertises the preview-domain sitemap. | High: deploy the revised robots policy. |
| `sitemap.xml` | 17 `<loc>` entries point to the preview domain and include `?lng=ge` style language alternates that do not correspond to stable translated URLs. | High: deploy the canonical sitemap and submit it again. |
| Apex domain | `https://exeleroyachting.com/` redirects 307 to the www hostname. | Keep the www canonical; verify HTTP variants and permanent redirect policy during deployment. |
| Hero and charter media | Live HEAD responses report 67,587,821 bytes and 44,487,114 bytes respectively. | Deploy compressed media and deferred loading; then measure mobile Core Web Vitals. |

The local production server returns 200 with visible H1s and self-canonicals for the homepage, Brokerage, Contact, and Charters. Local `robots.txt` advertises the confirmed www sitemap; the local sitemap contains no preview-domain or auth URLs. Anonymous `/account` redirects with `X-Robots-Tag: noindex, nofollow`, and `/sign-up` returns 410 plus noindex. These fixes are **not yet live**. The live host is reachable from an unrestricted read-only shell check; an earlier restricted web fetch failed.

### Recommended rollout order

1. In hosted Supabase Auth, disable new user signup, set Site URL to `https://www.exeleroyachting.com`, allow the `/auth/callback` redirect, and publish the invite email template. Verify one existing/invited account can sign in and a new uninvited address cannot register.
2. Deploy the local site changes through the project's normal release process. The current request does not authorize a Git push, so these edits remain local until a separate authorized release. Remove the stale preview-domain `NEXT_PUBLIC_SITE_URL` value from production configuration even though the code now uses the confirmed origin.
3. Immediately fetch the live homepage, main service pages, account, sign-in, sign-up, robots, sitemap, and sample listing as both ordinary and search-bot user agents. Confirm 200 plus self-canonical plus H1 on public pages; redirect/noindex or 410 on private/retired pages; and zero preview-domain references.
4. Submit the corrected sitemap in Google Search Console and Bing Webmaster Tools; monitor canonical selection, indexed pages, queries, and crawl errors. Search result changes take recrawl time and are not guaranteed by deployment alone.
5. Capture mobile Lighthouse traces and Core Web Vitals after deployment. Check Largest Contentful Paint, Interaction to Next Paint, Cumulative Layout Shift, video transfer, and slow-connection behavior. Use the traces to choose the next asset and JavaScript reductions.

## Implementation progress (3 October 2026)

- Account HTML now requires a verified Supabase session on the server. The legacy dashboard redirects to `/account`; account, sign-in, sign-up, and authentication callback responses are excluded from indexing. Signup is invitation only; the hosted Supabase setting must be applied separately.
- The robots policy allows public content and lets crawlers reach `noindex` responses. Genuine `/pages/*` duplicates redirect to canonical routes; unused demos return 410. The gallery also returns 410 because its source data explicitly labels the images as placeholders while presenting them as yacht events. Old legal template pages return 410 because their text is unrelated to this business.
- Canonical, Open Graph, JSON-LD, and sitemap origins now use the confirmed origin in production builds, even if a stale preview URL remains in the environment. Local development can use `NEXT_PUBLIC_SITE_URL`. Brokerage URLs and old listing IDs now resolve toward canonical listing routes. Production host redirects still need checking.
- The sitemap lists canonical public routes and active listings, and uses real listing update times when available. The homepage and brokerage collection render current inventory per request. Unimplemented language alternates and the nonfunctional homepage search action have been removed. The public shell is held to English until translated pages have stable URLs; main public H1 headings and internal account links were corrected.
- Browser-only particle and smooth-scroll imports no longer execute during server startup. The public HTML no longer depends on a client-only root wrapper. The local production build passes; response-level checks remain open.
- Content targeting, verified organization details, service areas, legitimate social profiles, host redirects, live bot responses, and Search Console/Bing baselines remain for the next iteration. No rank or indexation outcome has been claimed.

### Identity and data checks still needed

- The site's contact constants and the [Exelero Yachting LinkedIn profile](https://www.linkedin.com/company/exelero-yachting) agree on a Burgas office at 1 Alexander Battenberg Blvd, phone `+359 884967244`, and `info@exelero.eu`. The [Boat24 dealer listing](https://www.boat24.com/en/dealers/2725/exelero-international-ltd/) gives a different Burgas street address. Confirm which is the public office, registered address, and preferred directory address before extending LocalBusiness markup or directory citations.
- The local RLS migration gives anonymous users unrestricted read access to the `profile_image` table. Broker photos may be intentionally public, but private account photos should be reviewed against actual production policies and storage bucket access. This audit did not connect to the production database.
- The template Privacy and Conditions pages contain unrelated car/job wording, placeholder contact details, and even another domain (`fuso.com`). They now return 410. The sign-up form's links to them are commented out, so there is currently no published privacy or terms link. Business-approved legal text is needed before public signup is considered production ready.

## Intended outcome

- Every approved public page returns useful, accurate HTML to an unauthenticated crawler; has one canonical URL; and can be discovered through links and a valid sitemap.
- Account and dashboard content requires server-side authentication. Public sign-in and sign-up pages are excluded from search results. Unused demo routes do not compete with real pages.
- The site answers the actual buying, selling, charter, transport, and brand questions its customers ask, with claims that the business can substantiate.
- Google Search, Bing/Copilot, and ChatGPT search can discover the public pages under a deliberate crawler policy. No search position or AI citation can be guaranteed.

## What the code audit found

The table and crawler projection below record the pre-change baseline. The implementation sections above supersede findings already fixed locally; production behavior still requires deployment and a live crawl.

| Priority | Finding and evidence | Effect | Recommendation |
| --- | --- | --- | --- |
| Critical | The [root metadata](../src/app/layout.tsx) and [sitemap](../src/app/sitemap.ts) fall back to `https://exelero.com`. That domain currently redirects to an unrelated company. A [Boat24 dealer profile](https://www.boat24.com/en/dealers/2725/exelero-international-ltd/) instead links to `www.exeleroyachting.com`; that host could not be fetched from this audit environment. | Canonical, sitemap, and JSON-LD URLs may identify the wrong business if the production URL is not explicitly set. The deployed hostname and redirects are unverified. | Confirm the owned production hostname, configure it once in deployment, remove the unrelated fallback, and verify apex/www and HTTP/HTTPS redirects. |
| Critical | [Robots rules](../src/app/robots.ts) disallow `/account` and some auth paths but miss actual `/pages/other/user-dashboard` and `/pages/other/login-*` routes. [Account](<../src/app/(other)/account/page.tsx>) and [dashboard](<../src/app/(mainBody)/pages/other/user-dashboard/page.tsx>) inherit the root `index: true` metadata. | Private route URLs can be discovered or indexed. Robots disallow alone does not guarantee removal from search; it can prevent a crawler from seeing `noindex`. | Protect account/dashboard on the server; send unauthenticated requests to sign-in or return 401/404 before private HTML is rendered. Add `noindex, nofollow` to auth/account routes and use `X-Robots-Tag` where appropriate. Remove or redirect the legacy dashboard. Verify with a signed-out request. |
| High | The [dashboard component](../src/components/pages/others/userDashboard/index.tsx) checks the session in a browser effect and then redirects. There is no route middleware or server auth guard in the reviewed route tree. Database RLS exists, but it is a separate control. | A bot receives the route and its metadata before the browser redirect. Future server-rendered private content could be exposed if route-level access stays client-only. | Implement cookie-based server auth for private pages and retain ownership-scoped RLS. Audit API routes, storage, and document URLs for the same access model. |
| High | The [brokerage page](<../src/app/(mainBody)/services/brokerage/page.tsx>) lives at `/services/brokerage`, but its canonical and Open Graph URL are `/boats`. Its [CollectionPage JSON-LD](../src/components/pages/boats/BoatsPage.tsx) also says `/boats`; there is no `/boats` route in this checkout. The [home SearchAction](../src/app/page.tsx) points to `?query=`, with no matching server search handler found. | Search engines receive conflicting or invalid URLs and a nonfunctional structured-data action. | Set all brokerage references to the live route; remove SearchAction until real search URLs work. |
| High | The [root title template](../src/app/layout.tsx) appends `| Exelero Yachting`, while many child page titles already contain that suffix. | Rendered titles are likely duplicated. | Give child pages concise titles without the suffix, or use absolute titles intentionally. Test rendered `<title>` for every indexable route. |
| High | The [sitemap](../src/app/sitemap.ts) advertises `?lng=ge/sp/fr/ko` variants. [Server language detection](../src/app/i18n/server.tsx) uses a cookie or `Accept-Language`, not that query parameter. Much of the public body is hard-coded in English. Language codes `ge` and `sp` are also not the standard codes for German and Spanish. | Hreflang alternates do not reliably deliver the promised language; crawler and user can receive different language signals on the same URL. | Remove alternates until each translation has its own stable, fully translated URL; then use `de` and `es` and reciprocal hreflang/canonicals. Make `<html lang>` match the visible page. |
| High | Numerous public routes under `/pages/other/*`, `/pages/portfolio/*`, and `/pages/gallery` remain from the original template. For example, [About-1](<../src/app/(mainBody)/pages/other/about-1/page.tsx>) is a live route with generic title/description and unrelated demo components. The [FAQ](<../src/app/(mainBody)/pages/other/faq/page.tsx>) has no route-specific metadata. These URLs are absent from the sitemap but can still be crawled. | Duplicate, thin, or off-topic pages dilute the site and may confuse search engines and AI agents. | Inventory every route. Redirect genuine duplicates to their public replacement; return 404/410 for unused demos. Keep real legal/help pages only after content review and correct canonical/indexing decisions. |
| Medium | The [sitemap](../src/app/sitemap.ts) uses `new Date()` for every static and partner page, so `lastmod` changes without content changes. If the boat query fails, it silently omits all boat URLs. | Freshness signals are unreliable and listings can disappear from the sitemap during failures. | Use actual publication/update timestamps or omit `lastmod` when unknown; monitor sitemap generation and alert on zero or sudden listing drops. |
| Medium | The [About page](../src/components/pages/about/AboutPage.tsx) and [partner pages](../src/components/pages/partners/PartnerPage.tsx) offer short, generic descriptions. [New Yachts](../src/components/pages/newYachts/NewYachtsPage.tsx) largely links onward through image panels. Several public pages have broad titles such as “luxury yacht charters” without concrete locations, fleet/process details, or answers. | Crawlers can parse the pages, but they have little specific evidence to answer competitive queries or cite confidently. | Add verified service areas, dealership roles, process, vessel details, costs or quote factors, and concise FAQs where useful. Align titles and copy with each page's actual offering. |
| Medium | [About](../src/components/pages/about/AboutPage.tsx) and [boat details](../src/components/pages/boats/BoatMainDetail.tsx) use H2/H3 for their primary visible heading. The [breadcrumb component](../src/components/commonComponents/breadcrumb/index.tsx) also uses H2. | The main topic is less explicit in the document structure, especially to simple HTML consumers. | Give each public page one descriptive H1, then use H2/H3 for sections. Preserve visible design through styling. |
| Medium | Structured data exists for Organization, Service, Vehicle, and Breadcrumb, but several URLs inherit the unconfirmed domain. Breadcrumb items sometimes point to non-routes such as `/services` and `/partners`; the homepage Organization `sameAs` is empty. | Machine-readable identity and navigation can contradict the site. | Validate JSON-LD against visible content and real URLs. Add verified business identity, contact, service area, and official social profiles. Do not invent reviews, inventory, offers, or dealer claims. |

The app has a useful foundation: public listing data and listing details are fetched in server components, the main public routes have metadata, and the database migration includes RLS policies for boats, related data, drafts, and inquiries. This is a code observation, not a production security or indexing certification.

### Likely anonymous crawler view from the current code

| Route | What it can identify | What remains unclear |
| --- | --- | --- |
| `/` | A yacht business, core services, and partner brands. The homepage has a visible H1 and structured data. | Where the business operates, its verified legal identity, and concrete reasons to choose it. Organization `sameAs` is empty and its URL may be wrong. |
| `/services/brokerage` | A server-fetched collection of active boats, if the database is reachable. | Its canonical and JSON-LD URL point to nonexistent `/boats`; inventory query failures return an empty collection rather than an explicit crawl error. |
| `/services/brokerage/[id]` | Vessel title, specs, media, offer information when present, and Vehicle JSON-LD. | The main visible title is below H1 level and any fallback/old slug or sold listing needs a checked redirect/status policy. |
| `/about`, `/new-yachts`, `/services/charters`, `/services/transportation` | Broad topics and service calls to action. | Distinctive facts, locations, availability, processes, pricing factors, and concise answers are sparse or missing. |
| `/account`, `/pages/other/user-dashboard` | Account/dashboard title and a loading view before browser-side session checking. | Search exclusion and server-side access are not established by the page code. |

This is a source-level projection of the pre-change code. A local production-server check now confirms `/contact` returns 200 with a self-canonical and visible H1, `/account` redirects anonymous visitors with `X-Robots-Tag: noindex, nofollow`, `/sign-up` returns 410 with the same header, and `robots.txt` and `sitemap.xml` return 200. The production fetch in Phase 0 must confirm deployed behavior.

## Recommended sequence

### Phase 0 — confirm the production baseline

1. Confirm redirects for HTTP, apex, and any alternate domains to `https://www.exeleroyachting.com`. Record the deployed commit and environment's `NEXT_PUBLIC_SITE_URL` value without exposing other secrets.
2. Fetch homepage, 6 main landing pages, sample active/inactive boat listings, auth routes, `robots.txt`, and `sitemap.xml` with ordinary, Googlebot, Bingbot, and OAI-SearchBot user agents. Save status, redirect chain, robots header/meta, canonical, title, H1, HTML text, structured data, and internal links.
3. Check Google Search Console and Bing Webmaster Tools for indexed URLs, exclusions, sitemap processing, queries, clicks, country/device mix, Core Web Vitals, and any AI search reports available. Record 30/90-day baselines. A `site:` query is only a spot check, not an index count.
4. Check CDN/WAF rules and server logs for accidental bot blocks or challenge pages. Compare anonymous browser and raw HTML views for each public template.

**Gate:** no ranking, indexing, or real-user speed claims until the deployed host and production measurement are available.

### Phase 1 — private routes and canonical crawl control

1. Add server-side auth to `/account` and any real management routes, and apply the same access checks to private APIs/files. Keep Supabase RLS as the data-level boundary. Test anonymous, signed-in owner, and different signed-in user access.
2. Make sign-in, sign-up, account, and any retained dashboard routes `noindex, nofollow`. Remove legacy auth/dashboard variants and links to them. Avoid relying on `robots.txt` as a security control or as the sole deindexing mechanism.
3. Remove or redirect unused template URLs, choose one URL per public page, correct brokerage canonical/OG/JSON-LD, and normalize title templates.
4. Use a single verified base URL in metadata, sitemap, structured data, and sharing. Set explicit redirect rules for alternative hosts and obsolete URLs.
5. Rebuild the sitemap from canonical, indexable pages and active public listings. Use accurate `lastmod`; check it never lists private, redirected, 404, or canonicalized-away URLs.

**Gate:** every public sitemap URL responds 200 with a self-canonical and index permission; anonymous requests receive no account data; private and auth URLs do not appear in search results after recrawl.

### Phase 2 — content and query coverage

Create a keyword-to-page map before writing. Start with the verified services and markets rather than broad “luxury yacht” terms:

| Customer intent | Candidate page | Content to add or verify |
| --- | --- | --- |
| Used yachts for sale / yacht brokerage | `/services/brokerage` and active listing URLs | Inventory filters that work as links where useful; exact vessel model, year, condition, location, price status, inspection history, media, broker, and enquiry path. |
| X-Yachts and Omaya dealer searches in Southeast Europe | `/new-yachts` and partner pages | Actual represented countries, model/range, purchase process, availability, and direct contact. Confirm formal dealer rights before claiming exclusivity. |
| Yacht charter searches in Southeast Europe | `/services/charters` | Verified departure countries/ports, charter types, skipper options, capacity, planning steps, quote factors, and useful FAQs. |
| Yacht transport searches in Southeast Europe | `/services/transportation` | Verified routes/countries served, road/sea options, insurance and permit process, vessel size constraints, and quote factors. |
| Brand and trust searches | `/about`, `/contact`, partner pages | Legal/business identity, people, location, credentials, service area, official social links, and consistent contact details. |

Use unique, factual text and answer common questions directly in visible HTML. Keep key details out of tabs or client-only widgets where a simple crawler would miss them. Review image alt text, useful media captions, and internal links between services, brands, and listings. Avoid doorway pages built solely from keyword/location substitutions.

**Gate:** each target query cluster has one strong, relevant page with a clear H1, useful body, correct metadata, and a conversion path; claims are approved by the business.

### Phase 3 — AI answer visibility and distribution

1. Keep public content crawlable to search bots, including OAI-SearchBot if ChatGPT search discovery is desired. Decide separately whether GPTBot may use content for training. OpenAI documents these as independent controls. Do not depend on an `llms.txt` file or special “AI schema” for ranking.
2. Use structured data only where it describes visible, verified content. Fix entity URLs and breadcrumbs first; then validate Organization/LocalBusiness, Service, and listing markup with appropriate tools. Structured data does not guarantee rich results or AI citations.
3. Verify and complete the business's Google Business Profile, Bing Places, official social profiles, relevant broker/dealer directories, and manufacturer/dealer links. Keep name, address, phone, service area, and domain consistent. Seek relevant editorial and partner links rather than paid/spam links.
4. Submit the clean sitemap to Google and Bing. Consider IndexNow for time-sensitive listing changes after canonical/indexing rules are correct.

**Gate:** a third-party crawler can identify who Exelero is, what it offers, where it operates, how to contact it, and which yachts are currently available using only public pages.

### Phase 4 — measurement and upkeep

- Track organic impressions, clicks, indexed canonical URLs, non-branded target queries, enquiry conversions, and listing freshness monthly. Separate branded from non-branded queries and markets.
- Track AI search citations/referrals only where first-party reports or tagged referrals support the measurement; do not present an “AI rank” as a fact.
- Monitor 404/5xx rates, sitemap count, `noindex` leaks, accidental staging indexation, Core Web Vitals, and bot response codes after each deployment.
- Retire sold listings with a clear status and deliberate 301/404/410 policy; never silently show unrelated inventory at an old listing URL.

## Decisions for the next iteration

1. Which specific Southeast European countries, languages, ports, and services should lead the first country-level content work?
2. Confirm the public office address and dealer territories/rights before adding location-specific claims and directory entries.
3. Apply the invite-only setting, production Site URL/redirect allow-list, and invite email template in the hosted Supabase project; verify a new email cannot self-register and an invited email can complete the flow.
4. Decide whether OpenAI's search crawler should be allowed while model-training crawler access is decided separately.
5. Collect production Core Web Vitals, Lighthouse mobile traces, and CDN/server timing once the host is reachable.

## Sources for the recommendations

- [Google: block search indexing and the robots/noindex interaction](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Google: multilingual versions and hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google: sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: generative AI search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google: structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a)
- [OpenAI crawler controls](https://developers.openai.com/api/docs/bots)
- [Next.js metadata merging and title templates](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Supabase SSR auth for Next.js](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs)

## Audit limits

The restricted web fetch could not retrieve `www.exeleroyachting.com`, but an unrestricted read-only shell check reached its live routes, robots file, sitemap, and media headers. A local production build and loopback response check also succeeded. Search Console, Bing Webmaster Tools, production logs, hosted Supabase Auth settings, and production database content were not available. Therefore this document does not claim current rankings, indexing counts, private data security of the deployed environment, or real-user speed metrics.
