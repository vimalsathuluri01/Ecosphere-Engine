import { getProducts } from '@/lib/data';
import { ProductCompareDashboard } from '@/components/product-compare-dashboard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';

export default async function ProductComparePage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-20 font-sans text-stone-900 selection:bg-stone-900 selection:text-white">
            <div className="max-w-7xl mx-auto px-6">

                {/* BACK NAV */}
                <Link href="/products" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 mb-8 transition-colors group">
                    <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> Return to Matrix
                </Link>

                {/* REFINED HEADER */}
                <div className="mb-12">
                    <h1 className="font-sans text-4xl md:text-6xl font-black text-stone-900 tracking-tight uppercase leading-[0.9]">
                        SKU <span className="text-stone-300">INTELLIGENCE</span> AUDIT
                    </h1>
                    <div className="h-1 w-20 bg-stone-900 mt-6 mb-4" />
                    <p className="text-stone-500 max-w-2xl text-lg font-serif italic leading-relaxed">
                        Side-by-side forensic analysis of product-level ecological footprints and supply chain transparency.
                    </p>
                </div>

                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center h-96 space-y-4">
                        <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Initializing Product Engine</div>
                    </div>
                }>
                    <ProductCompareDashboard allProducts={products} />
                </Suspense>

            </div>
        </div>
    );
}
