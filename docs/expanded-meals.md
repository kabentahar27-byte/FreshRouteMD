# Six additional meals

The catalog now contains ten original, AI-assisted recipes: the four existing recipes plus tuna–chickpea bowls, peanut butter–banana wraps, black bean sweet potatoes, rice–bean–tomato bowls, tomato–chickpea pasta, and red lentil–tomato soup. The additions provide two no-cook, two microwave and two stovetop options.

All additions have English and Spanish names, descriptions and preparation instructions; exact ingredient IDs and quantities; equipment requirements; and known ingredient allergens. Tuna is excluded for vegetarian/vegan preferences. Peanut butter and wheat products are explicitly classified. Package labels still require review. No live stock or prices are invented.

Microwave recipes use one serving per batch; stovetop recipes use two-serving batches. Existing scaling and conservative time logic apply. Shared ingredient IDs allow grocery requirements to consolidate across recipes. Existing saved recipes and plan schema are retained.

Verification: existing tests and TypeScript pass. New regressions cover all six recipes, each missing tool, known allergens, 1/2/4/12 servings, saved-plan validation, repeated transfers, owned ingredients, unknown prices, dietary restrictions and microwave batching. The production build runs during packaging. Recipes have not been kitchen-tested or dietitian-reviewed; this remains disclosed in the app. Browser preview remains unavailable in this environment.
