"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, type PointerEvent } from "react";
import styles from "./Pm1Portfolio.module.css";

export default function JhMonogram() {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useRef<Array<{ stop: () => void }>>([]);

  function stopAnimations() {
    controls.current.forEach((control) => control.stop());
    controls.current = [];
  }

  function animatePosition(targetX: number, targetY: number, duration: number, ease: "easeOut" | "easeInOut") {
    stopAnimations();
    controls.current = [
      animate(x, targetX, { duration, ease }),
      animate(y, targetY, { duration, ease }),
    ];
  }

  useEffect(() => () => stopAnimations(), []);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    animatePosition(
      (event.clientX - rect.left - rect.width / 2) / 3,
      (event.clientY - rect.top - rect.height / 2) / 3,
      0.3,
      "easeOut",
    );
  }

  function resetPosition() {
    if (reduceMotion) return;
    animatePosition(0, 0, 0.6, "easeInOut");
  }

  return (
    <div
      className={styles.monogramMagnet}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPosition}
      aria-hidden="true"
    >
      <motion.div
        className={styles.monogramEntry}
        initial={reduceMotion ? false : { y: 30, rotate: -3 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div className={styles.monogramObject} style={reduceMotion ? undefined : { x, y }}>
          <svg viewBox="0 0 520 600" role="presentation">
          <defs>
            <linearGradient id="pm1-metal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fcffff" />
              <stop offset=".18" stopColor="#9caab5" />
              <stop offset=".4" stopColor="#edf7fb" />
              <stop offset=".62" stopColor="#4a505c" />
              <stop offset=".82" stopColor="#c6d5df" />
              <stop offset="1" stopColor="#676078" />
            </linearGradient>
            <linearGradient id="pm1-edge" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e4b6ff" />
              <stop offset=".5" stopColor="#7d249c" />
              <stop offset="1" stopColor="#21082f" />
            </linearGradient>
            <radialGradient id="pm1-core" cx="40%" cy="25%" r="70%">
              <stop offset="0" stopColor="#f5dfff" />
              <stop offset=".25" stopColor="#ba4ce0" />
              <stop offset=".72" stopColor="#2a1239" />
              <stop offset="1" stopColor="#08080b" />
            </radialGradient>
            <filter id="pm1-shadow" x="-30%" y="-30%" width="160%" height="180%">
              <feDropShadow dx="0" dy="35" stdDeviation="24" floodColor="#000" floodOpacity=".76" />
              <feDropShadow dx="-10" dy="6" stdDeviation="15" floodColor="#b600a8" floodOpacity=".28" />
            </filter>
          </defs>
          <ellipse cx="260" cy="535" rx="180" ry="35" fill="#9d35d2" opacity=".14" />
          <g filter="url(#pm1-shadow)">
            <path d="M111 116 260 38l149 78 40 314-189 108L71 430z" fill="url(#pm1-edge)" />
            <path d="M128 122 260 55l132 67 36 297-168 96-168-96z" fill="url(#pm1-metal)" />
            <path d="M151 147 260 91l109 56 28 251-137 78-137-78z" fill="url(#pm1-core)" />
            <path d="m128 122 23 25-28 251-31 21z" fill="#eef9ff" opacity=".6" />
            <path d="m392 122-23 25 28 251 31 21z" fill="#21182b" opacity=".75" />
            <path d="M260 55v36l109 56 23-25z" fill="#fff" opacity=".38" />
            <path d="M260 476v39l168-96-31-21z" fill="#6b237d" opacity=".55" />
            <path d="M190 192v134c0 35-15 51-49 51h-14v-43h10c9 0 14-4 14-15V192z" fill="url(#pm1-metal)" />
            <path d="M216 192h40v67h50v-67h40v185h-40v-75h-50v75h-40z" fill="url(#pm1-metal)" />
            <path d="M190 192v134c0 35-15 51-49 51" fill="none" stroke="#fff" strokeOpacity=".48" strokeWidth="3" />
            <path d="M216 192h40v67h50v-67" fill="none" stroke="#fff" strokeOpacity=".48" strokeWidth="3" />
          </g>
          <circle cx="97" cy="163" r="7" fill="#dc8eff" />
          <circle cx="417" cy="356" r="5" fill="#ff9f62" />
          <path d="M79 239h42M100 218v42" stroke="#fff" strokeOpacity=".6" strokeWidth="2" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
