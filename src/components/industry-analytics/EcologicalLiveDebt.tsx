'use client';

import { useEffect, useState, useRef } from 'react';
import { BrandData } from '@/lib/methodology';

export function EcologicalLiveDebt({ brands }: { brands: BrandData[] }) {
    const totalCarbonAnnual = brands.reduce((acc, b) => acc + (Number(b.Carbon_Footprint_MT) || 0), 0);
    const totalWasteAnnual = brands.reduce((acc, b) => acc + (Number(b.Waste_Production_KG) || 0), 0);

    // Compute increments per millisecond
    const msInYear = 365 * 24 * 60 * 60 * 1000;
    const carbonPerMs = totalCarbonAnnual / msInYear;
    const wastePerMs = totalWasteAnnual / msInYear;

    const [carbonCounter, setCarbonCounter] = useState(0);
    const [wasteCounter, setWasteCounter] = useState(0);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        let animationFrameId: number;

        const tick = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const elapsed = timestamp - startTimeRef.current; // Elapsed milliseconds since mounting

            setCarbonCounter(elapsed * carbonPerMs);
            setWasteCounter(elapsed * wastePerMs);

            animationFrameId = requestAnimationFrame(tick);
        };

        animationFrameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animationFrameId);
    }, [carbonPerMs, wastePerMs]);

    return (
        <section className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
                <h2 className="text-3xl font-black tracking-tighter text-stone-800">10. Ecological Debt Live Ticker</h2>
                <p className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase mt-2">
                    Real-time accumulation of absolute ecological payload relative to the session duration.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-stone-100 rounded-[2rem] p-8 md:p-12 text-center shadow-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-rose-500/5 animate-pulse" />
                    <h3 className="text-[10px] font-mono font-bold tracking-widest uppercase text-stone-400 mb-6">Carbon Debt (MT) Since Page Load</h3>
                    <div className="text-6xl md:text-8xl font-black tracking-tighter text-stone-800 tabular-nums">
                        {carbonCounter.toFixed(6)}
                    </div>
                    <div className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase mt-6">
                        + {(carbonPerMs * 1000).toFixed(4)} MT / Sec
                    </div>
                </div>

                <div className="bg-white border border-stone-100 rounded-[2rem] p-8 md:p-12 text-center shadow-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-stone-500/5 animate-pulse" />
                    <h3 className="text-[10px] font-mono font-bold tracking-widest uppercase text-stone-400 mb-6">Waste Mass (KG) Since Page Load</h3>
                    <div className="text-6xl md:text-8xl font-black tracking-tighter text-stone-800 tabular-nums">
                        {wasteCounter.toFixed(2)}
                    </div>
                    <div className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase mt-6">
                        + {(wastePerMs * 1000).toFixed(2)} KG / Sec
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-between text-[10px] font-mono font-bold tracking-widest uppercase text-stone-400 pt-8 border-t border-stone-200">
                <span>Total Sample: {brands.length} Entities</span>
                <span>Annual Load: {totalCarbonAnnual.toFixed(0)}MT C / {(totalWasteAnnual / 1000).toFixed(0)}MT W</span>
            </div>
        </section>
    );
}
