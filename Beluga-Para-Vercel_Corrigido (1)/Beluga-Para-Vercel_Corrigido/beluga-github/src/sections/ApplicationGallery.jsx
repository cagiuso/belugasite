import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, X, ZoomIn, ZoomOut } from "lucide-react";
import "../styles/gallery.css";

const base = `${import.meta.env.BASE_URL}media/`;
const screens = [
  { file: "reconhecimento", title: "Reconhecimento de peças", text: "A câmera identifica diferentes peças na mesma imagem.", alt: "Tela de câmera com caixas identificando uma chave de fenda de 15 cm, chaves Phillips de 19 e 21 cm e uma porca sextavada de 1 cm." },
  { file: "acesso", title: "Acesso ao sistema", text: "Identificação do usuário e acesso à aplicação.", alt: "Tela de acesso do Beluga com ID de usuário, ID de colaborador opcional e senha." },
  { file: "inicio", title: "Menu inicial", text: "As opções da rotina reunidas em uma única tela.", alt: "Menu com identificar item, histórico, cadastrar item, pesquisa, solicitar revisão e solicitar ajuda; atalhos de 1 a 6 e instruções por áudio com Enter." },
  { file: "historico", title: "Histórico de produtos", text: "Consulta dos movimentos registrados e seus horários.", alt: "Histórico com nome das peças, saída confirmada, horário, quantidade e botão de som em cada registro." },
  { file: "cadastro", title: "Cadastro de peças", text: "Lista de peças, quantidades e ações de edição.", alt: "Cadastro com botões cadastrar, pesquisar e exibir peças inativas; tabela de peças e ações editar e excluir." },
  { file: "pesquisa", title: "Pesquisa de produtos", text: "Consulta dos itens e das quantidades cadastradas.", alt: "Pesquisa de produtos com campo de busca e tabela de ID, nome, descrição e quantidade." },
];

