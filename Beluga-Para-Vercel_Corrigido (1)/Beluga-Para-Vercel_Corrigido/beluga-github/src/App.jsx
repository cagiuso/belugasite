import { useCallback, useRef, useState } from "react";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { Purpose } from "./sections/Purpose";
import { ApplicationGallery } from "./sections/ApplicationGallery";
import { Solution } from "./sections/Solution";
import { Journey } from "./sections/Journey";
import { Team } from "./sections/Team";
import { FAQ } from "./sections/FAQ";
import { Footer } from "./sections/Footer";
import { MotionLayers } from "./components/beluga/MotionLayers";
import { usePresentationMotion } from "./hooks/usePresentationMotion";
import { TourContext } from "./tour/TourContext";
import { GuidedPresentation } from "./tour/GuidedPresentation";
import { useGuidedTour } from "./tour/useGuidedTour";
export default function App() {
  const siteRef = useRef(null);
  const [animationsPaused, setAnimationsPaused] = useState(false);
  const presentation = useGuidedTour(siteRef, animationsPaused);
  const startPresentation = useCallback(() => {
    setAnimationsPaused(false);
    presentation.start();
  }, [presentation.start]);
  // Durante a apresentação, o tour assume a rolagem e as animações das seções.
  usePresentationMotion(siteRef, animationsPaused || presentation.active);
  return (
    <TourContext.Provider
      value={{
        ...presentation,
        start: startPresentation,
      }}
    >
      <div
        ref={siteRef}
        className="beluga-site"
        data-motion-paused={animationsPaused}
        data-tour-stage={presentation.stage}
        data-tour-paused={presentation.paused}
      >
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <MotionLayers paused={animationsPaused || presentation.paused} />
        <GuidedPresentation />
        <Header />
        <main id="conteudo">
          <Hero motionPaused={animationsPaused || presentation.paused} />
          <Purpose />
          <Solution />
          <ApplicationGallery />
          <Journey />
          <Team />
          <FAQ />
        </main>
        <Footer />
        {!presentation.active && (
          <button
            type="button"
            className="motion-toggle"
            aria-pressed={animationsPaused}
            onClick={() => setAnimationsPaused((value) => !value)}
          >
            {animationsPaused ? "Ativar animações" : "Pausar animações"}
          </button>
        )}
      </div>
    </TourContext.Provider>
  );
}
