import Link from 'next/link';
import InfoPage from '@/components/info-page';
import { countyDisclaimer } from '@/lib/county-notice.mjs';
export default function Page() {
  return (
    <InfoPage
      title="Sources & freshness"
      lead="Official directory records, with separate dates and unknown availability."
    >
      <section>
        <h2>The sourced directory</h2>
        <p>
          Food-pantry records come from Baltimore County Government. Retailer
          records come from the USDA FNS SNAP Retailer Locator, filtered to
          Maryland. The app preserves original source wording, record
          identifiers, conflicts and missing information.
        </p>
        <p>
          SNAP authorization indicates a source-listed retailer, not free food,
          low prices, WIC acceptance or stock. Pantry classification alone does
          not establish cost, eligibility or availability.
        </p>
        <Link className="primary" href="/FreshRouteMD/find-food">
          Search the directory
        </Link>
        <p>
          <a href="https://bcgisapps.baltimorecountymd.gov/arcgis/rest/services/FoodPantries/MapServer/0">
            Baltimore County Food Pantries source
          </a>
          <br />
          <a href="https://services1.arcgis.com/RLQu0rK7h4kbsBq5/arcgis/rest/services/snap_retailer_location_data/FeatureServer/0">
            USDA FNS SNAP retailer source
          </a>
        </p>
      </section>
      <section>
        <h2>Refresh and failure behavior</h2>
        <p>
          GitHub Actions attempts to refresh the official directory hourly, on
          each code push, and when manually triggered. Scheduled runs can be
          delayed by GitHub. The page loads the latest successfully published
          JSON snapshot and shows its original import date. Refresh listings
          reloads that published file; it does not start a new government import.
        </p>
        <p>
          Each source fetch checks source record IDs and rejects incomplete
          pages. If the import fails, the last sourced snapshot is retained.
          Snapshots older than two hours are marked stale. An already open page
          checks again hourly and when returning after an hour. Saved resources
          can be older and should be confirmed with the provider.
        </p>
        <p>
          No stock feed is connected. The scheduled job updates directory
          listings, not food inventory. Refreshing never establishes provider
          confirmation, hours, eligibility, or stock.
        </p>
      </section>
      <section>
        <h2>What the dates mean</h2>
        <ul>
          <li>
            Retrieval/import date: when the app fetched the source records.
          </li>
          <li>
            Source updated: the date the source reports, when supplied; it may
            apply to the dataset rather than the individual retailer.
          </li>
          <li>
            Provider confirmation: no provider confirmation is established by
            this integration.
          </li>
          <li>
            Inventory confirmation: unknown; no inventory data path exists.
          </li>
        </ul>
        <p>
          Source contact fields may be missing. Verify hours, documents,
          appointment requirements, service area and accessibility before
          traveling. Straight-line distances use approximate community or ZIP
          centers, or a voluntarily selected rounded location. They are not
          routes or travel times.
        </p>
      </section>
      <section id="county-disclaimer">
        <h2>Baltimore County notice</h2>
        <p>{countyDisclaimer}</p>
        <a href="https://opendata.baltimorecountymd.gov/pages/data-license">
          County data license
        </a>
      </section>
      <section>
        <h2>Recipe and grocery data</h2>
        <p>
          Recipes are a separate original AI-assisted collection, not imported
          pantry inventory. User-entered ingredients and prices are stored
          locally. Brand-specific allergens, package yields, prices, taxes and
          travel costs are not inferred. See recipe details for preparation and
          storage guidance, provenance and limitations.
        </p>
      </section>
    </InfoPage>
  );
}
