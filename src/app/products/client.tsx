'use client';

import { EnrichedProduct } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Plus, Check, ArrowRight, X } from 'lucide-react';

export function ProductMatrixClient({ initialProducts }: { initialProducts: EnrichedProduct[] }) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const router = useRouter();

    const toggleProduct = useCallback((id: string) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(i => i !== id);
            }
            if (prev.length < 4) {
                return [...prev, id];
            }
            return prev;
        });
    }, []);

    const clearSelection = () => setSelectedIds([]);

    const navigateToCompare = () => {
        if (selectedIds.length >= 2) {
            const params = new URLSearchParams();
            params.set('products', selectedIds.join(','));
            router.push(`/compare/products?${params.toString()}`);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-12">
                {initialProducts.map((p) => (
                    <ProductCard 
                        key={p.product_id} 
                        product={p} 
                        isSelected={selectedIds.includes(p.product_id)}
                        onToggle={() => toggleProduct(p.product_id)}
                    />
                ))}
            </div>

            {/* STICKY COMPARISON BAR */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[800px]">
                    <div className="bg-stone-900 rounded-[2rem] p-4 shadow-2xl border border-white/10 flex items-center justify-between gap-6 backdrop-blur-md bg-opacity-95">
                        <div className="flex items-center gap-4 pl-4">
                            <div className="flex -space-x-3">
                                {selectedIds.map((id, i) => (
                                    <div key={id} className="w-10 h-10 rounded-full bg-white border-2 border-stone-900 flex items-center justify-center text-stone-900 font-black text-[10px] shadow-lg overflow-hidden" style={{ zIndex: 10 - i }}>
                                        {initialProducts.find(p => p.product_id === id)?.product_name.charAt(0)}
                                    </div>
                                ))}
                                {Array.from({ length: 4 - selectedIds.length }).map((_, i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-dashed border-stone-700 bg-stone-800/50 flex items-center justify-center" />
                                ))}
                            </div>
                            <div>
                                <div className="text-white text-sm font-black uppercase tracking-tighter">
                                    {selectedIds.length} / 4 SKUs Selected
                                </div>
                                <button 
                                    onClick={clearSelection}
                                    className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <X size={10} /> Reset Queue
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={navigateToCompare}
                            disabled={selectedIds.length < 2}
                            className={cn(
                                "px-8 h-14 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all",
                                selectedIds.length >= 2
                                    ? "bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 active:scale-95"
                                    : "bg-stone-800 text-stone-500 cursor-not-allowed"
                            )}
                        >
                            Compare Products
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
