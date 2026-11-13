import { gsap } from "./gsapConfig";

export function svgReveal(root) {
  root.querySelectorAll(".section-top").forEach((section) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 1000 2");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("section-line");
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", "M0 1 H1000");
    path.setAttribute("pathLength", "1");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.style.strokeDasharray = "1";
    path.style.strokeDashoffset = "1";
    svg.append(path);
    section.append(svg);
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 0.85,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: section,
        start: "top 92%",
        once: true,
      },
    });
  });
  return () =>
    root.querySelectorAll(".section-line").forEach((svg) => svg.remove());
}
