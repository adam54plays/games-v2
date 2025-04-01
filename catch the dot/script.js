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
let dotSpawner;
let doubleScore = false;

highScoreDisplay.textContent = highScore;

function spawnDot(forceSafe = false) {
  if (!gameActive) return;

  const dot = document.createElement("div");
  dot.classList.add("dot");

  const safeTypes = ["red", "green", "blue", "yellow"];
  const allTypes = ["red", "red", "red", "black", "green", "blue", "yellow"];
  const type = forceSafe
    ? safeTypes[Math.floor(Math.random() * safeTypes.length)]
    : allTypes[Math.floor(Math.random() * allTypes.length)];

  dot.classList.add(type);

  let size = 30;
  if (type === "green" || type === "blue") size = 25;
  if (type === "yellow") size = 40;

  let x = Math.random() * (gameArea.clientWidth - size);
  let y = Math.random() * (gameArea.clientHeight - size);

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
  };

  // Move the dot gently every 50ms
  let vx = (Math.random() - 0.5) * 2;
  let vy = (Math.random() - 0.5) * 2;
  const moveInterval = setInterval(() => {
    if (!gameActive || !dot.parentElement) {
      clearInterval(moveInterval);
      return;
    }

    x += vx;
    y += vy;

    // Bounce off walls
    if (x <= 0 || x >= gameArea.clientWidth - size) vx *= -1;
    if (y <= 0 || y >= gameArea.clientHeight - size) vy *= -1;

    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
  }, 50);

  gameArea.appendChild(dot);
}

function ensureSafeDot() {
  const hasSafe = [...gameArea.children].some(dot =>
    !dot.classList.contains("black")
  );
  if (!hasSafe) {
    spawnDot(true);
  }
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

function startDotSpawning() {
  dotSpawner = setInterval(() => {
    spawnDot();
    ensureSafeDot();
  }, 800);
}

function endGame(message) {
  clearInterval(timerInterval);
  clearInterval(dotSpawner);
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

  startTimer();
  startDotSpawning();
}

restartButton.onclick = startGame;
startGame();
