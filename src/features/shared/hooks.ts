import { useCallback, useRef, useEffect } from 'react';

/**
 * Keyboard shortcut hook for power-user workflows.
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifier?: 'ctrl' | 'shift' | 'alt' | 'cmd'
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const modKey =
        modifier === 'cmd'
          ? e.metaKey
          : modifier === 'ctrl'
            ? e.ctrlKey
            : modifier === 'shift'
              ? e.shiftKey
              : e.altKey;

      if (modKey && e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        callbackRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, modifier]);
}

/**
 * Hook to detect if in compact/dense mode.
 */
export function useCompactMode() {
  const isCompact = localStorage.getItem('compact-mode') === 'true';
  return {
    isCompact,
    toggle: () =>
      localStorage.setItem(
        'compact-mode',
        localStorage.getItem('compact-mode') === 'true' ? 'false' : 'true'
      ),
  };
}

/**
 * Hook for efficient list virtualization in data-dense grids.
 */
export function useVirtualizedList<T>(items: T[], itemHeight: number, containerHeight: number) {
  const scrollOffset = useRef(0);

  const visibleRange = useCallback(() => {
    const startIndex = Math.floor(scrollOffset.current / itemHeight);
    const endIndex = Math.ceil((scrollOffset.current + containerHeight) / itemHeight);
    return { startIndex, endIndex };
  }, [itemHeight, containerHeight]);

  return {
    visibleRange: visibleRange(),
    visibleItems: items.slice(visibleRange().startIndex, visibleRange().endIndex),
    onScroll: (offset: number) => {
      scrollOffset.current = offset;
    },
  };
}
