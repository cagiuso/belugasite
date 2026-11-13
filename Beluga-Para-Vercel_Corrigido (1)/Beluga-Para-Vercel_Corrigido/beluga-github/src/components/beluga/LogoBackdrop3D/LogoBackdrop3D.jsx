import { prefersLightMotion } from "../../../animations/motionBudget";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import "./LogoBackdrop3D.css";

export function LogoBackdrop3D({ paused = false }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const settingsRef = useRef(null);
  const [modelReady, setModelReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  settingsRef.current = {
    paused,
    reduced: prefersReducedMotion,
  };
  useEffect(() => {
    if (prefersLightMotion() || typeof window.WebGL2RenderingContext === "undefined") return;
    let disposed = false;
    let visible = typeof IntersectionObserver === "undefined";
    let loading = false;
    let failed = false;
    const loadController = new AbortController();
    const updateSceneState = () => {
      sceneRef.current?.setMotionEnabled(
        !settingsRef.current.paused && !settingsRef.current.reduced,
      );
      sceneRef.current?.setActive(visible && !document.hidden);
    };
    const loadModel = async () => {
      if (
        disposed ||
        loading ||
        sceneRef.current ||
        failed ||
        !visible ||
        document.hidden
      )
        return;
      loading = true;
      try {
        const { createLogoScene } = await import("./createLogoScene");
        if (disposed) return;
        const loadedScene = await createLogoScene(canvasRef.current, {
          signal: loadController.signal,
          onContextLost: () => {
            if (!disposed) {
              failed = true;
              setModelReady(false);
            }
          },
        });
        if (disposed) {
          loadedScene.dispose();
          return;
        }
        sceneRef.current = loadedScene;
        updateSceneState();
        setModelReady(true);
      } catch (error) {
        if (!disposed && error.name !== "AbortError") {
          failed = true;
          setModelReady(false);
        }
      } finally {
        loading = false;
      }
    };
    const handleVisibilityChange = () => {
      updateSceneState();
      loadModel();
    };
    const visibilityObserver =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              visible = entries[0].isIntersecting;
              updateSceneState();
              if (visible) loadModel();
            },
            {
              rootMargin: "80px",
            },
          )
        : null;
    visibilityObserver?.observe(containerRef.current);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    loadModel();
    return () => {
      disposed = true;
      loadController.abort();
      visibilityObserver?.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);
  useEffect(
    () => sceneRef.current?.setMotionEnabled(!paused && !prefersReducedMotion),
    [paused, prefersReducedMotion],
  );
  return (
    <div
      ref={containerRef}
      className={`hero-logo-3d ${modelReady ? "is-ready" : ""}`}
      data-parallax="0.18"
      data-parallax-gain="1"
      data-parallax-limit="125"
      data-parallax-scrub="1.1"
      aria-hidden="true"
    >
      <img
        className="hero-logo-fallback"
        src={`${import.meta.env.BASE_URL}images/beluga-logo.png`}
        alt=""
        width="512"
        height="516"
        decoding="async"
      />
      <canvas ref={canvasRef} className="hero-logo-canvas" />
    </div>
  );
}
