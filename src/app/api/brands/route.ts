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

    // Pagination
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 50;
    const offset = (page - 1) * limit;

    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      brands: paginated,
      totalCount: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit)
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to load brands' }, { status: 500 });
  }
}
