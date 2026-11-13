import { ArrowRight, Camera, ScanLine, Volume2 } from "lucide-react";
import { RecognitionDemo } from "../components/beluga/RecognitionDemo";
import { features } from "../config/originalContent";

export function Solution() {
  return (
    <>
      <section id="solucao" className="solution-section section-space">
        <div className="page-width">
          <div className="section-top reveal">
            <span className="eyebrow">Como funciona</span>
          </div>
          <div className="section-heading reveal">
            <h2 data-text-reveal>
              Da câmera <br />
              <span className="text-primary">para o áudio.</span>
            </h2>
            <p>
              Você apresenta as peças, o sistema faz a conferência <br />e lê o
              resultado em voz alta.
            </p>
          </div>
          <div className="process-steps reveal">
            {[
              {
                icon: Camera,
                label: "A câmera captura",
                desc: "A peça é apresentada ao sistema.",
              },
              {
                icon: ScanLine,
                label: "O Beluga reconhece",
                desc: "O modelo identifica e conta os itens.",
              },
              {
                icon: Volume2,
                label: "Você ouve",
                desc: "As informações chegam em áudio.",
              },
            ].map((step, index) => (
              <div key={step.label}>
                <span className="step-icon">
                  <step.icon size={22} />
                </span>
                <span className="step-number">0{index + 1}</span>
                <h3>{step.label}</h3>
                <p>{step.desc}</p>
                {index < 2 && <ArrowRight className="step-arrow" size={18} />}
              </div>
            ))}
          </div>
          <div id="demonstracao" className="reveal">
            <RecognitionDemo />
          </div>
          <div className="features-header reveal" id="capacidades">
            <h3>O que entra nessa rotina.</h3>
            <span>Recursos do sistema</span>
          </div>
          <div className="feature-grid reveal">
            {features.map((feature) => (
              <article key={feature.name}>
                <feature.icon size={24} strokeWidth={1.5} />
                <h4>{feature.name}</h4>
                <p>{feature.highlight ? <>
                  {feature.text.split(feature.highlight)[0]}<strong>{feature.highlight}</strong>{feature.text.split(feature.highlight)[1]}
                </> : feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
