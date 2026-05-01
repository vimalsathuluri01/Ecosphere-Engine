'use client';

import { EnrichedProduct } from "@/lib/types";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, Zap, Factory, Flame, Droplets, ShieldAlert, CloudSnow, ArrowRight, Box, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatScore } from "@/lib/formatters";

interface Props {
    product: EnrichedProduct;
    alternative?: EnrichedProduct;
}

export function ProductExplanationWidgets({ product, alternative }: Props) {
    // Shared Attributes
    const hasViolations = product.hazardous_chemicals_used === 'yes' || !!product.environmental_violations;
    const materialLower = product.material_type.toLowerCase();
    const isSynthetic = ['polyester', 'nylon', 'acrylic', 'spandex', 'elastane', 'poly'].some(s => materialLower.includes(s));
    const isBlend = materialLower.includes('/') || materialLower.includes('blend') || materialLower.includes(' and ');

    // 1. Total Resource Gap (FORENSIC AUDIT)
    const retailPrice = 45.00; 
    const isGreenwashedCarbon = product.renewable_energy_ratio < 30 && ['A', 'B'].includes(product.energy_efficiency_rating);
    const carbonBase = product.scope1_scope2_emissions;
    const carbonAdjustment = isGreenwashedCarbon ? (carbonBase * 0.45) : 0; // The Forensic "Gross-up"
    
    const costOfCarbon = (carbonBase + carbonAdjustment) * 0.185;
    const costOfWater = product.water_consumed_per_unit * 0.002;
    const ecologicalCost = costOfCarbon + costOfWater;
    const truePrice = retailPrice + ecologicalCost;

    // 2. Recycling Reality (FORENSIC AUDIT)
    const brandClaimEol = product.recyclability_score || 0;
    
    // Forensic Nuance: Blends and Synthetics are absolute vetoes (0%). 
    // Plastic contamination is a sliding penalty until it reaches a 5% "unrecoverable" boundary.
    const isVetoedEol = isBlend || isSynthetic || product.plastic_percentage > 5;
    
    let realityEol = 0;
    if (isBlend || isSynthetic) {
        realityEol = 0;
    } else if (product.plastic_percentage > 5) {
        realityEol = 0;
    } else {
        // Sliding scale penalty for minor contamination
        const contaminationPenalty = (product.plastic_percentage / 5) * brandClaimEol;
        realityEol = Math.max(0, brandClaimEol - contaminationPenalty);
    }

    const eolVetoReason = isBlend ? "Mixed Blend Constraint" : isSynthetic ? "Polymer Constraint" : "Plastic Contamination";

    // 4. Water Footprint
    const drinkingDays = product.water_consumed_per_unit / 2.5;
    const drinkingYears = (drinkingDays / 365).toFixed(1);

    // 5. Carbon Amortization
    const lifespan = Math.max(1, product.average_lifespan);
    const decayData = Array.from({ length: Math.ceil(lifespan) }, (_, i) => {
        const year = i + 1;
        return {
            year: `Y${year}`,
            carbon: Number((product.scope1_scope2_emissions / year).toFixed(2))
        };
    });

    // 7. Microplastic Loss
    const sheds = isSynthetic || product.plastic_percentage > 0;
    const microplastics = sheds ? Math.round(product.plastic_percentage * 50 * 0.05) : 0;

    // 6. Disclosure Audit
    const disclosure = product.supply_chain_disclosure.toLowerCase();
    const isLowDisclosure = disclosure === 'low' || disclosure === 'none' || product.esg_reporting_score < 40;
    const shadowPenalty = isLowDisclosure ? product.scope1_scope2_emissions * 1.5 : 0;

    // 8. Energy Grid Reality Check
    const gridCoalHeavy = product.renewable_energy_ratio < 30;
    const falseEfficiency = ['A', 'B'].includes(product.energy_efficiency_rating) && gridCoalHeavy;

    // 9. Packaging Disproportion
    const packagingWasteRatio = product.packaging_weight_ratio || (product.plastic_percentage / 10) || 0.5;

    // 10. Better Alternative Swap
    // (Logic moved to server for peak performance)

    // Shared Card Style
    const cardBase = "bg-white border border-stone-100 rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col";
    const headerBase = "text-stone-900 text-xl font-black mb-4 flex items-center gap-4 uppercase tracking-tighter";
    const dataLabel = "font-mono text-[11px] font-black text-stone-400 uppercase tracking-[0.2em]";

    return (
        <section className="mt-16 pt-16">
            <div className="grid grid-cols-12 gap-6">

                {/* WIDGET 1: The Buy Box & True Price (col-span-12 lg:col-span-8) */}
                <div className={cn(cardBase, "col-span-12 lg:col-span-8 overflow-hidden relative")}>
                    <div className="flex flex-col md:flex-row gap-8 h-full">
                        {/* Simulated Image Left Side */}
                        <div className="w-full md:w-1/3 bg-stone-50 rounded-2xl flex items-center justify-center p-6 border border-stone-100/50 min-h-[200px]">
                            <Box className="w-16 h-16 text-stone-200" />
                        </div>
                        {/* Data Right Side */}
                        <div className="flex-1 flex flex-col justify-center">
                            <h3 className={headerBase}><DollarSign className="w-6 h-6 text-stone-400" /> Total Resource Gap</h3>
                            <p className="text-stone-500 text-base mb-8 font-serif italic text-balance">Retail prices externalize the systemic cost of carbon and water restoration. This represents the hidden ecological debt.</p>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                                    <span className={dataLabel}>Primary Base Price</span>
                                    <span className="font-mono text-lg text-stone-800 font-bold">${retailPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                                    <span className={dataLabel}>Restoration Cost</span>
                                    <span className="font-mono text-lg text-stone-900 font-black">+${ecologicalCost.toFixed(2)}</span>
                                </div>
                                
                                {isGreenwashedCarbon && (
                                    <div className="flex justify-between items-center bg-rose-50 px-3 py-2 rounded-lg border border-rose-100">
                                        <span className="text-[11px] font-black text-rose-600 uppercase tracking-widest">Physical Baseline Adjustment</span>
                                        <span className="font-mono text-xs text-rose-500 font-bold">Offset Discount Rejected</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-4">
                                    <span className="font-black text-stone-900 uppercase tracking-[0.2em] text-xs">Systemic Total</span>
                                    <span className="font-mono text-4xl font-black text-stone-900 tracking-tighter">${truePrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* WIDGET 2: Toxicity Veto Switch (col-span-12 lg:col-span-4) */}
                <div className={cn(cardBase, "col-span-12 lg:col-span-4", hasViolations ? "bg-rose-50 border-rose-100 shadow-none" : "")}>
                    <h3 className={cn(headerBase, hasViolations ? "text-rose-800" : "")}>
                        <ShieldAlert className={cn("w-5 h-5", hasViolations ? "text-rose-600" : "text-stone-400")} />
                        Toxicity Veto
                    </h3>
                    <p className={cn("text-sm mb-auto", hasViolations ? "text-rose-700/80" : "text-stone-500")}>
                        {hasViolations
                            ? "Toxic PFAS or labor violations detected. A low carbon footprint cannot compensate. Score voided."
                            : "No catastrophic chemical or ethical violations detected. Regular scoring applies."}
                    </p>
                    <div className="mt-6 pt-6 border-t border-stone-100/50 flex justify-between items-center">
                        <span className={cn(dataLabel, hasViolations ? "text-rose-600" : "")}>Multiplier</span>
                        <span className={cn("text-3xl font-black font-mono tracking-tighter", hasViolations ? "text-rose-600" : "text-emerald-600")}>
                            x{hasViolations ? "0.0" : "1.0"}
                        </span>
                    </div>
                </div>

                {/* WIDGET 3: The Water Footprint (col-span-12 lg:col-span-6) */}
                <div className={cn(cardBase, "col-span-12 lg:col-span-6")}>
                    <h3 className={headerBase}><Droplets className="w-6 h-6 text-blue-500" /> Water Footprint</h3>
                    <p className="text-stone-500 text-base mb-10 font-serif italic">
                        Abstracted water volume required for fiber growth and industrial processing.
                    </p>
                    <div className="flex items-end gap-5 mt-auto border-t border-stone-100 pt-8">
                        <div className="text-7xl font-black text-stone-900 tracking-tighter leading-none">{drinkingYears}</div>
                        <div className={cn(dataLabel, "mb-1")}>Years of Human Usage</div>
                    </div>
                </div>

                {/* WIDGET 4: Microplastic Loss (col-span-12 lg:col-span-6) */}
                <div className={cn(cardBase, "col-span-12 lg:col-span-6", sheds ? "bg-stone-50" : "")}>
                    <h3 className={headerBase}><CloudSnow className="w-6 h-6 text-stone-500" /> Microplastic Loss</h3>
                    <p className="text-stone-500 text-base mb-10 font-serif italic">
                        Estimated fiber release into drainage systems per 50 standard wash cycles.
                    </p>
                    <div className="flex items-end gap-5 mt-auto border-t border-stone-100 pt-8">
                        <div className="text-7xl font-black text-stone-900 tracking-tighter leading-none">{sheds ? `${microplastics}M` : "0"}</div>
                        <div className={cn(dataLabel, "mb-1")}>Fibers Released</div>
                    </div>
                </div>

                {/* WIDGET 5: Carbon Decay Curve (col-span-12 lg:col-span-8) */}
                <div className={cn(cardBase, "col-span-12 lg:col-span-8")}>
                    <h3 className={headerBase}><Zap className="w-6 h-6 text-stone-500" /> Carbon Amortization</h3>
                    <p className="text-stone-500 text-base mb-8 font-serif italic">
                        The physical manufacturing footprint is amortized over the projected garment durability.
                    </p>
                    <div className="h-[220px] w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={decayData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="decayColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#292524" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#292524" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }} />
                                <YAxis hide domain={[0, 'dataMax']} />
                                <Tooltip cursor={{ stroke: '#e7e5e4', strokeWidth: 1 }} contentStyle={{ background: '#fff', border: '1px solid #f5f5f4', borderRadius: '16px', fontSize: '14px', fontWeight: 'bold', color: '#1c1917', fontFamily: 'monospace', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }} />
                                <Area type="monotone" dataKey="carbon" stroke="#1c1917" strokeWidth={3} fillOpacity={1} fill="url(#decayColor)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* WIDGET 6: Recycling Reality (col-span-12 lg:col-span-4) */}
                <div className={cn(cardBase, "col-span-12 lg:col-span-4", isVetoedEol ? "bg-rose-50/50 border-rose-100 shadow-none text-rose-900" : "")}>
                    <h3 className={cn(headerBase, isVetoedEol ? "text-rose-900" : "")}><RefreshCw className={cn("w-6 h-6", isVetoedEol ? "text-rose-500" : "text-stone-500")} /> Recycling Reality</h3>
                    
                    <div className="space-y-6 mb-10">
                        <div className="flex justify-between items-center text-[11px] font-mono font-black uppercase tracking-widest">
                            <span className={isVetoedEol ? "text-rose-400" : "text-stone-400"}>Brand Claim</span>
                            <span className={cn(isVetoedEol ? "text-rose-600 line-through opacity-50" : "text-stone-800")}>{brandClaimEol.toFixed(1)}% Potential</span>
                        </div>
                        {isVetoedEol && (
                            <div className="flex justify-between items-center text-[11px] font-mono font-black text-rose-600 uppercase tracking-widest">
                                <span>Audit Adjustment</span>
                                <span>-{brandClaimEol.toFixed(1)}%</span>
                            </div>
                        )}
                        <div className={cn("text-base font-serif italic", isVetoedEol ? "text-rose-800/80" : "text-stone-500")}>
                            {isVetoedEol 
                                ? `Measurement Veto: ${eolVetoReason}. Real-world mechanical separation is unsupported.`
                                : "Mono-material profile supports standard local processing."}
                        </div>
                    </div>

                    <div className="mt-auto border-t border-stone-100 pt-8">
                        <div className={cn("text-6xl font-black tracking-tighter mb-2 leading-none", isVetoedEol ? "text-rose-600" : "text-emerald-600")}>
                            {realityEol.toFixed(1)}%
                        </div>
                        <div className={cn(dataLabel, isVetoedEol ? "text-rose-400" : "")}>Final State: {isVetoedEol ? 'Disposal' : 'Recovery'}</div>
                    </div>
                </div>

                {/* WIDGET 7: Disclosure Audit (col-span-12 lg:col-span-4) */}
                <div className={cn(cardBase, "col-span-12 lg:col-span-4")}>
                    <h3 className={headerBase}><Factory className="w-6 h-6 text-stone-500" /> Disclosure Audit</h3>
                    <p className="text-stone-500 text-base mb-8">
                        {isLowDisclosure
                            ? "Hidden Tier-3 data forces the Engine to apply a worst-case baseline shadow penalty."
                            : "High disclosure eliminates estimated shadow penalties."}
                    </p>
                    <div className="mt-auto">
                        <div className="h-6 w-full bg-stone-100 rounded-full flex overflow-hidden mb-4 shadow-inner">
                            <div className="bg-stone-900 h-full" style={{ width: `${((product.scope1_scope2_emissions || 0) / Math.max(0.001, (product.scope1_scope2_emissions || 0) + shadowPenalty)) * 100}%` }} />
                            {isLowDisclosure && <div className="bg-rose-300 h-full" style={{ width: `${(shadowPenalty / Math.max(0.001, (product.scope1_scope2_emissions || 0) + shadowPenalty)) * 100}%` }} />}
                        </div>
                        <div className="flex justify-between text-[11px] font-mono font-black uppercase tracking-widest text-stone-400">
                            <span>{isLowDisclosure ? 'Partial Data' : 'Verified Data'}</span>
                            {isLowDisclosure && <span className="text-rose-600">+ Risk Factor</span>}
                        </div>
                    </div>
                </div>

                {/* WIDGET 8: Energy Profile (col-span-12 lg:col-span-4) */}
                <div className={cn(cardBase, "col-span-12 lg:col-span-4")}>
                    <h3 className={headerBase}><Flame className="w-6 h-6 text-stone-500" /> Energy Profile</h3>
                    <p className="text-stone-500 text-base mb-8 font-serif italic">
                        Alignment between manufacturing efficiency and the regional renewable energy baseline.
                    </p>
                    <div className="mt-auto border-t border-stone-100 pt-8">
                        {falseEfficiency ? (
                            <div className="flex justify-between items-center text-rose-600 font-mono text-sm font-black uppercase tracking-widest">
                                <span className="flex items-center gap-2"><ShieldAlert size={14}/> Grid Liability</span>
                                <span className="text-xl">+40% CO2e</span>
                            </div>
                        ) : (
                            <div className="text-emerald-600 font-mono text-xs font-black uppercase tracking-[0.2em]">Verified Grid Baseline</div>
                        )}
                    </div>
                </div>

                {/* WIDGET 9: Packaging Performance (col-span-12 lg:col-span-4) */}
                <div className={cn(cardBase, "col-span-12 lg:col-span-4")}>
                    <h3 className={headerBase}><Box className="w-6 h-6 text-stone-500" /> Packaging Profile</h3>
                    <p className="text-stone-500 text-base mb-8 font-serif italic">
                        Measurement of disposable shipping mass relative to product mass.
                    </p>
                    <div className="mt-auto border-t border-stone-100 pt-8">
                        <div className="flex justify-between items-center">
                            <span className={dataLabel}>Mass Ratio</span>
                            <span className="font-mono text-2xl font-black text-stone-900 tracking-tighter">{packagingWasteRatio.toFixed(1)}x</span>
                        </div>
                    </div>
                </div>

                {/* WIDGET 10: The Better Alternative (col-span-12) */}
                {alternative && (
                    <div className="col-span-12 bg-stone-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
                        <div className="flex-1">
                            <h3 className="text-white text-lg font-bold mb-2 flex items-center gap-3"><RefreshCw className="w-5 h-5 text-emerald-400" /> Algorithmic Swap</h3>
                            <p className="text-stone-400 text-sm max-w-2xl">
                                This {product.material_type} item mathematically fails the planetary boundary test. The Engine suggests an identical category alternative with a {((1 - alternative.compositeScore / product.compositeScore) * 100).toFixed(0)}% lower violation risk.
                            </p>
                        </div>
                        <Link href={`/products/${alternative.product_id}`} className="shrink-0 bg-white rounded-2xl p-4 pr-6 flex items-center gap-6 hover:shadow-lg transition-all group">
                            <div className="w-16 h-16 bg-stone-100 rounded-xl flex items-center justify-center">
                                <Box className="w-8 h-8 text-stone-300" />
                            </div>
                            <div>
                                <div className={dataLabel}>{alternative.company}</div>
                                <div className="font-bold text-stone-800 mt-1">{alternative.product_name}</div>
                            </div>
                            <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-md font-mono font-bold ml-4">
                                {formatScore(alternative.compositeScore)}
                            </div>
                            <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-stone-600 transition-colors" />
                        </Link>
                    </div>
                )}

            </div>
        </section>
    );
}
