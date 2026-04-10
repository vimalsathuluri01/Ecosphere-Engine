import { memo } from 'react';

export const KPIRibbon = memo(function KPIRibbon({ kpis }: { kpis: { gini: number, top_10_share: number, median_efficiency: number } }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 border border-stone-200 divide-y md:divide-y-0 md:divide-x divide-stone-200 bg-white rounded-3xl overflow-hidden shadow-sm">
            <div className="p-12">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">System Imbalance</div>
                <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-black tracking-tighter">{Math.round(kpis.gini * 100)}</span>
                    <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest bg-stone-100 px-2 py-1 rounded">Score / 100</span>
                </div>
                <div className="mt-8 text-[10px] text-stone-500 font-serif leading-relaxed italic">
                    How unevenly the damage is spread. A high score means a few factories cause almost all the harm.
                </div>
            </div>
            
            <div className="p-12 border-x border-stone-100">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">Top 10% Cause</div>
                <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-black tracking-tighter">{kpis.top_10_share}%</span>
                    <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded select-none">of Damage</span>
                </div>
                <div className="mt-8 text-[10px] text-stone-500 font-serif leading-relaxed italic">
                    The percentage of the total industry footprint created by only the worst 2,000 factories.
                </div>
            </div>

            <div className="p-12">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">Typical Factory Score</div>
                <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-black tracking-tighter">{kpis.median_efficiency}</span>
                    <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest bg-stone-100 px-2 py-1 rounded">Score / 100</span>
                </div>
                <div className="mt-8 text-[10px] text-stone-500 font-serif leading-relaxed italic">
                    The average sustainability performance of a standard manufacturing unit in the database.
                </div>
            </div>
        </div>
    );
});
