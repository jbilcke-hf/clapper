const hue2rgb = (p: number, q: number, t: number) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

// Cache for toHex function
const toHexCache = new Map<number, string>();
const MAX_CACHE_SIZE = 10000; // Adjust this value based on your memory constraints

const toHex = (x: number) => {
  const key = Math.round(x * 255);
  if (toHexCache.has(key)) {
    return toHexCache.get(key)!;
  }
  const hex = key.toString(16).padStart(2, '0');
  if (toHexCache.size >= MAX_CACHE_SIZE) {
    // If cache is full, remove the oldest entry
    const firstKey: any = toHexCache.keys().next().value;
    toHexCache.delete(firstKey);
  }
  toHexCache.set(key, hex);
  return hex;
};

// Cache for hslToHex function
const hslToHexCache = new Map<string, string>();
const MAX_HSL_CACHE_SIZE = 10000; // Adjust this value based on your memory constraints

export function hslToHex(h: number, s: number, l: number): string {
  const key = `${h},${s},${l}`;
  if (hslToHexCache.has(key)) {
    return hslToHexCache.get(key)!;
  }

  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const result = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

  if (hslToHexCache.size >= MAX_HSL_CACHE_SIZE) {
    // If cache is full, remove the oldest entry
    const firstKey: any = hslToHexCache.keys().next().value;
    hslToHexCache.delete(firstKey);
  }
  hslToHexCache.set(key, result);
  return result;
}