export default class Utilities {
  static getImage(src) {
    const image = new Image();
    image.src = src;
    return image;
  }

  static drawMap(context, obj, column, row, size) {
    context.drawImage(
      obj,
      column * this.tilesize,
      row * this.tilesize,
      size,
      size
    );
  }
}
