import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { gsap } from "../animations/gsapConfig";
import { useReducedMotion } from "../hooks/useReducedMotion";
import {
  getTourScene,
  initialTourState,
  tourReducer,
  tourScenes,
} from "./tourConfig";
import { animateTourScene, transitionToScene } from "./sceneAnimations";
import { useTourNarration } from "./useTourNarration";

export function useGuidedTour(siteRef, animationsPaused) {
  const [tourState, dispatchTour] = useReducer(tourReducer, initialTourState);
  const [pageHidden, setPageHidden] = useState(document.hidden);
  const [transitioning, setTransitioning] = useState(false);
  const reduced = useReducedMotion();
  const narration = useTourNarration();
  const narratorRef = useRef(narration);
  narratorRef.current = narration;
  const narratedStage = useRef(null);
  const waitingForVoice = useRef(false);
  const sceneTimeline = useRef(null);
  const transitionTimeline = useRef(null);
  const lastSceneTarget = useRef(null);
  const latestTourState = useRef(null);
  const sceneConfig = useMemo(
    () => getTourScene(tourState.stage, innerWidth),
    [tourState.stage],
  );
  const isTourActive =
    tourState.stage !== "idle" && tourState.stage !== "complete";
  const isSuspended =
    tourState.paused || animationsPaused || pageHidden || tourState.audio;
  latestTourState.current = {
    suspended: isSuspended,
    state: tourState,
  };
  useEffect(() => {
    const updatePageVisibility = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", updatePageVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updatePageVisibility);
  }, []);
  // Cada etapa tem sua timeline, descartada quando a apresentação muda de cena.
  useLayoutEffect(() => {
    const siteElement = siteRef.current;
    if (!siteElement || !isTourActive) {
      lastSceneTarget.current = null;
      return;
    }
    const scene = sceneConfig;
    const target = siteElement.querySelector(scene.target);
    if (!target) {
      dispatchTour({
        type: "EXIT",
      });
      return;
    }
    let disposed = false;
    let sceneContext;
    siteElement
      .querySelectorAll("[data-tour-active-scene]")
      .forEach((node) => node.removeAttribute("data-tour-active-scene"));
    target.setAttribute("data-tour-active-scene", "");
    const progressBar = siteElement.querySelector(".tour-progress-fill");
    const countdownLabel = siteElement.querySelector(".tour-countdown");
    gsap.set(progressBar, {
      scaleX: 0,
    });
    const startScene = () => {
      if (disposed) return;
      setTransitioning(false);
      if (narratedStage.current !== tourState.stage) {
        narratedStage.current = tourState.stage;
        narratorRef.current.speak(scene.narration);
        narratorRef.current.setPaused(latestTourState.current.suspended);
      }
      sceneContext = gsap.context(() => {
        const elapsedTime = {
          time: 0,
        };
        const setProgress = gsap.quickSetter(progressBar, "scaleX");
        let lastDisplayedSecond = -1;
        const timeline = gsap.timeline({
          id: `beluga-scene-${tourState.stage}`,
          paused: latestTourState.current.suspended,
          onComplete: () => {
            if (scene.duration) {
              if (narratorRef.current.isSpeaking())
                waitingForVoice.current = true;
              else
                dispatchTour({
                  type: "NEXT",
                });
            }
          },
        });
        sceneTimeline.current = timeline;
        if (scene.duration) {
          timeline.to(
            elapsedTime,
            {
              time: scene.duration,
              duration: scene.duration,
              ease: "none",
              onUpdate: () => {
                setProgress(elapsedTime.time / scene.duration);
                const remaining = Math.ceil(scene.duration - elapsedTime.time);
                if (remaining !== lastDisplayedSecond && countdownLabel) {
                  countdownLabel.textContent = `${remaining}s`;
                  lastDisplayedSecond = remaining;
                }
              },
            },
            0,
          );
        } else if (countdownLabel) countdownLabel.textContent = "Sua vez";
        animateTourScene(siteElement, tourState.stage, timeline, reduced);
      }, siteElement);
    };
    const overlayWord = siteElement.querySelector(".transition-word");
    if (overlayWord) overlayWord.textContent = scene.title;
    if (lastSceneTarget.current === scene.target) startScene();
    else {
      setTransitioning(true);
      transitionTimeline.current = transitionToScene(
        siteElement,
        target,
        scene.transition,
        reduced,
        startScene,
      );
      transitionTimeline.current.paused(latestTourState.current.suspended);
    }
    lastSceneTarget.current = scene.target;
    return () => {
      disposed = true;
      waitingForVoice.current = false;
      narratedStage.current = null;
      narratorRef.current.stop();
      sceneTimeline.current?.kill();
      transitionTimeline.current?.kill();
      sceneContext?.revert();
      gsap.set(siteElement.querySelector(".tour-transition"), {
        clearProps: "all",
      });
      target.removeAttribute("data-tour-active-scene");
      sceneTimeline.current = null;
      transitionTimeline.current = null;
    };
  }, [siteRef, tourState.stage, isTourActive, reduced, sceneConfig]);
  useEffect(() => {
    sceneTimeline.current?.paused(isSuspended);
    transitionTimeline.current?.paused(isSuspended);
    narratorRef.current.setPaused(isSuspended);
  }, [isSuspended]);
  useEffect(() => {
    if (waitingForVoice.current && !narration.isSpeaking() && !isSuspended) {
      waitingForVoice.current = false;
      dispatchTour({
        type: "NEXT",
      });
    }
  }, [narration.status, isSuspended]);
  useEffect(() => {
    if (!isTourActive) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        window.speechSynthesis?.cancel();
        dispatchTour({
          type: "EXIT",
        });
      } else if (
        [
          "PageDown",
          "PageUp",
          "Home",
          "End",
          "ArrowDown",
          "ArrowUp",
          " ",
        ].includes(event.key) &&
        !event.target.closest?.("button,a,input,select,textarea,[role=tab]")
      ) {
        if (!latestTourState.current.state.paused)
          dispatchTour({
            type: "PAUSE",
          });
      }
    };
    const pauseOnManualScroll = (event) => {
      if (
        event.target.closest?.(".tour-controls,button,a,input,textarea,select")
      )
        return;
      if (!latestTourState.current.state.paused)
        dispatchTour({
          type: "PAUSE",
        });
    };
    const exitOnAnchorClick = (event) => {
      if (event.target.closest?.('a[href^="#"]')) {
        window.speechSynthesis?.cancel();
        dispatchTour({
          type: "EXIT",
        });
      }
    };
    const exitOnHistoryChange = () => {
      window.speechSynthesis?.cancel();
      dispatchTour({
        type: "EXIT",
      });
    };
    window.addEventListener("popstate", exitOnHistoryChange);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", pauseOnManualScroll, {
      passive: true,
    });
    window.addEventListener("touchmove", pauseOnManualScroll, {
      passive: true,
    });
    siteRef.current.addEventListener("click", exitOnAnchorClick);
    const siteElement = siteRef.current;
    return () => {
      window.removeEventListener("popstate", exitOnHistoryChange);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", pauseOnManualScroll);
      window.removeEventListener("touchmove", pauseOnManualScroll);
      siteElement.removeEventListener("click", exitOnAnchorClick);
    };
  }, [isTourActive, siteRef]);
  const start = useCallback(() => {
    // Inicia a voz no clique, como os navegadores móveis exigem.
    narratedStage.current = "purpose";
    narratorRef.current.speak(tourScenes.purpose.narration);
    dispatchTour({
      type: "START",
    });
  }, []);
  const exit = useCallback(() => {
    window.speechSynthesis?.cancel();
    narratorRef.current.stop();
    dispatchTour({
      type: "EXIT",
    });
  }, []);
  const next = useCallback(() => {
    narratorRef.current.stop();
    waitingForVoice.current = false;
    dispatchTour({
      type: "NEXT",
    });
  }, []);
  const stopNarration = useCallback(() => narratorRef.current.stop(), []);
  const toggleNarration = useCallback(() => {
    const narrator = narratorRef.current;
    narrator.stop();
    narrator.setEnabled(!narrator.enabled);
  }, []);
  useEffect(() => {
    if (isTourActive && narration.enabled && narratedStage.current) {
      narratorRef.current.speak(sceneConfig.narration);
      narratorRef.current.setPaused(isSuspended);
    }
  }, [narration.enabled]);
  const pause = useCallback(
    () =>
      dispatchTour({
        type: "PAUSE",
      }),
    [],
  );
  const onScan = useCallback(
    () =>
      dispatchTour({
        type: "SCAN",
      }),
    [],
  );
  const onResult = useCallback(
    () =>
      dispatchTour({
        type: "RESULT",
      }),
    [],
  );
  const onAudio = useCallback(
    (playing) =>
      dispatchTour({
        type: "AUDIO",
        playing,
      }),
    [],
  );
  return {
    ...tourState,
    active: isTourActive,
    reduced,
    transitioning,
    suspended: isSuspended,
    config: sceneConfig,
    start,
    exit,
    next,
    pause,
    onScan,
    onResult,
    onAudio,
    stopNarration,
    toggleNarration,
    narrationEnabled: narration.enabled,
    narrationSupported: narration.supported,
    narrationStatus: narration.status,
  };
}
