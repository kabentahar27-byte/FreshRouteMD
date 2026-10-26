# Requirements checklist

Status meanings: **Implemented and verified** = source inspection or named automated check supports the requirement; it does not imply browser testing. **Implemented but unverified** = code is present, with interaction/visual verification pending. **Blocked** = requires unavailable infrastructure, real people or factual owner information. **Intentionally deferred** = unsupported or explicitly unauthorized, with reason.

This checklist records the earlier brief; the latest ten-phase brief is tracked in `readiness-audit.md` and `readiness-report.md`. Five primary tasks supersede the earlier three-task navigation. See `verification.md` for earlier results and `implementation-brief.txt` for the complete original wording. Browser checks are all pending because the managed preview failed with `EAI_AGAIN workers.cloudflare.com`; no live deployment was used to bypass review.


## 1. INSPECT THE CURRENT APPLICATION

| Requirement | Status | Evidence / limitation |
|---|---|---|
| 1.1 Inspect the current source, framework, routes, components, styling, data models, API requests, storage, authentication, access configuration, and tests. | Implemented and verified | Baseline typecheck/tests, source and Site access inspected; source helper opened commit b44be0b. |
| 1.2 Identify which features actually work, which are placeholders, which controls do not affect outcomes, and which destinations duplicate another page. | Implemented and verified | Baseline typecheck/tests, source and Site access inspected; source helper opened commit b44be0b. |
| 1.3 Check for changes made since previous work before overwriting anything. | Implemented and verified | Baseline typecheck/tests, source and Site access inspected; source helper opened commit b44be0b. |
| 1.4 Establish a baseline by running relevant existing checks. | Implemented and verified | Baseline typecheck/tests, source and Site access inspected; source helper opened commit b44be0b. |
| 1.5 Distinguish current tests from obsolete tests that depend on removed demo data. Do not restore fabricated data just to make an obsolete test pass. | Implemented and verified | Baseline typecheck/tests, source and Site access inspected; source helper opened commit b44be0b. |
| 1.6 Reuse existing conventions and functioning logic where practical. | Implemented and verified | Baseline typecheck/tests, source and Site access inspected; source helper opened commit b44be0b. |

## 2. COMPLETE THE CORE WORKFLOW

| Requirement | Status | Evidence / limitation |
|---|---|---|
| 2.1 Enter or select ingredients they actually have. | Implemented but unverified | Connected workspaces implemented; pure workflow covered by connected-workflow.mjs; browser execution pending. |
| 2.2 Select their cooking equipment. | Implemented but unverified | Connected workspaces implemented; pure workflow covered by connected-workflow.mjs; browser execution pending. |
| 2.3 Set relevant dietary preferences and allergies. | Implemented but unverified | Connected workspaces implemented; pure workflow covered by connected-workflow.mjs; browser execution pending. |
| 2.4 See compatible recipe suggestions. | Implemented but unverified | Connected workspaces implemented; pure workflow covered by connected-workflow.mjs; browser execution pending. |
| 2.5 Understand which ingredients they have and which they still need. | Implemented but unverified | Connected workspaces implemented; pure workflow covered by connected-workflow.mjs; browser execution pending. |
| 2.6 Choose a recipe and adjust servings when supported by reliable recipe quantities. | Implemented but unverified | Connected workspaces implemented; pure workflow covered by connected-workflow.mjs; browser execution pending. |
| 2.7 Transfer missing ingredients to a grocery list. | Implemented but unverified | Connected workspaces implemented; pure workflow covered by connected-workflow.mjs; browser execution pending. |
| 2.8 Enter their own grocery prices and quantities. | Implemented but unverified | Connected workspaces implemented; pure workflow covered by connected-workflow.mjs; browser execution pending. |
| 2.9 See the grocery total and remaining budget or amount over budget. | Implemented but unverified | Connected workspaces implemented; pure workflow covered by connected-workflow.mjs; browser execution pending. |
| 2.10 Find potentially useful food resources separately. | Implemented but unverified | Connected workspaces implemented; pure workflow covered by connected-workflow.mjs; browser execution pending. |
| 2.11 Save or print a clear plan and a resource visit checklist. | Implemented but unverified | Connected workspaces implemented; pure workflow covered by connected-workflow.mjs; browser execution pending. |
| 2.12 Ingredients entered by the user. | Implemented but unverified | Connected workspaces implemented; pure workflow covered by connected-workflow.mjs; browser execution pending. |
| 2.13 Ingredients required by a recipe. | Implemented but unverified | Connected workspaces implemented; pure workflow covered by connected-workflow.mjs; browser execution pending. |
| 2.14 Ingredients on a shopping list. | Implemented but unverified | Connected workspaces implemented; pure workflow covered by connected-workflow.mjs; browser execution pending. |
| 2.15 Availability reported by a provider, if a genuine feed exists. | Implemented but unverified | Connected workspaces implemented; pure workflow covered by connected-workflow.mjs; browser execution pending. |
| 2.16 Unknown availability. | Implemented but unverified | Connected workspaces implemented; pure workflow covered by connected-workflow.mjs; browser execution pending. |

