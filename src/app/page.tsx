import React from 'react';
import Link from 'next/link';
import { ArrowRight, Database, Fingerprint, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Components
import { LiveTelemetryWidget } from '@/components/home/LiveTelemetryWidget';

// Logic & Data
import { getBrands } from '@/lib/data';
import { calculateEcosphereScore, BrandMetrics, DatasetMinMax } from '@/lib/ecosphereScoring';

// --- ZEN UI COMPONENTS ---

const ZenCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("bg-white border border-stone-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full", className)}>
        {children}
    </div>
);

// Client-side Sparkline Wrappers
import { SparklinesWidget1, SparklinesWidget2 } from '@/components/home/SparklinesWidget';


export default async function Home() {

    // 1. Fetch Real Brand Data
    const brands = await getBrands();

    // 2. Extract min/max correctly for the core algorithm
    const dsMinMax: DatasetMinMax = {
        Carbon_Footprint_MT: { min: Math.min(...brands.map(b => b.Carbon_Footprint_MT)), max: Math.max(...brands.map(b => b.Carbon_Footprint_MT)) },
        Water_Usage_Liters: { min: Math.min(...brands.map(b => b.Water_Usage_Liters)), max: Math.max(...brands.map(b => b.Water_Usage_Liters)) },
        Waste_Production_KG: { min: Math.min(...brands.map(b => b.Waste_Production_KG)), max: Math.max(...brands.map(b => b.Waste_Production_KG)) },
        Sustainable_Material_Percent: { min: Math.min(...brands.map(b => b.Sustainable_Material_Percent)), max: Math.max(...brands.map(b => b.Sustainable_Material_Percent)) },
        Transparency_Score_2024: { min: Math.min(...brands.map(b => b.Transparency_Score_2024)), max: Math.max(...brands.map(b => b.Transparency_Score_2024)) },
    };

    // 3. Process each brand strictly through the unedited calculateEcosphereScore logic
    const scoredBrands = brands.map(b => {
        const rawMetrics: BrandMetrics = {
            Brand_Name: b.Brand_Name,
            Revenue_USD_Million: b.Revenue_USD_Million,
            Carbon_Footprint_MT: b.Carbon_Footprint_MT,
            Water_Usage_Liters: b.Water_Usage_Liters,
            Waste_Production_KG: b.Waste_Production_KG,
            Sustainable_Material_Percent: b.Sustainable_Material_Percent,
            Transparency_Score_2024: b.Transparency_Score_2024,
            Carbon_Intensity_MT_per_USD_Million: b.Carbon_Intensity_MT_per_USD_Million,
            Water_Intensity_L_per_USD_Million: b.Water_Intensity_L_per_USD_Million,
        };

        const scoreResult = calculateEcosphereScore(rawMetrics, dsMinMax);

        return {
            ...b,
            ecoScore: scoreResult.finalScore,
            rawCarbonPenalty: scoreResult.carbonPenaltyFactor,
            rawWaterPenalty: scoreResult.waterPenaltyFactor,
            isFailing: scoreResult.finalScore === 0 || scoreResult.carbonPenaltyFactor < 0.9 || scoreResult.waterPenaltyFactor < 0.9
        };
    });

    // 4. Sort and Extract Top/Bottom 3
    scoredBrands.sort((a, b) => b.ecoScore - a.ecoScore);

    // Safety check in case of empty data
    const hasData = scoredBrands.length > 0;
    const top3 = hasData ? scoredBrands.slice(0, 3) : [];
    // Only grab bottom 3 if there are at least 6 total, otherwise could overlap
    const bottom3Raw = hasData ? scoredBrands.slice(-3).reverse() : [];
    const bottom3 = bottom3Raw.filter(b => !top3.map(t => t.id).includes(b.id));

    // 5. Calculate Real Macro Stats
    const totalBrands = scoredBrands.length;
    const avgScore = totalBrands > 0 ? (scoredBrands.reduce((acc, b) => acc + b.ecoScore, 0) / totalBrands).toFixed(0) : "0";
    const overloadCount = scoredBrands.filter(b => b.isFailing).length;
    const overloadPercent = totalBrands > 0 ? Math.round((overloadCount / totalBrands) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans selection:bg-stone-900 selection:text-white pt-24 md:pt-32 pb-0">

            {/* ======================= SECTION 1: THE AUTHORITY HERO ======================= */}
            <section className="relative px-4 md:px-8 mb-32 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Left: Thesis Copy */}
                    <div className="col-span-1 lg:col-span-6 space-y-8 z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-[9px] font-bold uppercase tracking-widest text-stone-500 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Ecological Diagnostic System v5.0
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-black tracking-tighter text-stone-900 leading-[0.9]">
                            The <br />
                            <span className="text-stone-400">Ecosphere</span> <br />
                            Engine.
                        </h1>

                        <p className="text-sm md:text-base font-mono text-stone-500 max-w-lg leading-relaxed uppercase tracking-widest font-bold">
                            Verified ecological intelligence. A precision analytical platform measuring the systemic risk and physical impact of 20,000+ global entities.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/analytics" className="group flex items-center justify-between sm:justify-center gap-4 bg-stone-900 text-white px-8 h-14 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10">
                                Industry Analytics <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/validation" className="flex items-center justify-center gap-4 bg-white border border-stone-200 text-stone-900 px-8 h-14 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-stone-50 transition-all shadow-sm">
                                Algorithmic Validation
                            </Link>
                        </div>
                    </div>

                    {/* Right: Abstract Terminal */}
                    <div className="col-span-1 lg:col-span-6 relative">
                        <LiveTelemetryWidget />
                    </div>
                </div>
            </section>

            {/* ======================= SECTION 2: CORE INFRASTRUCTURE (BENTO GRID) ======================= */}
            <section className="px-4 md:px-8 py-24 bg-white border-y border-stone-100 relative">
                <div className="max-w-[1400px] mx-auto">
                    <div className="mb-16">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-2"><div className="w-8 h-[1px] bg-stone-300"></div> System Architecture</div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-stone-900">
                            The Intelligence <span className="text-emerald-600">Infrastructure.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <Link href="/validation" className="group block h-full">
                            <ZenCard className="hover:border-emerald-200 hover:shadow-emerald-500/5 transition-all duration-300 relative overflow-hidden">
                                <ShieldCheck className="w-8 h-8 text-stone-400 mb-8" />
                                <h3 className="text-xl font-black tracking-tighter uppercase text-stone-900 mb-3 group-hover:text-emerald-700 transition-colors">Objective Benchmarking</h3>
                                <p className="text-xs font-mono font-bold tracking-widest uppercase text-stone-500 leading-relaxed">
                                    We analyze 20+ specific data vectors to ensure every entity profile is mathematically rigorous and isolated from corporate marketing.
                                </p>
                                <div className="absolute right-8 bottom-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                    <ArrowRight className="w-5 h-5 text-emerald-600" />
                                </div>
                            </ZenCard>
                        </Link>

                        <Link href="/analytics" className="group block h-full">
                            <ZenCard className="hover:border-sky-200 hover:shadow-sky-500/5 transition-all duration-300 relative overflow-hidden">
                                <Database className="w-8 h-8 text-stone-400 mb-8" />
                                <h3 className="text-xl font-black tracking-tighter uppercase text-stone-900 mb-3 group-hover:text-sky-700 transition-colors">Systemic Oversight</h3>
                                <p className="text-xs font-mono font-bold tracking-widest uppercase text-stone-500 leading-relaxed">
                                    Track energy, waste, and ethics across 20,000+ global brands to reveal the actualized state of the industry.
                                </p>
                                <div className="absolute right-8 bottom-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                    <ArrowRight className="w-5 h-5 text-sky-600" />
                                </div>
                            </ZenCard>
                        </Link>

                        <Link href="/products" className="group block h-full">
                            <ZenCard className="hover:border-rose-200 hover:shadow-rose-500/5 transition-all duration-300 relative overflow-hidden">
                                <Fingerprint className="w-8 h-8 text-stone-400 mb-8" />
                                <h3 className="text-xl font-black tracking-tighter uppercase text-stone-900 mb-3 group-hover:text-rose-700 transition-colors">Product Forensics</h3>
                                <p className="text-xs font-mono font-bold tracking-widest uppercase text-stone-500 leading-relaxed">
                                    Go beyond the label. Access raw material transparency and carbon footprint data, backed by forensic true-cost modelling.
                                </p>
                                <div className="absolute right-8 bottom-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                    <ArrowRight className="w-5 h-5 text-rose-600" />
                                </div>
                            </ZenCard>
                        </Link>

                    </div>
                </div>
            </section>

            {/* ======================= SECTION 3: THE INTELLIGENCE FEED (LIVE MACRO) ======================= */}
            <section className="py-24 px-4 md:px-8 bg-stone-900 text-white">
                <div className="max-w-[1400px] mx-auto text-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-stone-800">

                        <div className="px-6 pb-12 md:pb-0">
                            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold mb-6">Total Entities Indexed</div>
                            <div className="text-6xl md:text-7xl font-black tracking-tighter mb-4 text-white">20,000+</div>
                            <div className="h-[60px] w-[180px] mx-auto opacity-50">
                                <SparklinesWidget1 />
                            </div>
                        </div>

                        <div className="px-6 py-12 md:py-0">
                            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold mb-6">Average Ecosphere Score</div>
                            <div className="text-6xl md:text-7xl font-black tracking-tighter mb-4 text-rose-500">{avgScore}<span className="text-3xl text-stone-600">/100</span></div>
                            <div className="text-[10px] font-mono tracking-widest uppercase text-stone-400 max-w-[200px] mx-auto">
                                Indicating severe systemic physical boundary breaches industry-wide.
                            </div>
                        </div>

                        <div className="px-6 pt-12 md:pt-0">
                            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold mb-6">Systemic Overload</div>
                            <div className="text-6xl md:text-7xl font-black tracking-tighter mb-4 text-emerald-400">{overloadPercent}%</div>
                            <div className="h-[60px] w-[180px] mx-auto opacity-50">
                                <SparklinesWidget2 />
                            </div>
                            <div className="text-[10px] font-mono tracking-widest uppercase text-stone-400 mt-2">
                                Failing critical water/carbon barriers.
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ======================= SECTION 4: THE SURVIVORS & FAILURES ======================= */}
            <section className="py-32 px-4 md:px-8 max-w-[1400px] mx-auto">

                {/* TOP 3 - The Survivors */}
                <div className="mb-24">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-4 flex items-center gap-2"><Zap className="w-4 h-4" /> The Index</div>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-stone-900">
                                Tier 1: The Vanguard.
                            </h2>
                        </div>
                        <p className="text-xs font-mono font-bold tracking-widest uppercase text-stone-500 max-w-sm leading-relaxed">
                            Entities mathematically verified for highest data integrity and benchmarked according to non-compensatory scoring.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {top3.map((brand) => (
                            <Link href={`/brands/${brand.id}`} key={brand.id} className="group flex">
                                <ZenCard className="w-full hover:border-emerald-200 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-12">
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tighter text-stone-900 uppercase truncate max-w-[200px]" title={brand.Brand_Name}>{brand.Brand_Name}</h3>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Rev: ${brand.Revenue_USD_Million}M</span>
                                        </div>
                                        <div className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-black px-3 py-1.5 rounded-md uppercase tracking-widest border border-emerald-200 shadow-sm shrink-0">
                                            {brand.ecoScore.toFixed(1)}/100
                                        </div>
                                    </div>

                                    <div className="space-y-4 border-t border-stone-100 pt-6 mt-auto">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Carbon Intensity</span>
                                            <span className="text-xs font-mono font-bold text-stone-800">{brand.Carbon_Intensity_MT_per_USD_Million} MT/$1M</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Boundary Status</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Safe</span>
                                        </div>
                                    </div>
                                </ZenCard>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* BOTTOM 3 - The Failing Class */}
                {bottom3.length > 0 && (
                    <div>
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-rose-600 mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Systemic Risk</div>
                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-stone-900">
                                    Systemic Risks.
                                </h2>
                            </div>
                            <p className="text-xs font-mono font-bold tracking-widest uppercase text-stone-500 max-w-sm leading-relaxed">
                                Entities identified with significant transparency gaps or severe ecological liability according to our data pipeline.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {bottom3.map((brand) => (
                                <Link href={`/brands/${brand.id}`} key={brand.id} className="group flex">
                                    <ZenCard className="w-full border-rose-100 hover:border-rose-300 transition-all duration-300 bg-rose-50/30">
                                        <div className="flex justify-between items-start mb-12">
                                            <div>
                                                <h3 className="text-2xl font-black tracking-tighter text-stone-900 uppercase truncate max-w-[200px]" title={brand.Brand_Name}>{brand.Brand_Name}</h3>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Rev: ${brand.Revenue_USD_Million}M</span>
                                            </div>
                                            <div className="bg-rose-100 text-rose-800 text-[10px] font-mono font-black px-3 py-1.5 rounded-md uppercase tracking-widest border border-rose-200 shadow-sm shrink-0">
                                                {brand.ecoScore.toFixed(1)}/100
                                            </div>
                                        </div>

                                        <div className="space-y-4 border-t border-rose-200/50 pt-6 mt-auto">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">Carbon Intensity</span>
                                                <span className="text-xs font-mono font-bold text-stone-800">{brand.Carbon_Intensity_MT_per_USD_Million} MT/$1M</span>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">Boundary Status</span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-700 bg-rose-100 px-2 py-0.5 rounded">Collapsed</span>
                                            </div>
                                        </div>
                                    </ZenCard>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </section>

            {/* ======================= SECTION 5: FINAL CONVERSION FUNNEL ======================= */}
            <section className="bg-stone-900 px-4 md:px-8 py-32 text-center border-t-8 border-emerald-500">
                <div className="max-w-3xl mx-auto flex flex-col items-center">
                    <ShieldCheck className="w-16 h-16 text-emerald-500 mb-8" />
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">
                        The Mandate for Transparency.
                    </h2>
                    <p className="text-sm md:text-base font-mono font-bold uppercase tracking-widest text-stone-400 leading-relaxed mb-12">
                        Move beyond corporate narratives. Leverage verified systemic data to audit supply chains, evaluate risk, and allocate capital efficiently.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Link href="/compare" className="group flex items-center justify-center gap-4 bg-emerald-500 text-white px-10 h-16 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20">
                            Compare Products <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
