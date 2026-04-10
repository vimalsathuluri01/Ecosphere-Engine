'use client';

import { BrandData, AHP_WEIGHTS } from '@/lib/methodology';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
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
    // 3D Tilt Logic for Radar Card
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXPos = e.clientX - rect.left;
        const mouseYPos = e.clientY - rect.top;
        x.set((mouseXPos / width) - 0.5);
        y.set((mouseYPos / height) - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

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

    const [activeChapter, setActiveChapter] = useState(1);
    const sectionRefs = {
        1: useRef<HTMLElement>(null),
        2: useRef<HTMLElement>(null),
        3: useRef<HTMLElement>(null),
        4: useRef<HTMLElement>(null),
    };

    useEffect(() => {
        const observers = Object.entries(sectionRefs).map(([id, ref]) => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveChapter(Number(id));
                },
                { threshold: 0.3 }
            );
            if (ref.current) observer.observe(ref.current);
            return observer;
        });
        return () => observers.forEach(o => o.disconnect());
    }, []);

    const InsightBlock = ({ text, className }: { text: string, className?: string }) => (
        <div className={cn("pl-4 border-l border-stone-200 mt-4 max-w-[260px]", className)}>
            <p className="font-sans text-stone-500 font-medium text-[13px] leading-snug tracking-tight">
                {text}
            </p>
        </div>
    );

    const GhostTrack = () => (
        <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-12 z-[100]">
            {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex flex-col items-center gap-4 group">
                    <span className={cn(
                        "font-mono text-[10px] font-black transition-all duration-500",
                        activeChapter === num ? "text-slate-900 scale-125" : "text-slate-200 group-hover:text-slate-400"
                    )}>
                        0{num}
                    </span>
                    <div className={cn(
                        "w-px h-12 transition-all duration-500",
                        activeChapter === num ? "bg-slate-900" : "bg-slate-100"
                    )} />
                </div>
            ))}
        </div>
    );

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

                <GhostTrack />

                <motion.div
                    className="space-y-6 relative xl:pl-12"
                >
                    {/* CHAPTER 01: THE VERDICT & IMPACT SUMMARY */}
                    <section ref={sectionRefs[1]} className="grid grid-cols-1 lg:grid-cols-10 gap-6">

                        {/* 60% Width - Identity & Benchmarking */}
                        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 flex flex-col justify-between shadow-sm">
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-10">
                                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-800 uppercase leading-none">
                                        {brand.Brand_Name}
                                    </h1>
                                    <Badge variant={brand.Sustainability_Rating === 'Good' ? "default" : "destructive"} className="text-xs md:text-sm font-mono tracking-widest uppercase flex-shrink-0 px-4 py-1.5 h-fit">
                                        Rating: {brand.Sustainability_Rating}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                                    <div className="space-y-1"><div>Sector</div><div className="text-slate-800 text-sm tracking-normal font-sans font-bold">{brand.Category}</div></div>
                                    <div className="space-y-1"><div>Region</div><div className="text-slate-800 text-sm tracking-normal font-sans font-bold">{brand.Country}</div></div>
                                    <div className="space-y-1"><div>Revenue</div><div className="text-slate-800 text-sm tracking-normal font-sans font-bold">${brand.Revenue_USD_Million.toLocaleString()}M</div></div>
                                    <div className="space-y-1"><div>Market Share</div><div className="text-slate-800 text-sm tracking-normal font-sans font-bold">{brand.Market_Share_Percent.toFixed(1)}%</div></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 border-t border-slate-100 pt-10 mt-12 pr-4">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Aggregate Index</div>
                                    <div className="flex flex-col">
                                        <div className="text-4xl font-black text-slate-800 tracking-tighter leading-none">{brand.finalScore?.toFixed(2)}</div>
                                        <div className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest mt-1">out of 100.00</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Global Ranking</div>
                                    <div className="flex flex-col">
                                        <div className="text-4xl font-black text-slate-800 tracking-tighter leading-none">#{brand.rank.toLocaleString()}</div>
                                        <div className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest mt-1">of {allBrands.length.toLocaleString()} brands</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Transparency</div>
                                    <div className="flex flex-col">
                                        <div className="text-4xl font-black text-slate-800 tracking-tighter leading-none">{brand.Transparency_Score_2024.toFixed(1)}</div>
                                        <div className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest mt-1">Audit Score / 100</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-rose-500 uppercase tracking-widest font-mono mb-2">Systemic Friction</div>
                                    <div className="text-4xl md:text-5xl font-black text-rose-500 tracking-tighter leading-none">{(brand.finalPenalty! * 100).toFixed(1)}<span className="text-lg text-rose-200 font-normal tracking-normal">%</span></div>
                                    <InsightBlock text="Your total ecological penalty. High friction creates immediate policy and market risk." />
                                </div>
                            </div>
                        </div>

                        {/* 40% Width - Operational Profile Radar (INTERACTIVE 3D UPGRADE) */}
                        <motion.div 
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            style={{ rotateX, rotateY, perspective: 1000 }}
                            className="lg:col-span-4 bg-white border border-stone-200 rounded-[2rem] p-8 md:p-10 relative overflow-hidden flex flex-col justify-between shadow-sm min-h-[420px] group"
                        >
                            
                            {/* Background Geometric Grid (With slight parallax) */}
                            <motion.div 
                                style={{ 
                                    x: useTransform(mouseX, [-0.5, 0.5], [-10, 10]), 
                                    y: useTransform(mouseY, [-0.5, 0.5], [-10, 10]),
                                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', 
                                    backgroundSize: '24px 24px' 
                                }}
                                className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                            />
                            
                            {/* Tracking Light / Glow */}
                            <motion.div 
                                style={{ 
                                    left: useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']),
                                    top: useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']),
                                }}
                                className="absolute w-64 h-64 bg-slate-900/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                            />

                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-stone-800 animate-pulse" />
                                        Operational Profile
                                    </div>
                                    <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400 mt-2">Structural Audit: Disclosure Quadrants</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-stone-400 font-mono uppercase tracking-widest mb-1">Stability</div>
                                    <div className="text-xl font-black text-stone-800">0.84<span className="text-[10px] text-stone-300">/1.0</span></div>
                                </div>
                            </div>

                            {/* Corner Nodes (Data Anchors with Hover Scale) */}
                            <div 
                                className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col gap-1 text-[9px] font-mono font-bold text-stone-400 uppercase z-10 transition-transform duration-500 group-hover:scale-110 group-hover:text-stone-900"
                            >
                                <span className="text-stone-300">MAT %</span>
                                <span className="text-stone-800 transition-colors">{brand.Sustainable_Material_Percent}%</span>
                            </div>
                            <div 
                                className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-1 text-[9px] font-mono font-bold text-stone-400 uppercase z-10 text-right transition-transform duration-500 group-hover:scale-110 group-hover:text-stone-900"
                            >
                                <span className="text-stone-300">ENGAGEMENT</span>
                                <span className="text-stone-800 transition-colors">{(brand.Consumer_Engagement_Score * 1).toFixed(1)}/10</span>
                            </div>

                            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40">
                                <div className="w-64 h-64 border border-stone-100 rounded-full flex items-center justify-center">
                                    <div className="w-48 h-48 border border-stone-50 rounded-full" />
                                </div>
                            </div>

                            <div className="absolute inset-0 z-0 mt-24 mb-6 transition-all duration-700 group-hover:scale-105">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                                        <PolarGrid stroke="#f1f5f9" strokeWidth={1} />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700, fontFamily: 'monospace' }} />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                                                borderRadius: '8px', 
                                                border: '1px solid #e2e8f0', 
                                                fontSize: '10px',
                                                fontFamily: 'monospace',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                            }} 
                                        />
                                        <Radar 
                                            name="Score" 
                                            dataKey="A" 
                                            stroke="#1e293b" 
                                            strokeWidth={3} 
                                            fill="#1e293b" 
                                            fillOpacity={0.06} 
                                            dot={{ r: 3, fill: '#1e293b', fillOpacity: 1 }}
                                            activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
                                            className="transition-all duration-700 group-hover:fill-opacity-10"
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="relative z-10 pt-16 border-t border-stone-100 mt-auto flex justify-between items-end">
                                <div className="space-y-1">
                                    <div className="text-[9px] font-bold font-mono text-stone-300 uppercase">Energy Delta</div>
                                    <div className="text-sm font-black text-emerald-600">+{brand.Renewable_Energy_Ratio}%</div>
                                </div>
                                <div className="w-32 h-1 bg-stone-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-stone-800" 
                                        style={{ width: '84%' }} 
                                    />
                                </div>
                            </div>
                        </motion.div>

                    </section>

                    {/* CHAPTER 02: THE FORENSIC PROOF */}
                    <section ref={sectionRefs[2]}>
                        <div className="flex justify-between items-end mb-6 mt-12 px-2">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-slate-400" />
                                <h3 className="text-xs font-bold tracking-widest uppercase font-mono text-slate-500">Forensic Proof: Intensity Benchmarks</h3>
                            </div>
                            <InsightBlock text="Measured intensity exceeds planetary limits. Structural failure driven by high resource consumption." className="mt-0" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <BoundaryCard
                                title="Carbon Intensity"
                                icon={<Factory className="w-4 h-4" />}
                                value={brand.Carbon_Intensity_MT_per_USD_Million.toFixed(1)}
                                limit={md.Carbon_Intensity_MT_per_USD_Million.toFixed(1)}
                                penalty={pCarbon}
                                total={`${(brand.Carbon_Footprint_MT / 1000000).toFixed(2)}M MT`}
                                unit="kg/$1M"
                            />
                            <BoundaryCard
                                title="Water Intensity"
                                icon={<Droplets className="w-4 h-4" />}
                                value={brand.Water_Intensity_L_per_USD_Million.toFixed(0)}
                                limit={md.Water_Intensity_L_per_USD_Million.toFixed(0)}
                                penalty={pWater}
                                total={`${(brand.Water_Usage_Liters / 1000000000).toFixed(2)}B L`}
                                unit="L/$1M"
                            />
                            <BoundaryCard
                                title="Waste Intensity"
                                icon={<Trash2 className="w-4 h-4" />}
                                value={brand.Waste_Intensity_KG_per_USD_Million.toFixed(1)}
                                limit={md.Waste_Intensity_KG_per_USD_Million.toFixed(1)}
                                penalty={pWaste}
                                total={`${(brand.Waste_Production_KG / 1000000).toFixed(2)}M KG`}
                                unit="kg/$1M"
                            />
                        </div>
                    </section>

                    {/* CHAPTER 03: THE SOURCE */}
                    <section ref={sectionRefs[3]} className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">

                        {/* 50% - Lifecycle Flow */}
                        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="w-5 h-5 text-slate-400" />
                                    <h3 className="text-[10px] font-bold tracking-widest uppercase font-mono text-slate-500">Lifecycle Footprint Gradient</h3>
                                </div>
                                <InsightBlock text="Footprint originates in raw material processing. Linear energy use compounds the drag." className="mt-0 text-right" />
                            </div>

                            <div className="space-y-6 relative flex-1 flex flex-col justify-center">
                                {/* Vertical connection line */}
                                <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-slate-100" />

                                <LifecycleStep title="Raw Material" value={brand.Material_Type} metadata={`${brand.Sustainable_Material_Percent.toFixed(1)}% Sustainable`} />
                                <LifecycleStep title="Manufacturing" value={brand.Production_Process} metadata={`${brand.Renewable_Energy_Ratio.toFixed(1)}% Renewable`} />
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
                                <DonutChart value={brand.Sustainable_Material_Percent.toFixed(1)} label="Sustainable Materials" color="#10b981" gradientId="grad-mat" />
                                <DonutChart value={brand.Renewable_Energy_Ratio.toFixed(1)} label="Renewable Energy" color="#0ea5e9" gradientId="grad-energy" />
                            </div>
                        </div>

                    </section>

                    {/* CHAPTER 04: MARKET CONTEXT (THE IMPACT MATH) */}
                    <section ref={sectionRefs[4]} className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-sm mt-6">
                        <div className="flex justify-between items-start mb-12">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-slate-400" />
                                <h3 className="text-[10px] font-bold tracking-widest uppercase font-mono text-slate-500">Intensity Differential (vs. Industry Median)</h3>
                            </div>
                            <InsightBlock text={`Operating far beyond the scientific safe-zone for the ${brand.Category} sector.`} className="mt-0 text-right" />
                        </div>
                        <div className="space-y-12">
                            <DeviationAxisRow 
                                title="Carbon Multiplier" 
                                multiplier={brand.Carbon_Intensity_MT_per_USD_Million / Math.max(0.001, md.Carbon_Intensity_MT_per_USD_Million)} 
                            />
                            <DeviationAxisRow 
                                title="Water Multiplier" 
                                multiplier={brand.Water_Intensity_L_per_USD_Million / Math.max(1, md.Water_Intensity_L_per_USD_Million)} 
                            />
                            <DeviationAxisRow 
                                title="Waste Multiplier" 
                                multiplier={brand.Waste_Intensity_KG_per_USD_Million / Math.max(1, md.Waste_Intensity_KG_per_USD_Million)} 
                            />
                        </div>
                    </section>

                    <BrandExplanationWidgets brand={brand} allBrands={allBrands} />

                </motion.div>
            </div>
        </div>
    );
}

