import { z } from "zod";
import { ScoringInput } from "./scoring-engine";

// ============================================
// SCHEMAS (From Architecture Plan)
// ============================================

export const EcologicalThresholdSchema = z.object({
    indicatorId: z.string(),
    x0: z.number().describe("Midpoint of logistic curve (The Boundary)"),
    k: z.number().describe("Steepness coefficient of collapse"),
    L: z.number().describe("Maximum penalty capacity"),
});

export const GlobalBoundsSchema = z.record(
    z.string(), // indicatorId
    z.object({ globalMin: z.number(), globalMax: z.number() })
);

export const BrandCompareNodeSchema = z.object({
    brandId: z.string(),
    name: z.string(),
    metrics: z.array(z.object({
        indicatorId: z.string(),
        rawValue: z.number(),
        globalNormalizedValue: z.number().min(0).max(1),
        entropyWeight: z.number(),
        ahpWeight: z.number(),
        hybridWeight: z.number(),
        thresholdBreach: z.boolean(),
        appliedPenalty: z.number(),
    })),
    scoring: z.object({
        environmentalBase: z.number(),
        environmentalPostPenalty: z.number(),
        governance: z.number(),
        finalNonCompensatory: z.number(),
    }),
    tier: z.enum(["A", "B", "C", "D", "E", "F"]),
    marketShare: z.number().optional(),
});

export const ComparisonPayloadSchema = z.object({
    nodes: z.array(BrandCompareNodeSchema),
    context: z.object({
        totalDatasetSize: z.number(),
        bounds: GlobalBoundsSchema,
        thresholds: z.array(EcologicalThresholdSchema)
    })
});

// ============================================
// MATHEMATICAL CONSTANTS & THRESHOLDS
// ============================================

// AHP (Analytic Hierarchy Process) Subjective Weights
export const AHP_WEIGHTS: Record<string, number> = {
    carbon_footprint_mt: 0.35,
    water_usage_liters: 0.20,
    waste_production_kg: 0.15,
    sustainable_material_percent: 0.10,
    transparency_score: 0.15,
    market_share_percent: 0.025,
    consumer_engagement_score: 0.025
};

// Polarity for calculating entropy (is higher better?)
export const INDICATOR_POLARITY: Record<string, 'COST' | 'BENEFIT'> = {
    carbon_footprint_mt: 'COST',
    water_usage_liters: 'COST',
    waste_production_kg: 'COST',
    sustainable_material_percent: 'BENEFIT',
    transparency_score: 'BENEFIT',
    market_share_percent: 'BENEFIT',
    consumer_engagement_score: 'BENEFIT'
};

export const THRESHOLDS = {
    carbon_footprint_mt: { x0: 1500, k: 0.05, L: 1.0 }, // MT
    water_usage_liters: { x0: 250000, k: 0.00005, L: 1.0 }, // Liters
    waste_production_kg: { x0: 800, k: 0.02, L: 1.0 } // KG
};

// ============================================
// CORE COMPARISON MATH ENGINE
// ============================================

/**
 * Calculates a Logistic Penalty for environmental threshold overshoot (Sigmoid).
 * Returns a value between 0 (complete collapse) and 1 (safe zone).
 */
export function calculateLogisticHealth(val: number, threshold: { x0: number, k: number, L: number }): number {
    // 1 / (1 + e^(k*(x - x0)))
    const health = threshold.L / (1 + Math.exp(threshold.k * (val - threshold.x0)));
    return health;
}

/**
 * Computes Objective Entropy Weights across the ENTIRE dataset to measure information variance.
 */
export function computeEntropyWeights(datasetCount: number, normalizedMatrix: Record<string, number[]>): Record<string, number> {
    const weights: Record<string, number> = {};
    const keys = Object.keys(normalizedMatrix);
    const k_h = 1 / Math.log(datasetCount);
    let totalDivergence = 0;
    const divergences: Record<string, number> = {};

    for (const key of keys) {
        const column = normalizedMatrix[key];
        const sumCol = column.reduce((a, b) => a + b, 0);

        // Edge case: column is all 0s
        if (sumCol === 0) {
            divergences[key] = 0;
            continue;
        }

        let entropyE = 0;
        for (const val of column) {
            const p_ij = val / sumCol;
            if (p_ij > 0) {
                entropyE += p_ij * Math.log(p_ij);
            }
        }

        entropyE = -k_h * entropyE;
        const d_j = 1 - entropyE; // Divergence
        divergences[key] = d_j;
        totalDivergence += d_j;
    }

    for (const key of keys) {
        weights[key] = totalDivergence === 0 ? (1 / keys.length) : (divergences[key] / totalDivergence);
    }

    return weights;
}

/**
 * Calculates Multi-Brand Comparison Matrix ensuring Global Normalization.
 */
export class BrandComparisonEngine {
    private allInputs: (ScoringInput & { id: string, name: string })[];
    private globalBounds: Record<string, { min: number, max: number }> = {};
    private hybridWeights: Record<string, number> = {};
    private alpha = 0.58; // Cooperative game theory mixing (0.58 Subjective AHP / 0.42 Objective Entropy)

    constructor(fullDataset: (ScoringInput & { id: string, name: string })[]) {
        this.allInputs = fullDataset;
        this.initializeGlobalMetrics();
    }

