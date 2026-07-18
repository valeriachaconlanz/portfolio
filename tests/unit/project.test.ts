import { describe, it, expect } from 'vitest';
import { projectCity } from '@/lib/project';

describe('projectCity', () => {
  it('places Seattle in the top-left', () => {
    const { x, y } = projectCity(47.6, -122.3);
    expect(x).toBeCloseTo(0.046, 2);
    expect(y).toBeCloseTo(0.092, 2);
  });

  it('places San Jose on the west coast, below Seattle', () => {
    const { x, y } = projectCity(37.3, -121.9);
    expect(x).toBeCloseTo(0.053, 2);
    expect(y).toBeCloseTo(0.488, 2);
  });

  it('places Miami in the bottom-right', () => {
    const { x, y } = projectCity(25.8, -80.2);
    expect(x).toBeCloseTo(0.759, 2);
    expect(y).toBeCloseTo(0.931, 2);
  });

  it('orders the west coast left of Miami', () => {
    expect(projectCity(47.6, -122.3).x).toBeLessThan(projectCity(25.8, -80.2).x);
  });

  it('clamps out-of-range coordinates into the unit square', () => {
    const { x, y } = projectCity(80, -160);
    expect(x).toBeGreaterThanOrEqual(0);
    expect(x).toBeLessThanOrEqual(1);
    expect(y).toBeGreaterThanOrEqual(0);
    expect(y).toBeLessThanOrEqual(1);
  });
});
