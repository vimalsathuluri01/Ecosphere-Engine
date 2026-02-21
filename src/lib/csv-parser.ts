import fs from 'fs';
import path from 'path';

/**
 * Parse CSV string into array of objects
 */
export function parseCSV<T extends Record<string, string | number>>(
  csvString: string
): T[] {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim());
  const result: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;

    const obj: Record<string, string | number> = {};
    headers.forEach((header, index) => {
      const value = values[index];
      // Try to parse as number
      const numValue = parseFloat(value);
      obj[header] = isNaN(numValue) ? value : numValue;
    });

    result.push(obj as T);
  }

  return result;
}

/**
 * Parse a single CSV line handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Read and parse CSV file
 */
export function readCSVFile<T extends Record<string, string | number>>(
  filename: string
): T[] {
  const filePath = path.join(process.cwd(), 'upload', filename);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return parseCSV<T>(fileContent);
  } catch (error) {
    console.error(`Error reading CSV file ${filename}:`, error);
    return [];
  }
}

/**
 * Convert array of objects to CSV string
 */
export function toCSV<T extends Record<string, unknown>>(
  data: T[],
  headers?: string[]
): string {
  if (data.length === 0) return '';

  const keys = headers || Object.keys(data[0]);
  const headerLine = keys.join(',');

  const lines = data.map((item) => {
    return keys
      .map((key) => {
        const value = item[key];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return String(value ?? '');
      })
      .join(',');
  });

  return [headerLine, ...lines].join('\n');
}

/**
 * Convert array of objects to JSON string
 */
export function toJSON<T>(data: T): string {
  return JSON.stringify(data, null, 2);
}
