import { textToGrid } from "./glyphs.js";

const WEEKS = 53;
const ROWS = 7;

/** Deterministic PRNG so a given seed always produces the same grid. */
export function seededNoise(seed) {
  let t = seed + 0x6d2b79f5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Build the full contribution grid: text pixels become bright cells (3-4),
 * the background is filled with sparse noise scaled by `density` (0-1).
 */
export function buildContributionGrid(text, seed = 7, density = 0.12) {
  const random = seededNoise(seed);
  const grid = textToGrid(text, WEEKS, ROWS, 1);

  // density 0 -> almost empty background, density 1 -> busy background.
  const level2Cut = 1 - density * 0.25;
  const level1Cut = 1 - density * 0.9;

  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < WEEKS; x += 1) {
      if (grid[y][x] === 0) {
        const roll = random();
        grid[y][x] = roll > level2Cut ? 2 : roll > level1Cut ? 1 : 0;
      } else {
        grid[y][x] = random() > 0.18 ? 4 : 3;
      }
    }
  }

  return grid;
}
