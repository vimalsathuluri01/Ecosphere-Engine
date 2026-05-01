export const formatEmission = (val: number | undefined): string => {
    if (val === undefined || val === null) return 'N/A';
    return `${val.toFixed(2)} kg CO2e`;
};

export const formatEnergy = (val: number | undefined): string => {
    if (val === undefined || val === null) return 'N/A';
    return `${val.toFixed(1)} MJ`;
};

export const formatWater = (val: number | undefined): string => {
    if (val === undefined || val === null) return 'N/A';
    return `${val.toFixed(0)} L`;
};

export const formatWaste = (val: number | undefined): string => {
    if (val === undefined || val === null) return 'N/A';
    return `${val.toFixed(2)} kg`;
};

export const formatScore = (val: number | undefined): string => {
    if (val === undefined || val === null) return '-';
    return Math.round(val).toString();
};
