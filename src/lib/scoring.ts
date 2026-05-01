type BrandRaw = any; type BrandMetrics = any; type TransparencyRating = any; type Brand = any; type ProductRaw = any; type Product = any; type ManufacturingRaw = any; type ManufacturingMetrics = any;

// Industry average baseline
export const INDUSTRY_AVERAGE_SCORE = 65;

/**
 * ECOSPHERE ENGINE v1.0 - Strong Sustainability Framework
 * Based on IEEE paper: "The Ecosphere Engine: A Constraint-Integrated Hybrid Model"
 * 
 * Key Features:
 * 1. Hybrid Weighting via Cooperative Game Theory (AHP + Entropy)
 * 2. Logistic Planetary Boundary Penalty Function
 * 3. Non-Compensatory Aggregation
 * 4. Comparison with Traditional WAM (Weighted Arithmetic Mean) scoring
 */

// ============================================
// SECTION 1: HYBRID WEIGHTS (COOPERATIVE GAME THEORY)
// ============================================

// Subjective weights derived from AHP (Analytic Hierarchy Process)
export const SUBJECTIVE_WEIGHTS = {
  carbon: 0.35,      // Highest priority - climate change
  water: 0.30,       // High priority - freshwater systems
  waste: 0.15,       // Medium priority - circularity
  social: 0.12,      // Social responsibility
  transparency: 0.08 // Governance and disclosure
};

// Objective weights derived from Maturity-Adjusted Shannon Entropy
export const OBJECTIVE_WEIGHTS = {
  carbon: 0.32,
  water: 0.28,
  waste: 0.18,
  social: 0.10,
  transparency: 0.12
};

// Cooperative game-theoretic optimization coefficients
export const ALPHA = 0.58;  // Weight for subjective

// Final Hybrid Weights (Pareto-optimal compromise)
export const HYBRID_WEIGHTS = {
  carbon: 0.335,
  water: 0.290,
  waste: 0.165,
  social: 0.112,
  transparency: 0.098
};

// ============================================
// SECTION 2: PLANETARY BOUNDARY THRESHOLDS
// ============================================

export interface PlanetaryThreshold {
  softThreshold: number;   // Early warning level
  hardThreshold: number;   // Critical limit
}

// Carbon thresholds (Metric Tons) - calibrated for data distribution
export const CARBON_THRESHOLDS: PlanetaryThreshold = {
  softThreshold: 1100,   // Good: below this gets high score
  hardThreshold: 2200    // Poor: above this gets low score with penalty
};

// Water thresholds (Liters) - calibrated for data distribution
export const WATER_THRESHOLDS: PlanetaryThreshold = {
  softThreshold: 200000,  // Good performance
  hardThreshold: 380000   // Poor performance
};

// Waste thresholds (KG) - calibrated for data distribution
export const WASTE_THRESHOLDS: PlanetaryThreshold = {
  softThreshold: 600,    // Good performance
  hardThreshold: 1200    // Poor performance
};

// Steepness parameter for logistic function
export const GAMMA = 5;

// ============================================
// SECTION 3: LOGISTIC PENALTY FUNCTION
// ============================================

/**
 * Calculate penalty based on actual value relative to thresholds
 */
export function calculateIntensityPenalty(
  actualValue: number,
  softThreshold: number,
  hardThreshold: number
): number {
  if (actualValue <= softThreshold) return 1.0;
  if (actualValue >= hardThreshold) return 0.1;

  const normalizedPosition = (actualValue - softThreshold) / (hardThreshold - softThreshold);
  const exponent = GAMMA * (normalizedPosition - 0.5);
  const penalty = 1 / (1 + Math.exp(exponent));

  return Math.max(0.1, penalty);
}

// ============================================
// SECTION 4: PILLAR SCORE CALCULATIONS
// ============================================

/**
 * Calculate Carbon Pillar Score
 */
