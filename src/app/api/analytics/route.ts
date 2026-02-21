import { NextResponse } from 'next/server';
import { getBrands } from '@/lib/data';
import { BrandComparisonEngine, THRESHOLDS } from '@/lib/comparison-engine';
import { ScoringInput } from '@/lib/scoring-engine';

// Helper function to calculate quartiles
function getQuartiles(arr: number[]) {
    const sorted = [...arr].sort((a, b) => a - b);
    const pos1 = (sorted.length - 1) * 0.25;
    const pos2 = (sorted.length - 1) * 0.50;
    const pos3 = (sorted.length - 1) * 0.75;

    const calcQuartile = (pos: number) => {
        const base = Math.floor(pos);
        const rest = pos - base;
        if (sorted[base + 1] !== undefined) {
            return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
        } else {
            return sorted[base];
        }
    };

    return {
        q25: calcQuartile(pos1),
        median: calcQuartile(pos2),
        q75: calcQuartile(pos3),
        min: sorted[0] || 0,
        max: sorted[sorted.length - 1] || 0
    };
}

export async function GET() {
    try {
        const allBrands = await getBrands();

        // Map enriched brands back to Inputs
        const dataset: (ScoringInput & { id: string, name: string })[] = allBrands.map(b => ({
            id: b.id.toLowerCase(),
            name: b.Brand_Name,
            carbon_footprint_mt: b.Carbon_Footprint_MT,
            water_usage_liters: b.Water_Usage_Liters,
            waste_production_kg: b.Waste_Production_KG,
            sustainable_material_percent: b.Sustainable_Material_Percent,
            transparency_score: b.Transparency_Score_2024,
            market_share_percent: b.Market_Share_Percent,
            consumer_engagement_score: b.Consumer_Engagement_Score
        }));

        // 1. Run global engine on ALL nodes
        const engine = new BrandComparisonEngine(dataset);
        const allIds = dataset.map(d => d.id);
        const compareResult = engine.generateComparison(allIds);
        const nodes = compareResult.nodes;

        // 2. Compute Industry Summary
        const finalScores = nodes.map(n => n.scoring.finalNonCompensatory);
        const envBaseScores = nodes.map(n => n.scoring.environmentalBase);
        const envPostScores = nodes.map(n => n.scoring.environmentalPostPenalty);

        const mean = arr => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
        const stdDev = arr => {
            const m = mean(arr);
            return Math.sqrt(arr.reduce((sq, n) => sq + Math.pow(n - m, 2), 0) / (arr.length - 1 || 1));
        };

        const tierCounts = { A: 0, B: 0, C: 0, F: 0 };
        nodes.forEach(n => tierCounts[n.tier as keyof typeof tierCounts]++);

        const industrySummary = {
            meanFinalScore: mean(finalScores),
            medianFinalScore: getQuartiles(finalScores).median,
            stdDevFinalScore: stdDev(finalScores),
            tierDistribution: {
                regenerative: (tierCounts.A / nodes.length) * 100,
                sustainable: (tierCounts.B / nodes.length) * 100,
                transitional: (tierCounts.C / nodes.length) * 100,
                unsustainable: (tierCounts.F / nodes.length) * 100,
            }
        };

        // 3. Ecological Threshold Exposure Analysis
        const thresholdExposure: Record<string, any> = {};
        Object.keys(THRESHOLDS).forEach(key => {
            const rawVals = nodes.map(n => n.metrics.find(m => m.indicatorId === key)?.rawValue || 0);
            const breaches = nodes.filter(n => n.metrics.find(m => m.indicatorId === key)?.thresholdBreach).length;

            thresholdExposure[key] = {
                industryMean: mean(rawVals),
                thresholdLimit: THRESHOLDS[key as keyof typeof THRESHOLDS].x0,
                percentExceeding: (breaches / nodes.length) * 100
            };
        });

        // 4. Indicator Distribution Analytics
        const indicatorDistributions: Record<string, any> = {};
        Object.keys(dataset[0]).filter(k => k !== 'id' && k !== 'name').forEach(key => {
            const vals = dataset.map(d => Number(d[key as keyof typeof dataset[0]]));
            const stats = getQuartiles(vals);
            indicatorDistributions[key] = {
                mean: mean(vals),
                ...stats
            };
        });

        // 5. Env vs Gov Structure Map
        const envGovQuadrants = nodes.map(n => ({
            id: n.brandId,
            name: n.name,
            envScore: n.scoring.environmentalPostPenalty,
            govScore: n.scoring.governance,
            tier: n.tier
        }));

        // 6. Greenwashing Quadrant (Gov+Transp vs Eco Intensity)
        const greenwashingQuadrant = nodes.map(n => {
            const linearScore = (n.scoring.environmentalBase + n.scoring.governance) / 2; // WAM approx
            const strongScore = n.scoring.finalNonCompensatory;
            return {
                id: n.brandId,
                name: n.name,
                ecoIntensity: n.scoring.environmentalBase,
                govTransparency: n.scoring.governance,
                maskingFactor: Math.max(0, linearScore - strongScore), // Explicit masking delta
                tier: n.tier,
                marketShare: n.marketShare || 1
            };
        });

        // 7. Safe Operating Space Radar
        // Normalized mean as a percentage of the THRESHOLD. 100% = boundary.
        const safeOperatingRadar = [
            {
                metric: 'Carbon',
                industryAverage: (thresholdExposure['carbon_footprint_mt'].industryMean / THRESHOLDS['carbon_footprint_mt'].x0) * 100,
                limit: 100
            },
            {
                metric: 'Water',
                industryAverage: (thresholdExposure['water_usage_liters'].industryMean / THRESHOLDS['water_usage_liters'].x0) * 100,
                limit: 100
            },
            {
                metric: 'Waste',
                industryAverage: (thresholdExposure['waste_production_kg'].industryMean / THRESHOLDS['waste_production_kg'].x0) * 100,
                limit: 100
            }
        ];

        // 8. Compensation Illusion
        const compensationIllusion = nodes.map(n => {
            const linearScore = (n.scoring.environmentalBase + n.scoring.governance) / 2;
            return {
                id: n.brandId,
                name: n.name,
                linearScore: linearScore,
                strongScore: n.scoring.finalNonCompensatory,
                illusionDelta: linearScore - n.scoring.finalNonCompensatory
            };
        });

        // 9. Penalty Impact Sub-Analysis (Waterfall compatible)
        const penaltyImpact = {
            avgPrePenaltyEnv: mean(envBaseScores),
            avgPostPenaltyEnv: mean(envPostScores),
            avgReductionMagnitude: mean(envBaseScores) - mean(envPostScores)
        };

        // 10. Industry Circularity Flow (Flow Economics)
        const flowEconomics = {
            virginMaterials: mean(dataset.map(d => 100 - Number(d.sustainable_material_percent))),
            recycledMaterials: mean(dataset.map(d => Number(d.sustainable_material_percent))),
            wasteToLandfill: mean(dataset.map(d => Number(d.waste_production_kg) > 1000 ? 75 : 40)), // Proxy formulation
            recyclableLoop: mean(dataset.map(d => Number(d.waste_production_kg) > 1000 ? 25 : 60))
        };

        // 11. Rankings
        const rankings = {
            top5Final: [...nodes].sort((a, b) => b.scoring.finalNonCompensatory - a.scoring.finalNonCompensatory).slice(0, 5),
            bottom5Final: [...nodes].sort((a, b) => a.scoring.finalNonCompensatory - b.scoring.finalNonCompensatory).slice(0, 5)
        };

        // 12. Market Share Exposure Map
        const riskConcentration = nodes.map(n => {
            const c = n.metrics.find(m => m.indicatorId === 'carbon_footprint_mt');
            return {
                id: n.brandId,
                name: n.name,
                carbon: c?.rawValue || 0,
                score: n.scoring.finalNonCompensatory,
                marketShare: n.marketShare || 1,
                breach: c?.thresholdBreach || false
            }
        });

        return NextResponse.json({
            industrySummary,
            thresholdExposure,
            indicatorDistributions,
            envGovQuadrants,
            greenwashingQuadrant,
            safeOperatingRadar,
            compensationIllusion,
            flowEconomics,
            penaltyImpact,
            riskConcentration,
            rankings
        });

    } catch (error) {
        console.error("Analytics API Error:", error);
        return NextResponse.json({ error: 'Failed to compute systemic analytics' }, { status: 500 });
    }
}