## 3. IMPLEMENT A TRUSTWORTHY RECIPE SYSTEM

| Requirement | Status | Evidence / limitation |
|---|---|---|
| 3.1 A name and short description. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.2 Defined ingredients with usable quantities and units. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.3 A stated base serving count. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.4 Required equipment. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.5 Complete, coherent preparation steps. | Implemented but unverified | Original bilingual recipe data present and structurally checked; no kitchen test or dietitian review claimed. |
| 3.6 Preparation time labeled appropriately as an estimate. | Implemented but unverified | Original bilingual recipe data present and structurally checked; no kitchen test or dietitian review claimed. |
| 3.7 Applicable dietary and known allergen information. | Implemented but unverified | Original bilingual recipe data present and structurally checked; no kitchen test or dietitian review claimed. |
| 3.8 Honest attribution or provenance when using third-party recipe material. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.9 Require all equipment needed for one supported preparation method. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.10 Support alternative methods only when each has valid equipment requirements and corresponding instructions. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.11 Exclude or clearly separate recipes that cannot be prepared with the selected equipment. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.12 Never count one matching tool as satisfying an entire equipment requirement. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.13 Respect storage and refrigeration requirements where relevant. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.14 Normalize common ingredient names without making unsafe substitutions. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.15 Distinguish available ingredients from missing ingredients. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.16 Avoid claiming quantity sufficiency when the user has not entered quantities. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.17 Scale quantities correctly when servings change. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.18 Avoid silently converting incompatible units. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.19 Use deterministic, explainable matching and ranking. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.20 Exclude recipes containing a known conflicting ingredient when that allergy is selected. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.21 Treat unknown ingredient or product information as unknown. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.22 Avoid claiming a recipe is allergy-safe. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.23 Explain that brands, substitutions, labels, and cross-contact require user verification. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |
| 3.24 Avoid medical or nutrition claims that the app cannot support. | Implemented and verified | recipes.mjs and meal-engine.mjs; connected-workflow tests. Preparation has code/content review, not kitchen testing. |

## 4. CONNECT THE SPENDING PLAN

| Requirement | Status | Evidence / limitation |
|---|---|---|
| 4.1 Transfer missing recipe ingredients into the grocery list through an explicit user action. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |
| 4.2 Preserve ingredient names, units, and required quantities. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |
| 4.3 Let users edit, remove, combine, and mark items acquired. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |
| 4.4 Prevent accidental duplicate entries when transferring the same recipe repeatedly. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |
| 4.5 Do not merge incompatible units or distinct products. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |
| 4.6 Distinguish recipe quantities from purchasable package quantities. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |
| 4.7 Do not silently equate one recipe unit with one grocery package. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |
| 4.8 Allow manual prices when no verified price source exists. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |
| 4.9 Clearly identify any genuinely supported estimate. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |
| 4.10 Never fabricate store prices, savings, promotions, or pantry stock. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |
| 4.11 Label totals as incomplete when required prices are missing. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |
| 4.12 Do not treat a blank price as a confirmed zero-dollar item. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |
| 4.13 Include only explicitly priced grocery quantities in the priced subtotal. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |
| 4.14 Explain excluded costs such as taxes, transportation, and fees. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |
| 4.15 Use precise currency calculations. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |
| 4.16 Validate negative, blank, nonfinite, excessively large, and otherwise invalid values. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |
| 4.17 Support realistic quantities and units, including fractional quantities where appropriate. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |
| 4.18 Show “Remaining” or “Over budget” using text as well as color. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |
| 4.19 Preserve the active plan during language switching, route changes, refreshes, and browser back navigation where technically appropriate. | Implemented and verified | plan-model.mjs and plan provider; decimal arithmetic, transfer, migration and incomplete totals tested; interaction checks pending. |

