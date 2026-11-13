import { useState } from "react";
import { Button } from "../components/beluga/Button";

export function FAQ() {
  const [faq, setFaq] = useState(0);
  return (
    <>
      <section className="faq-section section-space">
        <div className="page-width faq-grid">
          <div className="reveal">
            <span className="eyebrow">Dúvidas sobre o projeto</span>
            <h2 data-text-reveal>Ficou alguma dúvida?</h2>
            <p>Sobre o reconhecimento, a proposta e a apresentação.</p>
          </div>
          <div className="faq-list reveal">
            {[
              {
                question: "Para quem o Beluga foi desenvolvido?",
                answer:
                  "Para apoiar pessoas com deficiência visual na identificação e conferência de peças do almoxarifado industrial. Foi nessa rotina que concentramos o projeto.",
              },
              {
                question: "Como funciona o reconhecimento de objetos?",
                answer:
                  "A câmera captura as peças. Um modelo treinado para os objetos do projeto identifica e conta o que aparece, e o sistema lê as informações por áudio. A detecção acontece em tempo real.",
              },
              {
                question: "Em que fase está o projeto?",
                answer:
                  "O Beluga está concluído e em fase de apresentação. O projeto identifica e conta peças em tempo real e informa os resultados por áudio. A demonstração nesta página é ilustrativa: não acessa a câmera nem executa o reconhecimento real.",
              },
            ].map((item, index) => (
              <div
                className={`faq-item ${faq === index ? "open" : ""}`}
                key={item.question}
              >
                <Button
                  variant="ghost"
                  className="faq-question"
                  onClick={() => setFaq(faq === index ? null : index)}
                  aria-expanded={faq === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  {item.question}
                  <span aria-hidden="true">+</span>
                </Button>
                <div
                  id={`faq-answer-${index}`}
                  className="faq-answer"
                  inert={faq !== index ? "" : undefined}
                  aria-hidden={faq !== index}
                >
                  <div>
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
