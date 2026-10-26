import Link from 'next/link';
import InfoPage from '@/components/info-page';
export const metadata = { title: 'Terms of Use · FreshRoute MD' };
export default function Terms() {
  return (
    <InfoPage
      title="Terms of Use"
      lead="A free informational resource—not a promise that food or a service is available."
    >
      <p>
        Updated October 23, 2026. Student-project draft; operator review
        required before public launch.
      </p>
      <section>
        <h2>Purpose and limitations</h2>
        <p>
          FreshRoute MD organizes food-access listings and source links. It does
          not distribute food, sell benefits, decide eligibility, book
          appointments or represent listed providers.
        </p>
        <p>
          Listings may be inaccurate, incomplete or outdated. Verify hours,
          eligibility, required documents, availability, addresses and services
          directly with providers before traveling. A recent import is not a
          provider confirmation; a source review is not an on-site inspection.
        </p>
        <p>
          FreshRoute does not guarantee food availability, current SNAP
          acceptance, prices, eligibility or a successful visit. Map pins and
          straight-line distances are approximate. The closest result may not be
          available or appropriate. SNAP retailers sell eligible items and are
          not necessarily pantries, affordable stores or free-food providers.
        </p>
      </section>
      <section>
        <h2>Immediate assistance</h2>
        <p>
          FreshRoute is not an emergency service and is not monitored for
          requests for help. For urgent food needs, check the{' '}
          <a
            href="https://mdfoodbank.org/find-food/"
            target="_blank"
            rel="noreferrer"
          >
            Maryland Food Bank directory
          </a>{' '}
          or{' '}
          <a href="https://211md.org/" target="_blank" rel="noreferrer">
            211 Maryland
          </a>{' '}
          for community referrals. For an immediate threat to life or safety,
          contact emergency services such as 911.
        </p>
      </section>
      <section>
        <h2>Independence, sources and external services</h2>
        <p>
          FreshRoute is an independent student project, not a government service
          or established nonprofit. It is not affiliated with or endorsed by
          government agencies, the Congressional App Challenge or listed
          organizations. Inclusion does not constitute endorsement. Provider
          names identify the resource only.
        </p>
        <p>
          Third-party websites, maps, geocoders and phone services have their
          own terms and privacy practices. Data permissions and required notices
          appear on <Link href="/FreshRouteMD/data-sources">Data Sources & Methodology</Link>
          ; software credits appear on{' '}
          <Link href="/FreshRouteMD/credits">Credits & licenses</Link>.
        </p>
      </section>
      <section>
        <h2>Respectful use</h2>
        <p>
          Use FreshRoute to find information. Do not misrepresent listings,
          imply official affiliation or interfere with the service. If reusing
          data or code, review each applicable license rather than assuming a
          single license covers everything. There are no FreshRoute
          subscriptions or payments.
        </p>
        <p>
          The app may change or be unavailable during student maintenance. These
          terms do not remove rights provided by applicable law and do not
          declare that the app is legally compliant.
        </p>
      </section>
      <section>
        <h2>Contact and updates</h2>
        <p className="owner-placeholder">
          A responsible operator and monitored project contact have not yet been
          supplied. FreshRoute has no working contact channel yet. For service
          availability, contact the listed provider.
        </p>
        <p>
          Changes will be posted here with a revised date. See the{' '}
          <Link href="/FreshRouteMD/privacy">Privacy Policy</Link> for data handling. This
          draft is not legal advice.
        </p>
      </section>
    </InfoPage>
  );
}