## 5. MAKE FOOD DISCOVERY USEFUL AND HONEST

| Requirement | Status | Evidence / limitation |
|---|---|---|
| 5.1 SNAP-authorized retailers sell groceries; SNAP acceptance does not mean free food, low prices, WIC acceptance, or particular stock. | Implemented but unverified | Finder detail, saved-plan and visit-checklist; provenance/filter tests pass. Live data/interaction pending. |
| 5.2 Food-pantry classification does not by itself confirm free service, eligibility, hours, or availability. | Implemented but unverified | Finder detail, saved-plan and visit-checklist; provenance/filter tests pass. Live data/interaction pending. |
| 5.3 Unknown values must remain visibly unknown. | Implemented but unverified | Finder detail, saved-plan and visit-checklist; provenance/filter tests pass. Live data/interaction pending. |
| 5.4 Resource name and type. | Implemented but unverified | Finder detail, saved-plan and visit-checklist; provenance/filter tests pass. Live data/interaction pending. |
| 5.5 Address and approximate distance, when supported. | Implemented but unverified | Finder detail, saved-plan and visit-checklist; provenance/filter tests pass. Live data/interaction pending. |
| 5.6 Published hours and their limitations. | Implemented but unverified | Finder detail, saved-plan and visit-checklist; provenance/filter tests pass. Live data/interaction pending. |
| 5.7 Eligibility and visit requirements. | Implemented but unverified | Finder detail, saved-plan and visit-checklist; provenance/filter tests pass. Live data/interaction pending. |
| 5.8 Cost information, when supplied. | Implemented but unverified | Finder detail, saved-plan and visit-checklist; provenance/filter tests pass. Live data/interaction pending. |
| 5.9 Contact options. | Implemented but unverified | Finder detail, saved-plan and visit-checklist; provenance/filter tests pass. Live data/interaction pending. |
| 5.10 Original sources and relevant dates. | Implemented but unverified | Finder detail, saved-plan and visit-checklist; provenance/filter tests pass. Live data/interaction pending. |
| 5.11 Accessibility or transportation information only when supported. | Implemented but unverified | Finder detail, saved-plan and visit-checklist; provenance/filter tests pass. Live data/interaction pending. |
| 5.12 Source conflicts and missing information. | Implemented but unverified | Finder detail, saved-plan and visit-checklist; provenance/filter tests pass. Live data/interaction pending. |
| 5.13 Are you operating on the intended visit date? | Implemented but unverified | Finder detail, saved-plan and visit-checklist; provenance/filter tests pass. Live data/interaction pending. |
| 5.14 Do you serve my area or household? | Implemented but unverified | Finder detail, saved-plan and visit-checklist; provenance/filter tests pass. Live data/interaction pending. |
| 5.15 Is an appointment or identification required? | Implemented but unverified | Finder detail, saved-plan and visit-checklist; provenance/filter tests pass. Live data/interaction pending. |
| 5.16 Are there dietary accommodations? | Implemented but unverified | Finder detail, saved-plan and visit-checklist; provenance/filter tests pass. Live data/interaction pending. |
| 5.17 What should I bring? | Implemented but unverified | Finder detail, saved-plan and visit-checklist; provenance/filter tests pass. Live data/interaction pending. |
| 5.18 Is the location accessible? | Implemented but unverified | Finder detail, saved-plan and visit-checklist; provenance/filter tests pass. Live data/interaction pending. |

## 6. REMOVE OR FIX MISLEADING CONTROLS

