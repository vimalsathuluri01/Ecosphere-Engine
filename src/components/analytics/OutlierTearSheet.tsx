'use client';

import { memo } from 'react';
import { ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';

interface Outlier {
    company: string;
    category: string;
    score: number;
    deviation: number;
}

interface Props {
    vanguard: Outlier[];
    systemicRisks: Outlier[];
}

export const OutlierTearSheet = memo(function OutlierTearSheet({ vanguard, systemicRisks }: Props) {
    
    const OutlierCard = ({ item, type }: { item: Outlier, type: 'vanguard' | 'risk' }) => (
        <div className="group bg-white p-6 rounded-3xl border border-stone-100 hover:border-stone-300 transition-all duration-500 shadow-sm hover:shadow-xl">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="text-lg font-black uppercase tracking-tight text-stone-900 group-hover:text-black transition-colors">
                        {item.company}
                    </h4>
                    <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">
                        ({item.category}) • Impact DNA
                    </p>
                </div>
                {type === 'vanguard' ? (
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                        <ArrowDownRight size={20} strokeWidth={3} />
                    </div>
                ) : (
                    <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                        <ArrowUpRight size={20} strokeWidth={3} />
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-stone-500">
                        Systemic Deviation
                    </span>
                    <span className={`text-xl font-black ${type === 'vanguard' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {item.deviation > 0 ? `+${item.deviation}` : item.deviation}%
                    </span>
                </div>

                {/* BULLET CHART */}
                <div className="relative h-3 w-full bg-stone-100 rounded-full overflow-hidden">
                    {/* Median Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-stone-300 z-10"></div>
                    
                    {/* Deviation Bar */}
                    <div 
                        className={`absolute top-0 bottom-0 transition-all duration-1000 ease-out ${type === 'vanguard' ? 'bg-emerald-400 right-1/2 rounded-l-full' : 'bg-red-400 left-1/2 rounded-r-full'}`}
                        style={{ 
                            width: `${Math.min(Math.abs(item.deviation), 50)}%`,
                        }}
                    ></div>
                </div>

                <p className="text-base leading-relaxed text-stone-600 font-serif italic">
                    {type === 'vanguard' 
                        ? `Operating at ${Math.abs(item.deviation)}% higher efficiency than the current industry median for ${item.category}.`
                        : `Resource consumption is approximately ${Math.round(1 + item.deviation/100)}x the planetary boundary threshold for this material class.`
                }
                </p>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-12 gap-12">
            {/* THE VANGUARD */}
            <div className="col-span-12 lg:col-span-6 space-y-8">
                <div className="flex items-center gap-4 border-b border-stone-200 pb-6">
                    <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-200">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-stone-900">The Vanguard</h3>
                        <p className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase">
                            Empirical proof that sustainable manufacturing is possible
                        </p>
                    </div>
                </div>
                <div className="grid gap-6">
                    {vanguard.map((v, i) => (
                        <OutlierCard key={i} item={v} type="vanguard" />
                    ))}
                </div>
            </div>

            {/* SYSTEMIC RISKS */}
            <div className="col-span-12 lg:col-span-6 space-y-8">
                <div className="flex items-center gap-4 border-b border-stone-200 pb-6">
                    <div className="p-4 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-200">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-stone-900">Systemic Risks</h3>
                        <p className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase">
                            Immediate priority targets for policy & supply chain intervention
                        </p>
                    </div>
                </div>
                <div className="grid gap-6">
                    {systemicRisks.map((r, i) => (
                        <OutlierCard key={i} item={r} type="risk" />
                    ))}
                </div>
            </div>
        </div>
    );
});
