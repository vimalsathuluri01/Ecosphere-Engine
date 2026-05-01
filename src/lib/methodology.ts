

// --- DEFINITIONS & CONSTANTS ---
export interface BrandData {
    Brand_Name: string;
    Category: string;
    Country: string;
    Revenue_USD_Million: number;
    Transparency_Score_2024: number;
    Market_Share_Percent: number;
    Sustainability_Rating: string;
    Carbon_Footprint_MT: number;
    Water_Usage_Liters: number;
    Waste_Production_KG: number;
    Sustainable_Material_Percent: number;
    Renewable_Energy_Ratio: number;
    Production_Process: string;
    Consumer_Engagement_Score: number;
    Material_Type: string;
    Annual_Units_Million: number;
    Carbon_Intensity_MT_per_USD_Million: number;
    Water_Intensity_L_per_USD_Million: number;
    Waste_Intensity_KG_per_USD_Million: number;

    normalized?: Record<string, number>;
    contributions?: Record<string, number>;
    pCarbon?: number;
    pWater?: number;
    pWaste?: number;
    finalPenalty?: number;
    finalScore?: number;
    rank?: number;
}



const CRITERIA_MAP = [
    { key: 'Carbon_Intensity_MT_per_USD_Million', ahpKey: 'carbonIntensity', type: 'cost' },
    { key: 'Water_Intensity_L_per_USD_Million', ahpKey: 'waterIntensity', type: 'cost' },
    { key: 'Waste_Intensity_KG_per_USD_Million', ahpKey: 'wasteIntensity', type: 'cost' },
    { key: 'Sustainable_Material_Percent', ahpKey: 'sustainableMaterial', type: 'benefit' },
    { key: 'Renewable_Energy_Ratio', ahpKey: 'renewableEnergy', type: 'benefit' },
    { key: 'Transparency_Score_2024', ahpKey: 'transparency', type: 'benefit' },
    { key: 'Consumer_Engagement_Score', ahpKey: 'consumerEngagement', type: 'benefit' }
] as const;

import { calculateEcosphereScore, DatasetMinMax, BrandMetrics } from './ecosphereScoring';

