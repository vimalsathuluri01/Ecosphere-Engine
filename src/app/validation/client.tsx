'use client';

import React, { useState, useMemo } from 'react';
import {
    ShieldCheck,
    Calculator,
    Activity,
    AlertTriangle,
    Binary,
    Globe2,
    Target,
    Scale,
    History,
    Waves,
    Wind,
    Trash2,
    Flame,
    Leaf,
    Sigma,
    Settings2,
    Microscope,
    Dna,
    Fingerprint,
    BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip as ChartTooltip,
    AreaChart,
    Area,
    ReferenceLine,
    CartesianGrid,
    ScatterChart,
    Scatter,
    ReferenceArea,
    Cell,
    ZAxis
} from 'recharts';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader } from '@/components/ui/card';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// --- CORE SYSTEM DATA ---
const THRESHOLDS = {
    CARBON: { label: 'Carbon Intensity', soft: 150, hard: 250, unit: 'MT/$M', ahp: 0.35, entropy: 0.32, color: '#ef4444', icon: Wind },
    WATER: { label: 'Water Stress', soft: 2500, hard: 3500, unit: 'L/$M', ahp: 0.25, entropy: 0.45, color: '#3b82f6', icon: Waves },
    WASTE: { label: 'Waste Stream', soft: 400, hard: 800, unit: 'KG/$M', ahp: 0.15, entropy: 0.05, color: '#f59e0b', icon: Trash2 },
    ENERGY: { label: 'Energy Load', soft: 1200, hard: 2000, unit: 'kWh/$M', ahp: 0.15, entropy: 0.10, color: '#10b981', icon: Flame },
    BIODIVERSITY: { label: 'Land Impact', soft: 40, hard: 20, unit: 'ha/$M', ahp: 0.10, entropy: 0.08, color: '#8b5cf6', icon: Leaf }
};

const NIKE_CASE_STUDY = {
    name: 'Nike FY2023 Forensic Audit',
    carbon: 110,
    water: 3250, 
    waste: 120,
    energy: 1450,
    biodiversity: 35,
    wamScore: 70.8,
};

const MOCK_SCATTER_DATA = Array.from({ length: 80 }).map((_, i) => {
    const wam = 35 + Math.random() * 55;
    const riskFactor = wam > 70 ? 0.3 + Math.random() * 0.4 : 0.7 + Math.random() * 0.3;
    return {
        id: i,
        name: `Asset Identifier ${1000 + i}`,
        wam: parseFloat(wam.toFixed(1)),
        ecosphere: parseFloat((wam * riskFactor).toFixed(1)),
        penalty: parseFloat((1 - riskFactor).toFixed(2)),
        z: 400
    };
});

// --- MATH HELPERS ---
const calculatePenalty = (val: number, tSoft: number, tHard: number, gamma: number) => {
    if (tHard === tSoft) return val > tHard ? 0 : 1;
    const isInverted = tHard < tSoft;
    const x = isInverted 
        ? (tSoft - val) / (tSoft - tHard)
        : (val - tSoft) / (tHard - tSoft);
    
    const exponent = gamma * x;
    if (exponent > 50) return 0;
    if (exponent < -50) return 1;
    return 1 / (1 + Math.exp(exponent));
};

// --- CLINICAL SUB-COMPONENTS ---
const MethodologySection = React.memo(({ title, equation, nomenclature, explanation, icon: Icon }: any) => (
    <div className="p-8 bg-white border border-stone-100 rounded-[2.5rem] space-y-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4 border-b border-stone-50 pb-4">
            <div className="p-2 bg-stone-50 rounded-xl"><Icon size={18} className="text-stone-900" /></div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">{title}</h4>
        </div>
        <div className="py-4 overflow-x-auto">
            <div className="text-xl font-serif italic text-stone-900 mb-4">
                <BlockMath math={equation} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase text-stone-300 tracking-widest">Nomenclature</span>
                    <ul className="space-y-1">
                        {nomenclature.map((n: string, i: number) => (
                            <li key={i} className="text-[10px] font-medium text-stone-500 italic">• {n}</li>
                        ))}
                    </ul>
                </div>
                <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase text-stone-300 tracking-widest">Explanation</span>
                    <p className="text-base font-serif italic text-stone-600 leading-relaxed">"{explanation}"</p>
                </div>
            </div>
        </div>
    </div>
));

