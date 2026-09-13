"use client";

import Image from "next/image";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { heroCharacter } from "./content";
import styles from "./HeroCharacter.module.css";

export default function HeroCharacter() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const anchor = anchorRef.current;
    const hero = anchor?.closest("section");
    if (!anchor || !hero) return;
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let controls: Array<{ stop: () => void }> = [];
    const stop = () => {
      controls.forEach((control) => control.stop());
      controls = [];
    };
    const reset = () => {
      stop();
      if (reduceMotion || !pointer.matches) {
        x.set(0);
        y.set(0);
      } else {
        controls = [
          animate(x, 0, { duration: 0.6, ease: "easeInOut" }),
          animate(y, 0, { duration: 0.6, ease: "easeInOut" }),
        ];
      }
    };
    const move = (event: PointerEvent) => {
      if (reduceMotion || !pointer.matches || event.pointerType !== "mouse") return;
      const rect = anchor.getBoundingClientRect();
      const dx = event.clientX - rect.left - rect.width / 2;
      const dy = event.clientY - rect.top - rect.height / 2;
      if (Math.abs(dx) > rect.width / 2 + 150 || Math.abs(dy) > rect.height / 2 + 150) {
        reset();
        return;
      }
      stop();
      controls = [
        animate(x, Math.max(-32, Math.min(32, dx / 3)), { duration: 0.3, ease: "easeOut" }),
        animate(y, Math.max(-24, Math.min(24, dy / 3)), { duration: 0.3, ease: "easeOut" }),
      ];
    };
    // Listen on the hero so the image itself never intercepts links or buttons.
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", reset);
    pointer.addEventListener("change", reset);
    reset();
    return () => {
      stop();
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset);
      pointer.removeEventListener("change", reset);
    };
  }, [reduceMotion, x, y]);

  return (
    <div ref={anchorRef} className={styles.anchor}>
      <motion.div
        className={styles.entry}
        initial={reduceMotion ? false : { y: 30 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div className={styles.character} style={reduceMotion ? undefined : { x, y }}>
          <picture>
            <source
              type="image/webp"
              srcSet={heroCharacter.srcSet}
              sizes="(max-width: 700px) 280px, (max-width: 900px) 360px, (max-height: 700px) 400px, 520px"
            />
            <Image
              className={styles.image}
              src={heroCharacter.src}
              width={heroCharacter.width}
              height={heroCharacter.height}
              alt={heroCharacter.alt}
              loading="eager"
              fetchPriority="high"
              draggable={false}
            />
          </picture>
        </motion.div>
      </motion.div>
    </div>
  );
}
