import { gsap } from "./gsapConfig";
// A luz acompanha o mouse sem substituir o cursor do navegador.

export function pointerMotion(siteElement) {
  const backgroundLight = siteElement.querySelector(".spotlight");
  let targetX = innerWidth / 2;
  let targetY = innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  const setX = gsap.quickSetter(backgroundLight, "x", "px");
  const setY = gsap.quickSetter(backgroundLight, "y", "px");
  const updateLightPosition = (_, delta) => {
    const smoothing = 1 - Math.exp(-Math.min(delta, 60) / 75);
    currentX += (targetX - currentX) * smoothing;
    currentY += (targetY - currentY) * smoothing;
    setX(currentX);
    setY(currentY);
  };
  const handlePointerMove = (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
  };
  gsap.ticker.add(updateLightPosition);
  siteElement.addEventListener("pointermove", handlePointerMove, {
    passive: true,
  });
  return () => {
    gsap.ticker.remove(updateLightPosition);
    siteElement.removeEventListener("pointermove", handlePointerMove);
  };
}
