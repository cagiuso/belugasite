// Conservative hints, not a benchmark. Unknown hardware keeps the lighter path.
export function prefersLightMotion() {
  return window.matchMedia("(max-width: 1024px), (pointer: coarse), (prefers-reduced-motion: reduce)").matches ||
    navigator.connection?.saveData === true ||
    !navigator.deviceMemory || navigator.deviceMemory <= 8 ||
    (navigator.hardwareConcurrency || 2) <= 4;
}
