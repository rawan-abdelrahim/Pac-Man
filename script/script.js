let board;
const rowCount = 21;
const columnCount = 19;
const tileSize = 32;
const boardWidth = columnCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;

let blueGhostImage;
let redGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;

const tileMap = [
  'XXXXXXXXXXXXXXXXXXX',
  'X        X        X',
  'X XX XXX X XXX XX X',
  'X                 X',
  'X XX X XXXXX X XX X',
  'X    X       X    X',
  'XXXX XXXX XXXX XXXX',
  'OOOX X       X XOOO',
  'XXXX X XXrXX X XXXX',
  'O       bpo       O',
  'XXXX X XXXXX X XXXX',
  'OOOX X       X XOOO',
  'XXXX X XXXXX X XXXX',
  'X        X        X',
  'X XX XXX X XXX XX X',
  'X  X     P     X  X',
  'XX X X XXXXX X X XX',
  'X    X   X   X    X',
  'X XXXXXX X XXXXXX X',
  'X                 X',
  'XXXXXXXXXXXXXXXXXXX',
];

const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;
const directions = ['U', 'D', 'L', 'R'];
let score = 0;
let lives = 3;
let gameOver = false;

window.onload = function () {
  board = document.getElementById('board');
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext('2d');
  loadImages();
  loadMap();
  for (let ghost of ghosts.values()) {
    const newDirection = directions[Math.floor(Math.random() * 4)];
    ghost.updateDirection(newDirection);
  }
  Update();
  document.addEventListener('keyup', movePacman);
};

function loadImages() {
  wallImage = new Image();
  wallImage.src = './resources/wall.png';

  blueGhostImage = new Image();
  blueGhostImage.src = './resources/blueGhost.png';
  redGhostImage = new Image();
  redGhostImage.src = './resources/redGhost.png';
  orangeGhostImage = new Image();
  orangeGhostImage.src = './resources/orangeGhost.png';
  pinkGhostImage = new Image();
  pinkGhostImage.src = './resources/pinkGhost.png';

  pacmanUpImage = new Image();
  pacmanUpImage.src = './resources/pacmanUp.png';
  pacmanDownImage = new Image();
  pacmanDownImage.src = './resources/pacmanDown.png';
  pacmanLeftImage = new Image();
  pacmanLeftImage.src = './resources/pacmanLeft.png';
  pacmanRightImage = new Image();
  pacmanRightImage.src = './resources/pacmanRight.png';
}

function loadMap() {
  walls.clear();
  foods.clear();
  ghosts.clear();

  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < columnCount; c++) {
      const row = tileMap[r];
      const tileMapChar = row[c];

      const x = c * tileSize;
      const y = r * tileSize;

      if (tileMapChar == 'X') {
        const wall = new Block(wallImage, x, y, tileSize, tileSize);
        walls.add(wall);
      } else if (tileMapChar == 'b') {
        const ghost = new Block(blueGhostImage, x, y, tileSize, tileSize);
        ghosts.add(ghost);
      } else if (tileMapChar == 'r') {
        const ghost = new Block(redGhostImage, x, y, tileSize, tileSize);
        ghosts.add(ghost);
      } else if (tileMapChar == 'o') {
        const ghost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
        ghosts.add(ghost);
      } else if (tileMapChar == 'p') {
        const ghost = new Block(pinkGhostImage, x, y, tileSize, tileSize);
        ghosts.add(ghost);
      } else if (tileMapChar == 'P') {
        pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize);
      } else if (tileMapChar == ' ') {
        const food = new Block(null, x + 14, y + 14, 4, 4);
        foods.add(food);
      }
    }
  }
}

function Update() {
  if (gameOver) return;
  move();
  draw();
  setTimeout(Update, 50);
}

function draw() {
  context.clearRect(0, 0, board.width, board.height);
  context.drawImage(
    pacman.image,
    pacman.x,
    pacman.y,
    pacman.width,
    pacman.height
  );

  for (let ghost of ghosts.values()) {
    context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
  }

  for (let wall of walls.values()) {
    context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
  }

  context.fillStyle = 'White';
  for (let food of foods.values()) {
    context.fillRect(food.x, food.y, food.width, food.height);
  }

  context.fillStyle = 'White';
  context.font = '14px sans-serif';
  if (gameOver) {
    context.fillText('Game Over: ' + String(score), tileSize / 2, tileSize / 2);
  } else {
    context.fillText(
      'x ' + String(lives) + ' ' + String(score),
      tileSize / 2,
      tileSize / 2
    );
  }
}

