"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ItemSlot = { type: "item"; el: HTMLElement };
type NestedSlot = {
  type: "nested";
  parentEl: HTMLElement;
  nestedEl: HTMLElement;
  includeParent: boolean;
  nestedChildren: HTMLElement[];
};
type Slot = ItemSlot | NestedSlot;

const ANIM_DURATION = 1.5;
const ANIM_EASE = "power4.inOut";

/**
 * Reveals elements tagged with [data-reveal-group] on scroll using GSAP
 * ScrollTrigger. Ported to a React-friendly hook so it cooperates with the
 * App Router lifecycle instead of relying on DOMContentLoaded.
 *
 * Pass `enabled` so the reveal only kicks in once the page is interactive
 * (e.g. after the intro loader finishes).
 */
export function useScrollReveal(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal-group]")
        .forEach((groupEl) => {
          const groupStaggerSec =
            (parseFloat(groupEl.getAttribute("data-stagger") || "") || 100) /
            1000;
          const groupDistance = groupEl.getAttribute("data-distance") || "2em";
          const triggerStart = groupEl.getAttribute("data-start") || "top 80%";

          if (prefersReduced) {
            gsap.set(groupEl, { clearProps: "all", y: 0, autoAlpha: 1 });
            return;
          }

          const directChildren = Array.from(groupEl.children).filter(
            (el): el is HTMLElement => el.nodeType === 1,
          );

          if (!directChildren.length) {
            gsap.set(groupEl, { y: groupDistance, autoAlpha: 0 });
            ScrollTrigger.create({
              trigger: groupEl,
              start: triggerStart,
              once: true,
              onEnter: () =>
                gsap.to(groupEl, {
                  y: 0,
                  autoAlpha: 1,
                  duration: ANIM_DURATION,
                  ease: ANIM_EASE,
                  onComplete: () => gsap.set(groupEl, { clearProps: "all" }),
                }),
            });
            return;
          }

          const slots: Slot[] = [];
          directChildren.forEach((child) => {
            const nestedGroup = child.matches("[data-reveal-group-nested]")
              ? child
              : child.querySelector<HTMLElement>(
                  ":scope [data-reveal-group-nested]",
                );

            if (nestedGroup) {
              const includeParent =
                child.getAttribute("data-ignore") !== "true" &&
                (child.getAttribute("data-ignore") === "false" ||
                  nestedGroup.getAttribute("data-ignore") === "false");

              const nestedChildren = Array.from(nestedGroup.children).filter(
                (el): el is HTMLElement =>
                  el.nodeType === 1 &&
                  el.getAttribute("data-ignore") !== "true",
              );

              slots.push({
                type: "nested",
                parentEl: child,
                nestedEl: nestedGroup,
                includeParent,
                nestedChildren,
              });
            } else {
              if (child.getAttribute("data-ignore") === "true") return;
              slots.push({ type: "item", el: child });
            }
          });

          slots.forEach((slot) => {
            if (slot.type === "item") {
              const isNestedSelf = slot.el.matches("[data-reveal-group-nested]");
              const d = isNestedSelf
                ? groupDistance
                : slot.el.getAttribute("data-distance") || groupDistance;
              gsap.set(slot.el, { y: d, autoAlpha: 0 });
            } else {
              if (slot.includeParent)
                gsap.set(slot.parentEl, { y: groupDistance, autoAlpha: 0 });
              const nestedD =
                slot.nestedEl.getAttribute("data-distance") || groupDistance;
              slot.nestedChildren.forEach((target) =>
                gsap.set(target, { y: nestedD, autoAlpha: 0 }),
              );
            }
          });

          slots.forEach((slot) => {
            if (slot.type === "nested" && slot.includeParent) {
              gsap.set(slot.parentEl, { y: groupDistance });
            }
          });

          ScrollTrigger.create({
            trigger: groupEl,
            start: triggerStart,
            once: true,
            onEnter: () => {
              const tl = gsap.timeline();

              slots.forEach((slot, slotIndex) => {
                const slotTime = slotIndex * groupStaggerSec;

                if (slot.type === "item") {
                  tl.to(
                    slot.el,
                    {
                      y: 0,
                      autoAlpha: 1,
                      duration: ANIM_DURATION,
                      ease: ANIM_EASE,
                      onComplete: () => gsap.set(slot.el, { clearProps: "all" }),
                    },
                    slotTime,
                  );
                } else {
                  if (slot.includeParent) {
                    tl.to(
                      slot.parentEl,
                      {
                        y: 0,
                        autoAlpha: 1,
                        duration: ANIM_DURATION,
                        ease: ANIM_EASE,
                        onComplete: () =>
                          gsap.set(slot.parentEl, { clearProps: "all" }),
                      },
                      slotTime,
                    );
                  }

                  const nestedMs = parseFloat(
                    slot.nestedEl.getAttribute("data-stagger") || "",
                  );
                  const nestedStaggerSec = isNaN(nestedMs)
                    ? groupStaggerSec
                    : nestedMs / 1000;

                  slot.nestedChildren.forEach((nestedChild, nestedIndex) => {
                    tl.to(
                      nestedChild,
                      {
                        y: 0,
                        autoAlpha: 1,
                        duration: ANIM_DURATION,
                        ease: ANIM_EASE,
                        onComplete: () =>
                          gsap.set(nestedChild, { clearProps: "all" }),
                      },
                      slotTime + nestedIndex * nestedStaggerSec,
                    );
                  });
                }
              });
            },
          });
        });
    });

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());
    const delayedRefreshId = window.setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      cancelAnimationFrame(refreshId);
      window.clearTimeout(delayedRefreshId);
      ctx.revert();
    };
  }, [enabled]);
}