    private initializeGlobalMetrics() {
        const keys = Object.keys(AHP_WEIGHTS);

        // 1. Calculate Absolute Bounds
        keys.forEach(k => {
            const values = this.allInputs.map(d => (d as any)[k] as number);
            this.globalBounds[k] = { min: Math.min(...values), max: Math.max(...values) };
        });

        // 2. Build Normalized Matrix for the entire dataset
        const normalizedMatrix: Record<string, number[]> = {};
        keys.forEach(k => normalizedMatrix[k] = []);

        this.allInputs.forEach(brand => {
            keys.forEach(k => {
                normalizedMatrix[k].push(this.normalize((brand as any)[k], k));
            });
        });

        // 3. Compute Entropy & Hybrid Weights
        const entropyWeights = computeEntropyWeights(this.allInputs.length, normalizedMatrix);

        let sumHybrid = 0;
        keys.forEach(k => {
            const objW = entropyWeights[k] || 0;
            const subW = AHP_WEIGHTS[k] || 0;
            const hw = (this.alpha * subW) + ((1 - this.alpha) * objW);
            this.hybridWeights[k] = hw;
            sumHybrid += hw;
        });

        // Normalize Hybrid Weights to sum to 1
        keys.forEach(k => {
            this.hybridWeights[k] = this.hybridWeights[k] / sumHybrid;
        });
    }

    public normalize(val: number, key: string): number {
        const bounds = this.globalBounds[key];
        if (!bounds || bounds.max === bounds.min) return 1;

        const polarity = INDICATOR_POLARITY[key];
        let r = 0;
        if (polarity === 'COST') {
            r = (bounds.max - val) / (bounds.max - bounds.min); // Lower is better
        } else {
            r = (val - bounds.min) / (bounds.max - bounds.min); // Higher is better
        }
        // Small shift to prevent 0 division in entropy logs
        return Math.max(0.0001, Math.min(1, r));
    }

    public generateComparison(selectedBrandIds: string[]): z.infer<typeof ComparisonPayloadSchema> {
        const selectedMolecules = this.allInputs.filter(b => selectedBrandIds.includes(b.id));

        const nodes: z.infer<typeof BrandCompareNodeSchema>[] = selectedMolecules.map(brand => {

            const pCarbon = calculateLogisticHealth(brand.carbon_footprint_mt, THRESHOLDS.carbon_footprint_mt);
            const pWater = calculateLogisticHealth(brand.water_usage_liters, THRESHOLDS.water_usage_liters);
            const pWaste = calculateLogisticHealth(brand.waste_production_kg, THRESHOLDS.waste_production_kg);

            // Minimum constraint enforces non-compensatory bounds 
            const penaltyFactor = Math.min(pCarbon, pWater, pWaste);

            const metrics = Object.keys(AHP_WEIGHTS).map(k => {
                const val = (brand as any)[k];
                const isViolation = (k === 'carbon_footprint_mt' && val > THRESHOLDS.carbon_footprint_mt.x0) ||
                    (k === 'water_usage_liters' && val > THRESHOLDS.water_usage_liters.x0) ||
                    (k === 'waste_production_kg' && val > THRESHOLDS.waste_production_kg.x0);

                let metricPenalty = 1;
                if (k === 'carbon_footprint_mt') metricPenalty = pCarbon;
                if (k === 'water_usage_liters') metricPenalty = pWater;
                if (k === 'waste_production_kg') metricPenalty = pWaste;

                return {
                    indicatorId: k,
                    rawValue: val,
                    globalNormalizedValue: this.normalize(val, k),
                    entropyWeight: 0, // Simplified out for payload size, could inject
                    ahpWeight: AHP_WEIGHTS[k],
                    hybridWeight: this.hybridWeights[k],
                    thresholdBreach: isViolation,
                    appliedPenalty: metricPenalty
                };
            });

            // Calculate Base Environment (Pre-penalty)
            const envKeys = ['carbon_footprint_mt', 'water_usage_liters', 'waste_production_kg', 'sustainable_material_percent'];
            let envScoreRaw = 0;
            let envWeightSum = 0;
            envKeys.forEach(k => {
                envScoreRaw += this.normalize((brand as any)[k], k) * this.hybridWeights[k];
                envWeightSum += this.hybridWeights[k];
            });
            const envBase = (envScoreRaw / envWeightSum) * 100;

            // Apply Penalty
            const envPostPenalty = envBase * penaltyFactor;

            // Calculate Governance
            const govKeys = ['transparency_score', 'market_share_percent', 'consumer_engagement_score'];
            let govScoreRaw = 0;
            let govWeightSum = 0;
            govKeys.forEach(k => {
                govScoreRaw += this.normalize((brand as any)[k], k) * this.hybridWeights[k];
                govWeightSum += this.hybridWeights[k];
            });
            const govBase = (govScoreRaw / govWeightSum) * 100;

            // Final Non-Compensatory
            // We use geometric mean, but dragged down unconditionally by penalty factor
            const finalScore = Math.sqrt(envBase * govBase) * penaltyFactor;

            let tier: "A" | "B" | "C" | "D" | "E" | "F" = "F";
            if (finalScore >= 80) tier = "A";
            else if (finalScore >= 65) tier = "B";
            else if (finalScore >= 50) tier = "C";
            else if (finalScore >= 35) tier = "D";
            else if (finalScore >= 20) tier = "E";

            return {
                brandId: brand.id,
                name: brand.name,
                metrics,
                scoring: {
                    environmentalBase: envBase,
                    environmentalPostPenalty: envPostPenalty,
                    governance: govBase,
                    finalNonCompensatory: finalScore
                },
                tier,
                marketShare: brand.market_share_percent
            };
        });

        return {
            nodes: nodes.sort((a, b) => b.scoring.finalNonCompensatory - a.scoring.finalNonCompensatory), // Sort by rank
            context: {
                totalDatasetSize: this.allInputs.length,
                bounds: Object.fromEntries(Object.entries(this.globalBounds).map(([k, v]) => [k, { globalMin: v.min, globalMax: v.max }])),
                thresholds: Object.entries(THRESHOLDS).map(([k, v]) => ({ indicatorId: k, ...v }))
            }
        };
    }
}
