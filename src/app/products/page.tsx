import { getProducts } from '@/lib/data';
import Link from 'next/link';
import { Search, BarChart3, AlertTriangle, Recycle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ProductMatrixClient } from './client';

// --- VISUALIZATION CONSTANTS ---
const PAGE_LIMIT = 48;

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string, view?: string, page?: string }> }) {
    const products = await getProducts();
    const sParams = await searchParams;
    const query = sParams?.q?.toLowerCase();
    const viewMode = sParams?.view || 'score';
    const page = Number(sParams?.page) || 1;

    // --- SORTING LOGIC ---
    let displayProducts = [...products];
    if (query) {
        displayProducts = displayProducts.filter(p =>
            p.product_name.toLowerCase().includes(query) ||
            p.company.toLowerCase().includes(query)
        );
    }

    if (viewMode === 'risk') {
        displayProducts.sort((a, b) => a.compositeScore - b.compositeScore);
    } else if (viewMode === 'circularity') {
        displayProducts.sort((a, b) => b.recyclability_score - a.recyclability_score);
    } else {
        displayProducts.sort((a, b) => b.compositeScore - a.compositeScore);
    }

    const totalResults = displayProducts.length;
    const totalPages = Math.ceil(totalResults / PAGE_LIMIT);
    const paginatedProducts = displayProducts.slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT);

    return (
        <div className="min-h-screen bg-slate-50 pt-36 pb-16 px-4 md:px-8 selection:bg-slate-900 selection:text-white font-sans">
            <div className="max-w-[1600px] mx-auto">

                {/* HEADER */}
                <div className="flex flex-col xl:flex-row justify-between items-end mb-12 gap-8 sticky top-24 z-40 bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/20 shadow-[8px_8px_0px_0px_rgba(15,23,42,0.05)]">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Product Intelligence Matrix</h1>
                        <p className="text-slate-500 font-bold font-mono text-xs">Lifecycle impact diagnostic for {products.length} active SKUs.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-center w-full xl:w-auto">
                        {/* Search */}
                        <form className="relative w-full md:w-64">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <Input
                                name="q"
                                defaultValue={query}
                                placeholder="SEARCH SKU..."
                                className="pl-10 h-12 rounded-full border-slate-200 bg-white shadow-sm font-bold font-mono text-xs uppercase"
                            />
                        </form>

                        {/* View Modes */}
                        <div className="flex bg-slate-100 p-1 rounded-full">
                            <Link href="/products?view=score" className={cn("px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all", viewMode === 'score' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900")}>
                                <BarChart3 className="w-3 h-3" /> Score
                            </Link>
                            <Link href="/products?view=risk" className={cn("px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all", viewMode === 'risk' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900")}>
                                <AlertTriangle className="w-3 h-3" /> Risk
                            </Link>
                            <Link href="/products?view=circularity" className={cn("px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all", viewMode === 'circularity' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900")}>
                                <Recycle className="w-3 h-3" /> Circularity
                            </Link>
                        </div>
                    </div>
                </div>

                {/* GRID & SELECTION ENGINE */}
                <ProductMatrixClient initialProducts={paginatedProducts} />

                {/* PAGINATION (Kept for search navigation) */}
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 mb-20 shadow-sm">
                    <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                        Showing {(page - 1) * PAGE_LIMIT + 1} - {Math.min(page * PAGE_LIMIT, totalResults)} of {totalResults} Records
                    </div>
                    <div className="flex gap-2">
                        {page > 1 && (
                            <Button asChild variant="outline" className="rounded-full h-8 text-[10px] font-bold uppercase tracking-widest border-slate-200 hover:bg-slate-900 hover:text-white transition-colors">
                                <Link href={`/products?q=${query || ''}&view=${viewMode}&page=${page - 1}`}>Previous</Link>
                            </Button>
                        )}
                        {page < totalPages && (
                            <Button asChild variant="outline" className="rounded-full h-8 text-[10px] font-bold uppercase tracking-widest border-slate-200 hover:bg-slate-900 hover:text-white transition-colors">
                                <Link href={`/products?q=${query || ''}&view=${viewMode}&page=${page + 1}`}>Next Page</Link>
                            </Button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
