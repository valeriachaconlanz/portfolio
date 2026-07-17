import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Counter } from '@/components/motion/Counter';

function mockReducedMotion(reduced: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduced && query.includes('reduce'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    onchange: null,
    dispatchEvent: vi.fn(),
  }));
}

describe('Counter', () => {
  beforeEach(() => vi.unstubAllGlobals());

  it('renders the final value immediately when motion is reduced', () => {
    mockReducedMotion(true);
    render(<Counter to={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('exposes the final value to assistive tech even while animating', () => {
    mockReducedMotion(false);
    render(<Counter to={180} />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', '180');
  });
});
