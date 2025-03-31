const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");

let score = 0;
let timeLeft = 30;
let gameActive = true;

function spawnDot() {
  if (!gameActive) return;

  const dot = document.createElement("div");
  dot.classList.add("dot");

  // Dynamic size based on score (higher score = smaller dot)
  const size = Math.max(30 - score * 0.5, 10);
  dot.style.width = `${size}px`;
  dot.style.height = `${size}px`;

  // Random position
  const x = Math.random() * (gameArea.clientWidth - size);
  const y = Math.random() * (gameArea.clientHeight - size);

  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;

  dot.onclick = () => {
    score++;
    scoreDisplay.textContent = score;
    dot.remove();

    // Increase difficulty
    const delay = Math.max(200 - score * 5, 80);
    setTimeout(spawnDot, delay);
  };

  gameArea.appendChild(dot);
}

function startTimer() {
  const interval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(interval);
      gameActive = false;
      gameArea.innerHTML = "<h2>Game Over!</h2><p>Your score: " + score + "</p>";
    }
  }, 1000);
}

spawnDot();
startTimer();
startGame();