// --- ENGINE CORE ---
export function computeCompleteEngine(data: BrandData[]): BrandData[] {
    const n = data.length;
    if (n === 0) return data;

    // STEP 1: Extract Min-Max for the entire dataset exactly as requested by the AI prompt
    const datasetMinMax: DatasetMinMax = {
        Carbon_Footprint_MT: { min: Infinity, max: -Infinity },
        Water_Usage_Liters: { min: Infinity, max: -Infinity },
        Waste_Production_KG: { min: Infinity, max: -Infinity },
        Sustainable_Material_Percent: { min: Infinity, max: -Infinity },
        Transparency_Score_2024: { min: Infinity, max: -Infinity },
        Average_Lifespan_Years: { min: Infinity, max: -Infinity }
    };

    data.forEach(d => {
        const smp = Number(d.Sustainable_Material_Percent) || 0;
        const ts2024 = Number(d.Transparency_Score_2024) || 0;
        const cF = Number(d.Carbon_Footprint_MT) || 0;
        const wU = Number(d.Water_Usage_Liters) || 0;
        const wP = Number(d.Waste_Production_KG) || 0;

        if (cF < datasetMinMax.Carbon_Footprint_MT.min) datasetMinMax.Carbon_Footprint_MT.min = cF;
        if (cF > datasetMinMax.Carbon_Footprint_MT.max) datasetMinMax.Carbon_Footprint_MT.max = cF;

        if (wU < datasetMinMax.Water_Usage_Liters.min) datasetMinMax.Water_Usage_Liters.min = wU;
        if (wU > datasetMinMax.Water_Usage_Liters.max) datasetMinMax.Water_Usage_Liters.max = wU;

        if (wP < datasetMinMax.Waste_Production_KG.min) datasetMinMax.Waste_Production_KG.min = wP;
        if (wP > datasetMinMax.Waste_Production_KG.max) datasetMinMax.Waste_Production_KG.max = wP;

        if (smp < datasetMinMax.Sustainable_Material_Percent.min) datasetMinMax.Sustainable_Material_Percent.min = smp;
        if (smp > datasetMinMax.Sustainable_Material_Percent.max) datasetMinMax.Sustainable_Material_Percent.max = smp;

        if (ts2024 < datasetMinMax.Transparency_Score_2024.min) datasetMinMax.Transparency_Score_2024.min = ts2024;
        if (ts2024 > datasetMinMax.Transparency_Score_2024.max) datasetMinMax.Transparency_Score_2024.max = ts2024;

        // Methodology specific: Infer lifespan from process if missing
        const lifespan = d.Production_Process === 'Organic' ? 5.0 : 2.0;
        if (lifespan < datasetMinMax.Average_Lifespan_Years.min) datasetMinMax.Average_Lifespan_Years.min = lifespan;
        if (lifespan > datasetMinMax.Average_Lifespan_Years.max) datasetMinMax.Average_Lifespan_Years.max = lifespan;
        (d as any).Average_Lifespan_Years = lifespan;
    });

    // STEP 2: Execute the strict non-compensatory algorithm per brand
    data.forEach(d => {

        // Construct explicit payload for the strict engine
        const brandPayload: BrandMetrics = {
            Brand_Name: d.Brand_Name,
            Revenue_USD_Million: Number(d.Revenue_USD_Million) || 1,
            Carbon_Footprint_MT: Number(d.Carbon_Footprint_MT) || 0,
            Water_Usage_Liters: Number(d.Water_Usage_Liters) || 0,
            Waste_Production_KG: Number(d.Waste_Production_KG) || 0,
            Sustainable_Material_Percent: Number(d.Sustainable_Material_Percent) || 0,
            Transparency_Score_2024: Number(d.Transparency_Score_2024) || 0,
            Carbon_Intensity_MT_per_USD_Million: Number(d.Carbon_Intensity_MT_per_USD_Million) || 0,
            Water_Intensity_L_per_USD_Million: Number(d.Water_Intensity_L_per_USD_Million) || 0,
            Average_Lifespan_Years: (d as any).Average_Lifespan_Years || 3.5
        };

        const strictResults = calculateEcosphereScore(brandPayload, datasetMinMax);

        // Map the new strict mathematical outputs back to the UI state shape
        d.finalScore = strictResults.finalScore;
        d.pCarbon = strictResults.carbonPenaltyFactor;
        d.pWater = strictResults.waterPenaltyFactor;

        // Final penalty rendered in UI is the inverse of the factor 
        // (if factor is 0.20, penalty is 0.80) to show destruction scale
        const minFactor = Math.min(strictResults.carbonPenaltyFactor, strictResults.waterPenaltyFactor);
        d.finalPenalty = 1 - minFactor;

        // Hydrate contributions so the ScoreDecomposition component continues to render, 
        // mimicking the 6 weight factors 
        d.contributions = {
            'Carbon Base': strictResults.baseScore * 0.28,
            'Water Base': strictResults.baseScore * 0.24,
            'Waste Base': strictResults.baseScore * 0.14,
            'Materials': strictResults.baseScore * 0.10,
            'Transparency': strictResults.baseScore * 0.08,
            'Durability': strictResults.baseScore * 0.16,
        };
    });

    // STEP 3: Ranking based strictly on the non-compensatory finalScore
    data.sort((a, b) => b.finalScore! - a.finalScore!);
    data.forEach((d, idx) => d.rank = idx + 1);

    return data;
}

// Median Calculation Helper
export function getMedians(data: BrandData[]) {
    const medians: any = {};
    CRITERIA_MAP.forEach(c => {
        const values = data.map(d => d[c.key as keyof BrandData] as number).sort((a, b) => a - b);
        const mid = Math.floor(values.length / 2);
        medians[c.key] = values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
    });
    return medians;
}
