'use client';

import { BrandData } from '@/lib/methodology';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, Cell, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload, top3Names, bottom3Names }: any) => {
    if (active && payload && payload.length) {
        const val = payload[0].value;
        const name = payload[0].payload.name;
        const isTop = top3Names.has(name);
        const isBottom = bottom3Names.has(name);
        return (
            <div className="bg-white border border-stone-100 p-4 rounded-xl shadow-2xl text-stone-800 font-sans z-50">
                <div className="font-black tracking-tight text-lg mb-2">{name}</div>
                <div className="flex justify-between items-center gap-4 text-[10px] font-mono font-bold tracking-widest uppercase">
                    <span className="text-stone-400">Carbon Intensity</span>
                    <span className="text-stone-800 text-right">{val.toFixed(2)} MT/$M</span>
                </div>
                {isTop && <div className="text-emerald-400 text-[10px] font-mono font-bold uppercase mt-2">Top 3 Most Efficient</div>}
                {isBottom && <div className="text-rose-400 text-[10px] font-mono font-bold uppercase mt-2">Bottom 3 Least Efficient</div>}
            </div>
        );
    }
    return null;
};

export function EfficiencyRankingChart({ brands, averages }: { brands: BrandData[], averages: any }) {

    const meanCarbon = averages.Carbon_Intensity_MT_per_USD_Million;

    // Lowest Carbon Intensity is BEST, so we sort ascending.
    // In a vertical bar chart, the first item is at the bottom unless reversed, but usually we just want a sorted list.
    const data = [...brands].map(b => ({
        name: b.Brand_Name,
        carbon: b.Carbon_Intensity_MT_per_USD_Million
    })).sort((a, b) => a.carbon - b.carbon);

    const top3Names = new Set(data.slice(0, 3).map(d => d.name));
    const bottom3Names = new Set(data.slice(-3).map(d => d.name));



    return (
        <section className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
                <h2 className="text-3xl font-black tracking-tighter text-stone-800">3. Industry Efficiency Ranking</h2>
                <p className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase mt-2">
                    Absolute Carbon Intensity (MT / $M Revenue) mapped against systemic average.
                </p>
            </div>

            <div className="h-[800px] w-full bg-white border border-stone-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                        barSize={12}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f5f5f4" />
                        <XAxis
                            type="number"
                            tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={120}
                            tick={{ fontSize: 10, fill: '#0f172a', fontWeight: 'bold' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={(props) => <CustomTooltip {...props} top3Names={top3Names} bottom3Names={bottom3Names} />} cursor={{ fill: '#f1f5f9' }} />

                        <ReferenceLine
                            x={meanCarbon}
                            stroke="#0f172a"
                            strokeDasharray="3 3"
                            label={{ position: 'top', value: `Industry Avg (${meanCarbon.toFixed(1)} MT)`, fill: '#0f172a', fontSize: 10, fontFamily: 'monospace' }}
                        />

                        <Bar dataKey="carbon" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                            {data.map((entry, index) => {
                                let color = '#94a3b8'; // Slate 400 default
                                if (top3Names.has(entry.name)) color = '#10b981'; // Emerald
                                if (bottom3Names.has(entry.name)) color = '#f43f5e'; // Rose
                                return <Cell key={`cell-${index}`} fill={color} />;
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
