import { cn } from "@/lib/utils";

interface ThresholdGaugeProps {
    score: number; // 0-100
    tier: 'Regenerative' | 'Sustainable' | 'Transitional' | 'Unsustainable';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export function ThresholdGauge({ score, tier, size = 'md', showLabel = true }: ThresholdGaugeProps) {
    // 1. Determine Color by Tier
    const colors = {
        Regenerative: "text-emerald-500",
        Sustainable: "text-blue-500",
        Transitional: "text-yellow-500",
        Unsustainable: "text-red-500"
    };

    const bgColors = {
        Regenerative: "text-emerald-100",
        Sustainable: "text-blue-100",
        Transitional: "text-yellow-100",
        Unsustainable: "text-red-100"
    };

    // 2. Size Config
    const sizes = {
        sm: { w: 48, h: 48, stroke: 4, text: "text-[10px]" },
        md: { w: 80, h: 80, stroke: 6, text: "text-xl" },
        lg: { w: 120, h: 120, stroke: 8, text: "text-3xl" }
    };
    const s = sizes[size];

    // 3. SVG Calculation
    const radius = (s.w - s.stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative inline-flex flex-col items-center justify-center">
            {/* SVG GAUGE */}
            <div className="relative flex items-center justify-center">
                <svg width={s.w} height={s.h} className="transform -rotate-90">
                    {/* Track */}
                    <circle
                        cx={s.w / 2}
                        cy={s.h / 2}
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth={s.stroke}
                        className={cn("transition-colors duration-300", bgColors[tier])}
                    />
                    {/* Progress */}
                    <circle
                        cx={s.w / 2}
                        cy={s.h / 2}
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth={s.stroke}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className={cn("transition-all duration-1000 ease-out", colors[tier])}
                        style={{ '--score-offset': offset } as React.CSSProperties} // Fallback for animation
                    />
                </svg>

                {/* Center Value */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn("font-black font-mono tracking-tighter leading-none text-slate-900", s.text)}>
                        {score}
                    </span>
                </div>
            </div>

            {/* Label */}
            {showLabel && size !== 'sm' && (
                <div className={cn("mt-2 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border bg-white",
                    tier === 'Regenerative' ? "text-emerald-700 border-emerald-200" :
                        tier === 'Sustainable' ? "text-blue-700 border-blue-200" :
                            tier === 'Transitional' ? "text-yellow-700 border-yellow-200" :
                                "text-red-700 border-red-200"
                )}>
                    {tier}
                </div>
            )}
        </div>
    );
}