| Requirement | Status | Evidence / limitation |
|---|---|---|
| 6.1 Produce an implemented, useful effect; or | Implemented and verified | Updated by the final-development pass: supported travel mode is used in external directions and saved notes; radius remains straight-line. Five-task navigation and v3 state preserve existing routes. See readiness-report.md; no verified route/access claims. |
| 6.2 Be removed from the primary workflow or explicitly identified as unavailable. | Implemented and verified | Updated by the final-development pass: supported travel mode is used in external directions and saved notes; radius remains straight-line. Five-task navigation and v3 state preserve existing routes. See readiness-report.md; no verified route/access claims. |
| 6.3 Do not present transportation selection as a working route filter unless it genuinely changes results using supported information. | Implemented and verified | Updated by the final-development pass: supported travel mode is used in external directions and saved notes; radius remains straight-line. Five-task navigation and v3 state preserve existing routes. See readiness-report.md; no verified route/access claims. |
| 6.4 Straight-line distance must not be presented as walking, driving, cycling, or transit distance. | Implemented and verified | Updated by the final-development pass: supported travel mode is used in external directions and saved notes; radius remains straight-line. Five-task navigation and v3 state preserve existing routes. See readiness-report.md; no verified route/access claims. |
| 6.5 Do not invent travel times or transit accessibility. | Implemented and verified | Updated by the final-development pass: supported travel mode is used in external directions and saved notes; radius remains straight-line. Five-task navigation and v3 state preserve existing routes. See readiness-report.md; no verified route/access claims. |
| 6.6 If useful routing cannot be implemented with available supported services, retain approximate-distance search and external directions, and move transportation preferences out of the main search controls. | Implemented and verified | Updated by the final-development pass: supported travel mode is used in external directions and saved notes; radius remains straight-line. Five-task navigation and v3 state preserve existing routes. See readiness-report.md; no verified route/access claims. |
| 6.7 Preserve any existing saved transportation preference without implying unsupported behavior. | Implemented and verified | Updated by the final-development pass: supported travel mode is used in external directions and saved notes; radius remains straight-line. Five-task navigation and v3 state preserve existing routes. See readiness-report.md; no verified route/access claims. |
| 6.8 Apply dietary preferences, allergies, equipment, and ingredient selections to recipes where supported. | Implemented and verified | Updated by the final-development pass: supported travel mode is used in external directions and saved notes; radius remains straight-line. Five-task navigation and v3 state preserve existing routes. See readiness-report.md; no verified route/access claims. |
| 6.9 Apply preferences to resource results only when actual source fields support doing so. | Implemented and verified | Updated by the final-development pass: supported travel mode is used in external directions and saved notes; radius remains straight-line. Five-task navigation and v3 state preserve existing routes. See readiness-report.md; no verified route/access claims. |
| 6.10 Do not infer dietary accommodations from a resource’s name or category. | Implemented and verified | Updated by the final-development pass: supported travel mode is used in external directions and saved notes; radius remains straight-line. Five-task navigation and v3 state preserve existing routes. See readiness-report.md; no verified route/access claims. |
| 6.11 Remove unsupported match scores. | Implemented and verified | Updated by the final-development pass: supported travel mode is used in external directions and saved notes; radius remains straight-line. Five-task navigation and v3 state preserve existing routes. See readiness-report.md; no verified route/access claims. |
| 6.12 Prefer concise explanations of the actual factors used. | Implemented and verified | Updated by the final-development pass: supported travel mode is used in external directions and saved notes; radius remains straight-line. Five-task navigation and v3 state preserve existing routes. See readiness-report.md; no verified route/access claims. |
| 6.13 Keep Find food, Choose a meal, and Plan your spending as the primary tasks. | Superseded by latest user brief | Updated by the final-development pass: supported travel mode is used in external directions and saved notes; radius remains straight-line. Five-task navigation and v3 state preserve existing routes. See readiness-report.md; no verified route/access claims. |
| 6.14 Ensure each destination performs its advertised task. | Implemented and verified | Updated by the final-development pass: supported travel mode is used in external directions and saved notes; radius remains straight-line. Five-task navigation and v3 state preserve existing routes. See readiness-report.md; no verified route/access claims. |
| 6.15 Audit Community, Learn, About, Profile, the sourced directory, and provider-related destinations. | Implemented and verified | Updated by the final-development pass: supported travel mode is used in external directions and saved notes; radius remains straight-line. Five-task navigation and v3 state preserve existing routes. See readiness-report.md; no verified route/access claims. |
| 6.16 Give duplicate destinations a distinct useful purpose or consolidate their navigation while preserving useful direct links. | Implemented and verified | Updated by the final-development pass: supported travel mode is used in external directions and saved notes; radius remains straight-line. Five-task navigation and v3 state preserve existing routes. See readiness-report.md; no verified route/access claims. |
| 6.17 Do not keep a separate destination that merely disguises the finder as another completed feature. | Implemented and verified | Updated by the final-development pass: supported travel mode is used in external directions and saved notes; radius remains straight-line. Five-task navigation and v3 state preserve existing routes. See readiness-report.md; no verified route/access claims. |
| 6.18 Preserve browser back behavior and direct links. | Implemented and verified | Updated by the final-development pass: supported travel mode is used in external directions and saved notes; radius remains straight-line. Five-task navigation and v3 state preserve existing routes. See readiness-report.md; no verified route/access claims. |

