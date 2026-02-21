"use client";

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import { cn } from "@/lib/utils";

interface ImpactRadarProps {
    data: {
        subject: string;
        value: number; // 0-1
        fullMark: number;
    }[];
}

export function ImpactRadar({ data }: ImpactRadarProps) {
    // We explicitly model the "Safe Zone" vs "Danger Zone"
    // 0.0 -> 0.5 = Danger (Penalty Active)
    // 0.5 -> 1.0 = Safe (No Panic)

    // We add a synthetic "Safe Limit" data series for the chart to render a boundary
    const chartData = data.map(d => ({
        ...d,
        safeLimit: 0.5, // The tipping point threshold
        perfect: 1.0
    }));

    return (
        <div className="w-full bg-slate-900 p-6 rounded-3xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <div className="text-9xl font-black">?</div>
            </div>

            <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">
                    Planetary Boundaries
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">
                    Impact Radar
                </h3>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} axisLine={false} />

                        {/* Safe Zone (0.5 to 1.0) - Visually, we want to show the danger zone (0-0.5) as dark/red? 
                            Actually, let's keep it simple. 
                            Green Polygon = The Brand
                            Red Dotted = The Tipping Point (0.5)
                        */}

                        <Radar
                            name="Tipping Point"
                            dataKey="safeLimit"
                            stroke="#ef4444"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            fill="#ef4444"
                            fillOpacity={0.1}
                        />

                        <Radar
                            name="Brand Health"
                            dataKey="value"
                            stroke="#10b981"
                            strokeWidth={3}
                            fill="#10b981"
                            fillOpacity={0.4}
                        />

                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => value.toFixed(2)}
                        />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 justify-center mt-2">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Safe ({'>'}0.5)
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div> Critical ({'<'}0.5)
                </div>
            </div>
        </div>
    );
}
