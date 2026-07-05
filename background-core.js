(function () {
  const ENGINE_BUILD = "bg-v6";
  const LOOP_DURATION = 22000;

  const VARIANTS = Object.freeze({
    natural: {
      globalShift: 1.9,
      globalRotate: 0.0018,
      globalScaleX: 1.0078,
      globalScaleY: 1.0058,
      baseOverlayAlpha: 0.085,
      veilShift: 1.8,
      veilAlpha: 0.094,
      ribbonShift: 1.18,
      ribbonLift: 0.46,
      ribbonAlpha: 0.086,
      zoneShift: 5.2,
      zoneRotate: 0.015,
      zoneStretch: 0.034,
      zoneSqueeze: 0.024,
      zoneShear: 0.014,
      zoneBrightness: 11.5,
      zoneAlpha: 0.34,
      zoneBlur: 5,
      pixelShift: 2.6,
      pixelAlpha: 0.18,
      pixelBrightAlpha: 0.11,
      pixelDarkAlpha: 0.09,
      pixelGhostAlpha: 0.08,
      mistAlpha: 0.085,
      mistColor: [114, 143, 107, 18],
      tintColor: [102, 128, 96, 12],
      vignetteTop: [4, 8, 5, 20],
      vignetteBottom: [3, 5, 4, 78],
    },
    mist: {
      globalShift: 2.2,
      globalRotate: 0.002,
      globalScaleX: 1.0081,
      globalScaleY: 1.0061,
      baseOverlayAlpha: 0.09,
      veilShift: 2.0,
      veilAlpha: 0.102,
      ribbonShift: 1.34,
      ribbonLift: 0.54,
      ribbonAlpha: 0.082,
      zoneShift: 5.8,
      zoneRotate: 0.016,
      zoneStretch: 0.037,
      zoneSqueeze: 0.028,
      zoneShear: 0.015,
      zoneBrightness: 12.8,
      zoneAlpha: 0.36,
      zoneBlur: 6,
      pixelShift: 2.4,
      pixelAlpha: 0.16,
      pixelBrightAlpha: 0.1,
      pixelDarkAlpha: 0.08,
      pixelGhostAlpha: 0.072,
      mistAlpha: 0.12,
      mistColor: [168, 194, 160, 18],
      tintColor: [133, 160, 126, 13],
      vignetteTop: [10, 17, 12, 18],
      vignetteBottom: [5, 9, 6, 56],
    },
    glitch: {
      globalShift: 2.6,
      globalRotate: 0.0024,
      globalScaleX: 1.009,
      globalScaleY: 1.0067,
      baseOverlayAlpha: 0.1,
      veilShift: 2.3,
      veilAlpha: 0.11,
      ribbonShift: 1.58,
      ribbonLift: 0.64,
      ribbonAlpha: 0.11,
      zoneShift: 6.8,
      zoneRotate: 0.019,
      zoneStretch: 0.043,
      zoneSqueeze: 0.032,
      zoneShear: 0.018,
      zoneBrightness: 15,
      zoneAlpha: 0.42,
      zoneBlur: 6,
      pixelShift: 3.0,
      pixelAlpha: 0.22,
      pixelBrightAlpha: 0.14,
      pixelDarkAlpha: 0.11,
      pixelGhostAlpha: 0.1,
      mistAlpha: 0.075,
      mistColor: [94, 118, 88, 18],
      tintColor: [86, 108, 80, 14],
      vignetteTop: [3, 5, 4, 28],
      vignetteBottom: [2, 4, 3, 96],
    },
  });

  function resolveTarget(target) {
    if (typeof target === "string") {
      return document.querySelector(target) || document.body;
    }

    return target || document.body;
  }

  function rgba(color, alphaMultiplier = 1) {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${(color[3] / 255) * alphaMultiplier})`;
  }

  function createRng(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function loopNoise(seed, time) {
    return (
      Math.sin(time + seed * 1.13) * 0.52 +
      Math.sin(time * 0.47 + seed * 2.07) * 0.28 +
      Math.cos(time * 0.21 + seed * 0.71) * 0.2
    );
  }

  function createSceneData() {
    const rng = createRng(27);

    const breathingZones = [
      { x: 0.17, y: 0.28, width: 0.23, height: 0.22, rotation: -0.08, phase: 0.2, seed: 1.2, weight: 0.86, alpha: 0.9 },
      { x: 0.36, y: 0.2, width: 0.18, height: 0.18, rotation: 0.05, phase: 1.05, seed: 2.5, weight: 0.68, alpha: 0.72 },
      { x: 0.53, y: 0.31, width: 0.26, height: 0.24, rotation: -0.03, phase: 1.9, seed: 3.8, weight: 0.92, alpha: 0.92 },
      { x: 0.72, y: 0.37, width: 0.25, height: 0.29, rotation: 0.06, phase: 2.85, seed: 5.1, weight: 0.96, alpha: 0.82 },
      { x: 0.22, y: 0.74, width: 0.34, height: 0.16, rotation: -0.05, phase: 3.55, seed: 6.4, weight: 0.62, alpha: 0.62 },
      { x: 0.54, y: 0.67, width: 0.28, height: 0.19, rotation: 0.06, phase: 4.3, seed: 7.7, weight: 0.7, alpha: 0.68 },
      { x: 0.82, y: 0.76, width: 0.2, height: 0.21, rotation: -0.04, phase: 5.15, seed: 9.0, weight: 0.6, alpha: 0.58 },
    ];

    const flowBands = [
      { y: 0.11, height: 0.022, phase: 0.22, seed: 0.8, weight: 0.5, alpha: 0.5 },
      { y: 0.19, height: 0.028, phase: 0.88, seed: 1.9, weight: 0.6, alpha: 0.46 },
      { y: 0.31, height: 0.032, phase: 1.7, seed: 3.2, weight: 0.68, alpha: 0.5 },
      { y: 0.46, height: 0.034, phase: 2.55, seed: 4.5, weight: 0.74, alpha: 0.54 },
      { y: 0.63, height: 0.038, phase: 3.35, seed: 5.8, weight: 0.72, alpha: 0.5 },
      { y: 0.8, height: 0.045, phase: 4.18, seed: 7.1, weight: 0.82, alpha: 0.56 },
      { y: 0.9, height: 0.038, phase: 5.1, seed: 8.4, weight: 0.76, alpha: 0.48 },
    ];

    const imageVeils = [
      { phase: 0.18, rate: 0.28, weight: 0.58, alpha: 0.7 },
      { phase: 2.22, rate: 0.21, weight: 0.82, alpha: 0.62 },
      { phase: 4.55, rate: 0.25, weight: 0.5, alpha: 0.54 },
    ];

    const mistPockets = [
      { x: 0.18, y: 0.24, radius: 0.18, phase: 0.62, rate: 0.16 },
      { x: 0.56, y: 0.32, radius: 0.22, phase: 2.34, rate: 0.12 },
      { x: 0.47, y: 0.7, radius: 0.19, phase: 3.82, rate: 0.14 },
      { x: 0.82, y: 0.57, radius: 0.2, phase: 5.08, rate: 0.11 },
    ];

    const microPixels = Array.from({ length: 220 }, (_, index) => ({
      x: 0.035 + rng() * 0.93,
      y: 0.045 + rng() * 0.9,
      size: 1 + Math.floor(rng() * 3),
      phase: rng() * Math.PI * 2,
      rate: 0.16 + rng() * 0.22,
      alpha: 0.45 + rng() * 0.45,
      weight: 0.4 + rng() * 0.6,
      mode: Math.floor(rng() * 4),
      seed: 12 + index * 0.41,
      color: [220, 220, 220, 255],
    }));

    return {
      breathingZones,
      flowBands,
      imageVeils,
      mistPockets,
      microPixels,
    };
  }

  function createP5Engine(options = {}) {
    const target = resolveTarget(options.target);
    const imagePath = options.imagePath || "las_tlo.png";
    const initialVariant = VARIANTS[options.variant] ? options.variant : "natural";
    const scene = createSceneData();

    let activeKey = initialVariant;
    let activeVariant = { ...VARIANTS[initialVariant] };
    let instance = null;

    function setVariant(nextVariant) {
      if (VARIANTS[nextVariant]) {
        activeKey = nextVariant;
        activeVariant = { ...VARIANTS[nextVariant] };
      }
    }

    const sketch = (p) => {
      let sourceImage;
      let coverBuffer;
      let zoneLayer;
      let maskLayer;

      function getBounds() {
        const rect = target.getBoundingClientRect();

        return {
          width: Math.max(320, Math.round(rect.width || window.innerWidth)),
          height: Math.max(320, Math.round(rect.height || window.innerHeight)),
        };
      }

      function fitCoverImage(buffer) {
        const canvasRatio = buffer.width / buffer.height;
        const imageRatio = sourceImage.width / sourceImage.height;

        let drawWidth = buffer.width;
        let drawHeight = buffer.height;
        let drawX = 0;
        let drawY = 0;

        if (imageRatio > canvasRatio) {
          drawHeight = buffer.height;
          drawWidth = drawHeight * imageRatio;
          drawX = (buffer.width - drawWidth) * 0.5;
        } else {
          drawWidth = buffer.width;
          drawHeight = drawWidth / imageRatio;
          drawY = (buffer.height - drawHeight) * 0.5;
        }

        buffer.clear();
        buffer.image(sourceImage, drawX, drawY, drawWidth, drawHeight);
      }

      function rebuildBuffers() {
        const width = p.width;
        const height = p.height;

        coverBuffer?.remove?.();
        zoneLayer?.remove?.();
        maskLayer?.remove?.();

        coverBuffer = p.createGraphics(width, height);
        zoneLayer = p.createGraphics(width, height);
        maskLayer = p.createGraphics(width, height);

        [coverBuffer, zoneLayer, maskLayer].forEach((buffer) => {
          buffer.pixelDensity(1);
          buffer.noStroke();
          if (buffer.elt) {
            buffer.elt.classList.add("forest-buffer-canvas");
            buffer.elt.setAttribute("aria-hidden", "true");
            buffer.elt.style.display = "none";
            buffer.elt.style.visibility = "hidden";
            buffer.elt.style.pointerEvents = "none";
            buffer.elt.style.position = "fixed";
            buffer.elt.style.left = "-99999px";
            buffer.elt.style.top = "-99999px";
          }
        });

        fitCoverImage(coverBuffer);
        sampleMicroColors();
      }

      function sampleMicroColors() {
        scene.microPixels.forEach((pixel) => {
          const x = Math.max(0, Math.min(coverBuffer.width - 1, Math.floor(pixel.x * coverBuffer.width)));
          const y = Math.max(0, Math.min(coverBuffer.height - 1, Math.floor(pixel.y * coverBuffer.height)));
          pixel.color = coverBuffer.get(x, y);
        });
      }

      function imagePass(graphics, options = {}) {
        const width = graphics.width + 10;
        const height = graphics.height + 10;
        const ctx = graphics.drawingContext;

        graphics.push();
        graphics.translate(graphics.width * 0.5 + (options.dx || 0), graphics.height * 0.5 + (options.dy || 0));
        graphics.rotate(options.rotate || 0);
        graphics.shearX(options.shearX || 0);
        graphics.shearY(options.shearY || 0);
        graphics.scale(options.scaleX || 1, options.scaleY || 1);
        ctx.save();
        ctx.globalAlpha = options.alpha == null ? 1 : options.alpha;
        ctx.globalCompositeOperation = options.composite || "source-over";
        ctx.filter = `${options.blur ? `blur(${options.blur}px) ` : ""}brightness(${options.brightness || 100}%)`;
        graphics.image(coverBuffer, -width * 0.5, -height * 0.5, width, height);
        ctx.restore();
        graphics.pop();
      }

      function drawFeatherMask(zone, rotate) {
        const x = zone.x * p.width;
        const y = zone.y * p.height;
        const w = zone.width * p.width;
        const h = zone.height * p.height;
        const ctx = maskLayer.drawingContext;

        maskLayer.clear();
        maskLayer.push();
        maskLayer.translate(x, y);
        maskLayer.rotate(rotate);
        ctx.save();
        ctx.filter = "blur(16px)";
        maskLayer.fill(255, 250);
        maskLayer.ellipse(0, 0, w * 0.48, h * 0.48);
        maskLayer.fill(255, 170);
        maskLayer.ellipse(0, 0, w * 0.68, h * 0.68);
        maskLayer.fill(255, 76);
        maskLayer.ellipse(0, 0, w * 0.88, h * 0.88);
        ctx.restore();
        maskLayer.pop();
      }

      function drawBaseFrame(loopAngle, driftTime) {
        const baseShiftX =
          (Math.sin(loopAngle) * 0.62 + loopNoise(1.1, driftTime * 0.1) * 0.38) *
          activeVariant.globalShift *
          0.92;
        const baseShiftY =
          (Math.cos(loopAngle * 0.81 + 0.35) * 0.58 + loopNoise(2.7, driftTime * 0.08) * 0.42) *
          activeVariant.globalShift *
          0.58;
        const baseRotate =
          Math.sin(driftTime * 0.06 + 0.22) * activeVariant.globalRotate * 1.45;
        const baseScaleX =
          1 +
          (activeVariant.globalScaleX - 1) * 0.72 +
          Math.sin(loopAngle + 0.4) * 0.0011;
        const baseScaleY =
          1 +
          (activeVariant.globalScaleY - 1) * 0.72 +
          Math.cos(loopAngle + 0.85) * 0.0009;
        const baseShearX = Math.sin(driftTime * 0.045 + 0.7) * 0.0018;
        const baseShearY = Math.cos(driftTime * 0.038 + 0.2) * 0.0012;

        imagePass(p, {
          dx: baseShiftX,
          dy: baseShiftY,
          rotate: baseRotate,
          shearX: baseShearX,
          shearY: baseShearY,
          scaleX: baseScaleX,
          scaleY: baseScaleY,
          brightness: 100.4,
        });

        imagePass(p, {
          dx: Math.sin(loopAngle) * activeVariant.globalShift,
          dy: Math.cos(loopAngle * 0.82) * activeVariant.globalShift * 0.6,
          rotate: Math.sin(driftTime * 0.13) * activeVariant.globalRotate,
          scaleX: activeVariant.globalScaleX + Math.sin(loopAngle + 0.4) * 0.00045,
          scaleY: activeVariant.globalScaleY + Math.cos(loopAngle + 0.9) * 0.00035,
          composite: "screen",
          alpha: activeVariant.baseOverlayAlpha,
          brightness: 102,
        });

        imagePass(p, {
          dx: Math.cos(driftTime * 0.11 + 0.8) * activeVariant.globalShift * 0.45,
          dy: Math.sin(driftTime * 0.09 + 1.2) * activeVariant.globalShift * 0.3,
          rotate: -Math.sin(driftTime * 0.07 + 0.3) * activeVariant.globalRotate * 0.55,
          scaleX: 1.0012,
          scaleY: 1.0008,
          composite: "screen",
          alpha: activeVariant.baseOverlayAlpha * 0.54,
          brightness: 100.8,
        });

        const ctx = p.drawingContext;
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = 0.34;
        ctx.fillStyle = rgba(activeVariant.tintColor);
        ctx.fillRect(0, 0, p.width, p.height);
        ctx.restore();
      }

      function drawVeils(loopAngle, driftTime) {
        scene.imageVeils.forEach((veil) => {
          imagePass(p, {
            dx: Math.sin(driftTime * veil.rate + veil.phase) * activeVariant.veilShift * veil.weight,
            dy: Math.cos(driftTime * (veil.rate * 0.82) + veil.phase) * activeVariant.veilShift * 0.44 * veil.weight,
            rotate: Math.sin(loopAngle + veil.phase) * activeVariant.globalRotate * 0.32,
            scaleX: 1.0016,
            scaleY: 1.0011,
            composite: "screen",
            alpha: activeVariant.veilAlpha * veil.alpha,
            brightness: 101.5,
            blur: 0.6,
          });
        });
      }

      function drawFlowBands(loopAngle, driftTime) {
        const ctx = p.drawingContext;

        ctx.save();
        ctx.globalCompositeOperation = "source-over";

        scene.flowBands.forEach((band) => {
          const y = band.y * p.height;
          const h = Math.max(6, band.height * p.height);
          const dx =
            (Math.sin(loopAngle + band.phase) * 0.3 + loopNoise(band.seed, driftTime * 0.21) * 0.7) *
            activeVariant.ribbonShift *
            band.weight;
          const dy =
            (Math.cos(driftTime * 0.16 + band.phase) * 0.38 + Math.sin(loopAngle * 0.7 + band.phase) * 0.62) *
            activeVariant.ribbonLift *
            band.weight;

          ctx.globalAlpha = activeVariant.ribbonAlpha * band.alpha * 1.14;
          p.image(coverBuffer, dx, y + dy, p.width + 8, h, 0, y, p.width, h);
        });

        ctx.restore();
      }

      function drawMorphZones(loopAngle, driftTime) {
        scene.breathingZones.forEach((zone) => {
          const driftX =
            (Math.sin(loopAngle + zone.phase) * 0.44 + loopNoise(zone.seed, driftTime * 0.17) * 0.56) *
            activeVariant.zoneShift *
            zone.weight;
          const driftY =
            (Math.cos(loopAngle * 0.82 + zone.phase) * 0.42 + loopNoise(zone.seed + 8.2, driftTime * 0.14) * 0.58) *
            activeVariant.zoneShift *
            0.72 *
            zone.weight;
          const rotate =
            zone.rotation +
            Math.sin(driftTime * 0.08 + zone.phase) * activeVariant.zoneRotate * zone.weight;
          const stretch =
            Math.sin(loopAngle * 0.62 + zone.phase) * activeVariant.zoneStretch * zone.weight;
          const squeeze =
            Math.cos(driftTime * 0.11 + zone.phase) * activeVariant.zoneSqueeze * zone.weight;
          const shearX =
            Math.sin(driftTime * 0.09 + zone.phase) * activeVariant.zoneShear * zone.weight;
          const shearY =
            Math.cos(driftTime * 0.07 + zone.phase) * activeVariant.zoneShear * 0.6 * zone.weight;
          const brightness =
            100 + Math.sin(driftTime * 0.06 + zone.phase) * activeVariant.zoneBrightness;

          zoneLayer.clear();

          // Each zone redraws the whole image with a slightly different transform,
          // then we feather it heavily so the morph blends back into the untouched forest.
          imagePass(zoneLayer, {
            dx: driftX,
            dy: driftY,
            rotate,
            shearX,
            shearY,
            scaleX: 1 + stretch,
            scaleY: 1 - squeeze,
            composite: "source-over",
            alpha: activeVariant.zoneAlpha * zone.alpha,
            brightness,
            blur: activeVariant.zoneBlur * 0.42,
          });

          imagePass(zoneLayer, {
            dx: -driftX * 0.16,
            dy: driftY * 0.12,
            rotate: -rotate * 0.4,
            shearX: -shearX * 0.55,
            shearY: shearY * 0.35,
            scaleX: 1 + stretch * 0.55,
            scaleY: 1 + squeeze * 0.16,
            composite: "source-over",
            alpha: activeVariant.zoneAlpha * zone.alpha * 0.42,
            brightness: brightness - 1.4,
            blur: activeVariant.zoneBlur,
          });

          drawFeatherMask(zone, rotate * 0.45);

          const zoneCtx = zoneLayer.drawingContext;
          zoneCtx.save();
          zoneCtx.globalCompositeOperation = "destination-in";
          zoneLayer.image(maskLayer, 0, 0);
          zoneCtx.restore();

          p.image(zoneLayer, 0, 0);
        });
      }

      function drawMicroPixels(loopAngle, driftTime) {
        const ctx = p.drawingContext;

        scene.microPixels.forEach((pixel) => {
          const px = pixel.x * p.width;
          const py = pixel.y * p.height;
          const dx =
            loopNoise(pixel.seed, driftTime * pixel.rate + pixel.phase) *
            activeVariant.pixelShift *
            pixel.weight;
          const dy =
            loopNoise(pixel.seed + 5.2, driftTime * pixel.rate * 0.9 + pixel.phase) *
            activeVariant.pixelShift *
            0.7 *
            pixel.weight;
          const gate = Math.pow(Math.max(0, Math.sin(driftTime * pixel.rate + pixel.phase) * 0.5 + 0.5), 3.4);
          const alpha = activeVariant.pixelAlpha * pixel.alpha * gate;

          if (alpha < 0.003) {
            return;
          }

          p.push();
          p.blendMode(p.BLEND);
          p.tint(255, alpha * 255);
          p.image(coverBuffer, px + dx, py + dy, pixel.size, pixel.size, px, py, pixel.size, pixel.size);
          p.pop();

          ctx.save();

          if (pixel.mode === 0) {
            ctx.globalAlpha = activeVariant.pixelBrightAlpha * gate;
            ctx.fillStyle = `rgb(${Math.min(255, pixel.color[0] + 20)}, ${Math.min(255, pixel.color[1] + 20)}, ${Math.min(255, pixel.color[2] + 20)})`;
            ctx.fillRect(px + dx * 0.6, py + dy * 0.6, pixel.size, pixel.size);
          } else if (pixel.mode === 1) {
            ctx.globalAlpha = activeVariant.pixelDarkAlpha * gate;
            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.fillRect(px, py, pixel.size, pixel.size);
          } else if (pixel.mode === 2) {
            ctx.globalAlpha = activeVariant.pixelGhostAlpha * gate;
            ctx.globalCompositeOperation = "screen";
            ctx.fillStyle = `rgba(${pixel.color[0]}, ${pixel.color[1]}, ${pixel.color[2]}, 1)`;
            ctx.fillRect(px - dx * 0.4, py + dy * 0.25, pixel.size, pixel.size);
          } else {
            ctx.globalAlpha = activeVariant.pixelDarkAlpha * gate * 0.72;
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fillRect(px + Math.sign(dx || 1), py + Math.sign(dy || 1), 1, 1);
          }

          ctx.restore();
        });
      }

      function drawAtmosphere(driftTime) {
        const ctx = p.drawingContext;

        scene.mistPockets.forEach((mist) => {
          const x = mist.x * p.width + Math.sin(driftTime * mist.rate + mist.phase) * p.width * 0.006;
          const y = mist.y * p.height + Math.cos(driftTime * mist.rate * 0.85 + mist.phase) * p.height * 0.006;
          const radius = mist.radius * Math.min(p.width, p.height);
          const gradient = ctx.createRadialGradient(x, y, radius * 0.08, x, y, radius);

          gradient.addColorStop(0, rgba(activeVariant.mistColor, 1));
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.save();
          ctx.globalAlpha = activeVariant.mistAlpha;
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        const vignette = ctx.createLinearGradient(0, 0, 0, p.height);
        vignette.addColorStop(0, rgba(activeVariant.vignetteTop));
        vignette.addColorStop(0.48, "rgba(0, 0, 0, 0)");
        vignette.addColorStop(1, rgba(activeVariant.vignetteBottom));

        ctx.save();
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, p.width, p.height);
        ctx.restore();
      }

      p.preload = () => {
        // preload() keeps the first frame coherent: the morph starts only after the source image exists.
        sourceImage = p.loadImage(imagePath);
      };

      p.setup = () => {
        const bounds = getBounds();

        target.innerHTML = "";
        target.classList.add("is-live");

        const canvas = p.createCanvas(bounds.width, bounds.height);
        canvas.parent(target);
        canvas.addClass("forest-background-canvas");

        p.pixelDensity(1);
        p.noStroke();
        p.frameRate(36);

        rebuildBuffers();
        window.__forestDebug.mode = "p5-setup";
        window.__forestDebug.variant = activeKey;
        window.__forestDebug.build = ENGINE_BUILD;
      };

      p.windowResized = () => {
        const bounds = getBounds();

        p.resizeCanvas(bounds.width, bounds.height);
        rebuildBuffers();
      };

      p.draw = () => {
        const driftTime = p.millis() * 0.0022;
        const loopAngle = ((p.millis() % LOOP_DURATION) / LOOP_DURATION) * p.TWO_PI;

        window.__forestDebug.frames += 1;
        window.__forestDebug.mode = "p5-draw";
        window.__forestDebug.variant = activeKey;
        window.__forestDebug.lastMillis = p.millis();
        window.__forestDebug.build = ENGINE_BUILD;

        p.clear();
        drawBaseFrame(loopAngle, driftTime);
        drawVeils(loopAngle, driftTime);
        drawFlowBands(loopAngle, driftTime);
        drawMorphZones(loopAngle, driftTime);
        drawMicroPixels(loopAngle, driftTime);
        drawAtmosphere(driftTime);
      };
    };

    instance = new window.p5(sketch);

    return {
      setVariant,
      getVariant() {
        return activeKey;
      },
      variants: VARIANTS,
      mode: "p5",
      destroy() {
        instance?.remove?.();
      },
    };
  }

  function createNoopEngine(options = {}) {
    const fallbackKey = VARIANTS[options.variant] ? options.variant : "natural";

    return {
      setVariant() {},
      getVariant() {
        return fallbackKey;
      },
      variants: VARIANTS,
      mode: "missing-p5",
    };
  }

  window.ForestBackground = {
    create(options) {
      if (!window.p5) {
        console.warn("ForestBackground: p5.js is not available.");
        return createNoopEngine(options);
      }

      return createP5Engine(options);
    },
    loopDuration: LOOP_DURATION,
    variants: VARIANTS,
  };

  window.__forestDebug = window.__forestDebug || {
    frames: 0,
    mode: "init",
    variant: "natural",
    lastMillis: 0,
    build: ENGINE_BUILD,
  };
})();
