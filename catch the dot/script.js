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
let combo = 0;
let multiplier = 1;
let lastClickTime = null;
let gameActive = false;
let timerInterval;
let doubleScore = false;

highScoreDisplay.textContent = highScore;

function spawnDot() {
  if (!gameActive) return;

  const dot = document.createElement("div");
  dot.classList.add("dot");

  // Pick random dot type
  const types = ["red", "red", "red", "black", "green", "blue", "yellow"];
  const type = types[Math.floor(Math.random() * types.length)];
  dot.classList.add(type);

  const size = parseInt(window.getComputedStyle(dot).width);
  const x = Math.random() * (gameArea.clientWidth - size);
  const y = Math.random() * (gameArea.clientHeight - size);

  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;

  dot.onclick = () => {
    if (type === "black") {
      endGame("💣 You hit a bomb!");
      return;
    }

    if (type === "green") {
      timeLeft += 3;
      timerDisplay.textContent = timeLeft;
    }

    if (type === "blue") {
      doubleScore = true;
      setTimeout(() => doubleScore = false, 10000);
    }

    if (type === "yellow") {
      score += 10;
    }

    if (type === "red") {
      const now = Date.now();
      if (lastClickTime && now - lastClickTime <= 2000) {
        combo++;
      } else {
        combo = 1;
      }
      lastClickTime = now;

      multiplier = 1 + Math.floor(combo / 5);
      score += (doubleScore ? 2 : 1) * multiplier;

      comboDisplay.textContent = combo;
      multiplierDisplay.textContent = multiplier;
    }

    scoreDisplay.textContent = score;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreDisplay.textContent = highScore;
    }

    dot.remove();
    setTimeout(spawnDot, 300);
  };

  gameArea.appendChild(dot);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame("⏳ Time's up!");
    }
  }, 1000);
}

function endGame(message) {
  clearInterval(timerInterval);
  gameActive = false;
  gameArea.innerHTML = `<h2>Game Over</h2><p>${message}</p><p>Score: ${score}</p>`;
  restartButton.style.display = "block";
}

function startGame() {
  score = 0;
  timeLeft = 30;
  combo = 0;
  multiplier = 1;
  lastClickTime = null;
  doubleScore = false;
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
