const canvas = document.getElementById("cleanCanvas");
const progressBar = document.getElementById("cleanProgressBar");
const progressText = document.getElementById("cleanProgressText");
const reward = document.getElementById("cleanReward");
const discountCode = document.getElementById("discountCode");
const rewardWhatsapp = document.getElementById("rewardWhatsapp");
const instruction = document.querySelector(".game-instruction");

if (canvas) {
  const ctx = canvas.getContext("2d");
  const dirtyImage = new Image();

  let drawing = false;
  let lastPoint = null;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let rewardUnlocked = false;

  const columns = 12;
  const rows = 6;
  const cleanedCells = new Set();
  const rewardThreshold = 75;

  dirtyImage.onload = () => {
    const rect = canvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;

    canvasWidth = rect.width;
    canvasHeight = rect.height;

    canvas.width = Math.round(canvasWidth * pixelRatio);
    canvas.height = Math.round(canvasHeight * pixelRatio);

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.globalCompositeOperation = "source-over";

    ctx.drawImage(
      dirtyImage,
      0,
      0,
      canvasWidth,
      canvasHeight
    );
  };
dirtyImage.src = "divano-sporco.PNG?v=7";
  function getPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function erasePoint(x, y) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    recordCleanedArea(x, y);
  }

  function eraseLine(start, end) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 84;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.restore();

    const distance = Math.hypot(
      end.x - start.x,
      end.y - start.y
    );

    const steps = Math.max(1, Math.ceil(distance / 18));

    for (let i = 0; i <= steps; i++) {
      const x = start.x + ((end.x - start.x) * i) / steps;
      const y = start.y + ((end.y - start.y) * i) / steps;

      recordCleanedArea(x, y);
    }
  }

  function recordCleanedArea(x, y) {
    if (rewardUnlocked || !canvasWidth || !canvasHeight) {
      return;
    }

    const column = Math.floor((x / canvasWidth) * columns);
    const row = Math.floor((y / canvasHeight) * rows);

    for (let offsetX = -1; offsetX <= 1; offsetX++) {
      for (let offsetY = -1; offsetY <= 1; offsetY++) {
        if (Math.abs(offsetX) + Math.abs(offsetY) > 1) {
          continue;
        }

        const currentColumn = column + offsetX;
        const currentRow = row + offsetY;

        if (
          currentColumn >= 0 &&
          currentColumn < columns &&
          currentRow >= 0 &&
          currentRow < rows
        ) {
          cleanedCells.add(
            `${currentColumn}-${currentRow}`
          );
        }
      }
    }

    updateProgress();
  }

  function updateProgress() {
    const totalCells = columns * rows;

    const percentage = Math.min(
      100,
      Math.round((cleanedCells.size / totalCells) * 100)
    );

    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }

    if (progressText) {
      progressText.textContent = `${percentage}%`;
    }

    if (percentage >= rewardThreshold) {
      unlockReward();
    }
  }

  function createDiscountCode() {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let randomPart = "";

    for (let i = 0; i < 4; i++) {
      randomPart += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return `LINDO-${randomPart}`;
  }

  function unlockReward() {
    if (rewardUnlocked) {
      return;
    }

    rewardUnlocked = true;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (progressBar) {
      progressBar.style.width = "100%";
    }

    if (progressText) {
      progressText.textContent = "100%";
    }

    if (instruction) {
      instruction.textContent = "✨ Pulizia completata!";
    }

    const code = createDiscountCode();

    if (discountCode) {
      discountCode.textContent = code;
    }

    if (rewardWhatsapp) {
      const message =
        `Ciao! Ho completato il gioco sul sito ` +
        `e ho ottenuto il codice ${code} per 10 € di sconto.`;

      rewardWhatsapp.href =
        `https://wa.me/393514191936?text=${encodeURIComponent(message)}`;
    }

    if (reward) {
      reward.hidden = false;
    }
    
    confetti({
  particleCount: 140,
  spread: 80,
  startVelocity: 35,
  origin: { y: 0.65 },
  colors: ["#ff4d94", "#6fd3ff", "#ffffff"]
});

setTimeout(() => {
  confetti({
    particleCount: 90,
    spread: 120,
    origin: { y: 0.65 },
    colors: ["#ff4d94", "#6fd3ff"]
  });
}, 250);
  }

  canvas.addEventListener("pointerdown", event => {
    event.preventDefault();

    drawing = true;
    lastPoint = getPosition(event);

    canvas.setPointerCapture?.(event.pointerId);
    erasePoint(lastPoint.x, lastPoint.y);
  });

  canvas.addEventListener("pointermove", event => {
    if (!drawing) {
      return;
    }

    event.preventDefault();

    const currentPoint = getPosition(event);

    eraseLine(lastPoint, currentPoint);
    lastPoint = currentPoint;
  });

  function stopDrawing(event) {
    drawing = false;
    lastPoint = null;

    if (
      event &&
      canvas.hasPointerCapture?.(event.pointerId)
    ) {
      canvas.releasePointerCapture(event.pointerId);
    }
  }

  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointercancel", stopDrawing);
}
const counters = document.querySelectorAll(".counter");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        counters.forEach((counter, index) => {
            setTimeout(() => {
                const target = Number(counter.dataset.target);
                let current = 0;

                const step = Math.max(1, Math.ceil(target / 80));

                const timer = setInterval(() => {
                    current += step;

                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }

                    counter.textContent = current;
                }, 20);

            }, index * 180);
        });

        observer.disconnect();
    });
});

const cards = document.querySelector(".cards");
if (cards) observer.observe(cards);
