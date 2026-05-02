'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { KPIRibbon } from './KPIRibbon';
import { IndustryClimateGap } from './IndustryClimateGap';
import { ImpactDrivers } from './ImpactDrivers';
import { ToxicityMatrix } from './ToxicityMatrix';
import { EChartsNexus } from './EChartsNexus';
import { OutlierTearSheet } from './OutlierTearSheet';
import { ExecutiveBriefing } from './ExecutiveBriefing';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnalyticsDashboard() {
    const [weightingMode, setWeightingMode] = useState<'entity_mode' | 'volume_mode'>('entity_mode');
    const [interventionLevel, setInterventionLevel] = useState(0);
    const [immediateSliderValue, setImmediateSliderValue] = useState(0);
    const [isPending, startTransition] = useTransition();
    const [data, setData] = useState<any>(null);

    const handleSliderChange = (val: number[]) => {
        setImmediateSliderValue(val[0]);
        startTransition(() => {
            setInterventionLevel(val[0]);
        });
    };

    useEffect(() => {
        fetch('/data/macro_system_data.json')
            .then(res => res.json())
            .then(d => setData(d));
    }, []);

    const currentData = data ? data[weightingMode] : null;

    // SIMULATION ENGINE (WHAT-IF LOGIC) - Declared BEFORE early return to satisfy Rules of Hooks
    const simulationResult = useMemo(() => {
        if (!currentData) return null;

        const factor = interventionLevel / 100;
        const deciles = [...currentData.deciles];
        const val10_orig = deciles[9].value;
        const val_median = deciles[4].value; // D5 is median

        // Cap the 10th decile
        const val10_sim = val10_orig - (factor * (val10_orig - val_median));
        const savedEmissions = val10_orig - val10_sim;

        const simulatedDeciles = deciles.map((d, i) => {
            if (i === 9) return { ...d, value: Math.round(val10_sim) };
            return d;
        });

        const totalOrig = deciles.reduce((acc, d) => acc + d.value, 0);
        const totalSim = totalOrig - savedEmissions;
        const topShareSim = Math.round((val10_sim / totalSim) * 100);
        const giniSim = (currentData.kpis.gini * (1 - (factor * 0.15))).toFixed(2);

        // Calculate equivalence in bottom deciles
        let bottomSum = 0;
        let bottomCount = 0;
        for (let i = 0; i < 9; i++) {
            bottomSum += deciles[i].value;
            if (bottomSum <= savedEmissions) bottomCount++;
            else break;
        }

        return {
            briefingMetrics: {
                savedEmissions: Math.round(savedEmissions),
                topShareDelta: topShareSim,
                newGini: Number(giniSim),
                equivalenceInDeciles: bottomCount
            },
            simulatedKPIs: {
                ...currentData.kpis,
                gini: Number(giniSim),
                top_10_share: topShareSim
            },
            simulatedDeciles
        };
    }, [interventionLevel, currentData]);

    if (!data || !currentData || !simulationResult) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
            <div className="font-mono text-[10px] animate-pulse uppercase tracking-[0.3em] text-stone-400">
                Calibrating Systemic Matrices...
            </div>
        </div>
    );

    const { simulatedKPIs, simulatedDeciles, briefingMetrics } = simulationResult;

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white font-sans pt-36 pb-36 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto space-y-32">

                {/* GLOBAL SYSTEM MODIFIER */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-b border-stone-200 pb-16">
                    <div className="max-w-2xl">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase text-stone-900 leading-[0.85] mb-8">
                            Macro<br />Analytics
                        </h1>
                        <p className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase leading-relaxed max-w-lg">
                            An industrial diagnostic map of the global fashion lifecycle. derived from the carbon and water footprint of 22,000 algorithmic entities.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
                        <div className="bg-white border border-stone-200 p-8 rounded-[2rem] shadow-sm flex items-center gap-6 flex-grow">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="weighting-mode" className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                                    Reality Check
                                </Label>
                                <span className="text-xs font-mono font-black uppercase">
                                    {weightingMode === 'entity_mode' ? 'By Factory Count' : 'By Prod. Volume'}
                                </span>
                            </div>
                            <Switch
                                id="weighting-mode"
                                checked={weightingMode === 'volume_mode'}
                                onCheckedChange={(checked) => setWeightingMode(checked ? 'volume_mode' : 'entity_mode')}
                            />
                        </div>

                        <div className="bg-[#1c1f26] text-white p-8 rounded-[2rem] shadow-xl flex flex-col gap-6 min-w-[320px] relative z-[110]">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Zap size={14} className={cn("text-emerald-400 fill-emerald-400", isPending && "animate-pulse")} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Policy Simulator</span>
                                </div>
                                <span className={cn(
                                    "text-xs font-mono font-black transition-colors",
                                    isPending ? "text-emerald-400/50" : "text-emerald-400"
                                )}>
                                    {immediateSliderValue}%
                                </span>
                            </div>
                            <Slider
                                value={[immediateSliderValue]}
                                max={100}
                                step={1}
                                onValueChange={handleSliderChange}
                                className="relative z-[120]"
                            />
                            <p className="text-[9px] font-bold text-stone-500 uppercase tracking-tighter">
                                {isPending ? 'Recalculating Systemic Shift...' : 'Force the Worst 10% to Clean Up'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* LAYER 0: THE INTELLIGENCE LAYER */}
                <div className="relative z-[110] pt-20 lg:pt-0">
                    <ExecutiveBriefing intervention={interventionLevel} metrics={briefingMetrics} />
                </div>

                {/* LAYER 1: THE EXECUTIVE REALITY */}
                <section className="space-y-24">
                    <KPIRibbon kpis={simulatedKPIs} />
                    <div className="grid grid-cols-12 gap-12">
                        <div className="col-span-12 lg:col-span-12">
                            <IndustryClimateGap data={simulatedDeciles} />
                        </div>
                    </div>
                </section>

                {/* LAYER 2: THE CAUSALITY BRIDGE */}
                <section className="space-y-16">
                    <div className="max-w-xl">
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">The Causality Bridge</h2>
                        <p className="text-base text-stone-600 leading-relaxed font-serif italic">
                            Quantifying the root physical drivers of systemic penalty. Every bar represents a normalized contribution to the industry's ecological debt footprint.
                        </p>
                    </div>
                    <ImpactDrivers drivers={currentData.drivers} />
                </section>

                {/* LAYER 3: THE DE-RISKED PROFILES */}
                <section className="space-y-24">
                    <div className="grid grid-cols-12 gap-12 items-start">
                        <div className="col-span-12 lg:col-span-7">
                            <EChartsNexus type="nexus" data={data.nexus} />
                        </div>
                        <div className="col-span-12 lg:col-span-5">
                            <ToxicityMatrix data={data.toxicityMatrix} />
                        </div>
                    </div>
                    <EChartsNexus type="parallel" data={data.productProfiles} />
                </section>

                {/* LAYER 4: THE MICRO-REALITY */}
                <section className="space-y-16">
                    <div className="max-w-xl">
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Systemic Outliers</h2>
                        <p className="text-base text-stone-600 leading-relaxed font-serif italic">
                            Individual entities displaying maximum entropy vs. the industry median. Precise deviation math anchored in the 20k baseline.
                        </p>
                    </div>
                    <OutlierTearSheet vanguard={currentData.vanguard} systemicRisks={currentData.systemicRisks} />
                </section>

                {/* NARRATIVE FOOTER */}
                <footer className="pt-32 border-t border-stone-200">
                    <div className="grid grid-cols-12 gap-12">
                        <div className="col-span-12 md:col-span-6">
                            <h3 className="text-4xl font-black uppercase tracking-tighter mb-6">Diagnostic Conclusion</h3>
                            <div className="space-y-6 text-stone-800 font-serif leading-relaxed text-xl italic">
                                <p>
                                    The data reveals a stark "Hockey Stick" concentration where the top decile of producers is responsible for over {currentData.kpis.top_10_share}% of total industry emissions. This is not a market failure, but a structural feature of the current volume-velocity logic.
                                </p>
                                <p>
                                    Switching to Volume Weighting exposes the shadow of the conglomerates, where a single entity's footprint consumes the environmental safe-space of thousands of small-to-midscale producers.
                                </p>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-6 flex flex-col justify-end items-end font-mono text-[9px] text-stone-400 uppercase tracking-widest text-right">
                            <div>Platform: Ecosphere Engine v2.0</div>
                            <div>Processing: 20,229 Brands</div>
                            <div>Last Aggregated: {data.metadata.timestamp}</div>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
}
