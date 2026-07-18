import type { ReactElement } from 'react';

// A small, original pixel-art "VC" monogram badge — hand-built from a grid of
// 1x1 SVG rects (no external assets, no font glyphs). Sits between VALERIA and
// CHACON in the hero wordmark.
//
// The glyphs use 2-unit-thick strokes rather than 1: at hero scale a 1-unit
// stroke reads as a row of disconnected blocks (it looked like a barcode),
// while 2 units stays unmistakably "VC" from across the room and still down at
// 375px wide.
//
// Grid is 21 (wide) x 13 (tall): a 1-unit frame, 1 unit of breathing room, two
// 7x9 glyphs with a 2-unit gap between them. The four corner cells carry the
// accent color to read as a stepped retro dialog-box frame.
//
// Colors are hardcoded (not theme tokens) so the badge keeps its own identity
// regardless of how the page's palette evolves.
const FRAME_COLOR = '#ef3a24';
const INTERIOR_COLOR = '#0a0b0d';
const LETTER_COLOR = '#ffffff';

const GRID_W = 21;
const GRID_H = 13;

// 7x9 block glyphs, row-major, 1 = pixel on. Strokes are 2 units thick.
const GLYPH_V = [
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [0, 1, 1, 0, 1, 1, 0],
  [0, 1, 1, 0, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
];

const GLYPH_C = [
  [0, 0, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 0, 1, 1],
  [0, 1, 1, 1, 1, 1, 1],
  [0, 0, 1, 1, 1, 1, 0],
];

const GLYPH_ROW = 2;
const V_COL = 2;
const C_COL = 12;

function glyphRects(glyph: number[][], colOffset: number, keyPrefix: string) {
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
          fill={LETTER_COLOR}
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
      {/* Accent corner pixels — the "step" that reads as pixel art */}
      {CORNERS.map(([x, y]) => (
        <rect key={`corner-${x}-${y}`} x={x} y={y} width={1} height={1} fill={FRAME_COLOR} />
      ))}
      {/* Letters */}
      {glyphRects(GLYPH_V, V_COL, 'v')}
      {glyphRects(GLYPH_C, C_COL, 'c')}
    </svg>
  );
}
