const fs = require("fs");

const treeTextures = [
  "/5/test3D/examples/village/arbre1.png",
  "/5/test3D/examples/village/arbre2.png",
  "/5/test3D/examples/village/arbre3.png",
];

const houseTextures = [
  "/5/test3D/examples/village/ruines5.png",
  "/5/test3D/examples/village/ruines1.png",
  "/5/test3D/examples/village/ruines3.png",
];

// Fonction pour générer un scale aléatoire pour les arbres
function getRandomTreeScale(texture) {
  return Math.random() * (12 - 8) + 8; // Échelle aléatoire entre 8 et 12
}

// Coordonnées des points pour placer les arbres
const treeAreaPoints = [
  { x: 311, z: -379 },
  { x: 422, z: -381 },
  { x: 414, z: -277 },
  { x: 316, z: -279 },
];

// Zones réservées pour les maisons (vous pouvez ajuster ces zones)
const reservedBuildingZones = [
  { x: 340, z: -370, width: 30, height: 30 }, // Zone pour la maison 1
  { x: 400, z: -290, width: 30, height: 30 }, // Zone pour la maison 2
];

// Fonction pour vérifier si une position est dans une zone réservée
function isInsideReservedZone(x, z, reservedZones) {
  return reservedZones.some((zone) => {
    return (
      x > zone.x - zone.width / 2 &&
      x < zone.x + zone.width / 2 &&
      z > zone.z - zone.height / 2 &&
      z < zone.z + zone.height / 2
    );
  });
}

// Générer des positions aléatoires pour les arbres en évitant les zones réservées
const generateTreePositions = (points, reservedZones, treeCount) => {
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
  const areaCenter = calculatePolygonCenter(points);

  for (let i = 0; i < treeCount; i++) {
    let treePlaced = false;

    while (!treePlaced) {
      const minX = Math.min(...points.map((p) => p.x));
      const maxX = Math.max(...points.map((p) => p.x));
      const minZ = Math.min(...points.map((p) => p.z));
      const maxZ = Math.max(...points.map((p) => p.z));

      const randomX = minX + Math.random() * (maxX - minX);
      const randomZ = minZ + Math.random() * (maxZ - minZ);

      const randomPoint = { x: randomX, z: randomZ };

      if (
        isInsidePolygon(randomPoint, points) &&
        !isInsideReservedZone(randomX, randomZ, reservedZones)
      ) {
        const texture =
          treeTextures[Math.floor(Math.random() * treeTextures.length)];
        const scale = getRandomTreeScale(texture);
        const yPosition = 252.5; // Position Y fixe pour les arbres

        const tree = {
          x: randomX,
          z: randomZ,
          y: yPosition,
          texture: texture,
          scale: scale,
        };

        positions.push(tree);
        treePlaced = true;
      }
    }
  }

  return positions;
};

// Générer les positions pour les arbres
const treePositions = generateTreePositions(
  treeAreaPoints,
  reservedBuildingZones,
  30
);

// Placer les maisons dans les zones réservées
const housePositions = reservedBuildingZones.map((zone, index) => {
  return {
    x: zone.x,
    z: zone.z,
    y: 252.5, // Position Y fixe pour les maisons
    texture: houseTextures[index % houseTextures.length],
    scale: 20, // Échelle pour les maisons
  };
});

// Sauvegarder les positions des arbres et des maisons dans un fichier JSON
fs.writeFileSync(
  "forestTreeAndHousePositions.json",
  JSON.stringify({ trees: treePositions, houses: housePositions }, null, 2),
  "utf-8"
);

console.log(
  "Positions des arbres et des maisons sauvegardées dans forestTreeAndHousePositions.json"
);
