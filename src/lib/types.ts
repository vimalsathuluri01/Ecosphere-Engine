export interface BrandCSV {
    Brand_Name: string;
    Category: string;
    Transparency_Score_2024: number;
    Market_Share_Percent: number;
    Sustainability_Rating: string;
    Carbon_Footprint_MT: number;
    Water_Usage_Liters: number;
    Waste_Production_KG: number;
    Sustainable_Material_Percent: number;
    Production_Process: string;
    Consumer_Engagement_Score: number;
    Material_Type: string;
    Country: string;
    Revenue_USD_Million: number;
    Renewable_Energy_Ratio: number;
    Annual_Units_Million: number;
    Carbon_Intensity_MT_per_USD_Million: number;
    Water_Intensity_L_per_USD_Million: number;
    Waste_Intensity_KG_per_USD_Million: number;
}

export interface ProductCSV {
    product_id: string; // CSV has it as number, we treat as string for IDs
    company: string;
    product_name: string;
    material_type: string;

    // Impact Metrics
    energy_used_per_unit: number;
    renewable_energy_ratio: number;
    water_consumed_per_unit: number;
    manufacturing_waste: number;
    scope1_scope2_emissions: number;

    // Composition
    material_composition: number; // Percentage ?
    hazardous_chemicals_used: string; // "yes" | "no"

    // Packaging
    packaging_material: string;
    plastic_percentage: number;
    packaging_weight_ratio: number;

    // Logistics
    shipping_distance: number;
    transport_mode: string;
    local_sourcing_percentage: number;
    shipping_emissions: number;

    // Usage
    operational_energy: number;
    energy_efficiency_rating: string;
    average_lifespan: number;
    repairability_index: number;
    recyclable_components: number; // Percentage?

    // Compliance
    sustainability_certifications: string;
    supply_chain_disclosure: string;
    esg_reporting_score: number;
    ethical_labor_score: number;
    environmental_violations: string;

    // From Search/Merge (Recylability was missing in ProductCSV in typical types, adding checks)
    recyclability_score: number;
}

export interface ManufacturingCSV {
    company: string;
    product_name: string;
    material_type: string;
    energy_used_per_unit: number;
    renewable_energy_ratio: number;
    water_consumed_per_unit: number;
    manufacturing_waste: number;
    scope1_scope2_emissions: number;
    material_composition: number;
    hazardous_chemicals_used: string;
}

// --- ENRICHED MODELS (Calculated) ---

export interface EnrichedBrand extends BrandCSV {
    id: string; // Slugified Name
    compositeScore: number; // 0-100 (Geometric Mean of Env * Gov)

    // Strong Sustainability Metrics
    environmentScore: number;
    governanceScore: number;
    penaltyFactor: number;
    criticalViolations: string[];
    tierLabel: 'Regenerative' | 'Sustainable' | 'Transitional' | 'Unsustainable';

    benchmarks: {
        carbon: number;
        water: number;
        waste: number;
        transparency: number;
    };

    normalized: {
        carbon: number; // 0-1 (1 is bad in old logic, but used differently in new engine)
        water: number;
        waste: number;
        transparency: number; // 0-1 (1 is good)
    };

    // Intelligence Fields
    transparencyScore: number; // 0-100
    sustainabilityTier: 'A' | 'B' | 'C' | 'D' | 'F';
    recommendation: 'LEADER' | 'MODERATE' | 'HIGH RISK';

    riskProfile: {
        litigation: boolean;
        fines: boolean;
        supplyChainExposure: boolean;
        airFreightUsage: boolean;
    };

    portfolioAnalysis: {
        totalProducts: number;
        avgScore: number;
        bestProduct?: EnrichedProduct;
        worstProduct?: EnrichedProduct;
        topProducts: EnrichedProduct[];
        bottomProducts: EnrichedProduct[];
        variance: number;
        tierDistribution: {
            A: number;
            B: number;
            C: number;
            D: number;
            F: number;
        };
    };
    materialUsage: string[];
}

export interface EnrichedProduct extends ProductCSV {
    compositeScore: number; // 0-100
    sustainabilityTier: 'A' | 'B' | 'C' | 'D' | 'F';

    // Calculated Footprint (Lifecycle)
    trueCarbonPerWear: number;

    // Flags
    redFlags: string[];

    // Competitive Metadata (Bi-directional)
    competitorCount: number;
    brandList: string[]; // Names of other brands producing this
    brandRank: number; // Rank of current brand among those producing this
    totalCategoryVolume?: number;
}
