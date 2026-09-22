import type { MouseEvent } from "react";

/** Move within this document without creating a separate native hash history entry. */
export function navigateToTILAnchor(event: MouseEvent<HTMLAnchorElement>, id: string) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  // Preserve the framework's current route state for back/forward navigation.
  window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}#${id}`);
  target.focus({ preventScroll: true });
  target.scrollIntoView({ block: "start", behavior: "instant" });
}
