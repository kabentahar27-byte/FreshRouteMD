import Link from 'next/link';
import InfoPage from '@/components/info-page';
export default function Page() {
  return (
    <InfoPage
      title="Provider inventory"
      lead="No provider stock feed is connected."
    >
      <p>
        Stock counts, donation requests and availability are unknown. A
        provider-authorized API or inventory integration is required before
        FreshRoute can publish and automatically update real stock. Local edits
        cannot verify inventory.
      </p>
      <Link className="primary" href="/FreshRouteMD/find-food">
        Find sourced food resources
      </Link>
    </InfoPage>
  );
}