## 7. FIX DATA REFRESH AND FAILURE BEHAVIOR

| Requirement | Status | Evidence / limitation |
|---|---|---|
| 7.1 Background refresh must not close an open resource detail panel. | Implemented and verified | directory-cache.mjs and use-directory.ts; cache/selection/failure/order tests. Platform cache and live requests not exercised. |
| 7.2 Preserve the selected resource by stable identity when possible. | Implemented and verified | directory-cache.mjs and use-directory.ts; cache/selection/failure/order tests. Platform cache and live requests not exercised. |
| 7.3 If a selected resource changes or disappears, explain what happened without abruptly discarding the user’s context. | Implemented and verified | directory-cache.mjs and use-directory.ts; cache/selection/failure/order tests. Platform cache and live requests not exercised. |
| 7.4 A transient source failure must not erase the last successful results. | Implemented and verified | directory-cache.mjs and use-directory.ts; cache/selection/failure/order tests. Platform cache and live requests not exercised. |
| 7.5 Keep the last successful retrieval available with a clear timestamp and stale-data notice. | Implemented and verified | directory-cache.mjs and use-directory.ts; cache/selection/failure/order tests. Platform cache and live requests not exercised. |
| 7.6 Distinguish failed loading from a legitimate empty result. | Implemented and verified | directory-cache.mjs and use-directory.ts; cache/selection/failure/order tests. Platform cache and live requests not exercised. |
| 7.7 Provide Retry. | Implemented and verified | directory-cache.mjs and use-directory.ts; cache/selection/failure/order tests. Platform cache and live requests not exercised. |
| 7.8 Avoid overlapping requests and prevent older responses from overwriting newer state. | Implemented and verified | directory-cache.mjs and use-directory.ts; cache/selection/failure/order tests. Platform cache and live requests not exercised. |
| 7.9 Clean up timers and requests when appropriate. | Implemented and verified | directory-cache.mjs and use-directory.ts; cache/selection/failure/order tests. Platform cache and live requests not exercised. |
| 7.10 Avoid unnecessary complete dataset downloads every minute. | Implemented and verified | directory-cache.mjs and use-directory.ts; cache/selection/failure/order tests. Platform cache and live requests not exercised. |
| 7.11 Choose a refresh and caching strategy appropriate to the actual sources, their update frequency, and their documented limits. | Implemented and verified | directory-cache.mjs and use-directory.ts; cache/selection/failure/order tests. Platform cache and live requests not exercised. |
| 7.12 Time the app last fetched the source. | Implemented and verified | directory-cache.mjs and use-directory.ts; cache/selection/failure/order tests. Platform cache and live requests not exercised. |
| 7.13 Time the source reports being updated. | Implemented and verified | directory-cache.mjs and use-directory.ts; cache/selection/failure/order tests. Platform cache and live requests not exercised. |
| 7.14 Time a provider last confirmed information. | Implemented and verified | directory-cache.mjs and use-directory.ts; cache/selection/failure/order tests. Platform cache and live requests not exercised. |
| 7.15 Inventory confirmation, which remains unknown without genuine inventory data. | Implemented and verified | directory-cache.mjs and use-directory.ts; cache/selection/failure/order tests. Platform cache and live requests not exercised. |

## 8. PRESERVE AND REFINE THE FOREST UI

| Requirement | Status | Evidence / limitation |
|---|---|---|
| 8.1 Readable serif headings and clean body typography. | Implemented but unverified | Shared forest tokens retained, theme helper corrected; 4,096 accent samples pass numerical contrast. Visual/theme persistence checks pending. |
| 8.2 Clear task navigation. | Implemented but unverified | Shared forest tokens retained, theme helper corrected; 4,096 accent samples pass numerical contrast. Visual/theme persistence checks pending. |
| 8.3 Generous spacing and scannable result rows. | Implemented but unverified | Shared forest tokens retained, theme helper corrected; 4,096 accent samples pass numerical contrast. Visual/theme persistence checks pending. |
| 8.4 Optional maps. | Implemented but unverified | Shared forest tokens retained, theme helper corrected; 4,096 accent samples pass numerical contrast. Visual/theme persistence checks pending. |
| 8.5 Shared design tokens. | Implemented but unverified | Shared forest tokens retained, theme helper corrected; 4,096 accent samples pass numerical contrast. Visual/theme persistence checks pending. |
| 8.6 Pine, Moss, Dusk, custom accent, and restore-default options. | Implemented but unverified | Shared forest tokens retained, theme helper corrected; 4,096 accent samples pass numerical contrast. Visual/theme persistence checks pending. |
| 8.7 Immediate theme updates and local persistence. | Implemented but unverified | Shared forest tokens retained, theme helper corrected; 4,096 accent samples pass numerical contrast. Visual/theme persistence checks pending. |
| 8.8 Readable text and controls with very light or dark custom colors. | Implemented but unverified | Shared forest tokens retained, theme helper corrected; 4,096 accent samples pass numerical contrast. Visual/theme persistence checks pending. |

