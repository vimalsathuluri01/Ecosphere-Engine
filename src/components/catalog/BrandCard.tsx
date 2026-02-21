import React from 'react';

export interface MetricData {
    value: string;
    progress: number; // 0 to 100
    status: 'safe' | 'warning' | 'critical';
}

export interface BrandData {
    id: string;
    name: string;
    category: string;
    score: number;
    issues: number;
    carbon: MetricData;
    water: MetricData;
    sustainable: MetricData;
    penalty?: string;
}

interface BrandCardProps {
    brand: BrandData;
}

export const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
    const isHighScore = brand.score >= 60;
    const isMidScore = brand.score >= 40 && brand.score < 60;

    const scoreColor = isHighScore
        ? 'text-emerald-500'
        : isMidScore
            ? 'text-amber-500'
            : 'text-rose-600';

    const getStatusColor = (status: 'safe' | 'warning' | 'critical') => {
        switch (status) {
            case 'safe': return 'bg-emerald-500';
            case 'warning': return 'bg-amber-500';
            case 'critical': return 'bg-rose-600';
        }
    };

    return (
        <article className="relative bg-white border border-stone-100 rounded-[28px] shadow-[0_4px_24px_rgb(0,0,0,0.02)] p-6 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group isolation-auto">

            {/* Absolute Issue Badge (Overhanging) */}
            {brand.issues > 0 && (
                <div className="absolute -left-3 top-12 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md z-10">
                    <span>{brand.issues} Issue</span>
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-sans font-black text-stone-900 text-lg tracking-tight leading-none">
                        {brand.name.replace('_', ' ')}
                    </h3>
                    <p className="uppercase text-[9px] font-bold text-stone-400 tracking-[0.2em] mt-1.5">
                        {brand.category.replace('_', ' ')}
                    </p>
                </div>
                <div className={`font-black text-3xl tracking-tighter leading-none ${scoreColor}`}>
                    {brand.score.toFixed(2)}
                </div>
            </div>

            {/* Metrics */}
            <div className="flex flex-col gap-4 mt-2">

                {/* Carbon */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-1.5 text-stone-500">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            <span className="text-[11px] font-semibold">Carbon Intensity</span>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-stone-800 tracking-tight">
                            {brand.carbon.value} <span className="text-stone-400 font-medium">MT/$M</span>
                        </span>
                    </div>
                    <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${getStatusColor(brand.carbon.status)}`}
                            style={{ width: `${Math.min(brand.carbon.progress, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Water */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-1.5 text-stone-500">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                            </svg>
                            <span className="text-[11px] font-semibold">Water Intensity</span>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-stone-800 tracking-tight">
                            {brand.water.value} <span className="text-stone-400 font-medium">L/$M</span>
                        </span>
                    </div>
                    <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${getStatusColor(brand.water.status)}`}
                            style={{ width: `${Math.min(brand.water.progress, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Sustainable Materials */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-1.5 text-stone-500">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M12 2v20" />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            <span className="text-[11px] font-semibold">Sustainable Materials</span>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-stone-800 tracking-tight">
                            {brand.sustainable.value} <span className="text-stone-400 font-medium">%</span>
                        </span>
                    </div>
                    <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${getStatusColor(brand.sustainable.status)}`}
                            style={{ width: `${Math.min(brand.sustainable.progress, 100)}%` }}
                        />
                    </div>
                </div>

            </div>

            {brand.penalty && (
                <div className="mt-6 flex items-center">
                    <span className="text-[9px] font-bold text-rose-500 tracking-wider uppercase border text-rose-600 bg-rose-50 border-rose-100 px-2 py-0.5 rounded shadow-sm">
                        {brand.penalty}
                    </span>
                </div>
            )}

        </article>
    );
};
