'use client';

import { BrandData } from '@/lib/methodology';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

export function CategoryRidgePlot({ brands }: { brands: BrandData[] }) {

    // 1. Group by category and find absolute max water intensity
    const categories: Record<string, number[]> = {};
    let maxWater = 0;

    brands.forEach(b => {
        const cat = b.Category || 'Other';
        const val = b.Water_Intensity_L_per_USD_Million;
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(val);
        if (val > maxWater) maxWater = val;
    });

    // 2. Create discrete bins for the X-axis (e.g., 20 bins) to "Maintain real distribution" without synthetic KDE smoothing
    const binCount = 20;
    const binSize = maxWater / binCount;

    // 3. Generate Ridge Data per Category
    // We sort categories by their Median water intensity
    const getMedian = (arr: number[]) => {
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    const categoryStats = Object.keys(categories).map(cat => {
        const vals = categories[cat];
        const median = getMedian(vals);

        // Build histogram
        const bins = Array.from({ length: binCount + 1 }, (_, i) => ({
            x0: i * binSize, // Bin start
            x: (i + 0.5) * binSize, // Bin center for plotting
            count: 0
        }));

        vals.forEach(val => {
            const binIndex = Math.min(Math.floor(val / binSize), binCount);
            bins[binIndex].count += 1;
        });

        return {
            category: cat,
            median,
            data: bins,
            maxCount: Math.max(...bins.map(b => b.count))
        };
    }).sort((a, b) => b.median - a.median); // Highest median on top

    const colors = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

    return (
        <section className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
                <h2 className="text-3xl font-black tracking-tighter text-stone-800">8. Category Efficiency Ridge Plot</h2>
                <p className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase mt-2">
                    Water Intensity Distribution (Liters / $M Revenue) mapped natively per Category.
                </p>
            </div>

            <div className="w-full bg-white border border-stone-200 rounded-[2rem] p-6 md:p-8 overflow-hidden">
                <div className="relative pt-8 pb-12">
                    {categoryStats.map((stat, index) => (
                        <div
                            key={stat.category}
                            className="relative h-24"
                            style={{
                                marginTop: index === 0 ? 0 : '-40px', // Stagger overlapping overlapping AreaCharts
                                zIndex: categoryStats.length - index
                            }}
                        >
                            {/* Category Label */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 pr-4 text-right z-10">
                                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-stone-800 leading-tight block">
                                    {stat.category}
                                </span>
                            </div>

                            {/* Transparent Ridge Chart */}
                            <div className="absolute left-32 right-0 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={stat.data}
                                        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                                    >
                                        {/* Global X-Axis mapping shared domain */}
                                        <XAxis
                                            dataKey="x"
                                            type="number"
                                            domain={[0, maxWater]}
                                            hide={index < categoryStats.length - 1} // Only show axis on bottom-most chart
                                            tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={(val) => (val / 1000).toFixed(0) + 'k'}
                                        />
                                        {/* Scale Y axis strictly to its own max to normalize visual height */}
                                        <YAxis hide domain={[0, 'dataMax']} />
                                        <Tooltip
                                            cursor={{ stroke: '#cbd5e1', strokeDasharray: '3 3' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length && Number(payload[0].value) > 0) {
                                                    return (
                                                        <div className="bg-white text-stone-800 p-2 rounded text-[10px] font-mono">
                                                            {payload[0].value} brands @ {(Number(payload[0].payload.x) / 1000).toFixed(0)}k L
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />

                                        {/* Median Marker Line */}
                                        <ReferenceLine
                                            x={stat.median}
                                            stroke="#0f172a"
                                            strokeDasharray="3 3"
                                            label={{
                                                position: 'top',
                                                value: `Med: ${(stat.median / 1000).toFixed(0)}k`,
                                                fill: '#0f172a',
                                                fontSize: 9,
                                                fontFamily: 'monospace'
                                            }}
                                        />

                                        {/* The Ridge Curve - using monotone for slight natural flow without mutating base distribution drastically */}
                                        <Area
                                            type="monotone"
                                            dataKey="count"
                                            stroke={colors[index % colors.length]}
                                            fill={colors[index % colors.length]}
                                            fillOpacity={0.6}
                                            strokeWidth={2}
                                            isAnimationActive={false}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
