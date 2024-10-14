const fs = require("fs");

const cactusTextures = ["/5/test3D/examples/éléments desert/cactus.png"];

// Fonction pour générer un scale aléatoire
function getRandomScale() {
  return Math.random() * (1.5 - 0.5) + 0.5; // Génère une échelle entre 0.5 et 1.5
}

// Coordonnées du pentagone
const pentagon = [
  { x: 122, z: -174 },
  { x: 218, z: -73 },
  { x: 222, z: 86 },
  { x: 131, z: 196 },
  { x: 31, z: 8 },
];

// Générer des positions aléatoires dans le pentagone
const generatePentagonCactusPositions = (points, hitboxWidth) => {
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

  for (let i = 0; i < 80; i++) {
    let cactusPlaced = false;

    while (!cactusPlaced) {
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
          y: 255,
          hitboxWidth,
          texture: cactusTextures[0],
          scale: getRandomScale(), // Ajoute un scale aléatoire pour chaque cactus
        });
        cactusPlaced = true;
      }
    }
  }

  return positions;
};

// Générer les positions pour les cactus dans le pentagone
const pentagonCactusPositions = generatePentagonCactusPositions(pentagon, 5);

// Sauvegarder dans un fichier JSON
fs.writeFileSync(
  "cactusPositions.json",
  JSON.stringify(pentagonCactusPositions, null, 2),
  "utf-8"
);

console.log(
  "Positions des cactus avec scale aléatoire sauvegardées dans cactusPositions.json"
);
