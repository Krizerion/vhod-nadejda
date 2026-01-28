import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ApartmentDto, FloorDto } from '../common/dto';

@Injectable()
export class CsvParserService {
  private readonly logger = new Logger(CsvParserService.name);
  private readonly csvPath = join(process.cwd(), 'assets', 'data', 'Apartments.csv');

  /**
   * Parse CSV file and return floors with apartments
   */
  parseFloors(): FloorDto[] {
    try {
      const csvText = readFileSync(this.csvPath, 'utf-8');
      const rows = this.parseCsv(csvText);

      if (rows.length < 2) {
        this.logger.warn('CSV file is empty or has no data rows');
        return [];
      }

      // Skip header row
      const dataRows = rows.slice(1);

      // Group by floor
      const floorsMap = new Map<number, ApartmentDto[]>();

      dataRows.forEach((row, index) => {
        const floorNum = parseInt(row[0] || '0', 10);

        // Check if apartment number is empty (empty apartment slot)
        const aptNumberStr = row[1]?.trim() || '';
        const aptNumber = aptNumberStr ? parseInt(aptNumberStr, 10) : null;

        // If no floor number, find the last valid floor number
        if (floorNum === 0) {
          let lastFloor = 1;
          for (let i = index - 1; i >= 0; i--) {
            const prevFloor = parseInt(dataRows[i][0] || '0', 10);
            if (prevFloor > 0) {
              lastFloor = prevFloor;
              break;
            }
          }
          if (!floorsMap.has(lastFloor)) {
            floorsMap.set(lastFloor, []);
          }
          floorsMap.get(lastFloor)!.push({ number: null });
          return;
        }

        // If floor number exists but apartment number is empty, add empty slot to that floor
        if (!aptNumber) {
          if (!floorsMap.has(floorNum)) {
            floorsMap.set(floorNum, []);
          }
          floorsMap.get(floorNum)!.push({ number: null });
          return;
        }

        // Parse apartment data
        const residentsCount = row[2]?.trim() ? parseInt(row[2], 10) : undefined;
        // Handle comma as decimal separator (European format)
        const repairsFee = row[3]?.trim() ? parseFloat(row[3].replace(',', '.')) : undefined;
        const currentExpensesFee = row[4]?.trim()
          ? parseFloat(row[4].replace(',', '.'))
          : undefined;
        const totalDebt = row[5]?.trim() ? parseFloat(row[5].replace(',', '.')) : undefined;
        const lastPaymentDate = row[6]?.trim() || undefined;

        const apartment: ApartmentDto = {
          number: aptNumber,
          residentsCount,
          repairsFee,
          currentExpensesFee,
          totalDebt,
          lastPaymentDate,
        };

        if (!floorsMap.has(floorNum)) {
          floorsMap.set(floorNum, []);
        }
        floorsMap.get(floorNum)!.push(apartment);
      });

      // Convert map to array and sort by floor number
      return Array.from(floorsMap.entries())
        .map(([number, apartments]) => ({ number, apartments }))
        .sort((a, b) => a.number - b.number);
    } catch (error) {
      this.logger.error(`Error parsing CSV file: ${error.message}`, error.stack);
      throw new Error(`Failed to parse CSV file: ${error.message}`);
    }
  }

  /**
   * Parse CSV text into array of arrays
   */
  private parseCsv(csvText: string): string[][] {
    // Handle Windows line endings (\r\n) and normalize to \n
    const normalizedText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalizedText.split('\n').filter((line) => line.trim().length > 0);
    const result: string[][] = [];

    for (const line of lines) {
      const row: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            // Escaped quote
            current += '"';
            i++; // Skip next quote
          } else {
            // Toggle quote state
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          // End of field
          row.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      // Add last field
      row.push(current.trim());

      // Only add non-empty rows
      if (row.some((cell) => cell.length > 0)) {
        result.push(row);
      }
    }

    return result;
  }
}
