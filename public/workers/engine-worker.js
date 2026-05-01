/**
 * Ecosphere Engine Worker
 * Offloads heavy mathematical audits and competitive sorting to a background thread.
 */

self.onmessage = function(e) {
    const { allBrands, selectedNames } = e.data;

    // 1. Create Lookup Map for speed
    const brandMap = new Map();
    for (let i = 0; i < allBrands.length; i++) {
        brandMap.set(allBrands[i].Brand_Name, allBrands[i]);
    }

    // 2. Base Score Resolver
    const getSimulatedScore = (b) => b.finalScore ?? 0;

    // 3. Resolve Active Brands
    const activeBrands = selectedNames
        .map(name => brandMap.get(name))
        .filter(Boolean);

    if (activeBrands.length < 2) {
        self.postMessage({ error: 'INSUFFICIENT_DATA' });
        return;
    }

    // 4. Calculate Radar Data
    const radarData = [
        { subject: 'Carbon', fullMark: 28.0 },
        { subject: 'Water', fullMark: 24.0 },
        { subject: 'Waste', fullMark: 14.0 },
        { subject: 'Materials', fullMark: 10.0 },
        { subject: 'PR', fullMark: 8.0 },
        { subject: 'Life', fullMark: 16.0 },
    ].map(item => {
        const dataPoint = { subject: item.subject, fullMark: item.fullMark };
        activeBrands.forEach((b, i) => {
            if (item.subject === 'Carbon') dataPoint[`brand${i}`] = b.contributions?.['Carbon Base'] || 0;
            if (item.subject === 'Water') dataPoint[`brand${i}`] = b.contributions?.['Water Base'] || 0;
            if (item.subject === 'Waste') dataPoint[`brand${i}`] = b.contributions?.['Waste Base'] || 0;
            if (item.subject === 'Materials') dataPoint[`brand${i}`] = b.contributions?.['Materials'] || 0;
            if (item.subject === 'PR') dataPoint[`brand${i}`] = b.contributions?.['Transparency'] || 0;
            if (item.subject === 'Life') dataPoint[`brand${i}`] = b.contributions?.['Durability'] || 0;
        });
        return dataPoint;
    });

    // 5. Head-to-Head Stats
    const sortedByScore = [...activeBrands].sort((a, b) => getSimulatedScore(b) - getSimulatedScore(a));
    const winner = sortedByScore[0];
    const loser = sortedByScore[sortedByScore.length - 1];
    const scoreDelta = getSimulatedScore(winner) - getSimulatedScore(loser);

    // 6. Earth Tax Math
    const primary = activeBrands[0];
    const bestWaterEfficiency = Math.min(...activeBrands.map(b => b.Water_Usage_Liters / (b.Revenue_USD_Million || 1)));
    const primaryWaterEfficiency = primary.Water_Usage_Liters / (primary.Revenue_USD_Million || 1);
    const hypotheticalWaterA = (primary.Revenue_USD_Million || 1) * bestWaterEfficiency;
    const waterSavedA = primary.Water_Usage_Liters - hypotheticalWaterA;
    const isPrimaryBestWater = primaryWaterEfficiency === bestWaterEfficiency;

    // 7. Systemic Switch
    const switchCarbonSaved = ((loser.Carbon_Intensity_MT_per_USD_Million - winner.Carbon_Intensity_MT_per_USD_Million) * (loser.Revenue_USD_Million * 0.01));

    // Return Results
    self.postMessage({
        activeBrands,
        radarData,
        sortedByScore,
        winner,
        loser,
        scoreDelta,
        hypotheticalWaterA,
        waterSavedA,
        isPrimaryBestWater,
        switchCarbonSaved
    });
};
