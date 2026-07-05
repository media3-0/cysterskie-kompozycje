document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const buttons = document.querySelectorAll(".demo-switcher button");
  const variants = ["natural", "mist", "glitch"];

  let controller = null;

  if (window.ForestBackground) {
    controller = window.ForestBackground.create({
      target: "#background-demo",
      imagePath: "../las_tlo.png",
      variant: "natural",
    });
  }

  function setVariant(nextVariant) {
    if (!variants.includes(nextVariant)) {
      return;
    }

    buttons.forEach((button) => {
      const isCurrent = button.dataset.variant === nextVariant;
      button.classList.toggle("is-current", isCurrent);
      button.setAttribute("aria-pressed", String(isCurrent));
    });

    if (controller) {
      controller.setVariant(nextVariant);
    }

    body.dataset.variant = nextVariant;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => setVariant(button.dataset.variant));
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

  setVariant("natural");
});
