import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../animations/gsapConfig";
// A rolagem usa o mesmo ciclo do GSAP para não criar outro loop de animação.

export function createSmoothScroll(siteElement) {
  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.085,
    smoothWheel: true,
    syncTouch: false,
  });
  lenis.on("scroll", ScrollTrigger.update);
  const updateSmoothScroll = (seconds) => lenis.raf(seconds * 1000);
  gsap.ticker.add(updateSmoothScroll);
  const handleAnchorClick = (event) => {
    const link = event.target.closest?.('a[href^="#"]');
    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.target ||
      link.hasAttribute("download")
    )
      return;
    let targetSection;
    try {
      targetSection = document.getElementById(
        decodeURIComponent(link.hash.slice(1)),
      );
    } catch {
      return;
    }
    if (!targetSection) return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, "", link.hash);
    lenis.scrollTo(targetSection, {
      offset: -110,
      duration: 1.25,
      onComplete: () => {
        const previousTabIndex = targetSection.getAttribute("tabindex");
        if (previousTabIndex === null)
          targetSection.setAttribute("tabindex", "-1");
        targetSection.focus({
          preventScroll: true,
        });
        if (previousTabIndex === null)
          targetSection.removeAttribute("tabindex");
      },
    });
  };
  // O navegador continua cuidando da posição ao voltar ou avançar no histórico.
  // A âncora inicial só é aplicada quando a página ainda está no topo.
  if (location.hash && window.scrollY < 1) {
    try {
      const initialSection = document.getElementById(
        decodeURIComponent(location.hash.slice(1)),
      );
      if (initialSection)
        lenis.scrollTo(initialSection, {
          offset: -110,
          immediate: true,
        });
    } catch {
      /* Âncoras inválidas ficam a cargo do navegador. */
    }
  }
  siteElement.addEventListener("click", handleAnchorClick);
  return () => {
    gsap.ticker.remove(updateSmoothScroll);
    siteElement.removeEventListener("click", handleAnchorClick);
    lenis.destroy();
  };
}
