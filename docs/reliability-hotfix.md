# October 24 reliability fix

Production logs confirmed `/api/resources` exceeded the Worker CPU budget (32 seconds). The old duplicate detection repeatedly normalized and compared every resource against all prior records. Replaced it with prepared keys and candidate indexes while preserving first-match order, provenance, conflicts and merge semantics.

The source regression now imports the full archived government dataset (76 county rows and 3,747 SNAP rows), rather than two rows per provider. It produces 3,817 resources in approximately three seconds locally including request pacing. Added behavior checks for filled-in phone indexes, provenance, stable matching, different addresses and online/in-person boundaries. This is fixture-based testing, not a claim of fresh upstream verification.

Meal planning now explicitly explains its four-recipe catalog, provides a visible Show meal suggestions action, offers an affirmative basic-utensil selection listing every included tool, and expands incompatibility explanations when there are no suggestions. Dietary restrictions and equipment compatibility remain enforced. Searching for food moves focus to the results heading.

Verification: existing automated suites and TypeScript passed. Live `/meals` and its four initial JavaScript assets returned HTTP 200 before deployment. That does not establish successful browser hydration or interaction. Cloud-browser testing is blocked by the private site's sign-in; managed preview DNS remains unavailable. Actual recipe dialog, mobile layout and click-through testing remain unverified in this environment.

Publishing uses the existing owner-only audience. Live API verification is reported separately after deployment.
