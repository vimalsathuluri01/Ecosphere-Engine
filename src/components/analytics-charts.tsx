'use client'

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    ReferenceLine, ScatterChart, Scatter, ZAxis, Cell, LineChart, Line, AreaChart, Area, ComposedChart,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import { AlertTriangle, ShieldAlert, ArrowDown, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

// ==========================================
// 1. DISTRIBUTION HISTOGRAM (Overview Panel)
// ==========================================
export function ScoreDistributionChart({ data }: { data: { tierDistribution: any } }) {
    const chartData = [
        { name: 'Regenerative (A)', value: data.tierDistribution.regenerative, color: '#4A6741' },
        { name: 'Sustainable (B)', value: data.tierDistribution.sustainable, color: '#7EA172' },
        { name: 'Transitional (C)', value: data.tierDistribution.transitional, color: '#F59E0B' },
        { name: 'Unsustainable (F)', value: data.tierDistribution.unsustainable, color: '#EF4444' }
    ];

    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#8C9A8C', fontWeight: 'bold' }} axisLine={false} tickLine={false} width={120} />
                    <RechartsTooltip
                        contentStyle={{ borderRadius: '0.5rem', border: '1px solid #E3EFE0', fontSize: '12px' }}
                        formatter={(value: number) => [`${value.toFixed(1)}%`, 'Brands']}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

// ==========================================
// 2. INDICATOR SPREAD (Distribution Analytics)
// ==========================================
export function IndicatorSpreadChart({ metricKey, data, label }: { metricKey: string, data: any, label: string }) {
    if (!data[metricKey]) return null;
    const stats = data[metricKey];

    // Simulating a Box Plot via a custom composed chart with error bars or layered bars
    const plotData = [{
        name: label,
        min: stats.min,
        q25: stats.q25,
        median: stats.median,
        mean: stats.mean,
        q75: stats.q75,
        max: stats.max
    }];

    return (
        <div className="bg-white border border-[#E3EFE0] p-4 rounded-xl">
            <div className="flex justify-between items-center mb-4 text-xs font-bold uppercase tracking-widest text-[#8C9A8C]">
                <span>{label}</span>
                <span className="text-[#2D3A2D]">Mean: {stats.mean.toFixed(1)}</span>
            </div>
            <div className="h-6 relative w-full bg-[#F9F6F0] rounded-sm flex items-center">
                {/* Min to Max line */}
                <div className="absolute h-[2px] bg-[#E3EFE0] w-full top-1/2 -translate-y-1/2"></div>
                {/* IQR Box (25th to 75th) */}
                <div className="absolute h-full bg-[#A6C0B0] opacity-50 border border-[#4A6741]"
                    style={{
                        left: `${(stats.q25 / Math.max(stats.max, 100)) * 100}%`,
                        width: `${((stats.q75 - stats.q25) / Math.max(stats.max, 100)) * 100}%`
                    }}>
                </div>
                {/* Median Line */}
                <div className="absolute h-8 w-[2px] bg-[#2D3A2D] top-1/2 -translate-y-1/2 z-10"
                    style={{ left: `${(stats.median / Math.max(stats.max, 100)) * 100}%` }}>
                </div>
            </div>
            <div className="flex justify-between mt-2 text-[9px] font-mono text-slate-400">
                <span>Min: {stats.min.toFixed(0)}</span>
                <span>Max: {stats.max.toFixed(0)}</span>
            </div>
        </div>
    )
}

// ==========================================
// 3. MACRO ENV vs GOV QUADRANT
// ==========================================
export function MacroQuadrant({ data }: { data: any[] }) {
    return (
        <div className="h-[400px] w-full relative group">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E3EFE0" />
                    <XAxis type="number" dataKey="envScore" name="Environment" domain={[0, 100]} stroke="#8C9A8C" tick={{ fontSize: 10 }} label={{ value: 'Environmental Performance', position: 'bottom', fill: '#8C9A8C', fontSize: 10 }} />
                    <YAxis type="number" dataKey="govScore" name="Governance" domain={[0, 100]} stroke="#8C9A8C" tick={{ fontSize: 10 }} label={{ value: 'Governance & Disclosure', angle: -90, position: 'left', fill: '#8C9A8C', fontSize: 10 }} />
                    <ZAxis type="number" range={[20, 100]} />
                    <ReferenceLine x={50} stroke="#2D3A2D" strokeOpacity={0.2} strokeWidth={2} />
                    <ReferenceLine y={50} stroke="#2D3A2D" strokeOpacity={0.2} strokeWidth={2} />
                    <RechartsTooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #E3EFE0', borderRadius: '0.5rem', backdropFilter: 'blur(4px)' }}
                        itemStyle={{ color: '#2D3A2D', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Scatter name="Brands" data={data} fill="#4A6741" fillOpacity={0.6}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.tier === 'A' || entry.tier === 'B' ? '#4A6741' : entry.tier === 'F' ? '#EF4444' : '#F59E0B'} />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    )
}

// ==========================================
// 4. SYSTEMIC RISK BUBBLE CHART
// ==========================================
export function MacroRiskBubble({ data }: { data: any[] }) {
    return (
        <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" dataKey="carbon" name="Carbon MT" domain={['auto', 'auto']} stroke="#94A3B8" tick={{ fontSize: 10 }} label={{ value: 'Absolute Carbon (MT)', position: 'bottom', fontSize: 10, fill: '#94A3B8' }} />
                    <YAxis type="number" dataKey="score" name="Final Score" domain={[0, 100]} stroke="#94A3B8" tick={{ fontSize: 10 }} label={{ value: 'Sustainability Score', angle: -90, position: 'left', fontSize: 10, fill: '#94A3B8' }} />
                    <ZAxis type="number" dataKey="marketShare" range={[50, 2000]} name="Market Share %" />
                    <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Industry Exposure" data={data}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.breach ? 'rgba(239, 68, 68, 0.7)' : 'rgba(16, 185, 129, 0.4)'} stroke={entry.breach ? '#991B1B' : '#065F46'} strokeWidth={1} />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    )
}

// ==========================================
// 5. GREENWASHING QUADRANT (Editorial)
// ==========================================
export function GreenwashingQuadrant({ data }: { data: any[] }) {
    return (
        <div className="h-[400px] w-full relative group">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E3EFE0" />
                    <XAxis type="number" dataKey="govTransparency" name="Gov & Transp." domain={[0, 100]} stroke="#8C9A8C" tick={{ fontSize: 10 }} label={{ value: 'Governance & Disclosure Score', position: 'bottom', fill: '#8C9A8C', fontSize: 10 }} />
                    <YAxis type="number" dataKey="ecoIntensity" name="Eco Intensity" domain={[0, 100]} stroke="#8C9A8C" tick={{ fontSize: 10 }} label={{ value: 'Pre-Penalty Environmental Score', angle: -90, position: 'left', fill: '#8C9A8C', fontSize: 10 }} />
                    <ZAxis type="number" dataKey="maskingFactor" range={[20, 1500]} name="Masking Factor" />
                    <ReferenceLine x={50} stroke="#2D3A2D" strokeOpacity={0.15} strokeWidth={2} />
                    <ReferenceLine y={50} stroke="#2D3A2D" strokeOpacity={0.15} strokeWidth={2} />
                    {/* Optional diagonal guide (y = x) to show illusion scaling */}
                    <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 100, y: 100 }]} stroke="#8C9A8C" strokeDasharray="5 5" strokeOpacity={0.3} />
                    <RechartsTooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ backgroundColor: 'rgba(253, 251, 247, 0.95)', border: '1px solid #E3EFE0', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#2D3A2D', fontSize: '11px', fontWeight: 'bold' }}
                        formatter={(value: any, name: string) => [typeof value === 'number' ? value.toFixed(1) : value, name]}
                    />
                    <Scatter name="Brands" data={data} fill="#A6C0B0" fillOpacity={0.7}>
                        {data.map((entry, index) => {
                            // High Gov, Low Env == Greenwashing
                            const isGreenwashing = entry.govTransparency > 50 && entry.ecoIntensity < 50;
                            return <Cell key={`cell-${index}`} fill={isGreenwashing ? 'rgba(217, 119, 6, 0.6)' : 'rgba(74, 103, 65, 0.5)'} stroke={isGreenwashing ? '#B45309' : '#2D3A2D'} strokeWidth={1} style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} />;
                        })}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    )
}

