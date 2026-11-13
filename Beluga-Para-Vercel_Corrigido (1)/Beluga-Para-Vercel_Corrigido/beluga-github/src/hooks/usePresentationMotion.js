import { prefersLightMotion } from "../animations/motionBudget";
import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "../animations/gsapConfig";
import { useReducedMotion } from "./useReducedMotion";
import { createSmoothScroll } from "./useLenis";
import { textReveal } from "../animations/textReveal";
import { parallax } from "../animations/parallax";
import { ambientMotion } from "../animations/ambientMotion";
import { svgReveal } from "../animations/svgReveal";
import { pointerMotion } from "../animations/pointerMotion";

export function usePresentationMotion(siteRef, paused) {
  const prefersReducedMotion = useReducedMotion();
  useLayoutEffect(() => {
    const siteElement = siteRef.current;
    if (!siteElement) return;
    const lightMotion = prefersLightMotion();
    siteElement.dataset.lightMotion = String(lightMotion);
    if (prefersReducedMotion || paused) {
      siteElement.classList.remove("motion-enabled");
      return;
    }
    siteElement.classList.add("motion-enabled");
    const cleanupCallbacks = [];
    const mediaQueries = gsap.matchMedia();
    const animationContext = gsap.context(() => {
      if (!prefersLightMotion()) cleanupCallbacks.push(createSmoothScroll(siteElement));
      if (window.scrollY < 120) {
        const introCurtain = siteElement.querySelector(".page-curtain");
        gsap
          .timeline()
          .set(introCurtain, {
            visibility: "visible",
            yPercent: 0,
          })
          .to(introCurtain.querySelector("span"), {
            opacity: 0,
            y: -25,
            duration: 0.35,
            delay: 0.05,
          })
          .to(
            introCurtain,
            {
              yPercent: -100,
              duration: 0.6,
              ease: "power4.inOut",
            },
            "-=.1",
          )
          .set(introCurtain, {
            visibility: "hidden",
          });
        gsap.from(".hero-word > span", {
          yPercent: 110,
          opacity: 0,
          duration: 0.8,
          stagger: 0.025,
          ease: "power4.out",
          delay: 0.3,
        });
        gsap.from(".hero-eyebrow, .hero-content > p, .hero-actions", {
          y: 25,
          opacity: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          delay: 0.45,
        });
      }
      siteElement.querySelectorAll(".reveal").forEach((element) => {
        // Os títulos têm animação própria; aqui entram os textos de apoio.
        if (element.matches(".section-heading, .purpose-grid")) {
          gsap.from(
            element.querySelectorAll(".section-heading > p, .purpose-copy"),
            {
              y: 12,
              opacity: 0.7,
              duration: 0.5,
              scrollTrigger: {
                trigger: element,
                start: "top 90%",
                once: true,
              },
            },
          );
        } else if (
          element.matches(
            ".problem-grid, .feature-grid, .team-grid, .process-steps, .application-grid",
          )
        ) {
          gsap.from(element.children, {
            y: lightMotion ? 10 : 18,
            opacity: 0,
            duration: lightMotion ? 0.4 : 0.55,
            stagger: 0.045,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 89%",
              once: true,
            },
          });
        } else {
          gsap.from(element, {
            y: 25,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 92%",
              once: true,
            },
          });
        }
      });
      // Os cards continuam legíveis antes de a animação começar.
      gsap.from(siteElement.querySelectorAll(".problem-grid article"), {
        y: 16,
        opacity: 0.8,
        duration: 0.55,
        stagger: 0.06,
        scrollTrigger: {
          trigger: siteElement.querySelector(".problem-grid"),
          start: "top 92%",
          once: true,
        },
      });
      ambientMotion(siteElement);
      cleanupCallbacks.push(textReveal(siteElement));
      cleanupCallbacks.push(svgReveal(siteElement));
      gsap.to(siteElement.querySelector(".scroll-progress"), {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: siteElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.2,
        },
      });
      mediaQueries.add("(min-width: 761px)", () => {
        if (!prefersLightMotion()) parallax(siteElement);
      });
      mediaQueries.add("(hover: hover) and (pointer: fine)", () =>
        prefersLightMotion() ? undefined : pointerMotion(siteElement),
      );
    }, siteElement);
    let isMounted = true;
    document.fonts?.ready.then(() => {
      if (isMounted) ScrollTrigger.refresh();
    });
    const refreshScrollPositions = () => ScrollTrigger.refresh();
    window.addEventListener("load", refreshScrollPositions, {
      once: true,
    });
    return () => {
      isMounted = false;
      window.removeEventListener("load", refreshScrollPositions);
      mediaQueries.revert();
      animationContext.revert();
      cleanupCallbacks.reverse().forEach((clean) => clean());
      siteElement.classList.remove("motion-enabled");
    };
  }, [siteRef, paused, prefersReducedMotion]);
}
