import { useCallback } from 'react';
import useLenis from './useLenis';

export function useScrollToTop() {
  const lenisRef = useLenis();

  const scrollToTop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [lenisRef]);

  return scrollToTop;
}
