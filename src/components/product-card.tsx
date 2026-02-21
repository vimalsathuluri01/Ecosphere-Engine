import Link from 'next/link';
import { ShieldAlert, Zap, Droplets, Factory, AlertCircle, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnrichedProduct } from '@/lib/types';
import { formatEmission, formatWater, formatWaste, formatScore } from '@/lib/formatters';

interface ProductCardProps {
    product: EnrichedProduct;
}

export function ProductCard({ product }: ProductCardProps) {
    const hasViolations = product.hazardous_chemicals_used === 'yes' || !!product.environmental_violations;

    // 1. Ecosphere Grade Logic (Non-compensatory)
    let grade = 'F';
    if (!hasViolations) {
        if (product.compositeScore >= 80) grade = 'A';
        else if (product.compositeScore >= 60) grade = 'B';
        else if (product.compositeScore >= 40) grade = 'C';
        else if (product.compositeScore >= 20) grade = 'D';
    }

    const gradeColors: Record<string, string> = {
        'A': 'bg-emerald-500 text-white',
        'B': 'bg-emerald-400 text-white',
        'C': 'bg-amber-400 text-white',
        'D': 'bg-orange-400 text-white',
        'F': 'bg-rose-500 text-white'
    };

    // 2. Fatal Flaw Logic
    let fatalFlaw = '';
    let fatalIcon: React.ReactNode = null;
    let isFatal = true;

    if (hasViolations) {
        fatalFlaw = 'Toxic Chemicals Detected';
        fatalIcon = <ShieldAlert className="w-4 h-4 text-rose-600" />;
    } else if (product.water_consumed_per_unit > 2500) {
        fatalFlaw = `Consumes ${product.water_consumed_per_unit.toLocaleString()}L Water`;
        fatalIcon = <Droplets className="w-4 h-4 text-rose-600" />;
    } else if (product.scope1_scope2_emissions > 40) {
        fatalFlaw = `Emits ${product.scope1_scope2_emissions.toLocaleString()}kg CO2e`;
        fatalIcon = <Zap className="w-4 h-4 text-rose-600" />;
    } else if (product.plastic_percentage > 40) {
        fatalFlaw = `High Plastic Ratio: ${product.plastic_percentage}%`;
        fatalIcon = <AlertCircle className="w-4 h-4 text-rose-600" />;
    } else if (product.manufacturing_waste > 5) {
        fatalFlaw = `Generates ${product.manufacturing_waste.toLocaleString()}kg Waste`;
        fatalIcon = <Factory className="w-4 h-4 text-rose-600" />;
    } else {
        fatalFlaw = 'Within Safe Bounds';
        fatalIcon = <ShieldAlert className="w-4 h-4 text-stone-400" />;
        isFatal = false;
    }

    // 3. Material Truth Logic
    const isSynthetic = ['Polyester', 'Nylon', 'Acrylic', 'Spandex', 'Elastane', 'Poly'].some(s => product.material_type.includes(s));
    const isBlend = product.material_type.includes('/') || product.material_type.includes('Blend') || product.material_type.includes(' and ');

    let materialTruth = '';
    if (isBlend || isSynthetic || product.plastic_percentage > 0) {
        const baseMat = isBlend ? 'Blend' : product.material_type;
        materialTruth = `Unrecyclable ${baseMat}${product.plastic_percentage > 0 ? ` (${product.plastic_percentage}% Plastic)` : ''}`;
    } else {
        materialTruth = `100% ${product.material_type}`;
    }

    return (
        <Link href={`/products/${product.product_id}`} className="group block h-full">
            <div className={cn(
                "h-full bg-white border border-stone-100 rounded-3xl p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col relative focus-within:ring-2 focus-within:ring-stone-400 outline-none",
                hasViolations && "bg-rose-50/50 border-rose-100"
            )}>

                {/* 1. Image Header Area (Simulated since we lack actual images, using a sleek placeholder shape) */}
                <div className="h-48 w-full bg-stone-50 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center border border-stone-100/50">
                    <div className="absolute inset-0 bg-gradient-to-tr from-stone-100 to-stone-50 mix-blend-multiply" />
                    {/* The Grade Badge floating top right */}
                    <div className={cn(
                        "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm",
                        gradeColors[grade]
                    )}>
                        {grade}
                    </div>
                    {/* Generic item icon based on material for visual texture */}
                    <div className="text-stone-300">
                        {product.material_type.includes('Leather') ? <Box className="w-12 h-12" /> : <Factory className="w-12 h-12" />}
                    </div>
                </div>

                {/* 2. Product Title & Price */}
                <div className="mb-4">
                    <div className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">
                        {product.company}
                    </div>
                    <h3 className="text-lg font-bold text-stone-800 leading-snug line-clamp-2 group-hover:text-stone-600 transition-colors">
                        {product.product_name}
                    </h3>
                </div>

                {/* 3. The "Material Truth" Block */}
                <div className="mb-6 flex flex-wrap gap-2">
                    <div className={cn(
                        "rounded-full px-3 py-1 font-mono text-xs inline-flex items-center",
                        materialTruth.includes('Unrecyclable') || product.plastic_percentage > 0 ? "bg-stone-100 text-stone-600" : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    )}>
                        {materialTruth}
                    </div>
                </div>

                {/* Optional: Metrics Row (Simplified to match Zen Eco) */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase text-stone-400 mb-1">CO2e</span>
                        <span className="font-mono text-sm text-stone-700">{formatEmission(product.scope1_scope2_emissions)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase text-stone-400 mb-1">H2O</span>
                        <span className="font-mono text-sm text-stone-700">{formatWater(product.water_consumed_per_unit)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase text-stone-400 mb-1">Score</span>
                        <span className="font-mono text-sm text-stone-700">{formatScore(product.compositeScore)}</span>
                    </div>
                </div>

                {/* 4. The "Fatal Flaw" Footer */}
                <div className="mt-auto pt-4 border-t border-stone-100">
                    <div className={cn(
                        "flex items-center gap-2 text-xs font-medium",
                        isFatal ? "text-rose-600" : "text-stone-500"
                    )}>
                        <div className="shrink-0">{fatalIcon}</div>
                        <span className="truncate">{fatalFlaw}</span>
                    </div>
                </div>

            </div>
        </Link>
    );
}
