import { NextRequest, NextResponse } from 'next/server';
import { readCSVFile } from '@/lib/csv-parser';
import { ManufacturingCSV } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const company = searchParams.get('company');
    const materialType = searchParams.get('materialType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Load manufacturing data from CSV
    const records = readCSVFile<any>('manufacturing_test_data_v2.csv');

    // Apply filters
    let filtered = records;
    if (company && company !== 'all') {
      filtered = filtered.filter(r => r.company === company);
    }
    if (materialType && materialType !== 'all') {
      filtered = filtered.filter(r => r.material_type === materialType);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedRecords = filtered.slice(startIndex, startIndex + limit);

    // Get filter options
    const companies = [...new Set(records.map(r => r.company))].sort();
    const materialTypes = [...new Set(records.map(r => r.material_type))].sort();

    // Calculate summary statistics
    const totalEnergy = filtered.reduce((sum, r) => sum + r.energy_used_per_unit, 0);
    const avgRenewableRatio = filtered.reduce((sum, r) => sum + r.renewable_energy_ratio, 0) / filtered.length || 0;
    const totalWater = filtered.reduce((sum, r) => sum + r.water_consumed_per_unit, 0);
    const totalWaste = filtered.reduce((sum, r) => sum + r.manufacturing_waste, 0);
    const totalEmissions = filtered.reduce((sum, r) => sum + r.scope1_scope2_emissions, 0);

    return NextResponse.json({
      records: paginatedRecords,
      filterOptions: {
        companies,
        materialTypes,
      },
      summary: {
        totalRecords: filtered.length,
        totalEnergy: totalEnergy.toFixed(2),
        avgRenewableRatio: avgRenewableRatio.toFixed(2),
        totalWater: totalWater.toFixed(2),
        totalWaste: totalWaste.toFixed(2),
        totalEmissions: totalEmissions.toFixed(2),
      },
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    });
  } catch (error) {
    console.error('Error loading manufacturing data:', error);
    return NextResponse.json({ error: 'Failed to load manufacturing data' }, { status: 500 });
  }
}
