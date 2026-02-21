'use client';

import { BrandData } from '@/lib/methodology';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-stone-100 p-3 shadow-lg rounded-xl z-50">
                <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">{payload[0].payload.metric}</div>
                <div className="text-xs font-mono font-bold text-stone-700" style={{ color: payload[0].color }}>
                    Score: {payload[0].value.toFixed(1)} / 100
                </div>
            </div>
        );
    }
    return null;
};

export function CategoryPerformanceRadars({ brands }: { brands: BrandData[] }) {

    const categories = ['Luxury', 'Fast Fashion', 'Sportswear', 'Premium'];

    const data = useMemo(() => {
        const maxCarbon = Math.max(...brands.map(b => b.Carbon_Intensity_MT_per_USD_Million));

        return categories.map(cat => {
            const catBrands = brands.filter(b => b.Category.toLowerCase() === cat.toLowerCase());
            if (!catBrands.length) return null;

            const avg = (key: keyof BrandData) =>
                catBrands.reduce((sum, b) => sum + Number(b[key]), 0) / catBrands.length;

            const rawCarbon = avg('Carbon_Intensity_MT_per_USD_Million');
            const carbonScore = Math.max(0, 100 - (rawCarbon / maxCarbon) * 100);

            return {
                category: cat,
                metrics: [
                    { metric: 'Transparency', value: avg('Transparency_Score_2024') },
                    { metric: 'Materials', value: avg('Sustainable_Material_Percent') },
                    { metric: 'Renewables', value: avg('Renewable_Energy_Ratio') },
                    { metric: 'Emmissions', value: carbonScore }
                ]
            };
        }).filter(Boolean) as any[];

    }, [brands, categories]);

    const colors: Record<string, string> = {
        'Luxury': '#1c1917',     // stone-900
        'Fast Fashion': '#f43f5e', // rose-500
        'Sportswear': '#0ea5e9',   // sky-500
        'Premium': '#10b981'       // emerald-500
    };

    return (
        <section className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
                <h2 className="text-3xl font-black tracking-tighter text-stone-800">8. Category Archetypes</h2>
                <p className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase mt-2">
                    Systemic Averages across Business Models globally normalized (0-100 index).
                </p>
            </div>

            <div className="bg-white border border-stone-100 rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {data.map((catData) => (
                        <div key={catData.category} className="flex flex-col items-center">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6" style={{ color: colors[catData.category] }}>
                                {catData.category} Vector
                            </h3>
                            <div className="h-[250px] w-full max-w-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={catData.metrics}>
                                        <PolarGrid stroke="#f5f5f4" />
                                        <PolarAngleAxis
                                            dataKey="metric"
                                            tick={{ fill: '#78716c', fontSize: 10, fontWeight: 'bold' }}
                                        />
                                        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar
                                            name={catData.category}
                                            dataKey="value"
                                            stroke={colors[catData.category]}
                                            strokeWidth={2}
                                            fill={colors[catData.category]}
                                            fillOpacity={0.15}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section >
    );
}

