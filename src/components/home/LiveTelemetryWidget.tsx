'use client';

import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

const generateTelemetryData = () => {
    return Array(50).fill(0).map((_, i) => ({
        time: i,
        signal: 20 + Math.sin(i / 3) * 15 + Math.random() * 10,
        baseline: 15
    }));
};

export function LiveTelemetryWidget() {
    const [telemetry, setTelemetry] = useState(generateTelemetryData());

    useEffect(() => {
        const interval = setInterval(() => {
            setTelemetry(prev => {
                const newData = [...prev.slice(1)];
                const lastI = newData[newData.length - 1].time;
                newData.push({
                    time: lastI + 1,
                    signal: 20 + Math.sin((lastI + 1) / 3) * 15 + Math.random() * 10,
                    baseline: 15
                });
                return newData;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-[400px] md:h-[500px] w-full bg-stone-900 rounded-[2rem] p-6 shadow-2xl overflow-hidden border border-stone-800 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500">Live Telemetry // Global Emissions</div>
                <Activity className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="flex-1 w-full -ml-4 -mr-4 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={telemetry}>
                        <defs>
                            <linearGradient id="colorSignal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="signal" stroke="#10b981" fillOpacity={1} fill="url(#colorSignal)" isAnimationActive={false} strokeWidth={2} />
                        <Area type="monotone" dataKey="baseline" stroke="#ef4444" strokeDasharray="3 3" fill="none" isAnimationActive={false} strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="absolute bottom-4 left-8 text-white font-mono text-3xl font-black tracking-tighter">
                    {telemetry[telemetry.length - 1].signal.toFixed(2)} <span className="text-xs text-stone-500 font-bold uppercase tracking-widest">MT CO2e/sec</span>
                </div>
            </div>
        </div>
    );
}
