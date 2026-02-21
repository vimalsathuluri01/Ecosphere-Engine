import Link from 'next/link';
import { ArrowUpRight, ShieldAlert, AlertTriangle, Leaf, Building2, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EnrichedBrand } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

interface BrandCardProps {
    brand: EnrichedBrand;
}

export function BrandCard({ brand }: BrandCardProps) {
    const isHighRisk = brand.tierLabel === 'Unsustainable' || brand.penaltyFactor < 0.9;
    const isRegenerative = brand.tierLabel === 'Regenerative';
    const isSustainable = brand.tierLabel === 'Sustainable';
    const hasPenalty = brand.penaltyFactor < 0.9;

    const borderColor = isRegenerative ? "border-emerald-500 hover:border-emerald-600" :
        isSustainable ? "border-blue-500 hover:border-blue-600" :
            isHighRisk ? "border-red-500 hover:border-red-600" :
                "border-yellow-500 hover:border-yellow-600"; // Transitional

    const badgeColor = isRegenerative ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
        isSustainable ? "bg-blue-50 text-blue-700 border-blue-200" :
            isHighRisk ? "bg-red-50 text-red-700 border-red-200" :
                "bg-yellow-50 text-yellow-700 border-yellow-200";

    return (
        <Link href={`/brands/${brand.id}`} className="group block h-full">
            <div className={cn(
                "h-full bg-white border-2 p-6 transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,0.1)] hover:-translate-y-1 flex flex-col relative overflow-hidden rounded-xl",
                borderColor
            )}>
                {/* Penalty Overlay */}
                {hasPenalty && (
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-bold uppercase px-3 py-1 rounded-bl-xl z-20 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Critical Penalty
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-start mb-6 mt-2">
                    <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                            {brand.Category}
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 leading-none uppercase tracking-tighter group-hover:underline decoration-2 underline-offset-4">
                            {brand.Brand_Name}
                        </h3>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-bold uppercase text-slate-400">Score</div>
                        <div className={cn("text-3xl font-black font-mono leading-none tracking-tighter", isHighRisk ? "text-red-600" : "text-slate-900")}>
                            {brand.compositeScore}
                        </div>
                    </div>
                </div>

                {/* Tier Badge */}
                <div className="mb-6">
                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border", badgeColor)}>
                        {brand.tierLabel}
                    </span>
                </div>

                {/* Strong Sustainability Metrics */}
                <div className="space-y-4 mb-6">
                    {/* Environmental */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold uppercase">
                            <span className="flex items-center gap-1 text-emerald-700">
                                <Leaf className="w-3 h-3" /> Environmental
                            </span>
                            <span className="text-slate-900">{brand.environmentScore.toFixed(0)}</span>
                        </div>
                        <Progress value={brand.environmentScore} className="h-1.5 bg-emerald-100" />
                        {hasPenalty && <div className="text-[9px] text-red-500 font-bold uppercase">↓ Impact Collapse (Penalty Active)</div>}
                    </div>

                    {/* Governance */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold uppercase">
                            <span className="flex items-center gap-1 text-blue-700">
                                <Building2 className="w-3 h-3" /> Governance
                            </span>
                            <span className="text-slate-900">{brand.governanceScore.toFixed(0)}</span>
                        </div>
                        <Progress value={brand.governanceScore} className="h-1.5 bg-blue-100" />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-slate-300" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Rank #{brand.compositeScore > 80 ? 'Top 10%' : 'Avg'}
                        </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                </div>

            </div>
        </Link>
    );
}
