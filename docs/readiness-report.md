# FreshRoute MD — development and readiness report

October 23, 2026. Continued from saved version 6 (`d037b3763e5d9399c7f988b9ff561bb6379a3ccd`). Changes are saved for review only. No deployment or access change is authorized or performed.

## Completed improvements

- Five primary tasks: Find food, Meal planner, My plan, Community and Learn. Spending, preferences, sources, About and provider information remain available. Existing URLs and the `/directory` alias are retained. Active links use the framework’s navigation component, keeping shared plan state during page changes.
- Household size sets new recipe servings. Maximum preparation time excludes methods that exceed a clearly labeled conservative estimate across batches. Existing all-tool, refrigeration, supported diet and known-allergen checks remain mandatory.
- Optional **user-entered** package prices and usable contents inform recipe ranking. Whole packages are rounded up only when recipe and package units match. Unknown or invalid inputs cannot establish affordability. A recipe-only budget filter is optional; the combined spending plan remains the authority for the entire grocery list.
- My Plan now retains multiple meals, with separate servings/methods, equipment, preparation steps and current-compatibility warnings. Users can edit or remove a meal. Removal preserves purchases with entered prices, quantities or acquired status.
- Missing-ingredient transfers remain explicit and repeatable. Re-saving updates requirements without duplicating them. New quoted groceries receive a package quantity; existing user values are preserved. Insufficient package quantities are flagged, with an explicit action to apply the calculated amount. A changed ingredient list or deleted grocery row prompts the user to refresh affected recipes.
- Supported finder filters, selected community/ZIP, travel mode, visit notes and user exclusions persist. Approximate browser/address locations remain visit-only and clear an older saved search area to prevent misleading plan summaries. Travel mode is used in external directions; it is not represented as a verified route or accessibility filter.
- Text exports and print markup contain every saved meal, preparation equipment, grocery requirements, budget, travel considerations, source dates and unanswered provider questions. Closed preparation disclosures have a dedicated print representation.
- Bilingual controls, new validation and dynamic notices, translated resource-sheet close label, explicit focus-return target, stronger form borders, mobile task navigation and sticky-header offsets were added or improved. Numerical custom-theme contrast tests continue to pass.
- Local plan schema v3 copies v2 and supported older data without deleting originals. Damaged saved data still blocks overwriting; export and in-memory work remain available with an explanatory notice.

## Bugs fixed

1. Earlier meals disappeared from My Plan while their grocery requirements remained.
2. Recipe changes could silently discard a priced/acquired purchase when an ingredient became available.
3. Adding another recipe could leave an insufficient package quantity without explanation.
4. Household size, preparation time and entered prices did not affect suggestions.
5. Resource filters and known community/ZIP search areas reset between pages.
6. In-person resources with missing coordinates were incorrectly labeled “Online.” They now say “Distance unknown,” and the results explain why such records remain visible.
7. Exports omitted required equipment and warnings about changed preferences.
8. Some dynamic validation messages remained in the previous language after language switching; new workflow messages use language-independent status codes.
9. The resource sheet’s close control was English-only and lacked an explicit return-focus target for programmatic opening.

## Features preserved

Vinext/React/TypeScript/Tailwind/Cloudflare architecture; existing Sites hosting identity and owner-only access; official Baltimore County and USDA SNAP source adapters; source provenance and unknown fields; stale-data fallback and refresh reconciliation; optional Census address lookup and OpenStreetMap; all existing page routes; four original bilingual recipes and supported matching rules; editable grocery prices/quantities, acquisition status and compatible item combination; local preferences; Pine/Moss/Dusk/custom color persistence; language switching; Community/Learn and source/legal information.

No working inventory feed, live-price integration or provider portal was found and removed. Dormant demo/test components remain inactive in source. They were not activated or used to fabricate production results.

## Verification results

