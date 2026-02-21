import { getBrands } from './src/lib/data';

async function test() {
    try {
        const brands = await getBrands();
        console.log("TOTAL BRANDS:", brands.length);
        if (brands.length > 0) {
            console.log("FIRST BRAND ID:", brands[0].id);
            console.log("FIRST BRAND NAME:", brands[0].Brand_Name);
        }
        const nike = brands.find(b => b.id === 'nike');
        console.log("NIKE FOUND:", !!nike);

        const levis = brands.find(b => b.id === 'levis');
        console.log("LEVIS FOUND:", !!levis);
    } catch (e) {
        console.error("TEST FAILED", e);
    }
}

test();
