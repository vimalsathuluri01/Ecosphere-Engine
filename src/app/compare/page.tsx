import { getBrandData } from '@/lib/data-parser';
import { CompareDashboard } from '@/components/compare-dashboard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ComparePage() {
    const brands = await getBrandData();

    return (
        <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-20 font-sans text-stone-900 selection:bg-stone-900 selection:text-white">
            <div className="max-w-7xl mx-auto px-6">

                {/* BACK NAV */}
                <Link href="/products" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 mb-8 transition-colors group">
                    <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> Return to Matrix
                </Link>

                <div className="mb-4">
                    <h1 className="text-4xl md:text-6xl font-sans font-bold text-stone-800 tracking-tighter uppercase mb-4">
                        Zero-Sum <span className="text-stone-400">Combat Engine</span>
                    </h1>
                    <p className="text-stone-500 max-w-2xl text-lg font-serif">
                        Compare operational intensities and PR divergence head-to-head.
                    </p>
                </div>

                {/* THE ENGINE */}
                <CompareDashboard allBrands={brands} />

            </div>
        </div>
    );
}
