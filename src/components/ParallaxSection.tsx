"use client";

import React, { useEffect, useRef, useState } from "react";

interface ParallaxSectionProps {
  imageSrc: string;
  imageAlt: string;
  heightClass?: string;
  speed?: number;
  overlayClassName?: string;
  children: React.ReactNode;
}

export function ParallaxSection({
  imageSrc,
  imageAlt,
  heightClass = "min-h-[84vh]",
  speed = 0.28,
  overlayClassName = "bg-gradient-to-r from-[#081529]/90 via-[#0B1F3A]/65 to-[#0B1F3A]/35",
  children,
}: ParallaxSectionProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let rafId = 0;

    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elCenter = rect.top + rect.height / 2;
      const delta = (elCenter - viewportCenter) * speed;
      setOffsetY(Math.max(-90, Math.min(90, delta)));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <section
      ref={containerRef}
      className={`relative overflow-hidden flex items-center ${heightClass}`}
    >
      {/* Imagem com deslocamento parallax GPU */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -top-16 -bottom-16 will-change-transform pointer-events-none"
        style={{
          transform: `translate3d(0, ${offsetY}px, 0) scale(1.12)`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Overlay cinematográfico */}
      <div aria-hidden="true" className={`absolute inset-0 ${overlayClassName}`} />

      {/* Conteúdo em primeiro plano */}
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}
