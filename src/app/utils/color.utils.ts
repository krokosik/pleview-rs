import { RgbColor } from 'react-colorful';

export const rgbToHex = ({ r, g, b }: RgbColor): string => `#${[r, g, b].map((color) => clampRGB(color).toString(16).padStart(2, '0')).join('')}`;

export const hexToRgb = (hex: string): RgbColor => {
    const result = (hex.length < 6 ? /^#?([a-f\d])([a-f\d])([a-f\d])$/i : /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex) ?? ['0', '0', '0'];
    return {
        r: parseInt(result[1].padEnd(2, result[1]), 16),
        g: parseInt(result[2].padEnd(2, result[2]), 16),
        b: parseInt(result[3].padEnd(2, result[3]), 16),
    };
};

export const clampRGB = (value: number): number => Math.max(0, Math.min(255, Math.round(value)));

export const lerpColor = ((a: RgbColor | string, b: RgbColor | string, factor: number): RgbColor | string => {
    const left = typeof a === 'string' ? hexToRgb(a) : a;
    const right = typeof b === 'string' ? hexToRgb(b) : b;

    const result = {
        r: clampRGB(left.r + factor * (right.r - left.r)),
        g: clampRGB(left.g + factor * (right.g - left.g)),
        b: clampRGB(left.b + factor * (right.b - left.b)),
    };

    return typeof a === 'string' ? rgbToHex(result) : result;
}) as ((a: RgbColor, b: RgbColor, factor: number) => RgbColor) & ((a: string, b: string, factor: number) => string);