export function calculateCarbonPillarScore(carbonFootprintMT: number): number {
  const { softThreshold, hardThreshold } = CARBON_THRESHOLDS;

  if (carbonFootprintMT <= softThreshold * 0.5) return 98;
  if (carbonFootprintMT <= softThreshold) {
    const ratio = carbonFootprintMT / softThreshold;
    return 98 - (ratio * 23);
  }
  if (carbonFootprintMT <= hardThreshold) {
    const ratio = (carbonFootprintMT - softThreshold) / (hardThreshold - softThreshold);
    return 75 - (ratio * 35);
  }
  const excess = carbonFootprintMT - hardThreshold;
  return Math.max(20, 40 - (excess / hardThreshold) * 20);
}

/**
 * Calculate Water Pillar Score
 */
export function calculateWaterPillarScore(waterUsageLiters: number): number {
  const { softThreshold, hardThreshold } = WATER_THRESHOLDS;

  if (waterUsageLiters <= softThreshold * 0.5) return 98;
  if (waterUsageLiters <= softThreshold) {
    const ratio = waterUsageLiters / softThreshold;
    return 98 - (ratio * 23);
  }
  if (waterUsageLiters <= hardThreshold) {
    const ratio = (waterUsageLiters - softThreshold) / (hardThreshold - softThreshold);
    return 75 - (ratio * 35);
  }
  const excess = waterUsageLiters - hardThreshold;
  return Math.max(20, 40 - (excess / hardThreshold) * 20);
}

/**
 * Calculate Waste Pillar Score
 */
export function calculateWastePillarScore(wasteProductionKG: number): number {
  const { softThreshold, hardThreshold } = WASTE_THRESHOLDS;

  if (wasteProductionKG <= softThreshold * 0.5) return 98;
  if (wasteProductionKG <= softThreshold) {
    const ratio = wasteProductionKG / softThreshold;
    return 98 - (ratio * 23);
  }
  if (wasteProductionKG <= hardThreshold) {
    const ratio = (wasteProductionKG - softThreshold) / (hardThreshold - softThreshold);
    return 75 - (ratio * 35);
  }
  const excess = wasteProductionKG - hardThreshold;
  return Math.max(20, 40 - (excess / hardThreshold) * 20);
}

/**
 * Calculate Social Pillar Score
 */
export function calculateSocialPillarScore(
  sustainableMaterialPercent: number,
  transparencyScore: number,
  consumerEngagementScore: number = 5
): number {
  const materialScore = sustainableMaterialPercent;
  const governanceScore = transparencyScore;
  const engagementScore = consumerEngagementScore * 10;

  const socialScore = (materialScore * 0.4) + (governanceScore * 0.35) + (engagementScore * 0.25);
  return Math.max(20, Math.min(100, socialScore));
}

/**
 * Calculate Transparency Pillar Score
 */
export function calculateTransparencyPillarScore(
  transparencyScore: number,
  hasAuditData: boolean,
  hasSupplierData: boolean
): number {
  let score = transparencyScore;
  if (hasAuditData) score = Math.min(100, score + 10);
  if (hasSupplierData) score = Math.min(100, score + 5);
  return Math.max(20, score);
}

// ============================================
// SECTION 5: PENALTY FACTORS
// ============================================

/**
 * Calculate all environmental penalty factors
 */
export function calculatePenaltyFactors(brand: BrandRaw): {
  carbonPenalty: number;
  waterPenalty: number;
  wastePenalty: number;
  minPenalty: number;
} {
  const carbonPenalty = calculateIntensityPenalty(
    brand.Carbon_Footprint_MT,
    CARBON_THRESHOLDS.softThreshold,
    CARBON_THRESHOLDS.hardThreshold
  );

  const waterPenalty = calculateIntensityPenalty(
    brand.Water_Usage_Liters,
    WATER_THRESHOLDS.softThreshold,
    WATER_THRESHOLDS.hardThreshold
  );

  const wastePenalty = calculateIntensityPenalty(
    brand.Waste_Production_KG,
    WASTE_THRESHOLDS.softThreshold,
    WASTE_THRESHOLDS.hardThreshold
  );

  const minPenalty = Math.min(carbonPenalty, waterPenalty, wastePenalty);

  return { carbonPenalty, waterPenalty, wastePenalty, minPenalty };
}

// ============================================
// SECTION 6: SCORE CALCULATIONS
// ============================================

