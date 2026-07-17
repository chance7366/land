"use client";

import { useEffect, useRef, useState } from "react";

/** RTL scroll when text overflows its container */
export function OverflowMarquee({
  text,
  className = "",
  speedPxPerSec = 28,
}: {
  text: string;
  className?: string;
  speedPxPerSec?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [shift, setShift] = useState(0);
  const [duration, setDuration] = useState(10);

  useEffect(() => {
    const wrap = wrapRef.current;
    const el = textRef.current;
    if (!wrap || !el) return;

    const measure = () => {
      const dist = Math.max(0, el.scrollWidth - wrap.clientWidth);
      setShift(dist);
      setDuration(Math.max(6, dist / speedPxPerSec + 4));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [text, speedPxPerSec]);

  if (!text) return null;

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`}>
      <span
        ref={textRef}
        className={`inline-block max-w-none whitespace-nowrap ${shift > 0 ? "auction-text-marquee" : ""}`}
        style={
          shift > 0
            ? ({
                ["--marquee-shift" as string]: `-${shift}px`,
                animationDuration: `${duration}s`,
              } as React.CSSProperties)
            : undefined
        }
      >
        {text}
      </span>
    </div>
  );
}
