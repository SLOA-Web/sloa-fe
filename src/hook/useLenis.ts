"use client";


import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function useLenis(): void {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
      lerp: 0.08,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync ScrollTrigger with Lenis
    function updateScrollTrigger() {
      ScrollTrigger.update();
    }
    lenis.on("scroll", updateScrollTrigger);

    // Set ScrollTrigger to use Lenis' scroll position
    ScrollTrigger.scrollerProxy(window, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value ?? 0, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    ScrollTrigger.addEventListener("refresh", () => {
      // No lenis.update(), just refresh triggers
    });
    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", updateScrollTrigger);
      lenis.destroy();
      ScrollTrigger.removeEventListener("refresh", () => {});
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
}
