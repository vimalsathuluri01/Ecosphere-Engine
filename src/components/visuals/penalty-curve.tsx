"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceDot } from 'recharts';
import { cn } from "@/lib/utils";

interface PenaltyCurveProps {
    currentValue: number;
    threshold: number;
    k: number;
    label: string;
    unit: string;
}

export function PenaltyCurve({ currentValue, threshold, k, label, unit }: PenaltyCurveProps) {
    // 1. Generate Data Points for S-Curve
    // We want to show a range that includes 0, theta, and the current value
    const maxDomain = Math.max(currentValue * 1.1, threshold * 1.5);
    const steps = 50;
    const stepSize = maxDomain / steps;

    const data = Array.from({ length: steps + 1 }, (_, i) => {
        const x = i * stepSize;
        // Logistic Function: 1 / (1 + e^(k * (x - T)))
        // 1.0 = Safe, 0.0 = Collapse
        const y = 1 / (1 + Math.exp(k * (x - threshold)));
        return { x, y };
    });

    // 2. Calculate Current Health
    const currentHealth = 1 / (1 + Math.exp(k * (currentValue - threshold)));
    const isCrisis = currentHealth < 0.5;

    return (
        <div className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                        Ecological Penalty Function
                    </div>
                    <div className="text-xl font-black text-slate-900 uppercase">
                        {label}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Current Impact
                    </div>
                    <div className={cn("text-lg font-mono font-bold", isCrisis ? "text-red-600" : "text-emerald-600")}>
                        {currentValue.toLocaleString()} <span className="text-xs text-slate-400">{unit}</span>
                    </div>
                </div>
            </div>

            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                                <stop offset="50%" stopColor="#eab308" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.4} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="x"
                            type="number"
                            domain={[0, maxDomain]}
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(0)}
                        />
                        <YAxis
                            domain={[0, 1]}
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            tickCount={5}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            labelFormatter={(val) => `${val.toLocaleString()} ${unit}`}
                            formatter={(val: number) => [val.toFixed(3), "Eco Health"]}
                        />

                        {/* The Curve */}
                        <Area
                            type="monotone"
                            dataKey="y"
                            stroke="#slate-900"
                            strokeWidth={2}
                            fill={`url(#grad-${label})`}
                        />

                        {/* Threshold Line */}
                        <ReferenceLine x={threshold} stroke="#ef4444" strokeDasharray="3 3">
                        </ReferenceLine>

                        {/* Current Value Dot */}
                        <ReferenceDot
                            x={currentValue}
                            y={currentHealth}
                            r={6}
                            fill={isCrisis ? "#ef4444" : "#10b981"}
                            stroke="#fff"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-2 flex justify-between text-[9px] font-bold uppercase tracking-widest text-slate-400">
                <span>Safe Zone</span>
                <span className="text-red-500">Collapse Zone (&gt;{threshold.toLocaleString()})</span>
            </div>
        </div>
    );
}
