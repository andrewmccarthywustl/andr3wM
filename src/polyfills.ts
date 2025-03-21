// src/polyfills.ts
import "setimmediate";

// Add global for browser environments
if (typeof window !== "undefined") {
  (window as any).global = window;
}

/**
 * This file provides polyfills to ensure compatibility across different environments.
 *
 * - 'setimmediate' polyfill: Provides the setImmediate API for environments that don't support it natively
 * - window.global: Makes the 'global' variable available in browser environments (usually for libraries
 *   that expect a Node.js-like environment)
 */

export {};
