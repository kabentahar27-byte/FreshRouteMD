# FreshRoute MD — Final implementation and audit report

Audit: September 6, 2026, America/New_York (source snapshot September 7 UTC). This report distinguishes implemented code from completed testing. It does not certify legal compliance or Congressional App Challenge eligibility.

## IMPLEMENTED

The existing app was upgraded, preserving its mobile-oriented design and original site. Implemented features include a replaceable JSON data provider; county and USDA import adapters; provenance, freshness and conflict displays; eleven resource types; ZIP/community/name/listed-address search; voluntary rounded browser location; separately consented Census address lookup; type/service/phone/radius filters; distance sorting; pagination; current-page map markers; source links, hours, eligibility, directions and explicit unknowns. Three fictional samples were removed.

### Personalized prototype extension — September 21, 2026

The root route now contains a device-local ten-step profile and personalized dashboard, while the original sourced directory is preserved at `/directory`. New routes cover a seeded-demo resource finder, meals, basket/optimizer, community map and needs, learn/product lookup, profile editor and partner-update simulation. `lib/freshroute-demo.ts` centralizes 15 demo resources, 30 food/product records and 16 meals. Inventory, price, nutrition, availability, product, map and community records in this layer carry prominent seeded-demo labels and are not live facts.

FreshRoute Match is an explainable fixed-weight prototype. Its logic never uses SNAP/WIC payment support to increase a nutrition score. Allergy output distinguishes recorded conflicts from missing/unknown information. Profile, alert and partner-demo state is stored only in the current browser's local storage and can be cleared from Profile; it is not a user account or a provider system. Live use requires permitted data feeds, provider verification, authentication/authorization, security review and further privacy design.

Added About, Data Sources & Methodology, Privacy, Terms and Credits pages, footer links, an independence statement and a limited copyright notice. Map tiles now require opt-in. No app analytics, accounts, advertising or stored search history were added. Operator and student-contribution placeholders remain visible and honest.

**Completed automated checks:**

| Check | Evidence/result |
|---|---|
| Record validity, unique IDs, provenance preservation and counts | Passed for all 3,820 records |
| Deduplication, same-hotline branch separation and field conflicts | Passed controlled tests; seven actual merges retained in report |
| SNAP/pantry separation, missing data | Passed dataset assertions; unknowns retained |
| Combined type/service/radius/text filters, invalid ZIP/text | Passed domain tests |
| Distance, safe source URLs and destination-only directions | Passed domain tests |
| Location rounding and permission-denial handling | Passed mocked geolocation tests; real browser denial pending |
| Freshness labels | Passed deterministic date tests |
| Type checking and production static export | Passed |
| Six generated routes, legal/footer links and skip targets | Passed generated-HTML assertions |
| External links | 15 of 17 returned successful HTTP responses; OpenAI privacy returned 403 and OSM copyright 429, so those remain unconfirmed |
| Dependency advisories | npm audit: zero known advisories after compatible dependency updates; not a security guarantee |

**Implemented but not browser-validated:** mobile layouts, actual search-control interactions, onboarding progress/navigation, personalized filters, meal/basket interactions, local partner edits, address matching/no-match behavior, real geolocation prompts, map loading and list/map synchronization, keyboard navigation, sheet focus behavior, screen-reader experience and contrast. Responsive rules, native buttons/labels, skip link, live status and shared result-array wiring were inspected in source; this is not a substitute for user-interface testing. The browser tool reports a saved localhost permission block despite the user's approval. No alternate route was used to bypass it. These items are pending, not marked complete.

## NEEDS MY INPUT

- Supply student names, actual motivation, personal implementation/debugging work and dated evidence. Do not invent interviews or contributions. Make significant original technical contributions before presenting this as student-developed.
- Fill operator identity, monitored contact method and host retention details on Privacy/Terms/About.
- Decide whether to keep the working name after conflict checks, and choose an original-code license after ownership review.
- Complete the browser checks above once the saved local-preview permission block is removed. Test narrow phones, keyboard-only use and a real screen reader; do not claim WCAG conformance from source inspection.
- Review all seven merges and a practical sample of addresses/schedules directly with providers. Set a refresh and verification owner/cadence.
- Confirm district/team eligibility and submission materials. The private preview currently requires the owner's access; public judge access or a public video needs an explicit later sharing decision.

## LEGAL/LICENSING ITEMS I SHOULD MANUALLY VERIFY

