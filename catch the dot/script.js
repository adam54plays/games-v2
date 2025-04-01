const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const timerDisplay = document.getElementById("timer");
const comboDisplay = document.getElementById("combo");
const multiplierDisplay = document.getElementById("multiplier");

const restartButton = document.getElementById("restartButton");
const themeToggle = document.getElementById("themeToggle");
const soundToggle = document.getElementById("soundToggle");
const musicToggle = document.getElementById("musicToggle");

const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let timeLeft = 30;
let combo = 0;
let bestCombo = 0;
let multiplier = 1;
let lastClickTime = null;
let gameActive = false;
let timerInterval;
let dotSpawner;
let doubleScore = false;
let totalClicks = 0;
let successfulClicks = 0;
let soundOn = true;
let musicOn = false;

highScoreDisplay.textContent = highScore;

function playSound(audio) {
  if (soundOn) {
    audio.currentTime = 0;
    audio.play();
  }
}

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
    totalClicks++;

    if (type === "black") {
      endGame("💣 You hit a bomb!");
      return;
    }

    successfulClicks++;
    playSound(clickSound);

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
      if (combo > bestCombo) bestCombo = combo;

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

  // Floating motion
  let vx = (Math.random() - 0.5) * 2;
  let vy = (Math.random() - 0.5) * 2;
  const moveInterval = setInterval(() => {
    if (!gameActive || !dot.parentElement) {
      clearInterval(moveInterval);
      return;
    }
    x += vx;
    y += vy;

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
  if (!hasSafe) spawnDot(true);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) endGame("⏳ Time's up!");
  }, 1000);
}

function startDotSpawning() {
  dotSpawner = setInterval(() => {
    spawnDot();
    ensureSafeDot();
  }, 800);
}

function updateLeaderboard(name, score) {
  const board = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  board.push({ name, score });
  board.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(board.slice(0, 5)));
}

function renderLeaderboardHTML() {
  const board = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  return `
    <h3>Top 5 Scores</h3>
    <ol>${board.map(e => `<li>${e.name}: ${e.score}</li>`).join("")}</ol>
  `;
}

function endGame(message) {
  clearInterval(timerInterval);
  clearInterval(dotSpawner);
  gameActive = false;

  const accuracy = totalClicks ? Math.round((successfulClicks / totalClicks) * 100) : 0;
  const name = prompt("Game Over! Enter your name for the leaderboard:", "Player") || "Player";
  updateLeaderboard(name, score);

  gameArea.innerHTML = `
    <h2>${message}</h2>
    <p>Final Score: ${score}</p>
    <p>Best Combo: ${bestCombo}</p>
    <p>Accuracy: ${accuracy}% (${successfulClicks}/${totalClicks})</p>
    ${renderLeaderboardHTML()}
  `;
  restartButton.style.display = "block";
}

function startGame() {
  score = 0;
  timeLeft = 30;
  combo = 0;
  bestCombo = 0;
  multiplier = 1;
  lastClickTime = null;
  doubleScore = false;
  totalClicks = 0;
  successfulClicks = 0;
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

// Toggles
restartButton.onclick = startGame;

themeToggle.onclick = () => {
  document.body.classList.toggle("dark-mode");
};

soundToggle.onclick = () => {
  soundOn = !soundOn;
  soundToggle.textContent = soundOn ? "🔊 Sound" : "🔇 Sound";
};

musicToggle.onclick = () => {
  musicOn = !musicOn;
  if (musicOn) {
    bgMusic.volume = 0.3;
    bgMusic.play();
    musicToggle.textContent = "🎵 Music";
  } else {
    bgMusic.pause();
    musicToggle.textContent = "🚫 Music";
  }
};

startGame();
