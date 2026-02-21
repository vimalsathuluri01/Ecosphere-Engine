'use client';

import { BrandData } from '@/lib/methodology';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-stone-100 p-4 rounded-xl shadow-2xl text-stone-800 font-sans min-w-[200px] z-50">
                <div className="font-black tracking-tight text-lg mb-2">{label}</div>
                <div className="flex flex-col gap-2 text-[10px] font-mono font-bold tracking-widest uppercase">
                    <div className="flex justify-between text-stone-400">
                        <span>Total Volume</span>
                        <span className="text-stone-800 text-right">{payload[0].payload.Total.toLocaleString()}M</span>
                    </div>
                    <div className="flex justify-between text-rose-400">
                        <span>Non-Sustainable</span>
                        <span className="text-stone-800 text-right">{payload[1].value.toLocaleString()}M</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                        <span>Sustainable</span>
                        <span className="text-stone-800 text-right">{payload[0].value.toLocaleString()}M</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export function OverproductionArea({ brands }: { brands: BrandData[] }) {

    // Aggregate Units by Category
    const categoryMap: Record<string, { sustainable: number, overproduction: number, total: number }> = {};

    brands.forEach(b => {
        const cat = b.Category || 'Unknown';
        if (!categoryMap[cat]) categoryMap[cat] = { sustainable: 0, overproduction: 0, total: 0 };

        const totalUnits = Number(b.Annual_Units_Million) || 0;
        const sustPct = Number(b.Sustainable_Material_Percent) || 0;

        const sustUnits = totalUnits * (sustPct / 100);
        const nonSustUnits = totalUnits - sustUnits;

        categoryMap[cat].total += totalUnits;
        categoryMap[cat].sustainable += sustUnits;
        categoryMap[cat].overproduction += nonSustUnits;
    });

    // Convert to array and sort by volume to make Area chart look fluid (largest to smallest)
    const data = Object.entries(categoryMap).map(([cat, vals]) => ({
        category: cat,
        Sustainable: Number(vals.sustainable.toFixed(1)),
        Overproduction: Number(vals.overproduction.toFixed(1)),
        Total: Number(vals.total.toFixed(1))
    })).sort((a, b) => b.Total - a.Total);



    return (
        <section className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
                <h2 className="text-3xl font-black tracking-tighter text-stone-800">6. The Scale of Overproduction</h2>
                <p className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase mt-2">
                    Total annual unit volume (Millions) explicitly partitioned by sustainable material verification.
                </p>
            </div>

            <div className="h-[500px] w-full bg-white border border-stone-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                        <XAxis
                            dataKey="category"
                            tick={{ fontSize: 10, fill: '#0f172a', fontWeight: 'bold' }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
                            axisLine={false}
                            tickLine={false}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '20px', fontFamily: 'monospace' }} />

                        <Area
                            type="monotone"
                            dataKey="Sustainable"
                            stackId="1"
                            stroke="#10b981"
                            fill="#34d399"
                            fillOpacity={0.8}
                            isAnimationActive={false}
                        />
                        <Area
                            type="monotone"
                            dataKey="Overproduction"
                            stackId="1"
                            stroke="#f43f5e"
                            fill="#fb7185"
                            fillOpacity={0.8}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
