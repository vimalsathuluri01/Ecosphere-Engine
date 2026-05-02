'use client';

import { BrandData, getMedians } from '@/lib/methodology';
import { Leaf, Droplets, Factory } from 'lucide-react';
import { motion } from 'framer-motion';

interface BrandCardProps {
    brand: BrandData;
    medians: ReturnType<typeof getMedians>;
    isSelected?: boolean;
}

export function BrandCard({ brand, medians, isSelected }: BrandCardProps) {
    const isHighScore = brand.finalScore! >= 60;
    const isMidScore = brand.finalScore! >= 40 && brand.finalScore! < 60;

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

    const isFailing = brand.finalPenalty! > 0.5;

    // Helper functions for real progress and status calculations
    const calcCarbonProgress = (val: number) => Math.min((val / (medians.Carbon_Intensity_MT_per_USD_Million * 2)) * 100, 100);
    const calcWaterProgress = (val: number) => Math.min((val / (medians.Water_Intensity_L_per_USD_Million * 2)) * 100, 100);
    const calcSustainableProgress = (val: number) => Math.min(val, 100);

    const getInverseStatus = (val: number, median: number): 'safe' | 'warning' | 'critical' => {
        if (val <= median * 0.8) return 'safe';
        if (val <= median * 1.5) return 'warning';
        return 'critical';
    };

    const getNormalStatus = (val: number, median: number): 'safe' | 'warning' | 'critical' => {
        if (val >= median * 1.2) return 'safe';
        if (val >= median * 0.8) return 'warning';
        return 'critical';
    };

    // Derived metric data
    const carbonStatus = getInverseStatus(brand.Carbon_Intensity_MT_per_USD_Million, medians.Carbon_Intensity_MT_per_USD_Million);
    const waterStatus = getInverseStatus(brand.Water_Intensity_L_per_USD_Million, medians.Water_Intensity_L_per_USD_Million);
    const sustainableStatus = getNormalStatus(brand.Sustainable_Material_Percent, medians.Sustainable_Material_Percent);
    const issuesCount = [carbonStatus, waterStatus, sustainableStatus].filter(s => s === 'critical').length;

    return (
        <article className={`relative bg-white border rounded-[28px] shadow-[0_4px_24px_rgb(0,0,0,0.02)] p-6 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group isolation-auto ${isSelected ? 'ring-4 ring-emerald-500/20 border-emerald-500 shadow-emerald-500/10' : 'border-stone-100'}`}>

            {/* Absolute Issue Badge (Overhanging) */}
            {issuesCount > 0 && (
                <div className="absolute -left-3 top-12 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md z-10 transition-transform hover:scale-105">
                    <span>{issuesCount} Issue{issuesCount > 1 ? 's' : ''}</span>
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-sans font-black text-stone-900 text-lg tracking-tight leading-none truncate max-w-[150px]" title={brand.Brand_Name}>
                        {brand.Brand_Name.replace(/_/g, ' ')}
                    </h3>
                    <p className="uppercase text-[9px] font-bold text-stone-400 tracking-[0.2em] mt-1.5 truncate max-w-[150px]">
                        {brand.Category.replace(/_/g, ' ')}
                    </p>
                </div>
                <div className={`font-black text-3xl tracking-tighter leading-none shrink-0 ${scoreColor}`}>
                    {brand.finalScore?.toFixed(2)}
                </div>
            </div>

            {/* Metrics */}
            <div className="flex flex-col gap-4 mt-2">

                {/* Carbon */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-1.5 text-stone-500">
                            <Factory className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold tracking-tight">Carbon Intensity</span>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-stone-800 tracking-tight shrink-0">
                            {brand.Carbon_Intensity_MT_per_USD_Million.toFixed(2)} <span className="text-stone-400 font-medium">MT/$M</span>
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: String(calcCarbonProgress(brand.Carbon_Intensity_MT_per_USD_Million)) + "%" }}
                            className={`h-full rounded-full transition-colors ${getStatusColor(carbonStatus)}`}
                        />
                    </div>
                </div>

                {/* Water */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-1.5 text-stone-500">
                            <Droplets className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold tracking-tight">Water Intensity</span>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-stone-800 tracking-tight shrink-0">
                            {brand.Water_Intensity_L_per_USD_Million.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-stone-400 font-medium">L/$M</span>
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: String(calcWaterProgress(brand.Water_Intensity_L_per_USD_Million)) + "%" }}
                            className={`h-full rounded-full transition-colors ${getStatusColor(waterStatus)}`}
                        />
                    </div>
                </div>

                {/* Sustainable Materials */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-1.5 text-stone-500">
                            <Leaf className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold tracking-tight">Sustainable Materials</span>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-stone-800 tracking-tight shrink-0">
                            {brand.Sustainable_Material_Percent} <span className="text-stone-400 font-medium">%</span>
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: String(calcSustainableProgress(brand.Sustainable_Material_Percent)) + "%" }}
                            className={`h-full rounded-full transition-colors ${getStatusColor(sustainableStatus)}`}
                        />
                    </div>
                </div>

            </div>

            {isFailing && (
                <div className="mt-6 flex items-center">
                    <span className="text-[8px] sm:text-[9px] font-bold text-rose-500 tracking-wider uppercase border border-rose-100 bg-rose-50 px-2 flex items-center h-5 rounded shadow-sm">
                        HIGH INTENSITY PENALTY
                    </span>
                </div>
            )}

        </article>
    );
}
