const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const restartButton = document.getElementById("restartButton");

let score = 0;
let timeLeft = 30;
let gameActive = true;
let timerInterval;

function spawnDot() {
  if (!gameActive) return;

  const dot = document.createElement("div");
  dot.classList.add("dot");

  // Dot size gets smaller as score increases
  const size = Math.max(30 - score * 0.5, 10);
  dot.style.width = `${size}px`;
  dot.style.height = `${size}px`;

  // Random position within game area bounds
  const x = Math.random() * (gameArea.clientWidth - size);
  const y = Math.random() * (gameArea.clientHeight - size);

  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;

  // On click: increase score, remove dot, spawn next
  dot.onclick = () => {
    score++;
    scoreDisplay.textContent = score;
    dot.remove();

    const delay = Math.max(200 - score * 5, 80);
    setTimeout(spawnDot, delay);
  };

  gameArea.appendChild(dot);
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
  gameActive = true;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  gameArea.innerHTML = "";
  restartButton.style.display = "none";

  spawnDot();
  startTimer();
}

// Restart button click restarts game
restartButton.onclick = startGame;

// Start the game when the page loads
startGame();
