"use client";
import useLenis from "@/hook/useLenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ClientWrapper({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const lenis = useLenis();

  const pathname = usePathname();
  useEffect(() => {
    // Scroll to top on route change
    const scrollToTop = () => {
      // Use Lenis if available, fallback to window.scrollTo
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
      }
    };

    // Small delay to ensure Lenis is initialized
    const timer = setTimeout(scrollToTop, 100);

    return () => clearTimeout(timer);
  }, [pathname, lenis]);

  return <>{children}</>;
}
