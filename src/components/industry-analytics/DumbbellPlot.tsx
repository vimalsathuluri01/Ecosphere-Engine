'use client';

import { BrandData } from '@/lib/methodology';
import { cn } from '@/lib/utils';

export function DumbbellPlot({ brands, averages }: { brands: BrandData[], averages: any }) {

    const meanCarbon = averages.Carbon_Intensity_MT_per_USD_Million;

    const data = brands.map(b => {
        const val = b.Carbon_Intensity_MT_per_USD_Million;
        const delta = val - meanCarbon;
        const absDelta = Math.abs(delta);
        return {
            name: b.Brand_Name,
            value: val,
            delta,
            absDelta
        };
    }).sort((a, b) => b.absDelta - a.absDelta);

    // Find absolute bounds for scaling the CSS grid proportionally
    const minVal = Math.min(...data.map(d => d.value), meanCarbon) * 0.9;
    const maxVal = Math.max(...data.map(d => d.value), meanCarbon) * 1.1;
    const range = maxVal - minVal;

    const getLeftPercent = (val: number) => ((val - minVal) / range) * 100;

    return (
        <section className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
                <h2 className="text-3xl font-black tracking-tighter text-stone-800">3. Intensity Delta (Dumbbell Plot)</h2>
                <p className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase mt-2">
                    Carbon Intensity Deviation vs Industry Mean ({meanCarbon.toFixed(1)} MT)
                </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-[2rem] p-6 md:p-8">

                {/* Axis legend */}
                <div className="flex justify-between text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase border-b border-stone-100 pb-2 mb-6">
                    <div className="w-1/4">Entity</div>
                    <div className="w-3/4 relative">
                        <span className="absolute left-0 -translate-x-1/2">{minVal.toFixed(0)}</span>
                        <span className="absolute left-1/2 -translate-x-1/2">Carbon Intensity (MT)</span>
                        <span className="absolute right-0 translate-x-1/2">{maxVal.toFixed(0)}</span>
                        {/* Mean Line marker */}
                        <div
                            className="absolute top-0 bottom-0 w-px bg-slate-300 border-l border-dashed border-slate-400 h-full"
                            style={{ left: `${getLeftPercent(meanCarbon)}%` }}
                        />
                    </div>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                    {data.map(d => {
                        const isWorse = d.value > meanCarbon;
                        const pMean = getLeftPercent(meanCarbon);
                        const pVal = getLeftPercent(d.value);

                        const leftEdge = Math.min(pMean, pVal);
                        const widthObj = Math.abs(pMean - pVal);

                        return (
                            <div key={d.name} className="flex items-center group">
                                <div className="w-1/4 pr-4">
                                    <div className="font-bold text-sm tracking-tight text-stone-800 truncate">{d.name}</div>
                                    <div className={cn("text-[10px] font-mono font-bold uppercase tracking-widest", isWorse ? "text-rose-500" : "text-emerald-500")}>
                                        {isWorse ? '+' : ''}{d.delta.toFixed(1)} MT
                                    </div>
                                </div>

                                <div className="w-3/4 relative h-8 flex items-center bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
                                    {/* Central Mean Reference Line spanning entire container */}
                                    <div
                                        className="absolute top-0 bottom-0 w-px bg-slate-300 border-l border-dashed border-slate-400 z-0"
                                        style={{ left: `${pMean}%` }}
                                    />

                                    {/* Connecting Line */}
                                    <div
                                        className="absolute h-1 bg-slate-300 z-10"
                                        style={{ left: `${leftEdge}%`, width: `${widthObj}%` }}
                                    />

                                    {/* Mean Dot */}
                                    <div
                                        className="absolute w-3 h-3 rounded-full bg-slate-400 border-2 border-white z-20 -translate-x-1.5"
                                        style={{ left: `${pMean}%` }}
                                    />

                                    {/* Value Dot */}
                                    <div
                                        className={cn(
                                            "absolute w-4 h-4 rounded-full border-2 border-white z-20 -translate-x-2 shadow-sm transition-transform group-hover:scale-125",
                                            isWorse ? "bg-rose-500" : "bg-emerald-500"
                                        )}
                                        style={{ left: `${pVal}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    ); //
}
