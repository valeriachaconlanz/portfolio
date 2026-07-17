import '@testing-library/jest-dom/vitest';

// jsdom does not implement IntersectionObserver. Provide a minimal no-op
// stub so components that observe elements (e.g. Counter) can mount in
// tests without crashing; individual tests that need intersection
// callbacks to fire should mock this further as needed.
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
}
