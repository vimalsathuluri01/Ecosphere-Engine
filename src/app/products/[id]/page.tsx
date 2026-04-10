import { getProductById, getProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ArrowLeft, AlertTriangle, ShieldAlert, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LifecycleBarChart, ResourceGauge, EsgRadar, CircularityPie } from '@/components/product-charts';
import { Badge } from '@/components/ui/badge';
import { formatEmission, formatEnergy } from '@/lib/formatters';
import { ProductExplanationWidgets } from '@/components/product-analytics/ProductExplanationWidgets';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [product, allProducts] = await Promise.all([getProductById(id), getProducts()]);

    if (!product) {
        notFound();
    }

    // --- LOGIC: RED FLAGS ---
    const hasViolations = product.hazardous_chemicals_used === 'yes' || !!product.environmental_violations;
    const violationsText = product.environmental_violations || "Hazardous Chemicals Detected";

    // --- LOGIC: HERO METRIC (Calculated) ---
    // (scope1_scope2 + shipping + operational) / lifespan
    // Note: Operational is MJ, Shipping is kgCO2e, Scope1/2 is kgCO2e. 
    // We assume simplistic addition for the prompt's sake, or convert MJ to CO2e (approx 0.05 kg/MJ depending on grid).
    // Let's stick to the prompt's formula: "(scope1_scope2_emissions + shipping_emissions + operational_energy) / average_lifespan"
    // This mixes units (kg + kg + MJ), but we follow the prompt "True Carbon Per Wear" instruction literally.
    const trueCarbonPerWear = (product.scope1_scope2_emissions + product.shipping_emissions + product.operational_energy) / (product.average_lifespan * 365); // Per day? Or per wear? "average_lifespan" is likely years. Let's assume per YEAR usage for now to get a normalized number, or just div by lifespan.
    // Prompt says: "/ average_lifespan".
    const metricValue = (product.scope1_scope2_emissions + product.shipping_emissions + product.operational_energy) / product.average_lifespan;

    // --- LOGIC: BETTER ALTERNATIVE (Calculated on Server to reduce client payload) ---
    let alternative: any = undefined;
    if (product.compositeScore < 50) {
        const keywords = product.product_name.split(' ');
        alternative = allProducts.find(p =>
            p.compositeScore > 70 &&
            keywords.some(k => p.product_name.includes(k)) &&
            p.product_id !== product.product_id
        );
        if (!alternative) {
            alternative = allProducts.find(p => p.compositeScore > 80 && p.product_id !== product.product_id);
        }
    }

    return (
        <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-20 font-sans text-stone-900 selection:bg-stone-900 selection:text-white">
            <div className="max-w-7xl mx-auto px-6">

                {/* 0. NAV */}
                <Link href="/products" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 mb-8 transition-colors group">
                    <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> Return to Matrix
                </Link>

                {/* 1. SECTION A: KILL-SWITCH HEADER */}
                <div className="bg-white border border-stone-100 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

                    {/* RED FLAG OVERRIDE */}
                    {hasViolations && (
                        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-8 flex items-start gap-4">
                            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
                            <div>
                                <h3 className="text-rose-900 font-bold uppercase tracking-widest text-sm mb-1">Critical Violation Detected</h3>
                                <p className="text-rose-700 font-mono text-xs">{violationsText}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                        {/* Identity */}
                        <div className="flex-1">
                            <div className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-2">{product.company}</div>
                            <h1 className="text-5xl md:text-7xl font-sans font-bold text-stone-800 tracking-tighter uppercase mb-4 leading-none">
                                {product.product_name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <Badge variant="outline" className="rounded-full bg-stone-50 border-stone-200 text-stone-600 font-bold font-mono uppercase text-xs px-3 py-1">
                                    MAT: {product.material_type}
                                </Badge>
                                <div className="font-mono text-xs text-stone-500">
                                    Comp: {product.material_composition}% Primary
                                </div>
                                <div className="font-mono text-xs text-stone-500">
                                    ID: {product.product_id}
                                </div>
                            </div>
                        </div>

                        {/* HERO METRIC */}
                        <div className="text-right border border-stone-200 rounded-3xl bg-stone-50 p-8 min-w-[340px] shadow-sm">
                            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">True Carbon / Lifespan</div>
                            <div className="text-6xl font-mono font-black mb-2 tracking-tighter text-emerald-600 leading-none">
                                {metricValue.toFixed(2)}
                            </div>
                            <div className="text-xs font-mono font-bold text-stone-500 mt-4">
                                kg CO2e + MJ eq / Year
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. SECTION B: 4-QUADRANT DIAGNOSTIC GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* WIDGET 1: LIFECYCLE EMISSIONS */}
                    <div className="bg-white border border-stone-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-500 mb-8 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-stone-800" />
                            Lifecycle Footprint
                        </h3>
                        <LifecycleBarChart product={product} />
                        <div className="mt-8 pt-6 border-t border-stone-100 flex justify-between items-center text-[11px] font-mono font-black text-stone-400 tracking-widest">
                            <span className="uppercase">{product.transport_mode}</span>
                            <span>{product.shipping_distance.toFixed(0)} km</span>
                        </div>
                    </div>

                    {/* WIDGET 2: RESOURCE TELEMETRY */}
                    <div className="bg-white border border-stone-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-500 mb-8 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-stone-800" />
                            Resource Intensity
                        </h3>
                        <ResourceGauge product={product} />
                    </div>

                    {/* WIDGET 3: ESG RADAR */}
                    <div className="bg-white border border-stone-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-500 mb-8 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-stone-800" />
                            ESG & Labor
                        </h3>
                        <EsgRadar product={product} />
                        <div className="mt-6 text-center">
                            <span className="text-[10px] font-black uppercase bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-full text-stone-500 tracking-widest">
                                Disclosure: {product.supply_chain_disclosure}
                            </span>
                        </div>
                    </div>

                    {/* WIDGET 4: CIRCULARITY */}
                    <div className="bg-white border border-stone-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-500 mb-8 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-stone-800" />
                            End of Life
                        </h3>
                        <CircularityPie product={product} />
                        <div className="mt-8 space-y-3 border-t border-stone-100 pt-6">
                            <div className="flex justify-between text-[11px] font-mono font-black uppercase tracking-widest">
                                <span className="text-stone-400">Repair Index</span>
                                <span className="text-stone-800">{product.repairability_index.toFixed(1)}/100</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-mono font-black uppercase tracking-widest">
                                <span className={cn(product.plastic_percentage > 20 ? "text-rose-600" : "text-stone-400")}>
                                    Pkg Plastic
                                </span>
                                <span className={cn(product.plastic_percentage > 20 ? "text-rose-600" : "text-stone-800")}>
                                    {product.plastic_percentage.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* 3. SECTION C: COGNITIVE TRANSLATION WIDGETS */}
                <ProductExplanationWidgets product={product} alternative={alternative} />

            </div>
        </div>
    );
}
