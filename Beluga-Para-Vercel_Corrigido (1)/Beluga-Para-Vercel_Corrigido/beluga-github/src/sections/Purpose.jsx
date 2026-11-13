import { ArrowDownRight } from "lucide-react";
import { RollingLabel } from "../components/beluga/PresentationLinks";
import { AnimatedPurposeTitle } from "../tour/AnimatedPurposeTitle";

export function Purpose() {
  return (
    <>
      <section id="projeto" className="project-section section-space">
        <div className="page-width">
          <div className="section-top reveal">
            <span className="eyebrow">O projeto</span>
          </div>
          <div className="purpose-grid reveal">
            <AnimatedPurposeTitle />
            <div className="purpose-copy">
              <p>
                Peças parecidas, tamanhos diferentes e uma conferência em tempo
                real.
              </p>
              <p>
                Escolhemos trabalhar com a rotina do almoxarifado. O Beluga usa
                a câmera para identificar e contar as peças, e lê o resultado em
                voz alta para apoiar pessoas com deficiência visual.
              </p>
              <a href="#demonstracao" className="text-link">
                <RollingLabel>Veja a demonstração</RollingLabel>{" "}
                <ArrowDownRight size={18} />
              </a>
            </div>
          </div>
          <div
            className="problem-grid"
            aria-label="O problema e a escolha do projeto"
          >
            {[
              {
                number: "01",
                title: "O desafio",
                text: "Distinguir peças parecidas, pequenas e grandes em tempo real exige um reconhecimento confiável.",
              },
              {
                number: "02",
                title: "Nossa resposta",
                text: "Identificar e contar pela câmera, depois ouvir o resultado.",
              },
              {
                number: "03",
                title: "Por que escolhemos este projeto",
                text: "Fizemos a aplicação para apoiar a autonomia de pessoas com deficiência visual em tarefas no âmbito do almoxarifado, nas conferências de objetos em diferentes ambientes.",
              },
            ].map((item) => (
              <article
                key={item.number}
                id={item.number === "03" ? "porque-beluga" : undefined}
              >
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <aside className="project-learning" aria-labelledby="learning-title">
            <span id="learning-title">Do desenvolvimento</span>
            <p>
              <strong>A confiabilidade da detecção deu trabalho.</strong> Também
              tivemos dificuldades nas escolhas de tecnologia, principalmente
              com o YOLO, um modelo de visão computacional que localiza e
              identifica objetos nas imagens em tempo real. Ajustar esse modelo
              para reconhecer as peças com confiança foi um dos desafios do
              projeto.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
