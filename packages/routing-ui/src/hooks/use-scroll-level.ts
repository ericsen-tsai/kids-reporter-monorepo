import { useState, useEffect } from "react";
import throttle from "lodash/throttle";

export enum ScrollLevel {
  UP = "up",
  DOWN_MINI = "down-mini",
  DOWN_HIDDEN = "down-hidden",
}

enum ScrollDirection {
  UP = "up",
  DOWN = "down",
}

const useScrollLevel = ({
  scrollDownDistance = 10,
  throttleThreshold = 200,
} = {}) => {
  const [scrollLevel, setScrollLevel] = useState<ScrollLevel>(ScrollLevel.UP);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const updateScrollLevel = throttle(() => {
      if (Math.abs(window.scrollY - lastScrollY) < scrollDownDistance) {
        return;
      }
      const direction =
        window.scrollY > lastScrollY
          ? ScrollDirection.DOWN
          : ScrollDirection.UP;
      let level = ScrollLevel.UP;
      if (direction === ScrollDirection.DOWN) {
        level =
          scrollLevel === ScrollLevel.UP
            ? ScrollLevel.DOWN_MINI
            : ScrollLevel.DOWN_HIDDEN;
      }
      if (level !== scrollLevel) {
        setScrollLevel(level);
      }
      lastScrollY = window.scrollY > 0 ? window.scrollY : 0;
    }, throttleThreshold);

    window.addEventListener("scroll", updateScrollLevel, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScrollLevel);
    };
  }, [scrollLevel, scrollDownDistance, throttleThreshold]);

  return scrollLevel;
};

export default useScrollLevel
