import fs from 'fs';
import path from 'path';
import { BrandData, computeCompleteEngine } from './methodology';

// --- STEP 1: PARSER ---
export async function getBrandData(): Promise<BrandData[]> {
    const filePath = path.join(process.cwd(), 'upload', 'major_fashion_brands_sustainability_data.csv');
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

    return computeCompleteEngine(data);
}
