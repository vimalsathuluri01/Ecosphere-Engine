'use client';

import React, { useState, useMemo } from 'react';
import { 
    ShieldCheck, 
    Layers, 
    ChevronRight, 
    Activity,
    AlertTriangle,
    ArrowRight,
    Search,
    Binary,
    ArrowDownLeft,
    CheckCircle2,
    Settings2,
    Globe2,
    FlaskConical,
    Terminal,
    Microscope,
    ArrowDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
    ResponsiveContainer, 
    XAxis, 
    YAxis, 
    AreaChart, 
    Area,
    ReferenceLine,
    CartesianGrid,
    ScatterChart,
    Scatter,
    ReferenceArea,
    Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const THRESHOLDS = {
    CARBON: { soft: 150, hard: 250, unit: 'MT/$M', ahp: 0.35, entropy: 0.32 },
    WATER: { soft: 2500, hard: 3500, unit: 'L/$M', ahp: 0.25, entropy: 0.45 },
    DURABILITY: { soft: 3.0, hard: 1.5, unit: 'Yrs', ahp: 0.20, entropy: 0.10 },
    WASTE: { soft: 400, hard: 800, unit: 'KG/$M', ahp: 0.10, entropy: 0.05 },
    MATERIALS: { soft: 40, hard: 20, unit: '%', ahp: 0.05, entropy: 0.05 },
    TRANSPARENCY: { soft: 50, hard: 30, unit: 'Score', ahp: 0.05, entropy: 0.03 }
};

const MOCK_DATA = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    name: `Entity_${i}`,
    score: 10 + Math.random() * 90,
    vol: 5 + Math.random() * 20,
    isOutlier: Math.random() > 0.9
}));

const NIKE_CASE_STUDY = {
    name: 'Nike FY2023',
    carbon: 110, 
    water: 3200, 
    durability: 3.5, 
    waste: 120, 
    materials: 45, 
    transparency: 48, 
    esgScore: 70.8,
};

const calculatePenalty = (val: number, tSoft: number, tHard: number, gamma: number) => {
    const diff = tHard - tSoft;
    if (Math.abs(diff) < 0.0001) return 1;
    const exponent = gamma * (val - tSoft) / diff;
    if (exponent > 50) return 0;
    if (exponent < -50) return 1;
    return 1 / (1 + Math.exp(exponent));
};

const Sub = ({ children }: { children: React.ReactNode }) => (
    <span className="text-[10px] align-sub opacity-50 font-sans italic mx-px font-bold uppercase">{children}</span>
);

const MathBlock = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("font-serif italic text-2xl md:text-3xl tracking-tight text-stone-800", className)}>
        {children}
    </div>
);

const StepBadge = ({ num, label }: { num: string, label: string }) => (
    <div className="flex items-center gap-4 mb-4">
        <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-black">{num}</div>
        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">{label}</span>
    </div>
);

