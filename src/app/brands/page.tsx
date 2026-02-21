import { getBrandData } from '@/lib/data-parser';
import { AnalyticsClient } from './client';

export const dynamic = 'force-dynamic'; // since we are reading a local file, Next.js needs to know

export default async function Page() {
    // The previous implementation was overridden to turn the main /brands page into the Analytics Dashboard
    const brands = await getBrandData();
    return <AnalyticsClient brands={brands} />;
}
