import fs from 'fs';
import path from 'path';
import { parseCSV } from './csv-parser';
import { BrandCSV, ProductCSV, ManufacturingCSV, EnrichedBrand, EnrichedProduct } from './types';
import { ScoringEngine, ScoringInput } from './scoring-engine';
import { slugify } from './utils';

// Singleton Cache
let cachedBrands: EnrichedBrand[] | null = null;
let cachedProducts: EnrichedProduct[] | null = null;
let lastBrandsLoad: number = 0;
let lastProductsLoad: number = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

const DATA_DIR = path.join(process.cwd(), 'upload');

// --- HELPERS ---
function sanitizeNumber(val: any, fallback: number = 0): number {
    if (val === undefined || val === null || val === '') return fallback;
    if (typeof val === 'number') return isNaN(val) ? fallback : val;
    const cleaned = val.toString().replace(/,/g, '').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? fallback : num;
}

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

        if (rawBrands.length === 0) return [];

        // 1. Portfolio Context (Shifted early for Durability Aggregation)
        const products = await getProducts();
        const productMap = new Map<string, EnrichedProduct[]>();
        products.forEach(p => {
            const key = p.company.trim().toLowerCase();
            if (!productMap.has(key)) productMap.set(key, []);
            productMap.get(key)?.push(p);
        });

        // 2. Single-Pass Metrics & Input Preparation
        const keys: (keyof ScoringInput)[] = [
            'carbon_footprint_mt', 'water_usage_liters', 'waste_production_kg',
            'sustainable_material_percent', 'transparency_score', 
            'market_share_percent', 'consumer_engagement_score',
            'average_lifespan_years'
        ];

        const bounds = {} as any;
        const sums = {} as any;
        keys.forEach(k => {
            bounds[k] = { min: Infinity, max: -Infinity };
            sums[k] = 0;
        });

        const scoringInputs: ScoringInput[] = new Array(rawBrands.length);

        for (let i = 0; i < rawBrands.length; i++) {
            const b = rawBrands[i];
            const brandKey = b.Brand_Name.trim().toLowerCase();
            const brandProducts = productMap.get(brandKey) || [];
            
            // Calculate Average Lifespan for DAI
            const avgLifespan = brandProducts.length > 0 
                ? brandProducts.reduce((acc, p) => acc + (p.average_lifespan || 0), 0) / brandProducts.length 
                : 3.5;

            const input: ScoringInput = {
                carbon_footprint_mt: sanitizeNumber(b.Carbon_Footprint_MT),
                water_usage_liters: sanitizeNumber(b.Water_Usage_Liters),
                waste_production_kg: sanitizeNumber(b.Waste_Production_KG),
                sustainable_material_percent: sanitizeNumber(b.Sustainable_Material_Percent),
                transparency_score: sanitizeNumber(b.Transparency_Score_2024),
                market_share_percent: sanitizeNumber(b.Market_Share_Percent),
                consumer_engagement_score: sanitizeNumber(b.Consumer_Engagement_Score),
                average_lifespan_years: avgLifespan
            };
            scoringInputs[i] = input;

            for (let j = 0; j < keys.length; j++) {
                const k = keys[j];
                const val = input[k];
                if (val < bounds[k].min) bounds[k].min = val;
                if (val > bounds[k].max) bounds[k].max = val;
                sums[k] += val;
            }
        }

        const benchmarks = {} as any;
        keys.forEach(k => { benchmarks[k] = sums[k] / rawBrands.length; });

        // 3. Initialize Engine
        const engine = new ScoringEngine({ bounds, benchmarks });

        // 4. Enrichment Pass 1: Corporate Metrics & Portfolio Analysis
        const processed = rawBrands.map((b, idx) => {
            const keys = b.Brand_Name.trim().toLowerCase();
            const brandProducts = productMap.get(keys) || [];
            const scoreResult = engine.calculateScore(scoringInputs[idx]);

            const tiers = { A: 0, B: 0, C: 0, D: 0, F: 0 };
            let airFreightCount = 0;
            let toxicCount = 0;
            const materials = new Set<string>();

            brandProducts.forEach(p => {
                if (p.sustainabilityTier in tiers) tiers[p.sustainabilityTier as keyof typeof tiers]++;
                if (p.transport_mode === 'air') airFreightCount++;
                if (p.hazardous_chemicals_used === 'yes') toxicCount++;
                if (p.material_type) materials.add(p.material_type);
            });

            // Extract Top/Bottom Products (Brand -> Product View)
            const sortedByScore = [...brandProducts].sort((a, b) => b.compositeScore - a.compositeScore);
            const topProducts = sortedByScore.slice(0, 3);
            const bottomProducts = sortedByScore.slice(-3).reverse();

            const riskProfile = {
                litigation: b.Transparency_Score_2024 < 30,
                fines: b.Sustainability_Rating === 'D' || b.Sustainability_Rating === 'F',
                supplyChainExposure: toxicCount > 0,
                airFreightUsage: airFreightCount > 0
            };

            let rec: 'LEADER' | 'MODERATE' | 'HIGH RISK' = 'MODERATE';
            if (scoreResult.finalScore >= 80 && !scoreResult.penaltyApplied) rec = 'LEADER';
            else if (scoreResult.finalScore < 40 || scoreResult.penaltyApplied) rec = 'HIGH RISK';

            return {
                ...b,
                id: slugify(b.Brand_Name),
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
                sustainabilityTier: (scoreResult.finalScore >= 80 ? 'A' : scoreResult.finalScore >= 60 ? 'B' : scoreResult.finalScore >= 40 ? 'C' : scoreResult.finalScore >= 20 ? 'D' : 'F') as any,
                recommendation: rec,
                riskProfile,
                portfolioAnalysis: {
                    totalProducts: brandProducts.length,
                    avgScore: scoreResult.finalScore,
                    variance: 0,
                    tierDistribution: tiers,
                    bestProduct: topProducts[0],
                    worstProduct: bottomProducts[0],
                    topProducts,
                    bottomProducts
                },
                materialUsage: Array.from(materials),
                Revenue_USD_Million: b.Revenue_USD_Million,
                Renewable_Energy_Ratio: b.Renewable_Energy_Ratio,
                Annual_Units_Million: b.Annual_Units_Million,
                Carbon_Intensity_MT_per_USD_Million: b.Carbon_Intensity_MT_per_USD_Million,
                Water_Intensity_L_per_USD_Million: b.Water_Intensity_L_per_USD_Million,
                Waste_Intensity_KG_per_USD_Million: b.Waste_Intensity_KG_per_USD_Million,
                Average_Lifespan_Years: scoringInputs[idx].average_lifespan_years || 3.5
            };
        });

        // 5. Enrichment Pass 2: Competitive Context (Product -> Brand View)
        // Group all products by name across the entire ecosystem
        const globalProductTypeMap = new Map<string, { brandName: string, brandScore: number }[]>();
        processed.forEach(brand => {
            brand.portfolioAnalysis.topProducts.forEach(p => {
                const key = p.product_name.toLowerCase().trim();
                if (!globalProductTypeMap.has(key)) globalProductTypeMap.set(key, []);
                globalProductTypeMap.get(key)!.push({ brandName: brand.Brand_Name, brandScore: brand.compositeScore });
            });
            // Also check other products not in top 3
            const allBrandProds = productMap.get(brand.Brand_Name.toLowerCase().trim()) || [];
            allBrandProds.forEach(p => {
                const key = p.product_name.toLowerCase().trim();
                if (!globalProductTypeMap.has(key)) globalProductTypeMap.set(key, []);
                // Avoid duplicates
                if (!globalProductTypeMap.get(key)!.some(item => item.brandName === brand.Brand_Name)) {
                    globalProductTypeMap.get(key)!.push({ brandName: brand.Brand_Name, brandScore: brand.compositeScore });
                }
            });
        });

        // Sort each category by brand score to establish ranking
        globalProductTypeMap.forEach((list) => {
            list.sort((a, b) => b.brandScore - a.brandScore);
        });

        // Inject competitive metadata into all products
        processed.forEach(brand => {
            const allBrandProds = productMap.get(brand.Brand_Name.toLowerCase().trim()) || [];
            allBrandProds.forEach(p => {
                const competitors = globalProductTypeMap.get(p.product_name.toLowerCase().trim()) || [];
                p.competitorCount = competitors.length - 1;
                p.brandList = competitors.map(c => c.brandName);
                p.brandRank = competitors.findIndex(c => c.brandName === brand.Brand_Name) + 1;
            });
        });

        const finalOutput = processed.sort((a, b) => b.compositeScore - a.compositeScore);
        cachedBrands = finalOutput as any;
        lastBrandsLoad = Date.now();
        return cachedBrands!;

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

            // STABLE ID: Ensure ID is deterministic for hydration (fixed falsy 0 bug)
            const stableId = (p.product_id !== undefined && p.product_id !== null && p.product_id !== '') 
                ? p.product_id.toString() 
                : `prod-${pIdx}-${p.company.substring(0,3)}`;

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
    // Ensure getBrands is called first to populate the competitive metadata (fixes race condition)
    await getBrands(); 
    const products = await getProducts();
    return products.find(p => p.product_id === id);
}
