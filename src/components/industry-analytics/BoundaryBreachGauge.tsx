'use client';

import { BrandData } from '@/lib/methodology';
import { computePercentiles } from '@/lib/analytics-utils';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

const metrics = [
    { key: 'Carbon_Intensity_MT_per_USD_Million', label: 'Carbon Risk', unit: 'MT' },
    { key: 'Water_Intensity_L_per_USD_Million', label: 'Water Stress', unit: 'L', scale: 1000, displayUnit: 'k L' },
    { key: 'Waste_Intensity_KG_per_USD_Million', label: 'Waste Risk', unit: 'KG' }
] as const;

export function BoundaryBreachGauge({ brands }: { brands: BrandData[] }) {

    const stats = useMemo(() => {
        const res: Record<string, { p50: number, p75: number, max: number }> = {};
        metrics.forEach(m => {
            const vals = brands.map(b => Number(b[m.key])).sort((a, b) => a - b);
            res[m.key] = {
                p50: vals[Math.floor(vals.length * 0.50)],
                p75: vals[Math.floor(vals.length * 0.75)],
                max: vals[vals.length - 1] * 1.1 // Pad 10%
            };
        });
        return res;
    }, [brands]);

    // Score brands based on their cumulative intensity relative to bounds to sort them
    const scoredBrands = brands.map(b => {
        let score = 0;
        metrics.forEach(m => {
            const val = Number(b[m.key]);
            if (val >= stats[m.key].p75) score += 2;
            else if (val <= stats[m.key].p50) score += 0;
            else score += 1;
        });
        return { ...b, heatScore: score };
    }).sort((a, b) => b.heatScore - a.heatScore);

    const renderGauge = (val: number, metricKey: string, stat: any, mInfo: any) => {
        const pVal = Math.min((val / stat.max) * 100, 100);
        const p50Loc = (stat.p50 / stat.max) * 100;
        const p75Loc = (stat.p75 / stat.max) * 100;

        let statusColor = 'bg-slate-400';
        if (pVal >= p75Loc) statusColor = 'bg-rose-500';
        else if (pVal <= p50Loc) statusColor = 'bg-emerald-500';
        else statusColor = 'bg-amber-400';

        const displayVal = mInfo.scale ? (val / mInfo.scale).toFixed(1) : val.toFixed(1);
        const finalUnit = mInfo.displayUnit || mInfo.unit;

        return (
            <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between text-[9px] font-mono font-bold tracking-widest uppercase text-stone-500">
                    <span>{mInfo.label}</span>
                    <span className="text-stone-800">{displayVal} {finalUnit}</span>
                </div>
                <div className="relative h-2 bg-slate-100 rounded-full w-full overflow-hidden">
                    {/* Background Tracks */}
                    <div className="absolute left-0 top-0 bottom-0 bg-emerald-100" style={{ width: `${p50Loc}%` }} />
                    <div className="absolute top-0 bottom-0 bg-amber-100" style={{ left: `${p50Loc}%`, width: `${p75Loc - p50Loc}%` }} />
                    <div className="absolute top-0 bottom-0 bg-rose-100" style={{ left: `${p75Loc}%`, right: 0 }} />

                    {/* Actual Value Bar */}
                    <div
                        className={cn("absolute left-0 top-0 bottom-0 rounded-full transition-all duration-500", statusColor)}
                        style={{ width: `${pVal}%` }}
                    />
                </div>
            </div>
        );
    };

    return (
        <section className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
                <h2 className="text-3xl font-black tracking-tighter text-stone-800">2. Boundary Breach Gauge System</h2>
                <p className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase mt-2">
                    Systemic Risk Meters charting ecological debt against safe transition tracks (Green = Safe, Yellow = At Risk, Red = Overshoot).
                </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-[2rem] p-6 md:p-8 overflow-hidden">
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                    {scoredBrands.map(b => (
                        <div key={b.Brand_Name} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-stone-100">
                            <div className="font-black text-sm tracking-tight text-stone-800 truncate">
                                {b.Brand_Name}
                            </div>
                            {metrics.map(m => (
                                <div key={m.key} className="w-full">
                                    {renderGauge(Number(b[m.key]), m.key, stats[m.key], m)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