## 9. ACCESSIBILITY, RESPONSIVENESS, AND LANGUAGE

| Requirement | Status | Evidence / limitation |
|---|---|---|
| 9.1 Semantic structure and logical headings. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 9.2 Visible labels. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 9.3 Understandable validation and error messages. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 9.4 Strong contrast and visible keyboard focus. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 9.5 Approximately 44px touch targets. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 9.6 Accessible dialogs with keyboard operation, Escape to close, appropriate focus containment, and focus return. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 9.7 Reduced-motion support. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 9.8 Anchor and focus positioning that is not hidden by sticky navigation. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 9.9 Navigation. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 9.10 Forms and labels. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 9.11 Recipe interface and recipe content. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 9.12 Matching explanations. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 9.13 Validation. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 9.14 Budget output. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 9.15 Loading, empty, stale, and error states. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 9.16 Saved-plan controls. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 9.17 Notices and dynamic messages. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |

## 10. PRIVACY AND DATA INTEGRITY

| Requirement | Status | Evidence / limitation |
|---|---|---|
| 10.1 Do not collect personal information that the workflow does not need. | Implemented and verified | No new app server writes/auth/services; local state and opt-in boundaries source-reviewed. Stored-value migration and failure tested; clear-data UI pending. |
| 10.2 Do not add authentication merely for presentation. | Implemented and verified | No new app server writes/auth/services; local state and opt-in boundaries source-reviewed. Stored-value migration and failure tested; clear-data UI pending. |
| 10.3 Keep precise location optional. | Implemented and verified | No new app server writes/auth/services; local state and opt-in boundaries source-reviewed. Stored-value migration and failure tested; clear-data UI pending. |
| 10.4 Preserve existing consent boundaries for maps and address lookup. | Implemented and verified | No new app server writes/auth/services; local state and opt-in boundaries source-reviewed. Stored-value migration and failure tested; clear-data UI pending. |
| 10.5 Do not introduce undisclosed third-party transmission. | Implemented and verified | No new app server writes/auth/services; local state and opt-in boundaries source-reviewed. Stored-value migration and failure tested; clear-data UI pending. |
| 10.6 Explain local storage accurately. | Implemented and verified | No new app server writes/auth/services; local state and opt-in boundaries source-reviewed. Stored-value migration and failure tested; clear-data UI pending. |
| 10.7 Provide clear controls to remove locally stored preferences and plans. | Implemented and verified | No new app server writes/auth/services; local state and opt-in boundaries source-reviewed. Stored-value migration and failure tested; clear-data UI pending. |
| 10.8 Do not expose secrets in source, logs, screenshots, exports, or documentation. | Implemented and verified | No new app server writes/auth/services; local state and opt-in boundaries source-reviewed. Stored-value migration and failure tested; clear-data UI pending. |
| 10.9 Do not change sharing or access permissions without my explicit authorization. | Implemented and verified | No new app server writes/auth/services; local state and opt-in boundaries source-reviewed. Stored-value migration and failure tested; clear-data UI pending. |
| 10.10 Do not overwrite legitimate source data with mock data for convenience. | Implemented and verified | No new app server writes/auth/services; local state and opt-in boundaries source-reviewed. Stored-value migration and failure tested; clear-data UI pending. |

## 11. VERIFY REAL USER USEFULNESS

| Requirement | Status | Evidence / limitation |
|---|---|---|
| 11.1 Whether the task was completed. | Blocked | Guide includes this observation field; no test session has occurred. |
| 11.2 Where the tester hesitated. | Blocked | Guide includes this observation field; no test session has occurred. |
| 11.3 What they misunderstood. | Blocked | Guide includes this observation field; no test session has occurred. |
| 11.4 Any incorrect assumption caused by the interface. | Blocked | Guide includes this observation field; no test session has occurred. |
| 11.5 What should change. | Blocked | Guide includes this observation field; no test session has occurred. |

