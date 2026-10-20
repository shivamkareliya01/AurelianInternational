import { useEffect, useRef } from "react";

// ===========================================================================
// Global Reference-Counted Scroll Lock Manager
// Guarantees zero dangling locks, safe nested dialogs, and instant restoration
// ===========================================================================

let lockCount = 0;
let savedScrollY = 0;
let prevHtmlOverflow = "";
let prevHtmlPosition = "";
let prevBodyOverflow = "";
let prevBodyPosition = "";
let prevBodyTop = "";
let prevBodyPaddingRight = "";

export function lockScroll(): void {
  if (typeof document === "undefined") return;

  if (lockCount === 0) {
    savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    prevHtmlOverflow = document.documentElement.style.overflow;
    prevHtmlPosition = document.documentElement.style.position;
    prevBodyOverflow = document.body.style.overflow;
    prevBodyPosition = document.body.style.position;
    prevBodyTop = document.body.style.top;
    prevBodyPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Set overflow: hidden on html and body to lock page without losing scroll coordinates
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  lockCount++;
}

export function unlockScroll(restoreScrollPosition = true): void {
  if (typeof document === "undefined") return;

  lockCount = Math.max(0, lockCount - 1);

  if (lockCount === 0) {
    document.documentElement.style.overflow = prevHtmlOverflow || "";
    document.documentElement.style.position = prevHtmlPosition || "";
    document.body.style.overflow = prevBodyOverflow || "";
    document.body.style.position = prevBodyPosition || "";
    document.body.style.top = prevBodyTop || "";
    document.body.style.paddingRight = prevBodyPaddingRight || "";

    // Emergency cleanup in case inline residue remains
    if (document.documentElement.style.overflow === "hidden") {
      document.documentElement.style.overflow = "";
    }
    if (document.body.style.overflow === "hidden") {
      document.body.style.overflow = "";
    }
    if (document.body.style.position === "fixed") {
      document.body.style.position = "";
    }
    if (document.body.style.top) {
      document.body.style.top = "";
    }

    if (restoreScrollPosition && typeof savedScrollY === "number" && savedScrollY >= 0) {
      window.scrollTo({ top: savedScrollY, behavior: "instant" });
    }
  }
}

export function forceUnlockScroll(): void {
  if (typeof document === "undefined") return;
  lockCount = 0;
  document.documentElement.style.overflow = "";
  document.documentElement.style.position = "";
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.paddingRight = "";
}

export function checkScrollLockSafety(): void {
  if (typeof document === "undefined") return;
  const activeDialogs = document.querySelectorAll(
    '[role="dialog"], [aria-modal="true"], [data-state="open"][role="dialog"]'
  );
  if (activeDialogs.length === 0) {
    if (
      lockCount > 0 ||
      document.documentElement.style.overflow === "hidden" ||
      document.body.style.overflow === "hidden"
    ) {
      forceUnlockScroll();
    }
  }
}

/**
 * Hook to automatically acquire and release scroll lock based on open state.
 * Releases safely on unmount, route transition, or unexpected error.
 */
export function useScrollLock(isLocked: boolean): void {
  const lockedRef = useRef(false);

  useEffect(() => {
    if (isLocked) {
      lockScroll();
      lockedRef.current = true;
    } else if (lockedRef.current) {
      unlockScroll(true);
      lockedRef.current = false;
    }

    return () => {
      if (lockedRef.current) {
        unlockScroll(true);
        lockedRef.current = false;
      }
      setTimeout(checkScrollLockSafety, 20);
    };
  }, [isLocked]);
}

// Global safety net: On route changes or popstate, force unlock if no modal exists
if (typeof window !== "undefined") {
  const safetyCheck = () => {
    setTimeout(checkScrollLockSafety, 60);
  };

  window.addEventListener("popstate", safetyCheck, { passive: true });
  window.addEventListener("hashchange", safetyCheck, { passive: true });
  window.addEventListener("pageshow", safetyCheck, { passive: true });
}
