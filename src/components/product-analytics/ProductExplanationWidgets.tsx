'use client';

import { EnrichedProduct } from "@/lib/types";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, Zap, Factory, Flame, Droplets, ShieldAlert, CloudSnow, Trash2, ArrowRight, Box, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatScore } from "@/lib/formatters";

interface Props {
    product: EnrichedProduct;
    allProducts: EnrichedProduct[];
}

export function ProductExplanationWidgets({ product, allProducts }: Props) {
    // Shared Attributes
    const hasViolations = product.hazardous_chemicals_used === 'yes' || !!product.environmental_violations;
    const isSynthetic = ['Polyester', 'Nylon', 'Acrylic', 'Spandex', 'Elastane', 'Poly'].some(s => product.material_type.includes(s));
    const isBlend = product.material_type.includes('/') || product.material_type.includes('Blend') || product.material_type.includes(' and ');

    // 1. True Price Deficit
    const retailPrice = 45.00; // Simulated Baseline
    const costOfCarbon = product.scope1_scope2_emissions * 0.185;
    const costOfWater = product.water_consumed_per_unit * 0.002;
    const ecologicalCost = costOfCarbon + costOfWater;
    const truePrice = retailPrice + ecologicalCost;

    // 2. EOL Probability
    const probability = (isBlend || isSynthetic || product.plastic_percentage > 0) ? 0 : product.recyclability_score;

    // 3. Carbon Decay Curve (Durability)
    const lifespan = Math.max(1, product.average_lifespan);
    const decayData = Array.from({ length: Math.ceil(lifespan) }, (_, i) => {
        const year = i + 1;
        return {
            year: `Y${year}`,
            carbon: Number((product.scope1_scope2_emissions / year).toFixed(2))
        };
    });
    // 4. Thirst Translator
    const drinkingDays = product.water_consumed_per_unit / 2.5;
    const drinkingYears = (drinkingDays / 365).toFixed(1);

    // 6. Supply Chain Shadow
    const disclosure = product.supply_chain_disclosure.toLowerCase();
    const isLowDisclosure = disclosure === 'low' || disclosure === 'none' || product.esg_reporting_score < 40;
    const shadowPenalty = isLowDisclosure ? product.scope1_scope2_emissions * 1.5 : 0;

    // 7. Microplastic Shedding
    const sheds = isSynthetic || product.plastic_percentage > 0;
    const microplastics = sheds ? Math.round(product.plastic_percentage * 50 * 0.05) : 0;

    // 8. Energy Grid Reality Check
    const gridCoalHeavy = product.renewable_energy_ratio < 30;
    const falseEfficiency = ['A', 'B'].includes(product.energy_efficiency_rating) && gridCoalHeavy;

    // 9. Packaging Disproportion
    const packagingWasteRatio = product.packaging_weight_ratio || (product.plastic_percentage / 10) || 0.5;

    // 10. Better Alternative Swap
    let alternative: EnrichedProduct | undefined = undefined;
    if (product.compositeScore < 50) {
        const keywords = product.product_name.split(' ');
        alternative = allProducts.find(p => p.compositeScore > 70 && keywords.some(k => p.product_name.includes(k)) && p.product_id !== product.product_id);
        if (!alternative) {
            alternative = allProducts.find(p => p.compositeScore > 80 && p.product_id !== product.product_id);
        }
    }

    // Shared Card Style
    const cardBase = "bg-white border border-stone-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col";
    const headerBase = "text-stone-800 text-lg font-bold mb-2 flex items-center gap-3";
    const dataLabel = "font-mono text-sm text-stone-500 uppercase tracking-widest";

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
                            <h3 className={headerBase}><DollarSign className="w-5 h-5 text-stone-400" /> The True Ecological Price</h3>
                            <p className="text-stone-500 text-sm mb-6">Retail prices hide the externalized cost of carbon and water remediation.</p>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                                    <span className={dataLabel}>Retail Base Price</span>
                                    <span className="font-mono text-stone-800">${retailPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                                    <span className={dataLabel}>Planetary Hidden Tax</span>
                                    <span className="font-mono text-rose-500">+${ecologicalCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="font-bold text-stone-800 uppercase tracking-widest">True Cost Limit</span>
                                    <span className="font-mono text-2xl font-black text-stone-900">${truePrice.toFixed(2)}</span>
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

                {/* WIDGET 3: The Thirst Translator (col-span-12 lg:col-span-6) */}
                <div className={cn(cardBase, "col-span-12 lg:col-span-6")}>
                    <h3 className={headerBase}><Droplets className="w-5 h-5 text-blue-400" /> The Thirst Translator</h3>
                    <p className="text-stone-500 text-sm mb-8">
                        The {product.water_consumed_per_unit.toLocaleString()}L abstracted footprint translated to human necessity.
                    </p>
                    <div className="flex items-end gap-3 mt-auto border-t border-stone-100 pt-6">
                        <div className="text-5xl font-black text-stone-800 tracking-tighter">{drinkingYears}</div>
                        <div className={dataLabel}>Years of Human Drinking Water</div>
                    </div>
                </div>

                {/* WIDGET 4: Microplastic Predictor (col-span-12 lg:col-span-6) */}
                <div className={cn(cardBase, "col-span-12 lg:col-span-6", sheds ? "bg-stone-50" : "")}>
                    <h3 className={headerBase}><CloudSnow className="w-5 h-5 text-stone-400" /> Shedding Predictor</h3>
                    <p className="text-stone-500 text-sm mb-8">
                        {sheds
                            ? "Synthetic fibers shed directly into local water systems with every wash cycle."
                            : "No synthetic microfibers detected. Zero shedding penalty applied."}
                    </p>
                    <div className="flex items-end gap-3 mt-auto border-t border-stone-100 pt-6">
                        <div className="text-5xl font-black text-stone-800 tracking-tighter">{sheds ? `${microplastics}M` : "0"}</div>
                        <div className={dataLabel}>Fibers over 50 washes</div>
                    </div>
                </div>

                {/* WIDGET 5: Carbon Decay Curve (col-span-12 lg:col-span-8) */}
                <div className={cn(cardBase, "col-span-12 lg:col-span-8")}>
                    <h3 className={headerBase}><Zap className="w-5 h-5 text-stone-400" /> Carbon Debt Decay (Durability)</h3>
                    <p className="text-stone-500 text-sm mb-6">
                        Wearing this garment across its {lifespan} year lifespan mathematically amortizes its initial manufacturing debt.
                    </p>
                    <div className="h-[180px] w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={decayData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="decayColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d6d3d1" stopOpacity={0.6} />
                                        <stop offset="95%" stopColor="#d6d3d1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12, fontFamily: 'monospace' }} />
                                <YAxis hide domain={[0, 'dataMax']} />
                                <Tooltip cursor={{ stroke: '#e7e5e4', strokeWidth: 1 }} contentStyle={{ background: '#fff', border: '1px solid #f5f5f4', borderRadius: '12px', fontSize: '12px', color: '#57534e', fontFamily: 'monospace' }} />
                                <Area type="monotone" dataKey="carbon" stroke="#a8a29e" strokeWidth={2} fillOpacity={1} fill="url(#decayColor)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* WIDGET 6: EOL Matrix (col-span-12 lg:col-span-4) */}
                <div className={cn(cardBase, "col-span-12 lg:col-span-4", probability === 0 ? "bg-stone-50" : "")}>
                    <h3 className={headerBase}><Trash2 className="w-5 h-5 text-stone-400" /> EOL Matrix</h3>
                    <p className="text-stone-500 text-sm mb-8">
                        {probability === 0
                            ? "Mixed material construction makes recycling mathematically impossible at scale."
                            : "Mono-material permits mechanical scale recycling."}
                    </p>
                    <div className="mt-auto border-t border-stone-100 pt-6">
                        <div className="text-4xl font-black text-stone-800 tracking-tighter mb-1">{probability}%</div>
                        <div className={dataLabel}>Will hit {probability === 0 ? 'Landfill' : 'Recycler'}</div>
                    </div>
                </div>

                {/* WIDGET 7: Supply Chain Shadow (col-span-12 lg:col-span-4) */}
                <div className={cn(cardBase, "col-span-12 lg:col-span-4")}>
                    <h3 className={headerBase}><Factory className="w-5 h-5 text-stone-400" /> Supply Shadow</h3>
                    <p className="text-stone-500 text-sm mb-6">
                        {isLowDisclosure
                            ? "Hidden Tier-3 data forces the Engine to apply a worst-case baseline shadow penalty."
                            : "High disclosure eliminates estimated shadow penalties."}
                    </p>
                    <div className="mt-auto">
                        <div className="h-4 w-full bg-stone-100 rounded-full flex overflow-hidden mb-2">
                            <div className="bg-stone-800 h-full" style={{ width: `${(product.scope1_scope2_emissions / (product.scope1_scope2_emissions + shadowPenalty)) * 100}%` }} />
                            {isLowDisclosure && <div className="bg-rose-200 h-full" style={{ width: `${(shadowPenalty / (product.scope1_scope2_emissions + shadowPenalty)) * 100}%` }} />}
                        </div>
                        <div className="flex justify-between text-[10px] font-mono uppercase text-stone-400">
                            <span>Known Data</span>
                            {isLowDisclosure && <span className="text-rose-500">+ Shadow Penalty</span>}
                        </div>
                    </div>
                </div>

                {/* WIDGET 8: Energy Grid Reality (col-span-12 lg:col-span-4) */}
                <div className={cn(cardBase, "col-span-12 lg:col-span-4")}>
                    <h3 className={headerBase}><Flame className="w-5 h-5 text-stone-400" /> Grid Reality</h3>
                    <p className="text-stone-500 text-sm mb-6">
                        {falseEfficiency
                            ? `Factory claims high efficiency (${product.energy_efficiency_rating}), but operates on a coal-heavy grid.`
                            : "Efficiency claims align with the local grid's renewable baseline."}
                    </p>
                    <div className="mt-auto border-t border-stone-100 pt-6">
                        {falseEfficiency ? (
                            <div className="flex justify-between items-center text-rose-600 font-mono text-sm uppercase">
                                <span>Hidden Grid Penalty</span>
                                <span className="font-bold">+40% CO2e</span>
                            </div>
                        ) : (
                            <div className="text-emerald-600 font-mono text-sm uppercase">Grid Aligned</div>
                        )}
                    </div>
                </div>

                {/* WIDGET 9: Packaging Disproportion (col-span-12 lg:col-span-4) */}
                <div className={cn(cardBase, "col-span-12 lg:col-span-4")}>
                    <h3 className={headerBase}><Box className="w-5 h-5 text-stone-400" /> Pkg Disproportion</h3>
                    <p className="text-stone-500 text-sm mb-6">
                        {packagingWasteRatio > 1
                            ? "Single-use plastic shipping materials generate more footprint than the core product."
                            : "Packaging mass is structurally beneath the product mass."}
                    </p>
                    <div className="mt-auto border-t border-stone-100 pt-6">
                        <div className="flex justify-between items-center">
                            <span className={dataLabel}>Ratio (Pkg:Product)</span>
                            <span className="font-mono text-xl font-bold text-stone-800">{packagingWasteRatio.toFixed(1)}x</span>
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
