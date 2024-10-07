const fs = require("fs");

const treeTextures = [
  "/5/test3D/examples/vie/vie-03.png",
  "/5/test3D/examples/vie/vie-04.png",
  "/5/test3D/examples/vie/vie-05.png",
  "/5/test3D/examples/vie/vie-06.png",
  "/5/test3D/examples/vie/vie-07.png",
];

// Fonction pour obtenir une texture aléatoire
function getRandomTreeTexture() {
  const randomIndex = Math.floor(Math.random() * treeTextures.length);
  return treeTextures[randomIndex];
}

// Fonction pour générer des positions aléatoires pour une zone rectangulaire
const generatePositions = (
  topRight,
  topLeft,
  bottomLeft,
  bottomRight,

  hitboxWidth
) => {
  const positions = [];

  for (let i = 0; i < 150; i++) {
    const t1 = Math.random();
    const leftX = topLeft.x + t1 * (bottomLeft.x - topLeft.x);
    const leftZ = topLeft.z + t1 * (bottomLeft.z - topLeft.z);

    const t2 = Math.random();
    const rightX = topRight.x + t1 * (bottomRight.x - topRight.x);
    const rightZ = topRight.z + t1 * (bottomRight.z - topRight.z);

    const finalT = Math.random();
    const finalX = leftX + finalT * (rightX - leftX);
    const finalZ = leftZ + finalT * (rightZ - leftZ);

    positions.push({
      x: finalX,
      z: finalZ,
      hitboxWidth,
      texture: getRandomTreeTexture(),
    });
  }

  return positions;
};

// Fonction pour générer des positions aléatoires dans un pentagone
const generatePentagonPositions = (points, hitboxWidth) => {
  const calculatePolygonCenter = (points) => {
    const totalPoints = points.length;
    const sumX = points.reduce((sum, point) => sum + point.x, 0);
    const sumZ = points.reduce((sum, point) => sum + point.z, 0);
    return {
      x: sumX / totalPoints,
      z: sumZ / totalPoints,
    };
  };

  const isInsidePolygon = (point, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x,
        zi = polygon[i].z;
      const xj = polygon[j].x,
        zj = polygon[j].z;
      const intersect =
        zi > point.z !== zj > point.z &&
        point.x < ((xj - xi) * (point.z - zi)) / (zj - zi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const positions = [];
  const villageCenter = calculatePolygonCenter(points);
  const villageRadius = 50;

  for (let i = 0; i < 300; i++) {
    let treePlaced = false;

    while (!treePlaced) {
      const minX = Math.min(...points.map((p) => p.x));
      const maxX = Math.max(...points.map((p) => p.x));
      const minZ = Math.min(...points.map((p) => p.z));
      const maxZ = Math.max(...points.map((p) => p.z));

      const randomX = minX + Math.random() * (maxX - minX);
      const randomZ = minZ + Math.random() * (maxZ - minZ);

      const randomPoint = { x: randomX, z: randomZ };
      const distanceSquared =
        (randomPoint.x - villageCenter.x) ** 2 +
        (randomPoint.z - villageCenter.z) ** 2;

      if (
        isInsidePolygon(randomPoint, points) &&
        distanceSquared > villageRadius ** 2
      ) {
        positions.push({
          x: randomX,
          z: randomZ,
          hitboxWidth,
          texture: getRandomTreeTexture(),
        });
        treePlaced = true;
      }
    }
  }

  return positions;
};

// Coordonnées des bords
const borders = [
  {
    topRight: { x: 109, z: -217 },
    topLeft: { x: -43, z: -245 },
    bottomLeft: { x: -48, z: -216 },
    bottomRight: { x: 99, z: -194 },
  },
  {
    topRight: { x: -43, z: -245 },
    bottomRight: { x: -48, z: -216 },
    topLeft: { x: -189, z: -159 },
    bottomLeft: { x: -177, z: -144 },
  },
  {
    topRight: { x: -189, z: -159 },
    bottomRight: { x: -177, z: -144 },
    topLeft: { x: -241, z: -16 },
    bottomLeft: { x: -213, z: -14 },
  },
];

// Coordonnées du pentagone
const pentagon = [
  { x: -213, z: -14 },
  { x: -22, z: -22 },
  { x: 97, z: -194 },
  { x: -51, z: -219 },
  { x: -180, z: -144 },
];

// Générer les positions pour les bords (hitbox large)
let treePositions = [];
borders.forEach((border) => {
  const positions = generatePositions(
    border.topRight,
    border.topLeft,
    border.bottomLeft,
    border.bottomRight,
    10
  );
  treePositions = treePositions.concat(positions);
});

// Générer les positions pour le pentagone (hitbox petite)
const pentagonPositions = generatePentagonPositions(pentagon, 1);
treePositions = treePositions.concat(pentagonPositions);

// Sauvegarder dans un fichier JSON
fs.writeFileSync(
  "treePositions.json",
  JSON.stringify(treePositions, null, 2),
  "utf-8"
);
console.log("Positions des arbres sauvegardées dans treePositions.json");
