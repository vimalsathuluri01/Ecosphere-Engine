export interface ScoringInput {
    // Environmental (Critical -> Cost Type)
    carbon_footprint_mt: number;
    water_usage_liters: number;
    waste_production_kg: number;

    // Environmental (Transition -> Benefit Type)
    sustainable_material_percent: number;

    // Governance (Benefit Type)
    transparency_score: number;

    // Market (Benefit Type - Optional Context)
    market_share_percent: number;
    consumer_engagement_score: number;
    average_lifespan_years: number;
}

export interface ScoringResult {
    finalScore: number; // 0-100
    environmentScore: number;
    governanceScore: number;
    penaltyApplied: boolean;
    penaltyFactor: number; // 0-1 (0 = max penalty, 1 = no penalty)
    criticalViolations: string[];
    details: {
        normalization: Record<string, number>;
        weights: Record<string, number>;
        penalties: Record<string, number>;
    };
    tier: 'Regenerative' | 'Sustainable' | 'Transitional' | 'Unsustainable';
}

import { THRESHOLDS, AHP_WEIGHTS } from './constants';

// --- LOGISTIC FUNCTION ---
function calculateEcologicalHealth(val: number, limit: number, k: number): number {
    return 1 / (1 + Math.exp(k * (val - limit)));
}

export class ScoringEngine {
    private bounds: Record<keyof ScoringInput, { min: number; max: number }>;
    public benchmarks: Record<keyof ScoringInput, number>;

    constructor(metricsOrData: ScoringInput[] | { bounds: any; benchmarks: any }) {
        if (Array.isArray(metricsOrData)) {
            const metrics = this.calculateMetrics(metricsOrData);
            this.bounds = metrics.bounds;
            this.benchmarks = metrics.benchmarks;
        } else {
            this.bounds = metricsOrData.bounds;
            this.benchmarks = metricsOrData.benchmarks;
        }
    }

    private calculateMetrics(data: ScoringInput[]) {
        if (data.length === 0) return { bounds: {} as any, benchmarks: {} as any };

        const keys = Object.keys(data[0]) as (keyof ScoringInput)[];
        const initialBounds = {} as any;
        const sums = {} as any;

        keys.forEach(k => {
            initialBounds[k] = { min: Infinity, max: -Infinity };
            sums[k] = 0;
        });

        for (let i = 0; i < data.length; i++) {
            const d = data[i];
            for (let j = 0; j < keys.length; j++) {
                const k = keys[j];
                const val = d[k];
                if (val < initialBounds[k].min) initialBounds[k].min = val;
                if (val > initialBounds[k].max) initialBounds[k].max = val;
                sums[k] += val;
            }
        }

        const benchmarks = {} as any;
        keys.forEach(k => {
            benchmarks[k] = sums[k] / data.length;
        });

        return { bounds: initialBounds, benchmarks };
    }

    private normalize(val: number, key: keyof ScoringInput, type: 'COST' | 'BENEFIT'): number {
        const { min, max } = this.bounds[key];
        if (max === min) return 1;

        let r = 0;
        if (type === 'COST') {
            r = (max - val) / (max - min);
        } else {
            r = (val - min) / (max - min);
        }
        return Math.max(0, Math.min(1, r));
    }

    public calculateScore(brand: ScoringInput): ScoringResult {
        // 1. Normalization
        const norm = {
            carbon: this.normalize(brand.carbon_footprint_mt, 'carbon_footprint_mt', 'COST'),
            water: this.normalize(brand.water_usage_liters, 'water_usage_liters', 'COST'),
            waste: this.normalize(brand.waste_production_kg, 'waste_production_kg', 'COST'),
            materials: this.normalize(brand.sustainable_material_percent, 'sustainable_material_percent', 'BENEFIT'),
            transparency: this.normalize(brand.transparency_score, 'transparency_score', 'BENEFIT'),
            market: this.normalize(brand.market_share_percent, 'market_share_percent', 'BENEFIT'),
            engagement: this.normalize(brand.consumer_engagement_score, 'consumer_engagement_score', 'BENEFIT'),
            durability: this.normalize(brand.average_lifespan_years, 'average_lifespan_years', 'BENEFIT'),
        };

        // 2. Hybrid Weights
        const W = AHP_WEIGHTS;

        // 3. Ecological Penalties
        const pCarbon = calculateEcologicalHealth(brand.carbon_footprint_mt, THRESHOLDS.CARBON.limit, THRESHOLDS.CARBON.k);
        const pWater = calculateEcologicalHealth(brand.water_usage_liters, THRESHOLDS.WATER.limit, THRESHOLDS.WATER.k);
        const pWaste = calculateEcologicalHealth(brand.waste_production_kg, THRESHOLDS.WASTE.limit, THRESHOLDS.WASTE.k);
        const pDurability = 1 / (1 + Math.exp(-2.5 * (brand.average_lifespan_years - 1.2))); // Shifted threshold to 1.2

        const penaltyFactor = Math.min(pCarbon, pWater, pWaste, pDurability);

        const criticalViolations: string[] = [];
        if (pCarbon < 0.5) criticalViolations.push('Carbon Threshold Exceeded');
        if (pWater < 0.5) criticalViolations.push('Water Stress Critical');
        if (pWaste < 0.5) criticalViolations.push('Waste Output Critical');
        if (pDurability < 0.3) criticalViolations.push('High Turnover Production Cycle');

        // 4. Component Scores
        const rawEnvScore = (
            (norm.carbon * 0.28) +
            (norm.water * 0.24) +
            (norm.waste * 0.14) +
            (norm.materials * 0.10) +
            (norm.durability * 0.16)
        );

        const envScore = rawEnvScore * 100 * penaltyFactor;

        // Governance
        const govScore = (
            (norm.transparency * W.transparency_score) +
            (norm.market * W.market_share_percent) +
            (norm.engagement * W.consumer_engagement_score)
        ) / (W.transparency_score + W.market_share_percent + W.consumer_engagement_score) * 100;

        // 5. Final Professional Index (Weighted Balance)
        // Shift from geometric mean to weighted average to prevent extreme volatility while maintaining sensitivity
        const finalScore = (envScore * 0.75) + (govScore * 0.25);

        // 6. Tier Determination
        let tier: 'Regenerative' | 'Sustainable' | 'Transitional' | 'Unsustainable' = 'Unsustainable';
        if (finalScore >= 80 && !criticalViolations.length) tier = 'Regenerative';
        else if (finalScore >= 60 && !criticalViolations.length) tier = 'Sustainable';
        else if (finalScore >= 40) tier = 'Transitional';

        return {
            finalScore: Math.round(finalScore),
            environmentScore: Math.round(envScore),
            governanceScore: Math.round(govScore),
            penaltyApplied: penaltyFactor < 0.9,
            penaltyFactor,
            criticalViolations,
            details: {
                normalization: norm,
                weights: W,
                penalties: { carbon: pCarbon, water: pWater, waste: pWaste }
            },
            tier
        };
    }
}
