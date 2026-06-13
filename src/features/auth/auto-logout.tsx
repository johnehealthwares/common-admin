import { useNavigate, useLocation } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

const ACTIVITY_EVENTS = [
  'mousedown',
  'keydown',
  'mousemove',
  'touchstart',
  'scroll',
  'wheel',
] as const;

export function AutoLogout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const currentPath = location.href;
      useAuthStore.getState().logout();
      navigate({ to: '/sign-in', search: { redirect: currentPath }, replace: true });
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    resetTimer();

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, resetTimer, { passive: true });
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, resetTimer);
      }
    };
  }, []);

  return <>{children}</>;
}
