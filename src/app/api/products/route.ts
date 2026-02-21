import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;

    let products = await getProducts();

    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p =>
        p.product_name.toLowerCase().includes(searchLower) ||
        p.company.toLowerCase().includes(searchLower)
      );
    }

    // Sort by Score desc default
    products.sort((a, b) => b.compositeScore - a.compositeScore);

    // Limit
    const paged = products.slice(0, limit);

    return NextResponse.json({
      products: paged,
      totalCount: products.length,
    });
  } catch (error) {
    console.error('Error loading products:', error);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}
