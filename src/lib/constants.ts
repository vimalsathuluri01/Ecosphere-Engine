export const THRESHOLDS = {
    CARBON: { limit: 2000000, k: 0.000002 }, // MT
    WATER: { limit: 15000000000, k: 0.0000000002 }, // Liters
    WASTE: { limit: 200000000, k: 0.00000002 } // KG
};

export const MATURITY_TIERS = {
    CARBON: 1.0,
    WATER: 1.0,
    WASTE: 1.0,
    MATERIALS: 1.0,
    TRANSPARENCY: 0.9,
    MARKET: 0.8,
    ENGAGEMENT: 0.8
};

// Subjective AHP Weights (Approx. Env Priority)
export const AHP_WEIGHTS = {
    carbon_footprint_mt: 0.35,
    water_usage_liters: 0.20,
    waste_production_kg: 0.15,
    sustainable_material_percent: 0.10,
    transparency_score: 0.15,
    market_share_percent: 0.025,
    consumer_engagement_score: 0.025
};
