import { getBrandData } from '@/lib/data-parser';
import { AnalyticsV2Client } from './client';

export const dynamic = 'force-dynamic';

export default async function AnalyticsV2Page() {
    return <AnalyticsV2Client />;
}