// ==========================================
// 6. SAFE OPERATING SPACE RADAR
// ==========================================
export function SafeOperatingRadar({ data }: { data: any[] }) {
    // 100 on the radar is the absolute planetary threshold. 
    return (
        <div className="h-[350px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#E3EFE0" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#8C9A8C', fontSize: 11, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 150]} tick={false} axisLine={false} />

                    {/* The Safe Threshold Boundary (Value 100) */}
                    <Radar name="Hard Threshold Limit" dataKey="limit" stroke="#EF4444" strokeDasharray="3 3" fill="transparent" strokeWidth={1.5} />

                    {/* Industry Averages */}
                    <Radar name="Industry Current State" dataKey="industryAverage" stroke="#4A6741" fill="#A6C0B0" fillOpacity={0.5} strokeWidth={2} style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />

                    <RechartsTooltip
                        contentStyle={{ backgroundColor: 'rgba(253, 251, 247, 0.95)', border: '1px solid #E3EFE0', borderRadius: '0.5rem' }}
                        itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                        formatter={(value: number) => [`${value.toFixed(1)}% of Threshold`, '']}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}

// ==========================================
// 7. PENALTY DRAG WATERFALL (Simplified)
// ==========================================
export function PenaltyDragWaterfall({ data }: { data: any }) {
    // Instead of a complex composed chart, a custom DOM flex layout creates a beautiful editorial waterfall.
    return (
        <div className="w-full flex justify-between items-end h-[240px] px-6 py-4 font-mono text-xs">
            {/* Pre Penalty */}
            <div className="flex flex-col items-center w-1/4 h-full justify-end group">
                <span className="text-slate-400 mb-2 transition-transform group-hover:-translate-y-1">{data.avgPrePenaltyEnv.toFixed(1)}</span>
                <div className="w-full bg-[#A6C0B0] rounded-t-sm transition-all duration-700 ease-out" style={{ height: '100%' }}></div>
                <span className="mt-4 font-sans font-bold text-[#8C9A8C] tracking-widest uppercase text-[10px]">Pre-Penalty</span>
            </div>

            {/* The Drop */}
            <div className="flex flex-col items-center w-1/4 h-full justify-center group relative">
                <span className="text-red-500 font-bold mb-2 absolute top-[30%] text-lg">-{data.avgReductionMagnitude.toFixed(1)}</span>
                <div className="w-[2px] bg-red-200 h-[40%] relative">
                    <ArrowDown className="absolute -bottom-4 -left-3 text-red-400 w-6 h-6 animate-pulse" />
                </div>
            </div>

            {/* Post Penalty */}
            <div className="flex flex-col items-center w-1/4 h-full justify-end group">
                <span className="text-[#2D3A2D] font-bold mb-2 text-xl transition-transform group-hover:-translate-y-1">
                    {data.avgPostPenaltyEnv.toFixed(1)}
                </span>
                <div className="w-full bg-[#4A6741] rounded-t-sm transition-all duration-700 ease-out" style={{ height: `${(data.avgPostPenaltyEnv / data.avgPrePenaltyEnv) * 100}%` }}></div>
                <span className="mt-4 font-sans font-bold text-[#2D3A2D] tracking-widest uppercase text-[10px]">Adjusted Truth</span>
            </div>
        </div>
    )
}

// ==========================================
// 8. COMPENSATION ILLUSION DETECTOR
// ==========================================
export function CompensationIllusionDetector({ data }: { data: any[] }) {
    return (
        <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" dataKey="linearScore" name="Linear ESG" domain={[0, 100]} stroke="#94A3B8" tick={{ fontSize: 10 }} label={{ value: 'Linear ESG Score (Illusion)', position: 'bottom', fontSize: 10, fill: '#94A3B8' }} />
                    <YAxis type="number" dataKey="strongScore" name="Strong Score" domain={[0, 100]} stroke="#94A3B8" tick={{ fontSize: 10 }} label={{ value: 'Strong Penalized Score (Reality)', angle: -90, position: 'left', fontSize: 10, fill: '#94A3B8' }} />
                    <ZAxis type="number" dataKey="illusionDelta" range={[20, 400]} />

                    {/* 45 Degree Parity Line */}
                    <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 100, y: 100 }]} stroke="#8C9A8C" strokeWidth={1} />

                    <RechartsTooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ backgroundColor: 'rgba(253, 251, 247, 0.95)', border: '1px solid #E3EFE0', borderRadius: '0.5rem' }}
                        itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                        formatter={(value: any, name: string) => [typeof value === 'number' ? value.toFixed(1) : value, name]}
                    />
                    <Scatter name="Brands" data={data}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.illusionDelta > 15 ? 'rgba(245, 158, 11, 0.6)' : 'rgba(166, 192, 176, 0.5)'} stroke={entry.illusionDelta > 15 ? '#D97706' : '#8C9A8C'} strokeWidth={1} style={{ transition: 'all 0.3s ease' }} />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    )
}

