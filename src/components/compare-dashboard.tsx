'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BrandData } from '@/lib/methodology';
import { cn } from '@/lib/utils';
import { Zap, AlertCircle, Target, Scale, Leaf, AlertTriangle, TrendingDown, Users, Plus, X, Globe, FileText, Search, RefreshCw, BarChart3, ShieldCheck } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ScatterChart, Scatter, ReferenceLine, ReferenceArea,
    Cell, Label
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// --- SIMPLE CARD WRAPPER ---
const ZenCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("bg-white border border-stone-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_12px_45px_rgba(0,0,0,0.06)]", className)}>
        {children}
    </div>
);

const HeaderText = ({ children, icon }: { children: React.ReactNode, icon?: React.ReactNode }) => (
    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400 mb-6 flex items-center gap-3">
        {icon && <span className="opacity-50">{icon}</span>}
        {children}
    </h3>
);

// --- RECHARTS TOOLTIP ---
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-stone-200 p-4 shadow-2xl rounded-2xl pointer-events-none z-50">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-2 border-b border-stone-100 pb-2">
                    {label || payload[0].payload.brandName || payload[0].name}
                </p>
                {payload.map((entry: any, index: number) => {
                    const val = typeof entry.value === 'number' ? 
                        (Number.isInteger(entry.value) ? entry.value : entry.value.toFixed(1)) : 
                        (entry.value || '0');
                    return (
                        <div key={index} className="flex items-baseline justify-between gap-6">
                            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Score</span>
                            <span className="text-sm font-mono font-black text-stone-900">{val}</span>
                        </div>
                    );
                })}
            </div>
        );
    }
    return null;
};

interface CompareProps {
    allBrands: BrandData[];
}

const BRAND_COLORS = ["#0ea5e9", "#f43f5e", "#10b981", "#8b5cf6"];
const SELECT_PLACEHOLDER = "CHOOSE_BRAND";

