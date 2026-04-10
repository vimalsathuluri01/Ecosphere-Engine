'use client';

import { Terminal, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { memo } from 'react';

interface Props {
    intervention: number;
    metrics: {
        savedEmissions: number;
        topShareDelta: number;
        newGini: number;
        equivalenceInDeciles: number;
    };
}

export const ExecutiveBriefing = memo(function ExecutiveBriefing({ intervention, metrics }: Props) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1c1f26] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group border border-white/5"
        >
            {/* Background Decorative Element */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-1000"></div>

            <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
                <div className="flex-grow space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500 p-2 rounded-lg">
                            <Terminal size={18} className="text-[#1c1f26]" />
                        </div>
                        <h2 className="text-xs font-mono font-black uppercase tracking-[0.3em] text-emerald-400">
                            System Pulse & Policy Impact
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.p 
                                key={intervention}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-3xl md:text-4xl font-black tracking-tight leading-[1.1]"
                            >
                                {intervention === 0 ? (
                                    <span>The system is currently in <span className="text-red-500">System Failure</span> state. The damage is concentrated and unmanaged.</span>
                                ) : (
                                    <span>Capping the worst offenders by <span className="text-emerald-400">{intervention}%</span> stops <span className="text-white underline decoration-emerald-500/50 decoration-4 underline-offset-8">{metrics.savedEmissions.toLocaleString()}</span> tons of damage.</span>
                                )}
                            </motion.p>
                        </AnimatePresence>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                                    <Sparkles size={12} className="text-emerald-500" />
                                    Improvement Potential
                                </div>
                                <p className="text-sm text-stone-300 font-serif italic leading-relaxed">
                                    This fix is equivalent to removing the entire footprint of the bottom <span className="font-bold text-white">{metrics.equivalenceInDeciles} groups</span> of factories combined.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                                    <ShieldAlert size={12} className="text-amber-500" />
                                    Policy Risk
                                </div>
                                <p className="text-sm text-stone-300 font-serif italic leading-relaxed">
                                    Fixing the 10% Risk Zone stabilizes the system imbalance to <span className="font-bold text-white">{metrics.newGini}</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-auto flex flex-col items-end gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono font-bold text-emerald-500/50 uppercase tracking-[0.2em] mb-1">Status</span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[9px] font-mono font-black text-emerald-400 uppercase tracking-tighter">Diagnostic Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});
