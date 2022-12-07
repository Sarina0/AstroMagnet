import { ColorPalette } from "@app/theme/colors";

/**
 * get hex of color with specific opacity
 * @param color - color hex value
 * @param opacity - wanted opacity
 * @returns {string} - color with opacity hex value
 */
export const colorWithOpacity = (color: ColorPalette, opacity: number): string => {
    const op = Math.max(0, Math.min(opacity, 100))
    const hexValue = op.toString(16);
    return color + hexValue
}