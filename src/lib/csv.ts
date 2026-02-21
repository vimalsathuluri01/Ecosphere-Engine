/**
 * Parses a CSV string into an array of objects.
 * Handles quoted fields containing commas.
 * Converts numeric strings to numbers automatically.
 */
export function parseCSV<T>(csvText: string): T[] {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    const headers = parseLine(lines[0]).map(h => h.trim());
    const result: T[] = [];

    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i];
        if (!currentLine) continue;

        const values = parseLine(currentLine);

        if (values.length !== headers.length) {
            // Skip malformed lines or handle leniently
            // console.warn(`Skipping line ${i}: Header count ${headers.length} vs Value count ${values.length}`);
            continue;
        }

        const obj: any = {};
        headers.forEach((header, index) => {
            let val = values[index].trim();

            // Auto-convert numbers
            if (!isNaN(Number(val)) && val !== '') {
                obj[header] = Number(val);
            } else {
                obj[header] = val;
            }
        });
        result.push(obj as T);
    }

    return result;
}

/**
 * Split a CSV line respecting quotes
 */
function parseLine(text: string): string[] {
    const result: string[] = [];
    let cur = '';
    let inQuote = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === '"') {
            inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
            result.push(cur);
            cur = '';
        } else {
            cur += char;
        }
    }
    result.push(cur);
    return result;
}
