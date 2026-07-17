"use client";

import { useMemo } from "react";

type FeaturedMarqueeRowProps = {
  children: React.ReactNode;
  /** Seconds for one full loop of the duplicated track */
  durationSec?: number;
  className?: string;
};

export function FeaturedMarqueeRow({
  children,
  durationSec = 60,
  className = "",
}: FeaturedMarqueeRowProps) {
  const style = useMemo(
    () => ({ ["--featured-marquee-duration" as string]: `${durationSec}s` }),
    [durationSec],
  );

  return (
    <div className={`featured-marquee-viewport ${className}`} style={style}>
      <div className="featured-marquee-track">
        <div className="featured-marquee-group">{children}</div>
        <div className="featured-marquee-group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
