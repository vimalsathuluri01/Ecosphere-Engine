'use client';

import { BrandData, AHP_WEIGHTS } from '@/lib/methodology';
import { motion } from 'framer-motion';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Factory, Droplets, Trash2, ShieldCheck, Leaf, TrendingUp, ArrowLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { BrandExplanationWidgets } from '@/components/brand-analytics/BrandExplanationWidgets';

export function BrandAnalyticsDetails({ brand, allBrands, md }: { brand: BrandData, allBrands: BrandData[], md: any }) {
    // Section A: Radar Data
    const radarData = [
        { subject: 'Transparency', A: brand.Transparency_Score_2024, fullMark: 100 },
        { subject: 'Engagement', A: brand.Consumer_Engagement_Score * 10, fullMark: 100 },
        { subject: 'Renewable Energy', A: brand.Renewable_Energy_Ratio, fullMark: 100 },
        { subject: 'Sustainable %', A: brand.Sustainable_Material_Percent, fullMark: 100 },
    ];

    const pCarbon = brand.pCarbon || 0;
    const pWater = brand.pWater || 0;
    const pWaste = brand.pWaste || 0;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-rose-200 selection:text-slate-900 font-sans pt-32 pb-24 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto">

                {/* Top Navigation Section */}
                <nav className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <Link
                        href="/brands"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:shadow-sm transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Brands
                    </Link>

                    <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">
                        <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/brands" className="hover:text-slate-900 transition-colors">Brands</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-900">{brand.Brand_Name}</span>
                    </div>
                </nav>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6"
                >
                    {/* ZONE A: BRAND HERO & CORE SYSTEM DIAGNOSTICS */}
                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">

                        {/* 60% Width - Identity & Scores */}
                        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 flex flex-col justify-between shadow-sm">
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-10">
                                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                                        {brand.Brand_Name}
                                    </h1>
                                    <Badge variant={brand.Sustainability_Rating === 'Good' ? "default" : "destructive"} className="text-xs md:text-sm font-mono tracking-widest uppercase flex-shrink-0 px-4 py-1.5 h-fit">
                                        {brand.Sustainability_Rating}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                                    <div className="space-y-1"><div>Category</div><div className="text-slate-900 text-sm tracking-normal font-sans font-black">{brand.Category}</div></div>
                                    <div className="space-y-1"><div>Origin</div><div className="text-slate-900 text-sm tracking-normal font-sans font-black">{brand.Country}</div></div>
                                    <div className="space-y-1"><div>Revenue</div><div className="text-slate-900 text-sm tracking-normal font-sans font-black">${brand.Revenue_USD_Million.toLocaleString()}M</div></div>
                                    <div className="space-y-1"><div>Market Share</div><div className="text-slate-900 text-sm tracking-normal font-sans font-black">{brand.Market_Share_Percent}%</div></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 border-t border-slate-100 pt-10 mt-12 pr-4">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Final Score</div>
                                    <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">{brand.finalScore?.toFixed(2)}<span className="text-lg text-slate-300 font-normal tracking-normal">/100</span></div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Global Rank</div>
                                    <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">#{brand.rank}<span className="text-lg text-slate-300 font-normal tracking-normal">/{allBrands.length}</span></div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Transparency</div>
                                    <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">{brand.Transparency_Score_2024}<span className="text-lg text-slate-300 font-normal tracking-normal">/100</span></div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-rose-500 uppercase tracking-widest font-mono mb-2">Penalty Drag</div>
                                    <div className="text-4xl md:text-5xl font-black text-rose-500 tracking-tighter leading-none">{(brand.finalPenalty! * 100).toFixed(1)}<span className="text-lg text-rose-300/50 font-normal tracking-normal">%</span></div>
                                </div>
                            </div>
                        </div>

                        {/* 40% Width - Structural Balance Radar */}
                        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-[2rem] p-8 md:p-12 relative overflow-hidden flex flex-col justify-between shadow-sm min-h-[400px]">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono relative z-10 flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                Operational Pillars
                            </div>
                            <div className="absolute inset-0 z-0 mt-8 mb-4 mx-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                                        <PolarGrid stroke="#1e293b" />
                                        <PolarAngleAxis dataKey="subject" className="text-[9px] font-bold font-mono tracking-widest uppercase fill-slate-400" />
                                        <Radar name="Brand" dataKey="A" stroke="#38bdf8" strokeWidth={2} fill="#38bdf8" fillOpacity={0.15} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>

                    {/* ZONE B: ABSOLUTE ENVIRONMENTAL CONSTRAINTS (3 Cards) */}
                    <div>
                        <div className="flex items-center gap-3 mb-6 mt-12 px-2">
                            <AlertTriangle className="w-5 h-5 text-slate-400" />
                            <h3 className="text-xs font-bold tracking-widest uppercase font-mono text-slate-500">Environmental Cost & Penalty Functions</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <BoundaryCard
                                title="Carbon Intensity"
                                icon={<Factory className="w-4 h-4" />}
                                value={brand.Carbon_Intensity_MT_per_USD_Million}
                                limit={md.Carbon_Intensity_MT_per_USD_Million}
                                penalty={pCarbon}
                                total={`${(brand.Carbon_Footprint_MT / 1000000).toFixed(2)}M MT`}
                                unit="kg/$1M"
                            />
                            <BoundaryCard
                                title="Water Intensity"
                                icon={<Droplets className="w-4 h-4" />}
                                value={brand.Water_Intensity_L_per_USD_Million}
                                limit={md.Water_Intensity_L_per_USD_Million}
                                penalty={pWater}
                                total={`${(brand.Water_Usage_Liters / 1000000000).toFixed(2)}B L`}
                                unit="L/$1M"
                            />
                            <BoundaryCard
                                title="Waste Intensity"
                                icon={<Trash2 className="w-4 h-4" />}
                                value={brand.Waste_Intensity_KG_per_USD_Million}
                                limit={md.Waste_Intensity_KG_per_USD_Million}
                                penalty={pWaste}
                                total={`${(brand.Waste_Production_KG / 1000000).toFixed(2)}M KG`}
                                unit="kg/$1M"
                            />
                        </div>
                    </div>

                    {/* ZONE C: SUPPLY CHAIN DESTRUCTIVITY */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">

                        {/* 50% - Lifecycle Model */}
                        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-sm flex flex-col justify-between">
                            <div className="flex items-center gap-3 mb-10">
                                <TrendingUp className="w-5 h-5 text-slate-400" />
                                <h3 className="text-[10px] font-bold tracking-widest uppercase font-mono text-slate-500">Lifecycle Flow Gradient</h3>
                            </div>

                            <div className="space-y-6 relative flex-1 flex flex-col justify-center">
                                {/* Vertical connection line */}
                                <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-slate-100" />

                                <LifecycleStep title="Raw Material" value={brand.Material_Type} metadata={`${brand.Sustainable_Material_Percent}% Sustainable`} />
                                <LifecycleStep title="Manufacturing" value={brand.Production_Process} metadata={`${brand.Renewable_Energy_Ratio}% Renewable`} />
                                <LifecycleStep title="Distribution & Retail" value={`${brand.Annual_Units_Million} Million Units`} metadata="Absolute Market Scale" />
                            </div>
                        </div>

                        {/* 50% - Circularity / Efficiency Donuts */}
                        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-sm flex flex-col justify-between">
                            <div className="flex items-center gap-3 mb-8">
                                <Leaf className="w-5 h-5 text-emerald-400" />
                                <h3 className="text-[10px] font-bold tracking-widest uppercase font-mono text-slate-500">Circularity & Resource Efficiency</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-8 flex-1 items-center">
                                <DonutChart value={brand.Sustainable_Material_Percent} label="Sustainable Materials" color="#10b981" />
                                <DonutChart value={brand.Renewable_Energy_Ratio} label="Renewable Energy" color="#0ea5e9" />
                            </div>
                        </div>

                    </div>

                    {/* ZONE D: MEDIAN CONSTRAINTS MAP */}
                    <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-sm mt-6">
                        <div className="flex items-center gap-3 mb-12">
                            <ShieldCheck className="w-5 h-5 text-slate-400" />
                            <h3 className="text-[10px] font-bold tracking-widest uppercase font-mono text-slate-500">Intensity Relative to Median Constraints</h3>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={[
                                        { name: 'Carbon', Brand: brand.normalized?.Carbon_Intensity_MT_per_USD_Million, Median: 0.5 },
                                        { name: 'Water', Brand: brand.normalized?.Water_Intensity_L_per_USD_Million, Median: 0.5 },
                                        { name: 'Waste', Brand: brand.normalized?.Waste_Intensity_KG_per_USD_Million, Median: 0.5 },
                                    ]}
                                    margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                                    maxBarSize={60}
                                    barGap={10}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis hide />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="Brand" fill="#0f172a" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="Median" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <BrandExplanationWidgets brand={brand} allBrands={allBrands} />

                </motion.div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function BoundaryCard({ title, icon, value, limit, penalty, total, unit }: any) {
    const isCritical = penalty > 0;
    const progress = Math.min(100, (value / limit) * 100);

    return (
        <article className={cn("relative bg-white border rounded-[28px] p-6 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1", isCritical ? "border-rose-200" : "border-stone-200")}>

            {/* Background glow if issue exists */}
            {isCritical && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 to-rose-500" />
            )}

            {/* Badges Row */}
            <div className="flex justify-between items-start mb-6 w-full">
                <div className="flex items-center gap-2">
                    {isCritical && (
                        <div className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span>1 Issue</span>
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    )}
                    {!isCritical && icon && (
                        <div className="text-stone-400 bg-stone-50 p-1.5 rounded-md">
                            {icon}
                        </div>
                    )}
                </div>

                {isCritical && (
                    <span className="text-[9px] font-bold text-rose-500 tracking-wider uppercase bg-rose-50 px-2 py-0.5 rounded border border-rose-100 shrink-0 mt-0.5">
                        PENALTY TRIGGER
                    </span>
                )}
            </div>

            {/* Title */}
            <h4 className="text-[10px] font-bold text-stone-500 tracking-[0.2em] uppercase mb-4">
                {title}
            </h4>

            {/* Main Value */}
            <div className="mb-6">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                    RAW INTENSITY
                </div>
                <div className="flex flex-wrap items-baseline gap-1.5">
                    <span className="font-sans font-black text-4xl text-stone-900 tracking-tighter truncate max-w-full">
                        {value.toLocaleString()}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-stone-400 uppercase whitespace-nowrap">
                        {unit}
                    </span>
                </div>
            </div>

            {/* Progress Bar / Limit */}
            <div className="mb-8">
                <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden relative">
                    <div
                        className={cn("absolute top-0 left-0 bottom-0 rounded-full", isCritical ? "bg-rose-500" : "bg-stone-800")}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
                <div className="flex justify-end mt-2">
                    <span className="font-mono text-[9px] font-bold text-stone-400 uppercase tracking-widest whitespace-nowrap">
                        Limit: {limit.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Footer Metrics */}
            <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-4">
                <div className="overflow-hidden">
                    <div className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                        TOTAL VOL
                    </div>
                    <div className="font-mono text-xs font-bold text-stone-800 truncate">
                        {total}
                    </div>
                </div>
                <div className="overflow-hidden">
                    <div className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                        DRAG
                    </div>
                    <div className={cn("font-mono text-xs font-bold truncate", isCritical ? "text-rose-600" : "text-emerald-600")}>
                        {(penalty * 100).toFixed(1)}%
                    </div>
                </div>
            </div>
        </article>
    );
}

function LifecycleStep({ title, value, metadata }: any) {
    return (
        <div className="flex items-center gap-5 relative z-10">
            <div className="w-6 h-6 rounded-full bg-slate-900 border-4 border-white shadow-sm flex-shrink-0" />
            <div className="flex-1">
                <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400">{title}</div>
                <div className="text-lg font-black text-slate-900 tracking-tight leading-tight mt-0.5">{value}</div>
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono bg-slate-50 border border-slate-200 px-4 py-2 rounded-full whitespace-nowrap hidden sm:block">
                {metadata}
            </div>
        </div>
    );
}

function DonutChart({ value, label, color = "#10b981" }: any) {
    const data = [
        { name: 'Active', value: value },
        { name: 'Remaining', value: 100 - value }
    ];
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full relative h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={50}
                            outerRadius={65}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                        >
                            <Cell key="cell-0" fill={color} />
                            <Cell key="cell-1" fill="#f1f5f9" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">{value}%</span>
                </div>
            </div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mt-6 text-center font-bold px-4 leading-relaxed">
                {label}
            </div>
        </div>
    );
}
