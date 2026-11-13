import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from "../../../animations/gsapConfig";
import { createLogoPointer } from "./logoPointer";
function releaseModel(logoModel) {
  const materials = new Set();
  logoModel.traverse((object) => {
    object.geometry?.dispose();
    const objectMaterials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    objectMaterials
      .filter(Boolean)
      .forEach((material) => materials.add(material));
  });
  materials.forEach((material) => material.dispose());
}
export async function createLogoScene(canvas, { signal, onContextLost }) {
  const response = await fetch(
    `${import.meta.env.BASE_URL}models/beluga-logo.glb`,
    {
      signal,
    },
  );
  if (!response.ok) throw new Error("Logo model unavailable");
  const buffer = await response.arrayBuffer();
  if (signal.aborted) throw new DOMException("Cancelled", "AbortError");
  const gltfAsset = await new GLTFLoader().parseAsync(buffer, "");
  const logoModel = gltfAsset.scene;
  if (signal.aborted) {
    releaseModel(logoModel);
    throw new DOMException("Cancelled", "AbortError");
  }
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch (error) {
    releaseModel(logoModel);
    throw error;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.25));
  renderer.setClearColor(0x13233b, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
  camera.position.set(0, 0.04, 8.6);
  const modelSize = new THREE.Box3()
    .setFromObject(logoModel)
    .getSize(new THREE.Vector3());
  const logoGroup = new THREE.Group();
  logoGroup.add(logoModel);
  scene.add(logoGroup);
  scene.add(new THREE.HemisphereLight(0xe8fff5, 0x18304a, 2));
  const keyLight = new THREE.DirectionalLight(0xffffff, 3);
  keyLight.position.set(-3, 4, 5);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xa5f4dd, 2.5);
  rimLight.position.set(4, 1, 2);
  scene.add(rimLight);
  const fillLight = new THREE.DirectionalLight(0x6896b8, 1);
  fillLight.position.set(-3, -2, 1);
  scene.add(fillLight);
  const pointer = createLogoPointer(
    canvas.closest(".hero") || canvas.parentElement,
  );
  let isVisible = false;
  let motionEnabled = true;
  let isTicking = false;
  let disposed = false;
  let contextLost = false;
  let elapsed = 0;
  const render = (delta = 0) => {
    const pointerPosition = pointer.update(delta);
    logoGroup.rotation.set(
      0.055 + Math.sin(elapsed * 0.18) * 0.018 + pointerPosition.y * 0.045,
      -0.22 + Math.sin(elapsed * 0.14) * 0.04 + pointerPosition.x * 0.085,
      0,
    );
    logoGroup.position.x = pointerPosition.x * 0.11;
    logoGroup.position.y =
      Math.sin(elapsed * 0.25) * 0.035 - pointerPosition.y * 0.075;
    renderer.render(scene, camera);
  };
  const animateFrame = (_, delta) => {
    elapsed += Math.min(delta, 40) / 1000;
    render(Math.min(delta, 40) / 1000);
  };
  const updateAnimationState = () => {
    if (disposed || contextLost) return;
    const animate = isVisible && motionEnabled;
    pointer.setEnabled(animate);
    if (animate && !isTicking) {
      gsap.ticker.add(animateFrame);
      isTicking = true;
    } else if (!animate && isTicking) {
      gsap.ticker.remove(animateFrame);
      isTicking = false;
    }
    if (isVisible) render();
  };
  const resizeScene = () => {
    if (disposed || contextLost) return;
    const host = canvas.parentElement;
    const width = Math.max(1, Math.round(host.clientWidth));
    const height = Math.max(1, Math.round(host.clientHeight));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const halfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    camera.position.z =
      Math.max(
        modelSize.y / (2 * halfFov),
        modelSize.x / (2 * halfFov * camera.aspect),
      ) * 1.3;
    camera.updateProjectionMatrix();
    if (isVisible) render();
  };
  const handleContextLost = (event) => {
    event.preventDefault();
    isVisible = false;
    gsap.ticker.remove(animateFrame);
    isTicking = false;
    contextLost = true;
    onContextLost();
  };
  canvas.addEventListener("webglcontextlost", handleContextLost);
  const sizeObserver =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(resizeScene)
      : null;
  sizeObserver?.observe(canvas.parentElement);
  window.addEventListener("resize", resizeScene);
  try {
    resizeScene();
    render();
  } catch (error) {
    pointer.dispose();
    sizeObserver?.disconnect();
    window.removeEventListener("resize", resizeScene);
    canvas.removeEventListener("webglcontextlost", handleContextLost);
    releaseModel(logoModel);
    renderer.dispose();
    renderer.forceContextLoss();
    throw error;
  }
  return {
    setActive(value) {
      isVisible = value;
      updateAnimationState();
    },
    setMotionEnabled(value) {
      motionEnabled = value;
      updateAnimationState();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      pointer.dispose();
      gsap.ticker.remove(animateFrame);
      sizeObserver?.disconnect();
      window.removeEventListener("resize", resizeScene);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      releaseModel(logoModel);
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
