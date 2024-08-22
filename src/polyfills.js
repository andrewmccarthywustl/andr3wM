// src/polyfills.js
import "setimmediate";

if (typeof window !== "undefined") {
  window.global = window;
}
