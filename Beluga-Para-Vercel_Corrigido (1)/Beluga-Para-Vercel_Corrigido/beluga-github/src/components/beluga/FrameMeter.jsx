import { useEffect, useRef } from "react";
import { gsap } from "../../animations/gsapConfig";
// O medidor conta atualizações da animação, sem medir a renderização da GPU.

export function FrameMeter() {
  const meterRef = useRef(null);
  const showMeter = new URLSearchParams(location.search).get("fps") === "1";
  useEffect(() => {
    if (!showMeter) return;
    let sampleStart = performance.now();
    let frameCount = 0;
    const updateMeter = () => {
      const now = performance.now();
      if (document.hidden) {
        sampleStart = now;
        frameCount = 0;
        return;
      }
      frameCount++;
      if (now - sampleStart >= 1000) {
        meterRef.current.textContent = `${Math.round((frameCount * 1000) / (now - sampleStart))} atualizações/s · meta 60`;
        sampleStart = now;
        frameCount = 0;
      }
    };
    gsap.ticker.add(updateMeter);
    return () => gsap.ticker.remove(updateMeter);
  }, [showMeter]);
  return showMeter ? (
    <output className="frame-meter" ref={meterRef} aria-live="off">
      Medindo animações…
    </output>
  ) : null;
}
