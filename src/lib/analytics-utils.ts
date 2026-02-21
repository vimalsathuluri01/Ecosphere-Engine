import { BrandData } from './methodology';

export function computeIndustryAverages(brands: BrandData[]) {
    if (!brands || brands.length === 0) return null;

    const sum = (key: keyof BrandData) => brands.reduce((acc, b) => acc + (Number(b[key]) || 0), 0);
    const count = brands.length;

    return {
        Carbon_Intensity_MT_per_USD_Million: sum('Carbon_Intensity_MT_per_USD_Million') / count,
        Water_Intensity_L_per_USD_Million: sum('Water_Intensity_L_per_USD_Million') / count,
        Waste_Intensity_KG_per_USD_Million: sum('Waste_Intensity_KG_per_USD_Million') / count,
        Transparency_Score_2024: sum('Transparency_Score_2024') / count,
        Sustainable_Material_Percent: sum('Sustainable_Material_Percent') / count,
        Renewable_Energy_Ratio: sum('Renewable_Energy_Ratio') / count,
        Consumer_Engagement_Score: sum('Consumer_Engagement_Score') / count,
        Final_Score: sum('finalScore') / count,
        Revenue_USD_Million: sum('Revenue_USD_Million') / count
    };
}

export function computePercentiles(brands: BrandData[], metricKeys: (keyof BrandData)[], percentile: number = 0.75) {
    const limits: Record<string, number> = {};

    metricKeys.forEach(key => {
        const sorted = brands.map(b => Number(b[key])).sort((a, b) => a - b);
        const index = Math.floor(sorted.length * percentile);
        limits[key as string] = sorted[index];
    });

    return limits;
}

export function decomposeScore(brand: BrandData) {
    if (!brand.contributions) return [];

    return Object.entries(brand.contributions).map(([key, value]) => ({
        name: key.replace(/_/g, ' '),
        value: Number(value.toFixed(2))
    })).sort((a, b) => b.value - a.value);
}
