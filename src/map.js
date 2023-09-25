// square = 0
// pallets =1
// pacman=4
// 5=eaten
//6 =enemy
// 7 = power dot
let map = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
  [0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0],
  [0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

function getMap() {
  const min = 1; // Minimum value (inclusive)
  const max = 14; // Maximum value (inclusive)
  let countGhost = 0;
  while (countGhost < 4) {
    const rV1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const rV2 = Math.floor(Math.random() * (max - min + 1)) + min;

    if (map[rV1][rV2] == 1) {
      map[rV1][rV2] = 6;
      countGhost++;
    } else {
      continue;
    }
  }

  let countPinkDot = 0;

  while (countPinkDot < 4) {
    const rV3 = Math.floor(Math.random() * (max - min + 1)) + min;
    const rV4 = Math.floor(Math.random() * (max - min + 1)) + min;

    if (map[rV3][rV4] == 1) {
      map[rV3][rV4] = 7;
      countPinkDot++;
    } else {
      continue;
    }
  }
  return map;
}

export default getMap;
