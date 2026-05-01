'use client';

import { useState, useEffect } from 'react';
import { BrandData } from '@/lib/methodology';
import { cn } from '@/lib/utils';
import { Zap, AlertCircle, Target, Scale, Leaf, AlertTriangle, TrendingDown, Users, Plus, X, Globe, FileText } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ScatterChart, Scatter, ReferenceLine, ReferenceArea,
    Cell
} from 'recharts';

// --- ZEN ECO GENERIC CARD WRAPPER ---
const ZenCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("bg-white border border-stone-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]", className)}>
        {children}
    </div>
);

const HeaderText = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-6 flex items-center gap-2">
        {children}
    </h3>
);

// --- RECHARTS TOOLTIP (ZEN ECO) ---
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-stone-100 p-3 shadow-lg rounded-xl pointer-events-none z-50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">{label || payload[0].payload.name || payload[0].name}</p>
                {payload.map((entry: any, index: number) => {
                    const val = typeof entry.value === 'number' ? 
                        (Number.isInteger(entry.value) ? entry.value : entry.value.toFixed(2)) : 
                        (entry.value || '0');
                    const name = entry.payload?.brandName || entry.name;
                    return (
                        <p key={index} className="text-xs font-mono font-bold text-stone-700" style={{ color: entry.stroke || entry.fill }}>
                            {name}: {val} {entry.payload.unit || ''}
                        </p>
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
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [shuffledPool, setShuffledPool] = useState<BrandData[]>(allBrands);

    useEffect(() => {
        // Shuffle only on client after mount to prevent hydration mismatch
        setShuffledPool([...allBrands].sort(() => Math.random() - 0.5));
    }, [allBrands]);

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
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-xl shrink-0 shadow-inner" style={{ backgroundColor: color }}>
                {currentValue.charAt(0)}
            </div>
            <div className="ml-4 flex-1">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-lg font-black text-stone-800 bg-transparent border-none p-0 focus:ring-0 cursor-pointer w-full text-left uppercase tracking-tighter truncate"
                >
                    {currentValue}
                </button>
                <div className="text-[10px] font-bold text-stone-400 tracking-widest uppercase">Select Audit Brand</div>
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-white border border-stone-100 rounded-3xl shadow-2xl z-[70] p-4 max-h-[450px] flex flex-col">
                        <div className="flex gap-2 mb-4">
                            <input
                                autoFocus
                                placeholder="SEARCH BRANDS..."
                                className="flex-1 px-4 py-2 border border-stone-100 rounded-xl text-xs font-mono font-bold uppercase tracking-widest outline-none focus:border-stone-400"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                onClick={refreshPool}
                                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors"
                                title="Shuffle Suggestions"
                            >
                                Shuffle
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                            {filtered.map(brand => (
                                <button
                                    key={brand.Brand_Name}
                                    disabled={disabledNames.includes(brand.Brand_Name) && brand.Brand_Name !== currentValue}
                                    onClick={() => {
                                        onSelect(brand.Brand_Name);
                                        setIsOpen(false);
                                        setSearch("");
                                    }}
                                    className="w-full text-left px-4 py-2 rounded-xl text-sm font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-20 flex justify-between items-center group/opt"
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
    const [selectedNames, setSelectedNames] = useState<string[]>(() => {
        return allBrands.slice(0, 2).map(b => b.Brand_Name);
    });
    
    // Worker Orchestration State
    const [workerResults, setWorkerResults] = useState<any>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = () => {
        setIsPrinting(true);
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 500);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
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

    if (!workerResults || isCalculating) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Re-initializing Engine</div>
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
        const available = allBrands.find(b => !selectedNames.includes(b.Brand_Name));
        if (available) setSelectedNames([...selectedNames, available.Brand_Name]);
    };

    const removeBrand = (index: number) => {
        if (selectedNames.length <= 2) return;
        setSelectedNames(selectedNames.filter((_, i) => i !== index));
    };

    // --- REPLACED LOCAL MATH WITH WORKER RESULTS ---
    const primary = activeBrands[0];
    const loserViolations = [];
    if (loser.pCarbon && loser.pCarbon < 0.5) loserViolations.push('Carbon Threshold Exception');
    if (loser.pWater && loser.pWater < 0.5) loserViolations.push('Water Usage Variance');

    const getSimulatedScore = (b: BrandData) => b.finalScore ?? 0;

    const poolsSaved = waterSavedA > 0 ? (waterSavedA / 2500000).toFixed(0) : 0;

    // Consumer Switch Math (Worker Provided)

    return (
        <div className={cn("space-y-8 font-sans", isPrinting && "print-mode")}>
            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white !important; }
                    .print-mode { space-y: 4 !important; }
                    .glass { border: none !important; backdrop-filter: none !important; }
                    .shadow-lg, .shadow-2xl { box-shadow: none !important; }
                    .rounded-3xl { border-radius: 12px !important; }
                    @page { margin: 1.5cm; }
                }
                .print-only { display: none; }
            `}</style>

            <div className="flex justify-between items-end no-print">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-stone-900">Ecosphere <span className="text-emerald-500">Compare</span></h1>
                    <p className="text-stone-500 text-xs font-mono uppercase tracking-widest">Multi-Entity Forensic Sustainability Audit v2.1</p>
                </div>
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-2xl hover:bg-stone-800 transition-all font-bold uppercase tracking-widest text-[10px]"
                >
                    <FileText className="w-4 h-4" /> Generate Audit Dossier
                </button>
            </div>

            {/* PART 1: THE SELECTION HEADER (MAINFRAME FORENSIC GRID) */}
            <div className="py-8 border-b border-stone-200/50 no-print">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1400px]">
                    {activeBrands.map((b, idx) => {
                        const finalScore = b.finalScore ?? 0;
                        return (
                            <div key={`${idx}-${b.Brand_Name}`} className="relative group/brand-node h-20 flex items-stretch bg-white border border-stone-200 rounded-2xl shadow-sm transition-all duration-300 hover:border-stone-400 overflow-hidden">
                                
                                {/* Identity Bay (Truncation-Safe) */}
                                <div className="flex-1 min-w-0 px-4">
                                    <BrandSearchSelector
                                        allBrands={allBrands}
                                        currentValue={b.Brand_Name}
                                        color={BRAND_COLORS[idx]}
                                        brandIndex={idx}
                                        disabledNames={selectedNames}
                                        onSelect={(name) => handleBrandChange(idx, name)}
                                    />
                                </div>

                                {/* Diagnostic Data Bay */}
                                <div className={cn(
                                    "w-36 flex items-center justify-center border-l border-stone-100 transition-colors shrink-0",
                                    getSimulatedScore(b) >= 60 ? "bg-emerald-500/5 text-emerald-600" : 
                                    getSimulatedScore(b) >= 40 ? "bg-amber-500/5 text-amber-600" : 
                                    "bg-rose-500/5 text-rose-600"
                                )}>
                                    <div className="text-right pr-4">
                                        <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 leading-none mb-1">
                                            Score
                                        </div>
                                        <div className="text-3xl font-mono font-black tracking-tighter leading-none">{getSimulatedScore(b).toFixed(0)}</div>
                                    </div>
                                    
                                    {/* Vertical Status Accent */}
                                    <div className={cn("w-1.5 h-12 rounded-full", 
                                        getSimulatedScore(b) >= 60 ? "bg-emerald-400" : 
                                        getSimulatedScore(b) >= 40 ? "bg-amber-400" : 
                                        "bg-rose-400"
                                    )} />
                                </div>

                                {selectedNames.length > 2 && (
                                    <button
                                        title="Exclude from audit"
                                        onClick={() => removeBrand(idx)}
                                        className="absolute top-2 right-2 bg-stone-900/10 hover:bg-rose-600 hover:text-white text-stone-400 rounded-full w-5 h-5 flex items-center justify-center transition-all z-[50] opacity-0 group-hover/brand-node:opacity-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        );
                    })}

                    {selectedNames.length < 4 && (
                        <button 
                            title="Add brand to audit" 
                            onClick={addBrand} 
                            className="h-20 border-2 border-dashed border-stone-200 rounded-2xl flex items-center justify-center text-stone-300 hover:text-stone-600 hover:border-stone-400 hover:bg-white transition-all duration-300 gap-3 group/add"
                        >
                            <Plus className="w-5 h-5 group-hover/add:scale-125 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-widest">Append Audit Instance</span>
                        </button>
                    )}
                </div>
            </div>


            {/* PART 2: THE 10-WIDGET BENTO GRID */}
            <div className="grid grid-cols-12 gap-6">

                {/* Widget 1: Head-to-Head Veto (Now compares best vs worst in selection) */}
                <ZenCard className="col-span-12 flex flex-col md:flex-row items-center border-l-8 border-l-emerald-400">
                    <div className="flex-1 mb-6 md:mb-0 md:pr-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                            <Target className="w-3 h-3" /> Efficiency Audit
                        </div>
                        <h2 className="text-3xl font-black text-stone-800 uppercase tracking-tighter mb-2">
                            {winner.Brand_Name} <span className="text-emerald-500">Benchmark Profile</span>
                        </h2>
                        <p className="text-stone-500 text-sm">
                            <strong className="text-stone-900">{winner.Brand_Name}</strong> maintains an efficiency delta of <strong className="font-mono">{Math.round(scoreDelta)} points</strong> over <strong className="text-stone-900">{loser.Brand_Name}</strong>.
                            {loserViolations.length > 0 ? (
                                <span> The {loser.Brand_Name} profile reflects a <strong className="text-rose-600 uppercase">{loserViolations[0]}</strong>, resulting in a systemic score adjustment.</span>
                            ) : (
                                <span> The {loser.Brand_Name} operation exhibits significantly higher intensity loads compared to the cohort average.</span>
                            )}
                        </p>
                    </div>
                    <div className="shrink-0 flex items-end gap-3 h-32 w-full md:w-auto justify-center">
                        {sortedByScore.map((b, i) => (
                            <div key={b.Brand_Name} className="flex flex-col items-center">
                                <div className={cn("text-lg font-mono font-black mb-1", i === 0 ? "text-emerald-600" : "text-stone-400")}>{getSimulatedScore(b).toFixed(0)}</div>
                                <div className={cn("w-12 rounded-t-xl transition-all duration-1000", i === 0 ? "bg-emerald-400" : "bg-stone-200")} style={{ height: `${(getSimulatedScore(b) / 100) * 80 + 20}px` }}></div>
                                <div className="mt-2 text-[8px] font-bold text-stone-500 uppercase tracking-widest truncate w-12 text-center">{b.Brand_Name}</div>
                            </div>
                        ))}
                    </div>
                </ZenCard>

                {/* Widget 2: Intensity Tug-of-War (Barbell) */}
                <ZenCard className="col-span-12 lg:col-span-6">
                    <HeaderText><Scale className="w-4 h-4" /> Intensity Comparison</HeaderText>
                    <p className="text-xs text-stone-500 mb-6">Carbon Footprint (MT per $1M Revenue)</p>
                    <div className="relative h-20 w-full flex items-center px-4 mt-8">
                        {/* Track */}
                        <div className="absolute left-8 right-8 h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div className="absolute h-full bg-stone-300"
                                style={{
                                    left: `${Math.min(...activeBrands.map(b => b.Carbon_Intensity_MT_per_USD_Million)) / 200 * 100}%`,
                                    width: `${(Math.max(...activeBrands.map(b => b.Carbon_Intensity_MT_per_USD_Million)) - Math.min(...activeBrands.map(b => b.Carbon_Intensity_MT_per_USD_Million))) / 200 * 100}%`
                                }}
                            />
                        </div>

                        {/* Nodes */}
                        {activeBrands.map((b, idx) => (
                            <div
                                key={b.Brand_Name}
                                className="absolute w-6 h-6 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center group z-10 hover:scale-125 transition-transform hover:z-50"
                                style={{
                                    left: `calc(${Math.min(b.Carbon_Intensity_MT_per_USD_Million / 200 * 100, 95)}% + 1rem)`,
                                    backgroundColor: BRAND_COLORS[idx]
                                }}
                            >
                                <span className="absolute -top-6 text-[9px] font-bold text-stone-500 uppercase whitespace-nowrap">{b.Brand_Name}</span>
                                <span className="absolute -bottom-5 text-[9px] font-mono text-stone-400">{b.Carbon_Intensity_MT_per_USD_Million.toFixed(0)}</span>
                            </div>
                        ))}
                    </div>
                </ZenCard>

                {/* Widget 3: Planetary Boundary Race */}
                <ZenCard className="col-span-12 lg:col-span-6">
                    <HeaderText><AlertTriangle className="w-4 h-4" /> Environmental Thresholds</HeaderText>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                                <XAxis type="number" dataKey="x" name="Intensity" hide domain={[0, 200]} />
                                <YAxis type="number" dataKey="y" name="Risk Axis" hide domain={[0, 100]} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />

                                <ReferenceArea x1={0} x2={60} fill="#10b981" fillOpacity={0.05} />
                                <ReferenceArea x1={60} x2={120} fill="#f59e0b" fillOpacity={0.05} />
                                <ReferenceArea x1={120} x2={200} fill="#ef4444" fillOpacity={0.05} />
                                <ReferenceLine x={120} stroke="#ef4444" strokeDasharray="3 3" />

                                {activeBrands.map((b, idx) => (
                                    <Scatter key={b.Brand_Name} name={b.Brand_Name} data={[{ x: b.Carbon_Intensity_MT_per_USD_Million, y: 50 + (idx * 5 - 5), brandName: b.Brand_Name, unit: 'MT/$M' }]} fill={BRAND_COLORS[idx]}>
                                        <Cell fill={BRAND_COLORS[idx]} />
                                    </Scatter>
                                ))}
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </ZenCard>

                {/* Widget 4: The Earth Tax (Receipt) */}
                <ZenCard className="col-span-12 lg:col-span-8 bg-stone-900 border-none shadow-[0_20px_40px_rgb(0,0,0,0.2)]">
                    <HeaderText><span className="text-emerald-400">Resource Efficiency Gap</span></HeaderText>
                    <div className="font-mono text-stone-400 text-xs md:text-sm space-y-4">
                        <div className="flex justify-between border-b border-stone-800 pb-2">
                            <span>{primary.Brand_Name} Current Water Usage:</span>
                            <span className="text-white">{(primary.Water_Usage_Liters / 1000000).toFixed(1)}M Liters</span>
                        </div>
                        <div className="flex justify-between border-b border-stone-800 pb-2">
                            <span>If {primary.Brand_Name} matched Group's Best Efficiency:</span>
                            <span className="text-stone-300">{(hypotheticalWaterA / 1000000).toFixed(1)}M Liters</span>
                        </div>
                        <div className="flex justify-between pt-4">
                            <span className="uppercase text-stone-500">Hypothetical Delta:</span>
                            <span className={cn("font-black text-xl", waterSavedA > 0 ? "text-emerald-400" : "text-rose-500")}>
                                {waterSavedA > 0 ? "-" : "+"}{Math.abs(waterSavedA / 1000000).toFixed(1)}M L
                            </span>
                        </div>
                        {waterSavedA > 0 && (
                            <div className="p-4 bg-emerald-500/10 rounded-xl mt-4 border border-emerald-500/20 text-emerald-500 leading-relaxed font-serif">
                                Optimization to the peer group's current best efficiency represents a potential resource recovery of <strong className="text-emerald-300 font-sans">{(waterSavedA / 1000000).toFixed(1)}M Liters</strong> per revenue cycle.
                            </div>
                        )}
                        {isPrimaryBestWater && (
                            <div className="p-4 bg-sky-500/10 rounded-xl mt-4 border border-sky-500/20 text-sky-400 leading-relaxed">
                                {primary.Brand_Name} already sets the benchmark for water efficiency in this selected group.
                            </div>
                        )}
                    </div>
                </ZenCard>

                {/* Widget 5: Greenwash Divergence */}
                <ZenCard className="col-span-12 lg:col-span-4 flex flex-col justify-between">
                    <HeaderText><AlertCircle className="w-4 h-4" /> Divergence Analysis</HeaderText>
                    <div className="flex-1 flex flex-col justify-center space-y-6">
                        {activeBrands.map((b, idx) => (
                            <div key={b.Brand_Name}>
                                <div className="flex justify-between text-[10px] font-bold text-stone-500 mb-2 uppercase tracking-widest">
                                    <span style={{ color: BRAND_COLORS[idx] }}>{b.Brand_Name}</span>
                                </div>
                                <div className="h-2.5 w-full bg-stone-100 rounded-full flex overflow-hidden">
                                    <div className="h-full z-10" style={{ width: `${b.Transparency_Score_2024}%`, backgroundColor: BRAND_COLORS[idx], opacity: 0.5 }}></div>
                                    <div className="h-full -ml-[1px]" style={{ width: `${(1 - (b.finalPenalty ?? 0)) * 100}%`, backgroundColor: BRAND_COLORS[idx] }}></div>
                                </div>
                                <div className="flex justify-between mt-1 text-[9px] font-mono text-stone-400">
                                    <span>Disclosure: {b.Transparency_Score_2024}</span>
                                    <span>Measured: {((1 - (b.finalPenalty ?? 0)) * 100).toFixed(0)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ZenCard>

                {/* Widget 6: Volume vs Value */}
                <ZenCard className="col-span-12">
                    <HeaderText><TrendingDown className="w-4 h-4" /> Unit Performance Index</HeaderText>
                    <p className="text-xs text-stone-500 mb-6">Revenue Yield vs Carbon Footprint per garment unit</p>

                    <div className={cn("grid gap-4", activeBrands.length === 2 ? "grid-cols-2" : activeBrands.length === 3 ? "grid-cols-3" : "grid-cols-2 md:grid-cols-4")}>
                        {activeBrands.map((b, idx) => {
                            const revPerUnit = (b.Revenue_USD_Million * 1000000) / (b.Annual_Units_Million * 1000000 || 1);
                            const cPerUnit = (b.Carbon_Footprint_MT * 1000) / (b.Annual_Units_Million * 1000000 || 1);

                            return (
                                <div key={b.Brand_Name} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 text-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: BRAND_COLORS[idx] }} />
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 mt-1" style={{ color: BRAND_COLORS[idx] }}>{b.Brand_Name}</div>
                                    <div className="text-2xl font-black text-stone-800">${revPerUnit.toFixed(2)}</div>
                                    <div className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest">Rev / Item</div>
                                    <div className="mt-4 pt-4 border-t border-stone-200">
                                        <div className="text-lg font-mono text-rose-500">{cPerUnit.toFixed(1)}kg</div>
                                        <div className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest">CO2 / Item</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ZenCard>

                {/* Widget 7: Policy Radar */}
                <ZenCard className="col-span-12 lg:col-span-4">
                    <HeaderText><Target className="w-4 h-4" /> Global Profile Distribution</HeaderText>
                    <div className="h-[280px] w-full -mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
                                <PolarGrid stroke="#f5f5f4" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#78716c', fontSize: 9, fontWeight: 700 }} />
                                {activeBrands.map((b, i) => (
                                    <Radar key={b.Brand_Name} name={b.Brand_Name} dataKey={`brand${i}`} stroke={BRAND_COLORS[i]} strokeWidth={2} fill={BRAND_COLORS[i]} fillOpacity={0.25} />
                                ))}
                                <Tooltip content={<CustomTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </ZenCard>

                {/* Widget 8: Energy Grid Duel */}
                <ZenCard className="col-span-12 lg:col-span-4">
                    <HeaderText><Zap className="w-4 h-4" /> Clean Energy Transition</HeaderText>
                    <div className="space-y-6 mt-6">
                        {activeBrands.map((b, idx) => (
                            <div key={b.Brand_Name}>
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">
                                    <span style={{ color: BRAND_COLORS[idx] }}>{b.Brand_Name}</span>
                                    <span className="text-emerald-500">{b.Renewable_Energy_Ratio.toFixed(1)}% Clean</span>
                                </div>
                                <div className="h-3 bg-stone-100 rounded-full flex overflow-hidden">
                                    <div className="h-full transition-all duration-1000" style={{ width: `${b.Renewable_Energy_Ratio}%`, backgroundColor: BRAND_COLORS[idx] }}></div>
                                    <div className="bg-stone-200 h-full" style={{ width: `${100 - b.Renewable_Energy_Ratio}%` }}></div>
                                </div>
                                <p className="text-[9px] font-mono text-stone-400 mt-1">{(b.Carbon_Footprint_MT / 1000).toFixed(0)}k MT Absolute Baseline</p>
                            </div>
                        ))}
                    </div>
                </ZenCard>

                {/* Widget 9: Material Waste Correlation */}
                <ZenCard className="col-span-12 lg:col-span-4">
                    <HeaderText><Leaf className="w-4 h-4" /> Material & Waste Profile</HeaderText>
                    <div className="space-y-3">
                        {activeBrands.map((b, idx) => (
                            <div key={b.Brand_Name} className="p-3 bg-stone-50 border border-stone-100 rounded-xl flex items-center justify-between hover:bg-white transition-colors">
                                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: BRAND_COLORS[idx] }}>{b.Brand_Name}</span>
                                <div className="text-right">
                                    <div className="text-xs font-black text-stone-800">{b.Sustainable_Material_Percent}% Clean Materials</div>
                                    <div className="text-[9px] font-mono text-rose-500 mt-0.5">{b.Waste_Intensity_KG_per_USD_Million.toFixed(0)} kg Waste/$M</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ZenCard>

                {/* Widget 10: Consumer Switch */}
                <ZenCard className="col-span-12 bg-emerald-50 border-emerald-100">
                    <HeaderText><Users className="w-4 h-4 text-emerald-600" /> Systemic Shift Simulation</HeaderText>
                    <div className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm mt-4 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1">
                            {switchCarbonSaved > 0 ? (
                                <p className="text-lg md:text-xl text-stone-700 leading-relaxed font-serif italic">
                                    A structural shift of <strong className="text-stone-900 bg-emerald-100 px-1 whitespace-nowrap not-italic">just 1%</strong> from {loser.Brand_Name} to {winner.Brand_Name} represents an annual reduction of <strong className="font-sans font-black text-emerald-600 text-3xl px-1 whitespace-nowrap not-italic">{switchCarbonSaved.toLocaleString(undefined, { maximumFractionDigits: 0 })} MT</strong> of carbon.
                                </p>
                            ) : (
                                <p className="text-lg text-stone-700 leading-relaxed font-serif italic">
                                    A market shift of this scale provides negligible structural benefit due to the high intensity correlation between both selected entities.
                                </p>
                            )}
                        </div>
                        <div className="shrink-0 text-[10px] font-mono text-emerald-600/60 uppercase tracking-widest bg-emerald-50 p-4 rounded-xl border border-emerald-100 w-full md:w-64 leading-relaxed">
                            Calculated dynamically based on the verified revenue discrepancy and unit intensity gap within the current cohort.
                        </div>
                    </div>
                </ZenCard>

            </div>
        </div>
    );
}

