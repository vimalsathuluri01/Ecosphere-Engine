import fs from 'fs';
import path from 'path';
import { BrandData, computeCompleteEngine } from './methodology';

// Singleton Cache
let cachedBrandData: BrandData[] | null = null;
let lastLoadTime: number = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

// --- STEP 1: PARSER ---
export async function getBrandData(): Promise<BrandData[]> {
    const now = Date.now();
    if (cachedBrandData && (now - lastLoadTime < CACHE_TTL)) {
        return cachedBrandData;
    }
    const filePath = path.join(process.cwd(), 'upload', 'major_fashion_brands_sustainability_data_v2.csv');
    
    if (!fs.existsSync(filePath)) {
        // console.error("CSV File not found at:", filePath);
        return [];
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    const data: BrandData[] = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length !== headers.length) continue;

        const brand: any = {};
        headers.forEach((h, idx) => {
            const val = values[idx];
            if (isNaN(Number(val)) || val === '') {
                brand[h] = val;
            } else {
                brand[h] = Number(val);
            }
        });
        data.push(brand as BrandData);
    }

    const processedData = computeCompleteEngine(data);
    cachedBrandData = processedData;
    lastLoadTime = Date.now();
    return processedData;
}
