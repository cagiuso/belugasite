import { gsap } from "./gsapConfig";

export function ambientMotion(root) {
  gsap.from(root.querySelectorAll(".purpose-title .tour-char"), {
    yPercent: 100,
    opacity: 0,
    duration: 0.55,
    stagger: {
      amount: 0.45,
    },
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".purpose-title",
      start: "top 90%",
      once: true,
    },
  });
  root
    .querySelectorAll(
      ".feature-grid article > svg:first-child,.problem-card-top svg",
    )
    .forEach((icon) => {
      gsap.from(icon, {
        scale: 0.9,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: icon,
          start: "top 92%",
          once: true,
        },
      });
    });
}
