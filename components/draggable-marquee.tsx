"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import "./draggable-marquee.css";

type DraggableMarqueeProps = {
  images: string[];
};

export function DraggableMarquee({ images }: DraggableMarqueeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    gsap.registerPlugin(Observer);

    let cleanup = () => {};
    let cancelled = false;

    const getNumberAttr = (
      el: HTMLElement,
      name: string,
      fallback: number,
    ): number => {
      const value = Number.parseFloat(el.getAttribute(name) ?? "");
      return Number.isFinite(value) ? value : fallback;
    };

    const setup = () => {
      if (cancelled) {
        return;
      }

      const collection = wrapper.querySelector<HTMLElement>(
        "[data-draggable-marquee-collection]",
      );
      const list = wrapper.querySelector<HTMLElement>(
        "[data-draggable-marquee-list]",
      );
      if (!collection || !list) {
        return;
      }

      const duration = getNumberAttr(wrapper, "data-duration", 20);
      const multiplier = getNumberAttr(wrapper, "data-multiplier", 35);
      const sensitivity = getNumberAttr(wrapper, "data-sensitivity", 0.01);

      const wrapperWidth = wrapper.getBoundingClientRect().width;
      const listWidth = list.scrollWidth || list.getBoundingClientRect().width;
      if (!wrapperWidth || !listWidth) {
        return;
      }

      // Duplicate the list until it comfortably covers the viewport so the
      // loop is seamless.
      const minRequiredWidth = wrapperWidth + listWidth + 2;
      while (collection.scrollWidth < minRequiredWidth) {
        const listClone = list.cloneNode(true) as HTMLElement;
        listClone.setAttribute("data-draggable-marquee-clone", "");
        listClone.setAttribute("aria-hidden", "true");
        collection.appendChild(listClone);
      }

      const wrapX = gsap.utils.wrap(-listWidth, 0);
      gsap.set(collection, { x: 0 });

      const marqueeLoop = gsap.to(collection, {
        x: -listWidth,
        duration,
        ease: "none",
        repeat: -1,
        onReverseComplete: () => marqueeLoop.progress(1),
        modifiers: {
          x: (x) => `${wrapX(Number.parseFloat(x))}px`,
        },
      });

      const initialDirectionAttr = (
        wrapper.getAttribute("data-direction") || "left"
      ).toLowerCase();
      const baseDirection = initialDirectionAttr === "right" ? -1 : 1;
      const timeScale = { value: baseDirection };

      if (baseDirection < 0) {
        marqueeLoop.progress(1);
      }

      const applyTimeScale = () => {
        marqueeLoop.timeScale(timeScale.value);
        wrapper.setAttribute(
          "data-direction",
          timeScale.value < 0 ? "right" : "left",
        );
      };

      applyTimeScale();

      const marqueeObserver = Observer.create({
        target: wrapper,
        type: "pointer,touch",
        preventDefault: true,
        debounce: false,
        onChangeX: (observerEvent) => {
          let velocityTimeScale = observerEvent.velocityX * -sensitivity;
          velocityTimeScale = gsap.utils.clamp(
            -multiplier,
            multiplier,
            velocityTimeScale,
          );

          gsap.killTweensOf(timeScale);

          const restingDirection = velocityTimeScale < 0 ? -1 : 1;
          gsap
            .timeline({ onUpdate: applyTimeScale })
            .to(timeScale, {
              value: velocityTimeScale,
              duration: 0.1,
              overwrite: true,
            })
            .to(timeScale, { value: restingDirection, duration: 1 });
        },
      });

      // IntersectionObserver is immune to the page-height change that happens
      // when the loader hands off to the hero, unlike ScrollTrigger positions.
      const visibility = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) {
            return;
          }
          if (entry.isIntersecting) {
            marqueeLoop.resume();
            applyTimeScale();
            marqueeObserver.enable();
          } else {
            marqueeLoop.pause();
            marqueeObserver.disable();
          }
        },
        { threshold: 0 },
      );
      visibility.observe(wrapper);

      wrapper.setAttribute("data-draggable-marquee-init", "initialized");

      cleanup = () => {
        visibility.disconnect();
        marqueeObserver.kill();
        marqueeLoop.kill();
        collection
          .querySelectorAll("[data-draggable-marquee-clone]")
          .forEach((clone) => clone.remove());
        wrapper.removeAttribute("data-draggable-marquee-init");
        gsap.set(collection, { clearProps: "x" });
      };
    };

    // Measure only once images have real dimensions, otherwise listWidth is
    // wrong and the loop/clones break.
    const imgs = Array.from(wrapper.querySelectorAll("img"));
    const pending = imgs.filter((img) => !img.complete);

    if (pending.length === 0) {
      setup();
    } else {
      let loaded = 0;
      const onSettled = () => {
        loaded += 1;
        if (loaded >= pending.length) {
          setup();
        }
      };
      pending.forEach((img) => {
        img.addEventListener("load", onSettled, { once: true });
        img.addEventListener("error", onSettled, { once: true });
      });
    }

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      data-draggable-marquee-init=""
      data-direction="left"
      data-duration="20"
      data-multiplier="35"
      data-sensitivity="0.01"
      className="draggable-marquee"
    >
      <div
        data-draggable-marquee-collection=""
        className="draggable-marquee__collection"
      >
        <div data-draggable-marquee-list="" className="draggable-marquee__list">
          {images.map((src, index) => (
            <div
              key={src}
              className={`draggable-marquee__item ${index % 3 === 0 ? "is--round" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- GSAP clones and drags these nodes directly */}
              <img
                draggable={false}
                loading="eager"
                src={src}
                alt=""
                className="draggable-marquee__item-img"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