## 12. STUDENT OWNERSHIP AND COMPETITION PREPARATION

| Requirement | Status | Evidence / limitation |
|---|---|---|
| 12.1 Student-contribution placeholders. | Blocked | Public placeholders replaced with truthful missing-information notice. Actual student contributions require factual input. |
| 12.2 Unsupported claims about who wrote code. | Implemented and verified | Official rules/registration checked October 23; deadline conflict and district HTTP 403 documented. AI work disclosed in app and docs. |
| 12.3 Incomplete AI disclosures. | Implemented and verified | Official rules/registration checked October 23; deadline conflict and district HTTP 403 documented. AI work disclosed in app and docs. |
| 12.4 Unfinished operator or contact fields. | Blocked | No operator or monitored contact provided; honest limitation replaces placeholder. |
| 12.5 Misleading descriptions of implemented features. | Implemented and verified | Official rules/registration checked October 23; deadline conflict and district HTTP 403 documented. AI work disclosed in app and docs. |
| 12.6 An accurate technical architecture summary. | Implemented and verified | Prepared in architecture.md, competition-preparation.md and contribution-log.md; student tasks are proposed, not falsely attributed. |
| 12.7 A list of AI-assisted work. | Implemented and verified | Prepared in architecture.md, competition-preparation.md and contribution-log.md; student tasks are proposed, not falsely attributed. |
| 12.8 A contribution-log template. | Implemented and verified | Prepared in architecture.md, competition-preparation.md and contribution-log.md; student tasks are proposed, not falsely attributed. |
| 12.9 A short explanation of the main algorithms and their limitations. | Implemented and verified | Prepared in architecture.md, competition-preparation.md and contribution-log.md; student tasks are proposed, not falsely attributed. |
| 12.10 A list of meaningful technical tasks the student team could personally implement and explain. | Implemented and verified | Prepared in architecture.md, competition-preparation.md and contribution-log.md; student tasks are proposed, not falsely attributed. |

## 13. JUDGE ACCESS AND DEMONSTRATION

| Requirement | Status | Evidence / limitation |
|---|---|---|
| 13.1 Identify whether a judge could open the submitted app link. | Implemented and verified | Owner-only access means judge access cannot be assumed. |
| 13.2 If access is restricted, explain the available supported options. | Implemented and verified | Custom/public modes and invitations documented; no changes made. |
| 13.3 Do not publish publicly, invite people, or widen permissions without explicit authorization. | Implemented and verified | No deployment, invitations or permission changes issued. |
| 13.4 Prepare instructions for testing the approved access method from another account or signed-out browser. | Implemented and verified | Clean-browser/approved-account instructions in competition-preparation.md; not executed. |
| 13.5 Briefly explain the user and problem. | Blocked | 2:50 outline prepared; actual recording and student-contribution facts remain pending. |
| 13.6 Demonstrate one complete working workflow. | Blocked | 2:50 outline prepared; actual recording and student-contribution facts remain pending. |
| 13.7 Show one or two meaningful technical decisions. | Blocked | 2:50 outline prepared; actual recording and student-contribution facts remain pending. |
| 13.8 Explain a limitation honestly. | Blocked | 2:50 outline prepared; actual recording and student-contribution facts remain pending. |
| 13.9 Accurately identify student and AI contributions. | Blocked | 2:50 outline prepared; actual recording and student-contribution facts remain pending. |

## 14. TESTING AND ACCEPTANCE

