'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { EnrichedProduct } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Zap, Droplets, Recycle, AlertCircle, ShoppingBag, Factory, ArrowLeft, TrendingDown, ShieldCheck, Box, Shirt, Footprints, Archive } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, Cell
} from 'recharts';
import { motion } from 'framer-motion';

interface ProductCompareProps {
    allProducts: EnrichedProduct[];
}

const COLORS = ["#0ea5e9", "#f43f5e", "#10b981", "#8b5cf6"];

// --- REFINED ZEN ECO CARD ---
const ZenCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-[0_4px_24px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)]", className)}>
        {children}
    </div>
);

const HeaderText = ({ children, icon, className }: { children: React.ReactNode, icon?: React.ReactNode, className?: string }) => (
    <h3 className={cn("text-xs font-black uppercase tracking-[0.3em] text-stone-400 mb-8 flex items-center gap-3", className)}>
        {icon && <span className="opacity-50">{icon}</span>}
        {children}
    </h3>
);

export function ProductCompareDashboard({ allProducts }: ProductCompareProps) {
    const searchParams = useSearchParams();
    const urlIds = searchParams.get('products')?.split(',') || [];

    const activeProducts = useMemo(() => {
        if (urlIds.length >= 2) {
            return urlIds.map(id => allProducts.find(p => p.product_id === id)).filter(Boolean) as EnrichedProduct[];
        }
        return allProducts.slice(0, 2);
    }, [allProducts, urlIds]);

    const radarData = useMemo(() => {
        return [
            { subject: 'Emissions', fullMark: 100 },
            { subject: 'Water', fullMark: 100 },
            { subject: 'Recyclability', fullMark: 100 },
            { subject: 'Circular Materials', fullMark: 100 },
            { subject: 'Low Waste', fullMark: 100 },
        ].map(item => {
            const dataPoint: any = { subject: item.subject };
            activeProducts.forEach((p, i) => {
                if (item.subject === 'Emissions') dataPoint[`p${i}`] = Math.max(10, 100 - p.scope1_scope2_emissions);
                if (item.subject === 'Water') dataPoint[`p${i}`] = Math.max(10, 100 - (p.water_consumed_per_unit / 50));
                if (item.subject === 'Recyclability') dataPoint[`p${i}`] = p.recyclability_score;
                if (item.subject === 'Circular Materials') dataPoint[`p${i}`] = 100 - p.plastic_percentage;
                if (item.subject === 'Low Waste') dataPoint[`p${i}`] = Math.max(10, 100 - (p.manufacturing_waste * 10));
            });
            return dataPoint;
        });
    }, [activeProducts]);

    return (
        <div className="space-y-12 pb-24">
            
            {/* 1. TOP HEADER CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {activeProducts.map((p, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={p.product_id} 
                        className="bg-white border border-stone-100 rounded-[2.5rem] p-7 flex items-center gap-6 shadow-sm relative group overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: COLORS[i] }} />
                        
                        <div className="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center shrink-0 border border-stone-100 group-hover:scale-110 transition-transform shadow-sm">
                            <CategoryIcon name={p.product_name} color={COLORS[i]} />
                        </div>
                        
                        <div className="min-w-0 flex-1">
                            <div className="text-[10px] font-bold text-stone-300 uppercase tracking-widest truncate mb-1">{p.company}</div>
                            <div className="text-lg font-black text-stone-900 tracking-tighter uppercase leading-none truncate">{p.product_name}</div>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i], opacity: 0.4 }} />
                                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">COHORT_{i + 1}</span>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-[9px] font-black uppercase tracking-widest text-stone-300 leading-none mb-1">Impact</div>
                            <div className="text-4xl font-black text-stone-900 tracking-tighter leading-none">{p.compositeScore}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-8">
                
                {/* 2. RADAR CHART */}
                <div className="col-span-12 lg:col-span-5">
                    <ZenCard className="h-full flex flex-col p-10">
                        <HeaderText icon={<Recycle className="w-5 h-5" />}>Ecological Intensity Profile</HeaderText>
                        
                        <div className="flex-1 flex items-center justify-center relative min-h-[450px]">
                            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
                                 style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
                            
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#e2e8f0" strokeWidth={1} />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 800, fontFamily: 'monospace' }} />
                                    {activeProducts.map((p, i) => (
                                        <Radar 
                                            key={p.product_id} 
                                            name={p.product_name} 
                                            dataKey={`p${i}`} 
                                            stroke={COLORS[i]} 
                                            strokeWidth={4} 
                                            fill={COLORS[i]} 
                                            fillOpacity={0.06}
                                            dot={{ r: 4, fill: COLORS[i] }}
                                        />
                                    ))}
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1c1917', color: 'white', border: 'none', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', fontSize: '12px', fontWeight: '800' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="pt-10 border-t border-stone-100 flex justify-between items-end">
                            <div className="space-y-1.5">
                                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">Systemic Divergence</div>
                                <div className="text-2xl font-black text-stone-900">0.84<span className="text-sm text-stone-300 ml-1">/1.0</span></div>
                            </div>
                            <div className="text-right space-y-1.5">
                                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">Telemetry Source</div>
                                <div className="text-sm font-black text-emerald-500 tracking-[0.2em] uppercase">HIGH-FIDELITY</div>
                            </div>
                        </div>
                    </ZenCard>
                </div>

                {/* 3. METRIC BARS */}
                <div className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <MetricCard 
                        title="Carbon Footprint" 
                        icon={<Zap className="w-5 h-5 text-amber-500" />}
                        unit="kg CO2e"
                        products={activeProducts}
                        dataKey="scope1_scope2_emissions"
                        insight="Includes direct and indirect operational loads per unit."
                    />
                    <MetricCard 
                        title="Water Consumption" 
                        icon={<Droplets className="w-5 h-5 text-sky-500" />}
                        unit="Liters"
                        products={activeProducts}
                        dataKey="water_consumed_per_unit"
                        insight="Net water extraction required for SKU lifecycle."
                    />
                    <MetricCard 
                        title="Circularity Score" 
                        icon={<Recycle className="w-5 h-5 text-emerald-500" />}
                        unit="/ 100"
                        products={activeProducts}
                        dataKey="recyclability_score"
                        insight="Theoretical recyclability based on component bond."
                    />
                    <MetricCard 
                        title="Plastic Ratio" 
                        icon={<AlertCircle className="w-5 h-5 text-rose-500" />}
                        unit="%"
                        products={activeProducts}
                        dataKey="plastic_percentage"
                        insight="Percentage of synthetic polymers in final product."
                    />
                </div>

                {/* 4. AUDIT TABLE */}
                <div className="col-span-12">
                    <ZenCard className="p-0 overflow-hidden border-2 border-stone-100">
                        <div className="p-10 border-b border-stone-100 bg-stone-50/40 flex justify-between items-center">
                            <HeaderText icon={<TrendingDown className="w-5 h-5" />} className="mb-0 text-stone-500">OPERATIONAL AUTOPSY: COMPONENT TRACE</HeaderText>
                            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-stone-100 shadow-sm">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">VERIFIED MATRIX</span>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white">
                                        <th className="py-8 px-10 text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 border-r border-stone-50 w-1/5">Parameter</th>
                                        {activeProducts.map((p, i) => (
                                            <th key={p.product_id} className="py-8 px-12 border-r border-stone-50 last:border-r-0">
                                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 font-mono opacity-60" style={{ color: COLORS[i] }}>IDENT_0{i + 1}</div>
                                                <div className="text-xl font-black text-stone-900 tracking-tighter uppercase leading-none truncate max-w-[220px]">{p.product_name}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="font-sans">
                                    <AuditRow label="Parent Company" products={activeProducts} dataKey="company" />
                                    <AuditRow label="Structural Material" products={activeProducts} dataKey="material_type" isMono />
                                    <AuditRow label="Packaging Specs" products={activeProducts} dataKey="packaging_material" />
                                    <AuditRow label="Total Waste (kg)" products={activeProducts} dataKey="manufacturing_waste" isMono isNum />
                                    <AuditRow label="Chemical Veto" products={activeProducts} dataKey="hazardous_chemicals_used" highlightVeto />
                                    <AuditRow label="Logistics Method" products={activeProducts} dataKey="transport_mode" isMono />
                                </tbody>
                            </table>
                        </div>
                    </ZenCard>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function CategoryIcon({ name, color }: { name: string, color: string }) {
    const pName = name.toLowerCase();
    let Icon = Archive;
    if (pName.includes('shirt') || pName.includes('tee') || pName.includes('blouse')) Icon = Shirt;
    else if (pName.includes('bag') || pName.includes('tote')) Icon = ShoppingBag;
    else if (pName.includes('shoe') || pName.includes('boot')) Icon = Footprints;
    else if (pName.includes('jacket') || pName.includes('coat')) Icon = Box;
    
    return <Icon className="w-8 h-8" style={{ color }} strokeWidth={1.5} />;
}

function MetricCard({ title, icon, unit, products, dataKey, insight }: any) {
    const maxVal = Math.max(...products.map((p: any) => p[dataKey]));
    
    return (
        <ZenCard className="flex flex-col justify-between p-10">
            <div>
                <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 shadow-sm">{icon}</div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-stone-500">{title}</h4>
                    </div>
                    <div className="text-[10px] font-bold text-stone-300 uppercase tracking-widest font-mono">MOD_{dataKey.substring(0, 3)}</div>
                </div>

                <div className="space-y-8">
                    {products.map((p: any, i: number) => {
                        const val = p[dataKey];
                        const progress = (val / (maxVal || 1)) * 100;
                        return (
                            <div key={p.product_id} className="space-y-3 group/bar">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold text-stone-400 uppercase tracking-tight truncate max-w-[160px] group-hover/bar:text-stone-900 transition-colors">{p.product_name}</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-2xl font-black text-stone-900 tracking-tighter">{typeof val === 'number' ? val.toLocaleString(undefined, { maximumFractionDigits: 1 }) : val}</span>
                                        <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">{unit}</span>
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-stone-50 rounded-full overflow-hidden relative border border-stone-100">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                        className="h-full rounded-full shadow-sm" 
                                        style={{ backgroundColor: COLORS[i] }} 
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="mt-10 pt-8 border-t border-stone-100">
                <p className="text-base font-serif italic text-stone-500 leading-relaxed max-w-[90%]">
                    {insight}
                </p>
            </div>
        </ZenCard>
    );
}

function AuditRow({ label, products, dataKey, isMono, isNum, highlightVeto }: any) {
    return (
        <tr className="border-b border-stone-50 hover:bg-stone-50/40 transition-colors group/row">
            <td className="py-7 px-10 text-xs font-bold uppercase text-stone-400 tracking-[0.15em] border-r border-stone-50 group-hover/row:text-stone-800 transition-colors">
                {label}
            </td>
            {products.map((p: any, i: number) => {
                const val = p[dataKey];
                const formattedVal = isNum && typeof val === 'number' ? val.toFixed(1) : val;
                const isVetoed = highlightVeto && (val === 'yes' || val === true);

                return (
                    <td key={p.product_id} className="py-7 px-12 border-r border-stone-50 last:border-r-0">
                        <span className={cn(
                            "text-lg font-bold tracking-tight",
                            isMono ? "font-mono" : "font-sans",
                            isVetoed ? "text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100 text-[11px] uppercase font-black tracking-widest shadow-sm" : "text-stone-800"
                        )}>
                            {formattedVal || "---"}
                        </span>
                    </td>
                );
            })}
        </tr>
    );
}
