import Link from 'next/link';
import InfoPage from '@/components/info-page';
export const metadata = { title: 'Credits & licenses · FreshRoute MD' };
export default function Credits() {
  return (
    <InfoPage
      title="Credits & licenses"
      lead="FreshRoute builds on open-source tools and attributed public data. Those contributions remain credited to their owners."
    >
      <section>
        <h2>Application technologies</h2>
        <ul>
          <li>React and React DOM: MIT license.</li>
          <li>
            Vinext, Vite, Tailwind CSS and OpenAI Sites Vite plugin: MIT
            license.
          </li>
          <li>
            Base UI, Shadcn components and supporting UI packages: mostly MIT;
            class-variance-authority is Apache-2.0.
          </li>
          <li>Leaflet: BSD-2-Clause license.</li>
          <li>
            Lucide icons: ISC license, with MIT notices for icons derived from
            Feather. The complete bundled notices are retained.
          </li>
          <li>
            TypeScript: Apache-2.0. Build/development tools have their own
            notices.
          </li>
        </ul>
        <p>
          <Link href="/FreshRouteMD/third-party-notices.txt">
            Read the complete generated third-party notice inventory
          </Link>
          . This includes installed transitive and development dependencies;
          inclusion does not mean every package ships in the browser. Package
          declarations are evidence, not a legal certification.
        </p>
      </section>
      <section>
        <h2>Maps, data and geocoding</h2>
        <p>
          Map data © OpenStreetMap contributors, under{' '}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
          >
            OpenStreetMap terms
          </a>
          . Leaflet’s on-map credit remains visible. Public tiles are used on
          demand without prefetching or offline tile downloads. Before
          larger-scale use, review capacity and the{' '}
          <a
            href="https://operations.osmfoundation.org/policies/tiles/"
            target="_blank"
            rel="noreferrer"
          >
            tile usage policy
          </a>
          .
        </p>
        <p>
          Government and nonprofit factual sources, per-record provenance and
          the required Baltimore County notice are on{' '}
          <Link href="/FreshRouteMD/data-sources">Data Sources & Methodology</Link>. Optional
          address lookup uses the U.S. Census Bureau’s documented geocoder. Its
          estimated coordinates do not establish property boundaries or service
          eligibility.
        </p>
      </section>
      <section>
        <h2>Branding and fonts</h2>
        <p>
          FreshRoute MD is the project’s working name. The route-style header
          icon comes from Lucide. The small favicon was AI-assisted vector
          artwork created for the MVP. No congressional, CAC, USDA,
          Maryland-government or nonprofit logos or seals are used. The app uses
          system Georgia serif and Segoe UI/sans-serif fonts; no remote font
          service or downloaded font file is used.
        </p>
        <p>
          A web-name check is not a trademark clearance search. The student team
          must review possible conflicts before adopting or registering the
          name. No registered-trademark symbol or claim of exclusive rights is
          made.
        </p>
      </section>
      <section>
        <h2>Original work and AI assistance</h2>
        <p>
          Codex assisted substantially with implementation, design, data
          tooling, tests and documentation in this task. A starter scaffold
          supplies framework and UI components. Student technical contributions
          have not been established here and must be documented truthfully by
          the team. The copyright notice covers only copyrightable
          contributions; it does not claim ownership of public facts,
          third-party assets or any material that is not copyrightable.
        </p>
        <p>
          The project has not chosen an overall open-source license for original
          code. Students and the responsible adult must decide that after
          reviewing ownership and contest requirements. Third-party licenses
          continue to apply regardless.
        </p>
      </section>
    </InfoPage>
  );
}
