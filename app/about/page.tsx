import Link from 'next/link';
import InfoPage from '@/components/info-page';
export const metadata = { title: 'About FreshRoute MD' };
export default function About() {
  return (
    <InfoPage
      active="about"
      title="One less barrier to a meal."
      lead="FreshRoute MD connects ingredients you have, a meal you can prepare, and a spending plan — alongside sourced food resources."
    >
      <section>
        <h2>What you can do</h2>
        <p>
          Enter ingredients you own, select kitchen equipment and review recipes
          that match supported preferences. Save a recipe, transfer missing
          ingredients to your grocery list, and enter your own prices and
          purchase quantities. Print or export your plan.
        </p>
        <p>
          Search official Maryland food-pantry and SNAP-retailer listings
          separately. Save a resource and use questions to confirm whether a
          visit will work for you. A saved resource never adds ingredients or
          claims that food was obtained.
        </p>
      </section>
      <section>
        <h2>Sources and limits</h2>
        <p>
          Baltimore County pantry records and Maryland retailers in the USDA FNS
          SNAP source retain their provenance. Availability, accessibility,
          eligibility and operating status may be unknown. SNAP retailers sell
          food; acceptance does not mean free food, low prices or WIC
          acceptance. There is no live inventory, price comparison or
          travel-time routing.
        </p>
        <p>
          The small recipe collection uses original AI-assisted instructions.
          Recipes have not been kitchen-tested or reviewed by a dietitian. Known
          ingredient allergens are filtered, but product labels and
          cross-contact remain unknown. Verify quantities, labels and
          preparation instructions.
        </p>
        <Link href="/FreshRouteMD/data-sources">Sources and freshness</Link>
      </section>
      <section>
        <h2>Student development and AI assistance</h2>
        <p>
          FreshRoute MD is an independent educational project being prepared for
          the Congressional App Challenge. It is not a government service or an
          endorsed nonprofit directory.
        </p>
        <p>
          The MVP and subsequent upgrades were substantially AI-assisted,
          including interface design, source integration, recipe text, matching
          and budget logic, tests and documentation. Student identities and
          personally completed technical contributions have not yet been
          supplied for this project record. We do not attribute this generated
          work to students.
        </p>
        <p>
          The team must truthfully document its own technical contributions and
          disclose AI use. Study notes and generated documentation do not
          replace genuine student development. Competition eligibility and a win
          are not guaranteed.
        </p>
      </section>
      <section>
        <h2>Privacy and shared devices</h2>
        <p>
          There is no FreshRoute account or server-side plan database. Plans and
          preferences stay in your browser. Optional maps and address lookup
          have separate consent notices. Use Preferences to clear local data on
          a shared device.
        </p>
        <p>
          An operator and monitored project contact have not yet been supplied.
          This remains a review prototype; contact listed providers directly
          about food services.
        </p>
        <Link href="/FreshRouteMD/privacy">Privacy and device data</Link>
      </section>
    </InfoPage>
  );
}