| Check | Result and scope |
|---|---|
| TypeScript | `npm run typecheck` passed. |
| Automated tests | All five active suites passed. Existing 20 connected-workflow groups plus 15 new readiness regression groups; source fixtures, budget/forest regressions and 4,096 custom-accent samples also passed. |
| New regressions | v2→v3 migration, multiple meals, changed servings, package rounding and missing quotes, budget/time exclusions, preserved user purchases, quantity shortfalls, removal, changed-constraint warnings, travel links, exclusions, and English/Spanish export. |
| Production build | Supported Sites build helper passed and generated the existing route tree and resource API. Existing proxy and Vite native-config-loader warnings are nonblocking. |
| Lint | **Fails:** 69 findings remain, compared with 117 on a clean copy of version 6. No additional filename/rule/message findings were introduced. Most remaining findings concern inherited components, React hydration effects, ARIA-tag preferences and inactive demo/UI code. Lint rules were not weakened or disabled. |
| Static review | 12 screens rendered from the actual React components: six routes × English/Spanish. The review-only scenario has two saved meals and a $7.25 entered-price total against a $15 budget. Controls are disabled; this is not an interactive application test. |
| Browser QA | **Blocked:** the supported managed preview failed with `getaddrinfo EAI_AGAIN workers.cloudflare.com` after an identified stale dev lock was removed from the stopped session. No alternate server or deployment was used as a bypass. |

The following remain **unverified in a real browser**: desktop/tablet/narrow-phone layouts; back/direct-link behavior; keyboard focus, containment, Escape and focus return; language switching during input; real localStorage restoration; live source/map/Census requests; source-to-plan interactions; equipment-dependent UI; theme persistence; reduced-motion rendering; printing and file download. Code, rendered HTML and pure tests are supporting evidence, not proof of those interactions.

## Data and integration limits

- Pantry coverage comes from Baltimore County; USDA SNAP retailer listings cover Maryland. This is not a comprehensive statewide free-food directory.
- No real-time stock, automatic retail price, provider-confirmed access, verified transit itinerary, travel-time or automatic eligibility service is connected. Unknown values remain unknown. These integrations require actual approved data sources and provider relationships.
- Source retrieval time is not provider verification. Existing records have no supplied last-verification date. Saved resources may become stale, and source fields can be missing or contradictory.
- Recipe time estimates are conservative planning rules, not measurements. Four recipes are available; they have not been kitchen-tested or dietitian-reviewed. Product labels and cross-contact remain unknown.
- Pantry ownership is binary: ingredient quantities on hand are not measured. Package conversion uses only user-supplied matching units. Recipe estimates exclude other saved meals, taxes, transport and fees; the consolidated budget includes all entered purchases, including acquired items.
- Saved plans are browser-local, not cloud accounts or cross-device backups. Text export supports retrieval outside the app, but there is no plan-import feature. Earlier v2 data stored only the most recent recipe method; its other grocery requirements are retained without inventing missing recipe selections.
- Detailed inherited project/legal documentation and original provider data are partly English; primary tasks, new controls, validation and exports are bilingual. Spanish usability review remains necessary.

## Competition priorities still requiring real-world work

1. Restore preview infrastructure, complete the browser checklist, and run the prepared usability protocol with real consenting testers. Fix observed problems before release.
2. Resolve the remaining lint findings with focused review of active components, then separately archive or maintain inactive legacy components. Do not revive fabricated data to satisfy historical tests.
3. Kitchen-test recipe quantities, batch timing and instructions; broaden recipes and source coverage based on actual user/provider needs.
4. Record students’ genuine technical contributions, learning and AI assistance. Supply a responsible operator and monitored contact. No student work, interviews, adoption, partnerships or impact have been invented.
5. Confirm applicable competition rules and arrange judge access. The live Site remains owner-only. Publishing and any sharing change require the owner’s explicit authorization.

See `readiness-audit.md` for the audit, `architecture.md` for implementation details, `usability-guide.md` for the unperformed user-test protocol and `competition-preparation.md` for the earlier official-source rule review and demonstration outline.
