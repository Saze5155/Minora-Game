const fs = require("fs");

const cactusTextures = [
  "/5/test3D/examples/éléments desert/crane.png",
  "/5/test3D/examples/éléments desert/plante1.png",
  "/5/test3D/examples/éléments desert/plante2.png",
  "/5/test3D/examples/éléments desert/plantemorte.png",
  "/5/test3D/examples/éléments desert/arbremort.png",
];

// Fonction pour générer un scale aléatoire
function getRandomScale(texture) {
  if (
    texture.includes("crane") ||
    texture.includes("plante") ||
    texture.includes("plantemorte")
  ) {
    return 2.5; // Échelle pour les petits objets
  } else {
    return 10; // Échelle pour les arbres
  }
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
  let craneCount = 0; // Compteur de crânes

  for (let i = 0; i < 150; i++) {
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
        let texture =
          cactusTextures[Math.floor(Math.random() * cactusTextures.length)];

        // Limiter le nombre de crânes à 15
        if (texture.includes("crane")) {
          if (craneCount >= 15) {
            // Si le nombre de crânes est atteint, choisir une autre texture
            texture =
              cactusTextures.slice(1)[
                Math.floor(Math.random() * (cactusTextures.length - 1))
              ];
          } else {
            craneCount++;
          }
        }

        const scale = getRandomScale(texture);
        const yPosition = texture.includes("arbremort") ? 255.7 : 252.3;

        const cactus = {
          x: randomX,
          z: randomZ,
          y: yPosition,
          texture: texture,
          scale: scale,
        };

        // Ajouter la hitbox uniquement pour les arbres morts
        if (texture.includes("arbremort")) {
          cactus.hitboxWidth = hitboxWidth;
        }

        positions.push(cactus);
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
  "decoDesertPositions.json",
  JSON.stringify(pentagonCactusPositions, null, 2),
  "utf-8"
);

console.log(
  "Positions des cactus avec scale aléatoire sauvegardées dans decoDesertPositions.json"
);
