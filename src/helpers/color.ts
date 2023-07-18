import { Color } from "../types";

export function hexToColor(color: string): Color {
    const hex_code = color.split("");
    const r = parseInt(hex_code[1] + hex_code[2], 16);
    const g = parseInt(hex_code[3] + hex_code[4], 16);
    const b = parseInt(hex_code[5] + hex_code[6], 16);
    return { r, g, b };
}
