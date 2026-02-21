import { NextRequest, NextResponse } from 'next/server';
import { getBrands } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brands = await getBrands();

    // Simple filter
    const search = searchParams.get('search')?.toLowerCase();
    const category = searchParams.get('category');

    let filtered = brands;

    if (search) {
      const normalizedSearch = search.replace(/[^a-z0-9]/g, '');
      filtered = filtered.filter(b => b.Brand_Name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(normalizedSearch));
    }

    // If we want to support category filtering in the future
    if (category && category !== 'all') {
      filtered = filtered.filter(b => b.Category.toLowerCase() === category.toLowerCase());
    }

    return NextResponse.json({
      brands: filtered,
      totalCount: filtered.length
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to load brands' }, { status: 500 });
  }
}
