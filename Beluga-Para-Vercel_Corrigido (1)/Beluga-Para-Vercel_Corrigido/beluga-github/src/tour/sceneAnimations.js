import { gsap } from "../animations/gsapConfig";
import { contentScrollTop } from "./scrollPosition";
function emitSceneParticles(siteElement, sceneElement, count = 6) {
  const bounds = sceneElement?.getBoundingClientRect();
  if (bounds)
    siteElement.dispatchEvent(
      new CustomEvent("beluga:burst", {
        detail: {
          x: bounds.left + bounds.width / 2,
          y: bounds.top + bounds.height / 2,
          count,
        },
      }),
    );
}

export function animateTourScene(siteElement, stage, sceneTimeline, reduced) {
  const sceneElement = siteElement.querySelector(`[data-tour-active-scene]`);
  if (!sceneElement) return;
  if (reduced) return;
  if (stage === "purpose") {
    const titleLetters = sceneElement.querySelectorAll(".tour-char");
    sceneTimeline.fromTo(
      titleLetters,
      {
        yPercent: 110,
        opacity: 0,
      },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.6,
        stagger: {
          amount: 0.65,
        },
        ease: "power3.out",
      },
      0.05,
    );
    sceneTimeline.fromTo(
      sceneElement.querySelector(".purpose-copy"),
      {
        y: 12,
        opacity: 0.7,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      },
      0.1,
    );
    sceneTimeline.fromTo(
      sceneElement.querySelectorAll(".problem-grid article"),
      {
        y: 16,
        opacity: 0.5,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: "power3.out",
      },
      0.2,
    );
    sceneTimeline.fromTo(
      sceneElement.querySelector(".purpose-title .text-primary"),
      {
        color: "#f3f4f6",
      },
      {
        color: "#7cddbf",
        duration: 0.8,
      },
      0.5,
    );
    if (innerWidth <= 760)
      sceneTimeline.to(
        window,
        {
          scrollTo: {
            y: sceneElement.querySelector(".purpose-copy"),
            offsetY: 60,
            autoKill: true,
          },
          duration: 0.9,
          ease: "power3.inOut",
        },
        4,
      );
    sceneTimeline.to(
      window,
      {
        scrollTo: {
          y: () =>
            contentScrollTop(
              sceneElement.querySelector(".problem-grid"),
              sceneElement.querySelector(".page-width"),
              innerWidth <= 760 ? 40 : 100,
            ),
          autoKill: true,
        },
        duration: 0.9,
        ease: "power3.inOut",
      },
      innerWidth <= 760 ? 16 : 11,
    );
    if (innerWidth <= 760)
      sceneTimeline.to(
        window,
        {
          scrollTo: {
            y: () =>
              contentScrollTop(
                sceneElement.querySelector("#porque-beluga"),
                sceneElement.querySelector(".page-width"),
                65,
              ),
            autoKill: true,
          },
          duration: 0.85,
          ease: "power3.inOut",
        },
        25,
      );
  } else if (stage === "demo") {
    sceneTimeline.fromTo(
      sceneElement.querySelectorAll(".scan-object"),
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1.1,
        stagger: 0.18,
        ease: "power3.out",
      },
    );
  } else if (stage === "result") {
    sceneTimeline.fromTo(
      sceneElement.querySelectorAll(".result-list > div"),
      {
        x: 24,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.25,
      },
      0.1,
    );
    sceneTimeline.fromTo(
      sceneElement.querySelectorAll(".result-list strong"),
      {
        scale: 1.1,
      },
      {
        scale: 1,
        duration: 0.9,
        stagger: 0.2,
        ease: "power3.out",
      },
      0.3,
    );
    sceneTimeline.call(
      () =>
        emitSceneParticles(
          siteElement,
          sceneElement.querySelector(".result-list"),
          8,
        ),
      [],
      0.6,
    );
  } else if (stage === "features") {
    const featureCards = siteElement.querySelectorAll(".feature-grid article");
    sceneTimeline.fromTo(
      featureCards,
      {
        opacity: 0.6,
        y: 16,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.06,
        ease: "power3.out",
      },
      0.1,
    );
    if (innerWidth <= 760 || innerHeight < 900)
      sceneTimeline.to(
        window,
        {
          scrollTo: {
            y: () =>
              contentScrollTop(
                innerWidth <= 760 ? featureCards[3] : featureCards[4],
                siteElement.querySelector(".feature-grid"),
                70,
              ),
            autoKill: true,
          },
          duration: 0.9,
          ease: "power3.inOut",
        },
        15,
      );
    featureCards.forEach((card, index) => {
      sceneTimeline.to(
        card,
        {
          backgroundColor: "#1f4d51",
          duration: 0.8,
        },
        index * 3.7 + 0.5,
      );
      sceneTimeline.to(
        card,
        {
          backgroundColor: "transparent",
          duration: 1,
        },
        index * 3.7 + 2.9,
      );
    });
  } else if (stage === "journey") {
    [0, 1, 2, 3].forEach((index) =>
      sceneTimeline.call(
        () =>
          siteElement.dispatchEvent(
            new CustomEvent("beluga:journey", {
              detail: {
                index,
              },
            }),
          ),
        [],
        index * 9,
      ),
    );
  } else if (stage === "final") {
    sceneTimeline.fromTo(
      sceneElement.querySelector("h2"),
      {
        y: 18,
        opacity: 0.4,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: "power3.out",
      },
      0.2,
    );
    sceneTimeline.call(
      () =>
        emitSceneParticles(siteElement, sceneElement.querySelector("h2"), 6),
      [],
      1.5,
    );
  }
}

