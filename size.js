const h = Object.fromEntries([
  "size",
  "width",
  "hero",
  "showpath"
].map(e => [e, document.getElementById(e)]));

// Watch the size of the hero to set its ---cqiscale
const resizeObserver = new ResizeObserver(([entry]) => {
  const { contentBoxSize: [{ inlineSize }] } = entry;
  entry.target.style.setProperty('--cqiscale', inlineSize / 100);
});

// Watch the size of the hero to set its ---cqiscale
const pathTracer = new ResizeObserver(([entry]) => {
  const details = document.querySelector(".details");
  const top = details.offsetTop;
  const left = details.offsetLeft;

  const marker = document.createElement("div");
  marker.className = "marker";
  marker.style.top = `${top}px`;
  marker.style.left = `${left}px`;

  entry.target.appendChild(marker);
});

if (h.hero.hasAttribute("data-observe-resize")) {
  resizeObserver.observe(h.hero);
}

if (h.showpath) {
  h.showpath.addEventListener("input", () => {
    if (h.showpath.checked) {
      pathTracer.observe(h.hero);
    }
    else {
      pathTracer.disconnect();
      document.querySelectorAll(".marker").forEach(e => e.remove());
    }
  });
}

// Watch the slider to resize the hero
size.addEventListener("input", () => {
  h.hero.style.setProperty("max-width", `${h.size.value}px`);
  h.width.innerText = size.value;
});
