import React from 'react';
import { PenaltyCard } from './PenaltyCard';

export const BrandDashboard: React.FC = () => {
    return (
        <section
            className="bg-[#FAF9F6] min-h-screen px-4 py-12 md:px-8 lg:px-12 xl:px-16 font-sans"
            aria-label="Brand Detail Dashboard"
        >
            <div className="max-w-[1200px] mx-auto">

                {/* Top Header Metrics (Image 2 style) */}
                <div className="grid grid-cols-4 gap-6 mb-12 bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
                    <div>
                        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">
                            FINAL SCORE
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-black text-5xl text-stone-900 tracking-tighter">
                                53.08
                            </span>
                            <span className="font-mono text-sm text-stone-400">/100</span>
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">
                            GLOBAL RANK
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-black text-5xl text-stone-900 tracking-tighter">
                                #3
                            </span>
                            <span className="font-mono text-sm text-stone-400">/23</span>
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">
                            TRUST PENALTY
                        </div>
                        <div className="font-black text-5xl text-stone-900 tracking-tighter">
                            x 0.66
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-2">
                            PENALTY DRAG
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-black text-5xl text-rose-600 tracking-tighter">
                                34.3
                            </span>
                            <span className="font-mono text-xl text-rose-400">%</span>
                        </div>
                    </div>
                </div>

                {/* Section: Environmental Cost & Penalty Functions */}
                <div className="mb-6 flex items-center gap-2">
                    <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-xs font-bold text-stone-500 tracking-[0.2em] uppercase">
                        ENVIRONMENTAL COST & PENALTY FUNCTIONS
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <PenaltyCard
                        title="CARBON INTENSITY"
                        hasIssue={true}
                        value="122.22"
                        unit="MT/$M"
                        limit="100"
                        progressPercent={100}
                        totalVol="1.10M MT"
                        drag="30.0%"
                    />
                    <PenaltyCard
                        title="WATER INTENSITY"
                        hasIssue={true}
                        value="7,22,222"
                        unit="L/$M"
                        limit="63,10,000"
                        progressPercent={100}
                        totalVol="6.50B L"
                        drag="65.7%"
                    />
                    <PenaltyCard
                        title="WASTE INTENSITY"
                        hasIssue={false}
                        value="10,000"
                        unit="KG/$M"
                        limit="13,414"
                        progressPercent={74}
                        totalVol="90.00M KG"
                        drag="0.0%"
                    />
                </div>

                {/* Section: Cognitive Translation */}
                <div className="mb-6 mt-16 flex items-center gap-2">
                    <svg className="w-5 h-5 text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h2 className="text-xl font-black text-stone-900 tracking-tight uppercase">
                        COGNITIVE TRANSLATION
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Dark Reality Card */}
                    <div className="bg-[#1C1F26] rounded-[28px] p-8 text-white shadow-xl">
                        <div className="flex items-center gap-2 mb-10 opacity-70">
                            <span className="text-[9px] font-bold tracking-[0.2em] uppercase">THE MATH JOURNEY (REALITY VS MATERIALITY)</span>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                <div>
                                    <div className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">THEORETICAL ILLUSION</div>
                                    <div className="font-sans text-lg font-bold">Base ESG Policy Score</div>
                                </div>
                                <div className="font-black text-3xl">80.8</div>
                            </div>

                            <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                <div>
                                    <div className="text-[10px] text-rose-400 font-bold uppercase tracking-widest mb-1">NON-COMPENSATORY ALGORITHM</div>
                                    <div className="font-sans text-lg font-bold text-rose-500">Planetary Boundary Penalty</div>
                                </div>
                                <div className="font-black text-3xl text-rose-500">x 0.66</div>
                            </div>

                            <div className="flex justify-between items-end pt-2">
                                <div>
                                    <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1">THE REALITY</div>
                                    <div className="font-sans text-xl font-black text-white">FINAL ECOSPHERE SCORE</div>
                                </div>
                                <div className="font-black text-5xl">53.1</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border text-stone-900 rounded-[28px] p-8 shadow-sm">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="p-1.5 bg-rose-50 rounded text-rose-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <span className="text-[9px] font-bold text-stone-400 tracking-[0.2em] uppercase">THE WEAKEST LINK ISOLATOR</span>
                        </div>

                        <div className="text-[9px] font-bold text-rose-500 tracking-wider uppercase mb-2">SYSTEM COLLAPSE TRIGGER</div>
                        <h3 className="font-black text-4xl tracking-tighter leading-tight mb-4">
                            Water Extraction<br />Limit Exceeded
                        </h3>
                        <p className="font-mono text-sm leading-relaxed text-stone-500">
                            <strong className="text-stone-900 font-sans">Ecosphere Rule:</strong> You cannot compensate for destroying the planetary supply by scoring high in other categories. This score was dictated entirely by its worst biophysical offense.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
};
