import fs from 'fs';
import path from 'path';
import { parseCSV } from './csv';
import { BrandCSV, ProductCSV, ManufacturingCSV, EnrichedBrand, EnrichedProduct } from './types';
import { ScoringEngine, ScoringInput } from './scoring-engine';

// Singleton Cache
let cachedBrands: EnrichedBrand[] | null = null;
let cachedProducts: EnrichedProduct[] | null = null;
let lastBrandsLoad: number = 0;
let lastProductsLoad: number = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

const DATA_DIR = path.join(process.cwd(), 'upload'); // Defined by user path

// --- UTILS ---
const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/'/g, '') // Remove apostrophes (Levi's -> levis)
        .replace(/[\s\W-]+/g, '-') // Replace spaces, other non-word chars and dashes with a single dash
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
};

// --- LOADERS ---

export async function getBrands(): Promise<EnrichedBrand[]> {
    const now = Date.now();
    if (cachedBrands && (now - lastBrandsLoad < CACHE_TTL)) return cachedBrands;

    try {
        const csvPath = path.join(DATA_DIR, 'major_fashion_brands_sustainability_data_v2.csv');

        if (!fs.existsSync(csvPath)) {
            console.error("CSV File not found at:", csvPath);
            return [];
        }

        const fileContent = fs.readFileSync(csvPath, 'utf-8');
        const rawBrands = parseCSV<BrandCSV>(fileContent);

        // 1. Prepare Inputs for Scoring Engine
        const scoringInputs: ScoringInput[] = rawBrands.map(b => ({
            carbon_footprint_mt: b.Carbon_Footprint_MT,
            water_usage_liters: b.Water_Usage_Liters,
            waste_production_kg: b.Waste_Production_KG,
            sustainable_material_percent: b.Sustainable_Material_Percent,
            transparency_score: b.Transparency_Score_2024,
            market_share_percent: b.Market_Share_Percent,
            consumer_engagement_score: b.Consumer_Engagement_Score
        }));

        // 2. Initialize Engine
        const engine = new ScoringEngine(scoringInputs);

        // 3. Enrich Brands
        // Fetch Products for Portfolio Context
        const products = await getProducts();
        const productMap = new Map<string, EnrichedProduct[]>();
        products.forEach(p => {
            const key = p.company.trim().toLowerCase();
            if (!productMap.has(key)) productMap.set(key, []);
            productMap.get(key)?.push(p);
        });

        const processed = rawBrands.map((b, idx) => {
            const keys = b.Brand_Name.trim().toLowerCase();
            const brandProducts = productMap.get(keys) || [];

            // Run Strong Sustainability Scoring
            const scoreResult = engine.calculateScore(scoringInputs[idx]);

            // Portfolio Stats (Still useful for context)
            const total = brandProducts.length;
            const tiers = { A: 0, B: 0, C: 0, D: 0, F: 0 };
            let airFreightCount = 0;
            let toxicCount = 0;

            if (total > 0) {
                brandProducts.forEach(p => {
                    if (p.sustainabilityTier in tiers) tiers[p.sustainabilityTier as keyof typeof tiers]++;
                    if (p.transport_mode === 'air') airFreightCount++;
                    if (p.hazardous_chemicals_used === 'yes') toxicCount++;
                });
            }

            // Risk Profile
            const riskProfile = {
                litigation: b.Transparency_Score_2024 < 30,
                fines: b.Sustainability_Rating === 'D' || b.Sustainability_Rating === 'F',
                supplyChainExposure: toxicCount > 0,
                airFreightUsage: airFreightCount > 0
            };

            // Determine Recommendation based on Strong Score
            let rec: 'LEADER' | 'MODERATE' | 'HIGH RISK' = 'MODERATE';
            if (scoreResult.finalScore >= 80 && !scoreResult.penaltyApplied) rec = 'LEADER';
            else if (scoreResult.finalScore < 40 || scoreResult.penaltyApplied) rec = 'HIGH RISK';

            return {
                ...b,
                id: slugify(b.Brand_Name),

                // NEW STRONG METRICS
                compositeScore: scoreResult.finalScore,
                environmentScore: scoreResult.environmentScore,
                governanceScore: scoreResult.governanceScore,
                penaltyFactor: scoreResult.penaltyFactor,
                criticalViolations: scoreResult.criticalViolations,
                tierLabel: scoreResult.tier,

                benchmarks: {
                    carbon: engine.benchmarks.carbon_footprint_mt,
                    water: engine.benchmarks.water_usage_liters,
                    waste: engine.benchmarks.waste_production_kg,
                    transparency: engine.benchmarks.transparency_score
                },

                normalized: {
                    carbon: scoreResult.details.normalization.carbon,
                    water: scoreResult.details.normalization.water,
                    waste: scoreResult.details.normalization.waste,
                    transparency: scoreResult.details.normalization.transparency
                },

                transparencyScore: b.Transparency_Score_2024,
                sustainabilityTier: (scoreResult.finalScore >= 80 ? 'A' : scoreResult.finalScore >= 60 ? 'B' : scoreResult.finalScore >= 40 ? 'C' : scoreResult.finalScore >= 20 ? 'D' : 'F') as 'A' | 'B' | 'C' | 'D' | 'F',
                recommendation: rec,
                riskProfile,
                portfolioAnalysis: {
                    totalProducts: total,
                    avgScore: scoreResult.finalScore,
                    bestProduct: undefined,
                    worstProduct: undefined,
                    variance: 0,
                    tierDistribution: tiers
                },

                // RAW VOLUME & INTENSITY METRICS
                Revenue_USD_Million: b.Revenue_USD_Million,
                Renewable_Energy_Ratio: b.Renewable_Energy_Ratio,
                Annual_Units_Million: b.Annual_Units_Million,
                Carbon_Intensity_MT_per_USD_Million: b.Carbon_Intensity_MT_per_USD_Million,
                Water_Intensity_L_per_USD_Million: b.Water_Intensity_L_per_USD_Million,
                Waste_Intensity_KG_per_USD_Million: b.Waste_Intensity_KG_per_USD_Million
            };
        }).sort((a, b) => b.compositeScore - a.compositeScore);

        cachedBrands = processed;
        lastBrandsLoad = Date.now();
        return processed;

    } catch (error) {
        console.error("Brand Load Error Trace:", error);
        return [];
    }
}

