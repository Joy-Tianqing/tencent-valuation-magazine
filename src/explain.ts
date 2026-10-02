type Explanation = { title: string; body: string };

const dataElement = document.getElementById("explain-data");
const notes: Record<string, Explanation> = JSON.parse(
  dataElement?.textContent ?? "{}",
);
const triggers = document.querySelectorAll<HTMLButtonElement>(
  "button.explain[data-note]",
);

const popover = document.createElement("div");
popover.className = "explain-popover";
popover.id = "explain-popover";
popover.setAttribute("role", "tooltip");
popover.hidden = true;
popover.innerHTML =
  '<span class="explain-popover-kicker">术语与口径</span><strong class="explain-popover-title"></strong><p class="explain-popover-body"></p>';
document.body.append(popover);

const titleElement = popover.querySelector<HTMLElement>(
  ".explain-popover-title",
)!;
const bodyElement = popover.querySelector<HTMLElement>(
  ".explain-popover-body",
)!;
let active: HTMLButtonElement | null = null;
let pinned = false;

function close(): void {
  active?.removeAttribute("aria-describedby");
  active = null;
  pinned = false;
  popover.hidden = true;
}

function position(button: HTMLButtonElement): void {
  const rect = button.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > window.innerHeight) {
    close();
    return;
  }
  const width = popover.offsetWidth;
  const height = popover.offsetHeight;
  const left = Math.max(
    12,
    Math.min(
      rect.left + rect.width / 2 - width / 2,
      window.innerWidth - width - 12,
    ),
  );
  const below = rect.bottom + height + 12 <= window.innerHeight;
  const top = below ? rect.bottom + 10 : Math.max(12, rect.top - height - 10);
  popover.style.left = `${left}px`;
  popover.style.top = `${top}px`;
  popover.dataset.placement = below ? "bottom" : "top";
}

function open(button: HTMLButtonElement, lock = false): void {
  const note = notes[button.dataset.note ?? ""];
  if (!note) return;
  if (active && active !== button) active.removeAttribute("aria-describedby");
  active = button;
  pinned = lock;
  titleElement.textContent = note.title;
  bodyElement.textContent = note.body;
  popover.hidden = false;
  button.setAttribute("aria-describedby", popover.id);
  position(button);
}

for (const button of triggers) {
  button.removeAttribute("title");
  button.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      if (active !== button || !pinned) open(button);
    }
  });
  button.addEventListener("pointerleave", () => {
    if (!pinned && document.activeElement !== button) close();
  });
  button.addEventListener("focus", () => open(button));
  button.addEventListener("blur", () => {
    if (active === button) close();
  });
  button.addEventListener("click", () => {
    if (active === button && pinned) close();
    else open(button, true);
  });
}

document.addEventListener("pointerdown", (event) => {
  if (pinned && !(event.target as Element).closest?.("button.explain")) close();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") close();
});
window.addEventListener("resize", () => active && position(active));
window.addEventListener("scroll", () => active && position(active), {
  capture: true,
  passive: true,
});
