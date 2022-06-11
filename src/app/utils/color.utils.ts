import { RgbColor } from 'react-colorful';

export abstract class ColorUtils {
    public static rgbToHex({ r, g, b }: RgbColor): string {
        return `#${[r, g, b].map((color) => this.clampRGB(color).toString(16).padStart(2, '0')).join('')}`;
    }

    public static hexToRgb(hex: string): RgbColor {
        const result = (hex.length < 6 ? /^#?([a-f\d])([a-f\d])([a-f\d])$/i : /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex) ?? [
            '0',
            '0',
            '0',
        ];
        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        };
    }

    private static clampRGB(value: number): number {
        return Math.max(0, Math.min(255, value));
    }
}
