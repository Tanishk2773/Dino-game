// Endless Runner: game rules, drawing, input, and saved scores.
// Scores live in this browser's localStorage; they are not uploaded anywhere.

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const scoreElement = document.querySelector("#score");
const bestScoreElement = document.querySelector("#best-score");
const messageElement = document.querySelector("#game-message");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const GROUND_Y = 250;
const GRAVITY = 1900;
const JUMP_VELOCITY = -680;
const START_SPEED = 300;
const MAX_SPEED = 650;
const BEST_KEY = "endless-runner-best";

const player = { x: 90, y: GROUND_Y - 42, width: 34, height: 42, velocityY: 0, onGround: true };
let obstacles = [];
let gameState = "ready"; // ready, playing, or over
let score = 0;
let speed = START_SPEED;
let spawnTimer = 0;
let lastTime = 0;

function loadBestScore() {
  const savedBest = Number(localStorage.getItem(BEST_KEY));
  return Number.isFinite(savedBest) ? Math.max(0, savedBest) : 0;
}

function saveRun(finalScore) {
  const best = Math.max(loadBestScore(), Math.floor(finalScore));
  localStorage.setItem(BEST_KEY, String(best));
  renderScores();
}

function renderScores() {
  bestScoreElement.textContent = String(loadBestScore());
}

function resetGame() {
  player.y = GROUND_Y - player.height;
  player.velocityY = 0;
  player.onGround = true;
  obstacles = [];
  score = 0;
  speed = START_SPEED;
  spawnTimer = 1;
  scoreElement.textContent = "0";
}

function startGame() {
  resetGame();
  gameState = "playing";
  messageElement.textContent = "";
}

function endGame() {
  gameState = "over";
  saveRun(score);
  messageElement.textContent = "Game over — press Space or tap to play again";
}

function jump() {
  if (gameState === "ready" || gameState === "over") {
    startGame();
  }

  if (player.onGround) {
    player.velocityY = JUMP_VELOCITY;
    player.onGround = false;
  }
}

function handleKeyDown(event) {
  if (event.code === "Space" || event.code === "ArrowUp") {
    event.preventDefault();
    jump();
  }
}

function createObstacle() {
  const height = 28 + Math.random() * 28;
  return { x: WIDTH, y: GROUND_Y - height, width: 20 + Math.random() * 18, height };
}

function rectanglesOverlap(a, b) {
  // Keep the player's hitbox slightly smaller than its drawn body for fair collisions.
  const inset = 4;
  return a.x + inset < b.x + b.width &&
    a.x + a.width - inset > b.x &&
    a.y + inset < b.y + b.height &&
    a.y + a.height > b.y;
}

function updatePlayer(deltaTime) {
  player.velocityY += GRAVITY * deltaTime;
  player.y += player.velocityY * deltaTime;

  if (player.y + player.height >= GROUND_Y) {
    player.y = GROUND_Y - player.height;
    player.velocityY = 0;
    player.onGround = true;
  }
}

function updateGame(deltaTime) {
  if (gameState !== "playing") return;

  updatePlayer(deltaTime);
  score += deltaTime * speed * 0.04;
  speed = Math.min(speed + 12 * deltaTime, MAX_SPEED);
  scoreElement.textContent = String(Math.floor(score));

  spawnTimer -= deltaTime;
  if (spawnTimer <= 0) {
    obstacles.push(createObstacle());
    spawnTimer = 1.1 + Math.random() * 0.8;
  }

  obstacles.forEach((obstacle) => {
    obstacle.x -= speed * deltaTime;
  });
  obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);

  if (obstacles.some((obstacle) => rectanglesOverlap(player, obstacle))) {
    endGame();
  }
}

function drawGame() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Sky and ground
  ctx.fillStyle = "#f7fafc";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.strokeStyle = "#b8c4d1";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(WIDTH, GROUND_Y);
  ctx.stroke();

  // Player
  ctx.fillStyle = "#2457a7";
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(player.x + 23, player.y + 8, 5, 5);

  // Obstacles
  ctx.fillStyle = "#df5a49";
  obstacles.forEach((obstacle) => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function gameLoop(now) {
  const deltaTime = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  updateGame(deltaTime);
  drawGame();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", handleKeyDown);
canvas.addEventListener("pointerdown", jump);
renderScores();
drawGame();
requestAnimationFrame(gameLoop);