function DeviationAxisRow({ title, multiplier }: { title: string, multiplier: number }) {
    const isCrisis = multiplier > 1.2;
    // Map multiplier to percentage (clamp 1.0 at 20%, 5.0+ at 90%)
    const markerPosition = Math.min(95, 20 + (multiplier - 1) * 15);
    const gapWidth = markerPosition - 20;

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">{title}</span>
                <span className={cn(
                    "font-mono text-2xl font-black tracking-tighter",
                    isCrisis ? "text-rose-500" : "text-emerald-600"
                )}>
                    {multiplier.toFixed(2)}x
                </span>
            </div>
            
            <div className="relative h-12 w-full flex items-center">
                {/* Horizontal Scale Line */}
                <div className="absolute inset-x-0 h-[1px] bg-stone-100" />
                
                {/* Median Goalpost (1.0x) */}
                <div className="absolute left-[20%] h-full w-[2px] bg-stone-900/10 z-10">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold text-stone-300 uppercase">Median (1.0x)</div>
                </div>

                {/* Penalty Zone (Hashed Gap) */}
                {isCrisis && (
                    <div 
                        className="absolute left-[20%] h-6 bg-rose-50 border-y border-rose-100/50 opacity-60 z-0"
                        style={{ 
                            width: `${gapWidth}%`,
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, #fecaca 4px, #fecaca 5px)'
                        }}
                    />
                )}

                {/* Brand Marker */}
                <motion.div 
                    initial={{ left: '20%' }}
                    animate={{ left: `${markerPosition}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn(
                        "absolute h-10 w-3 -translate-x-1/2 rounded-full z-20 shadow-sm",
                        isCrisis ? "bg-rose-500" : "bg-emerald-500"
                    )}
                >
                    {/* Pulsing Aura if Crisis */}
                    {isCrisis && <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-20" />}
                </motion.div>

                {/* Tail Label */}
                {isCrisis && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute left-[20.5%] text-[9px] font-mono font-bold text-rose-400 uppercase tracking-widest ml-4"
                        style={{ top: '65%' }}
                    >
                        Systemic Deviation
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function BoundaryCard({ title, icon, value, limit, penalty, total, unit }: any) {
    const isCritical = penalty > 0;
    const progress = Math.min(100, (value / limit) * 100);
    const safeTitle = title.replace(/\W/g, '').toLowerCase() || 'penalty';

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
                        BASELINE DEVIATION
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
                    MEASURED INTENSITY
                </div>
                <div className="flex flex-wrap items-baseline gap-1.5">
                    <span className="font-sans font-black text-4xl text-stone-800 tracking-tighter truncate max-w-full">
                        {value.toLocaleString()}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-stone-400 uppercase whitespace-nowrap">
                        {unit}
                    </span>
                </div>
            </div>

            {/* Progress Bar / Limit */}
            <div className="mb-8">
                <style dangerouslySetInnerHTML={{ __html: `.prog-${safeTitle} { width: ${Math.min(progress, 100)}%; }` }} />
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden relative">
                    <div
                        className={cn("absolute top-0 left-0 bottom-0 rounded-full", isCritical ? "bg-rose-500" : "bg-stone-800", `prog-${safeTitle}`)}
                    />
                </div>
                <div className="flex justify-end mt-2.5">
                    <span className="font-mono text-[11px] font-bold text-stone-500 uppercase tracking-widest whitespace-nowrap">
                        Limit: {limit.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Footer Metrics */}
            <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-6">
                <div className="overflow-hidden">
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">
                        TOTAL VOL
                    </div>
                    <div className="font-mono text-sm font-black text-stone-800 truncate">
                        {total}
                    </div>
                </div>
                <div className="overflow-hidden">
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">
                        DRAG
                    </div>
                    <div className={cn("font-mono text-lg font-black truncate", isCritical ? "text-rose-600" : "text-emerald-600")}>
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

function DonutChart({ value, label, color = "#10b981", gradientId }: any) {
    const data = [
        { name: 'Active', value: Number(value) },
        { name: 'Remaining', value: 100 - Number(value) }
    ];
    
    // Choose secondary color based on primary for the gradient
    const stopColor = color === "#10b981" ? "#059669" : "#0284c7";

    return (
        <div className="flex flex-col items-center justify-center group">
            <div className="w-full relative h-[160px]">
                {/* Secondary Orbital Ring - Visual Depth */}
                <div className="absolute inset-x-0 inset-y-0 flex items-center justify-center opacity-[0.05]">
                    <div className="w-32 h-32 border-[0.5px] border-stone-900 rounded-full" />
                </div>
                
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={1}/>
                                <stop offset="95%" stopColor={stopColor} stopOpacity={1}/>
                            </linearGradient>
                        </defs>
                        <Pie
                            data={data}
                            innerRadius={52}
                            outerRadius={65}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={6}
                        >
                            <Cell key="cell-0" fill={`url(#${gradientId})`} />
                            <Cell key="cell-1" fill="#f8fafc" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter transition-transform group-hover:scale-110 duration-500">{value}%</span>
                    <div className="w-4 h-0.5 bg-stone-100 mt-1" />
                </div>
            </div>
            <div className="text-[10px] uppercase font-mono tracking-[0.2em] text-stone-400 mt-6 text-center font-bold px-4 leading-relaxed transition-colors group-hover:text-stone-600">
                {label}
            </div>
        </div>
    );
}
