'use client';

import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const ImpactDrivers = memo(function ImpactDrivers({ drivers }: { drivers: any }) {
    const data = Object.entries(drivers).map(([key, value]) => ({
        name: key.toUpperCase(),
        value: value as number
    })).sort((a, b) => b.value - a.value);

    return (
        <div className="bg-stone-900 p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
            
            <div className="relative z-10 mb-12">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400/50 mb-2">Primary Drivers of Damage</h3>
                <h2 className="text-4xl font-black uppercase tracking-tighter text-white">What Causes the Harm?</h2>
            </div>

            <div className="h-[200px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={[{ ...drivers, name: 'Industry Impact' }]} margin={{ left: -20, right: 30 }}>
                        <XAxis type="number" hide domain={[0, 100]} />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip 
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-stone-800 border border-stone-700 p-4 shadow-xl rounded-2xl text-white">
                                            {payload.map((p: any) => (
                                                <div key={p.name} className="flex justify-between gap-8 mb-2 last:mb-0">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                                                        {p.name === 'carbon' ? 'Carbon Footprint' : 
                                                         p.name === 'water' ? 'Water Waste' : 
                                                         p.name === 'waste' ? 'Trash' : 'Toxins'}
                                                    </span>
                                                    <span className="text-xs font-mono font-bold leading-none">{p.value}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="carbon" stackId="a" fill="#34d399" radius={[10, 0, 0, 10]} />
                        <Bar dataKey="water" stackId="a" fill="#60a5fa" />
                        <Bar dataKey="waste" stackId="a" fill="#facc15" />
                        <Bar dataKey="toxins" stackId="a" fill="#f87171" radius={[0, 10, 10, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 relative z-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Carbon Footprint</span>
                    </div>
                    <div className="text-2xl font-black text-white">{drivers.carbon}%</div>
                    <div className="text-[9px] text-stone-500 font-mono uppercase">Global Emissions</div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Water Waste</span>
                    </div>
                    <div className="text-2xl font-black text-white">{drivers.water}%</div>
                    <div className="text-[9px] text-stone-500 font-mono uppercase">Freshwater Depletion</div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Trash</span>
                    </div>
                    <div className="text-2xl font-black text-white">{drivers.waste}%</div>
                    <div className="text-[9px] text-stone-500 font-mono uppercase">Manufacturing Waste</div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-400" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Toxins</span>
                    </div>
                    <div className="text-2xl font-black text-white">{drivers.toxins}%</div>
                    <div className="text-[9px] text-stone-500 font-mono uppercase">Chemical Hazard Load</div>
                </div>
            </div>
        </div>
    );
});
