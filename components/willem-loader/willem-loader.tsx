"use client";

import { useCallback, useEffect, useRef } from "react";
import { siteConfig } from "@/lib/site-config";
import { coupleImages } from "@/lib/images";
import { initWillemLoadingAnimation } from "./init-willem-animation";
import "./willem-loader.css";

type WillemLoaderProps = {
  onComplete: () => void;
};

const brideLetters = siteConfig.couple.bride.split("");
const groomLetters = siteConfig.couple.groom.split("");

/** Letter shown during the loading phase (dark text on cream). */
function LoaderLetter({ char }: { char: string }) {
  return (
    <span className="willem__letter-wrap">
      <span className="willem__letter">{char}</span>
    </span>
  );
}

/** Letter shown in the final hero (white text over the photo). */
function HeroLetter({ char }: { char: string }) {
  return (
    <span className="willem__letter-white-wrap">
      <span className="willem__letter-white">{char}</span>
    </span>
  );
}

export function WillemLoader({ onComplete }: WillemLoaderProps) {
  const containerRef = useRef<HTMLElement>(null);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  const handleComplete = useCallback(() => {
    completeRef.current();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    // Respect reduced-motion: jump straight to the hero state.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      container.classList.remove("is--hidden", "is--loading");
      container.classList.add("is--hero");
      container.setAttribute("aria-hidden", "false");
      handleComplete();
      return;
    }

    let cancelled = false;
    let timeline: ReturnType<typeof initWillemLoadingAnimation> | null = null;

    const start = () => {
      if (cancelled || !containerRef.current) {
        return;
      }
      timeline = initWillemLoadingAnimation(containerRef.current, handleComplete);
    };

    // Wait for the webfont (so letters don't swap mid-animation) and the hero
    // image (so it doesn't decode during the fullscreen expand). Both cause the
    // jank you were seeing. Cap the wait so we never hang on a slow asset.
    const ready: Promise<unknown>[] = [];
    if (document.fonts?.ready) {
      ready.push(document.fonts.ready);
    }
    const heroImg = container.querySelector<HTMLImageElement>(
      ".willem__cover-image",
    );
    if (heroImg?.decode) {
      ready.push(heroImg.decode().catch(() => undefined));
    }
    const safety = new Promise((resolve) => window.setTimeout(resolve, 1200));

    Promise.race([Promise.all(ready), safety]).then(start);

    return () => {
      cancelled = true;
      timeline?.kill();
    };
  }, [handleComplete]);

  return (
    <section
      ref={containerRef}
      className="willem-header is--loading is--hidden"
      aria-hidden="true"
    >
      {/* Persistent image layer — grows from a point to fullscreen and stays as the hero background */}
      <div className="willem-hero__media" aria-hidden="true">
        <div className="willem__growing-image">
          <div className="willem__growing-image-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element -- GSAP animates this node directly */}
            <img
              className="willem__cover-image"
              src={coupleImages.hero}
              alt=""
              fetchPriority="high"
            />
          </div>
        </div>
        <div className="willem-hero__scrim" />
      </div>

      {/* Loading layer — "Bahar & Fırat" centered, the & fades as the image appears */}
      <div className="willem-loader">
        <div className="willem__h1">
          <span className="willem__h1-start">
            {brideLetters.map((char, index) => (
              <LoaderLetter key={`l-bride-${index}`} char={char} />
            ))}
          </span>
          <span className="willem__amp-wrap">
            <span className="willem__letter willem__amp">&amp;</span>
          </span>
          <span className="willem__h1-end">
            {groomLetters.map((char, index) => (
              <LoaderLetter key={`l-groom-${index}`} char={char} />
            ))}
          </span>
        </div>
      </div>

      {/* Hero layer — Bahar top-left, & center, Fırat bottom-right */}
      <div className="willem-header__content">
        <div className="willem-hero__title">
          <div className="willem-hero__cluster">
            <span className="willem__hero-name is--start">
              {brideLetters.map((char, index) => (
                <HeroLetter key={`h-bride-${index}`} char={char} />
              ))}
            </span>
            <span className="willem__letter-white-wrap willem__hero-amp">
              <span className="willem__letter-white">&amp;</span>
            </span>
            <span className="willem__hero-name is--end">
              {groomLetters.map((char, index) => (
                <HeroLetter key={`h-groom-${index}`} char={char} />
              ))}
            </span>
          </div>
        </div>
        <p className="willem-hero__tagline">
          BU ÖZEL YOLCULUĞUN BAŞLANGICINA TANIKLIK EDİN.
        </p>
      </div>
    </section>
  );
}
