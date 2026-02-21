'use client';

import { BrandData } from '@/lib/methodology';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function ScoreDecomposition({ brands }: { brands: BrandData[] }) {

    // Transform brands into array for Recharts
    const data = brands.map(b => {
        const row: any = { name: b.Brand_Name, total: b.finalScore };
        if (b.contributions) {
            Object.entries(b.contributions).forEach(([key, val]) => {
                row[key] = val; // Already scaled to 100 in methodology
            });
        }
        return row;
    }).sort((a, b) => b.total - a.total); // Sorted by total exactly as requested

    const colors = {
        Carbon_Intensity_MT_per_USD_Million: '#0f172a',    // slate-900
        Water_Intensity_L_per_USD_Million: '#3b82f6',       // blue-500
        Waste_Intensity_KG_per_USD_Million: '#a8a29e',      // stone-400
        Sustainable_Material_Percent: '#10b981',           // emerald-500
        Renewable_Energy_Ratio: '#f59e0b',                 // amber-500
        Transparency_Score_2024: '#8b5cf6',                // violet-500
        Consumer_Engagement_Score: '#ec4899'               // pink-500
    };

    const formatName = (key: string) => {
        if (key.includes('Carbon')) return 'Carbon';
        if (key.includes('Water')) return 'Water';
        if (key.includes('Waste')) return 'Waste';
        if (key.includes('Sustainable')) return 'Sust. Material';
        if (key.includes('Renewable')) return 'Renewable Energy';
        if (key.includes('Transparency')) return 'Transparency';
        if (key.includes('Consumer')) return 'Engagement';
        return key;
    };

    return (
        <section className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
                <h2 className="text-3xl font-black tracking-tighter text-stone-800">4. Exact Score Decomposition</h2>
                <p className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase mt-2">
                    Si = Sum(Normalized Factor × Algorithmic Hybrid Weight) before logistic penalty
                </p>
            </div>

            <div className="h-[800px] w-full bg-white border border-stone-200 rounded-[2rem] p-6 md:p-8">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                        barSize={12}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#f5f5f4" />
                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fill: '#0f172a', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 'bold' }}
                            formatter={(value: number, name: string) => [value.toFixed(2), formatName(name)]}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '20px', fontFamily: 'monospace' }} formatter={(value) => formatName(value)} />

                        {Object.entries(colors).map(([key, color]) => (
                            <Bar key={key} dataKey={key} stackId="a" fill={color} isAnimationActive={false} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