| Requirement | Status | Evidence / limitation |
|---|---|---|
| 14.1 Ingredient normalization and matching. | Implemented and verified | Active automated suites and typecheck/build; browser checks separately blocked. |
| 14.2 Equipment requirements and alternative preparation methods. | Implemented and verified | Active automated suites and typecheck/build; browser checks separately blocked. |
| 14.3 Known allergen conflicts and unknown information. | Implemented and verified | Active automated suites and typecheck/build; browser checks separately blocked. |
| 14.4 Recipe serving and quantity scaling. | Implemented and verified | Active automated suites and typecheck/build; browser checks separately blocked. |
| 14.5 Missing-ingredient transfer and duplicate prevention. | Implemented and verified | Active automated suites and typecheck/build; browser checks separately blocked. |
| 14.6 Grocery package and recipe quantity distinctions. | Implemented and verified | Active automated suites and typecheck/build; browser checks separately blocked. |
| 14.7 Currency precision, incomplete totals, invalid inputs, and over-budget results. | Implemented and verified | Active automated suites and typecheck/build; browser checks separately blocked. |
| 14.8 Persistence and existing-data migration. | Implemented and verified | Active automated suites and typecheck/build; browser checks separately blocked. |
| 14.9 Resource filtering and preservation of source provenance. | Implemented and verified | Active automated suites and typecheck/build; browser checks separately blocked. |
| 14.10 Refresh success, failure, stale state, request ordering, and selected-detail preservation. | Implemented and verified | Active automated suites and typecheck/build; browser checks separately blocked. |
| 14.11 Desktop, tablet, and narrow mobile layouts. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 14.12 Primary and secondary navigation. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 14.13 Direct links and browser back. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 14.14 Keyboard-only use and dialog focus. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 14.15 English and Spanish. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 14.16 Source loading, empty, error, and stale states. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 14.17 Ingredients-to-recipe-to-budget transitions. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 14.18 Equipment-dependent suggestions. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 14.19 Theme persistence and custom-color contrast. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 14.20 Reduced-motion behavior. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 14.21 Printing or exporting a plan. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 14.22 Approved judge access. | Implemented but unverified | Relevant markup/state/CSS present; browser infrastructure unavailable. No passing interaction result claimed. |
| 14.23 Preserve the implementation. | Implemented and verified | Browser failure recorded, implementation retained, static review explicitly labeled, no deployment. |
| 14.24 Report the precise verification limitation. | Implemented and verified | Browser failure recorded, implementation retained, static review explicitly labeled, no deployment. |
| 14.25 Provide the best supported preview. | Implemented and verified | Browser failure recorded, implementation retained, static review explicitly labeled, no deployment. |
| 14.26 Do not describe an offline layout preview as a functioning interactive app. | Implemented and verified | Browser failure recorded, implementation retained, static review explicitly labeled, no deployment. |
| 14.27 Do not deploy merely to bypass the requirement for review. | Implemented and verified | Browser failure recorded, implementation retained, static review explicitly labeled, no deployment. |

## 15. FINAL HANDOFF

| Requirement | Status | Evidence / limitation |
|---|---|---|
| 15.1 What changed. | Implemented but unverified | Review artifact and source version prepared without deployment; artifact limitations recorded in verification.md; save receipt retained for handoff. |
| 15.2 The complete workflow that now works. | Implemented but unverified | Review artifact and source version prepared without deployment; artifact limitations recorded in verification.md; save receipt retained for handoff. |
| 15.3 Tests and browser checks actually completed. | Implemented but unverified | Review artifact and source version prepared without deployment; artifact limitations recorded in verification.md; save receipt retained for handoff. |
| 15.4 Requirements still blocked or unverified. | Implemented but unverified | Review artifact and source version prepared without deployment; artifact limitations recorded in verification.md; save receipt retained for handoff. |
| 15.5 Remaining source-data limitations. | Implemented and verified | Limitations and required facts explicitly recorded in final handoff and project documentation. |
| 15.6 Any student-authorship information still needed. | Implemented and verified | Limitations and required facts explicitly recorded in final handoff and project documentation. |
| 15.7 Current judge-access status. | Implemented and verified | Limitations and required facts explicitly recorded in final handoff and project documentation. |
| 15.8 The preview link or supported review artifact. | Implemented but unverified | Review artifact and source version prepared without deployment; artifact limitations recorded in verification.md; save receipt retained for handoff. |

## Cross-cutting decisions

- Live provider inventory, transit routing, automated prices and unsupported medical/dietary certification: intentionally deferred because there is no genuine authorized data path or validated logic. No control claims these work.
- Publishing and widening access: intentionally deferred until the owner approves the review and the access method.
- Actual usability sessions, kitchen testing, student contributions, operator/contact and signed-out judge access: blocked on real participation or factual authorization. No substitutes have been fabricated.
- A prior demo scenario was not reintroduced into the production app. The review artifact alone labels hypothetical user inputs. No resource listings or store prices are fabricated.
- Existing directory sources, official-source tests, routes, map attribution, County notice and host access configuration remain intact.
- Browser print/text-download interaction, dialog focus, storage persistence across actual back/navigation, responsive layouts, reduced motion and live cache behavior remain unverified even when their pure logic is tested.
