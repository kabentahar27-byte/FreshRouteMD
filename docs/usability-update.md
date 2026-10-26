# October 25 usability update

- Added a bilingual food → meal → plan navigation strip with actual saved resource and meal counts. No fake completion states or metrics.
- Made owned-ingredient entry an optional expandable panel. Kitchen setup can be collapsed, and Show meal suggestions collapses setup and focuses the results heading.
- Added an explanation beside the restrictive budget checkbox, plus a direct recovery action when it hides otherwise compatible meals. Recovery changes only that checkbox, retaining allergy, dietary, time and equipment restrictions.
- Added recipe review actions for excluded recipes. Existing compatibility and serving checks continue to prevent saving incompatible selections.
- Retained the recipe catalog, government directory integration, unknown-price handling, saved-plan schema, English/Spanish, routes, exports and grocery calculation behavior.

Validation: existing automated suites pass, including full-source import, saved-plan persistence, transfer, budget and contrast checks. Added regression coverage that budget-filter recovery preserves allergy and equipment restrictions. TypeScript passes. Production build is required during packaging.

Limitations: managed preview still cannot resolve workers.cloudflare.com. Browser click-through, responsive layout and focus behavior have not been verified in a browser. The four-recipe catalog remains limited. No user-testing or competition outcome claims are made.
