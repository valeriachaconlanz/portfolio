import { describe, it, expect } from 'vitest';
import { formatClock } from '@/lib/clock';

describe('formatClock', () => {
  it('formats 30 minutes as 30:00', () => {
    expect(formatClock(1800)).toBe('30:00');
  });

  it('formats 10 seconds as 0:10', () => {
    expect(formatClock(10)).toBe('0:10');
  });

  it('pads seconds below ten', () => {
    expect(formatClock(65)).toBe('1:05');
  });

  it('floors fractional seconds', () => {
    expect(formatClock(10.9)).toBe('0:10');
  });

  it('never renders a negative clock', () => {
    expect(formatClock(-5)).toBe('0:00');
  });
});
