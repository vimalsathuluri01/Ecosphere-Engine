export interface BrandMetrics {
    Brand_Name: string;
    Revenue_USD_Million: number;
    Carbon_Footprint_MT: number;
    Water_Usage_Liters: number;
    Waste_Production_KG: number;
    Sustainable_Material_Percent: number;
    Transparency_Score_2024: number;
    Carbon_Intensity_MT_per_USD_Million: number;
    Water_Intensity_L_per_USD_Million: number;
    Average_Lifespan_Years: number;
    [key: string]: any;
}

export interface DatasetMinMax {
    Carbon_Footprint_MT: { min: number, max: number };
    Water_Usage_Liters: { min: number, max: number };
    Waste_Production_KG: { min: number, max: number };
    Sustainable_Material_Percent: { min: number, max: number };
    Transparency_Score_2024: { min: number, max: number };
    Average_Lifespan_Years: { min: number, max: number };
}

export interface EcosphereScoreResult {
    rawPillars: {
        carbon: number;
        water: number;
        waste: number;
        materials: number;
        transparency: number;
        durability: number;
    };
    baseScore: number;
    carbonPenaltyFactor: number;
    waterPenaltyFactor: number;
    durabilityPenaltyFactor: number;
    finalScore: number;
}

/**
 * Calculates the Strong Sustainability Ecosphere Score based on 
 * IEEE non-compensatory planetary boundaries weighting algorithms.
 */
export function calculateEcosphereScore(brand: BrandMetrics, datasetMinMax: DatasetMinMax): EcosphereScoreResult {
    // PHASE 1: The Base Score (Weighted Sum Model)

    // Inverse Normalization: Used for destructive metrics where lower is better.
    const invNorm = (val: number, min: number, max: number) => {
        if (max === min) return 100.0;
        return Math.max(0, Math.min(100, ((max - val) / (max - min)) * 100));
    };

    // Direct Normalization: Used for positive metrics where higher is better.
    const dirNorm = (val: number, min: number, max: number) => {
        if (max === min) return 0.0;
        return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
    };

    const normCarbon = invNorm(brand.Carbon_Footprint_MT, datasetMinMax.Carbon_Footprint_MT.min, datasetMinMax.Carbon_Footprint_MT.max);
    const normWater = invNorm(brand.Water_Usage_Liters, datasetMinMax.Water_Usage_Liters.min, datasetMinMax.Water_Usage_Liters.max);
    const normWaste = invNorm(brand.Waste_Production_KG, datasetMinMax.Waste_Production_KG.min, datasetMinMax.Waste_Production_KG.max);
    const normMaterial = dirNorm(brand.Sustainable_Material_Percent, datasetMinMax.Sustainable_Material_Percent.min, datasetMinMax.Sustainable_Material_Percent.max);
    const normTransparency = dirNorm(brand.Transparency_Score_2024, datasetMinMax.Transparency_Score_2024.min, datasetMinMax.Transparency_Score_2024.max);
    const normDurability = dirNorm(brand.Average_Lifespan_Years, datasetMinMax.Average_Lifespan_Years.min, datasetMinMax.Average_Lifespan_Years.max);

    // Strict IEEE Hybrid Weights (Recalibrated for Durability)
    const wCarbon = 0.280;
    const wWater = 0.240;
    const wWaste = 0.140;
    const wMaterial = 0.100;
    const wTransparency = 0.080;
    const wDurability = 0.160;

    const baseScore = (normCarbon * wCarbon) +
        (normWater * wWater) +
        (normWaste * wWaste) +
        (normMaterial * wMaterial) +
        (normTransparency * wTransparency) +
        (normDurability * wDurability);

    // --- PHASE 2: PLANETARY BOUNDARY ENFORCEMENT (RECALIBRATED) ---

    /**
     * Executes a non-compensatory phase-transition collapse.
     * If a brand exceeds the T_hard limit, their score exponentially drops to 0.
     */
    const calculateLogisticPenalty = (intensity: number, tSoft: number, tHard: number, gamma: number = 10): number => {
        try {
            // Defensive Math: Guard against division by zero
            if (tHard === tSoft) return intensity > tHard ? 0.0 : 1.0;

            const exponent = gamma * (intensity - tSoft) / (tHard - tSoft);

            // Defensive Math: Prevent Infinity overflow for massive polluters
            if (exponent > 50) return 0.0;

            // Defensive Math: Perfect score if well below the soft threshold
            if (exponent < -50) return 1.0;

            const penalty = 1.0 / (1.0 + Math.exp(exponent));
            return Math.min(1.0, penalty);
        } catch (error) {
            console.error("Logistic Penalty Error:", error);
            return 0.0;
        }
    }

    // 1. CARBON BOUNDARY RECALIBRATION
    // Dataset Stats -> Min: 80 MT, Avg: 218 MT, Max: 514 MT
    // T_soft (150 MT): Top ~30% of industry survives untouched (e.g., Gucci, Nike).
    // T_hard (350 MT): The bottom ~15% of worst polluters collapse to 0.
    const carbonPenaltyFactor = calculateLogisticPenalty(
        brand.Carbon_Intensity_MT_per_USD_Million,
        150,
        350
    );

    // 2. WATER BOUNDARY RECALIBRATION
    // Dataset Stats -> Min: 384k L, Avg: 1.2M L, Max: 2.7M L
    // T_soft (800,000 L): Top ~25% face no penalty.
    // T_hard (2,000,000 L): Total collapse for hyper-consumers (e.g., Supreme, Delta Galil).
    const waterPenaltyFactor = calculateLogisticPenalty(
        brand.Water_Intensity_L_per_USD_Million,
        800000,
        2000000
    );

    // 3. DURABILITY BOUNDARY (NEW)
    // T_soft (2 Years): Baseline for transitional products.
    // T_hard (0.5 Years): Ultra-disposable "fast fashion" items collapse.
    const durabilityPenaltyFactor = calculateLogisticPenalty(
        brand.Average_Lifespan_Years,
        2.0,
        0.5,
        10 
    );

    // 4. APPLY THE STRICTEST PENALTY
    const finalPenaltyMultiplier = Math.min(carbonPenaltyFactor, waterPenaltyFactor, durabilityPenaltyFactor);
    let finalScore = baseScore * finalPenaltyMultiplier;

    return {
        rawPillars: {
            carbon: normCarbon * wCarbon,
            water: normWater * wWater,
            waste: normWaste * wWaste,
            materials: normMaterial * wMaterial,
            transparency: normTransparency * wTransparency,
            durability: normDurability * wDurability
        },
        baseScore: Math.round(baseScore * 100) / 100,
        carbonPenaltyFactor: Math.round(carbonPenaltyFactor * 10000) / 10000,
        waterPenaltyFactor: Math.round(waterPenaltyFactor * 10000) / 10000,
        durabilityPenaltyFactor: Math.round(durabilityPenaltyFactor * 10000) / 10000,
        finalScore: Math.round(finalScore * 100) / 100
    };
}