// ==========================================
// 9. CIRCULARITY FLOW SANKEY (Simplified Nodes)
// ==========================================
export function CircularitySankey({ data }: { data: any }) {
    // Recharts doesn't have a native Sankey that fits this perfectly without D3 injections, 
    // so we build an abstract SVG path visual for flow economics.
    return (
        <div className="w-full h-[250px] relative px-4 flex items-center font-sans tracking-widest uppercase text-[9px] font-bold text-[#8C9A8C]">
            {/* INPUTS */}
            <div className="flex flex-col justify-between h-[80%] w-1/4 relative z-10">
                <div className="bg-white border border-[#E3EFE0] p-3 rounded-lg text-center shadow-sm">
                    <span className="text-[#2D3A2D] block text-lg mb-1">{data.recycledMaterials.toFixed(1)}%</span>
                    Recycled Inputs
                </div>
                <div className="bg-white border border-[#E3EFE0] p-3 rounded-lg text-center shadow-sm">
                    <span className="text-red-400 block text-lg mb-1">{data.virginMaterials.toFixed(1)}%</span>
                    Virgin / Fossil
                </div>
            </div>

            {/* FLOW LINES - SVG */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <svg width="100%" height="100%" preserveAspectRatio="none">
                    <path d="M 25% 25% C 50% 25%, 50% 50%, 75% 30%" fill="none" stroke="rgba(74, 103, 65, 0.3)" strokeWidth="15" strokeLinecap="round" />
                    <path d="M 25% 75% C 50% 75%, 50% 50%, 75% 70%" fill="none" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="30" strokeLinecap="round" />
                </svg>
            </div>

            {/* CORE ENGINE */}
            <div className="w-2/4 flex justify-center z-10">
                <div className="w-24 h-24 rounded-full border border-[#E3EFE0] bg-[#F9F6F0] flex items-center justify-center flex-col shadow-inner">
                    <div className="w-16 h-16 rounded-full bg-[#2D3A2D] flex items-center justify-center text-white p-2 text-center leading-tight shadow-xl">
                        Industry<br />Engine
                    </div>
                </div>
            </div>

            {/* OUTPUTS */}
            <div className="flex flex-col justify-between h-[80%] w-1/4 relative z-10">
                <div className="bg-white border border-[#E3EFE0] p-3 rounded-lg text-center shadow-sm">
                    <span className="text-[#4A6741] block text-lg mb-1">{data.recyclableLoop.toFixed(1)}%</span>
                    Closed Loop
                </div>
                <div className="bg-white border border-[#E3EFE0] p-3 rounded-lg text-center shadow-sm">
                    <span className="text-[#F59E0B] block text-lg mb-1">{data.wasteToLandfill.toFixed(1)}%</span>
                    Landfill / Waste
                </div>
            </div>
        </div>
    )
}

// ==========================================
// 10. CARBON DECAY CURVE (Behavioral Integration)
// ==========================================
export function CarbonDecayCurve() {
    // Static exponential decay curve for product longevity context
    const data = Array.from({ length: 50 }, (_, i) => ({
        wear: i + 1,
        intensity: 50 * Math.exp(-0.1 * i),
        fastFashion: i < 5 ? 50 * Math.exp(-0.1 * i) : null // Drops out after 7 wears
    }));

    return (
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorDecay" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4A6741" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4A6741" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="wear" tick={{ fontSize: 9 }} stroke="#94A3B8" label={{ value: 'Number of Wears', position: 'insideBottomRight', offset: -5, fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} stroke="#94A3B8" label={{ value: 'Carbon / Wear', angle: -90, position: 'insideLeft', fontSize: 9 }} />
                    <RechartsTooltip
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}
                        itemStyle={{ fontSize: '10px' }}
                    />
                    <Area type="monotone" dataKey="intensity" stroke="#4A6741" fillOpacity={1} fill="url(#colorDecay)" strokeWidth={2} />
                    <Line type="stepAfter" dataKey="fastFashion" stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
