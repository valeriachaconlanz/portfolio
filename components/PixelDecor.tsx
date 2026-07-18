import type { ReactElement } from 'react';
import styles from './PixelDecor.module.css';

// Original pixel-art decorations — outline clouds, small color-pop flowers,
// simple round trees — built the same way as PixelVC.tsx: grids of 1x1 SVG
// rects with shapeRendering="crispEdges", no external assets or font
// glyphs. Purely decorative: every glyph is aria-hidden and every scattered
// instance sits behind body copy with pointer-events disabled (see
// PixelDecor.module.css .field).

type Cell = [x: number, y: number];

function buildGrid(w: number, h: number): number[][] {
  return Array.from({ length: h }, () => Array(w).fill(0));
}

// Unions a filled circle into a 0/1 grid — used to stamp several overlapping
// "bumps" to build blobby cloud/canopy silhouettes without hand-transcribing
// ASCII art (which is easy to get wrong: mismatched row lengths silently
// distort the shape instead of erroring).
function stampCircle(grid: number[][], cx: number, cy: number, r: number): void {
  const h = grid.length;
  const w = grid[0]?.length ?? 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r * r) grid[y][x] = 1;
    }
  }
}

function cellsOf(shape: number[][]): Cell[] {
  const cells: Cell[] = [];
  shape.forEach((row, y) => {
    row.forEach((on, x) => {
      if (on) cells.push([x, y]);
    });
  });
  return cells;
}

// Only the boundary cells of a filled shape — cells with at least one
// unfilled (or off-grid) neighbor — so the silhouette reads as an outline
// rather than a solid block.
function outlineCellsOf(shape: number[][]): Cell[] {
  const h = shape.length;
  const w = shape[0]?.length ?? 0;
  const cells: Cell[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!shape[y][x]) continue;
      const isEdge =
        y === 0 ||
        y === h - 1 ||
        x === 0 ||
        x === w - 1 ||
        !shape[y - 1][x] ||
        !shape[y + 1][x] ||
        !shape[y][x - 1] ||
        !shape[y][x + 1];
      if (isEdge) cells.push([x, y]);
    }
  }
  return cells;
}

