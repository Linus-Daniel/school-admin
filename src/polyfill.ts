/**
 * Safeguard for browser/iframe environments where window.fetch or globalThis.fetch
 * is configured with only a getter (read-only accessor).
 * This ensures that libraries or polyfills attempting to patch or reassign `fetch`
 * (e.g. `window.fetch = ...`) do not throw `TypeError: Cannot set property fetch of #<Window> which has only a getter`.
 */
try {
  const target = typeof window !== 'undefined' ? window : globalThis;
  const originalFetch = target.fetch ? target.fetch.bind(target) : undefined;
  let activeFetch = originalFetch;

  Object.defineProperty(target, 'fetch', {
    get() {
      return activeFetch || originalFetch;
    },
    set(newFetch) {
      activeFetch = newFetch;
    },
    configurable: true,
    enumerable: true,
  });
} catch {
  // If property is non-configurable, silently ignore
}