export function ApplicationGallery() {
  const [selected, setSelected] = useState(null);
  const [zoomed, setZoomed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const dialogRef = useRef(null);
  const videoRef = useRef(null);
  const openerRef = useRef(null);
  useEffect(() => {
    if (selected !== null) {
      dialogRef.current.showModal();
      const overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = overflow; };
    }
  }, [selected !== null]);
  useEffect(() => {
    if (!playing) return;
    const video = videoRef.current;
    video?.play().catch(() => {});
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) video?.pause(); });
    if (video) observer.observe(video);
    return () => observer.disconnect();
  }, [playing]);
  useEffect(() => {
    const pause = () => { if (document.hidden) videoRef.current?.pause(); };
    document.addEventListener("visibilitychange", pause);
    return () => document.removeEventListener("visibilitychange", pause);
  }, []);
  const open = (index, event) => {
    openerRef.current = event.currentTarget;
    setZoomed(false);
    setSelected(index);
  };
  const close = () => {
    dialogRef.current.close();
    setSelected(null);
    setZoomed(false);
    openerRef.current?.focus({ preventScroll: true });
  };
  const step = (direction) => { setZoomed(false); setSelected(i => (i + direction + screens.length) % screens.length); };
  return (
    <section className="application-gallery section-space" id="aplicacao" aria-labelledby="application-title">
      <div className="page-width">
        <div className="section-top reveal"><span className="eyebrow">Por dentro do Beluga</span><span className="gallery-index">01 — 07</span></div>
        <div className="section-heading reveal">
          <h2 id="application-title" data-text-reveal>Da proposta<br /><span className="text-primary">à aplicação.</span></h2>
          <p>Conheça as telas do sistema e acompanhe uma gravação da aplicação em uso.</p>
        </div>
        <div className="gallery-label"><span>Explore as telas</span><span>Selecione para ampliar</span></div>
        <div className="application-grid reveal">
        <article className="gallery-film" aria-labelledby="film-title">
          <div className="gallery-film-media">
            {playing ? <video ref={videoRef} controls playsInline preload="none" poster={`${base}reconhecimento-preview.webp`} aria-label="Gravação da aplicação Beluga" aria-describedby="film-description" onError={() => setVideoError(true)}>
              <source src={`${base}beluga-demonstracao.mp4`} type="video/mp4" />Seu navegador não suporta vídeo. Use o link para baixar a gravação.
            </video> : <button className="gallery-play" onClick={() => setPlaying(true)} aria-label="Reproduzir gravação da aplicação Beluga, duração de 1 minuto e 33 segundos">
              <img src={`${base}reconhecimento-preview.webp`} width="960" height="474" loading="lazy" decoding="async" alt="Prévia da tela de reconhecimento do Beluga" />
              <span className="gallery-play-label"><Play size={22} fill="currentColor" aria-hidden="true" />Assistir à demonstração<span>01:33</span></span>
            </button>}
          </div>
          <div className="gallery-film-copy"><span className="eyebrow">Gravação da aplicação · sem áudio</span><h3 id="film-title">O Beluga em uso.</h3><p id="film-description">Veja a navegação e as telas da aplicação. Os cards abaixo apresentam cada área com uma descrição em texto.</p><a href={`${base}beluga-demonstracao.mp4`} download>Baixar vídeo <ArrowUpRight size={16} aria-hidden="true" /></a>{videoError && <p role="alert">Não foi possível reproduzir o vídeo. Você pode baixá-lo pelo link acima.</p>}</div>
        </article>
          {screens.map((screen, index) => <article className="screen-card" key={screen.file}>
            <button className="screen-open" onClick={event => open(index, event)} aria-label={`Ampliar: ${screen.title}`} aria-haspopup="dialog">
              <span className="screen-image"><img src={`${base}${screen.file}-preview.webp`} width="960" height="475" loading="lazy" decoding="async" alt={screen.alt} /><span className="screen-expand" aria-hidden="true"><ZoomIn size={18} /></span></span>
              <span className="screen-caption"><span className="screen-number">0{index + 1}</span><span><span className="screen-title">{screen.title}</span><span className="screen-description">{screen.text}</span></span><ArrowUpRight size={20} aria-hidden="true" /></span>
            </button>
          </article>)}
        </div>
      </div>
      <dialog ref={dialogRef} className="screen-dialog" aria-labelledby="screen-dialog-title" aria-describedby="screen-dialog-description" data-lenis-prevent onCancel={event => { event.preventDefault(); close(); }} onKeyDown={event => {
        if (event.target.tagName === "BUTTON") return;
        if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
      }}>
        {selected !== null && <>
          <div className="screen-dialog-header"><h3 id="screen-dialog-title">{screens[selected].title}</h3><button autoFocus onClick={close} aria-label="Fechar imagem"><X aria-hidden="true" /></button></div>
          <div className={`screen-dialog-image ${zoomed ? "is-zoomed" : ""}`} tabIndex="0" aria-label="Imagem ampliada; use as setas para trocar de tela">
            <img src={`${base}${screens[selected].file}.webp`} alt={screens[selected].alt} />
          </div>
          <p id="screen-dialog-description">{screens[selected].alt}</p>
          <div className="screen-dialog-controls"><button onClick={() => step(-1)} aria-label="Tela anterior"><ChevronLeft aria-hidden="true" /><span>Anterior</span></button><span aria-live="polite">{selected + 1} / {screens.length}</span><button onClick={() => setZoomed(v => !v)} aria-pressed={zoomed}>{zoomed ? <ZoomOut aria-hidden="true" /> : <ZoomIn aria-hidden="true" />}<span>{zoomed ? "Ajustar" : "Tamanho original"}</span></button><button onClick={() => step(1)} aria-label="Próxima tela"><span>Próxima</span><ChevronRight aria-hidden="true" /></button></div>
        </>}
      </dialog>
    </section>
  );
}
