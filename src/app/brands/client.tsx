'use client';

import { BrandData, getMedians } from '@/lib/methodology';
import { BrandCard } from '@/components/brand-analytics/brand-card';
import Link from 'next/link';
import { slugify } from '@/lib/utils';

export function AnalyticsClient({ brands }: { brands: BrandData[] }) {
    const medians = getMedians(brands);

    return (
        <section
            className="bg-[#FAFAFA] min-h-screen px-4 py-12 md:px-8 lg:px-12 xl:px-16 font-sans"
            aria-label="Brand Catalog Grid"
        >
            <div className="max-w-[1600px] mx-auto pt-20">

                {/* Header exact match to Image 1 */}
                <header className="mb-12 flex flex-col md:flex-row justify-between md:items-start gap-6">
                    <div>
                        <h1 className="font-sans text-4xl md:text-5xl font-black text-[#1C1F26] tracking-tight uppercase">
                            ECOSPHERE ANALYTICS
                        </h1>
                        <p className="font-mono text-[9px] md:text-[10px] font-bold text-stone-500 tracking-[0.2em] uppercase mt-2">
                            IEEE METHODOLOGY | EMPIRICAL LOGISTICS FUNCTION | AHP HYBRID WEIGHTING
                        </p>
                    </div>

                    <div className="bg-white border-2 border-[#1C1F26]/10 px-5 py-2.5 rounded-full w-fit">
                        <span className="font-mono text-[10px] uppercase font-bold text-stone-600 tracking-widest block transform translate-y-[1px]">
                            ANALYZING {brands.length} ENTITIES
                        </span>
                    </div>
                </header>

                <main>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
                        {brands.map((b) => (
                            <Link key={b.Brand_Name} href={`/brands/${slugify(b.Brand_Name)}`}>
                                <BrandCard brand={b} medians={medians} />
                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </section>
    );
}