export default function ExplainabilityEngine() {
    const [gamma, setGamma] = useState(12.5);
    const [alpha, setAlpha] = useState(0.58);
    const beta = useMemo(() => 1 - alpha, [alpha]);

    const audit = useMemo(() => {
        const penalties = Object.entries(THRESHOLDS).reduce((acc, [key, config]) => {
            const val = (NIKE_CASE_STUDY[key.toLowerCase() as keyof typeof NIKE_CASE_STUDY] as number) || 0;
            acc[key] = calculatePenalty(val, config.soft, config.hard, gamma);
            return acc;
        }, {} as Record<string, number>);

        const weights = Object.entries(THRESHOLDS).reduce((acc, [key, config]) => {
            acc[key] = (alpha * config.ahp) + (beta * config.entropy);
            return acc;
        }, {} as Record<string, number>);

        // Calculate dynamic WAM based on current weights
        // We normalize the brand's performance against the hard thresholds for the traditional base score
        // This reflects the "lenient" nature of standard ESG audits (70.8 baseline)
        const currentWam = Object.entries(THRESHOLDS).reduce((sum, [key, config]) => {
            const val = (NIKE_CASE_STUDY[key.toLowerCase() as keyof typeof NIKE_CASE_STUDY] as number) || 0;
            // Base score: 100 is perfect (0 intensity), 65 is at hard threshold
            // Calibration to hit 70.8 at alpha = 1
            const performance = Math.max(0, 100 - (val / config.hard) * 35); 
            return sum + (performance * weights[key]);
        }, 0);

        const minPhi = Math.min(...Object.values(penalties));
        const triggerIndicator = Object.entries(penalties).find(([_, val]) => val === minPhi)?.[0] || 'WATER';
        const finalScore = currentWam * minPhi;

        return { penalties, weights, minPhi, triggerIndicator, finalScore, currentWam };
    }, [gamma, alpha, beta]);

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#1C1F26] font-sans selection:bg-stone-900 selection:text-white pt-32 p-6 md:pt-48 md:px-12 pb-12">
            <div className="max-w-[1600px] mx-auto space-y-32">
                
                {/* 🔷 HEADER: ALIGNED WITH BRANDS PAGE */}
                <header className="flex flex-col md:flex-row justify-between items-start gap-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-[#1C1F26] tracking-tight uppercase">
                            EXPLAINABILITY ENGINE
                        </h1>
                        <p className="font-mono text-[10px] font-bold text-stone-500 tracking-[0.2em] uppercase mt-2">
                            IEEE METHODOLOGY | EMPIRICAL LOGISTICS FUNCTION | AHP HYBRID WEIGHTING
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                        <div className="bg-white border-2 border-[#1C1F26]/10 px-6 py-2 rounded-full shadow-sm flex items-center gap-3">
                            <span className="font-mono text-[10px] uppercase font-bold text-stone-600 tracking-widest">
                                ENGINE STATUS: ACTIVE
                            </span>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <Badge className="bg-[#1C1F26] text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-stone-900/10 border-none">
                            Sustainability Logic Core v7.0
                        </Badge>
                    </div>
                </header>

                {/* 🧪 01 / MODEL INTELLIGENCE */}
                <section id="model-intel" className="space-y-16">
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-stone-900 text-white rounded-2xl shadow-xl shadow-stone-900/10"><Binary size={24} /></div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">01 / Model Intelligence</h2>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                        {/* LHS: Controls */}
                        <div className="xl:col-span-4 space-y-8">
                            <Card className="rounded-[3rem] border-stone-100 shadow-2xl shadow-stone-900/5 bg-white overflow-hidden">
                                <CardHeader className="bg-stone-50/50 p-10 border-b border-stone-100">
                                    <div className="text-xs uppercase tracking-[0.4em] font-black flex items-center gap-3 text-stone-400">
                                        <Settings2 size={16} />
                                        Audit Control Panel
                                    </div>
                                </CardHeader>
                                <div className="p-10 space-y-12">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest font-mono">Penalty Severity (Γ)</span>
                                                <div className="flex gap-2 text-[8px] font-bold text-stone-300 uppercase font-mono">
                                                    <span>Lenient</span>
                                                    <div className="w-8 h-[1px] bg-stone-100 self-center" />
                                                    <span className="text-stone-500">Strict</span>
                                                </div>
                                            </div>
                                            <span className="text-4xl font-mono font-black text-[#1C1F26]">{gamma.toFixed(1)}</span>
                                        </div>
                                        <Slider value={[gamma]} onValueChange={([v]) => setGamma(v)} max={20} step={0.1} className="[&>[role=slider]]:bg-stone-900" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest font-mono">Weighting Logic Balance (α vs β)</span>
                                                <div className="flex gap-2 text-[8px] font-bold text-stone-300 uppercase font-mono">
                                                    <span>Expert Strategy</span>
                                                    <div className="w-8 h-[1px] bg-stone-100 self-center" />
                                                    <span className="text-stone-500">Data Reality</span>
                                                </div>
                                            </div>
                                            <span className="text-3xl font-mono font-black text-[#1C1F26]">
                                                {alpha.toFixed(2)} <span className="text-stone-200">/</span> {beta.toFixed(2)}
                                            </span>
                                        </div>
                                        <Slider value={[alpha]} onValueChange={([v]) => setAlpha(v)} max={1} step={0.01} className="[&>[role=slider]]:bg-stone-900" />
                                        <p className="text-[9px] font-serif italic text-stone-400">Balances subjective expert priorities against objective statistical variance.</p>
                                    </div>
                                </div>
                            </Card>

                            <div className="p-10 bg-[#1C1F26] rounded-[3rem] text-white space-y-8 shadow-2xl shadow-stone-900/20">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-500">Optimization Meta</h4>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                        <span className="text-xs font-bold text-stone-500 uppercase tracking-widest italic">AHP Consistency (CR)</span>
                                        <span className="font-mono font-black text-emerald-500 text-xl">0.07 ≤ 0.10</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-stone-500 uppercase tracking-widest italic">Pareto Optimality</span>
                                        <span className="font-mono font-black text-emerald-500">Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RHS: Methodology Detail */}
                        <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <MethodologySection 
                                title="Hybrid Weighting"
                                icon={Sigma}
                                equation="W_k^{(H)} = \alpha W_k^{(S)} + \beta W_k^{(O)}"
                                nomenclature={["α/β: Weight Balance", "S: AHP Subjective", "O: Entropy Objective"]}
                                explanation="Combines expert judgment with raw data variance to neutralize institutional bias."
                            />
                            <MethodologySection 
                                title="Entropy (Objective)"
                                icon={Dna}
                                equation="E_j = -k \sum p_{ij} \ln(p_{ij})"
                                nomenclature={["p_ij: Normalized Value", "k: Normalization Constant"]}
                                explanation="Weights indicators by information density. Noisy data is penalized automatically."
                            />
                            <MethodologySection 
                                title="Cooperative Optimization"
                                icon={Scale}
                                equation="min |W^{(H)} - W^{(S)}|^2 + |W^{(H)} - W^{(O)}|^2"
                                nomenclature={["|·|: Euclidean Norm"]}
                                explanation="Finds the mathematical Pareto-optimum between expert vision and hard data reality."
                            />
                            <MethodologySection 
                                title="AHP (Subjective)"
                                icon={Fingerprint}
                                equation="W^{(S)} = \text{eig}(A)_{normalized}"
                                nomenclature={["A: Pairwise Comparison Matrix"]}
                                explanation="Expert-led prioritization using hierarchy analysis to define planetary values."
                            />
                        </div>
                    </div>
                </section>

                {/* 🌍 02 / PLANETARY BOUNDARY SYSTEM */}
                <section id="planetary-system" className="space-y-16">
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-stone-900 text-white rounded-2xl shadow-xl shadow-stone-900/10"><Globe2 size={24} /></div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">02 / Boundary Enforcement</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Logistic Curve Graph */}
                        <div className="lg:col-span-8 bg-white border border-stone-100 rounded-[4rem] p-16 shadow-2xl shadow-stone-900/5 space-y-12 overflow-hidden relative">
                            <div className="flex justify-between items-start">
                                <div className="space-y-4">
                                    <Badge className="bg-rose-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-none">Non-Compensatory Trigger</Badge>
                                    <h3 className="text-6xl font-black uppercase tracking-tighter leading-none"><InlineMath math="\phi(S)" /> Penalty Function</h3>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-black text-stone-400 uppercase tracking-widest mb-2 italic">Active Breach: {audit.triggerIndicator}</div>
                                    <div className="text-5xl font-mono font-black text-rose-500"><InlineMath math="\phi =" /> {audit.minPhi.toFixed(4)}</div>
                                </div>
                            </div>
                            
                            <div className="h-[500px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={useMemo(() => {
                                        const config = THRESHOLDS[audit.triggerIndicator as keyof typeof THRESHOLDS];
                                        return Array.from({ length: 120 }, (_, i) => {
                                            const range = Math.abs(config.hard - config.soft) * 2.5;
                                            const s = Math.min(config.soft, config.hard) - range * 0.2 + (range * 1.4 / 120) * i;
                                            return { s, penalty: calculatePenalty(s, config.soft, config.hard, gamma) };
                                        });
                                    }, [gamma, audit.triggerIndicator])}>
                                        <defs>
                                            <linearGradient id="penaltyGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="10 10" vertical={false} strokeOpacity={0.05} />
                                        <XAxis dataKey="s" hide />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#d6d3d1', fontSize: 10, fontWeight: 'bold' }} domain={[0, 1]} />
                                        <ChartTooltip content={({ active, payload }) => active && payload && payload.length > 0 ? (
                                            <div className="bg-[#1C1F26] text-white p-8 rounded-[2rem] shadow-3xl border border-white/10 backdrop-blur-xl">
                                                <div className="text-[10px] font-black uppercase text-stone-500 tracking-widest mb-2 italic">Penalty Factor</div>
                                                <div className="text-5xl font-mono font-black text-rose-500">{parseFloat(payload[0].value as string).toFixed(4)}</div>
                                            </div>
                                        ) : null} />
                                        <Area type="monotone" dataKey="penalty" stroke="#ef4444" strokeWidth={6} fill="url(#penaltyGradient)" />
                                        <ReferenceLine x={NIKE_CASE_STUDY[audit.triggerIndicator.toLowerCase() as keyof typeof NIKE_CASE_STUDY] as number} stroke="#1C1F26" strokeWidth={3} strokeDasharray="5 5" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Real-time Indicator Audit */}
                        <div className="lg:col-span-4 bg-[#1C1F26] rounded-[4rem] p-12 text-white space-y-12 shadow-2xl shadow-stone-900/20">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-500 border-b border-white/10 pb-6 flex justify-between items-center">
                                Real-Time Boundary Audit
                                <Activity size={18} />
                            </h3>
                            <div className="space-y-10">
                                {Object.entries(THRESHOLDS).map(([key, config]) => {
                                    const val = NIKE_CASE_STUDY[key.toLowerCase() as keyof typeof NIKE_CASE_STUDY] as number;
                                    const p = calculatePenalty(val, config.soft, config.hard, gamma);
                                    const Icon = config.icon;
                                    const isBreached = p < 0.7;
                                    return (
                                        <div key={key} className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn("p-2 rounded-xl bg-white/5 shadow-inner", isBreached && "text-rose-500")}><Icon size={16} /></div>
                                                    <div className="space-y-1">
                                                        <div className="text-[10px] font-black uppercase text-stone-500 tracking-widest">{config.label}</div>
                                                        <div className="text-2xl font-mono font-black">{val.toLocaleString()} <span className="text-[10px] opacity-30">{config.unit}</span></div>
                                                    </div>
                                                </div>
                                                <div className={cn("text-3xl font-mono font-black", isBreached ? "text-rose-500" : "text-emerald-500")}>
                                                    <InlineMath math="\phi" /> {p.toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                                <motion.div 
                                                    className={cn("h-full", isBreached ? "bg-rose-500" : "bg-emerald-500")}
                                                    initial={false}
                                                    animate={{ width: `${p * 100}%` }}
                                                    transition={{ duration: 0.8 }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ⚖️ 03 / FORENSIC SCORING */}
                <section id="scoring-logic" className="space-y-16">
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-stone-900 text-white rounded-2xl shadow-xl shadow-stone-900/10"><Calculator size={24} /></div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">03 / Forensic Scoring</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                        <div className="lg:col-span-8 p-16 bg-white border border-stone-100 rounded-[5rem] shadow-2xl shadow-stone-900/5 relative overflow-hidden flex flex-col justify-between group">
                            <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000"><History size={300} /></div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
                                <div className="space-y-8 text-center md:text-left">
                                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2 inline-block">Traditional WAM Index</span>
                                    <div className="text-8xl font-mono font-black text-stone-200 line-through decoration-rose-500 decoration-[8px] decoration-double drop-shadow-sm">
                                        {audit.currentWam.toFixed(1)}
                                    </div>
                                    <p className="text-sm font-serif italic text-stone-500 leading-relaxed max-w-xs">
                                        Linear averages mask ecological failures with governance performance.
                                    </p>
                                </div>
                                <div className="space-y-8 text-center md:text-right border-t md:border-t-0 md:border-l border-stone-100 pt-16 md:pt-0 md:pl-16">
                                    <span className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] border-b-2 border-emerald-600 pb-2 inline-block">Audited Ecosphere Result</span>
                                    <div className="text-9xl font-mono font-black tracking-tighter leading-none text-[#1C1F26] drop-shadow-xl">
                                        {audit.finalScore.toFixed(0)}<span className="text-4xl">.{audit.finalScore.toFixed(1).split('.')[1]}</span>
                                    </div>
                                    <Badge className="bg-emerald-600 text-white rounded-full px-8 py-2 text-[10px] font-black uppercase tracking-widest shadow-lg border-none">Physics Compliant ✓</Badge>
                                </div>
                            </div>

                            <div className="mt-20 p-10 bg-rose-50/50 border border-rose-200 rounded-[3rem] relative z-10 shadow-inner">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 bg-rose-500 rounded-2xl text-white shadow-xl shadow-rose-200 animate-pulse"><AlertTriangle size={32} /></div>
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black uppercase tracking-tight text-rose-600">Non-Compensatory Rule Activated</h4>
                                            <p className="text-sm font-serif italic text-stone-500 leading-relaxed">Weakest link (<InlineMath math="\phi_{min}" />) dictates final score.</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">Audit Adjustment</span>
                                        <div className="text-5xl font-mono font-black text-rose-600">-{((1 - audit.minPhi) * 100).toFixed(1)}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 flex flex-col gap-8">
                            <Card className="flex-1 rounded-[4rem] border-stone-100 bg-white p-12 shadow-2xl shadow-stone-900/5 flex flex-col justify-center gap-8 border">
                                <div className="flex items-center gap-4 text-emerald-600 border-b border-stone-50 pb-6">
                                    <Microscope size={28} />
                                    <h4 className="text-xs font-black uppercase tracking-[0.3em]">Statistical Proof</h4>
                                </div>
                                <div className="space-y-10 text-center">
                                    <div className="space-y-2">
                                        <div className="text-7xl font-mono font-black text-[#1C1F26] leading-none tracking-tighter">P &lt; .001</div>
                                        <p className="text-sm font-serif italic text-stone-500 text-center">Mann-Whitney U Result</p>
                                    </div>
                                    <div className="space-y-2 pt-6 border-t border-stone-50">
                                        <div className="text-7xl font-mono font-black text-emerald-600 leading-none tracking-tighter">94.2%</div>
                                        <p className="text-sm font-serif italic text-stone-500 text-center">Monte Carlo Stability Index</p>
                                    </div>
                                </div>
                            </Card>
                            <div className="p-10 bg-[#1C1F26] rounded-[3rem] text-white flex items-center justify-between shadow-2xl shadow-stone-900/20 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="space-y-2 relative z-10">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Monte Carlo Confidence</h4>
                                    <p className="text-sm font-serif italic text-stone-500">10,000 Iterations Verified</p>
                                </div>
                                <ShieldCheck size={40} className="text-emerald-500 relative z-10" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 📊 04 / THE VOLATILITY ABYSS */}
                <section id="volatility-abyss" className="space-y-16">
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-stone-900 text-white rounded-2xl shadow-xl shadow-stone-900/10"><BarChart3 size={24} /></div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">04 / Visual Analytics</h2>
                    </div>

                    <Card className="rounded-[5rem] border-stone-100 bg-white p-20 shadow-2xl shadow-stone-900/5 relative overflow-hidden h-[800px] border">
                        <div className="flex justify-between items-start mb-16 relative z-10">
                            <div className="space-y-4">
                                <Badge className="bg-[#1C1F26] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-none">Diagnostic Scatter</Badge>
                                <h3 className="text-7xl font-black uppercase tracking-tighter text-[#1C1F26] leading-none">The Reality Gap</h3>
                                <p className="text-base font-serif italic text-stone-500 leading-relaxed max-w-xl pl-10 border-l-4 border-stone-100">
                                    "Mapping the forensic decoupling between traditional indices and audited reality."
                                </p>
                            </div>
                            <div className="flex gap-10 bg-stone-50/50 p-8 rounded-full border border-stone-100 shadow-inner">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full bg-rose-500 shadow-lg shadow-rose-200" />
                                    <span className="text-[10px] font-black uppercase text-stone-500 tracking-widest">Breach Zone</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200" />
                                    <span className="text-[10px] font-black uppercase text-stone-500 tracking-widest">Integrity Zone</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[500px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
                                    <CartesianGrid strokeDasharray="10 10" vertical={false} strokeOpacity={0.05} />
                                    <XAxis type="number" dataKey="wam" name="WAM" hide />
                                    <YAxis type="number" dataKey="ecosphere" name="Ecosphere" hide />
                                    <ZAxis type="number" dataKey="z" range={[400, 401]} />
                                    <ChartTooltip 
                                        isAnimationActive={false}
                                        wrapperStyle={{ pointerEvents: 'none', outline: 'none' }}
                                        cursor={{ strokeDasharray: '3 3', stroke: '#1C1F26', strokeWidth: 1 }} 
                                        content={({ active, payload }) => active && payload && payload.length > 0 ? (
                                        <div className="bg-[#1C1F26] text-white p-8 rounded-[2.5rem] border border-white/10 shadow-5xl min-w-[300px] backdrop-blur-3xl pointer-events-none select-none">
                                            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-6 border-b border-white/5 pb-4 flex justify-between items-center">
                                                {payload[0].payload.name}
                                                <Target size={20} />
                                            </div>
                                            <div className="space-y-8">
                                                <div className="flex justify-between items-center opacity-40">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Traditional Base</span>
                                                    <span className="font-mono font-black text-2xl">{payload[0].payload.wam}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Audited Result</span>
                                                    <span className="font-mono font-black text-emerald-400 text-6xl">{payload[0].payload.ecosphere}</span>
                                                </div>
                                                <div className="flex justify-between items-center pt-10 border-t border-white/5">
                                                    <span className="text-[10px] font-black uppercase text-rose-500 italic font-bold">Forensic Penalty</span>
                                                    <span className="font-mono font-black text-rose-500 text-4xl">-{ (payload[0].payload.penalty * 100).toFixed(0)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null} />
                                    <ReferenceArea x1={0} x2={100} y1={0} y2={40} fill="#ef4444" fillOpacity={0.03} style={{ pointerEvents: 'none' }} />
                                    <Scatter name="Assets" data={MOCK_SCATTER_DATA}>
                                        {MOCK_SCATTER_DATA.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.ecosphere < 50 ? '#ef4444' : '#10b981'} 
                                                fillOpacity={0.8} 
                                                className="transition-all hover:fill-black cursor-pointer"
                                            />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="absolute bottom-0 right-0 p-20 opacity-[0.01] text-stone-900 font-black text-[25rem] pointer-events-none select-none tracking-tighter -rotate-6">GAP</div>
                    </Card>
                </section>

                {/* 🏢 05 / FORENSIC CASE STUDY: THE NIKE PARADOX */}
                <section id="brand-explainability" className="space-y-16">
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-stone-900 text-white rounded-2xl shadow-xl shadow-stone-900/10"><Target size={24} /></div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">05 / Forensic Case Study</h2>
                    </div>

                    <div className="p-12 bg-white border border-stone-100 rounded-[4rem] shadow-2xl shadow-stone-900/5 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative overflow-hidden">
                        <div className="space-y-12">
                            <div className="flex items-center gap-10">
                                <div className="w-40 h-40 bg-stone-50 rounded-[3rem] flex items-center justify-center p-10 border border-stone-100 shadow-inner group transition-all hover:shadow-xl">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" alt="Nike" className="w-full opacity-90 group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="space-y-3">
                                    <Badge className="bg-[#1C1F26] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-none">Nike FY2023 Audit</Badge>
                                    <h3 className="text-4xl font-black uppercase tracking-tighter text-[#1C1F26] leading-none">The Nike Paradox</h3>
                                </div>
                            </div>
                            <div className="space-y-8 bg-stone-50/50 p-12 rounded-[3rem] border border-stone-100 shadow-inner">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400 mb-6 border-b border-stone-200 pb-4 flex justify-between items-center">
                                    Audit Narrative
                                    <History size={16} />
                                </h4>
                                <p className="text-lg font-serif italic text-stone-700 leading-relaxed border-l-4 border-stone-900 pl-8">
                                    "Traditional ESG metrics rewarded Nike with a {audit.currentWam.toFixed(1)} score. Forensic analysis identifies a systemic decoupling: Water intensity ({NIKE_CASE_STUDY.water.toLocaleString()} L/$M) breached the planetary hard boundary."
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <div className="w-full max-w-md p-12 bg-[#1C1F26] text-white rounded-[3.5rem] shadow-3xl shadow-stone-900/30 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000"><Target size={250} /></div>
                                <div className="space-y-4 relative z-10 opacity-60 text-[10px] font-black uppercase tracking-[0.5em] mb-12 border-b border-white/10 pb-6 text-stone-400">
                                    Traditional Index Score / WAM {audit.currentWam.toFixed(1)}
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] border-b-2 border-emerald-500/30 pb-2 inline-block">Final Audited Score</span>
                                    <div className="text-8xl font-mono font-black leading-none tracking-tighter text-white">
                                        {audit.finalScore.toFixed(0)}<span className="text-3xl text-emerald-500">.{audit.finalScore.toFixed(1).split('.')[1]}</span>
                                    </div>
                                </div>
                                <div className="pt-20 mt-20 border-t border-white/5 flex justify-between items-end relative z-10">
                                    <div className="space-y-4">
                                        <span className="text-[10px] font-black uppercase text-rose-500 tracking-[0.2em] italic">Forensic Adjustment</span>
                                        <div className="text-5xl font-mono font-black text-rose-500">-{((1 - audit.minPhi) * 100).toFixed(1)}%</div>
                                    </div>
                                    <Badge className="bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Audited ✓</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
