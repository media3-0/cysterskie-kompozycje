document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const textStack = document.querySelector("#text-stack");
  const textFrame = textStack.querySelector(".text-frame");
  const shadowLayers = textStack.querySelectorAll(".text-shadow-layer");
  const menuLinks = document.querySelectorAll(".menu-link");
  const variantButtons = document.querySelectorAll(".variant-chip");
  const variantOrder = ["natural", "mist", "glitch"];

  shadowLayers.forEach((layer) => {
    layer.innerHTML = textFrame.innerHTML;
  });

  menuLinks.forEach((button) => {
    button.addEventListener("click", () => {
      menuLinks.forEach((item) => {
        item.classList.remove("is-active");
        item.removeAttribute("aria-current");
      });

      button.classList.add("is-active");
      button.setAttribute("aria-current", "page");
    });
  });

  let backgroundController = null;

  if (window.ForestBackground) {
    backgroundController = window.ForestBackground.create({
      target: "#background-stage",
      imagePath: "las_tlo.png",
      variant: body.dataset.variant || "natural",
    });
  }

  function setVariant(nextVariant) {
    if (!variantOrder.includes(nextVariant)) {
      return;
    }

    body.dataset.variant = nextVariant;

    variantButtons.forEach((button) => {
      const isCurrent = button.dataset.variant === nextVariant;
      button.classList.toggle("is-current", isCurrent);
      button.setAttribute("aria-pressed", String(isCurrent));
    });

    if (backgroundController) {
      backgroundController.setVariant(nextVariant);
    }
  }

  variantButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setVariant(button.dataset.variant);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "1") {
      setVariant("natural");
    }

    if (event.key === "2") {
      setVariant("mist");
    }

    if (event.key === "3") {
      setVariant("glitch");
    }
  });

  setVariant(body.dataset.variant || "natural");
});
