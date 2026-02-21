'use client';

import { BrandData } from '@/lib/methodology';
import { computeIndustryAverages, computePercentiles } from '@/lib/analytics-utils';
import { GreenwashingMatrix } from '@/components/industry-analytics/GreenwashingMatrix';
import { BoundaryBreachGauge } from '@/components/industry-analytics/BoundaryBreachGauge';
import { EfficiencyRankingChart } from '@/components/industry-analytics/EfficiencyRankingChart';
import { ScoreDecomposition } from '@/components/industry-analytics/ScoreDecomposition';
import { ResourceTreemap } from '@/components/industry-analytics/ResourceTreemap';
import { OverproductionIndex } from '@/components/industry-analytics/OverproductionIndex';
import { RiskZonePlot } from '@/components/industry-analytics/RiskZonePlot';
import { CategoryPerformanceRadars } from '@/components/industry-analytics/CategoryPerformanceRadars';
import { CircularityCluster } from '@/components/industry-analytics/CircularityCluster';
import { EcologicalLiveDebt } from '@/components/industry-analytics/EcologicalLiveDebt';

export function AnalyticsV2Client({ brands }: { brands: BrandData[] }) {
    const averages = computeIndustryAverages(brands);
    const percentiles = computePercentiles(brands, [
        'Carbon_Intensity_MT_per_USD_Million',
        'Water_Intensity_L_per_USD_Million',
        'Waste_Intensity_KG_per_USD_Million'
    ], 0.75);

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white font-sans pt-36 pb-36 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto space-y-32">

                {/* 1. Header Section */}
                <header className="max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-stone-900 leading-[0.9]">
                        Systemic<br />Intelligence
                    </h1>
                    <p className="max-w-xl text-xs font-mono font-bold tracking-widest text-stone-500 uppercase mt-8 leading-relaxed">
                        Macro-ecological constraint analysis evaluating 29 global fashion entities against Planetary Boundaries and strict mathematical penalty functions.
                    </p>
                </header>

                <EcologicalLiveDebt brands={brands} />
                <GreenwashingMatrix brands={brands} averages={averages} />
                <BoundaryBreachGauge brands={brands} />
                <EfficiencyRankingChart brands={brands} averages={averages} />
                <ScoreDecomposition brands={brands} />
                <ResourceTreemap brands={brands} />
                <OverproductionIndex brands={brands} averages={averages} />
                <RiskZonePlot brands={brands} />
                <CategoryPerformanceRadars brands={brands} />
                <CircularityCluster brands={brands} />

            </div>
        </div>
    );
}
