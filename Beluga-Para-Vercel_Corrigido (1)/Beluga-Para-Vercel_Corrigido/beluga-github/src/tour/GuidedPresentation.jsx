import {
  Pause,
  Play,
  X,
  ArrowRight,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useTour } from "./TourContext";

export function GuidedPresentation() {
  const tour = useTour();
  return (
    <>
      <div className="tour-transition" aria-hidden="true">
        <i className="transition-block" />
        <i className="transition-block" />
        <i className="transition-block" />
        <span className="transition-word" />
      </div>
      {tour.active && (
        <aside className="tour-controls" aria-label="Controles da apresentação">
          <div className="tour-progress">
            <span className="tour-progress-fill" />
          </div>
          <div className="tour-description" aria-live="polite">
            <span className="tour-step">{tour.config.label}</span>
            <strong>{tour.config.title}</strong>
            <p>
              {tour.scanning ? "Identificando as peças…" : tour.config.detail}
            </p>
            {(tour.narrationStatus === "unavailable" ||
              tour.narrationStatus === "error") && (
              <small role="status">
                Leitura em voz indisponível. Você pode acompanhar pelo texto.
              </small>
            )}
          </div>
          <div className="tour-actions">
            <button
              type="button"
              onClick={tour.toggleNarration}
              disabled={!tour.narrationSupported || tour.audio}
              aria-label={
                tour.narrationEnabled ? "Desativar narração" : "Ativar narração"
              }
              aria-pressed={tour.narrationEnabled}
            >
              {tour.narrationEnabled ? <Volume2 /> : <VolumeX />}
            </button>
            <span className="tour-countdown" aria-hidden="true">
              {tour.config.duration ? `${tour.config.duration}s` : "Sua vez"}
            </span>
            <button
              type="button"
              onClick={tour.pause}
              className="tour-read-button"
              aria-label={
                tour.paused ? "Retomar apresentação" : "Pausar apresentação"
              }
            >
              {tour.paused ? <Play /> : <Pause />}
              <span className="tour-read-label">
                {tour.paused ? "Continuar" : "Ler com calma"}
              </span>
            </button>
            {tour.stage !== "demo" && (
              <button
                type="button"
                onClick={tour.next}
                disabled={tour.audio}
                aria-label="Próxima etapa"
              >
                <ArrowRight />
              </button>
            )}
            <button
              type="button"
              onClick={tour.exit}
              aria-label="Sair da apresentação"
            >
              <X />
            </button>
          </div>
          {tour.paused && (
            <small className="tour-pause-note">
              Sem pressa. Clique em Continuar quando terminar de ler.
            </small>
          )}
        </aside>
      )}
      {tour.stage === "complete" && (
        <aside className="tour-complete" aria-label="Apresentação concluída">
          <strong>Agora você conhece o Beluga.</strong>
          <span>Continue explorando no seu ritmo.</span>
          <button type="button" onClick={tour.start}>
            <RotateCcw /> Rever
          </button>
          <button
            type="button"
            onClick={tour.exit}
            aria-label="Fechar conclusão"
          >
            <X />
          </button>
        </aside>
      )}
    </>
  );
}
