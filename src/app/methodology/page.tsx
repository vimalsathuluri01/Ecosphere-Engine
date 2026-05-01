'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowRight, BookOpen, Scale, ShieldCheck, AlertTriangle } from 'lucide-react'

export default function MethodologyPage() {
    return (
        <div className="min-h-screen bg-[#FDFCF8]">

            {/* Hero Header */}
            <div className="bg-[#2F4036] text-white py-24 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#5A7C64]/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <Badge variant="outline" className="mb-6 border-white/20 text-white/80 uppercase tracking-widest text-xs px-4 py-1">
                        Scientific Framework v2.1
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-serif">
                        Our Methodology
                    </h1>
                    <p className="text-xl text-[#E1EDE6]/80 max-w-2xl mx-auto leading-relaxed">
                        A constraint-integrated hybrid model for strong sustainability assessment, moving beyond compensatory ESG ratings.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                    {/* Sticky Sidebar Navigation */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Table of Contents</h3>
                            <nav className="space-y-1 border-l border-gray-200">
                                {['Core Philosophy', 'Data Sources', 'Scoring Algorithm', 'Penalty Factors', 'Verification Process'].map((item) => (
                                    <a
                                        key={item}
                                        href={`#${item.toLowerCase().replace(' ', '-')}`}
                                        className="block pl-4 py-2 text-sm text-gray-500 hover:text-[#5A7C64] hover:border-l-2 hover:border-[#5A7C64] transition-all -ml-[1px]"
                                    >
                                        {item}
                                    </a>
                                ))}
                            </nav>

                            <Card className="mt-8 bg-[#F9F6F0] border-0">
                                <CardContent className="p-6">
                                    <BookOpen className="w-8 h-8 text-[#5A7C64] mb-4" />
                                    <h4 className="font-bold mb-2">Download Ref.</h4>
                                    <p className="text-xs text-muted-foreground mb-4">Get the full IEEE Standard documentation.</p>
                                    <button className="text-xs font-bold text-[#5A7C64] flex items-center hover:underline">
                                        Download PDF <ArrowRight className="w-3 h-3 ml-1" />
                                    </button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 prose prose-slate max-w-none">

                        <section id="core-philosophy" className="mb-20">
                            <div className="flex items-center gap-3 mb-6">
                                <Scale className="w-8 h-8 text-[#5A7C64]" />
                                <h2 className="text-3xl font-bold text-[#2F4036] m-0">Core Philosophy</h2>
                            </div>
                            <p className="text-lg leading-loose text-gray-600">
                                Traditional ESG ratings utilize a <strong>compensatory logic</strong>, where high performance in governance or economic stability can offset poor environmental stewardship.
                                Ecosphere Engine rejects this model in favor of a <strong>Strong Sustainability</strong> approach.
                            </p>
                            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm my-8">
                                <h4 className="font-serif italic text-xl text-[#5A7C64] mb-4">"Planetary boundaries are non-negotiable."</h4>
                                <p className="m-0 text-sm md:text-base">
                                    A brand cannot buy its way out of carbon debt. Our algorithm isolates environmental impact as a primary constraint.
                                    Optimization only occurs <em>within</em> the safe operating space of planetary boundaries.
                                </p>
                            </div>
                        </section>

                        <Separator className="my-12" />

                        <section id="data-sources" className="mb-20">
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck className="w-8 h-8 text-[#5A7C64]" />
                                <h2 className="text-3xl font-bold text-[#2F4036] m-0">Verified Data Sources</h2>
                            </div>
                            <p className="text-lg leading-loose text-gray-600">
                                We aggregate data from over 50 verified public and private registers, bypassing self-reported marketing claims.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose my-8">
                                {[
                                    { title: 'Supply Chain Mapping', desc: 'Tier 1-3 supplier audits via Open Supply Hub.' },
                                    { title: 'Carbon Disclosure', desc: 'Scope 1, 2, & 3 emissions verified by CDP.' },
                                    { title: 'Water Usage', desc: 'Blue water footprint calculated per production unit.' },
                                    { title: 'Labor Rights', desc: 'Worker safety & wage data from ILO reports.' }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                                        <div className="w-2 h-full bg-[#5A7C64] rounded-full shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-[#2F4036] text-lg">{item.title}</h4>
                                            <p className="text-sm text-gray-500 m-0">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <Separator className="my-12" />

                        <section id="scoring-algorithm" className="mb-20">
                            <div className="flex items-center gap-3 mb-6">
                                <AlertTriangle className="w-8 h-8 text-[#5A7C64]" />
                                <h2 className="text-3xl font-bold text-[#2F4036] m-0">The Penalty Algorithm</h2>
                            </div>
                            <p className="text-lg leading-loose text-gray-600">
                                Unlike additive scoring, Ecosphere uses a <strong>Logistic Penalty Function</strong>.
                                As a brand approaches a planetary boundary (e.g., maximum carbon intensity per dollar), the penalty grows exponentially.
                            </p>

                            <div className="bg-[#2F4036] text-white p-8 rounded-[2rem] font-mono text-sm overflow-x-auto my-8 shadow-2xl">
                                <p className="opacity-50 mb-2">{`// Logistic Penalty Calculation`}</p>
                                <p>
                                    <span className="text-[#E8C3B0]">let</span> penalty = 0; <br />
                                    <span className="text-[#9DBFAE]">if</span> (metrics.carbon &gt; threshold) &#123; <br />
                                    &nbsp;&nbsp;penalty = <span className="text-[#E8DTC8]">Math.pow</span>(2, (metrics.carbon - threshold)); <br />
                                    &#125; <br />
                                    <span className="text-[#E8C3B0]">return</span> Math.max(0, baseScore - penalty);
                                </p>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    )
}
