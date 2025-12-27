import { colord, extend } from "colord";
import labPlugin from "colord/plugins/lab";
import { pantoneColors, type PantoneColor } from "../data/pantone-colors";

extend([labPlugin]);

export function findClosestPantone(hex: string): PantoneColor {
    let minDistance = Infinity;
    // Use non-null assertion as we know the array is not empty
    let closestColor: PantoneColor = pantoneColors[0]!;

    const target = colord(hex);

    for (const color of pantoneColors) {
        // Cast to any to access the plugin method 'delta' without type declaration issues
        const distance = (target as any).delta(color.hex);

        if (distance < minDistance) {
            minDistance = distance;
            closestColor = color;
        }
    }

    return closestColor;
}

export function isValidHex(hex: string): boolean {
    return colord(hex).isValid();
}
