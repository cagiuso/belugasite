import { ArrowUpRight } from "lucide-react";
import { AccessibilityTools } from "../accessibility/AccessibilityTools";
const logo = {
  url: `${import.meta.env.BASE_URL}images/beluga-logo.png`,
};

export function Footer() {
  return (
    <>
      <section className="closing-section" id="encerramento">
        <div className="page-width reveal">
          <span className="eyebrow">Beluga · Projeto concluído</span>
          <h2 data-text-reveal>
            Obrigado por conhecer <br />
            <span>o nosso projeto.</span>
          </h2>
          <div className="closing-bottom">
            <p>
              Somos Eduarda Mazzari, Guilherme Hideki, Carlos Vicente e Henzo
              Montanari. Aqui reunimos o que desenvolvemos e aprendemos.
            </p>
          </div>
        </div>
      </section>

      <footer className="site-footer page-width">
        <a href="#inicio" className="brand">
          <img src={logo.url} alt="" width="36" height="36" />
          <span>
            beluga<span className="brand-period">.</span>
          </span>
        </a>
        <span>© 2026 Projeto Beluga · Projeto acadêmico</span>
        <a href="#inicio">
          Voltar ao topo <ArrowUpRight size={16} />
        </a>
      </footer>
      <AccessibilityTools />
    </>
  );
}
