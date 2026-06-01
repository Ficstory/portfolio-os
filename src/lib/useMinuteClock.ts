"use client";

import { useEffect, useState } from "react";

export function useMinuteClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const updateNow = () => setNow(new Date());
    const msToNextMinute = 60_000 - (Date.now() % 60_000);
    let intervalId: ReturnType<typeof setInterval> | undefined;

    updateNow();

    const timeoutId = setTimeout(() => {
      updateNow();
      intervalId = setInterval(updateNow, 60_000);
    }, msToNextMinute);

    return () => {
      clearTimeout(timeoutId);

      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return now;
}
