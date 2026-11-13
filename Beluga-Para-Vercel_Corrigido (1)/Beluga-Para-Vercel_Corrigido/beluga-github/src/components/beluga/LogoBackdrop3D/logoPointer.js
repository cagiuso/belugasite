// A posição é aplicada ao grupo inteiro, mantendo todas as partes da logo juntas.

export function createLogoPointer(heroElement) {
  const pointerPreference = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  );
  let enabled = true;
  let heroBounds = null;
  const targetPosition = {
    x: 0,
    y: 0,
  };
  const currentPosition = {
    x: 0,
    y: 0,
  };
  const resetPointer = () => {
    targetPosition.x = 0;
    targetPosition.y = 0;
    heroBounds = null;
  };
  const handlePointerMove = (event) => {
    if (
      !enabled ||
      !pointerPreference.matches ||
      (event.pointerType &&
        event.pointerType !== "mouse" &&
        event.pointerType !== "pen")
    )
      return;
    heroBounds ||= heroElement.getBoundingClientRect();
    if (!heroBounds.width || !heroBounds.height) return;
    targetPosition.x = Math.max(
      -1,
      Math.min(
        1,
        ((event.clientX - heroBounds.left) / heroBounds.width) * 2 - 1,
      ),
    );
    targetPosition.y = Math.max(
      -1,
      Math.min(
        1,
        ((event.clientY - heroBounds.top) / heroBounds.height) * 2 - 1,
      ),
    );
  };
  const clearCachedBounds = () => {
    heroBounds = null;
  };
  heroElement.addEventListener("pointermove", handlePointerMove, {
    passive: true,
  });
  heroElement.addEventListener("pointerleave", resetPointer);
  window.addEventListener("scroll", clearCachedBounds, {
    passive: true,
  });
  window.addEventListener("resize", clearCachedBounds);
  pointerPreference.addEventListener?.("change", resetPointer);
  return {
    update(deltaSeconds) {
      const smoothing = 1 - Math.exp(-6 * Math.min(deltaSeconds, 0.05));
      currentPosition.x += (targetPosition.x - currentPosition.x) * smoothing;
      currentPosition.y += (targetPosition.y - currentPosition.y) * smoothing;
      return currentPosition;
    },
    setEnabled(value) {
      enabled = value;
      if (!value) {
        resetPointer();
        currentPosition.x = 0;
        currentPosition.y = 0;
      }
    },
    dispose() {
      heroElement.removeEventListener("pointermove", handlePointerMove);
      heroElement.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("scroll", clearCachedBounds);
      window.removeEventListener("resize", clearCachedBounds);
      pointerPreference.removeEventListener?.("change", resetPointer);
    },
  };
}