export async function getProducts(): Promise<EnrichedProduct[]> {
    const now = Date.now();
    if (cachedProducts && (now - lastProductsLoad < CACHE_TTL)) return cachedProducts;

    try {
        const prodPath = path.join(DATA_DIR, 'complete_sustainability_test_data.csv');
        const mfgPath = path.join(DATA_DIR, 'manufacturing_test_data_v2.csv');

        // Check if files exist to avoid crash
        if (!fs.existsSync(prodPath) || !fs.existsSync(mfgPath)) {
            console.error("Product CSVs missing!");
            return [];
        }

        const rawProducts = parseCSV<ProductCSV>(fs.readFileSync(prodPath, 'utf-8'));
        const rawMfg = parseCSV<ManufacturingCSV>(fs.readFileSync(mfgPath, 'utf-8'));

        // Map Manufacturing for Join
        const mfgMap = new Map<string, ManufacturingCSV>();
        rawMfg.forEach(m => {
            const key = `${m.company}|${m.product_name}|${m.material_type}`.toLowerCase();
            mfgMap.set(key, m);
        });

        cachedProducts = rawProducts.map((p, pIdx) => {
            const key = `${p.company}|${p.product_name}|${p.material_type}`.toLowerCase();
            const mfg = mfgMap.get(key) || {} as Partial<ManufacturingCSV>;

            // MERGE - Ensure we don't lose the base data from p if mfg is missing
            const merged = { ...p, ...mfg };

            // STABLE ID: Ensure ID is deterministic for hydration
            const stableId = p.product_id?.toString() || `prod-${pIdx}-${p.company.substring(0,3)}`;

            // 1. Total Emissions
            const totalEmissions =
                (merged.scope1_scope2_emissions || 0) +
                (merged.shipping_emissions || 0) +
                (merged.operational_energy || 0) * 0.5;

            // 2. Impact per Lifespan
            const lifespan = merged.average_lifespan || 1;
            const trueCarbonPerWear = totalEmissions / (lifespan * 50); // Assumed 50 wears/year

            // 3. Flags
            const flags: string[] = [];
            if (merged.hazardous_chemicals_used === 'yes') flags.push('Toxic Chems');
            if (merged.transport_mode === 'air') flags.push('Air Freight');
            if ((merged.ethical_labor_score || 100) < 50) flags.push('Labor Risk');
            if (merged.plastic_percentage > 50) flags.push('High Plastic');

            // 4. Product Tier (Simple Logic for now)
            let tier: 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
            if (trueCarbonPerWear < 0.01 && flags.length === 0) tier = 'A';
            else if (trueCarbonPerWear < 0.05) tier = 'B';
            else if (flags.length > 2) tier = 'F';

            return {
                ...merged,
                product_id: stableId,
                compositeScore: Math.max(0, 100 - (flags.length * 20)), // Simple proxy
                sustainabilityTier: tier,
                trueCarbonPerWear,
                redFlags: flags
            } as EnrichedProduct;
        });

        lastProductsLoad = Date.now();
        return cachedProducts;

    } catch (error) {
        console.error("Product Load Error:", error);
        return [];
    }
}

export async function getProductById(id: string): Promise<EnrichedProduct | undefined> {
    const products = await getProducts();
    return products.find(p => p.product_id === id);
}
