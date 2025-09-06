import { useCallback } from 'react';
import useLenis from './useLenis';

export function useScrollToTop() {
  const lenis = useLenis();

  const scrollToTop = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [lenis]);

  return scrollToTop;
}