// --- SEARCHABLE SELECTOR COMPONENT ---
function BrandSearchSelector({
    allBrands,
    currentValue,
    onSelect,
    color,
    brandIndex,
    disabledNames
}: {
    allBrands: BrandData[],
    currentValue: string,
    onSelect: (name: string) => void,
    color: string,
    brandIndex: number,
    disabledNames: string[]
}) {
    const isPlaceholder = currentValue === SELECT_PLACEHOLDER;
    const [isOpen, setIsOpen] = useState(isPlaceholder);
    const [search, setSearch] = useState("");
    const [shuffledPool, setShuffledPool] = useState<BrandData[]>(allBrands);

    useEffect(() => {
        setShuffledPool([...allBrands].sort(() => Math.random() - 0.5));
    }, [allBrands]);

    useEffect(() => {
        if (isPlaceholder) setIsOpen(true);
    }, [isPlaceholder]);

    const refreshPool = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShuffledPool([...allBrands].sort(() => Math.random() - 0.5));
    };

    const filtered = search.length > 0
        ? allBrands.filter(b =>
            b.Brand_Name.toLowerCase().includes(search.toLowerCase())
        ).slice(0, 50)
        : shuffledPool.slice(0, 50);

    return (
        <div className="relative h-full flex items-center pr-4">
            <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-xl shrink-0 shadow-inner transition-all",
                isPlaceholder ? "bg-stone-100 text-stone-300" : ""
            )} style={{ backgroundColor: isPlaceholder ? undefined : color }}>
                {isPlaceholder ? "?" : currentValue.charAt(0)}
            </div>
            <div className="ml-4 flex-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    className={cn(
                        "text-lg font-black bg-transparent border-none p-0 focus:ring-0 cursor-pointer w-full text-left uppercase tracking-tighter truncate transition-colors",
                        isPlaceholder ? "text-stone-300 italic" : "text-stone-800"
                    )}
                >
                    {isPlaceholder ? "ADD BRAND..." : currentValue}
                </button>
                <div className="text-[10px] font-bold text-stone-400 tracking-widest uppercase">
                    {isPlaceholder ? "Waiting" : "Change Brand"}
                </div>
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60]" onClick={() => {
                        if (!isPlaceholder) setIsOpen(false);
                    }} />
                    <div className="absolute top-[calc(100%+0.75rem)] left-0 right-[-100px] md:right-0 bg-white border border-stone-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[70] p-5 max-h-[500px] flex flex-col">
                        <div className="flex gap-2 mb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                                <input
                                    autoFocus
                                    placeholder="SEARCH NAMES..."
                                    className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-100 rounded-xl text-xs font-mono font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={refreshPool}
                                className="p-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-600 transition-colors"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                            {filtered.map(brand => (
                                <button
                                    key={brand.Brand_Name}
                                    disabled={disabledNames.includes(brand.Brand_Name)}
                                    onClick={() => {
                                        onSelect(brand.Brand_Name);
                                        setIsOpen(false);
                                        setSearch("");
                                    }}
                                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-20 flex justify-between items-center group/opt transition-colors"
                                >
                                    <span className="truncate uppercase tracking-tighter">{brand.Brand_Name}</span>
                                    <span className="text-[10px] text-stone-400 font-mono">{brand.finalScore?.toFixed(0)}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export function CompareDashboard({ allBrands }: CompareProps) {
    const searchParams = useSearchParams();
    const urlBrands = searchParams.get('brands')?.split(',') || [];

    const [selectedNames, setSelectedNames] = useState<string[]>(() => {
        if (urlBrands.length >= 2) return urlBrands.slice(0, 4);
        return allBrands.slice(0, 2).map(b => b.Brand_Name);
    });
    
    const [workerResults, setWorkerResults] = useState<any>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (selectedNames.includes(SELECT_PLACEHOLDER)) return;
            setIsCalculating(true);
            const worker = new Worker('/workers/engine-worker.js');
            worker.onmessage = (e) => {
                setWorkerResults(e.data);
                setIsCalculating(false);
            };
            worker.postMessage({ allBrands, selectedNames });
            return () => worker.terminate();
        }
    }, [allBrands, selectedNames]);

    if (!workerResults || (isCalculating && !selectedNames.includes(SELECT_PLACEHOLDER))) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Loading Analysis</div>
            </div>
        );
    }

    const {
        activeBrands,
        radarData,
        sortedByScore,
        winner,
        loser,
        scoreDelta,
        hypotheticalWaterA,
        waterSavedA,
        isPrimaryBestWater,
        switchCarbonSaved
    } = workerResults;

    const handleBrandChange = (index: number, newName: string) => {
        const newNames = [...selectedNames];
        newNames[index] = newName;
        setSelectedNames(newNames);
    };

    const addBrand = () => {
        if (selectedNames.length >= 4) return;
        setSelectedNames([...selectedNames, SELECT_PLACEHOLDER]);
    };

    const removeBrand = (index: number) => {
        if (selectedNames.length <= 2) return;
        setSelectedNames(selectedNames.filter((_, i) => i !== index));
    };

    return (
        <div className={cn("space-y-12 font-sans pb-32", isPrinting && "print-mode")}>
            
            {/* 1. SELECTION HEADER */}
            <div className="no-print">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1400px]">
                    {selectedNames.map((name, idx) => {
                        const brand = allBrands.find(b => b.Brand_Name === name);
                        const isPlaceholder = name === SELECT_PLACEHOLDER;
                        const score = brand?.finalScore ?? 0;
                        
                        return (
                            <div key={`${idx}-${name}`} className="relative group/brand-node h-20 flex items-stretch bg-white border border-stone-200 rounded-2xl shadow-sm transition-all duration-300 hover:border-stone-400">
                                <div className="flex-1 min-w-0 px-4">
                                    <BrandSearchSelector
                                        allBrands={allBrands}
                                        currentValue={name}
                                        color={BRAND_COLORS[idx]}
                                        brandIndex={idx}
                                        disabledNames={selectedNames}
                                        onSelect={(name) => handleBrandChange(idx, name)}
                                    />
                                </div>
                                <div className={cn(
                                    "w-36 flex items-center justify-center border-l border-stone-100 transition-colors shrink-0",
                                    isPlaceholder ? "bg-stone-50" :
                                    score >= 60 ? "bg-emerald-50 text-emerald-600" : score >= 40 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                                )}>
                                    <div className="text-right pr-4">
                                        <div className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Grade</div>
                                        <div className="text-3xl font-mono font-black tracking-tighter leading-none">{isPlaceholder ? "--" : score.toFixed(0)}</div>
                                    </div>
                                    <div className={cn("w-1.5 h-12 rounded-full", isPlaceholder ? "bg-stone-200" : score >= 60 ? "bg-emerald-400" : score >= 40 ? "bg-amber-400" : "bg-rose-400")} />
                                </div>
                                {selectedNames.length > 2 && (
                                    <button onClick={() => removeBrand(idx)} className="absolute top-2 right-2 bg-stone-900/10 hover:bg-rose-600 hover:text-white text-stone-400 rounded-full w-5 h-5 flex items-center justify-center transition-all z-[50] opacity-0 group-hover/brand-node:opacity-100">
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    {selectedNames.length < 4 && (
                        <button onClick={addBrand} className="h-20 border-2 border-dashed border-stone-200 rounded-2xl flex items-center justify-center text-stone-300 hover:text-stone-600 hover:border-stone-400 hover:bg-white transition-all duration-300 gap-3 group/add">
                            <Plus className="w-5 h-5 group-hover/add:scale-125 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-widest">Compare Another</span>
                        </button>
                    )}
                </div>
            </div>

            {/* 2. CORE ANALYTICS WIDGETS */}
            <AnimatePresence mode="wait">
                {!selectedNames.includes(SELECT_PLACEHOLDER) && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-12 gap-8"
                    >
                        {/* W1: Leaderboard */}
                        <ZenCard className="col-span-12 flex flex-col md:flex-row items-center border-l-8 border-l-emerald-400 p-8">
                            <div className="flex-1 md:pr-12">
                                <HeaderText icon={<Target className="w-4 h-4" />}>Comparison Leaderboard</HeaderText>
                                <h2 className="text-4xl font-black text-stone-900 uppercase tracking-tighter mb-4">{winner.Brand_Name} is <span className="text-emerald-500">leading the race</span></h2>
                                <p className="text-stone-600 text-xl font-serif italic max-w-3xl leading-relaxed">
                                    <strong className="text-stone-900">{winner.Brand_Name}</strong> is performing <strong className="font-mono text-emerald-600">{Math.round(scoreDelta)}% better</strong> than <strong className="text-stone-900">{loser.Brand_Name}</strong>. This shows a big gap in how they use resources.
                                </p>
                            </div>
                            <div className="shrink-0 flex items-end gap-4 h-40 mt-8 md:mt-0">
                                {sortedByScore.map((b, i) => (
                                    <div key={b.Brand_Name} className="flex flex-col items-center">
                                        <div className={cn("text-sm font-mono font-black mb-1", i === 0 ? "text-emerald-600" : "text-stone-400")}>{b.finalScore?.toFixed(0)}</div>
                                        <div className={cn("w-14 rounded-t-2xl transition-all duration-1000", i === 0 ? "bg-emerald-400" : "bg-stone-100")} style={{ height: `${(b.finalScore! / 100) * 100 + 20}px` }}></div>
                                        <div className="mt-3 text-[9px] font-bold text-stone-400 uppercase tracking-widest truncate w-14 text-center">{b.Brand_Name}</div>
                                    </div>
                                ))}
                            </div>
                        </ZenCard>

                        {/* W2: Carbon Comparison */}
                        <ZenCard className="col-span-12 lg:col-span-6 p-10 pb-20">
                            <HeaderText icon={<Scale className="w-4 h-4" />}>Carbon Footprint Comparison</HeaderText>
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-28 text-center">Lower is better: Amount of CO2 released per $1M earned</p>
                            
                            <div className="relative h-64 w-full flex items-center px-12 mt-12 overflow-visible">
                                <div className="absolute left-8 right-8 h-2.5 bg-stone-50 rounded-full border border-stone-100 shadow-inner">
                                    <div className="absolute h-full bg-stone-200/50" style={{
                                        left: `${Math.min(...activeBrands.map(b => b.Carbon_Intensity_MT_per_USD_Million)) / 200 * 100}%`,
                                        width: `${(Math.max(...activeBrands.map(b => b.Carbon_Intensity_MT_per_USD_Million)) - Math.min(...activeBrands.map(b => b.Carbon_Intensity_MT_per_USD_Million))) / 200 * 100}%`
                                    }} />
                                </div>
                                
                                {activeBrands.map((b, idx) => {
                                    const verticalLevels = [
                                        { pos: 'top', offset: '-top-24', line: 'h-20' },
                                        { pos: 'bottom', offset: 'top-20', line: 'h-16' },
                                        { pos: 'top', offset: '-top-16', line: 'h-12' },
                                        { pos: 'bottom', offset: 'top-12', line: 'h-8' }
                                    ];
                                    const level = verticalLevels[idx % 4];

                                    return (
                                        <div key={b.Brand_Name} className="absolute flex flex-col items-center group z-10 hover:z-50" style={{
                                            left: `${Math.min(b.Carbon_Intensity_MT_per_USD_Million / 200 * 100, 95)}%`,
                                        }}>
                                            <div className={cn("absolute flex flex-col items-center whitespace-nowrap transition-all duration-300", level.offset)}>
                                                {level.pos === 'top' && (
                                                    <>
                                                        <span className="font-black uppercase tracking-tighter text-[10px] px-2.5 py-1.5 bg-white border border-stone-100 rounded-xl shadow-lg group-hover:scale-110 transition-transform" style={{ color: BRAND_COLORS[idx] }}>
                                                            {b.Brand_Name}
                                                        </span>
                                                        <div className={cn("w-px bg-stone-200 opacity-50", level.line)} />
                                                    </>
                                                )}
                                                {level.pos === 'bottom' && (
                                                    <>
                                                        <div className={cn("w-px bg-stone-200 opacity-50", level.line)} />
                                                        <span className="font-black uppercase tracking-tighter text-[10px] px-2.5 py-1.5 bg-white border border-stone-100 rounded-xl shadow-lg group-hover:scale-110 transition-transform" style={{ color: BRAND_COLORS[idx] }}>
                                                            {b.Brand_Name}
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            <div className="w-10 h-10 rounded-full border-[4px] border-white shadow-xl flex items-center justify-center transition-all group-hover:scale-125 z-20" style={{
                                                backgroundColor: BRAND_COLORS[idx]
                                            }}>
                                                <span className="text-[10px] font-mono font-black text-white">
                                                    {b.Carbon_Intensity_MT_per_USD_Million.toFixed(0)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ZenCard>

                        {/* W3: Risk Zones */}
                        <ZenCard className="col-span-12 lg:col-span-6 p-10">
                            <HeaderText icon={<AlertTriangle className="w-4 h-4" />}>Environmental Risk Level</HeaderText>
                            <div className="h-[240px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 0 }}>
                                        <XAxis 
                                            type="number" 
                                            dataKey="x" 
                                            name="Intensity" 
                                            domain={[0, 200]} 
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#a8a29e', fontSize: 10, fontWeight: 700 }}
                                        >
                                            <Label value="Impact Score" offset={-15} position="insideBottom" className="text-[10px] font-black uppercase tracking-widest fill-stone-400" />
                                        </XAxis>
                                        <YAxis type="number" dataKey="y" hide domain={[0, 100]} />
                                        
                                        <ReferenceArea x1={0} x2={60} fill="#10b981" fillOpacity={0.08}>
                                            <Label value="SAFE ZONE" position="insideTopLeft" className="text-[10px] font-black fill-emerald-600 opacity-40 translate-y-4 translate-x-4" />
                                        </ReferenceArea>
                                        <ReferenceArea x1={60} x2={120} fill="#f59e0b" fillOpacity={0.08}>
                                            <Label value="WARNING" position="insideTopLeft" className="text-[10px] font-black fill-amber-600 opacity-40 translate-y-4 translate-x-4" />
                                        </ReferenceArea>
                                        <ReferenceArea x1={120} x2={200} fill="#ef4444" fillOpacity={0.08}>
                                            <Label value="DANGER" position="insideTopLeft" className="text-[10px] font-black fill-rose-600 opacity-40 translate-y-4 translate-x-4" />
                                        </ReferenceArea>

                                        <ReferenceLine x={60} stroke="#10b981" strokeDasharray="3 3" opacity={0.2} />
                                        <ReferenceLine x={120} stroke="#ef4444" strokeDasharray="3 3" opacity={0.2} />

                                        {activeBrands.map((b, idx) => (
                                            <Scatter 
                                                key={b.Brand_Name} 
                                                name={b.Brand_Name} 
                                                data={[{ x: b.Carbon_Intensity_MT_per_USD_Million, y: 50 + (idx * 6 - 9), brandName: b.Brand_Name }]} 
                                                fill={BRAND_COLORS[idx]}
                                            >
                                                <Cell fill={BRAND_COLORS[idx]} strokeWidth={2} stroke="white" />
                                            </Scatter>
                                        ))}
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                        </ZenCard>

                        {/* W4: Water Savings */}
                        <ZenCard className="col-span-12 lg:col-span-8 bg-stone-900 border-none p-10">
                            <HeaderText><span className="text-emerald-400 uppercase tracking-[0.3em]">Water Savings Summary</span></HeaderText>
                            <div className="font-mono text-stone-400 text-sm space-y-6">
                                <div className="flex justify-between border-b border-stone-800 pb-4">
                                    <span className="uppercase text-[10px] tracking-widest text-stone-500">{activeBrands[0].Brand_Name} Water Used:</span>
                                    <span className="text-white font-bold">{(activeBrands[0].Water_Usage_Liters / 1000000).toFixed(1)}M Liters</span>
                                </div>
                                <div className="flex justify-between border-b border-stone-800 pb-4">
                                    <span className="uppercase text-[10px] tracking-widest text-stone-500">Goal for Better Efficiency:</span>
                                    <span className="text-emerald-400/60 font-bold">{(hypotheticalWaterA / 1000000).toFixed(1)}M Liters</span>
                                </div>
                                <div className="flex justify-between pt-6">
                                    <span className="uppercase text-xs font-black tracking-[0.2em] text-stone-500">Potential Water Saved:</span>
                                    <span className={cn("text-4xl font-black tracking-tighter", waterSavedA > 0 ? "text-emerald-400" : "text-rose-500")}>
                                        {waterSavedA > 0 ? "-" : "+"}{Math.abs(waterSavedA / 1000000).toFixed(1)}M L
                                    </span>
                                </div>
                                <div className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-emerald-600 leading-relaxed font-serif italic text-lg">
                                    "If this brand improved to match its peers, it could save <strong className="text-emerald-400 not-italic">{(waterSavedA / 1000000).toFixed(1)}M Liters</strong> of water."
                                </div>
                            </div>
                        </ZenCard>

                        {/* W5: Trust Gap */}
                        <ZenCard className="col-span-12 lg:col-span-4 p-10 flex flex-col justify-between">
                            <HeaderText icon={<AlertCircle className="w-4 h-4" />}>The Trust Gap</HeaderText>
                            <div className="space-y-8 flex-1 flex flex-col justify-center">
                                {activeBrands.map((b, idx) => (
                                    <div key={b.Brand_Name} className="space-y-3">
                                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                            <span style={{ color: BRAND_COLORS[idx] }}>{b.Brand_Name}</span>
                                            <span className="text-stone-300">{(b.Transparency_Score_2024 - ((1 - (b.finalPenalty ?? 0)) * 100)).toFixed(0)}% Discrepancy</span>
                                        </div>
                                        <div className="h-3 w-full bg-stone-50 rounded-full flex overflow-hidden border border-stone-100">
                                            <div className="h-full opacity-30" style={{ width: `${b.Transparency_Score_2024}%`, backgroundColor: BRAND_COLORS[idx] }} />
                                            <div className="h-full -ml-full" style={{ width: `${(1 - (b.finalPenalty ?? 0)) * 100}%`, backgroundColor: BRAND_COLORS[idx] }} />
                                        </div>
                                        <p className="text-[9px] text-stone-400 font-bold uppercase tracking-tight">Reported vs. Real Impact</p>
                                    </div>
                                ))}
                            </div>
                        </ZenCard>

                        {/* W6: Cost per product */}
                        <ZenCard className="col-span-12 p-10">
                            <HeaderText icon={<TrendingDown className="w-4 h-4" />}>Impact per Single Product</HeaderText>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {activeBrands.map((b, idx) => {
                                    const revPerUnit = (b.Revenue_USD_Million * 1000000) / (b.Annual_Units_Million * 1000000 || 1);
                                    const cPerUnit = (b.Carbon_Footprint_MT * 1000) / (b.Annual_Units_Million * 1000000 || 1);
                                    return (
                                        <div key={b.Brand_Name} className="p-8 bg-stone-50/50 rounded-[2rem] border border-stone-100 text-center relative group hover:bg-white transition-colors">
                                            <div className="absolute top-0 left-0 right-0 h-1.5 rounded-full" style={{ backgroundColor: BRAND_COLORS[idx] }} />
                                            <div className="text-[10px] font-black uppercase tracking-widest text-stone-300 mb-4">{b.Brand_Name}</div>
                                            <div className="text-3xl font-black text-stone-900 tracking-tighter mb-1">${revPerUnit.toFixed(2)}</div>
                                            <div className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-6">Price per Item</div>
                                            <div className="pt-6 border-t border-stone-200">
                                                <div className="text-2xl font-mono font-black text-rose-500">{cPerUnit.toFixed(1)}kg</div>
                                                <div className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">CO2 per Item</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ZenCard>

                        {/* W7: Sustainability Profile */}
                        <ZenCard className="col-span-12 lg:col-span-4 p-10">
                            <HeaderText icon={<BarChart3 className="w-4 h-4" />}>Sustainability Profile</HeaderText>
                            <div className="h-[300px] w-full -mt-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                                        <PolarGrid stroke="#f5f5f4" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#a8a29e', fontSize: 10, fontWeight: 700 }} />
                                        {activeBrands.map((b, i) => (
                                            <Radar key={b.Brand_Name} name={b.Brand_Name} dataKey={`brand${i}`} stroke={BRAND_COLORS[i]} strokeWidth={3} fill={BRAND_COLORS[i]} fillOpacity={0.15} />
                                        ))}
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </ZenCard>

                        {/* W8: Clean Energy Use */}
                        <ZenCard className="col-span-12 lg:col-span-4 p-10">
                            <HeaderText icon={<Zap className="w-4 h-4" />}>Clean Energy Progress</HeaderText>
                            <div className="space-y-8 mt-4">
                                {activeBrands.map((b, idx) => (
                                    <div key={b.Brand_Name} className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[11px] font-black uppercase text-stone-900" style={{ color: BRAND_COLORS[idx] }}>{b.Brand_Name}</span>
                                            <span className="text-2xl font-black text-emerald-500 tracking-tighter">{b.Renewable_Energy_Ratio.toFixed(1)}%</span>
                                        </div>
                                        <div className="h-4 bg-stone-50 rounded-full border border-stone-100 overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${b.Renewable_Energy_Ratio}%` }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full" style={{ backgroundColor: BRAND_COLORS[idx] }} />
                                        </div>
                                        <p className="text-[9px] font-mono text-stone-400 uppercase tracking-widest text-right">Goal: 100% Clean Energy</p>
                                    </div>
                                ))}
                            </div>
                        </ZenCard>

                        {/* W9: Materials & Waste */}
                        <ZenCard className="col-span-12 lg:col-span-4 p-10">
                            <HeaderText icon={<Leaf className="w-4 h-4" />}>Materials & Waste</HeaderText>
                            <div className="space-y-4">
                                {activeBrands.map((b, idx) => (
                                    <div key={b.Brand_Name} className="p-5 bg-stone-50/50 rounded-2xl border border-stone-100 flex items-center justify-between group hover:bg-white transition-colors">
                                        <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: BRAND_COLORS[idx] }}>{b.Brand_Name}</div>
                                        <div className="text-right">
                                            <div className="text-lg font-black text-stone-900 tracking-tighter">{b.Sustainable_Material_Percent}% Eco-Friendly</div>
                                            <div className="text-[10px] font-mono font-bold text-rose-500 uppercase">{b.Waste_Intensity_KG_per_USD_Million.toFixed(0)} kg Waste/$M</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ZenCard>

                        {/* W10: Big Impact Potential */}
                        <ZenCard className="col-span-12 bg-emerald-50 border-emerald-100 p-10">
                            <HeaderText icon={<Users className="w-4 h-4 text-emerald-600" />}>The "Big Impact" Potential</HeaderText>
                            <div className="flex flex-col md:flex-row gap-10 items-center mt-6">
                                <div className="flex-1">
                                    <p className="text-2xl md:text-3xl text-stone-900 leading-tight font-serif italic">
                                        "If <strong className="text-emerald-600 bg-emerald-100 px-2 not-italic">just 1%</strong> of shoppers switched from {loser.Brand_Name} to {winner.Brand_Name}, we would save <strong className="font-sans font-black text-emerald-600 px-1 not-italic">{switchCarbonSaved.toLocaleString()} Tons</strong> of CO2 every year."
                                    </p>
                                </div>
                                <div className="shrink-0 p-6 bg-white rounded-[2rem] border border-emerald-100 shadow-sm w-full md:w-80">
                                    <div className="flex items-center gap-3 mb-4">
                                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Calculated Savings</span>
                                    </div>
                                    <p className="text-[10px] text-stone-400 font-mono leading-relaxed uppercase">This estimate is based on the carbon gap and market share between the selected brands.</p>
                                </div>
                            </div>
                        </ZenCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State */}
            {selectedNames.includes(SELECT_PLACEHOLDER) && (
                <div className="py-32 text-center border-2 border-dashed border-stone-100 rounded-[3rem] bg-stone-50/20">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-stone-100 text-stone-200">
                        <Target className="w-10 h-10 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-black text-stone-900 uppercase tracking-tighter">Waiting for Selection</h2>
                    <p className="text-stone-400 text-lg font-serif italic mt-3 max-w-lg mx-auto">Please choose the brands you want to compare above to see the full analysis.</p>
                </div>
            )}
        </div>
    );
}
