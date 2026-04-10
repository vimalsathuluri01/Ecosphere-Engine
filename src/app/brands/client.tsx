'use client';

import { BrandData, getMedians } from '@/lib/methodology';
import { BrandCard } from '@/components/brand-analytics/brand-card';
import Link from 'next/link';
import { slugify } from '@/lib/utils';

import { useState, useCallback, useMemo } from 'react';

export function AnalyticsClient({ brands }: { brands: BrandData[] }) {
    const medians = useMemo(() => getMedians(brands), [brands]);

    // Function to get a diverse sample (shuffled)
    const getDiverseSample = useCallback(() => {
        return [...brands].sort(() => Math.random() - 0.5);
    }, [brands]);

    const [shuffledBrands, setShuffledBrands] = useState(() => getDiverseSample());
    const [visibleCount, setVisibleCount] = useState(24);

    const visibleBrands = shuffledBrands.slice(0, visibleCount);
    const hasMore = visibleCount < shuffledBrands.length;

    const loadMore = () => setVisibleCount(prev => prev + 24);
    const refreshDiscovery = () => {
        setShuffledBrands(getDiverseSample());
        setVisibleCount(24);
    };

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

                    <div className="flex flex-col items-end gap-3">
                        <div className="bg-white border-2 border-[#1C1F26]/10 px-5 py-2.5 rounded-full w-fit">
                            <span className="font-mono text-[10px] uppercase font-bold text-stone-600 tracking-widest block transform translate-y-[1px]">
                                ANALYZING {brands.length} ENTITIES
                            </span>
                        </div>
                        <button
                            onClick={refreshDiscovery}
                            className="bg-stone-900 text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-stone-800 transition-all active:scale-95 shadow-lg shadow-stone-900/10"
                        >
                            Shuffle Discovery
                        </button>
                    </div>
                </header>

                <main>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
                        {visibleBrands.map((b) => (
                            <Link key={b.Brand_Name} href={`/brands/${slugify(b.Brand_Name)}`}>
                                <BrandCard brand={b} medians={medians} />
                            </Link>
                        ))}
                    </div>

                    {hasMore && (
                        <div className="mt-16 flex justify-center">
                            <button
                                onClick={loadMore}
                                className="px-12 py-4 bg-[#1C1F26] text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10 active:scale-95"
                            >
                                LOAD NEXT 24 ENTITIES
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </section>
    );
}
