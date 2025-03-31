const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const timerDisplay = document.getElementById("timer");
const restartButton = document.getElementById("restartButton");
const pauseButton = document.getElementById("pauseButton");
const themeToggle = document.getElementById("themeToggle");
const popSound = document.getElementById("popSound");
const gameOverSound = document.getElementById("gameOverSound");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let timeLeft = 30;
let gameActive = true;
let paused = false;
let timerInterval;

highScoreDisplay.textContent = highScore;

function spawnDot() {
  if (!gameActive || paused) return;

  const dot = document.createElement("div");
  dot.classList.add("dot");

  const size = Math.max(30 - score * 0.5, 10);
  dot.style.width = `${size}px`;
  dot.style.height = `${size}px`;

  const x = Math.random() * (gameArea.clientWidth - size);
  const y = Math.random() * (gameArea.clientHeight - size);

  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;

  dot.onclick = () => {
    score++;
    scoreDisplay.textContent = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreDisplay.textContent = highScore;
    }

    dot.classList.add("explode");
    popSound.currentTime = 0;
    popSound.play();
    setTimeout(() => dot.remove(), 250);

    const delay = Math.max(200 - score * 5, 80);
    setTimeout(spawnDot, delay);
  };

  gameArea.appendChild(dot);
}

function startTimer() {
  timerInterval = setInterval(() => {
    if (!gameActive || paused) return;
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameActive = false;
      gameOverSound.play();
      gameArea.innerHTML = "<h2>Game Over!</h2><p>Your score: " + score + "</p>";
    }
  }, 1000);
}

function startGame() {
  score = 0;
  timeLeft = 30;
  gameActive = true;
  paused = false;

  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  gameArea.innerHTML = "";
  restartButton.style.display = "none";

  clearInterval(timerInterval);
  spawnDot();
  startTimer();
}

restartButton.onclick = startGame;

pauseButton.onclick = () => {
  paused = !paused;
  pauseButton.textContent = paused ? "Resume" : "Pause";
  if (!paused) spawnDot();
};

themeToggle.onclick = () => {
  document.body.classList.toggle("dark-mode");
};

startGame();
