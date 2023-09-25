import Utilities from "./Utilities.js";
import { MovingDirection, Keyboard } from "./enum.js";
export default class Pacman {
  constructor(x, y, tilesize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tilesize = tilesize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.currentMovingDirection = null;
    this.requestedMovingDirection = null;

    this.pacmanAnimationTimerDefault = 10;
    this.pacmanAnimationTimer = null;

    this.pacmanRotation = this.Rotation.right;
    this.walkSound = new Audio("../sounds/waka.wav");
    this.powerDotSound = new Audio("../sounds/power_dot.wav");
    this.eatGhostSound = new Audio("../sounds/eat_ghost.wav");

    this.madeFirstMove = false;

    this.powerDotActive = false;
    this.powerDotAboutToExpire = false;
    this.timers = [];

    document.addEventListener("keydown", this.#keydown);

    this.#loadPacmanImages();
  }

  Rotation = {
    down: 1,
    up: 3,
    left: 2,
    right: 0,
  };

  draw(context, pause, enemies) {
    if (!pause) {
      this.#move();
      this.#animate();
    }
    this.#eatDot();
    this.#eatPowerDot();
    this.#eatGhost(enemies);
    const size = this.tilesize / 2;

    context.save();
    context.translate(this.x + size, this.y + size);
    context.rotate((this.pacmanRotation * 90 * Math.PI) / 180);

    context.drawImage(
      this.pacmanImages[this.pacmanImageIndex],
      -size,
      -size,
      this.tilesize,
      this.tilesize
    );

    context.restore();
  }

  #loadPacmanImages() {
    const pacman2 = Utilities.getImage("../images/pac1.png");
    this.pacmanImages = [
      Utilities.getImage("../images/pac0.png"),
      pacman2,
      Utilities.getImage("../images/pac2.png"),
      pacman2,
    ];

    this.pacmanImageIndex = 0;
  }

  #eatDot() {
    if (this.tileMap.eatDot(this.x, this.y, "yellow") && this.madeFirstMove) {
      this.walkSound.play();
    }
  }

  #eatPowerDot() {
    if (this.tileMap.eatDot(this.x, this.y, "pink")) {
      this.powerDotSound.play();
      this.powerDotActive = true;
      this.powerDotAboutToExpire = false;
      this.timers.forEach((timer) => clearTimeout(timer));
      let powerDotTimer = setTimeout(() => {
        this.powerDotActive = false;
        this.powerDotAboutToExpire = false;
      }, 1000 * 6);
      this.timers.push(powerDotTimer);

      let powerDotAboutToExpireTimer = setTimeout(() => {
        this.powerDotAboutToExpire = true;
      }, 1000 * 3);
      this.timers.push(powerDotAboutToExpireTimer);
    }
  }

  #eatGhost(enemies) {
    if (this.powerDotActive) {
      // filter returns a new array which has only those enemy objects for which the collideWith method returned true
      const collideEnemy = enemies.filter((enemy) => enemy.collideWith(this));
      collideEnemy.forEach((enemy) => {
        enemies.splice(enemies.indexOf(enemy), 1);
        this.eatGhostSound.play();
      });
    }
  }

  #animate() {
    if (this.pacmanAnimationTimer == null) {
      return;
    }
    this.pacmanAnimationTimer--;
    if (this.pacmanAnimationTimer == 0) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
      this.pacmanImageIndex++;
      if (this.pacmanImageIndex == this.pacmanImages.length) {
        this.pacmanImageIndex = 0;
      }
    }
  }

  #keydown = (e) => {
    this.madeFirstMove = true;

    if (e.keyCode == Keyboard.up) {
      if (this.currentMovingDirection == MovingDirection.down)
        this.currentMovingDirection = MovingDirection.up;
      this.requestedMovingDirection = MovingDirection.up;
    }

    if (e.keyCode == Keyboard.down) {
      if (this.currentMovingDirection == MovingDirection.up)
        this.currentMovingDirection = MovingDirection.down;
      this.requestedMovingDirection = MovingDirection.down;
    }

    if (e.keyCode == Keyboard.left) {
      if (this.currentMovingDirection == MovingDirection.right)
        this.currentMovingDirection = MovingDirection.left;
      this.requestedMovingDirection = MovingDirection.left;
    }

    if (e.keyCode == Keyboard.right) {
      if (this.currentMovingDirection == MovingDirection.left)
        this.currentMovingDirection = MovingDirection.right;
      this.requestedMovingDirection = MovingDirection.right;
    }
  };

  #move() {
    if (this.currentMovingDirection !== this.requestedMovingDirection) {
      if (
        Number.isInteger(this.x / this.tilesize) &&
        Number.isInteger(this.y / this.tilesize)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironement(
            this.x,
            this.y,
            this.requestedMovingDirection
          )
        ) {
          this.currentMovingDirection = this.requestedMovingDirection;
        }
      }
    }

    if (
      this.tileMap.didCollideWithEnvironement(
        this.x,
        this.y,
        this.currentMovingDirection
      )
    ) {
      //to stop animation when collide
      this.pacmanAnimationTimer = null;
      this.pacmanImageIndex = 1;
      return;
    } else if (
      //true when pacman starts moving
      this.currentMovingDirection !== null &&
      this.pacmanAnimationTimer == null
    ) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
    }

    switch (this.currentMovingDirection) {
      case MovingDirection.up:
        this.y -= this.velocity;
        this.pacmanRotation = this.Rotation.up;
        break;
      case MovingDirection.down:
        this.y += this.velocity;
        this.pacmanRotation = this.Rotation.down;
        break;
      case MovingDirection.right:
        this.x += this.velocity;
        this.pacmanRotation = this.Rotation.right;
        break;
      case MovingDirection.left:
        this.x -= this.velocity;
        this.pacmanRotation = this.Rotation.left;
        break;
    }
  }
}
