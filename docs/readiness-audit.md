# Final-development audit — October 23, 2026

Baseline: version 6, commit d037b3763e5d9399c7f988b9ff561bb6379a3ccd. Existing Vinext/React/TypeScript/Tailwind/Cloudflare Worker application; no new framework or backend. All 16 page routes and one API, navigation, imported source providers, local storage, optional Census/OSM, source helpers and active tests inspected. Baseline typecheck and all active tests pass. Existing access is owner-only and unchanged.

## Working in code / automated tests

Official-source mapping, approximate-distance/type/service filters, stable resource IDs/provenance, last-success cache and refresh reconciliation, four bilingual recipes with all-equipment checks, dietary/allergen exclusion, quantities/servings, explicit grocery transfer, manual budget, local plan persistence, print/text export implementation, color controls, independent Community guide and source/legal pages.

## Confirmed gaps to fix

- My Plan displays only the latest recipe although grocery requirements accumulate from multiple recipes.
- Household size and maximum preparation time do not affect suggestions.
- Budget exists but cannot inform recommendations because package-content and price quotes are absent.
- Transportation constraints have no usable saved-plan representation. Official listings cannot prove routes, travel times, step-free access or eligibility.
- Known community/ZIP search areas and resource filters reset on route navigation.
- Recommendation explanations omit time/household and supported cost factors.
- Plan export omits equipment and current compatibility warnings.
- Resource rows label a missing coordinate “Online” even for in-person records.
- Resource sheet’s accessible close name remains English, and manually opened sheets lack an explicit return-focus target.
- Primary navigation differs from the requested five tasks.
- Old dev/demo components remain in source but are not routed or imported by active workflow. Do not reactivate their fabricated inventory, prices or generic instructions.

## Implementation checklist

| Phase | Authorized work | Acceptance |
|---|---|---|
| 1 | Inspect current source/routes/features/data/build/tests | This audit plus baseline evidence |
| 2 | Connect constraints, meal choices, groceries and retrieval/export | Focused behavioral tests; browser if available |
| 3 | Preserve official provenance, unknown fields and stale fallback | Source/filter tests; no fabricated data |
| 4 | Household, method-aware time and explicit user-quote estimates; supported resource filters | Deterministic explanations and compatibility regressions |
| 5 | Five primary tasks; spending retained inside My Plan and secondary navigation | Existing direct routes retained, responsive nav |
| 6 | Multiple saved meals, preparation and travel details, edit/remove/export | Consistent summary and exports |
| 7 | Bilingual fields, validation, close name/focus, mobile/focus styles | Static and browser checks distinguished |
| 8 | Typecheck, all relevant tests, build, focused new regressions | Report obsolete suites separately |
| 9 | First-visit purpose and CTA; independent guided workflow | No invented social proof or authorship claims |
| 10 | Save version only; report limits, sources and next priorities | No deployment or sharing change |

Provider-confirmed access/availability and automatic prices remain unavailable; unknown information must not be converted into a positive match. Personal transportation notes will guide the visit checklist and external directions mode, while distance filters remain clearly straight-line. Explicitly user-excluded resources can be hidden without claiming provider confirmation. No live stock data path will be invented.

## Closing status

All identified implementation gaps above were addressed in source, with 15 focused new behavioral regression groups. Type checking, all five active test suites and the production build pass. Twelve bilingual static review screens render. Lint remains at 69 inherited findings versus 117 on the clean baseline, with no additional filename/rule/message findings. Browser QA is blocked by the managed preview’s Cloudflare DNS failure, so interaction and responsive verification are not marked complete. Full findings, data limits and prioritized remaining work: `readiness-report.md`. Saved version only; no publication or access change.
