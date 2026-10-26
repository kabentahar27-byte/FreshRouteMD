# FreshRoute MD

Maryland food resources, meal planning, saved grocery plans, and budgeting.

## GitHub Pages

Run `npm install`, then `npm run dev:pages`. Build with `npm run build:pages`.
The Pages workflow builds and deploys on pushes and hourly. It refreshes listings from Baltimore County and USDA; if a source is unavailable, the last sourced snapshot remains available with its original date and a stale indicator. No inventory feed is connected. Hours, eligibility, and stock require provider confirmation.

All original application source, import scripts, source provenance, tests, and documentation are included. GitHub Pages runs the React client. The original Worker API route is retained as source; Pages uses the public JSON directory instead. Plans and preferences remain in each visitor's browser.

The deployment base path is `/FreshRouteMD/`. Deep links are handled through GitHub Pages' custom 404 page.
