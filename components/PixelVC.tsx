import type { ReactElement } from 'react';

// A small, original pixel-art "VC" monogram badge — hand-built from a grid
// of 1x1 SVG rects (no external assets, no font glyphs). Sits between
// VALERIA and CHACON in the hero wordmark.
//
// Layout on a 15 (wide) x 9 (tall) unit grid:
//   - A 1-unit-thick frame runs around the perimeter, but each of the 4
//     corner cells is left empty — that's what reads as a "stepped"/chamfered
//     pixel-art badge corner instead of a plain rounded rect.
//   - The 4 corner cells are instead filled with a single accent pixel,
//     echoing a retro game dialog-box frame.
//   - The interior (rows 1-7, cols 1-13) is a solid dark fill.
//   - "V" and "C" are each drawn as a 5x7 block glyph inside that interior,
//     with a 1-column gap between them and 1-column padding on the outer
//     edges.
//
// Colors are hardcoded (not read from CSS custom properties) so the badge
// keeps its own identity — a small dark badge with a bright frame and white
// letters — regardless of how the surrounding page's theme tokens evolve.
const FRAME_COLOR = '#ef3a24';
const INTERIOR_COLOR = '#0a0b0d';
const LETTER_COLOR = '#ffffff';

const GRID_W = 15;
const GRID_H = 9;

// 5x7 block glyphs, row-major, 1 = pixel on.
const GLYPH_V = [
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0],
  [0, 0, 1, 0, 0],
];

const GLYPH_C = [
  [0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [0, 1, 1, 1, 1],
];

const V_COL = 2;
const C_COL = 8;
const GLYPH_ROW = 1;

function glyphRects(glyph: number[][], colOffset: number, color: string, keyPrefix: string) {
  const rects: ReactElement[] = [];
  glyph.forEach((row, r) => {
    row.forEach((on, c) => {
      if (!on) return;
      rects.push(
        <rect
          key={`${keyPrefix}-${r}-${c}`}
          x={colOffset + c}
          y={GLYPH_ROW + r}
          width={1}
          height={1}
          fill={color}
        />
      );
    });
  });
  return rects;
}

// Perimeter frame pixels, corners omitted (they get the accent dot instead).
function framePixels() {
  const rects: ReactElement[] = [];
  for (let x = 1; x < GRID_W - 1; x++) {
    rects.push(<rect key={`ft-${x}`} x={x} y={0} width={1} height={1} fill={FRAME_COLOR} />);
    rects.push(<rect key={`fb-${x}`} x={x} y={GRID_H - 1} width={1} height={1} fill={FRAME_COLOR} />);
  }
  for (let y = 1; y < GRID_H - 1; y++) {
    rects.push(<rect key={`fl-${y}`} x={0} y={y} width={1} height={1} fill={FRAME_COLOR} />);
    rects.push(<rect key={`fr-${y}`} x={GRID_W - 1} y={y} width={1} height={1} fill={FRAME_COLOR} />);
  }
  return rects;
}

const CORNERS: Array<[number, number]> = [
  [0, 0],
  [GRID_W - 1, 0],
  [0, GRID_H - 1],
  [GRID_W - 1, GRID_H - 1],
];

interface PixelVCProps {
  className?: string;
}

export function PixelVC({ className }: PixelVCProps) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${GRID_W} ${GRID_H}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      role="presentation"
    >
      {/* Interior fill */}
      <rect x={1} y={1} width={GRID_W - 2} height={GRID_H - 2} fill={INTERIOR_COLOR} />
      {/* Stepped frame */}
      {framePixels()}
      {/* Accent corner dots — the "step" that reads as pixel art */}
      {CORNERS.map(([x, y]) => (
        <rect key={`corner-${x}-${y}`} x={x} y={y} width={1} height={1} fill={FRAME_COLOR} />
      ))}
      {/* Letters */}
      {glyphRects(GLYPH_V, V_COL, LETTER_COLOR, 'v')}
      {glyphRects(GLYPH_C, C_COL, LETTER_COLOR, 'c')}
    </svg>
  );
}