- Baltimore County's [Data License](https://opendata.baltimorecountymd.gov/pages/data-license): required disclaimer included with county data and on the site. Review the full waiver/risk-allocation language with a responsible adult.
- USDA's [official locator/downloads](https://www.fns.usda.gov/snap/retailer-locator) support factual API access, but the [ArcGIS item](https://www.arcgis.com/home/item.html?id=8b260f9a10b0459aa441ad8588c2251c) has no separate license text. Confirm redistribution and service terms before wider launch.
- [211 terms](https://211md.org/terms/) restrict redistribution. Directory is linked only; obtain permission before importing.
- [OSM attribution](https://www.openstreetmap.org/copyright) remains on the map; review [tile policy](https://operations.osmfoundation.org/policies/tiles/) before scaling. No bulk/offline tile downloads are implemented.
- Installed notice inventory: 555 package entries; 30 have no scanner-detected top-level notice. Review upstream/nested/binary notices and MPL-2.0 obligations for the build dependency @resvg/resvg-wasm if redistributing it. Full available notices are retained. The scanner is not legal clearance.
- Branding: another March 2026 food-related project uses [“Freshroute”](https://medium.com/@devparikh2011/freshroute-an-app-to-stop-food-waste-in-my-community-dev-parikh-and-sophie-angel-10e4d8019063). Similar naming does not establish infringement, but warrants a fuller trademark/common-law search and possible rename. No official seals/logos or registered mark claims are used.
- Review host authentication/logging, Census/OSM third-party requests and applicable children's privacy rules with a responsible adult. No legal-compliance certification is made.

## CAC ITEMS I NEED TO DISCLOSE

Disclose substantial Codex assistance in implementation, architecture, design/copy, importer, tests and documentation; starter scaffold and external components; data, map and geocoder sources; and actual individual student work. This session does not establish significant student technical contribution. Filling placeholders alone does not resolve that gap. Read the [official 2026 rules](https://www.congressionalappchallenge.us/wp-content/uploads/2026/05/2026-CAC-Rules.pdf) and document truthful evidence rather than claiming eligibility from this audit.

## DATA SOURCES USED

| Source | Treatment | Source records |
|---|---|---:|
| [Baltimore County Food Pantries feature-query layer](https://bcgisapps.baltimorecountymd.gov/arcgis/rest/services/FoodPantries/MapServer/0) | Official public API; selected fields; source dates retained | 76 |
| [USDA current SNAP retailers](https://services1.arcgis.com/RLQu0rK7h4kbsBq5/arcgis/rest/services/snap_retailer_location_data/FeatureServer/0) | Official linked current layer; State='MD'; layer updated September 3, 2026 | 3,747 |
| Four original sourced listings | Community Crisis Center, 40 West, Beans and Bread, Maryland DHS SNAP information; published-source review September 6, not provider contact | 4 |
| [211 Maryland](https://211md.org/) | Referral link only; no imported directory | 0 |
| [USDA ERS access research](https://ers.usda.gov/data-products/food-access-research-atlas/download-the-data) | Evaluated tract-level analytical data; not individual resource records | 0 |

OSM supplies optional map tiles, Census supplies optional geocoding; neither establishes hours or benefit eligibility. No restricted-site scraping, login bypass or rate-limit circumvention was used.

## NUMBER OF UNIQUE RESOURCES BEFORE/AFTER

**Before: 7 displayed entries (4 real + 3 fictional samples). After: 3,820 unique real source-based entries**, from 3,827 contributing source records after seven merges. All source provenance remains. These are not 3,820 pantries: most are SNAP-authorized retailers. The two original county duplicates and five retailer duplicates account for the merges.

There are 3,743 entries without supplied hours and 3,746 without supplied phones; no physical entry lacks source coordinates. Coordinates may still be approximate or wrong. Pantry schedules may date to 2024. Unsupported resource categories remain empty; no fabricated WIC, youth, senior or affordability claims fill gaps. Coverage is initially Baltimore-oriented with statewide Maryland retailers, not a verified District 2 boundary dataset.

## TECHNICAL FEATURES I NEED TO UNDERSTAND FOR JUDGING

1. Explain the source adapters, complete ArcGIS pagination and stable provenance schema; reproduce an offline import.
2. Demonstrate a duplicate and a same-hotline branch that must stay separate; explain conflict preservation and remaining false-match risk.
3. Explain Haversine distance, approximate ZIP centers, radius filters and why proximity is not service eligibility or travel time.
4. Show that current-page list records drive map markers; explain pagination and the lack of live inventory/open-now guarantees.
5. Trace local data, browser geolocation, optional OSM tiles and Census address requests; explain rounding, consent and hosting limits.
6. Distinguish imported, updated and verified dates and explain project-defined freshness thresholds.
7. Explain immutable static snapshots and how a future permissioned feed can replace them without redesigning the interface.
8. Identify which code the student personally wrote, why, how it was tested, and where AI or third-party work was used.

The accompanying DEVELOPMENT_NOTES.md contains the student evidence template, sources and detailed decisions. README.md contains setup and refresh instructions; data/link-check.json, data/license-inventory.json and public/data/import-report.json retain machine-readable audit evidence.
