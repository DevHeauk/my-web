import { useState, useEffect, useCallback } from 'react';

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSeconds: number;
}

export function useTimer(
  dueTime: string | null,
  onExpire?: () => void,
): TimerState {
  const calculate = useCallback((): TimerState => {
    if (!dueTime) {
      return { hours: 0, minutes: 0, seconds: 0, isExpired: false, totalSeconds: 0 };
    }

    const diff = Math.max(0, new Date(dueTime).getTime() - Date.now());

    if (diff === 0) {
      return { hours: 0, minutes: 0, seconds: 0, isExpired: true, totalSeconds: 0 };
    }

    const totalSeconds = Math.floor(diff / 1000);
    return {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      isExpired: false,
      totalSeconds,
    };
  }, [dueTime]);

  const [state, setState] = useState<TimerState>(calculate);

  useEffect(() => {
    if (!dueTime) return;

    const tick = () => {
      const next = calculate();
      setState(next);
      if (next.isExpired) {
        clearInterval(id);
        onExpire?.();
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [dueTime, calculate, onExpire]);

  return state;
}