export function transitionToScene(
  siteElement,
  sceneElement,
  type,
  reduced,
  onSceneReady,
) {
  const overlay = siteElement.querySelector(".tour-transition");
  const transitionBlocks = overlay.querySelectorAll(".transition-block");
  const transitionLabel = overlay.querySelector(".transition-word");
  const sceneTimeline = gsap.timeline({
    id: "beluga-tour-transition",
    onComplete: onSceneReady,
  });
  const scroll = () => {
    const scrollTarget =
      sceneElement.id === "demonstracao" && innerWidth <= 760
        ? sceneElement.querySelector(".demo-result") || sceneElement
        : sceneElement.id === "jornada"
          ? sceneElement.querySelector(".journey-tabs") || sceneElement
          : sceneElement;
    const bounds = scrollTarget.getBoundingClientRect();
    const offset = Math.max(12, innerWidth <= 760 ? 24 : 60);
    const top = Math.max(0, bounds.top + window.scrollY - offset);
    window.scrollTo({
      top,
      behavior: "instant",
    });
    if (sceneElement.id)
      history.replaceState(history.state, "", `#${sceneElement.id}`);
    const focusable = sceneElement.querySelector("h2,h3") || sceneElement;
    const previous = focusable.getAttribute("tabindex");
    focusable.setAttribute("tabindex", "-1");
    focusable.focus({
      preventScroll: true,
    });
    if (previous === null) focusable.removeAttribute("tabindex");
    else focusable.setAttribute("tabindex", previous);
  };
  if (reduced) {
    sceneTimeline.call(scroll);
    return sceneTimeline;
  }
  overlay.dataset.transition = type;
  sceneTimeline
    .set(overlay, {
      visibility: "visible",
      opacity: 1,
      clipPath: "none",
      yPercent: 0,
    })
    .set(transitionLabel, {
      opacity: 0,
      y: 16,
    })
    .set(transitionBlocks, {
      xPercent: 0,
      yPercent: 0,
      scaleY: 1,
    });
  if (type === "circle") {
    sceneTimeline.fromTo(
      overlay,
      {
        clipPath: "circle(0% at 50% 65%)",
      },
      {
        clipPath: "circle(150% at 50% 65%)",
        duration: 0.5,
        ease: "power3.inOut",
      },
    );
  } else if (type === "dissolve") {
    sceneTimeline.fromTo(
      overlay,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.5,
      },
    );
  } else if (type === "slide") {
    sceneTimeline.fromTo(
      overlay,
      {
        yPercent: 100,
      },
      {
        yPercent: 0,
        duration: 0.5,
        ease: "power4.inOut",
      },
    );
  } else {
    sceneTimeline.fromTo(
      transitionBlocks,
      {
        yPercent: 105,
      },
      {
        yPercent: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: "power4.inOut",
      },
    );
  }
  sceneTimeline
    .to(
      transitionLabel,
      {
        opacity: 1,
        y: 0,
        duration: 0.22,
      },
      "<.12",
    )
    .call(scroll)
    .to(
      transitionLabel,
      {
        opacity: 0,
        y: -12,
        duration: 0.18,
      },
      "+=.05",
    );
  if (type === "circle")
    sceneTimeline.to(overlay, {
      clipPath: "circle(0% at 50% 25%)",
      duration: 0.5,
      ease: "power3.inOut",
    });
  else if (type === "dissolve")
    sceneTimeline.to(overlay, {
      opacity: 0,
      duration: 0.6,
    });
  else
    sceneTimeline.to(transitionBlocks, {
      yPercent: -105,
      duration: 0.5,
      stagger: 0.04,
      ease: "power4.inOut",
    });
  sceneTimeline.set(overlay, {
    visibility: "hidden",
  });
  return sceneTimeline;
}
