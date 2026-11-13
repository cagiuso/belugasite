import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
gsap.ticker.fps(60);
// Lenis e ScrollTrigger usam o mesmo tempo de animação.
gsap.ticker.lagSmoothing(0);
export { gsap, ScrollTrigger };
