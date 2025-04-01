const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const timerDisplay = document.getElementById("timer");
const comboDisplay = document.getElementById("combo");
const multiplierDisplay = document.getElementById("multiplier");
const restartButton = document.getElementById("restartButton");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let timeLeft = 30;
let timerInterval;
let combo = 0;
let multiplier = 1;
let lastClickTime = null;
let gameActive = false;

highScoreDisplay.textContent = highScore;

function spawnDot() {
  if (!gameActive) return;

  const dot = document.createElement("div");
  dot.classList.add("dot");

  const size = 30;
  dot.style.width = `${size}px`;
  dot.style.height = `${size}px`;

  const x = Math.random() * (gameArea.clientWidth - size);
  const y = Math.random() * (gameArea.clientHeight - size);

  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;

  dot.onclick = () => {
    const now = Date.now();

    // Combo timing logic
    if (lastClickTime && now - lastClickTime <= 2000) {
      combo++;
    } else {
      combo = 1;
    }
    lastClickTime = now;

    multiplier = 1 + Math.floor(combo / 5);
    score += 1 * multiplier;

    // Update UI
    scoreDisplay.textContent = score;
    comboDisplay.textContent = combo;
    multiplierDisplay.textContent = multiplier;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreDisplay.textContent = highScore;
    }

    dot.remove();
    setTimeout(spawnDot, 300);
  };

  gameArea.appendChild(dot);

  // Reset combo if not clicked in 2 seconds
  setTimeout(() => {
    if (Date.now() - lastClickTime > 2000) {
      combo = 0;
      multiplier = 1;
      comboDisplay.textContent = combo;
      multiplierDisplay.textContent = multiplier;
    }
  }, 2100);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameActive = false;
      gameArea.innerHTML = "<h2>Game Over!</h2><p>Your score: " + score + "</p>";
      restartButton.style.display = "block";
    }
  }, 1000);
}

function startGame() {
  score = 0;
  timeLeft = 30;
  combo = 0;
  multiplier = 1;
  lastClickTime = null;
  gameActive = true;

  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  comboDisplay.textContent = combo;
  multiplierDisplay.textContent = multiplier;
  gameArea.innerHTML = "";
  restartButton.style.display = "none";

  spawnDot();
  startTimer();
}

restartButton.onclick = startGame;
startGame();
