import { NextResponse } from 'next/server';
import { getBrands } from '@/lib/data';
import { BrandComparisonEngine } from '@/lib/comparison-engine';
import { ScoringInput } from '@/lib/scoring-engine';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const brandsQuery = searchParams.get('brands');

    if (!brandsQuery) {
        return NextResponse.json({ error: 'Missing brands parameter. e.g. ?brands=levis,hm' }, { status: 400 });
    }

    const selectedBrandIds = brandsQuery.split(',').map(id => id.trim().toLowerCase());

    const allBrands = await getBrands();

    // Map enriched brands back to the Inputs required by the engine
    const dataset: (ScoringInput & { id: string, name: string })[] = allBrands.map(b => ({
        id: b.id.toLowerCase(),
        name: b.Brand_Name,
        carbon_footprint_mt: b.Carbon_Footprint_MT,
        water_usage_liters: b.Water_Usage_Liters,
        waste_production_kg: b.Waste_Production_KG,
        sustainable_material_percent: b.Sustainable_Material_Percent,
        transparency_score: b.Transparency_Score_2024,
        market_share_percent: b.Market_Share_Percent,
        consumer_engagement_score: b.Consumer_Engagement_Score
    }));

    const engine = new BrandComparisonEngine(dataset);
    const result = engine.generateComparison(selectedBrandIds);

    return NextResponse.json(result);
}
