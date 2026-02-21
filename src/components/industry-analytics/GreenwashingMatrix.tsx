'use client';

import { BrandData } from '@/lib/methodology';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceArea } from 'recharts';

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white border border-stone-100 p-4 rounded-xl shadow-2xl text-stone-800 font-sans max-w-xs z-50 relative">
                <div className="font-black tracking-tight text-lg mb-2">{data.id}</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase">
                    <div>Transparency</div><div className="text-stone-800 text-right">{data.x}/100</div>
                    <div>Carbon Intensity</div><div className="text-stone-800 text-right">{data.y.toFixed(1)} MT</div>
                    <div>Revenue</div><div className="text-stone-800 text-right">${data.z.toLocaleString()}M</div>
                    <div>Sust. Score</div><div className="text-stone-800 text-right">{data.score}/100</div>
                </div>
            </div>
        );
    }
    return null;
};

const CustomDot = (props: any) => {
    const { cx, cy, payload, top5Names, bottom5Names } = props;
    const isTop5 = top5Names.has(payload.id);
    const isBottom5 = bottom5Names.has(payload.id);
    const shouldLabel = isTop5 || isBottom5;

    const r = props.r || 6;

    return (
        <g>
            <circle cx={cx} cy={cy} r={r} fill={payload.fillColor} opacity={0.7} className="hover:opacity-100 transition-opacity" />
            {shouldLabel && (
                <text
                    x={cx + r + 4}
                    y={cy}
                    dy={4}
                    fontSize={10}
                    fontFamily="monospace"
                    fill="#1c1917"
                    fontWeight="bold"
                    className="pointer-events-none"
                >
                    {payload.id}
                </text>
            )}
        </g>
    );
};

export function GreenwashingMatrix({ brands, averages }: { brands: BrandData[], averages: any }) {

    const sortedByScore = [...brands].sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0));
    const top5Names = new Set(sortedByScore.slice(0, 5).map(b => b.Brand_Name));
    const bottom5Names = new Set(sortedByScore.slice(-5).map(b => b.Brand_Name));

    const meanX = averages.Transparency_Score_2024;
    const meanY = averages.Carbon_Intensity_MT_per_USD_Million;
    const maxY = Math.ceil(Math.max(...brands.map(b => b.Carbon_Intensity_MT_per_USD_Million)) * 1.1);

    const getQuadrantColor = (x: number, y: number) => {
        if (x >= meanX && y <= meanY) return '#10b981';
        if (x >= meanX && y > meanY) return '#f59e0b';
        if (x < meanX && y > meanY) return '#f43f5e';
        return '#94a3b8';
    };

    const data = brands.map(b => ({
        id: b.Brand_Name,
        x: b.Transparency_Score_2024,
        y: b.Carbon_Intensity_MT_per_USD_Million,
        z: b.Revenue_USD_Million,
        score: b.finalScore,
        fillColor: getQuadrantColor(b.Transparency_Score_2024, b.Carbon_Intensity_MT_per_USD_Million)
    }));



    return (
        <section className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
                <h2 className="text-3xl font-black tracking-tighter text-stone-800">1. Actionable Greenwashing Matrix</h2>
                <p className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase mt-2">
                    Transparency vs Impact. Categorizing entities into Strategic Action Quadrants. (Labels highlight Top & Bottom 5 performers).
                </p>
            </div>

            <div className="h-[600px] w-full bg-white border border-stone-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 30, right: 30, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                        <XAxis
                            type="number"
                            dataKey="x"
                            domain={[0, 100]}
                            tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            domain={[0, maxY]}
                            tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <ZAxis
                            type="number"
                            dataKey="z"
                            range={[50, 600]}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }} />

                        {/* Semantic Quadrants */}
                        <ReferenceArea x1={0} x2={meanX} y1={meanY} y2={maxY} fill="#f43f5e" fillOpacity={0.03} />
                        <ReferenceArea x1={meanX} x2={100} y1={meanY} y2={maxY} fill="#f59e0b" fillOpacity={0.03} />
                        <ReferenceArea x1={meanX} x2={100} y1={0} y2={meanY} fill="#10b981" fillOpacity={0.03} />
                        <ReferenceArea x1={0} x2={meanX} y1={0} y2={meanY} fill="#94a3b8" fillOpacity={0.03} />

                        {/* Industry Average Crosshairs */}
                        <ReferenceLine x={meanX} stroke="#0f172a" strokeDasharray="3 3" label={{ position: 'bottom', value: 'Avg Transparency', fill: '#0f172a', fontSize: 10, fontFamily: 'monospace' }} />
                        <ReferenceLine y={meanY} stroke="#0f172a" strokeDasharray="3 3" label={{ position: 'right', value: 'Avg Carbon', fill: '#0f172a', fontSize: 10, fontFamily: 'monospace' }} />

                        {/* Custom SVG Labels for Quadrants using absolute SVG text */}
                        <text x="5%" y="10%" fill="#f43f5e" fontSize={12} fontFamily="monospace" fontWeight="bold">HIGH IMPACT, LOW TRANSPARENCY</text>
                        <text x="95%" y="10%" fill="#f59e0b" fontSize={12} fontFamily="monospace" fontWeight="bold" textAnchor="end">MARKETING DRIVEN</text>
                        <text x="95%" y="90%" fill="#10b981" fontSize={12} fontFamily="monospace" fontWeight="bold" textAnchor="end">TRUE LEADERS</text>
                        <text x="5%" y="90%" fill="#78716c" fontSize={12} fontFamily="monospace" fontWeight="bold">LOW IMPACT, LOW DISCLOSURE</text>

                        <Scatter name="Brands" data={data} shape={(props) => <CustomDot {...props} top5Names={top5Names} bottom5Names={bottom5Names} />} />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
