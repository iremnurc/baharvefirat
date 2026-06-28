import gsap from "gsap";

/**
 * Willem-style loading timeline for "Bahar & Fırat".
 *
 * Sequence:
 *  1. "Bahar & Fırat" letters slide up into view (centered).
 *  2. The "&" fades out as the photo grows from a point where the & was;
 *     the two names ease apart to make room.
 *  3. The photo expands to fill the whole viewport (stays centered the entire
 *     time because its parent layer is flex-centered) and the loading text fades.
 *  4. The hero text reveals on top — Bahar (top-left) · & (center) · Fırat
 *     (bottom-right).
 */
export function initWillemLoadingAnimation(
  container: HTMLElement,
  onComplete?: () => void,
) {
  const loaderLetters = container.querySelectorAll<HTMLElement>(
    ".willem-loader .willem__letter",
  );
  const amp = container.querySelector<HTMLElement>(".willem-loader .willem__amp");
  const headingStart = container.querySelector<HTMLElement>(
    ".willem-loader .willem__h1-start",
  );
  const headingEnd = container.querySelector<HTMLElement>(
    ".willem-loader .willem__h1-end",
  );
  const growingImage = container.querySelector<HTMLElement>(
    ".willem__growing-image",
  );
  const loaderLayer = container.querySelector<HTMLElement>(".willem-loader");
  const heroLetters = container.querySelectorAll<HTMLElement>(
    ".willem-header__content .willem__letter-white",
  );
  const heroTagline = container.querySelector<HTMLElement>(".willem-hero__tagline");

  // Initial state for the image: a zero-size point in the center.
  if (growingImage) {
    gsap.set(growingImage, { width: 0, height: 0, autoAlpha: 0 });
  }

  const tl = gsap.timeline({
    defaults: { ease: "expo.inOut", force3D: true },
    onStart: () => {
      container.classList.remove("is--hidden");
    },
    onComplete: () => {
      if (growingImage) {
        gsap.set(growingImage, { clearProps: "width,height" });
        growingImage.style.willChange = "auto";
      }
      container.classList.add("is--hero");
      container.classList.remove("is--loading");
      container.setAttribute("aria-hidden", "false");
      onComplete?.();
    },
  });

  // 1. Reveal "Bahar & Fırat"
  if (loaderLetters.length) {
    tl.from(loaderLetters, {
      yPercent: 115,
      stagger: 0.04,
      duration: 1.2,
    });
  }

  // 2. "&" fades out, the photo appears in its place, names ease apart
  if (amp) {
    tl.to(
      amp,
      { autoAlpha: 0, scale: 0.5, duration: 0.6, ease: "power2.in" },
      ">-0.15",
    );
  }
  if (growingImage) {
    // Size in `em` so the tile matches the letters, like the original Willem
    // box (the media layer shares the heading's font-size). GSAP converts the
    // em start size to vw/dvh during the fullscreen expand below.
    tl.fromTo(
      growingImage,
      { width: "0em", height: "0em", autoAlpha: 1 },
      { width: "1em", height: "1.15em", duration: 1.2 },
      "<",
    );
  }
  if (headingStart) {
    tl.to(headingStart, { x: "-0.12em", duration: 1.2 }, "<");
  }
  if (headingEnd) {
    tl.to(headingEnd, { x: "0.12em", duration: 1.2 }, "<");
  }

  // 3. Photo grows to fullscreen; loading text fades away beneath it
  if (growingImage) {
    tl.to(
      growingImage,
      { width: "100vw", height: "100svh", duration: 1.9 },
      ">-0.1",
    );
  }
  if (loaderLayer) {
    tl.to(loaderLayer, { autoAlpha: 0, duration: 0.7 }, "<0.5");
  }

  // 4. Hero text reveals over the photo
  if (heroLetters.length) {
    tl.from(
      heroLetters,
      {
        yPercent: 115,
        stagger: 0.03,
        duration: 1.1,
        ease: "expo.out",
      },
      "<0.35",
    );
  }
  if (heroTagline) {
    tl.from(
      heroTagline,
      { autoAlpha: 0, y: 24, duration: 0.8, ease: "power2.out" },
      "<0.2",
    );
  }

  return tl;
}
