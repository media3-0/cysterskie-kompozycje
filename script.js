document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const textStack = document.querySelector("#text-stack");
  const textFrame = textStack.querySelector(".text-frame");
  const shadowLayers = textStack.querySelectorAll(".text-shadow-layer");
  const menuLinks = document.querySelectorAll(".menu-link");
  const sections = document.querySelectorAll(".frame-section");
  const homeSection = document.querySelector('.frame-section[data-section="glowna"]');
  const variantButtons = document.querySelectorAll(".variant-chip");
  const variantOrder = ["natural", "mist", "glitch"];

  // Poświata „ghost" odzwierciedla tylko treść strony głównej (krótką).
  function syncShadows() {
    shadowLayers.forEach((layer) => {
      layer.innerHTML = homeSection ? homeSection.innerHTML : "";
    });
  }
  syncShadows();

  function showSection(name) {
    let matched = false;
    sections.forEach((sec) => {
      const isActive = sec.dataset.section === name;
      sec.classList.toggle("is-active", isActive);
      if (isActive) matched = true;
    });
    if (!matched) {
      // fallback do strony głównej
      name = "glowna";
      sections.forEach((sec) => sec.classList.toggle("is-active", sec.dataset.section === "glowna"));
    }
    body.dataset.activeSection = name;

    menuLinks.forEach((link) => {
      const isCurrent = link.dataset.section === name;
      link.classList.toggle("is-active", isCurrent);
      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    // przewiń ramkę na początek przy zmianie sekcji
    if (textFrame) textFrame.scrollTop = 0;
  }

  menuLinks.forEach((link) => {
    // pomiń linki nawigujące do innych stron (np. Mapa)
    if (!link.dataset.section) return;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const name = link.dataset.section;
      showSection(name);
      if (history.replaceState) {
        history.replaceState(null, "", name === "glowna" ? "#" : "#" + name);
      }
    });
  });

  // linki-skróty wewnątrz treści (np. do sekcji)
  document.querySelectorAll("[data-goto]").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      showSection(el.dataset.goto);
    });
  });

  // deep-link z hasha
  const initial = (location.hash || "").replace("#", "");
  if (initial) {
    showSection(initial);
  } else {
    showSection("glowna");
  }

  // ----- Lightbox galerii -----
  const gallery = document.getElementById("gallery");
  const lightbox = document.getElementById("lightbox");
  if (gallery && lightbox) {
    const lbImg = document.getElementById("lb-img");
    gallery.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-full]");
      if (!btn) return;
      lbImg.src = btn.dataset.full;
      const im = btn.querySelector("img");
      lbImg.alt = im ? im.alt : "";
      lightbox.classList.add("open");
    });
    const closeLb = () => {
      lightbox.classList.remove("open");
      lbImg.src = "";
    };
    lightbox.addEventListener("click", closeLb);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLb();
    });
  }

  // ----- Tło leśne -----
  let backgroundController = null;
  if (window.ForestBackground) {
    backgroundController = window.ForestBackground.create({
      target: "#background-stage",
      imagePath: "las_tlo.png",
      variant: body.dataset.variant || "natural",
    });
  }

  function setVariant(nextVariant) {
    if (!variantOrder.includes(nextVariant)) return;
    body.dataset.variant = nextVariant;
    variantButtons.forEach((button) => {
      const isCurrent = button.dataset.variant === nextVariant;
      button.classList.toggle("is-current", isCurrent);
      button.setAttribute("aria-pressed", String(isCurrent));
    });
    if (backgroundController) backgroundController.setVariant(nextVariant);
  }

  variantButtons.forEach((button) => {
    button.addEventListener("click", () => setVariant(button.dataset.variant));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "1") setVariant("natural");
    if (event.key === "2") setVariant("mist");
    if (event.key === "3") setVariant("glitch");
  });

  setVariant(body.dataset.variant || "natural");
});
