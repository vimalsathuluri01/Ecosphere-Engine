'use client';

import { BrandData, getMedians } from '@/lib/methodology';
import { BrandCard } from '@/components/brand-analytics/brand-card';
import Link from 'next/link';
import { slugify, cn } from '@/lib/utils';
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Check, ArrowRight, X } from 'lucide-react';

export function AnalyticsClient({ brands }: { brands: BrandData[] }) {
    const medians = useMemo(() => getMedians(brands), [brands]);

    // Function to get a diverse sample (shuffled)
    const getDiverseSample = useCallback(() => {
        return [...brands].sort(() => Math.random() - 0.5);
    }, [brands]);

    const [shuffledBrands, setShuffledBrands] = useState(() => getDiverseSample());
    const [visibleCount, setVisibleCount] = useState(24);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const router = useRouter();

    const toggleBrand = useCallback((brandName: string) => {
        setSelectedBrands(prev => {
            if (prev.includes(brandName)) {
                return prev.filter(name => name !== brandName);
            }
            if (prev.length < 4) {
                return [...prev, brandName];
            }
            return prev;
        });
    }, []);

    const clearSelection = () => setSelectedBrands([]);

    const navigateToCompare = () => {
        if (selectedBrands.length >= 2) {
            const params = new URLSearchParams();
            params.set('brands', selectedBrands.join(','));
            router.push(`/compare?${params.toString()}`);
        }
    };

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
                            <div key={b.Brand_Name} className="relative group">
                                <Link href={`/brands/${slugify(b.Brand_Name)}`}>
                                    <BrandCard 
                                        brand={b} 
                                        medians={medians} 
                                        isSelected={selectedBrands.includes(b.Brand_Name)}
                                    />
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggleBrand(b.Brand_Name);
                                    }}
                                    className={cn(
                                        "absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all z-20 shadow-lg border-2",
                                        selectedBrands.includes(b.Brand_Name)
                                            ? "bg-emerald-500 border-emerald-400 text-white scale-110"
                                            : "bg-white/80 backdrop-blur-sm border-stone-200 text-stone-400 hover:scale-110 hover:border-stone-400 group-hover:opacity-100 opacity-0"
                                    )}
                                >
                                    {selectedBrands.includes(b.Brand_Name) ? <Check size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
                                </button>
                            </div>
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

                {/* STICKY COMPARISON BAR */}
                {selectedBrands.length > 0 && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[800px]">
                        <div className="bg-stone-900 rounded-[2rem] p-4 shadow-2xl border border-white/10 flex items-center justify-between gap-6 backdrop-blur-md bg-opacity-95">
                            <div className="flex items-center gap-4 pl-4">
                                <div className="flex -space-x-3">
                                    {selectedBrands.map((name, i) => (
                                        <div key={name} className="w-10 h-10 rounded-full bg-white border-2 border-stone-900 flex items-center justify-center text-stone-900 font-black text-xs shadow-lg" style={{ zIndex: 10 - i }}>
                                            {name.charAt(0)}
                                        </div>
                                    ))}
                                    {Array.from({ length: 4 - selectedBrands.length }).map((_, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-dashed border-stone-700 bg-stone-800/50 flex items-center justify-center" />
                                    ))}
                                </div>
                                <div>
                                    <div className="text-white text-sm font-black uppercase tracking-tighter">
                                        {selectedBrands.length} / 4 Selected
                                    </div>
                                    <button 
                                        onClick={clearSelection}
                                        className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1"
                                    >
                                        <X size={10} /> Clear Audit
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={navigateToCompare}
                                disabled={selectedBrands.length < 2}
                                className={cn(
                                    "px-8 h-14 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all",
                                    selectedBrands.length >= 2
                                        ? "bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 active:scale-95"
                                        : "bg-stone-800 text-stone-500 cursor-not-allowed"
                                )}
                            >
                                Compare Metrics
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
