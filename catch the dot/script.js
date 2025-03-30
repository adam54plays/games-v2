const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
let score = 0;

function spawnDot() {
  const dot = document.createElement("div");
  dot.classList.add("dot");

  // Random position within game area
  const x = Math.random() * (gameArea.clientWidth - 30);
  const y = Math.random() * (gameArea.clientHeight - 30);

  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;

  dot.onclick = () => {
    score++;
    scoreDisplay.textContent = score;
    dot.remove();
    setTimeout(spawnDot, 500); // next dot after 0.5s
  };

  gameArea.appendChild(dot);
}

spawnDot();
