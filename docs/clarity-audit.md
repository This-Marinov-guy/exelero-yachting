# Microsoft Clarity audit — 3 October 2026

Project: **Exelero** (`vekv1ut2zw`), configured for `www.exeleroyachting.com`. The dashboard figures below cover the last three days at the time of review. They describe the currently deployed site, which still has the old global tracking code. Local changes in this repository have not been deployed.

## Findings

| Signal | Observed | Assessment |
| --- | --- | --- |
| Traffic | 191 sessions; five bot sessions excluded; 1.03 pages per session; 100% shown as new visitors. | `/account` contributed 36 sessions, so the public conversion baseline is contaminated. The lack of returning visitors may reflect cookie behavior; it is not proof there are none. |
| Friction | 11 dead-click sessions (5.76%). | Several are on account tabs. A reviewed public listing recording marked a click on selectable description text as a dead click. Review public-only recordings after deployment before treating this count as a broken control. |
| JavaScript error | One session (0.52%): `Error invoking postMessage: Java object is gone`. | Recording used Facebook's Android in-app browser. The error appeared after the page was hidden, with no clicks. No site `postMessage` call exists in the source. This looks like a WebView bridge error, but one recording cannot establish its cause. Monitor recurrence by browser and route. |
| Performance | 84/100 across 33 pageviews; LCP 2.7 s, INP 240 ms, CLS 0.06. | LCP and INP need improvement; the sample is small and predates the local video and JavaScript loading changes. Recheck after release. |
| Measurement setup | No funnels or custom events; six automatic Smart events, including Submit form, Upload, and Login. | Automatic Submit form does not prove successful delivery and Login/Upload may describe admin actions. Use the new success events for conversion reporting. |
| AI Visibility | Brand terms and page classification were already configured. Citation and bot activity were not. | Citation is now connected. Bot activity needs server or CDN log integration. |

## Changes made in Clarity now

- **Settings → Setup → Cookies: Off.** This enables [Clarity Consent Mode](https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode). Bot detection remains On. Until the site changes go live, this can reduce linked sessions because the currently deployed banner does not send a consent signal.
- **Settings → AI Visibility → Citation:** connected `exeleroyachting.com`, the domain supplied for this audit. The dashboard currently shows no citation counts. Its displayed source is Microsoft Copilot and partners, so this is one signal rather than a complete measure of every AI answer surface.
- **Settings → Masking:** added `.user-dashboard-section` as a Mask rule for account content still captured by the current deployment. Clarity says a rule can take up to an hour and cannot change existing recordings. The intended permanent fix is to stop loading Clarity on private routes.
- Confirmed Copilot features and bot detection are On. The existing brand terms include Exelero Yachting, exeleroyachting.com, exeleroyachting, and Exelero.

## Local implementation, awaiting release

- Clarity loads only on `www.exeleroyachting.com`, only on the approved public routes, and only after a visitor selects **Allow analytics**. The project is in Consent Mode; the script queues `consentv2` with analytics granted and advertising denied. **Essential only** never loads the tag. Withdrawing a previous grant sends denial, clears Clarity cookies, and reloads the page. Choices expire after 180 days.
- The global Clarity tag was removed from the root layout. Public-to-account navigation uses full page requests to unload an existing tracker. Auth/account layout content is also explicitly masked as a safeguard. This route separation is necessary because a loaded client-side tag can persist across a single-page navigation even after its React component unmounts.
- The cookie notice now explains Clarity plainly and can be reopened through **Cookie settings** in either public footer. The choice buttons have visible focus treatment and usable target sizes.
- Added a `page_type` tag for home, brokerage, boat detail, charters, transportation, partners, and information pages. Added Clarity events after successful contact, charter, and transport submissions; for boat email/phone interest; and after a boat PDF download. No name, email, phone, message, boat ID, or form payload is sent in these events.
- Existing loading reductions for the hero and charter videos and boat PDF code are recorded in [the search and loading audit](seo-geo-aeo-audit-plan.md). Clarity measurements must be compared again on the deployed version.

## Follow-up after deployment

1. On a fresh production browser, verify no Clarity request or `_clck`/`_clsk` cookie before consent, no Clarity request after **Essential only**, and a consented Clarity request plus expected cookie after **Allow analytics**. Revoke the grant and verify cookies are removed. Use [Microsoft's consent verification method](https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode).
2. Open `/account` and `/sign-in` both directly and from a consented public page. Confirm no Clarity tag/request and no new private-route recording. Confirm public listing, service, and contact routes do record only with consent.
3. Submit a test contact, charter, and transport enquiry through their normal test paths. Confirm the corresponding custom event only after a successful response. Click a boat email/phone link and download a PDF to verify the remaining event names. Then build public funnels with the success events rather than the automatic Submit form event.
4. Review public-only dead-click recordings, heatmaps, and Copilot summaries after clean data accumulates. Prioritize repeated friction on pages with a meaningful sample. Recheck the Facebook WebView error; fix site code only if a reproducible app stack or failing interaction emerges.
5. Identify the production CDN or server log provider. Clarity Bot Activity supports Fastly, Amazon CloudFront, Cloudflare, Azure Front Door, and Akamai; connecting one requires the corresponding account and log access. Connect Google Analytics only if the correct production GA property is confirmed. Neither integration was guessed or connected during this audit.
6. Compare post-release LCP, INP, CLS, scroll, conversions, and citation/referral trends against a clean public-only period. Segment by device, landing page, and Southeast European country rather than relying on the blended site average.

## Verification and limits

`npm run build` and `git diff --check` passed. In a local production build, the cookie notice appeared, **Essential only** dismissed it, **Cookie settings** reopened it, and the sign-in layout had no cookie banner. The Clarity script is deliberately restricted to the production hostname, so a local browser cannot prove the production network behavior. Dashboard changes were reread after saving; citation showed `Domain connected: exeleroyachting.com`, Cookies showed Off, and the account selector showed Mask. No Git push or deployment was performed.

Clarity's [masking guidance](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking) explains that input and select values are masked by default and that masking changes are not retroactive. Its [Consent V2 API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2) documents the explicit analytics and advertising signals used here.
