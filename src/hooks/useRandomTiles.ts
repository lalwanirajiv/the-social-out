
"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const SHUFFLE_MS = 5000;

function random(max: number) {
  return Math.floor(Math.random() * max);
}

function initialSelection(total: number, slots: number) {
  return Array.from(
    { length: Math.min(total, slots) },
    (_, index) => index
  );
}

function shuffleSome(current: number[], total: number) {
  if (total < 2 || current.length < 2) {
    return current;
  }

  const next = [...current];

  const unused = Array.from(
    { length: total },
    (_, i) => i
  ).filter((i) => !current.includes(i));

  if (unused.length > 0) {
    // Change one or two random blocks, never all of them.
    const changes = Math.min(
      1 + random(2),
      unused.length,
      current.length - 1
    );

    const slots = current.map((_, i) => i);

    for (let i = 0; i < changes; i++) {
      const slot = slots.splice(random(slots.length), 1)[0];
      const replacement = unused.splice(
        random(unused.length),
        1
      )[0];

      next[slot] = replacement;
    }
  } else {
    // All photos are currently visible.
    // Exchange just two tile positions.
    const first = random(next.length);
    let second = random(next.length - 1);

    if (second >= first) second++;

    [next[first], next[second]] = [
      next[second],
      next[first],
    ];
  }

  return next;
}

export function useRandomTiles(
  items: string[],
  slots: number,
  startDelay = SHUFFLE_MS
) {
  const reducedMotion = useReducedMotion();

  const [indexes, setIndexes] = useState(() =>
    initialSelection(items.length, slots)
  );

  useEffect(() => {
    setIndexes(initialSelection(items.length, slots));
  }, [items, slots]);

  useEffect(() => {
    if (reducedMotion || items.length < 2) return;

    let interval: ReturnType<typeof setInterval> | undefined;

    const tick = () => {
      if (document.hidden) return;

      setIndexes((current) =>
        shuffleSome(current, items.length)
      );
    };

    const timeout = setTimeout(() => {
      tick();
      interval = setInterval(tick, SHUFFLE_MS);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [items.length, reducedMotion, startDelay]);

  return { indexes, reducedMotion };
}
