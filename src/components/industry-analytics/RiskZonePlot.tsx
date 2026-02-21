'use client';

import { BrandData } from '@/lib/methodology';
import { computePercentiles } from '@/lib/analytics-utils';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ReferenceArea, ReferenceLine, Cell } from 'recharts';

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white border border-stone-100 p-4 rounded-xl shadow-2xl text-stone-800 font-sans max-w-xs z-50">
                <div className="font-black tracking-tight text-lg mb-2">{data.id}</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase">
                    <div>Carbon Rate</div><div className="text-stone-800 text-right">{data.x.toFixed(1)} MT</div>
                    <div>Penalty Drag</div><div className="text-stone-800 text-right">-{data.y.toFixed(1)}%</div>
                    <div>Sust. Score</div><div className="text-stone-800 text-right">{data.score}/100</div>
                </div>
            </div>
        );
    }
    return null;
};

export function RiskZonePlot({ brands }: { brands: BrandData[] }) {

    // Calculate the thresholds
    const metrics: (keyof BrandData)[] = ['Carbon_Intensity_MT_per_USD_Million'];
    const p50 = computePercentiles(brands, metrics, 0.50)['Carbon_Intensity_MT_per_USD_Million'];
    const p75 = computePercentiles(brands, metrics, 0.75)['Carbon_Intensity_MT_per_USD_Million'];
    const maxVal = Math.max(...brands.map(b => b.Carbon_Intensity_MT_per_USD_Million)) * 1.1;

    const data = brands.map(b => ({
        id: b.Brand_Name,
        x: b.Carbon_Intensity_MT_per_USD_Million,
        y: b.finalPenalty! * 100, // Show penalty drag percentage on Y axis
        z: b.Revenue_USD_Million,
        score: b.finalScore
    }));


    return (
        <section className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
                <h2 className="text-3xl font-black tracking-tighter text-stone-800">7. Intensity Risk Zones</h2>
                <p className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase mt-2">
                    Explicit mapping of the logistic penalty function (Y) against Carbon Intensity boundaries (X).
                </p>
            </div>

            <div className="h-[500px] w-full bg-white border border-stone-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                        <XAxis
                            type="number"
                            dataKey="x"
                            name="Carbon Intensity"
                            domain={[0, maxVal]}
                            tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="Penalty Drag %"
                            domain={[0, 100]}
                            tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <ZAxis type="number" dataKey="z" range={[50, 400]} />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }} />

                        {/* Safe Zone (Green) */}
                        <ReferenceArea x1={0} x2={p50} fill="#10b981" fillOpacity={0.05} />
                        {/* Caution Zone (Yellow) */}
                        <ReferenceArea x1={p50} x2={p75} fill="#f59e0b" fillOpacity={0.05} />
                        {/* Critical Zone (Red) */}
                        <ReferenceArea x1={p75} x2={maxVal} fill="#f43f5e" fillOpacity={0.05} />

                        {/* Exact Threshold Marker Lines */}
                        <ReferenceLine x={p50} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'top', value: 'Safe Limit (Median)', fill: '#10b981', fontSize: 10, fontFamily: 'monospace' }} />
                        <ReferenceLine x={p75} stroke="#f43f5e" strokeDasharray="3 3" label={{ position: 'top', value: 'Critical Limit (75th)', fill: '#f43f5e', fontSize: 10, fontFamily: 'monospace' }} />

                        <Scatter name="Brands" data={data}>
                            {data.map((entry, index) => {
                                let color = '#94a3b8';
                                if (entry.x <= p50) color = '#10b981';
                                else if (entry.x > p50 && entry.x <= p75) color = '#f59e0b';
                                else color = '#f43f5e';
                                return <Cell key={`cell-${index}`} fill={color} opacity={0.8} />;
                            })}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
