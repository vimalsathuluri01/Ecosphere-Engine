import React from 'react';

interface PenaltyCardProps {
    title: string;
    hasIssue?: boolean;
    value: string;
    unit: string;
    limit: number | string;
    progressPercent: number;
    totalVol: string;
    drag: string;
    icon?: React.ReactNode;
}

export const PenaltyCard: React.FC<PenaltyCardProps> = ({
    title,
    hasIssue,
    value,
    unit,
    limit,
    progressPercent,
    totalVol,
    drag,
    icon
}) => {
    return (
        <article className={`relative bg-white border rounded-[28px] p-6 shadow-sm overflow-hidden ${hasIssue ? 'border-rose-200' : 'border-stone-200'}`}>

            {/* Background glow if issue exists */}
            {hasIssue && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 to-rose-500" />
            )}

            {/* Badges Row */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                    {hasIssue && (
                        <div className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span>1 Issue</span>
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    )}
                    {!hasIssue && icon && (
                        <div className="text-stone-400 bg-stone-50 p-1.5 rounded-md">
                            {icon}
                        </div>
                    )}
                </div>

                {hasIssue && (
                    <span className="text-[9px] font-bold text-rose-500 tracking-wider uppercase bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                        PENALTY TRIGGER
                    </span>
                )}
            </div>

            {/* Title */}
            <h4 className="text-[10px] font-bold text-stone-500 tracking-[0.2em] uppercase mb-4">
                {title}
            </h4>

            {/* Main Value */}
            <div className="mb-6">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                    RAW INTENSITY
                </div>
                <div className="flex items-baseline gap-1.5">
                    <span className="font-sans font-black text-4xl text-stone-900 tracking-tighter">
                        {value}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-stone-400 uppercase">
                        {unit}
                    </span>
                </div>
            </div>

            {/* Progress Bar / Limit */}
            <div className="mb-8">
                <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden relative">
                    <div
                        className={`absolute top-0 left-0 bottom-0 rounded-full ${hasIssue ? 'bg-rose-500' : 'bg-stone-800'}`}
                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                </div>
                <div className="flex justify-end mt-2">
                    <span className="font-mono text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                        Limit: {limit}
                    </span>
                </div>
            </div>

            {/* Footer Metrics */}
            <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-4">
                <div>
                    <div className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                        TOTAL VOL
                    </div>
                    <div className="font-mono text-xs font-bold text-stone-800">
                        {totalVol}
                    </div>
                </div>
                <div>
                    <div className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                        DRAG
                    </div>
                    <div className={`font-mono text-xs font-bold ${hasIssue ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {drag}
                    </div>
                </div>
            </div>
        </article>
    );
};
