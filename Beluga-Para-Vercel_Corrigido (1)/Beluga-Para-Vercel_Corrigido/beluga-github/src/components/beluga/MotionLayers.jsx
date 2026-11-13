import { FrameMeter } from "./FrameMeter";
import { ParticleField } from "./ParticleField";

export function MotionLayers({ paused = false }) {
  return (
    <>
      <ParticleField paused={paused} />
      <FrameMeter />
      <div className="scroll-progress" aria-hidden="true" />
      <div className="spotlight" aria-hidden="true" />
      <div className="page-curtain" aria-hidden="true">
        <span>beluga.</span>
      </div>
    </>
  );
}
