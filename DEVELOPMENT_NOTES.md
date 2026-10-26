# FreshRoute MD — Development notes

Audit date: September 6, 2026 (America/New_York). The imported snapshot timestamp is September 7 UTC. This is an existing MVP upgrade, not a claim of legal compliance or CAC eligibility.

## Authorship and AI disclosure — student action required

Codex supplied substantial implementation, interface copy, architecture, import tooling, tests and documentation in this task. The original project includes a framework/UI starter scaffold. No evidence in this task establishes significant personal student technical development. Do not describe this code as entirely student-written, and do not treat completing this document as a substitute for actual technical work.

The student team must fill in, truthfully:

| Item | Student-provided evidence |
|---|---|
| Student names and individual roles | [TO COMPLETE] |
| Original motivation and community research | [TO COMPLETE; do not invent interviews] |
| Personally designed and implemented technical changes | [TO COMPLETE with dated changes and explanation] |
| Problems personally debugged and testing performed | [TO COMPLETE with evidence] |
| AI tools/models, dates, prompts and accepted/rejected suggestions | [TO COMPLETE; retain this conversation] |
| School/residence district and team eligibility | [TO COMPLETE] |
| Adult/operator identity and monitored contact | [TO COMPLETE before broader launch] |

Under the official [2026 CAC rules](https://www.congressionalappchallenge.us/wp-content/uploads/2026/05/2026-CAC-Rules.pdf), AI assistance must be disclosed and cannot constitute all technical development; students must demonstrate significant contribution and understanding. Review the full current rules, team/district eligibility, project dates, submission form and public 1–3 minute demo requirements with a responsible adult. This audit cannot establish eligibility. Keep credits for starter code, libraries, data and AI work in the submission and video.

## Technologies and architecture

React 19.2.8, Vinext 1.0.0-beta.9, Vite 8.2.2, TypeScript 5.9.3 and Tailwind 4.2.1 implement the existing interface. Leaflet 1.9.4 provides maps. Base UI/Shadcn supply controls and the detail sheet; Lucide supplies icons. Cloudflare/OpenAI Sites provide build and hosting integration. Exact direct/transitive versions are in package-lock.json; Node >=22.13 is required.

Flow: official source APIs → paginated importer → normalization/schema validation → conservative deduplication → versioned public JSON snapshot → resourceProvider → local filters/distance/pagination → shared list/map page. No app backend database, account system or runtime AI API is needed. The hosting platform may require sign-in for this private preview.

`data/manual-resources.json` holds four sourced original entries. `data/source-snapshot.json` caches selected raw API fields for reproducible offline imports. `public/data/resources.json` is the published snapshot; `public/data/import-report.json` records counts and all merges. Replace/extend the provider and source adapters to add permitted public datasets. A refresh does not mark records verified. Imports are manual, not scheduled.

## Personalized MVP extension — September 21, 2026

The existing sourced directory remains available at `/directory`. A separate personalized layer uses `lib/freshroute-demo.ts` for centralized **seeded data**: 15 Baltimore-area resource examples, 30 food/product records and 16 meal templates. This intentionally keeps mock inventory, price, nutrition, map and community information from being confused with the directory's sourced records.

`lib/freshroute-engine.ts` keeps the recommendation rules visible in one place: access/distance 25%, availability 20%, preferences 20%, affordability 15%, dietary/allergy compatibility 10%, transportation 5% and freshness 5%. SNAP/WIC payment options are displayed as access information and do not alter the nutrition match. The same module provides food-tag matching, conditional meal completion, a free-plus-paid basket estimate and clearly labeled allergy states: conflict, not reported or unknown. These are prototype rules, not medical, eligibility or nutritional advice.

The 10-step profile, alerts and local partner-update simulation use browser `localStorage` only. They are not accounts, do not sync to a server and are clearable from `/profile`. A real deployment needs permissioned feeds, server-side role/authentication design, provider verification and privacy/security review before any partner claim or live availability is shown.

## Technical decisions implemented by Codex — team adoption pending

These are implemented choices, not fabricated decisions personally made by students:

- Preserve the existing visual design and static architecture rather than adding accounts or a server database.
- Request ArcGIS IDs and bounded pages; use POST for long query URLs, fail on incomplete pages and validate before replacing the public snapshot.
- Retain every contributing source and field conflict. Require corroborating duplicate signals; avoid collapsing different branches sharing a hotline.
- Distinguish published-source review, import date and source update date. Never infer free food, WIC or affordability from SNAP authorization.
- Paginate at 24 results and pass the same visible records to list and map. Use straight-line Haversine distance, clearly labelled.
- Keep local ZIP/community search available without location permission. Estimate non-preset ZIP centers from resource coordinates rather than pretending to have official ZIP polygons.
- Round browser location to two decimal degrees immediately; use explicit opt-ins for OSM map tiles and external Census street lookup. Isolate Census JSONP inside a sandboxed, opaque-origin iframe.
- Keep unsupported categories empty and unknown hours/phone/eligibility explicit.

Students should explain each decision, identify tradeoffs, implement substantive improvements themselves, and record their own work before claiming these as team contributions.

## Data rights and attribution

Baltimore County's [Food Pantries layer](https://bcgisapps.baltimorecountymd.gov/arcgis/rest/services/FoodPantries/MapServer/0) is publicly queryable. Its [Data License](https://opendata.baltimorecountymd.gov/pages/data-license) requires a disclaimer, retained in the source cache, exported JSON and Data Sources page. The full license also contains risk-allocation/waiver terms for adult review; permission to download is not a blanket legal conclusion.

The [USDA official SNAP locator](https://www.fns.usda.gov/snap/retailer-locator) links the [current authorized retailer dataset](https://www.arcgis.com/home/item.html?id=8b260f9a10b0459aa441ad8588c2251c) and offers downloads. This importer filters Maryland. The ArcGIS item supplies no separate license text; confirm dataset/service redistribution terms before wider publication. Preserve USDA attribution. Four original factual listings retain their published-source review dates, without implying provider contact.

[211 Maryland terms](https://211md.org/terms/) restrict redistribution: link only, no directory import. [USDA ERS research data](https://ers.usda.gov/data-products/food-access-research-atlas/download-the-data) describes tract-level access, not individual resource availability; evaluated but not imported. Additional WIC, youth and senior sources need independent permission and quality checks.

## Libraries, assets and branding

THIRD_PARTY_NOTICES.md and public/third-party-notices.txt preserve available installed package notices. data/license-inventory.json records 555 installed entries, including development tools; 30 lack a top-level notice file detected by the scanner. This is not a complete legal clearance: review those upstream packages, binary packages, nested notices and dependencies on other operating systems before redistributing. The inventory includes @resvg/resvg-wasm with MPL-2.0 (build tooling); assess applicable source/notice obligations if distributing that component. Source exports exclude node_modules and compiled binaries.

Major licenses: React/Vite/Vinext/Tailwind/Base UI mostly MIT; Leaflet BSD-2-Clause; Lucide ISC with Feather MIT notices; TypeScript and class-variance-authority Apache-2.0. Installed notices are retained rather than replacing them with this summary. No overall license for original project code has been selected; ownership and licensing need the team's decision.

Fonts are system Arial/Helvetica/sans-serif, without a remote font service. Header artwork uses Lucide; the small route favicon is AI-assisted vector work. No government seals, CAC logo, nonprofit logos or downloaded photography are used. Copyright text applies only to copyrightable contributions, not public facts or third-party material.

FreshRoute MD remains a working name, not a cleared trademark. A web search found a March 2026 author post titled [“Freshroute: An App to Stop Food Waste in My Community”](https://medium.com/@devparikh2011/freshroute-an-app-to-stop-food-waste-in-my-community-dev-parikh-and-sophie-angel-10e4d8019063). Similar usage is a reason to investigate, not proof of infringement. Conduct a [USPTO comprehensive clearance search](https://www.uspto.gov/trademarks/search/comprehensive-clearance-search-similar-trademarks) and common-law/app-store/domain search; consider a distinct name before submission. No affiliation or registered-trademark claim is made.

## Privacy and external requests

The original sourced directory does not use local/session storage, app cookies, analytics, advertising, fingerprinting or a search-history database. The personalized MVP stores the profile, alert choices and local partner-demo edits in `localStorage` on the current device; Profile exposes a clear action. Neither layer has an account or server-side search-history database. Static data requests reach the site host. Site hosting/authentication may log requests, IPs and user agents or use its own cookies; operator account settings and retention were not independently audited.

Browser coordinates are requested only by an explicit button and rounded before entering application state. FreshRoute does not persist them. OSM tiles are off until requested; tile-area URLs and IP reveal approximate map area, including after location changes. Census lookup sends the expressly entered address and network information only after a separate checkbox and submit. Exact matches appear temporarily to let the user choose; selected coordinates are rounded and the form cleared. In-flight external requests cannot be recalled by clearing the interface. Google directions links contain resource destination only, never a user-location origin. External services may collect additional information under their own policies.

Review [OSM tile policy](https://operations.osmfoundation.org/policies/tiles/), [Census geocoder documentation](https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html), host terms/log retention and children's privacy applicability. The [FTC COPPA guidance](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions) requires context-specific analysis; this general-audience prototype is not certified compliant. Supply operator/contact placeholders on Privacy, Terms and About before broader use.

## Validation evidence and remaining tests

Automated record tests pass for all 3,820 entries, provenance counts, taxonomy, conservative deduplication, branch guards, field conflicts, combined filters, invalid searches, freshness thresholds, safe URLs, distances, destination-only directions, coarse location and mocked permission denial. TypeScript and production static build pass. Dependency audit reports zero known advisories at this snapshot; this is not a security guarantee.

Browser testing was attempted but the browser tool reports a saved localhost permission block even after the user approved testing. No workaround was used. Mobile rendering, real browser permission denial, actual address lookup, map tile loading/list synchronization, focus trapping, keyboard navigation, screen-reader behavior and visual contrast remain pending in a permitted browser. Source review of labels/breakpoints is not a substitute for these tests. See FINAL_AUDIT.md for the distinction between implemented code and tested behavior.
