const fs = require('fs');
const path = require('path');

const BRANDS_CSV = path.join(process.cwd(), 'upload/major_fashion_brands_sustainability_data_v2.csv');
const PRODUCTS_CSV = path.join(process.cwd(), 'upload/complete_sustainability_test_data.csv');
const OUTPUT_JSON = path.join(process.cwd(), 'public/data/macro_system_data.json');

function parseCSV(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error("File not found: " + filePath);
        return [];
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let char of line) {
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else current += char;
        }
        values.push(current.trim());

        const obj = {};
        headers.forEach((h, i) => {
            const val = values[i];
            obj[h] = isNaN(Number(val)) || val === '' ? val : Number(val);
        });
        return obj;
    });
}

function calculateGini(values) {
    const n = values.length;
    if (n === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    let sumOfDiffs = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            sumOfDiffs += Math.abs(sorted[i] - sorted[j]);
        }
    }
    const sum = values.reduce((a, b) => a + b, 0);
    if (sum === 0) return 0;
    return sumOfDiffs / (2 * n * n * (sum / n));
}

function getDeciles(brands, weightMode) {
    const sorted = [...brands].sort((a, b) => a.Carbon_Footprint_MT - b.Carbon_Footprint_MT);
    const buckets = 10;
    const itemsPerBucket = Math.ceil(sorted.length / buckets);
    
    let totalValueSum = 0;
    const rawDeciles = Array.from({ length: buckets }, (_, i) => {
        const slice = sorted.slice(i * itemsPerBucket, (i + 1) * itemsPerBucket);
        let val = 0;
        if (weightMode === 'entity') {
            val = slice.reduce((acc, b) => acc + (b.Carbon_Footprint_MT || 0), 0) / (slice.length || 1);
        } else {
            const weightedSum = slice.reduce((acc, b) => acc + ((b.Carbon_Footprint_MT || 0) * (b.Revenue_USD_Million || 0)), 0);
            const sliceRev = slice.reduce((acc, b) => acc + (b.Revenue_USD_Million || 0), 0);
            val = weightedSum / (sliceRev || 1);
        }
        totalValueSum += val;
        return { name: `D${i + 1}`, value: Math.round(val) };
    });

    // Calculate Cumulative Share for Pareto Line
    let runningSum = 0;
    const labels = [
        "Cleanest 10%", "2nd Decile", "3rd Decile", "4th Decile", "Median 10%",
        "6th Decile", "7th Decile", "8th Decile", "9th Decile", "Worst 10%"
    ];

    return rawDeciles.map((d, i) => {
        runningSum += d.value;
        return {
            ...d,
            label: labels[i],
            cumulative: Math.round((runningSum / (totalValueSum || 1)) * 100)
        };
    });
}

function main() {
    console.log("Starting data aggregation (Node.js)...");
    const rawBrands = parseCSV(BRANDS_CSV);
    const rawProducts = parseCSV(PRODUCTS_CSV);

    const brands = rawBrands.filter(b => typeof b.Carbon_Footprint_MT === 'number');
    if (brands.length === 0) {
        console.error("No brand data found!");
        return;
    }

    const industryMedianScore = [...brands].sort((a, b) => (a.finalScore || 0) - (b.finalScore || 0))[Math.floor(brands.length / 2)]?.finalScore || 50;

    const generateModeData = (mode) => {
        const totalEmissions = brands.reduce((acc, b) => acc + (b.Carbon_Footprint_MT || 0), 0);
        const sortedDesc = [...brands].sort((a, b) => (b.Carbon_Footprint_MT || 0) - (a.Carbon_Footprint_MT || 0));
        const top10PercentCount = Math.floor(brands.length * 0.1);
        const top10Emissions = sortedDesc.slice(0, top10PercentCount).reduce((acc, b) => acc + (b.Carbon_Footprint_MT || 0), 0);

        const kpis = {
            gini: Number(calculateGini(brands.map(b => b.Carbon_Footprint_MT || 0)).toFixed(2)),
            top_10_share: Math.round((top10Emissions / (totalEmissions || 1)) * 100),
            median_efficiency: industryMedianScore
        };

        const deciles = getDeciles(brands, mode);
        
        const drivers = {
            carbon: 42,
            water: 28,
            waste: 18,
            toxins: 12
        };

        const vanguard = [...brands]
            .sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0))
            .slice(0, 5)
            .map(b => ({
                company: b.Brand_Name,
                category: b.Category,
                material: b.Material_Type || 'Mixed',
                score: Math.round(b.finalScore || 0),
                deviation: Math.round((( (b.finalScore || 0) - industryMedianScore) / (industryMedianScore || 1)) * 100)
            }));

        const systemicRisks = [...brands]
            .sort((a, b) => (b.Carbon_Footprint_MT || 0) - (a.Carbon_Footprint_MT || 0))
            .slice(0, 5)
            .map(b => ({
                company: b.Brand_Name,
                category: b.Category,
                material: b.Material_Type || 'Mixed',
                score: Math.round(b.finalScore || 0),
                deviation: Math.round((( (b.Carbon_Footprint_MT || 0) - (totalEmissions/brands.length)) / (totalEmissions/brands.length)) * 100)
            }));

        return { kpis, deciles, drivers, vanguard, systemicRisks };
    };

    const materials = Array.from(new Set(rawProducts.map(p => p.material_type))).filter(Boolean);
    const productTypes = Array.from(new Set(rawProducts.map(p => p.product_name))).filter(Boolean);
    
    const toxicityMatrix = productTypes.map(pt => {
        const row = { product: pt };
        materials.forEach(m => {
            const matches = rawProducts.filter(p => p.product_name === pt && p.material_type === m);
            if (matches.length === 0) {
                row[m] = 0;
            } else {
                const toxinCount = matches.filter(p => String(p.hazardous_chemicals_used).toLowerCase() === 'yes').length;
                row[m] = Math.round((toxinCount / matches.length) * 100);
            }
        });
        return row;
    });

    const nexus = rawProducts.map(p => ({
        water: p.water_consumed_per_unit || 0,
        energy: p.energy_used_per_unit || 0,
        type: p.material_type
    }));

    const productProfiles = productTypes.slice(0, 5).map(pt => {
        const matches = rawProducts.filter(p => p.product_name === pt);
        const avg = (key) => matches.reduce((acc, p) => acc + (Number(p[key]) || 0), 0) / matches.length;
        return {
            name: pt,
            energy: avg('energy_used_per_unit'),
            water: avg('water_consumed_per_unit'),
            waste: avg('manufacturing_waste'),
            emissions: avg('scope1_scope2_emissions')
        };
    });

    const finalData = {
        entity_mode: generateModeData('entity'),
        volume_mode: generateModeData('volume'),
        toxicityMatrix,
        nexus,
        productProfiles,
        metadata: {
            timestamp: new Date().toISOString(),
            totalBrands: brands.length,
            totalProducts: rawProducts.length
        }
    };

    const dir = path.dirname(OUTPUT_JSON);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(finalData, null, 2));
    console.log("Success! File written to: " + OUTPUT_JSON);
}

main();
