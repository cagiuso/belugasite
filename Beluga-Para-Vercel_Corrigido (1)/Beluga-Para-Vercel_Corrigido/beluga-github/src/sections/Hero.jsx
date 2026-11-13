import { ArrowDown, ArrowUpRight, Play } from "lucide-react";
import { Button } from "../components/beluga/Button";
import { RollingLabel } from "../components/beluga/PresentationLinks";
import { LogoBackdrop3D } from "../components/beluga/LogoBackdrop3D/LogoBackdrop3D";
import { useTour } from "../tour/TourContext";

export function Hero({ motionPaused = false }) {
  const tour = useTour();
  return (
    <>
      <section id="inicio" className="hero">
        <div
          className="hero-depth-glow"
          data-parallax="-0.11"
          data-parallax-gain="1"
          data-parallax-limit="90"
          aria-hidden="true"
        />
        <LogoBackdrop3D paused={motionPaused} />
        <div className="hero-content page-width">
          <div className="hero-eyebrow">
            <span className="status-dot" /> Projeto acadêmico · 2026
          </div>
          <h1 aria-label="Beluga.">
            <span aria-hidden="true" className="hero-word">
              {Array.from("Beluga").map((letter, index) => (
                <span key={index}>{letter}</span>
              ))}
              <span className="text-primary">.</span>
            </span>
          </h1>
          <h2 data-text-reveal>
            Peças na câmera, <br />
            resultado por áudio<span className="text-primary">.</span>
          </h2>
          <p>
            O Beluga surge para promover a inclusão de funcionários com deficiência visual, auxiliando-os no processo de conferência de mercadorias.
          </p>
          <div className="hero-actions">
            <Button asChild className="main-cta">
              <a href="#projeto">
                <RollingLabel>Conheça o projeto</RollingLabel> <ArrowUpRight />
              </a>
            </Button>
            <button
              type="button"
              onClick={tour.start}
              className="video-link"
              aria-label="Veja como funciona — iniciar apresentação"
            >
              <span>
                <Play size={13} fill="currentColor" />
              </span>
              Veja como funciona
            </button>
          </div>
        </div>
        <div
          className="hero-caption"
          data-parallax="0.1"
          data-parallax-gain="1"
          data-parallax-limit="65"
        >
          <span className="caption-line" /> Detecção de peças
          <br />
          <span>em tempo real.</span>
        </div>
        <div className="hero-bottom page-width">
          <a href="#projeto">
            <ArrowDown size={16} /> Role para descobrir
          </a>
          <span>
            PROJETO CONCLUÍDO <span className="muted-slash">/</span> EM
            APRESENTAÇÃO
          </span>
        </div>
      </section>

      <div className="project-byline">
        <div className="page-width">
          <p>
            Um projeto de{" "}
            <strong>
              Eduarda Mazzari, Guilherme Hideki, Carlos Vicente e Henzo Montanari.
            </strong>
          </p>
          <a href="#equipe">
            Conheça a equipe <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </>
  );
}
