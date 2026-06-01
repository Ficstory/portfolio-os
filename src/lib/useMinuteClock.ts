"use client";

import { useEffect, useRef, useState } from "react";

function getMinuteStamp(now: Date) {
  return Math.floor(now.getTime() / 60_000);
}

export function useMinuteClock() {
  const [now, setNow] = useState(() => new Date());
  const minuteStampRef = useRef(getMinuteStamp(now));

  useEffect(() => {
    const syncNow = () => {
      const nextNow = new Date();
      const nextMinuteStamp = getMinuteStamp(nextNow);
      const previousMinuteStamp = minuteStampRef.current;

      if (nextMinuteStamp !== previousMinuteStamp) {
        minuteStampRef.current = nextMinuteStamp;
        setNow(nextNow);
      }
    };

    syncNow();

    const intervalId = setInterval(syncNow, 1_000);

    document.addEventListener("visibilitychange", syncNow);
    window.addEventListener("focus", syncNow);
    window.addEventListener("pageshow", syncNow);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", syncNow);
      window.removeEventListener("focus", syncNow);
      window.removeEventListener("pageshow", syncNow);
    };
  }, []);

  return now;
}
