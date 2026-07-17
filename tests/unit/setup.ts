import '@testing-library/jest-dom/vitest';

// jsdom does not implement IntersectionObserver. Provide a controllable mock
// so components that observe elements (e.g. Counter) can mount in tests
// without crashing, AND so tests can deterministically trigger intersection
// to exercise the code that runs once an element scrolls into view (e.g.
// Counter's count-up animation). A no-op stub would let that code path go
// completely untested — see triggerIntersection() below.
type IOEntry = Pick<IntersectionObserverEntry, 'isIntersecting' | 'target'>;
type IOCallback = (entries: IOEntry[], observer: IntersectionObserver) => void;

class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  readonly elements = new Set<Element>();

  constructor(private readonly callback: IOCallback) {
    MockIntersectionObserver.instances.push(this);
  }

  observe(el: Element) {
    this.elements.add(el);
  }
  unobserve(el: Element) {
    this.elements.delete(el);
  }
  disconnect() {
    this.elements.clear();
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  fire(isIntersecting: boolean) {
    this.callback(
      Array.from(this.elements).map((target) => ({ isIntersecting, target })),
      this,
    );
  }
}

globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

/**
 * Synchronously invokes the IntersectionObserver callback for whichever
 * mock observer instance is currently observing `target`, as if it had
 * just crossed the intersection threshold. Throws if nothing is observing
 * the element (usually means the component hasn't mounted its effect yet,
 * or `reduced` motion skipped creating an observer entirely).
 */
export function triggerIntersection(target: Element, isIntersecting = true) {
  for (let i = MockIntersectionObserver.instances.length - 1; i >= 0; i -= 1) {
    const instance = MockIntersectionObserver.instances[i];
    if (instance.elements.has(target)) {
      instance.fire(isIntersecting);
      return;
    }
  }
  throw new Error('triggerIntersection: no MockIntersectionObserver is observing the given element');
}
