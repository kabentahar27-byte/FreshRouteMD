import Link from 'next/link';
import InfoPage from '@/components/info-page';
export const metadata = { title: 'Privacy · FreshRoute MD' };
export default function Privacy() {
  return (
    <InfoPage
      title="Privacy and device data"
      lead="Plan without sending FreshRoute your name, income or personal documents."
    >
      <p>Updated October 23, 2026 · Review prototype</p>
      <section>
        <h2>Local data</h2>
        <p>
          Ingredients, kitchen preferences, household size, preparation time,
          saved meals, package price estimates, groceries, budget, travel notes,
          selected community or ZIP, finder filters and saved resources stay in
          this browser. Language and color preferences and a copy of public
          directory listings are also saved. Anyone using the same browser
          profile can view this information.
        </p>
        <p>
          Supported values are copied from older FreshRoute plans without
          deleting the originals. Older health, assistance and travel-time
          answers are not evaluated. Review the current planning preferences.
          Clear all FreshRoute device data in Preferences removes current and
          older FreshRoute storage, including cached listings.
        </p>
        <p>
          Local plans remain until you clear them or your browser removes site
          data. Exports and printed copies are under your control and are not
          deleted by clearing the app. No plan is sent to a FreshRoute database.
          Storage can fail or be unavailable; the app displays a warning and
          allows text export.
        </p>
      </section>
      <section>
        <h2>Search and location</h2>
        <p>
          Your selected community or ZIP center and finder filters are saved
          with your plan. Other search text, address lookups and browser
          location stay in memory for this visit. Browser location is requested
          only after Use my location and rounded to two decimal places before
          use. Clear location removes the saved community or ZIP and resets the
          search; it does not revoke browser permission.
        </p>
        <p>
          Saving a resource retains its publicly listed address and source
          details, not your street address or browser location. The application
          does not request names, benefit identifiers, documents or precise
          financial circumstances. Hypothetical values can be used for testing.
        </p>
      </section>
      <section>
        <h2>Optional external tools</h2>
        <p>
          Loading the map sends your IP address and displayed map area to
          OpenStreetMap. Hiding the map stops new tile requests, but cannot
          recall earlier requests.{' '}
          <a href="https://osmfoundation.org/wiki/Privacy_Policy">
            OpenStreetMap privacy information
          </a>
          .
        </p>
        <p>
          Checking the address-lookup consent box and choosing Locate address
          sends your typed address to the U.S. Census Bureau geocoder in an
          isolated frame. Do not include personal documents or benefit numbers.
          Opening external directions sends the destination and selected travel
          mode to Google Maps; Google may separately request your origin under
          its own controls.
        </p>
      </section>
      <section>
        <h2>Hosting and contacts</h2>
        <p>
          The app uses OpenAI Sites and Cloudflare. Hosting can process network
          addresses, browser information, security logs and access cookies.
          Host-managed sign-in may be required by the existing access
          configuration; FreshRoute itself does not add an account system. The
          application has no advertising, analytics or visitor behavior tracking
          code.
        </p>
        <p>
          <a href="https://openai.com/policies/privacy-policy/">
            OpenAI privacy information
          </a>{' '}
          ·{' '}
          <a href="https://www.cloudflare.com/privacypolicy/">
            Cloudflare privacy information
          </a>
        </p>
        <p>
          A responsible operator and monitored privacy contact have not yet been
          supplied. Hosting log access, retention and a request-handling process
          still require operator confirmation before a public launch. Do not
          send private documents through FreshRoute. Contact listed food
          providers directly for service questions.
        </p>
      </section>
      <Link className="primary" href="/FreshRouteMD/profile">
        Manage device data
      </Link>
    </InfoPage>
  );
}
