import { gsap } from "./gsapConfig";

export function parallax(root) {
  root.querySelectorAll("[data-parallax]").forEach((element) => {
    gsap.to(element, {
      y: () =>
        gsap.utils.clamp(
          -Number(element.dataset.parallaxLimit || 45),
          Number(element.dataset.parallaxLimit || 45),
          innerHeight *
            Number(element.dataset.parallax || 0.1) *
            Number(element.dataset.parallaxGain || 0.65),
        ),
      ease: "none",
      scrollTrigger: {
        trigger: element.closest("section"),
        start: "top top",
        end: "bottom top",
        scrub: Number(element.dataset.parallaxScrub || 0.9),
        invalidateOnRefresh: true,
      },
    });
  });
  root
    .querySelectorAll(".media-corners, .closing-section h2 > svg")
    .forEach((element) => {
      gsap.fromTo(
        element,
        {
          y: -10,
        },
        {
          y: 10,
          ease: "none",
          scrollTrigger: {
            trigger: element.closest("section"),
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        },
      );
    });
}
