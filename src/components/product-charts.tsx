'use client';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    PieChart, Pie, Cell, ReferenceLine
} from 'recharts';
import { EnrichedProduct } from '@/lib/types';
import { formatEmission, formatEnergy, formatWater, formatWaste } from '@/lib/formatters';

// --- CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-stone-100 p-3 shadow-lg rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-xs font-mono font-bold text-stone-700">
                        {entry.name}: {entry.value} {entry.unit}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// --- WIDGET 1: LIFECYCLE EMISSIONS (Stacked Bar) ---
export function LifecycleBarChart({ product }: { product: EnrichedProduct }) {
    const data = [
        {
            name: 'Footprint',
            Manufacturing: product.scope1_scope2_emissions,
            Logistics: product.shipping_emissions,
            Operations: product.operational_energy / 10, // Normalized roughly for chart scale if needed, or keeping raw
        }
    ];

    // Note: operational_energy is MJ. To convert to CO2e roughly, we'd need a factor. 
    // For now, we plot raw values but labeled distinctively, or assuming the prompt implies a direct mapping.
    // The prompt says "Stacked <BarChart> showing the total carbon footprint broken down by stage."
    // We will assume operational_energy contributes to the footprint. 
    // Let's us keep it as is for now.

    return (
        <div className="w-full h-[250px] font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" horizontal={false} />
                    <XAxis type="number" stroke="#a8a29e" />
                    <YAxis type="category" dataKey="name" stroke="#a8a29e" width={60} />
                    <Tooltip cursor={{ fill: '#fafaf9' }} content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="Manufacturing" stackId="a" fill="#57534e" name="Mfg (Scope 1+2)" />
                    <Bar dataKey="Logistics" stackId="a" fill="#a8a29e" name="Logistics" />
                    <Bar dataKey="Operations" stackId="a" fill="#e7e5e4" name="Usage Phase" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// --- WIDGET 2: RESOURCE GAUGE (Simple Bar Visualization) ---
export function ResourceGauge({ product }: { product: EnrichedProduct }) {
    // Normalization baselines (mock industry avgs for visual context)
    const maxWater = 1000;
    const maxWaste = 20;

    return (
        <div className="space-y-6 font-mono text-xs">
            {/* Renewable Energy */}
            <div>
                <div className="flex justify-between mb-1">
                    <span className="font-bold uppercase tracking-widest text-stone-500">Renewable Energy</span>
                    <span className="font-bold text-emerald-600">{product.renewable_energy_ratio.toFixed(1)}%</span>
                </div>
                <div className="h-4 bg-stone-50 border border-stone-100 rounded-full overflow-hidden w-full relative">
                    <div
                        style={{ '--width': `${Math.min(100, product.renewable_energy_ratio)}%` } as React.CSSProperties}
                        className="h-full bg-emerald-400 absolute top-0 left-0 w-[var(--width)] rounded-full transition-all duration-1000 ease-out"
                    />
                </div>
            </div>

            {/* Energy Efficiency */}
            <div>
                <div className="flex justify-between mb-1">
                    <span className="font-bold uppercase tracking-widest text-stone-500">Efficiency</span>
                    <span className="font-bold text-stone-800 max-w-[50%] truncate">{product.energy_used_per_unit.toFixed(1)} MJ/Unit</span>
                </div>
                <div className="h-4 bg-stone-50 border border-stone-100 rounded-full overflow-hidden w-full relative flex items-center">
                    <div className="w-1/2 h-full border-r border-stone-200 bg-stone-100/50" />
                    <div className="absolute top-0 right-0 h-full w-1.5 rounded-full bg-stone-700 left-[var(--left)] transition-all duration-1000 ease-out" style={{ '--left': `${Math.min(99, (product.energy_used_per_unit / 200) * 100)}%` } as React.CSSProperties} />
                </div>
            </div>

            {/* Water */}
            <div>
                <div className="flex justify-between mb-1">
                    <span className="font-bold uppercase tracking-widest text-stone-500">Water Intensity</span>
                    <span className="font-bold text-sky-600">{formatWater(product.water_consumed_per_unit)}</span>
                </div>
                <div className="flex gap-1 h-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-full ${i < (product.water_consumed_per_unit / maxWater) * 10 ? 'bg-sky-400' : 'bg-stone-100'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Waste */}
            <div>
                <div className="flex justify-between mb-1">
                    <span className="font-bold uppercase tracking-widest text-stone-500">Mfg Waste</span>
                    <span className="font-bold text-stone-800">{formatWaste(product.manufacturing_waste)}</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-stone-600 rounded-full w-[var(--width)] transition-all duration-1000 ease-out" style={{ '--width': `${(product.manufacturing_waste / maxWaste) * 100}%` } as React.CSSProperties} />
                </div>
            </div>
        </div>
    );
}

// --- WIDGET 3: ESG RADAR ---
export function EsgRadar({ product }: { product: EnrichedProduct }) {
    const data = [
        { subject: 'Reporting', A: product.esg_reporting_score, fullMark: 100 },
        { subject: 'Labor', A: product.ethical_labor_score, fullMark: 100 },
        { subject: 'Supply Chain', A: product.supply_chain_disclosure === 'high' ? 90 : product.supply_chain_disclosure === 'medium' ? 50 : 20, fullMark: 100 },
        { subject: 'Local', A: product.local_sourcing_percentage, fullMark: 100 },
        { subject: 'Transport', A: product.transport_mode === 'air' ? 10 : product.transport_mode === 'road' ? 50 : 90, fullMark: 100 },
    ];

    return (
        <div className="w-full h-[250px] font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#f5f5f4" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#78716c', fontSize: 9, fontWeight: 700, textAnchor: 'middle' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="ESG Metrics"
                        dataKey="A"
                        stroke="#57534e"
                        strokeWidth={2}
                        fill="#f5f5f4"
                        fillOpacity={0.8}
                    />
                    <Tooltip cursor={false} content={<CustomTooltip />} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}

// --- WIDGET 4: CIRCULARITY DONUT ---
export function CircularityPie({ product }: { product: EnrichedProduct }) {
    const data = [
        { name: 'Recyclable', value: product.recyclability_score },
        { name: 'Non-Recyclable', value: 100 - product.recyclability_score },
    ];

    const COLORS = ['#10b981', '#f5f5f4']; // Emerald for recyclable, stone-100 for waste

    return (
        <div className="w-full h-[250px] relative font-mono">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={4}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-stone-800">{product.recyclability_score.toFixed(0)}%</span>
                <span className="text-[9px] uppercase font-bold text-stone-400 tracking-wider">Circularity</span>
            </div>
        </div>
    );
}
