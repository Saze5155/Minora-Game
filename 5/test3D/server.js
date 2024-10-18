const express = require("express");
const fs = require("fs");

const path = require("path");
const app = express();

// Configuration des chemins pour servir les fichiers statiques
app.use("/lib", express.static(path.join(__dirname, "/lib")));
app.use("/5/test3D/lib", express.static(path.join(__dirname, "/lib")));
app.use(
  "/5/test3D/save_tiles",
  express.static(path.join(__dirname, "/save_tiles"))
);
app.use("/5/test3D/js", express.static(path.join(__dirname, "/js")));
app.use(
  "/5/test3D/examples",
  express.static(path.join(__dirname, "/examples"))
);
app.use("/5/test3D/json", express.static(path.join(__dirname, "/json")));
app.use("/5/test3D/examples/vie", express.static(path.join(__dirname, "/vie")));

app.use((req, res, next) => {
  const extension = path.extname(req.path).toLowerCase();
  switch (extension) {
    case ".js":
      res.setHeader("Content-Type", "application/javascript");
      break;
    case ".png":
      res.setHeader("Content-Type", "image/png");
      break;
    case ".fbx":
      res.setHeader("Content-Type", "application/octet-stream");
      break;
    case ".json":
      res.setHeader("Content-Type", "application/json");
      break;
    default:
      break;
  }
  next();
});
app.get("/game", (req, res) => {
  res.sendFile(path.join(__dirname, "/game.html"));
});

app.use(express.json()); // Pour lire les requêtes JSON

// Route pour sauvegarder une tuile dans monde.js
app.post("/save-tiles", (req, res) => {
  const tileData = req.body;

  console.log("Données reçues du client :", tileData);

  // Format du code à ajouter dans monde.js
  const tileCode = `
  textureLoader.load("${tileData.texture}", (texture) => {
    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    const planeMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.5,
    });

    const tile = new THREE.Mesh(planeGeometry, planeMaterial);
    tile.position.set(${tileData.position.x}, ${tileData.position.y}, ${tileData.position.z});
    if(${tileData.rotationY} != undefined){
      tile.rotation.y =  ${tileData.rotationY};
    }
    if(${tileData.rotationX} != undefined){
      tile.rotation.x =  ${tileData.rotationX};
    }
    this.third.physics.add.existing(tile, { mass: 0 });
    this.third.scene.add(tile);
  });
  `;

  const mondePath = path.join(__dirname, "/js/monde.js");

  // Ajouter les informations de la nouvelle tuile à la fin de monde.js
  fs.readFile(mondePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur lors de la lecture de monde.js :", err);
      res.status(500).send("Erreur lors de la lecture de monde.js");
      return;
    }

    // Rechercher la méthode create() dans le fichier
    const createIndex = data.indexOf("create() {");
    if (createIndex === -1) {
      console.error("Méthode create() introuvable dans monde.js");
      res.status(500).send("Méthode create() introuvable dans monde.js");
      return;
    }

    // Trouver l'accolade fermante qui correspond à la méthode create(), en tenant compte des sous-fonctions
    let openBrackets = 1; // On commence à 1 car on est déjà dans une méthode avec une accolade ouvrante trouvée
    let closingBracketIndex = -1;

    for (let i = createIndex + "create() {".length; i < data.length; i++) {
      if (data[i] === "{") {
        openBrackets++;
      } else if (data[i] === "}") {
        openBrackets--;
      }

      if (openBrackets === 0) {
        closingBracketIndex = i;
        break;
      }
    }

    if (closingBracketIndex === -1) {
      console.error(
        "Erreur lors de la recherche de la fin de la méthode create()"
      );
      res
        .status(500)
        .send("Erreur lors de la recherche de la fin de la méthode create()");
      return;
    }

    // Insérer le code juste avant la fermeture de la méthode create()
    const updatedData = `${data.slice(
      0,
      closingBracketIndex
    )}\n${tileCode}\n${data.slice(closingBracketIndex)}`;

    // Écrire le fichier avec les nouvelles modifications
    fs.writeFile(mondePath, updatedData, "utf8", (err) => {
      if (err) {
        console.error("Erreur lors de l'écriture dans monde.js :", err);
        res.status(500).send("Erreur lors de l'écriture dans monde.js");
        return;
      }

      console.log("Tuile ajoutée à la méthode create() dans monde.js");
      res.json({ message: "Tuile enregistrée avec succès dans monde.js" });
    });
  });
});

// Lancement du serveur sur le port 3000
app.listen(3005, () => {
  console.log("Serveur démarré sur le port 3000");
});
