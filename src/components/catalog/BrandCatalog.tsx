import React from 'react';
import { BrandCard, type BrandData } from './BrandCard';

const MOCK_BRANDS: BrandData[] = [
    {
        id: "brd_01",
        name: "Gucci",
        category: "LUXURY",
        score: 83.81,
        issues: 0,
        carbon: { value: "30.77", progress: 30, status: "safe" },
        water: { value: "3,654,055", progress: 35, status: "safe" },
        sustainable: { value: "45", progress: 100, status: "safe" } // it's 45% but maybe for max it's 100% fill?
    },
    {
        id: "brd_02",
        name: "Marks_Spencer",
        category: "DEPARTMENT_STORE",
        score: 60.41,
        issues: 0,
        carbon: { value: "106.07", progress: 60, status: "safe" },
        water: { value: "6,000,000", progress: 60, status: "safe" },
        sustainable: { value: "38", progress: 80, status: "safe" }
    },
    {
        id: "brd_03",
        name: "Calvin_Klein",
        category: "PREMIUM",
        score: 53.08,
        issues: 0,
        carbon: { value: "122.22", progress: 70, status: "warning" },
        water: { value: "7,22,222", progress: 80, status: "warning" },
        sustainable: { value: "23", progress: 50, status: "warning" }
    },
    {
        id: "brd_04",
        name: "Tommy Hilfiger",
        category: "PREMIUM",
        score: 38.65,
        issues: 1,
        penalty: "HIGH INTENSITY PENALTY",
        carbon: { value: "139.51", progress: 90, status: "critical" },
        water: { value: "7,49,434", progress: 95, status: "critical" },
        sustainable: { value: "22", progress: 40, status: "warning" }
    },
    {
        id: "brd_05",
        name: "Puma",
        category: "ATHLETIC",
        score: 36.69,
        issues: 1,
        penalty: "HIGH INTENSITY PENALTY",
        carbon: { value: "143.10", progress: 95, status: "critical" },
        water: { value: "6,29,520", progress: 85, status: "warning" },
        sustainable: { value: "40", progress: 90, status: "safe" }
    },
    {
        id: "brd_06",
        name: "Hermès",
        category: "LUXURY",
        score: 32.73,
        issues: 1,
        penalty: "HIGH INTENSITY PENALTY",
        carbon: { value: "157.09", progress: 100, status: "critical" },
        water: { value: "2,02,200", progress: 40, status: "safe" },
        sustainable: { value: "29", progress: 60, status: "warning" }
    },
    {
        id: "brd_07",
        name: "Adidas",
        category: "SPORTSWEAR",
        score: 30.52,
        issues: 1,
        penalty: "HIGH INTENSITY PENALTY",
        carbon: { value: "160.22", progress: 100, status: "critical" },
        water: { value: "7,56,302", progress: 95, status: "critical" },
        sustainable: { value: "23", progress: 45, status: "warning" }
    },
    {
        id: "brd_08",
        name: "Chanel",
        category: "LUXURY",
        score: 21.91,
        issues: 1,
        penalty: "HIGH INTENSITY PENALTY",
        carbon: { value: "182.46", progress: 100, status: "critical" },
        water: { value: "9,25,920", progress: 100, status: "critical" },
        sustainable: { value: "9", progress: 20, status: "critical" }
    },
    // Add more from the picture for visual fullness
    {
        id: "brd_09",
        name: "Lululemon",
        category: "ATHLETIC",
        score: 18.36,
        issues: 1,
        penalty: "HIGH INTENSITY PENALTY",
        carbon: { value: "185.38", progress: 100, status: "critical" },
        water: { value: "9,25,120", progress: 100, status: "critical" },
        sustainable: { value: "20", progress: 40, status: "critical" }
    },
    {
        id: "brd_10",
        name: "Levi Strauss_Co",
        category: "DENIM",
        score: 11.17,
        issues: 1,
        penalty: "HIGH INTENSITY PENALTY",
        carbon: { value: "195.40", progress: 100, status: "critical" },
        water: { value: "20,00,000", progress: 100, status: "critical" },
        sustainable: { value: "19", progress: 38, status: "critical" }
    },
    {
        id: "brd_11",
        name: "Under Armour",
        category: "ATHLETIC",
        score: 7.11,
        issues: 1,
        penalty: "HIGH INTENSITY PENALTY",
        carbon: { value: "202.99", progress: 100, status: "critical" },
        water: { value: "10,40,200", progress: 100, status: "critical" },
        sustainable: { value: "15", progress: 30, status: "critical" }
    },
    {
        id: "brd_12",
        name: "Uniqlo",
        category: "FAST_FASHION",
        score: 0.19,
        issues: 2,
        penalty: "HIGH INTENSITY PENALTY",
        carbon: { value: "228.22", progress: 100, status: "critical" },
        water: { value: "17,50,425", progress: 100, status: "critical" },
        sustainable: { value: "25", progress: 50, status: "warning" }
    }
];

export const BrandCatalog: React.FC = () => {
    return (
        <section
            className="bg-[#FAFAFA] min-h-screen px-4 py-12 md:px-8 lg:px-12 xl:px-16 font-sans"
            aria-label="Brand Catalog Grid"
        >
            <div className="max-w-[1600px] mx-auto">

                {/* Header exact match to Image 1 */}
                <header className="mb-12 flex justify-between items-start">
                    <div>
                        <h1 className="font-sans text-4xl font-black text-[#1C1F26] tracking-tight uppercase">
                            ECOSPHERE ANALYTICS
                        </h1>
                        <p className="font-mono text-[9px] font-bold text-stone-500 tracking-[0.2em] uppercase mt-2">
                            IEEE METHODOLOGY | EMPIRICAL LOGISTICS FUNCTION | AHP HYBRID WEIGHTING
                        </p>
                    </div>

                    <div className="bg-white border-2 border-[#1C1F26]/10 px-4 py-2 rounded-full hidden md:block">
                        <span className="font-mono text-[10px] uppercase font-bold text-stone-600 tracking-widest">
                            ANALYZING 26 ENTITIES
                        </span>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
                    {MOCK_BRANDS.map(brand => (
                        <BrandCard key={brand.id} brand={brand} />
                    ))}
                </div>
            </div>
        </section>
    );
};