export default function ForensicAuditPanel() {
    const [selectedBrand, setSelectedBrand] = useState(NIKE_CASE_STUDY);
    const [gamma] = useState(10.0);
    const [alpha] = useState(0.58);
    const beta = 1 - alpha;

    const audit = useMemo(() => {
        const p: any = {};
        Object.entries(THRESHOLDS).forEach(([key, config]) => {
            const val = (selectedBrand as any)[key.toLowerCase()] || 0;
            p[key] = calculatePenalty(val, config.soft, config.hard, gamma);
        });

        const minPhi = Math.min(...(Object.values(p) as number[]));
        const trigger = Object.entries(p).find(([_, val]) => val === minPhi)?.[0] || 'WATER';
        const finalScore = selectedBrand.esgScore * minPhi;

        return { penalties: p, minPhi, trigger, finalScore };
    }, [selectedBrand, gamma]);

    const isCollapse = audit.minPhi < 0.5;

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans pt-24 pb-36 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto space-y-24">
                
                {/* Header */}
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-stone-900 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Model Intelligence Core</div>
                            <div className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border", isCollapse ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-emerald-50 border-emerald-200 text-emerald-600")}>
                                {isCollapse ? "⚠ CAUSAL COLLAPSE" : "✓ STABLE AUDIT"}
                            </div>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8]">Explainability<br />Engine</h1>
                    </div>
                </header>

                {/* Main Trace */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-stone-200 border border-stone-200 rounded-[3rem] overflow-hidden shadow-2xl">
                    <div className="bg-white p-16 space-y-12">
                        <StepBadge num="01" label="Weighted ESG Base" />
                        <MathBlock>S = Σ w<Sub>k</Sub>S<Sub>k</Sub> = {selectedBrand.esgScore.toFixed(2)}</MathBlock>
                        <div className="flex justify-center"><ArrowDown className="text-stone-200" size={32} /></div>
                        <StepBadge num="02" label="Planetary Boundary Penalty" />
                        <div className="bg-rose-50 p-8 rounded-3xl border border-rose-200 flex justify-between items-center">
                            <span className="text-xs font-black uppercase text-rose-900 italic">min(phi) Factor</span>
                            <span className="text-4xl font-mono font-black text-rose-600">× {audit.minPhi.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-center"><ArrowDown className="text-stone-200" size={32} /></div>
                        <div className="bg-stone-900 text-white p-10 rounded-3xl shadow-xl flex justify-between items-center">
                            <span className="text-xs font-black uppercase text-emerald-400">Final Audited Score</span>
                            <span className="text-6xl font-mono font-black text-emerald-400 tracking-tighter">{audit.finalScore.toFixed(1)}</span>
                        </div>
                    </div>
                    
                    <div className="bg-stone-900 p-16 text-white flex flex-col justify-center space-y-12">
                         <h3 className="text-4xl font-black tracking-tighter uppercase leading-none">The Nike Paradox:<br />Verified.</h3>
                         <p className="text-sm font-medium text-stone-400 uppercase leading-relaxed italic border-l-2 border-emerald-500 pl-8">"Environmental failure cannot be compensated by governance gains. Once a planetary boundary is breached, the system collapses."</p>
                         <div className="grid grid-cols-2 gap-8">
                             <div className="p-6 bg-white/5 rounded-2xl border border-white/10"><div className="text-[8px] font-black text-stone-500 uppercase mb-1">P-Value</div><div className="text-xl font-mono font-black text-emerald-400">&lt; 0.001</div></div>
                             <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-right"><div className="text-[8px] font-black text-stone-500 uppercase mb-1">Cohen's d</div><div className="text-xl font-mono font-black text-rose-500">0.73</div></div>
                         </div>
                    </div>
                </div>

                {/* Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 bg-white border border-stone-200 rounded-[3rem] p-12 h-[500px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" dataKey="score" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <YAxis type="number" dataKey="vol" domain={[0, 30]} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <Scatter name="Entities" data={MOCK_DATA}>
                                    {MOCK_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.isOutlier ? '#f43f5e' : '#10b981'} fillOpacity={0.4} r={entry.isOutlier ? 4 : 2} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="lg:col-span-4 bg-white border border-stone-200 rounded-[3rem] p-12 space-y-8">
                        <StepBadge num="03" label="Diagnostic Logic" />
                        <div className="space-y-6">
                            {[
                                { text: `Breach: ${audit.trigger}`, color: 'text-rose-500' },
                                { text: `Penalty phi = ${audit.minPhi.toFixed(4)}`, color: 'text-stone-400' },
                                { text: `Rule: Non-Compensatory`, color: 'text-stone-400' },
                                { text: `Audit Result: Verified`, color: 'text-emerald-500' }
                            ].map((s, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className={cn("w-1.5 h-1.5 rounded-full", s.color.includes('rose') ? "bg-rose-500" : s.color.includes('emerald') ? "bg-emerald-500" : "bg-stone-200")} />
                                    <span className={cn("text-[10px] font-black uppercase tracking-widest", s.color)}>{s.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
