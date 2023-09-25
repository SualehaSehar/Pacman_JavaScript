import TileMap from "./TileMap.js ";

const tilesize = 32;
const velocity = 2;

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const tileMap = new TileMap(tilesize, context);
const pacman = tileMap.getPacEn(velocity);
const enemies = tileMap.getPacEn(velocity);

let gameOver = false;
let gameWin = false;
const gameOverSound = new Audio("../sounds/gameOver.wav");
const gameWinSound = new Audio("../sounds/gameWin.wav");

tileMap.setCanvasSize(canvas);
function gameLoop(timestamp) {
  tileMap.draw(context);
  drawGameEnd();
  pacman.draw(context, pause(), enemies);
  enemies.forEach((enemy) => {
    enemy.draw(context, pause(), pacman);
  });

  checkGameOver();
  checkGameWin();

  requestAnimationFrame(gameLoop);
}

function pause() {
  return !pacman.madeFirstMove || gameOver || gameWin;
}

function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();
    if (gameOver) {
      gameOverSound.play();
    }
  }
}

function checkGameWin() {
  if (!gameWin) {
    gameWin = tileMap.didWin();
    if (gameWin) {
      gameWinSound.play();
    }
  }
}

function drawGameEnd() {
  if (gameOver || gameWin) {
    let text = "You Win!";
    if (gameOver) {
      text = "Game Over";
    }

    context.fillStyle = "black";
    context.fillRect(0, canvas.height / 2.5, canvas.width, 80);

    context.font = "80px comic sans";
    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "pink");

    context.fillStyle = gradient;
    context.fillText(text, 50, canvas.height / 1.9);
  }
}

function isGameOver() {
  //some returns true if the condition is true for any element
  return enemies.some(
    (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
  );
}

requestAnimationFrame(gameLoop);
