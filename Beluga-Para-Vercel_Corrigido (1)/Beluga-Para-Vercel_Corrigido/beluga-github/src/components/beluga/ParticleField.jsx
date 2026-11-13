import { prefersLightMotion } from "../../animations/motionBudget";
import { useEffect, useRef } from "react";
import { gsap } from "../../animations/gsapConfig";
import { useReducedMotion } from "../../hooks/useReducedMotion";
const MAX_PARTICLES = 16;
const MAX_BURST = 8;
const BURST_COOLDOWN = 1200;

export function ParticleField({ paused = false }) {
  const canvasRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || paused || prefersReducedMotion || prefersLightMotion()) return;
    const context = canvas.getContext("2d", {
      alpha: true,
    });
    if (!context) return;
    const siteElement = canvas.closest(".beluga-site");
    const hero = siteElement.querySelector("#inicio");
    const particles = [];
    const ambientParticles = [];
    let width = innerWidth;
    let height = innerHeight;
    let scrollTop = window.scrollY;
    let heroTop = 0;
    let heroHeight = 0;
    let animationTime = 0;
    let isTicking = false;
    let lastBurstTime = -Infinity;
    const isHeroVisible = () =>
      heroHeight > 0 &&
      heroTop - scrollTop < height &&
      heroTop + heroHeight - scrollTop > 0;
    const updateTickerState = () => {
      const shouldAnimate =
        !document.hidden && (isHeroVisible() || particles.length > 0);
      if (shouldAnimate && !isTicking) {
        gsap.ticker.add(drawParticles);
        isTicking = true;
      } else if (!shouldAnimate && isTicking) {
        gsap.ticker.remove(drawParticles);
        isTicking = false;
        context.clearRect(0, 0, width, height);
      }
    };
    const resizeCanvas = () => {
      width = innerWidth;
      height = innerHeight;
      scrollTop = window.scrollY;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const bounds = hero?.getBoundingClientRect();
      heroTop = bounds ? bounds.top + scrollTop : 0;
      heroHeight = bounds?.height || 0;
      ambientParticles.length = 0;
      for (let i = 0; i < (width <= 760 ? 4 : 10); i++)
        ambientParticles.push({
          x:
            width *
            ((width <= 760 ? 0.82 : 0.62) +
              Math.random() * (width <= 760 ? 0.14 : 0.32)),
          y: Math.random() * heroHeight,
          r: Math.random() * 0.55 + 0.45,
          v: Math.random() * 0.005 + 0.003,
          phase: Math.random() * Math.PI * 2,
        });
      updateTickerState();
    };
    const handleScroll = () => {
      scrollTop = window.scrollY;
      updateTickerState();
    };
    const handleSceneParticles = (event) => {
      const { x, y, count = 6 } = event.detail || {};
      const now = performance.now();
      if (
        document.hidden ||
        !Number.isFinite(x) ||
        !Number.isFinite(y) ||
        !Number.isFinite(count) ||
        x < 0 ||
        x > width ||
        y < 0 ||
        y > height ||
        now - lastBurstTime < BURST_COOLDOWN
      )
        return;
      lastBurstTime = now;
      for (
        let i = 0;
        i < Math.min(MAX_BURST, Math.max(0, Math.floor(count))) &&
        particles.length < MAX_PARTICLES;
        i++
      ) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.035 + 0.015;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.01,
          life: 1,
          decay: Math.random() * 0.0004 + 0.0012,
          r: Math.random() * 0.65 + 0.6,
        });
      }
      updateTickerState();
    };
    const drawParticles = (_, delta) => {
      const elapsedMilliseconds = Math.min(delta, 40);
      animationTime += elapsedMilliseconds;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#7cddbf";
      if (isHeroVisible()) {
        for (const point of ambientParticles) {
          point.y -= point.v * elapsedMilliseconds;
          if (point.y < 0) point.y = heroHeight;
          const y = heroTop - scrollTop + point.y;
          if (y < 0 || y > height) continue;
          context.globalAlpha =
            0.04 +
            (Math.sin(animationTime * 0.00035 + point.phase) + 1) * 0.035;
          context.beginPath();
          context.arc(
            point.x + Math.sin(animationTime * 0.00015 + point.phase) * 4,
            y,
            point.r,
            0,
            Math.PI * 2,
          );
          context.fill();
        }
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const point = particles[i];
        point.x += point.vx * elapsedMilliseconds;
        point.y += point.vy * elapsedMilliseconds;
        point.life -= point.decay * elapsedMilliseconds;
        if (point.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        context.globalAlpha = point.life * 0.35;
        context.beginPath();
        context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      updateTickerState();
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("load", resizeCanvas, {
      once: true,
    });
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    document.addEventListener("visibilitychange", updateTickerState);
    siteElement.addEventListener("beluga:burst", handleSceneParticles);
    return () => {
      gsap.ticker.remove(drawParticles);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("load", resizeCanvas);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", updateTickerState);
      siteElement.removeEventListener("beluga:burst", handleSceneParticles);
      context.clearRect(0, 0, width, height);
    };
  }, [paused, prefersReducedMotion]);
  return (
    <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
  );
}
