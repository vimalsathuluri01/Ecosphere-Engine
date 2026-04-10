'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';

export const ToxicityMatrix = memo(function ToxicityMatrix({ data }: { data: any[] }) {
    const products = data.map(d => d.product);
    const materials = Object.keys(data[0]).filter(k => k !== 'product');

    return (
        <div className="bg-white border border-stone-200 p-12 rounded-[2.5rem] shadow-sm flex flex-col h-full">
            <div className="mb-8">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-2">Process Safety View</h3>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Chemical Hazard Map</h2>
                <p className="text-[10px] text-stone-400 font-mono mt-4 uppercase tracking-widest leading-relaxed">
                    Color represents the risk (%) of toxic chemicals used to make these products.
                </p>
            </div>

            <div className="flex-1 overflow-x-auto custom-scrollbar pt-8">
                <div className="min-w-[400px]">
                    <div className="grid grid-cols-[120px_repeat(auto-fill,minmax(40px,1fr))] gap-2 mb-4">
                        <div />
                        {materials.map(m => (
                            <div key={m} className="text-[8px] font-bold text-stone-400 uppercase tracking-widest text-center transform -rotate-45 h-12 flex items-end justify-center">
                                {m}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        {data.map((row, i) => (
                            <div key={row.product} className="grid grid-cols-[120px_repeat(auto-fill,minmax(40px,1fr))] gap-2 items-center">
                                <div className="text-[9px] font-black text-stone-700 uppercase tracking-tighter truncate pr-4">
                                    {row.product}
                                </div>
                                {materials.map(m => {
                                    const val = row[m];
                                    return (
                                        <div 
                                            key={`${row.product}-${m}`}
                                            className={cn(
                                                "h-10 rounded-lg flex items-center justify-center text-[8px] font-mono font-bold transition-all hover:scale-110 cursor-help",
                                                val === 0 ? "bg-stone-50 text-stone-300" : 
                                                val < 25 ? "bg-amber-50 text-amber-500" :
                                                val < 60 ? "bg-amber-100 text-amber-700" :
                                                "bg-rose-500 text-white"
                                            )}
                                            style={{ opacity: val === 0 ? 0.3 : 1 }}
                                            title={`${row.product} + ${m}: ${val}% Risk`}
                                        >
                                            {val > 0 && `${val}`}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-12 pt-6 border-t border-stone-100 flex justify-between items-center text-[8px] font-mono text-stone-400 uppercase tracking-widest">
                <span>0% Probability</span>
                <div className="flex gap-1 h-2 w-32 px-4">
                    <div className="flex-1 bg-stone-100 rounded-full" />
                    <div className="flex-1 bg-amber-200 rounded-full" />
                    <div className="flex-1 bg-rose-500 rounded-full" />
                </div>
                <span>100% Probability</span>
            </div>
        </div>
    );
});
