'use client';

import React, { useState, useMemo } from 'react';
import { ShieldCheck, LineChart, Zap, Scale, MoveRight, XSquare, SlidersHorizontal, AlertTriangle, Fingerprint, PieChart as PieChartIcon, Activity, Database, GitMerge, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ScatterChart, Scatter, ZAxis, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import Link from 'next/link';

const ZenCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("bg-white border border-stone-100 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col", className)}>
        {children}
    </div>
);

const HeaderText = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <h3 className={cn("text-xl font-black uppercase tracking-tighter text-stone-800 mb-6 flex items-center gap-2", className)}>
        {children}
    </h3>
);

export default function ValidationClient() {

    // --- Mobile Anti-Fatigue State ---
    const [activeZone, setActiveZone] = useState<1 | 2 | 3 | 4>(1);

    // --- W1: Greenwash Extractor State ---
    const [isESGMode, setIsESGMode] = useState(true);
    const esgData = [
        { name: 'Traditional ESG', PR: 60, Policies: 25, Environmental: 10 },
    ];
    const ecoData = [
        { name: 'Ecosphere Engine', Base: 80, Penalty: -68, Final: 12 }
    ];

    // --- W2: Waterfall Data ---
    const waterfallData = [
        { name: 'Base Score', start: 0, val: 100, fill: '#10b981' },
        { name: 'Carbon Penalty', start: 80, val: 20, fill: '#f43f5e' },
        { name: 'Water Veto', start: 12, val: 68, fill: '#9f1239' },
        { name: 'Final Score', start: 0, val: 12, fill: '#1c1917' }
    ];

    // --- W3: S-Curve Data Generation ---
    const sCurveData = useMemo(() => {
        const data = [];
        const tSoft = 50;
        const tHard = 100;
        const gamma = 10;
        for (let i = 0; i <= 150; i += 2) {
            let penalty = 1.0;
            if (i > tSoft) {
                const exponent = gamma * (i - tSoft) / (tHard - tSoft);
                if (exponent > 50) penalty = 0;
                else penalty = 1 / (1 + Math.exp(exponent));
            }
            data.push({ intensity: i, multiplier: penalty });
        }
        return data;
    }, []);

    // --- W4: Live Math Sandbox State ---
    const [prWeight, setPrWeight] = useState(33);
    const [carbonWeight, setCarbonWeight] = useState(33);
    const [waterWeight, setWaterWeight] = useState(34);
    const [waterIntensity, setWaterIntensity] = useState(2500000); // 2.5M, clearly over 2M limit

    // Standard Ecosphere base
    const PR_SCORE = 95;
    const CARBON_SCORE = 80;
    const WATER_SCORE = 40;

    // Live Math computation
    const totalWeight = prWeight + carbonWeight + waterWeight;
    const normPR = totalWeight > 0 ? (prWeight / totalWeight) : 0;
    const normC = totalWeight > 0 ? (carbonWeight / totalWeight) : 0;
    const normW = totalWeight > 0 ? (waterWeight / totalWeight) : 0;

    const baseScore = ((PR_SCORE * normPR) + (CARBON_SCORE * normC) + (WATER_SCORE * normW));

    // Limits
    const tSoftWater = 1500000;
    const tHardWater = 2000000;
    let penalty = 1.0;
    if (waterIntensity > tSoftWater) {
        const exponent = 10 * (waterIntensity - tSoftWater) / (tHardWater - tSoftWater);
        if (exponent > 50) penalty = 0;
        else penalty = Math.min(1.0, 1 / (1 + Math.exp(exponent)));
    }
    const finalSandboxScore = baseScore * penalty;


    // --- W5: Algorithmic Swarm (Capped to 500 for Performance) ---
    const swarmData = useMemo(() => {
        const data = [];
        for (let i = 0; i < 500; i++) {
            const simulatedPRWeight = Math.random() * 100;
            // The score always clusters tightly around 12 because of the hard boundary veto
            const simulatedScore = 12 + (Math.random() * 3 - 1.5);
            data.push({ x: simulatedPRWeight, y: simulatedScore });
        }
        return data;
    }, []);

    // --- W6: Gauge Data ---
    const gaugeData = [
        { name: 'Confidence', value: 98, color: '#10b981' },
        { name: 'Remaining', value: 2, color: '#f5f5f4' }
    ];

    // --- W7: Distribution Data Generation ---
    const distData = useMemo(() => {
        return [
            ...Array(200).fill(0).map((_, i) => ({ id: i, score: Math.random() * 10, revenue: Math.random() * 1000 + 500, category: 'Fast Fashion' })),
            ...Array(60).fill(0).map((_, i) => ({ id: 200 + i, score: 20 + Math.random() * 30, revenue: Math.random() * 500 + 100, category: 'Transitioning' })),
            ...Array(20).fill(0).map((_, i) => ({ id: 260 + i, score: 60 + Math.random() * 25, revenue: Math.random() * 200, category: 'Strong Sustainability' }))
        ];
    }, []);


    return (
        <div className="min-h-screen bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white font-sans pt-24 md:pt-36 pb-36 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto space-y-12 md:space-y-16">

                {/* Header Section */}
                <header className="max-w-4xl text-center mx-auto">
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-stone-900 leading-[0.9]">
                        Validation &<br />Robustness
                    </h1>
                    <p className="max-w-2xl mx-auto text-[10px] md:text-xs font-mono font-bold tracking-widest text-stone-500 uppercase mt-6 md:mt-8 leading-relaxed px-4">
                        Defending Strong Sustainability via Non-Compensatory Mathematics & Monte Carlo Simulation. Visualizing the V5 Algorithm.
                    </p>
                </header>

                {/* Mobile Anti-Fatigue Tab Selector */}
                <div className="md:hidden flex overflow-x-auto pb-4 hide-scrollbar snap-x">
                    <div className="flex gap-2 min-w-max px-4">
                        <button onClick={() => setActiveZone(1)} className={cn("px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest snap-start transition-all", activeZone === 1 ? "bg-stone-900 text-white" : "bg-white text-stone-400 border border-stone-200")}>1. The Why</button>
                        <button onClick={() => setActiveZone(2)} className={cn("px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest snap-start transition-all", activeZone === 2 ? "bg-stone-900 text-white" : "bg-white text-stone-400 border border-stone-200")}>2. The How</button>
                        <button onClick={() => setActiveZone(3)} className={cn("px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest snap-start transition-all", activeZone === 3 ? "bg-stone-900 text-white" : "bg-white text-stone-400 border border-stone-200")}>3. Robustness</button>
                        <button onClick={() => setActiveZone(4)} className={cn("px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest snap-start transition-all", activeZone === 4 ? "bg-stone-900 text-white" : "bg-white text-stone-400 border border-stone-200")}>4. Macro</button>
                    </div>
                </div>

                {/* Desktop Grid Architecture */}
                <div className="grid grid-cols-12 gap-6">

                    {/* ======================= ZONE 1: Non-Compensatory Logic ======================= */}
                    <div className={cn("col-span-12 mt-4", activeZone !== 1 && "hidden md:block")}>
                        <h2 className="text-sm font-black uppercase tracking-widest text-emerald-600 mb-2 border-b border-stone-200 pb-4">Zone 1: The Non-Compensatory Logic (The "Why")</h2>
                    </div>

                    {/* Widget 1: Greenwash Extractor */}
                    <div className={cn("col-span-12 lg:col-span-6", activeZone !== 1 && "hidden md:block")}>
                        <ZenCard>
                            <HeaderText><ShieldCheck className="w-5 h-5 text-stone-400" /> The Greenwash Extractor</HeaderText>

                            <div className="flex bg-stone-100 p-1 rounded-xl w-full max-w-[300px] mb-8">
                                <button
                                    onClick={() => setIsESGMode(true)}
                                    className={cn("flex-1 text-[10px] md:text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-all", isESGMode ? "bg-white shadow-sm text-sky-600" : "text-stone-400 hover:text-stone-600")}
                                >
                                    Traditional
                                </button>
                                <button
                                    onClick={() => setIsESGMode(false)}
                                    className={cn("flex-1 text-[10px] md:text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-all", !isESGMode ? "bg-white shadow-sm text-emerald-600" : "text-stone-400 hover:text-stone-600")}
                                >
                                    Ecosphere
                                </button>
                            </div>

                            <div className="flex-1 h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    {isESGMode ? (
                                        <BarChart data={esgData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                                            <XAxis type="number" domain={[0, 100]} hide />
                                            <YAxis type="category" dataKey="name" hide />
                                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                                            <Bar dataKey="Environmental" stackId="a" fill="#14b8a6" radius={[0, 0, 0, 0]} name="Real Environmental Impact" />
                                            <Bar dataKey="Policies" stackId="a" fill="#38bdf8" name="Self-Reported Policies" />
                                            <Bar dataKey="PR" stackId="a" fill="#bef264" radius={[0, 8, 8, 0]} name="PR & Marketing" />
                                        </BarChart>
                                    ) : (
                                        <BarChart data={ecoData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                                            <XAxis type="number" domain={[0, 100]} hide />
                                            <YAxis type="category" dataKey="name" hide />
                                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                                            <Bar dataKey="Base" stackId="a" fill="#a8a29e" radius={[0, 0, 0, 0]} name="Base Score (Stripped of PR)" />
                                            <Bar dataKey="Penalty" stackId="a" fill="#f43f5e" radius={[0, 8, 8, 0]} name="Planetary Veto Deduction" />
                                        </BarChart>
                                    )}
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-6 text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 bg-stone-50 p-4 rounded-xl min-h-[70px] flex items-center">
                                {isESGMode ? "Watch what happens when you remove self-reported marketing from a sustainability score." : "The massive PR buffer evaporates. The Planetary Penalty crushes the remaining score."}
                            </div>
                        </ZenCard>
                    </div>

                    {/* Widget 2: Absolute Threshold Waterfall */}
                    <div className={cn("col-span-12 lg:col-span-6", activeZone !== 1 && "hidden md:block")}>
                        <ZenCard>
                            <HeaderText><GitMerge className="w-5 h-5 text-stone-400" /> Absolute Threshold Waterfall</HeaderText>
                            <p className="text-[10px] font-mono text-stone-400 uppercase mb-6 tracking-widest min-h-[70px]">
                                A brand starts with 100 points. They lose them by crossing absolute physical boundaries. They cannot earn them back with good behavior.
                            </p>

                            <div className="flex-1 h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#78716c', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                                        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#78716c', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', fontSize: '10px', fontFamily: 'monospace' }} formatter={(val: number) => val} />

                                        <Bar dataKey="start" stackId="a" fill="transparent" />
                                        <Bar dataKey="val" stackId="a" radius={[4, 4, 4, 4]}>
                                            {waterfallData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </ZenCard>
                    </div>


                    {/* ======================= ZONE 2: Mathematical Limits ======================= */}
                    <div className={cn("col-span-12 md:mt-12", activeZone !== 2 && "hidden md:block")}>
                        <h2 className="text-sm font-black uppercase tracking-widest text-[#7c3aed] mb-2 border-b border-stone-200 pb-4">Zone 2: The Mathematical Limits (The "How")</h2>
                    </div>

                    {/* Widget 3: S-Curve Boundary Map */}
                    <div className={cn("col-span-12 lg:col-span-8", activeZone !== 2 && "hidden md:block")}>
                        <ZenCard>
                            <HeaderText><LineChart className="w-5 h-5 text-stone-400" /> The S-Curve Boundary Map</HeaderText>
                            <div className="flex-1 h-[280px] w-full bg-stone-50 border border-stone-100 rounded-2xl p-4 md:p-6 overflow-hidden">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsLineChart data={sCurveData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <XAxis dataKey="intensity" tick={{ fill: '#78716c', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: '#e7e5e4' }} tickLine={false} />
                                        <YAxis domain={[0, 1.1]} tick={{ fill: '#78716c', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f5f5f4', fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold' }} formatter={(val: number) => [val.toFixed(2), "Multiplier"]} labelFormatter={(val: number) => `Intensity Volume: ${val}`} />
                                        <ReferenceLine x={50} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'top', value: 'T_soft', fill: '#f59e0b', fontSize: 10, fontWeight: 'bold' }} />
                                        <ReferenceLine x={100} stroke="#f43f5e" strokeDasharray="3 3" label={{ position: 'top', value: 'T_hard', fill: '#f43f5e', fontSize: 10, fontWeight: 'bold' }} />
                                        <Line type="monotone" dataKey="multiplier" stroke="#1c1917" strokeWidth={3} dot={false} isAnimationActive={false} />
                                    </RechartsLineChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-[10px] md:text-[11px] text-stone-500 font-mono font-bold uppercase tracking-widest mt-6 text-center">
                                Nature doesn't care if you are 'improving by 2%'. Once you cross a hard biophysical limit, the ecosystem collapses. Our math mirrors that collapse.
                            </p>
                        </ZenCard>
                    </div>

                    {/* Widget 4: The Live Math Sandbox */}
                    <div className={cn("col-span-12 lg:col-span-4", activeZone !== 2 && "hidden md:block")}>
                        <ZenCard className="bg-stone-50 text-stone-800 border-2 border-dashed border-stone-200">
                            <HeaderText className="mb-4"><SlidersHorizontal className="w-5 h-5 text-stone-400" /> The Hacker Sandbox</HeaderText>
                            <p className="text-[10px] font-mono font-bold tracking-widest text-stone-500 uppercase mb-6 leading-relaxed">
                                Live Math computation. Drag PR to 100%. Watch the final score refuse to budge because of the Water Penalty.
                            </p>

                            <div className="space-y-6 flex-1 bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex flex-col justify-center">
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2 text-emerald-600">
                                        <span>PR Weight (ESG)</span>
                                        <span>{prWeight}%</span>
                                    </div>
                                    <input type="range" min="0" max="100" value={prWeight} onChange={(e) => setPrWeight(Number(e.target.value))} className="w-full accent-emerald-500" aria-label="PR Weight (ESG)" title="PR Weight (ESG)" />
                                </div>

                                <div className="pt-4 border-t border-rose-100">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2 text-rose-600">
                                        <span>Water Intensity (L/$1M)</span>
                                        <span>{waterIntensity.toLocaleString()}</span>
                                    </div>
                                    <input type="range" min="0" max="3000000" step="50000" value={waterIntensity} onChange={(e) => setWaterIntensity(Number(e.target.value))} className="w-full accent-rose-500" aria-label="Water Intensity" title="Water Intensity" />
                                </div>
                            </div>

                            <div className="mt-6 p-6 rounded-2xl border flex flex-col items-center justify-center transition-all duration-500 bg-white shadow-sm border-stone-100">
                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Enforced Final Score</span>
                                <span className={cn("font-mono font-black text-6xl tracking-tighter", finalSandboxScore < 15 ? "text-rose-600" : "text-emerald-600")}>
                                    {finalSandboxScore.toFixed(1)}
                                </span>
                            </div>
                        </ZenCard>
                    </div>


                    {/* ======================= ZONE 3: Monte Carlo Robustness ======================= */}
                    <div className={cn("col-span-12 md:mt-12", activeZone !== 3 && "hidden md:block")}>
                        <h2 className="text-sm font-black uppercase tracking-widest text-[#0ea5e9] mb-2 border-b border-stone-200 pb-4">Zone 3: Monte Carlo Robustness (Visualizing the Defense)</h2>
                    </div>

                    {/* Widget 5: The Algorithmic Swarm */}
                    <div className={cn("col-span-12 lg:col-span-8", activeZone !== 3 && "hidden md:block")}>
                        <ZenCard>
                            <HeaderText><Activity className="w-5 h-5 text-stone-400" /> The Algorithmic Swarm (500 Node Sample)</HeaderText>
                            <div className="flex-1 h-[300px] w-full bg-stone-900 rounded-2xl p-4 md:p-6 overflow-hidden relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <XAxis type="number" dataKey="x" name="PR Weight %" tick={{ fill: '#78716c', fontSize: 10, fontFamily: 'monospace' }} domain={[0, 100]} axisLine={false} tickLine={false} label={{ value: 'SUBJECTIVE PR WEIGHT APPLIED (%)', position: 'insideBottom', fill: '#57534e', fontSize: 10, fontFamily: 'monospace', dy: 20 }} />
                                        <YAxis type="number" dataKey="y" name="Final Score" tick={{ fill: '#78716c', fontSize: 10, fontFamily: 'monospace' }} domain={[0, 100]} axisLine={false} tickLine={false} />
                                        <ZAxis type="number" range={[4, 4]} />
                                        <Tooltip cursor={{ strokeDasharray: '3 3', stroke: '#57534e' }} contentStyle={{ backgroundColor: '#1c1917', border: 'none', color: '#fff', borderRadius: '12px', fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold' }} />
                                        <Scatter name="Simulation Run" data={swarmData} fill="#38bdf8" opacity={0.6} />
                                        <ReferenceLine y={12} stroke="#f43f5e" strokeWidth={2} label={{ position: 'top', value: 'Rigid Final Output (12.0)', fill: '#f43f5e', fontSize: 10, fontWeight: 'bold' }} />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-[10px] md:text-[11px] text-stone-500 font-mono font-bold uppercase tracking-widest mt-8 text-center bg-stone-50 p-4 rounded-xl border border-stone-100">
                                Rendered 500 permutations. The score clusters tightly around 12, regardless of how much weight is given to PR. The math is un-hackable.
                            </p>
                        </ZenCard>
                    </div>

                    {/* Widget 6: Survival Gauge & Heatmap */}
                    <div className={cn("col-span-12 lg:col-span-4", activeZone !== 3 && "hidden md:block")}>
                        <ZenCard className="flex flex-col p-4 md:p-6 gap-6">

                            {/* Top Half: Gauge */}
                            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 flex-1 flex flex-col justify-center items-center">
                                <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2 mb-4"><ShieldCheck className="w-3 h-3 text-emerald-500" /> Score Confidence</h4>
                                <div className="h-[80px] w-[160px] relative overflow-hidden">
                                    <ResponsiveContainer width="100%" height="200%">
                                        <PieChart>
                                            <Pie data={gaugeData} startAngle={180} endAngle={0} innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                                                {gaugeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none">
                                        <span className="text-4xl font-black text-stone-800 tracking-tighter">98%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Half: Heatmap Mini */}
                            <div className="bg-rose-50 p-6 rounded-2xl border border-rose-200 outline outline-4 outline-rose-100/50 flex flex-col justify-center items-center text-center">
                                <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-2 mb-2"><AlertTriangle className="w-3 h-3" /> Highest Sensitivity Trigger</h4>
                                <div className="text-xl md:text-2xl font-black text-rose-700 tracking-tighter uppercase mb-1">Water Runoff</div>
                                <p className="text-[9px] font-mono text-rose-600/70 uppercase tracking-widest">Crucial Vulnerability Identified</p>
                            </div>

                        </ZenCard>
                    </div>


                    {/* ======================= ZONE 4: Macro Perspective & Action ======================= */}
                    <div className={cn("col-span-12 md:mt-12", activeZone !== 4 && "hidden md:block")}>
                        <h2 className="text-sm font-black uppercase tracking-widest text-[#f43f5e] mb-2 border-b border-stone-200 pb-4">Zone 4: Macro Perspective & Action (The Result)</h2>
                    </div>

                    {/* Widget 7: Industry "Death Valley" */}
                    <div className={cn("col-span-12 lg:col-span-8", activeZone !== 4 && "hidden md:block")}>
                        <ZenCard>
                            <HeaderText><Database className="w-5 h-5 text-stone-400" /> The Industry "Death Valley" Plot</HeaderText>

                            <div className="h-[300px] md:h-[350px] w-full mt-4 bg-[#FAF9F6] border border-stone-200 rounded-2xl p-4 md:p-6 overflow-hidden relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                        <XAxis type="number" dataKey="revenue" name="Revenue" tick={{ fill: '#78716c', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: '#e7e5e4' }} tickLine={false} label={{ value: 'BRAND VOLUME', position: 'insideBottom', fill: '#57534e', fontSize: 10, fontFamily: 'monospace', dy: 20 }} />
                                        <YAxis type="number" dataKey="score" name="Score" domain={[0, 100]} tick={{ fill: '#78716c', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: '#e7e5e4' }} tickLine={false} label={{ value: 'SCORE', angle: -90, position: 'insideLeft', fill: '#57534e', fontSize: 10, fontFamily: 'monospace', dx: 15 }} />
                                        <ZAxis type="number" range={[15, 15]} />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f5f5f4', fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold' }} />
                                        <ReferenceLine y={15} stroke="none" label={{ value: 'DEATH VALLEY (SCORE < 15)', fill: '#f43f5e', fontSize: 10, fontWeight: '900', position: 'insideBottomRight' }} />
                                        <Scatter name="Distribution" data={distData} fill="#1c1917" opacity={0.4} />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                        </ZenCard>
                    </div>

                    {/* Widget 8: The Redemption CTA */}
                    <div className={cn("col-span-12 lg:col-span-4", activeZone !== 4 && "hidden md:block")}>
                        <ZenCard className="bg-stone-900 border-none text-white shadow-2xl justify-center items-center text-center">
                            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-emerald-400">The Power is Yours.</h3>
                            <p className="text-xs font-mono leading-relaxed text-stone-400 mb-8 max-w-xs uppercase tracking-widest">
                                The math is brutal, but the solution is simple. Stop funding physical destruction. Vote with your capital.
                            </p>
                            <Link href="/products" className="group w-full max-w-sm flex items-center justify-between bg-white text-stone-900 font-bold uppercase tracking-widest text-xs px-6 py-4 rounded-xl hover:bg-stone-100 transition-colors">
                                Explore Survivors
                                <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </ZenCard>
                    </div>

                </div>
            </div>
        </div>
    );
}
