'use client';

import { BrandData } from '@/lib/methodology';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceArea } from 'recharts';

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white border border-stone-100 p-4 rounded-xl shadow-2xl text-stone-800 font-sans max-w-xs z-50">
                <div className="font-black tracking-tight text-lg mb-2">{data.id}</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase">
                    <div>Annual Volume</div><div className="text-stone-800 text-right">{data.x.toLocaleString()}M Units</div>
                    <div>Carbon Intensity</div><div className="text-stone-800 text-right">{data.y.toFixed(1)} MT/$M</div>
                    <div>Revenue</div><div className="text-stone-800 text-right">${data.z.toLocaleString()}M</div>
                    <div>Category</div><div className="text-stone-800 text-right">{data.category}</div>
                </div>
            </div>
        );
    }
    return null;
};

const CustomDot = (props: any) => {
    const { cx, cy, payload, meanX, meanY } = props;
    const r = props.r || 6;

    let fill = '#94a3b8';
    if (payload.x >= meanX && payload.y >= meanY) fill = '#f43f5e';
    else if (payload.x >= meanX && payload.y < meanY) fill = '#10b981';
    else if (payload.x < meanX && payload.y >= meanY) fill = '#f59e0b';
    else fill = '#3b82f6';

    const shouldLabel = payload.x > meanX * 1.5 || payload.y > meanY * 1.5;

    return (
        <g>
            <circle cx={cx} cy={cy} r={r} fill={fill} opacity={0.7} className="hover:opacity-100 transition-opacity" />
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

export function OverproductionIndex({ brands, averages }: { brands: BrandData[], averages: any }) {

    const data = brands.map(b => ({
        id: b.Brand_Name,
        category: b.Category,
        x: b.Annual_Units_Million,
        y: b.Carbon_Intensity_MT_per_USD_Million,
        z: b.Revenue_USD_Million,
    }));

    const meanX = averages.Annual_Units_Million ||
        (data.reduce((sum, d) => sum + d.x, 0) / data.length);
    const meanY = averages.Carbon_Intensity_MT_per_USD_Million;
    const maxX = Math.max(...data.map(d => d.x)) * 1.05;
    const maxY = Math.ceil(Math.max(...data.map(d => d.y)) * 1.1);


    return (
        <section className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
                <h2 className="text-3xl font-black tracking-tighter text-stone-800">6. Overproduction Intensity Index</h2>
                <p className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase mt-2">
                    Volume vs Emissions. Identifying "Responsible Scalers" vs "Inefficient Mass Producers". (Node size = Revenue).
                </p>
            </div>

            <div className="h-[600px] w-full bg-white border border-stone-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 30, right: 30, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                        <XAxis
                            type="number"
                            dataKey="x"
                            domain={[0, maxX]}
                            name="Annual Units"
                            tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            domain={[0, maxY]}
                            name="Carbon Intensity"
                            tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <ZAxis
                            type="number"
                            dataKey="z"
                            range={[50, 800]} // Controls bubble size
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }} />

                        {/* Semantic Quadrants */}
                        <ReferenceArea x1={meanX} x2={maxX} y1={meanY} y2={maxY} fill="#f43f5e" fillOpacity={0.03} />
                        <ReferenceArea x1={meanX} x2={maxX} y1={0} y2={meanY} fill="#10b981" fillOpacity={0.03} />
                        <ReferenceArea x1={0} x2={meanX} y1={meanY} y2={maxY} fill="#f59e0b" fillOpacity={0.03} />
                        <ReferenceArea x1={0} x2={meanX} y1={0} y2={meanY} fill="#3b82f6" fillOpacity={0.03} />

                        {/* Averages */}
                        <ReferenceLine x={meanX} stroke="#0f172a" strokeDasharray="3 3" label={{ position: 'bottom', value: 'Avg Volume', fill: '#0f172a', fontSize: 10, fontFamily: 'monospace' }} />
                        <ReferenceLine y={meanY} stroke="#0f172a" strokeDasharray="3 3" label={{ position: 'right', value: 'Avg Carbon', fill: '#0f172a', fontSize: 10, fontFamily: 'monospace' }} />

                        {/* Quadrant Labels */}
                        <text x="95%" y="10%" fill="#f43f5e" fontSize={12} fontFamily="monospace" fontWeight="bold" textAnchor="end">INEFFICIENT MASS PRODUCERS</text>
                        <text x="95%" y="90%" fill="#10b981" fontSize={12} fontFamily="monospace" fontWeight="bold" textAnchor="end">RESPONSIBLE SCALERS</text>
                        <text x="5%" y="10%" fill="#f59e0b" fontSize={12} fontFamily="monospace" fontWeight="bold">LOW SCALE / HIGH RISK</text>
                        <text x="5%" y="90%" fill="#3b82f6" fontSize={12} fontFamily="monospace" fontWeight="bold">LOW VOLUME</text>

                        <Scatter name="Brands" data={data} shape={(props) => <CustomDot {...props} meanX={meanX} meanY={meanY} />} />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