function rects(cells: Cell[], color: string, keyPrefix: string): ReactElement[] {
  return cells.map(([x, y]) => (
    <rect key={`${keyPrefix}-${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />
  ));
}

interface DecorProps {
  className?: string;
}

// --- Cloud: black outline on transparent, sits on the white body ---

const CLOUD_W = 24;
const CLOUD_H = 12;
const CLOUD_INK = '#0a0b0d';

function buildCloudShape(): number[][] {
  const grid = buildGrid(CLOUD_W, CLOUD_H);
  stampCircle(grid, 6, 7, 4);
  stampCircle(grid, 11, 5, 5);
  stampCircle(grid, 17, 6, 4.5);
  stampCircle(grid, 21, 8, 3);
  stampCircle(grid, 4, 9, 3);
  return grid;
}

export function PixelCloud({ className }: DecorProps) {
  const shape = buildCloudShape();
  return (
    <svg
      className={className}
      viewBox={`0 0 ${CLOUD_W} ${CLOUD_H}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      role="presentation"
    >
      {rects(outlineCellsOf(shape), CLOUD_INK, 'cloud')}
    </svg>
  );
}

// --- Flower: small pops of saturated color ---

const FLOWER_INK = '#0a0b0d';
const PETAL_COLOR = '#ef3a24';
const CENTER_COLOR = '#ffd23f';
const STEM_COLOR = '#4a9b52';

const FLOWER_PETALS: Cell[] = [
  [2, 0],
  [4, 0],
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [5, 1],
  [1, 2],
  [2, 2],
  [4, 2],
  [5, 2],
  [2, 3],
  [4, 3],
];
const FLOWER_CENTER: Cell[] = [[3, 2]];
const FLOWER_STEM: Cell[] = [
  [3, 4],
  [3, 5],
  [3, 6],
];
const FLOWER_LEAF: Cell[] = [[2, 6]];

export function PixelFlower({ className }: DecorProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 7 7"
      shapeRendering="crispEdges"
      aria-hidden="true"
      role="presentation"
    >
      {rects(FLOWER_PETALS, PETAL_COLOR, 'petal')}
      {rects(FLOWER_CENTER, CENTER_COLOR, 'center')}
      {rects(FLOWER_STEM, STEM_COLOR, 'stem')}
      {rects(FLOWER_LEAF, STEM_COLOR, 'leaf')}
    </svg>
  );
}

// --- Tree: round canopy with a color fill under a black outline pass, plus
// a solid trunk ---

const TREE_W = 11;
const TREE_H = 12;
const CANOPY_COLOR = '#4a9b52';
const TRUNK_COLOR = '#7a4a2a';

function buildTreeCanopy(): number[][] {
  const grid = buildGrid(TREE_W, TREE_H);
  stampCircle(grid, 5, 4, 4.1);
  stampCircle(grid, 2.5, 5.5, 2.4);
  stampCircle(grid, 8.5, 5.5, 2.4);
  return grid;
}

const TREE_TRUNK: Cell[] = [
  [4, 8],
  [5, 8],
  [6, 8],
  [4, 9],
  [5, 9],
  [6, 9],
  [4, 10],
  [5, 10],
  [6, 10],
];

export function PixelTree({ className }: DecorProps) {
  const canopy = buildTreeCanopy();
  return (
    <svg
      className={className}
      viewBox={`0 0 ${TREE_W} ${TREE_H}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      role="presentation"
    >
      {rects(cellsOf(canopy), CANOPY_COLOR, 'canopy-fill')}
      {rects(outlineCellsOf(canopy), FLOWER_INK, 'canopy-outline')}
      {rects(TREE_TRUNK, TRUNK_COLOR, 'trunk')}
    </svg>
  );
}

// --- Scattered field: a handful of the above, absolutely positioned within
// a relative parent. Hidden below the tablet breakpoint — at narrow widths
// there isn't enough side margin around the content columns to place these
// without risking overlap, so simplest and safest is to not render them
// there at all (see the non-negotiable: decorations must never obscure
// text). ---

interface FieldItem {
  Glyph: (props: DecorProps) => ReactElement;
  top: string;
  left?: string;
  right?: string;
  size: string;
  opacity?: number;
}

// Positions are percentages of the body shell's total (very tall) height,
// so each item is pinned to land within a specific section's vertical
// range rather than drifting into whichever section the page happens to be
// long enough to reach. Two things kept them out of trouble in practice
// (see redesign report): (1) sizes and left/right offsets are kept small
// enough to stay inside the outer margin outside each section's centered
// max-width column, never the column itself where copy lives; (2) nothing
// is placed in the Skills section's vertical range (roughly 65%-88% of the
// body) at all, because its matter-js canvas paints with a transparent
// background (Skills.tsx `render.options.background`), so anything behind
// it — including a z-index:-1 decoration — shows through as a distracting
// glitch inside the interactive pile rather than sitting cleanly "behind"
// opaque content.
const ITEMS: FieldItem[] = [
  { Glyph: PixelCloud, top: '5%', left: '1%', size: '5.5rem', opacity: 0.5 },
  { Glyph: PixelCloud, top: '13%', right: '1.5%', size: '5rem', opacity: 0.35 },
  { Glyph: PixelFlower, top: '21%', left: '1%', size: '2.25rem' },
  { Glyph: PixelFlower, top: '30%', right: '1.5%', size: '2rem' },
  { Glyph: PixelTree, top: '38%', left: '1%', size: '3.75rem' },
  { Glyph: PixelCloud, top: '50%', right: '1.5%', size: '6rem', opacity: 0.4 },
  { Glyph: PixelFlower, top: '60%', left: '1.25%', size: '2.25rem' },
  { Glyph: PixelTree, top: '92%', right: '1.25%', size: '3.5rem' },
];

export function DecorField() {
  return (
    <div className={styles.field} aria-hidden="true">
      {ITEMS.map(({ Glyph, top, left, right, size, opacity }, i) => (
        <span
          key={i}
          className={styles.item}
          style={{ top, left, right, width: size, opacity }}
        >
          <Glyph className={styles.glyph} />
        </span>
      ))}
    </div>
  );
}
