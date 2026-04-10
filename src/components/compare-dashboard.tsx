'use client';

import { useState } from 'react';
import { BrandData } from '@/lib/methodology';
import { cn } from '@/lib/utils';
import { ShieldAlert, Zap, Droplets, Factory, AlertCircle, ArrowRightLeft, Target, Scale, Leaf, AlertTriangle, TrendingDown, Users, Plus, X } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ScatterChart, Scatter, ReferenceLine, ReferenceArea, ReferenceDot,
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
                    const val = typeof entry.value === 'number' && !Number.isInteger(entry.value) ? entry.value.toFixed(2) : entry.value;
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
    const [shuffledPool, setShuffledPool] = useState(() => [...allBrands].sort(() => Math.random() - 0.5));

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
        <div className="flex-1 min-w-[250px] relative">
            <div className="flex items-center bg-white border border-stone-100 rounded-3xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative group">
                <div className="w-12 h-12 rounded-2xl border border-stone-100 flex items-center justify-center font-black text-white text-xl shrink-0" style={{ backgroundColor: color }}>
                    {currentValue.charAt(0)}
                </div>
                <div className="ml-4 flex-1">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-xl font-bold text-stone-800 bg-transparent border-none p-0 focus:ring-0 cursor-pointer w-full text-left uppercase tracking-tighter truncate pr-4"
                    >
                        {currentValue}
                    </button>
                </div>
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-100 rounded-3xl shadow-2xl z-[70] p-4 max-h-[450px] flex flex-col">
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
    // Optimization: Create a Map for O(1) lookup
    const brandMap = new Map(allBrands.map(b => [b.Brand_Name, b]));

    const [selectedNames, setSelectedNames] = useState<string[]>(() => {
        // Pick 2 random brands from different score tiers for diversity
        const shuffled = [...allBrands].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 2).map(b => b.Brand_Name);
    });

    const activeBrands = selectedNames.map(name => brandMap.get(name)).filter(Boolean) as BrandData[];

    if (activeBrands.length < 2) return null;

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

    // --- MATH DERIVATIONS FOR WIDGETS ---
    const sortedByScore = [...activeBrands].sort((a, b) => (b.finalScore ?? 0) - (a.finalScore ?? 0));
    const winner = sortedByScore[0];
    const loser = sortedByScore[sortedByScore.length - 1]; // Absolute worst in selected group
    const scoreDelta = (winner.finalScore ?? 0) - (loser.finalScore ?? 0);

    const loserViolations = [];
    if (loser.pCarbon && loser.pCarbon < 0.5) loserViolations.push('Carbon Threshold Exception');
    if (loser.pWater && loser.pWater < 0.5) loserViolations.push('Water Usage Variance');

    // Earth Tax Math
    const primary = activeBrands[0];
    const bestWaterEfficiency = Math.min(...activeBrands.map(b => b.Water_Usage_Liters / (b.Revenue_USD_Million || 1)));
    const primaryWaterEfficiency = primary.Water_Usage_Liters / (primary.Revenue_USD_Million || 1);
    const hypotheticalWaterA = (primary.Revenue_USD_Million || 1) * bestWaterEfficiency;
    const waterSavedA = primary.Water_Usage_Liters - hypotheticalWaterA;
    const poolsSaved = waterSavedA > 0 ? (waterSavedA / 2500000).toFixed(0) : 0;
    const isPrimaryBestWater = primaryWaterEfficiency === bestWaterEfficiency;

    // Radar Data
    const radarData = [
        { subject: 'Carbon', fullMark: 33.5 },
        { subject: 'Water', fullMark: 29.0 },
        { subject: 'Waste', fullMark: 16.5 },
        { subject: 'Materials', fullMark: 11.2 },
        { subject: 'PR', fullMark: 9.8 },
    ].map(item => {
        const dataPoint: any = { subject: item.subject, fullMark: item.fullMark };
        activeBrands.forEach((b, i) => {
            if (item.subject === 'Carbon') dataPoint[`brand${i}`] = b.contributions?.['Carbon Base'] || 0;
            if (item.subject === 'Water') dataPoint[`brand${i}`] = b.contributions?.['Water Base'] || 0;
            if (item.subject === 'Waste') dataPoint[`brand${i}`] = b.contributions?.['Waste Base'] || 0;
            if (item.subject === 'Materials') dataPoint[`brand${i}`] = b.contributions?.['Materials'] || 0;
            if (item.subject === 'PR') dataPoint[`brand${i}`] = b.contributions?.['Transparency'] || 0;
        });
        return dataPoint;
    });

    // Consumer Switch Math
    const switchCarbonSaved = ((loser.Carbon_Intensity_MT_per_USD_Million - winner.Carbon_Intensity_MT_per_USD_Million) * (loser.Revenue_USD_Million * 0.01));

    return (
        <div className="space-y-8 font-sans">
            {/* PART 1: THE SELECTION HEADER */}
            <div className="sticky top-[80px] z-40 bg-[#FAF9F6]/90 backdrop-blur-md py-4 -mx-6 px-6 border-b border-stone-200/50 flex flex-wrap gap-4 items-center">

                {activeBrands.map((b, idx) => {
                    const finalScore = b.finalScore ?? 0;
                    return (
                        <div key={`${idx}-${b.Brand_Name}`} className="flex-1 min-w-[300px] flex items-center gap-4 relative">
                            <BrandSearchSelector
                                allBrands={allBrands}
                                currentValue={b.Brand_Name}
                                color={BRAND_COLORS[idx]}
                                brandIndex={idx}
                                disabledNames={selectedNames}
                                onSelect={(name) => handleBrandChange(idx, name)}
                            />

                            <div className={cn("px-4 py-4 rounded-[2rem] font-mono font-black text-2xl border shadow-sm flex items-center justify-center min-w-[80px]", finalScore >= 60 ? "bg-emerald-50 border-emerald-100 text-emerald-600" : finalScore >= 40 ? "bg-amber-50 border-amber-100 text-amber-600" : "bg-rose-50 border-rose-100 text-rose-600")}>
                                {finalScore.toFixed(0)}
                            </div>

                            {selectedNames.length > 2 && (
                                <button
                                    title="Remove brand from comparison"
                                    onClick={() => removeBrand(idx)}
                                    className="absolute -top-2 -right-2 bg-white border border-stone-200 hover:bg-rose-500 hover:text-white hover:border-rose-500 text-stone-500 rounded-full w-8 h-8 flex items-center justify-center transition-all z-[50] shadow-sm active:scale-90"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    );
                })}

                {selectedNames.length < 4 && (
                    <button title="Add brand to comparison" onClick={addBrand} className="h-[76px] px-6 border-2 border-dashed border-stone-300 rounded-3xl flex items-center justify-center text-stone-400 hover:text-stone-600 hover:border-stone-400 hover:bg-stone-50 transition-all">
                        <Plus className="w-6 h-6" />
                    </button>
                )}
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
                                <div className={cn("text-lg font-mono font-black mb-1", i === 0 ? "text-emerald-600" : "text-stone-400")}>{(b.finalScore ?? 0).toFixed(0)}</div>
                                <div className={cn("w-12 rounded-t-xl transition-all duration-1000", i === 0 ? "bg-emerald-400" : "bg-stone-200")} style={{ height: `${((b.finalScore ?? 0) / 100) * 80 + 20}px` }}></div>
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

