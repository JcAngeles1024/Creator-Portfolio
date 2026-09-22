"use client";

import { useEffect, useRef } from "react";

/**
 * Plays a short looping window of a video instead of the whole file — five
 * seconds by default, from wherever the best moment is.
 *
 * Also pauses whenever the tile is off-screen, so a strip of clips does not
 * decode video nobody is looking at, and stays on the poster frame entirely
 * for anyone who has asked for reduced motion.
 */
export function ShowcaseVideo({
  src,
  poster,
  label,
  start = 0,
  duration = 5,
}: {
  src: string;
  poster?: string;
  label: string;
  start?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const end = start + duration;

    const seekToStart = () => {
      // Guard against a start point past the end of a shorter file.
      const from = Number.isFinite(video.duration) && start >= video.duration ? 0 : start;
      if (Math.abs(video.currentTime - from) > 0.05) video.currentTime = from;
    };

    const onTimeUpdate = () => {
      if (video.currentTime >= end || video.currentTime < start - 0.5) seekToStart();
    };

    const play = () => {
      if (reduceMotion.matches) return;
      // Autoplay can still be refused; the poster frame remains, which is fine.
      void video.play().catch(() => {});
    };

    video.addEventListener("loadedmetadata", seekToStart);
    video.addEventListener("timeupdate", onTimeUpdate);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else video.pause();
      },
      { threshold: 0.1 },
    );
    observer.observe(video);

    const onMotionChange = () => {
      if (reduceMotion.matches) video.pause();
      else play();
    };
    reduceMotion.addEventListener("change", onMotionChange);

    return () => {
      observer.disconnect();
      video.removeEventListener("loadedmetadata", seekToStart);
      video.removeEventListener("timeupdate", onTimeUpdate);
      reduceMotion.removeEventListener("change", onMotionChange);
    };
  }, [start, duration]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster || undefined}
      aria-label={label}
      className="h-full w-full object-cover"
    >
      <source src={src} />
    </video>
  );
}
