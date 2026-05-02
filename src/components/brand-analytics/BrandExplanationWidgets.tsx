import React from 'react';
import { BrandData } from '@/lib/methodology';
import { AlertCircle, ArrowDownRight, Droplets, Factory, Globe, ShieldQuestion, Scale, TrendingDown, Percent, Skull, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, ReferenceArea, ReferenceLine, Tooltip as RechartsTooltip } from 'recharts';

export function BrandExplanationWidgets({ brand, allBrands }: { brand: BrandData, allBrands: BrandData[] }) {

    // --- MATH ENGINE DATA ---
    const carbonP = brand.pCarbon ?? 0;
    const waterP = brand.pWater ?? 0;
    const isWaterWorst = waterP < carbonP;
    const worstMetricName = isWaterWorst ? 'Water Extraction Limit Exceeded' : 'Carbon Emissions Limit Exceeded';

    const penaltyApplied = brand.finalPenalty ?? 0;
    const finalSurvivalMult = 1 - penaltyApplied;
    const baseScore = finalSurvivalMult > 0 ? (brand.finalScore ?? 0) / finalSurvivalMult : 0;

    const olympicPools = brand.Water_Intensity_L_per_USD_Million / 2500000;
    const carsDriven = brand.Carbon_Intensity_MT_per_USD_Million / 4.6;

    const prScore = brand.Transparency_Score_2024;
    const survivalScore = finalSurvivalMult * 100;
    const dissonanceGap = Math.max(0, prScore - survivalScore);

    const kgCarbonPerGarment = (brand.Carbon_Footprint_MT * 1000) / (brand.Annual_Units_Million * 1000000);
    const virginPercent = 100 - brand.Sustainable_Material_Percent;

    const carbonDeficitMT = Math.max(0, brand.Carbon_Intensity_MT_per_USD_Million - 150) * brand.Revenue_USD_Million;
    const waterDeficitL = Math.max(0, brand.Water_Intensity_L_per_USD_Million - 800000) * brand.Revenue_USD_Million;

    const industryRevenueM = allBrands.reduce((sum, b) => sum + b.Revenue_USD_Million, 0);
    const revShare = (brand.Revenue_USD_Million / industryRevenueM) * 100;
    const totalSafeWaterLiters = industryRevenueM * 800000;
    const waterExtractionShare = (totalSafeWaterLiters > 0) ? (brand.Water_Usage_Liters / totalSafeWaterLiters) * 100 : 0;

    const GLOBAL_INDUSTRY_M = 1500000; // $1.5 Trillion market
    const doomsdayCarbonMT = brand.Carbon_Intensity_MT_per_USD_Million * GLOBAL_INDUSTRY_M;

    return (
        <section className="space-y-6 mt-20 pt-16 border-t border-slate-200">
            <div className="mb-10">
                <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase">
                    <ShieldQuestion className="w-8 h-8 opacity-20" />
                    Cognitive Translation
                </h2>
                <div className="flex gap-4 mt-4 text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                    <div>01 The Verdict</div>
                    <div>02 The Reality</div>
                    <div>03 The Root Cause</div>
                </div>
            </div>

            {/* ZONE 1: THE VERDICT (60/40 Split) */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">

                {/* 60% Width - Penalty Waterfall */}
                <WidgetCard
                    className="lg:col-span-6 bg-slate-900 border-none text-white overflow-hidden relative"
                    icon={<TrendingDown className="text-rose-400 w-4 h-4" />}
                    title="The Math Journey (Penalty Waterfall)" dark>

                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                    <div className="space-y-8 mt-6 relative z-10 w-full xl:w-4/5">
                        <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                            <div>
                                <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">Theoretical Target</div>
                                <div className="text-xl font-bold text-slate-300 tracking-tight">Base ESG Policy Score</div>
                            </div>
                            <span className="text-3xl font-black text-white">{baseScore.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between items-end border-b border-rose-900/50 pb-4">
                            <div>
                                <div className="text-[10px] text-rose-500 font-mono tracking-widest uppercase mb-1">Non-Compensatory Algorithm</div>
                                <div className="text-xl font-bold text-rose-400 tracking-tight">Planetary Boundary Penalty</div>
                            </div>
                            <span className="text-3xl font-black text-rose-400 tracking-tighter">x {finalSurvivalMult.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between items-end pt-2">
                            <div>
                                <div className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase mb-1">The Reality</div>
                                <div className="text-2xl font-black text-white uppercase tracking-tighter">Final Ecosphere Score</div>
                            </div>
                            <span className="text-5xl font-black text-white tracking-tighter">{brand.finalScore?.toFixed(1)}</span>
                        </div>
                    </div>
                </WidgetCard>

                {/* 40% Width - Weakest Link Isolator */}
                <WidgetCard
                    className="lg:col-span-4 bg-white border-slate-200"
                    icon={<AlertCircle className="text-rose-500 w-4 h-4" />}
                    title="The Weakest Link Isolator">

                    <div className="flex flex-col h-full justify-center space-y-4">
                        <div className="inline-flex items-center gap-2 text-[10px] text-rose-500 font-mono font-bold uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full w-fit">
                            System Collapse Trigger
                        </div>
                        <div className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none mt-2">
                            {worstMetricName}
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mt-6">
                            <strong className="text-slate-900">Ecosphere Rule:</strong> You cannot compensate for destroying the planetary supply by scoring high in other categories. This score was dictated entirely by its worst biophysical offense.
                        </p>
                    </div>
                </WidgetCard>

            </div>

            {/* ZONE 2: THE REALITY CHECK (50/50 Split) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 50% Width - Threshold Trigger S-Curve */}
                <WidgetCard
                    className="bg-white border-slate-200"
                    icon={<ArrowDownRight className="text-slate-400 w-4 h-4" />}
                    title="The Threshold Trigger">

                    <div className="flex flex-col h-full">
                        <p className="text-xs text-slate-500 font-mono mb-6 leading-relaxed">
                            Visualizing the exact mathematical cliff where the penalty multiplier collapses from 1.0 to 0.0.
                        </p>
                        <div className="h-40 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 10, right: 30, bottom: 20, left: -20 }}>
                                    <XAxis type="number" dataKey="x" name="Carbon Intensity" domain={[0, 'dataMax + 100']} ticks={[0, 150, 350]} tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }} stroke="#e2e8f0" axisLine={false} tickLine={false} />
                                    <YAxis type="number" dataKey="y" hide domain={[0, 1]} />
                                    <ZAxis type="number" range={[150, 150]} />
                                    <ReferenceArea x1={0} x2={150} fill="#10b981" fillOpacity={0.05} />
                                    <ReferenceArea x1={150} x2={350} fill="#f59e0b" fillOpacity={0.05} />
                                    <ReferenceArea x1={350} fill="#ef4444" fillOpacity={0.05} />
                                    <ReferenceLine x={150} stroke="#10b981" strokeDasharray="3 3" />
                                    <ReferenceLine x={350} stroke="#ef4444" strokeDasharray="3 3" />
                                    <Scatter name="Brand" data={[{ x: brand.Carbon_Intensity_MT_per_USD_Million, y: 0.5 }]} fill="#0f172a" shape="circle" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono font-bold tracking-widest uppercase">
                            <span className="text-emerald-600">Safe Boundary</span>
                            <span className="text-rose-600">Total Collapse</span>
                        </div>
                    </div>
                </WidgetCard>

                {/* 50% Width - Earth Tax Receipt */}
                <WidgetCard
                    className="bg-slate-50 border-slate-200"
                    icon={<Globe className="text-blue-500 w-4 h-4" />}
                    title="The Earth Tax Receipt">

                    <div className="flex flex-col h-full justify-center space-y-8">
                        <div>
                            <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-6">Physical Cost per $1 Million Earned</div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-full bg-blue-100/50 border border-blue-200 flex items-center justify-center shrink-0">
                                        <Droplets className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{olympicPools.toFixed(2)} <span className="text-lg text-slate-400 font-normal tracking-normal">Pools</span></div>
                                        <div className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest font-mono">Olympic Swimming Pools Extracted</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-full bg-slate-200/50 border border-slate-300 flex items-center justify-center shrink-0">
                                        <Factory className="w-6 h-6 text-slate-700" />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{carsDriven.toFixed(2)} <span className="text-lg text-slate-400 font-normal tracking-normal">Cars</span></div>
                                        <div className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest font-mono">Passenger Cars Driven for a Year</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </WidgetCard>

            </div>

            {/* ZONE 3: THE ROOT CAUSE AUTOPSY (33/33/33 Split) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Col 1 - Greenwash Gap */}
                <WidgetCard
                    className="bg-rose-50/50 border-rose-100/80"
                    icon={<Percent className="text-rose-400 w-4 h-4" />}
                    title="Greenwash Gap Quantifier">

                    <div className="mt-4 flex flex-col h-full space-y-4 justify-between">
                        <div className="text-6xl font-black text-rose-500 tracking-tighter leading-none">
                            {dissonanceGap.toFixed(1)}<span className="text-2xl font-black opacity-50 tracking-normal">%</span>
                        </div>
                        <div className="space-y-3 w-full">
                            <div className="flex justify-between items-end border-b border-rose-200/50 pb-2">
                                <span className="text-[10px] text-rose-800/60 font-mono tracking-widest uppercase">PR/Transparency Score</span>
                                <span className="font-bold text-rose-900">{prScore}%</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-rose-200/50 pb-2">
                                <span className="text-[10px] text-rose-800/60 font-mono tracking-widest uppercase">Ecological Survival</span>
                                <span className="font-bold text-rose-900">{survivalScore.toFixed(0)}%</span>
                            </div>
                        </div>
                        <div className="text-[10px] text-rose-600/70 font-mono tracking-wide leading-relaxed mt-2 pt-2 border-t border-rose-200/50">
                            Mathematical dissonance between marketing narrative and biophysical reality.
                        </div>
                    </div>
                </WidgetCard>

                {/* Col 2 - Efficiency vs Volume */}
                <WidgetCard
                    className="bg-white border-slate-200"
                    icon={<Factory className="text-slate-400 w-4 h-4" />}
                    title="Efficiency vs Volume Paradox">

                    <div className="mt-4 flex flex-col h-full justify-between space-y-4">
                        <div>
                            <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1">Micro Efficiency</div>
                            <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                                {kgCarbonPerGarment.toFixed(2)} <span className="text-sm text-slate-400 font-normal tracking-normal uppercase font-mono">kg/garment</span>
                            </div>
                        </div>

                        <div className="text-4xl text-slate-200 font-black">×</div>

                        <div>
                            <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1">Macro Production Volume</div>
                            <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                                {brand.Annual_Units_Million} <span className="text-sm text-slate-400 font-normal tracking-normal uppercase font-mono">Million Units</span>
                            </div>
                        </div>

                        <div className="text-[10px] text-slate-500 font-mono tracking-wide leading-relaxed pt-4 border-t border-slate-100">
                            Massive absolute scale mathematically obliterates sub-unit efficiency gains.
                        </div>
                    </div>
                </WidgetCard>

                {/* Col 3 - Material Debt */}
                <WidgetCard
                    className="bg-white border-slate-200"
                    icon={<Trash2 className="text-amber-500 w-4 h-4" />}
                    title="Material Debt Correlation">

                    <div className="mt-4 flex flex-col h-full justify-between space-y-4">
                        <div>
                            <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1">Virgin Material Input</div>
                            <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                                {virginPercent.toFixed(1)}<span className="text-xl text-slate-400 tracking-normal">%</span>
                            </div>
                        </div>

                        <div className="border-l-2 border-dashed border-slate-200 ml-4 py-3 pl-4">
                            <ArrowDownRight className="w-5 h-5 text-slate-300" />
                        </div>

                        <div>
                            <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1">Downstream Solid Waste</div>
                            <div className="text-3xl font-black text-amber-600 tracking-tighter leading-none">
                                {brand.Waste_Intensity_KG_per_USD_Million.toFixed(0)} <span className="text-sm text-amber-500/50 font-normal tracking-normal uppercase font-mono">kg/$1M</span>
                            </div>
                        </div>

                        <div className="text-[10px] text-slate-500 font-mono tracking-wide leading-relaxed pt-4 border-t border-slate-100">
                            Low circular material usage structurally mandates massive waste generation.
                        </div>
                    </div>
                </WidgetCard>

            </div>

            {/* EXPANDED EXTRAPOLATIONS (The Remaining 3 Widgets, styled minimally at the bottom) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 mt-12 border-t border-slate-200 opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-emerald-50 rounded-lg shrink-0 mt-1">
                        <Scale className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Boundary Deficit</div>
                        <div className="text-sm text-slate-600 mt-2 leading-relaxed">To pass the Ecosphere test, this brand must structurally eliminate <strong className="text-slate-900">{(carbonDeficitMT / 1000).toFixed(1)}k MT</strong> of Carbon or <strong className="text-slate-900">{(waterDeficitL / 1000000).toFixed(1)}M L</strong> of Water annually to re-enter the Safe Zone.</div>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg shrink-0 mt-1">
                        <Globe className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Planetary Budget Share</div>
                        <div className="text-sm text-slate-600 mt-2 leading-relaxed">Accounts for <strong className="text-slate-900">{revShare.toFixed(1)}%</strong> of the market revenue, but violently extracts <strong className="text-rose-600">{waterExtractionShare.toFixed(1)}%</strong> of the industry's theoretical safe water capacity.</div>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg shrink-0 mt-1">
                        <Skull className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Global Doomsday Scale</div>
                        <div className="text-sm text-slate-600 mt-2 leading-relaxed">If the entire $1.5T fashion industry operated at this intensity, it would emit <strong className="text-slate-900">{(doomsdayCarbonMT / 1000000).toFixed(1)}M MT</strong> of Carbon, breaking global bounds instantly.</div>
                    </div>
                </div>
            </div>

        </section>
    );
}

function WidgetCard({ icon, title, children, className, dark = false }: any) {
    return (
        <div className={cn("p-8 rounded-[2rem] border flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl", className)}>
            <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className={cn("p-2 rounded-xl border flex items-center justify-center", dark ? "bg-slate-800/80 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm")}>
                    {icon}
                </div>
                <h4 className={cn("text-[10px] font-bold uppercase tracking-widest font-mono", dark ? "text-slate-300" : "text-slate-500")}>{title}</h4>
            </div>
            <div className="flex-1 relative z-10">
                {children}
            </div>
        </div>
    );
}
