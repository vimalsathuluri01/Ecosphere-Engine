import { getBrandData } from '@/lib/data-parser';
import { getMedians } from '@/lib/methodology';
import { slugify } from '@/lib/utils';
import { BrandAnalyticsDetails } from './client';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const allBrands = await getBrandData();
    const medians = getMedians(allBrands);

    const brand = allBrands.find(b => slugify(b.Brand_Name) === slug);

    if (!brand) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <h1 className="text-6xl font-black text-slate-200 mb-4 tracking-tighter">404</h1>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 uppercase tracking-wide">Brand Not Found</h2>
                    <p className="text-slate-500 mb-8 font-mono text-sm leading-relaxed">
                        The requested ESG analytical dossier could not be located in our index. It may be mistyped or unsupported.
                    </p>
                    <Link href="/brands" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-slate-900 text-white font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors shadow-lg">
                        Return to Index
                    </Link>
                </div>
            </div>
        );
    }

    return <BrandAnalyticsDetails brand={brand} allBrands={allBrands} md={medians} />;
}
