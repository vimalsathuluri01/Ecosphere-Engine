'use client';

import { BrandData } from '@/lib/methodology';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';

const CustomizedContent = (props: any) => {
    const { root, depth, x, y, width, height, index, payload, name, fill } = props;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: depth === 1 ? fill : 'transparent',
                    stroke: '#ffffff',
                    strokeWidth: 2,
                    strokeOpacity: 1,
                    transition: 'opacity 0.2s',
                }}
                className="hover:opacity-80 cursor-pointer"
            />
            {width > 60 && height > 30 && depth === 1 ? (
                <text
                    x={x + width / 2}
                    y={y + height / 2 + 5}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={12}
                    fontWeight="bold"
                    fontFamily="monospace"
                    className="pointer-events-none"
                >
                    {name}
                </text>
            ) : null}
        </g>
    );
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white border border-stone-100 p-4 rounded-xl shadow-2xl text-stone-800 font-sans max-w-xs z-50 relative">
                <div className="font-black tracking-tight text-lg mb-2">{data.name}</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase">
                    <div>Revenue</div><div className="text-stone-800 text-right">${data.size.toLocaleString()}M</div>
                    <div>Carbon Rate</div><div className="text-stone-800 text-right">{data.intensity.toFixed(1)} MT/$M</div>
                </div>
            </div>
        );
    }
    return null;
};

export function ResourceTreemap({ brands }: { brands: BrandData[] }) {

    const minIntensity = Math.min(...brands.map(b => b.Carbon_Intensity_MT_per_USD_Million));
    const maxIntensity = Math.max(...brands.map(b => b.Carbon_Intensity_MT_per_USD_Million));

    // Data must be structurally nested for Recharts Treemap
    const data = [{
        name: 'Industry',
        children: brands.map(b => {
            const intensity = b.Carbon_Intensity_MT_per_USD_Million;
            // Normalize 0 to 1
            const normalized = (intensity - minIntensity) / (maxIntensity - minIntensity || 1);
            // Green hue = 130, Red hue = 0. Brighter lightness (50%)
            const hue = (1 - normalized) * 130;
            const fill = `hsl(${hue}, 85%, 50%)`;

            return {
                name: b.Brand_Name,
                size: b.Revenue_USD_Million,
                intensity,
                fill
            };
        })
    }];

    return (
        <section className="space-y-6">
            <div className="border-b border-stone-200 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter text-stone-800">5. Resource Dominance Treemap</h2>
                    <p className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase mt-2">
                        Area = Revenue scale. Hue = Carbon Intensity. (Red = Worse)
                    </p>
                </div>
                {/* Visual Legend */}
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase text-stone-400">
                    <span>Clean</span>
                    <div className="w-32 h-2 rounded-full bg-gradient-to-r from-[hsl(130,85%,50%)] to-[hsl(0,85%,50%)]" />
                    <span>Polluting</span>
                </div>
            </div>

            <div className="h-[600px] w-full bg-white border border-stone-200 rounded-[2rem] p-6 md:p-8 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={data}
                        dataKey="size"
                        aspectRatio={4 / 3}
                        stroke="#fff"
                        isAnimationActive={false}
                        content={<CustomizedContent />}
                    >
                        <Tooltip content={<CustomTooltip />} />
                    </Treemap>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
