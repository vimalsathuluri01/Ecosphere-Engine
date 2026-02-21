'use client'

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    ReferenceLine, ScatterChart, Scatter, ZAxis, Cell, LineChart, Line, AreaChart, Area
} from 'recharts'
import { z } from 'zod'
import { BrandCompareNodeSchema, ComparisonPayloadSchema } from '@/lib/comparison-engine'

type CompareResult = z.infer<typeof ComparisonPayloadSchema>;
type BrandNode = z.infer<typeof BrandCompareNodeSchema>;

// ==========================================
// 2. ECOLOGICAL TIPPING COMPARISON PANEL
// ==========================================
export function TippingThresholdChart({ data, metricKey, title, unit }: { data: CompareResult, metricKey: string, title: string, unit: string }) {
    const threshold = data.context.thresholds.find(t => t.indicatorId === metricKey);
    if (!threshold) return null;

    const chartData = data.nodes.map(n => {
        const m = n.metrics.find(m => m.indicatorId === metricKey);
        return {
            name: n.name,
            value: m?.rawValue || 0,
            breach: m?.thresholdBreach || false
        }
    });

    const isCost = metricKey !== 'sustainable_material_percent'; // Assuming materials is benefit

    return (
        <div className="bg-white border-2 border-[#2D3A2D]/10 p-6 rounded-[2rem] shadow-sm font-sans">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#2D3A2D]">{title}</h3>
                <div className="text-[10px] uppercase font-mono bg-red-50 text-red-600 px-2 py-1 rounded-sm font-bold border border-red-200">
                    Threshold: {threshold.x0} {unit}
                </div>
            </div>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8C9A8C', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#8C9A8C', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                        <RechartsTooltip
                            contentStyle={{ borderRadius: '1rem', border: '2px solid #2D3A2D', boxShadow: '4px 4px 0px 0px rgba(45,58,45,0.1)' }}
                            itemStyle={{ fontWeight: 'bold', fontFamily: 'monospace' }}
                        />
                        <ReferenceLine y={threshold.x0} stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" label={{ position: 'top', value: 'DANGER ZONE', fill: '#EF4444', fontSize: 10, fontWeight: 'bold' }} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.breach ? '#EF4444' : '#4A6741'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

// ==========================================
// 5. ENV VS GOV QUADRANT SCATTER
// ==========================================
export function EnvGovQuadrant({ data }: { data: CompareResult }) {
    const chartData = data.nodes.map(n => ({
        name: n.name,
        env: n.scoring.environmentalPostPenalty,
        gov: n.scoring.governance,
        tier: n.tier,
        market: n.marketShare || 1
    }));

    return (
        <div className="bg-[#1A1F1C] text-white border-2 border-[#2D3A2D] p-6 rounded-[2rem] shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#E3EFE0] mb-2">Env vs Governance Quadrant</h3>
            <p className="text-[10px] text-[#8C9A8C] mb-6">Identifying greenwashing vs genuine operational efficiency.</p>

            <div className="h-[300px] w-full relative">
                {/* Quadrant Labels */}
                <div className="absolute top-2 right-4 text-[10px] font-bold uppercase text-[#4A6741] opacity-50">Strong Sus.</div>
                <div className="absolute top-2 left-10 text-[10px] font-bold uppercase text-amber-500 opacity-50">Gov Biased</div>
                <div className="absolute bottom-6 right-4 text-[10px] font-bold uppercase text-blue-400 opacity-50">Op. Efficient</div>
                <div className="absolute bottom-6 left-10 text-[10px] font-bold uppercase text-red-500 opacity-50">High Risk</div>

                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2D3A2D" />
                        <XAxis type="number" dataKey="env" name="Environment" domain={[0, 100]} stroke="#8C9A8C" tick={{ fontSize: 10 }} label={{ value: 'Environmental Score', position: 'bottom', fill: '#8C9A8C', fontSize: 10 }} />
                        <YAxis type="number" dataKey="gov" name="Governance" domain={[0, 100]} stroke="#8C9A8C" tick={{ fontSize: 10 }} label={{ value: 'Governance', angle: -90, position: 'left', fill: '#8C9A8C', fontSize: 10 }} />
                        <ZAxis type="number" dataKey="market" range={[100, 500]} name="Market Share" />
                        <ReferenceLine x={50} stroke="#4A6741" strokeOpacity={0.5} />
                        <ReferenceLine y={50} stroke="#4A6741" strokeOpacity={0.5} />
                        <RechartsTooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{ backgroundColor: '#1A1F1C', border: '1px solid #4A6741', borderRadius: '0.5rem' }}
                            itemStyle={{ color: '#E3EFE0', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Scatter name="Brands" data={chartData} fill="#E3EFE0">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.tier === 'A' || entry.tier === 'B' ? '#4A6741' : entry.tier === 'F' ? '#EF4444' : '#E3EFE0'} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

// ==========================================
// 6. PENALTY IMPACT DIFFERENCE BAR
// ==========================================
export function PenaltyImpactChart({ data }: { data: CompareResult }) {
    const chartData = data.nodes.map(n => ({
        name: n.name,
        Base: parseFloat(n.scoring.environmentalBase.toFixed(1)),
        PenaltyDrag: parseFloat((n.scoring.environmentalBase - n.scoring.environmentalPostPenalty).toFixed(1)),
        Actual: parseFloat(n.scoring.environmentalPostPenalty.toFixed(1))
    }));

    return (
        <div className="bg-white border-2 border-red-100 p-6 rounded-[2rem] shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#2D3A2D] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Logistic Penalty Impact
            </h3>
            <p className="text-[10px] text-slate-500 mb-6">Visualizing the score drag caused by ecological threshold violations.</p>

            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#1E293B', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                        <RechartsTooltip
                            contentStyle={{ borderRadius: '1rem', border: '2px solid #2D3A2D' }}
                            cursor={{ fill: 'transparent' }}
                        />
                        {/* The Actual Score */}
                        <Bar dataKey="Actual" stackId="a" fill="#10B981" radius={[4, 0, 0, 4]} barSize={30} />
                        {/* The Ghosted Penalty Drag */}
                        <Bar dataKey="PenaltyDrag" stackId="a" fill="#EF4444" fillOpacity={0.2} stroke="#EF4444" strokeDasharray="2 2" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

// ==========================================
// 8. DISTRIBUTION / MARKET EXPOSURE BUBBLE
// ==========================================
export function MarketExposureChart({ data }: { data: CompareResult }) {
    // Shows Carbon vs Final Score, sized by Market Share
    const carbonMetricId = 'carbon_footprint_mt';

    const chartData = data.nodes.map(n => {
        const c = n.metrics.find(m => m.indicatorId === carbonMetricId);
        return {
            name: n.name,
            score: n.scoring.finalNonCompensatory,
            carbon: c?.rawValue || 0,
            market: n.marketShare || 1,
            breach: c?.thresholdBreach || false
        }
    });

    return (
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-[2rem]">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-2">Market Exposure Risk</h3>
            <p className="text-[10px] text-slate-500 mb-6 font-mono">X: Carbon / Y: Sus. Score / Z: Market Share</p>

            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" dataKey="carbon" name="Carbon MT" unit="MT" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                        <YAxis type="number" dataKey="score" name="Score" domain={[0, 100]} stroke="#94A3B8" tick={{ fontSize: 10 }} />
                        <ZAxis type="number" dataKey="market" range={[100, 1500]} name="Market %" />
                        <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="Brands" data={chartData}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.breach ? 'rgba(239, 68, 68, 0.6)' : 'rgba(16, 185, 129, 0.6)'} stroke={entry.breach ? '#991B1B' : '#065F46'} strokeWidth={2} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
