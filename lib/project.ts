const LON_MIN = -125;
const LON_MAX = -66;
const LAT_MAX = 50;
const LAT_MIN = 24;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Equirectangular projection over the continental US, normalized to 0–1.
 * y is inverted so north maps to the top of the screen.
 */
export function projectCity(lat: number, lon: number): { x: number; y: number } {
  return {
    x: clamp01((lon - LON_MIN) / (LON_MAX - LON_MIN)),
    y: clamp01((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)),
  };
}
