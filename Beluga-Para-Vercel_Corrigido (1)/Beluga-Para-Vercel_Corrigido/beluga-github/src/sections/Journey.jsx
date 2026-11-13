import { useState, useEffect } from "react";
import { useTour } from "../tour/TourContext";
import { Button } from "../components/beluga/Button";
import { journey } from "../config/originalContent";

export function Journey() {
  const [activeJourney, setActiveJourney] = useState(3);
  const tour = useTour();
  const selectJourney = (index) => {
    // A escolha manual interrompe o avanço automático sem encerrar o tour.
    if (tour?.active && !tour.paused) tour.pause();
    setActiveJourney(index);
  };
  useEffect(() => {
    const root = document.querySelector(".beluga-site");
    const update = (event) => setActiveJourney(event.detail.index);
    root.addEventListener("beluga:journey", update);
    return () => root.removeEventListener("beluga:journey", update);
  }, []);
  return (
    <>
      <section id="jornada" className="journey-section section-space">
        <div className="page-width">
          <div className="section-top reveal">
            <span className="eyebrow">Desenvolvimento</span>
          </div>
          <div className="section-heading reveal">
            <h2 data-text-reveal>
              Como o projeto <br />
              <span className="text-primary">chegou até aqui.</span>
            </h2>
            <p>
              Das primeiras ideias aos testes de câmera.
              <br />
              Veja o que fizemos em cada etapa.
            </p>
          </div>
          <div
            className="journey-tabs reveal"
            role="tablist"
            aria-label="Etapas do projeto"
          >
            {journey.map((item, index) => (
              <Button
                role="tab"
                tabIndex={activeJourney === index ? 0 : -1}
                onKeyDown={(event) => {
                  let next;
                  if (event.key === "ArrowRight")
                    next = (index + 1) % journey.length;
                  if (event.key === "ArrowLeft")
                    next = (index + journey.length - 1) % journey.length;
                  if (event.key === "Home") next = 0;
                  if (event.key === "End") next = journey.length - 1;
                  if (next !== undefined) {
                    event.preventDefault();
                    selectJourney(next);
                    document.getElementById(`journey-tab-${next}`)?.focus();
                  }
                }}
                aria-selected={activeJourney === index}
                aria-controls="journey-panel"
                id={`journey-tab-${index}`}
                variant="ghost"
                key={item.period}
                onClick={() => selectJourney(index)}
                className={
                  activeJourney === index ? "journey-tab active" : "journey-tab"
                }
              >
                <span className="journey-dot">
                  {`0${index + 1}`}
                </span>
                <span>
                  {item.period}
                  <small>2026</small>
                </span>
                <span className="journey-track" />
              </Button>
            ))}
          </div>
          <div
            id="journey-panel"
            role="tabpanel"
            aria-labelledby={`journey-tab-${activeJourney}`}
            className="journey-panel"
            key={activeJourney}
          >
            <span className="journey-large-number">0{activeJourney + 1}</span>
            <div>
              <span className="eyebrow">
                {journey[activeJourney]?.period} DE 2026
              </span>
              <h3>{journey[activeJourney]?.title}</h3>
              <p>{journey[activeJourney]?.text}</p>
              <div className="tag-list">
                {journey[activeJourney]?.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