function move() {
  pacman.x += pacman.velocityX;
  pacman.y += pacman.velocityY;
  for (let wall of walls.values()) {
    if (collision(pacman, wall)) {
      pacman.x -= pacman.velocityX;
      pacman.y -= pacman.velocityY;
      break;
    } else if (pacman.x <= 0) {
      pacman.x = boardWidth - pacman.width;
      pacman.y -= pacman.velocityY;
      break;
    } else if (pacman.x + pacman.width >= boardWidth) {
      pacman.x = 0;
      pacman.y -= pacman.velocityY;
      break;
    }
  }

  for (let ghost of ghosts.values()) {
    if (collision(ghost, pacman)) {
      lives -= 1;
      if (lives == 0) {
        gameOver = true;
        return;
      }
      resetPosition();
    }

    if (
      ghost.y == tileSize * 9 &&
      ghost.direction != 'U' &&
      ghost.direction != 'D'
    )
      ghost.updateDirection('U');

    ghost.x += ghost.velocityX;
    ghost.y += ghost.velocityY;
    for (let wall of walls.values()) {
      if (collision(ghost, wall)) {
        ghost.x -= ghost.velocityX;
        ghost.y -= ghost.velocityY;
        const newDirection = directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection);
      } else if (ghost.x <= 0) {
        ghost.x = boardWidth - ghost.width;
        ghost.y -= ghost.velocityY;
        const newDirection = directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection);
      } else if (ghost.x + ghost.width >= boardWidth) {
        ghost.x = 0;
        ghost.y -= ghost.velocityY;
        const newDirection = directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection);
      }
    }
  }

  let foodEaten = null;
  for (let food of foods.values()) {
    if (collision(pacman, food)) {
      foodEaten = food;
      score += 10;
      break;
    }
  }
  foods.delete(foodEaten);

  if (foods.size == 0) {
    loadMap();
    resetPosition();
  }
}

function movePacman(e) {
  if (gameOver) {
    loadMap();
    resetPosition();
    lives = 3;
    score = 0;
    gameOver = false;
    Update();
    return;
  }
  if (e.code == 'ArrowUp' || e.code == 'KeyW') {
    pacman.updateDirection('U');
  } else if (e.code == 'ArrowDown' || e.code == 'KeyS') {
    pacman.updateDirection('D');
  } else if (e.code == 'ArrowLeft' || e.code == 'KeyA') {
    pacman.updateDirection('L');
  } else if (e.code == 'ArrowRight' || e.code == 'KeyD') {
    pacman.updateDirection('R');
  }

  if (pacman.direction == 'U') pacman.image = pacmanUpImage;
  else if (pacman.direction == 'D') pacman.image = pacmanDownImage;
  else if (pacman.direction == 'L') pacman.image = pacmanLeftImage;
  else if (pacman.direction == 'R') pacman.image = pacmanRightImage;
}
function collision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
function resetPosition() {
  pacman.reset();
  pacman.velocityX = 0;
  pacman.velocityY = 0;
  for (let ghost of ghosts.values()) {
    ghost.reset();
    const newDirection = directions[Math.floor(Math.random() * 4)];
    ghost.updateDirection(newDirection);
  }
}
class Block {
  constructor(image, x, y, width, height) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.startX = x;
    this.startY = y;

    this.direction = 'R';
    this.velocityX = 0;
    this.velocityY = 0;
  }

  updateDirection(direction) {
    const prevDirection = this.direction;
    this.direction = direction;
    this.updateVelocity();
    this.x += this.velocityX;
    this.y += this.velocityY;

    for (let wall of walls.values()) {
      if (collision(this, wall)) {
        this.x -= this.velocityX;
        this.y -= this.velocityY;
        this.direction = prevDirection;
        this.updateVelocity();
        return;
      }
    }
  }

  updateVelocity() {
    if (this.direction == 'U') {
      this.velocityX = 0;
      this.velocityY = -tileSize / 4;
    } else if (this.direction == 'D') {
      this.velocityX = 0;
      this.velocityY = tileSize / 4;
    } else if (this.direction == 'L') {
      this.velocityX = -tileSize / 4;
      this.velocityY = 0;
    } else if (this.direction == 'R') {
      this.velocityX = tileSize / 4;
      this.velocityY = 0;
    }
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;
  }
}