/**
 * Calculate WAM Score (Traditional Weighted Arithmetic Mean)
 * This represents traditional ESG scoring - fully compensatory
 * Formula: WAM = ∑ wk·Sk (no penalty applied)
 */
export function calculateWAMScore(
  pillarScores: {
    carbon: number;
    water: number;
    waste: number;
    social: number;
    transparency: number;
  }
): number {
  const weightedSum =
    HYBRID_WEIGHTS.carbon * pillarScores.carbon +
    HYBRID_WEIGHTS.water * pillarScores.water +
    HYBRID_WEIGHTS.waste * pillarScores.waste +
    HYBRID_WEIGHTS.social * pillarScores.social +
    HYBRID_WEIGHTS.transparency * pillarScores.transparency;

  return Math.max(0, Math.min(100, weightedSum));
}

/**
 * Calculate Ecosphere Score (Non-Compensatory)
 * Formula: E = (∑ wk·Sk) × min(φk)
 */
export function calculateEcosphereScore(
  pillarScores: {
    carbon: number;
    water: number;
    waste: number;
    social: number;
    transparency: number;
  },
  penaltyFactors: {
    minPenalty: number;
  }
): number {
  const weightedSum =
    HYBRID_WEIGHTS.carbon * pillarScores.carbon +
    HYBRID_WEIGHTS.water * pillarScores.water +
    HYBRID_WEIGHTS.waste * pillarScores.waste +
    HYBRID_WEIGHTS.social * pillarScores.social +
    HYBRID_WEIGHTS.transparency * pillarScores.transparency;

  // Apply non-compensatory penalty (multiplicative)
  const finalScore = weightedSum * penaltyFactors.minPenalty;

  return Math.max(0, Math.min(100, finalScore));
}

// ============================================
// SECTION 7: TRANSPARENCY & TREND
// ============================================

/**
 * Calculate Transparency Rating
 */
export function calculateTransparencyRating(
  transparencyScore: number,
  hasAuditData: boolean,
  hasSupplierData: boolean
): TransparencyRating {
  const adjustedScore = transparencyScore + (hasAuditData ? 10 : 0) + (hasSupplierData ? 5 : 0);

  if (adjustedScore >= 70) return { rating: 'Excellent Transparency', tier: 'excellent' };
  if (adjustedScore >= 50) return { rating: 'Good Transparency', tier: 'good' };
  if (adjustedScore >= 30) return { rating: 'Moderate Transparency', tier: 'moderate' };
  return { rating: 'Low Transparency', tier: 'low' };
}

/**
 * Calculate Trend Direction
 */
export function calculateTrendDirection(
  sustainablePercent: number,
  transparencyScore: number
): 'improving' | 'stable' | 'declining' {
  if (sustainablePercent > 30 && transparencyScore > 50) return 'improving';
  if (sustainablePercent < 20 || transparencyScore < 30) return 'declining';
  return 'stable';
}

/**
 * Calculate Trend Percentage
 */
export function calculateTrendPercentage(
  sustainablePercent: number,
  trendDirection: 'improving' | 'stable' | 'declining'
): number {
  switch (trendDirection) {
    case 'improving': return 5 + (sustainablePercent / 100) * 10;
    case 'declining': return -(2 + ((100 - sustainablePercent) / 100) * 8);
    case 'stable': return 0;
    default: return 0;
  }
}

// ============================================
// SECTION 8: MAIN METRICS CALCULATION
// ============================================

/**
 * Calculate all metrics for a brand
 */
