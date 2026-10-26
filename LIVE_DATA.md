# Live source policy

Active routes use /api/resources. It fetches complete county pantry and Maryland USDA SNAP source records on demand, with no bundled snapshot fallback. The browser refreshes every 60 seconds and on becoming visible. Partial or failed imports return 503 and clear visible results.

Inventory, prices, product offers, donation needs, community statistics and locally simulated partner updates are not published. No provider-authorized inventory feed is connected. Source presence is not a guarantee of operation or stock. Do not mark a retrieval as independent verification.

The source API is request-driven; it does not require a background schedule. True stock automation remains blocked on a provider-authorized API with item IDs, locations, observed timestamps and expiry semantics. Do not create a schedule that merely regenerates stock guesses.

Validation: npm test; npm run typecheck; Sites build helper. Direct upstream checks can be blocked by source/network availability; never substitute the historical fixture in production.
