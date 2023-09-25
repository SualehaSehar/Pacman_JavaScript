import Utilities from "./Utilities.js";
import getMap from "./map.js";
import Pacman from "./Pacman.js";
import Enemy from "./Enemy.js";
import { MovingDirection } from "./enum.js";
export default class TileMap {
  constructor(tilesize) {
    this.tilesize = tilesize;
    this.map = getMap();

    this.yellowDot = Utilities.getImage("../images/yellowDot.png");
    this.wall = Utilities.getImage("../images/blueSquare.png");
    this.pinkDot = Utilities.getImage("../images/pinkDot.png");

    this.powerdot = this.pinkDot;
    this.powerDotAnimationTimerDefault = 20;
    this.powerDotAnimationTimer = this.powerDotAnimationTimerDefault;
  }

  draw(context) {
    this.map.forEach((row, i) => {
      row.forEach((tile, j) => {
        switch (tile) {
          case 0:
            this.#drawMap(context, this.wall, j, i, this.tilesize);
            break;
          case 1:
            this.#drawMap(context, this.yellowDot, j, i, this.tilesize);
            break;
          case 7:
            this.#drawPowerDot(context, j, i, this.tilesize);
            break;
          default:
            this.#drawBlank(context, j, i, this.tilesize);
        }
      });
    });
  }

  #drawPowerDot(context, column, row, size) {
    this.powerDotAnimationTimer--;
    if (this.powerDotAnimationTimer === 0) {
      this.powerDotAnimationTimer = this.powerDotAnimationTimerDefault;

      if (this.powerdot == this.pinkDot) {
        this.powerdot = this.yellowDot;
      } else {
        this.powerdot = this.pinkDot;
      }
    }
    context.drawImage(
      this.powerdot,
      column * this.tilesize,
      row * this.tilesize,
      size,
      size
    );
  }

  #drawMap(context, obj, column, row, size) {
    context.drawImage(
      obj,
      column * this.tilesize,
      row * this.tilesize,
      size,
      size
    );
  }

  getPacEn(velocity) {
    const enemies = [];
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        let tile = this.map[i][j];
        if (tile === 4) {
          this.map[i][j] = 1;
          return new Pacman(
            j * this.tilesize,
            i * this.tilesize,
            this.tilesize,
            velocity,
            this
          );
        } else if (tile === 6) {
          this.map[i][j] = 1;
          enemies.push(
            new Enemy(
              j * this.tilesize,
              i * this.tilesize,
              this.tilesize,
              velocity,
              this
            )
          );
        }
      }
    }
    return enemies;
  }

  didCollideWithEnvironement(x, y, direction) {
    if (direction == null) {
      return;
    }
    if (
      Number.isInteger(x / this.tilesize) &&
      Number.isInteger(y / this.tilesize)
    ) {
      let column = 0;
      let row = 0;
      let nextColumn = 0;
      let nextRow = 0;

      switch (direction) {
        case MovingDirection.up:
          nextRow = y - this.tilesize;
          row = Math.floor(nextRow / this.tilesize);
          column = Math.floor(x / this.tilesize);
          break;
        case MovingDirection.down:
          nextRow = y + this.tilesize;
          row = Math.floor(nextRow / this.tilesize);
          column = Math.floor(x / this.tilesize);
          break;
        case MovingDirection.right:
          nextColumn = x + this.tilesize;
          column = Math.floor(nextColumn / this.tilesize);
          row = Math.floor(y / this.tilesize);
          break;
        case MovingDirection.left:
          nextColumn = x - this.tilesize;
          column = Math.floor(nextColumn / this.tilesize);
          row = Math.floor(y / this.tilesize);
          break;
      }
      const tile = this.map[row][column];
      if (tile === 0) {
        return true;
      }
      return false;
    }
  }

  eatDot(x, y, color) {
    const dotColor = color;
    const row = y / this.tilesize;
    const column = x / this.tilesize;

    if (Number.isInteger(row) && Number.isInteger(column)) {
      let tile = this.map[row][column];
      if (
        (tile === 1 && dotColor === "yellow") ||
        (tile === 7 && dotColor === "pink")
      ) {
        this.map[row][column] = 5;
        return true;
      }
    }
    return false;
  }

  didWin() {
    return this.#dotsLeft() === 0;
  }

  #dotsLeft() {
    //flat converts 2d array into 1d
    return this.map.flat().filter((tile) => tile === 1).length;
  }

  #drawBlank(context, column, row, size) {
    context.fillStyle = "black";
    context.fillRect(column * this.tilesize, row * this.tilesize, size, size);
  }

  setCanvasSize(canvas) {
    canvas.width = this.map[0].length * this.tilesize;
    canvas.height = this.map.length * this.tilesize;
  }
}