export function calculateBrandMetrics(
  brand: BrandRaw,
  hasAuditData: boolean,
  hasSupplierData: boolean
): BrandMetrics {
  // Calculate pillar scores
  const carbonPillarScore = calculateCarbonPillarScore(brand.Carbon_Footprint_MT);
  const waterPillarScore = calculateWaterPillarScore(brand.Water_Usage_Liters);
  const wastePillarScore = calculateWastePillarScore(brand.Waste_Production_KG);
  const socialPillarScore = calculateSocialPillarScore(
    brand.Sustainable_Material_Percent,
    brand.Transparency_Score_2024,
    brand.Consumer_Engagement_Score
  );
  const transparencyPillarScore = calculateTransparencyPillarScore(
    brand.Transparency_Score_2024,
    hasAuditData,
    hasSupplierData
  );

  const pillarScores = {
    carbon: carbonPillarScore,
    water: waterPillarScore,
    waste: wastePillarScore,
    social: socialPillarScore,
    transparency: transparencyPillarScore
  };

  // Calculate penalty factors
  const penaltyFactors = calculatePenaltyFactors(brand);

  // Calculate BOTH scores for comparison
  const wamScore = calculateWAMScore(pillarScores);  // Traditional ESG
  const sustainabilityScore = calculateEcosphereScore(pillarScores, penaltyFactors);  // New

  // Calculate supporting metrics
  const transparencyRating = calculateTransparencyRating(
    brand.Transparency_Score_2024,
    hasAuditData,
    hasSupplierData
  );

  const trendDirection = calculateTrendDirection(
    brand.Sustainable_Material_Percent,
    brand.Transparency_Score_2024
  );

  const trendPercentage = calculateTrendPercentage(
    brand.Sustainable_Material_Percent,
    trendDirection
  );

  const scoreVsAverage = sustainabilityScore - INDUSTRY_AVERAGE_SCORE;

  // Calculate score difference (shows the "Nike Paradox" effect)
  const scoreDifference = sustainabilityScore - wamScore;

  return {
    sustainabilityScore,
    wamScore,
    scoreDifference,
    carbonPillarScore,
    waterPillarScore,
    wastePillarScore,
    socialPillarScore,
    transparencyPillarScore,
    transparencyRating,
    trendDirection,
    trendPercentage,
    scoreVsAverage,
    penaltyFactors: {
      carbon: penaltyFactors.carbonPenalty,
      water: penaltyFactors.waterPenalty,
      waste: penaltyFactors.wastePenalty,
      minPenalty: penaltyFactors.minPenalty
    }
  };
}

/**
 * Determine if brand has audit data
 */
export function determineHasAuditData(brand: BrandRaw): boolean {
  const auditedProcesses = ['Organic', 'Recycled', 'Premium'];
  return auditedProcesses.includes(brand.Production_Process) || brand.Transparency_Score_2024 >= 60;
}

/**
 * Determine if brand has supplier data
 */
export function determineHasSupplierData(brand: BrandRaw): boolean {
  return brand.Transparency_Score_2024 >= 55 || brand.Production_Process === 'Organic';
}

/**
 * Calculate industry average from brands
 */
export function calculateIndustryAverage(brands: Brand[]): number {
  if (brands.length === 0) return INDUSTRY_AVERAGE_SCORE;
  const total = brands.reduce((sum, brand) => sum + brand.metrics.sustainabilityScore, 0);
  return Math.round((total / brands.length) * 100) / 100;
}

/**
 * Export methodology parameters
 */
export const ECOSPHERE_METHODOLOGY = {
  version: '1.0',
  name: 'Ecosphere Engine',
  description: 'Constraint-Integrated Hybrid Model for Strong Sustainability Assessment',

  hybridWeights: HYBRID_WEIGHTS,
  subjectiveWeights: SUBJECTIVE_WEIGHTS,
  objectiveWeights: OBJECTIVE_WEIGHTS,
  alpha: ALPHA,

  thresholds: {
    carbon: CARBON_THRESHOLDS,
    water: WATER_THRESHOLDS,
    waste: WASTE_THRESHOLDS
  },

  gamma: GAMMA,

  scoringFormulas: {
    wam: 'WAM = ∑ wk·Sk (Traditional ESG)',
    ecosphere: 'E = (∑ wk·Sk) × min(φk) (Non-Compensatory)'
  },

  keyFeatures: [
    'Non-compensatory aggregation prevents masking environmental damage',
    'Planetary boundary constraints enforce biophysical limits',
    'Hybrid weighting combines expert judgment and data-driven insights',
    'Comparison with traditional WAM reveals "Nike Paradox" effect',
    'Logistic penalty function models ecological tipping points'
  ]
};
