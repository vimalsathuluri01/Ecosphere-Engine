'use client';

import { BrandData } from '@/lib/methodology';
import { computePercentiles } from '@/lib/analytics-utils';
import { cn } from '@/lib/utils';

export function PlanetaryBoundaryHeatmap({ brands }: { brands: BrandData[] }) {

    const metrics: (keyof BrandData)[] = [
        'Carbon_Intensity_MT_per_USD_Million',
        'Water_Intensity_L_per_USD_Million',
        'Waste_Intensity_KG_per_USD_Million'
    ];

    const p75 = computePercentiles(brands, metrics, 0.75);
    const p50 = computePercentiles(brands, metrics, 0.50);

    // Score brands based on their cumulative intensity relative to bounds to sort them
    // Higher score = Worse (more red)
    const scoredBrands = brands.map(b => {
        let score = 0;
        metrics.forEach(m => {
            const val = b[m] as number;
            if (val >= p75[m]) score += 2; // Red
            else if (val <= p50[m]) score += 0; // Green
            else score += 1; // Neutral
        });
        return { ...b, heatScore: score };
    }).sort((a, b) => b.heatScore - a.heatScore);

    const getHeatColor = (val: number, key: string) => {
        if (val >= p75[key]) return 'bg-rose-500 text-stone-800 border-rose-600';
        if (val <= p50[key]) return 'bg-emerald-500 text-stone-800 border-emerald-600';
        return 'bg-amber-100 text-amber-900 border-amber-200';
    };

    const formatMetric = (key: string, val: number) => {
        if (key.includes('Water')) return `${(val / 1000).toFixed(1)}k L`;
        return `${val.toFixed(1)} ${key.includes('Waste') ? 'KG' : 'MT'}`;
    };

    return (
        <section className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
                <h2 className="text-3xl font-black tracking-tighter text-stone-800">2. Planetary Boundary Heatmap</h2>
                <p className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase mt-2">
                    Categorical Threshold Violations (Red &gt; 75th Pct | Green &lt; Median)
                </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-[2rem] p-6 md:p-8 overflow-hidden">
                <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b border-stone-100">
                    <div className="text-[10px] font-bold tracking-widest text-stone-400 uppercase font-mono">Entity</div>
                    <div className="text-[10px] font-bold tracking-widest text-stone-400 uppercase font-mono text-center">Carbon</div>
                    <div className="text-[10px] font-bold tracking-widest text-stone-400 uppercase font-mono text-center">Water</div>
                    <div className="text-[10px] font-bold tracking-widest text-stone-400 uppercase font-mono text-center">Waste</div>
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {scoredBrands.map(b => (
                        <div key={b.Brand_Name} className="grid grid-cols-4 gap-4 items-center p-2 hover:bg-slate-50 rounded-xl transition-colors">
                            <div className="font-bold text-sm tracking-tight text-stone-800 truncate pr-4">
                                {b.Brand_Name}
                            </div>
                            {metrics.map(m => {
                                const val = b[m] as number;
                                return (
                                    <div
                                        key={m}
                                        className={cn(
                                            "h-10 rounded-lg border flex items-center justify-center text-[10px] font-mono font-bold tracking-widest transition-all",
                                            getHeatColor(val, m)
                                        )}
                                    >
                                        {formatMetric(m, val)}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
