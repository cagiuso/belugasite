import { prefersLightMotion } from "./motionBudget";
import SplitType from "split-type";
import { gsap } from "./gsapConfig";

export function textReveal(siteElement) {
  const restoreTextCallbacks = [];
  siteElement.querySelectorAll("[data-text-reveal]").forEach((element) => {
    const previousLabel = element.getAttribute("aria-label");
    const accessibleText = element.textContent;
    const splitText = new SplitType(element, {
      types: "words",
      tagName: "span",
    });
    element.setAttribute("aria-label", accessibleText);
    splitText.words.forEach((word) => word.setAttribute("aria-hidden", "true"));
    gsap.from(splitText.words, {
      yPercent: prefersLightMotion() ? 25 : 65,
      opacity: 0,
      duration: 0.5,
      stagger: {
        amount: 0.18,
      },
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 91%",
        once: true,
      },
    });
    restoreTextCallbacks.push(() => {
      splitText.revert();
      if (previousLabel === null) element.removeAttribute("aria-label");
      else element.setAttribute("aria-label", previousLabel);
    });
  });
  return () => restoreTextCallbacks.reverse().forEach((revert) => revert());
}
