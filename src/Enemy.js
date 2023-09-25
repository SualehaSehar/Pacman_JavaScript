import Utilities from "./Utilities.js";
import { MovingDirection } from "./enum.js";

export default class Enemy {
  constructor(x, y, tilesize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tilesize = tilesize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.MovingDirection = Math.floor(
      Math.random() * Object.keys(MovingDirection).length
    );

    this.directionTimerDefault = this.#random(1, 5);
    this.directionTimer = this.directionTimerDefault;
    this.#loadEnemyImages();

    this.scaredGhostAboutToExpireTimerDefault = 10;
    this.scaredGhostAboutToExpireTimer =
      this.scaredGhostAboutToExpireTimerDefault;
  }

  draw(context, pause, pacman) {
    if (!pause) {
      this.#move();
      this.#changeDirection();
    }
    this.#setImage(context, pacman);
  }

  #setImage(context, pacman) {
    if (pacman.powerDotActive) {
      this.#setImageWhenPDActive(pacman);
    } else {
      this.image = this.normalGhost;
    }
    context.drawImage(this.image, this.x, this.y, this.tilesize, this.tilesize);
  }

  #setImageWhenPDActive(pacman) {
    if (pacman.powerDotAboutToExpire) {
      this.scaredGhostAboutToExpireTimer--;
      if (this.scaredGhostAboutToExpireTimer == 0) {
        this.scaredGhostAboutToExpireTimer =
          this.scaredGhostAboutToExpireTimerDefault;
        if (this.image === this.scaredGhost) {
          this.image = this.scaredGhost2;
        } else {
          this.image = this.scaredGhost;
        }
      }
    } else {
      this.image = this.scaredGhost;
    }
  }

  collideWith(pacman) {
    const size = this.tilesize / 2;
    if (
      this.x < pacman.x + size &&
      this.x + size > pacman.x &&
      this.y < pacman.y + size &&
      this.y + size > pacman.y
    ) {
      return true;
    }
    return false;
  }

  #changeDirection() {
    this.directionTimer--;
    let newMovingDirection = null;
    if (this.directionTimer == 0) {
      this.directionTimer = this.directionTimerDefault;
      newMovingDirection = Math.floor(
        Math.random() * Object.keys(MovingDirection).length
      );
    }

    if (
      newMovingDirection != null &&
      this.MovingDirection != newMovingDirection
    ) {
      if (
        Number.isInteger(this.x / this.tilesize) &&
        Number.isInteger(this.y / this.tilesize)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironement(
            this.x,
            this.y,
            newMovingDirection
          )
        ) {
          this.MovingDirection = newMovingDirection;
        }
      }
    }
  }

  #move() {
    if (
      !this.tileMap.didCollideWithEnvironement(
        this.x,
        this.y,
        this.MovingDirection
      )
    ) {
      switch (this.MovingDirection) {
        case MovingDirection.up:
          this.y -= this.velocity;
          break;
        case MovingDirection.down:
          this.y += this.velocity;
          break;
        case MovingDirection.right:
          this.x += this.velocity;
          break;
        case MovingDirection.left:
          this.x -= this.velocity;
          break;
      }
    }
  }

  #loadEnemyImages() {
    this.normalGhost = Utilities.getImage("../images/ghost.png");
    this.scaredGhost = Utilities.getImage("../images/scaredGhost.png");
    this.scaredGhost2 = Utilities.getImage("../images/scaredGhost2.png");

    this.image = this.normalGhost;
  }

  #random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
