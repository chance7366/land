"use client";

import { useEffect, useState } from "react";

/** 이미지가 2장 이상이면 intervalMs마다 인덱스 순환. 선택·리셋 키 변경 시 0부터. */
export function useImageSlideshow(
  imageCount: number,
  resetKey: string | null | undefined,
  intervalMs = 1500,
) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [resetKey]);

  useEffect(() => {
    if (imageCount <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % imageCount);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [imageCount, intervalMs, resetKey]);

  return { activeIndex, setActiveIndex } as const;
}
