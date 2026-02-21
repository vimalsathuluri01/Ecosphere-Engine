'use client';

import { BrandData } from '@/lib/methodology';
import { cn } from '@/lib/utils';

export function CircularityCluster({ brands }: { brands: BrandData[] }) {

    const sorted = [...brands].sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0));

    const top3 = sorted.slice(0, 3);
    const bottom3 = sorted.slice(-3);
    const targetBrands = [...top3, ...bottom3];

    const renderMetricBar = (label: string, value: number, isTop: boolean) => (
        <div key={label} className="flex items-center gap-3">
            <div className="w-24 text-[9px] font-bold text-stone-500 uppercase tracking-widest text-right shrink-0">{label}</div>
            <div className="flex-1 h-2.5 bg-stone-100 rounded-r-md overflow-hidden flex">
                <div
                    className={cn("h-full transition-all duration-1000", isTop ? "bg-emerald-400" : "bg-rose-400")}
                    style={{ width: `${value}%` }}
                />
            </div>
            <div className="w-8 flex justify-end text-[10px] font-mono font-black text-stone-700">{value.toFixed(0)}</div>
        </div>
    );

    const renderBrandRow = (brand: BrandData, index: number) => {
        const isTop = index < 3;

        return (
            <div key={brand.Brand_Name} className="p-5 bg-white border border-stone-100 rounded-2xl flex flex-col justify-between hover:border-stone-200 transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h4 className="font-black text-stone-900 text-sm tracking-tighter uppercase">{brand.Brand_Name}</h4>
                        <p className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase mt-0.5">
                            Rank #{brand.rank}
                        </p>
                    </div>
                    <div className={cn("px-2 py-1 rounded text-lg font-black font-mono border", isTop ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100")}>
                        {brand.finalScore?.toFixed(0)}
                    </div>
                </div>

                <div className="space-y-4">
                    {renderMetricBar('PR Score', brand.Transparency_Score_2024, isTop)}
                    {renderMetricBar('Renewables', brand.Renewable_Energy_Ratio, isTop)}
                    {renderMetricBar('Clean Mat.', brand.Sustainable_Material_Percent, isTop)}
                    {renderMetricBar('Engagement', brand.Consumer_Engagement_Score, isTop)}
                </div>
            </div>
        );
    };

    return (
        <section className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
                <h2 className="text-3xl font-black tracking-tighter text-stone-800">9. Systemic Imprint Matrix</h2>
                <p className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase mt-2">
                    Multi-vector footprint mapping scaling Top 3 vs Bottom 3 ranked entities strictly on identical 0-100 axes.
                </p>
            </div>

            <div className="w-full bg-white border border-stone-100 rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top 3 Column */}
                    <div className="space-y-4">
                        <div className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4">The Vanguard (Top 3)</div>
                        {top3.map((brand, index) => renderBrandRow(brand, index))}
                    </div>

                    {/* Bottom 3 Column */}
                    <div className="space-y-4">
                        <div className="text-xs font-black text-rose-600 uppercase tracking-widest mb-4">The Deficit (Bottom 3)</div>
                        {bottom3.map((brand, index) => renderBrandRow(brand, index + 3))}
                    </div>
                </div>
            </div>
        </section>
    );
}

