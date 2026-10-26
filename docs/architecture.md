# Technical architecture and algorithm limits

## Request and state flow

The existing Vinext route tree renders client React workspaces within the shared language provider and new plan provider. Header/navigation and forest tokens are retained. The plan provider restores validated browser-local JSON, migrates supported legacy fields once, then persists changes. Native links preserve existing URLs and browser history; all plan screens read the same persistent schema. Language changes alter labels, not data keys. There is no new account or application database.

The source-backed finder requests `/api/resources`. The Worker’s directory-cache module coalesces simultaneous requests in an instance, reuses complete snapshots for one hour, and tries the platform Cache API for continuity across requests. Cache API storage is best effort and not a durable database. Errors use a complete prior snapshot up to seven days old with `stale:true`; without one, the API returns 503. The client records the original retrieval time and retains successful rows through refresh failures. Sequence identifiers ignore responses from obsolete requests; active requests are aborted on unmount and time out at 60 seconds. Selected details are reconciled by stable record ID, with change/removal notices. Only public directory snapshots are cached, never searches or location.

## Matching

`lib/recipes.mjs` defines four bilingual original recipes with explicit base servings, ingredient IDs, quantities, units, equipment per method, storage requirements and steps. `lib/meal-engine.mjs` uses a strict alias table, case/whitespace/diacritic normalization and no fuzzy substitutions. Dry beans never match canned ready-to-eat beans; a generic yogurt product never substitutes for dairy yogurt. Unrecognized user ingredients remain visible notes and do not affect matching. The ambiguous term “plátano” is not automatically mapped to banana.

A method qualifies only when **every** required tool is selected. Storage requirements are additional. Known allergen conflicts and supported dietary conflicts exclude a recipe. Household size sets the initial servings. Methods are filtered by conservative batch-time estimates and an optional maximum time. Eligible recipes rank complete within-budget estimates first, then unknown and over-budget estimates; ties use lower comparable complete cost, missing ingredient count, estimated time and stable recipe ID. The optional affordability filter requires complete matching-unit user quotes and a valid budget. These are per-recipe purchase estimates, explicitly excluding other saved meals. Ingredient presence is binary: quantities owned are not collected, so sufficiency is never claimed. Brand ingredients, gluten/certifications, cross-contact and custom notes remain unverified.

Recipe amounts scale linearly from base servings for whole serving counts 1–12. Methods remain method-specific; microwave oats instruct one serving per batch to avoid pretending a larger batch has the same cooking time. This is not a nutrition optimizer or a clinical recommendation. Recipe code/data review does not substitute for kitchen testing.

## Grocery transfer and arithmetic

An explicit transfer attaches requirements `{recipeId, servings, quantity, unit}` to grocery rows. Repeating a transfer replaces that recipe’s requirements rather than appending duplicates, preserves user prices, names, purchase quantities and acquired state, and can accumulate compatible needs from multiple recipes. Ingredient identity and unit must agree before requirements combine. New rows have unknown prices and purchase quantities unless the user supplied a valid package-price quote with usable contents in the same unit. Such quotes round up whole packages; no can-to-cup or other unsupported conversion occurs. Existing entered values are not overwritten. Package coverage checks aggregate the row’s recipe requirements and warn when its purchase quantity is insufficient; an explicit action applies the calculated quantity. Manual combination is available only for identical product identity/name, compatible requirement units, purchase unit, package contents/measure, price and acquired status.

Purchase quantity is separate from recipe requirements. Users decide how much packaged or weighed food to buy and supply the unit price. Values are bounded, money parsed as integer cents, quantity as thousandths, and each line rounds half-up to cents. Blank/invalid prices or quantities are excluded from the priced subtotal and make the total incomplete. Explicit zero is valid. Acquired groceries remain included in spending and do not silently enter the owned-ingredient list.

Multiple meals retain independent methods and servings. Removing a meal detaches its requirements but preserves priced, quantified or acquired purchases. Ingredient changes and deleted grocery requirements are detected; users explicitly re-save affected recipes. Exports include all saved meals, equipment, current compatibility warnings, purchase coverage, public source dates and travel notes.

Schema v3 copies v2 without overwriting the older key. Known community/ZIP centers and supported filters persist; browser/address origins are session-only. Selecting a private origin clears a prior saved area rather than presenting the wrong origin in My Plan. External Google Maps links use an optional travel mode but supply no inferred route, origin, duration or accessibility. Explicit user exclusions are local preferences, not changes to source truth.

## Boundaries and files

- `lib/plan-model.mjs`: migration, shape validation, transfer, combination, money arithmetic.
- `lib/money.mjs`, `price-estimates.mjs`, `plan-review.mjs`, `travel.mjs`: bounded arithmetic, matching-unit quotes, saved-plan consistency and supported directions parameters.
- `components/plan-context.tsx`: restore/save and storage errors.
- `components/meal-planner.tsx`, `meal-preferences.tsx`: ingredient and recipe interface; native dialog.
- `components/manual-budget.tsx`, `saved-plan.tsx`: budget, plan, print and text export.
- `lib/visit-checklist.mjs`: unanswered questions; user checkmarks indicate only that they asked.
- `lib/directory-cache.mjs`, `hooks/use-directory.ts`: server/client resilience.
- `lib/theme.mjs`: shared palette tokens and black/white button text selected by relative luminance.

All substantial code, instructions and tests added in this work are AI-assisted. Browser behavior, live endpoint health, real-device accessibility and kitchen testing are separate verification tasks, not proven by the architecture.
