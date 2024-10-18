const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
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

// Route pour sauvegarder une tuile dans tiles.json
app.post("/save-tiles", (req, res) => {
  const tileData = req.body;

  console.log("Données reçues du client :", tileData);

  const jsonFilePath = path.join(__dirname, "/json/tiles.json");

  // Lire le contenu actuel du fichier tiles.json
  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    let tiles = [];

    if (err) {
      if (err.code === "ENOENT") {
        // Si le fichier n'existe pas, on le crée plus tard
        console.log(
          "Le fichier tiles.json n'existe pas encore, création d'un nouveau fichier."
        );
      } else {
        console.error("Erreur lors de la lecture de tiles.json :", err);
        return res.status(500).send("Erreur lors de la lecture de tiles.json");
      }
    } else {
      // Si le fichier existe, on parse les données JSON actuelles
      tiles = JSON.parse(data);
    }

    // Ajouter la nouvelle tuile dans le tableau des tuiles
    tiles.push({
      position: {
        x: tileData.position.x,
        y: tileData.position.y,
        z: tileData.position.z,
      },
      rotationY: tileData.rotationY,
      texture: tileData.texture,
    });

    // Sauvegarder les nouvelles données dans le fichier JSON
    fs.writeFile(
      jsonFilePath,
      JSON.stringify(tiles, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error("Erreur lors de l'écriture dans tiles.json :", err);
          return res
            .status(500)
            .send("Erreur lors de l'écriture dans tiles.json");
        }

        console.log("Tuile ajoutée avec succès dans tiles.json");
        res.json({ message: "Tuile enregistrée avec succès dans tiles.json" });
      }
    );
  });
});

// Lancement du serveur sur le port 3000
app.listen(3000, () => {
  console.log("Serveur démarré sur le port 3000");
});
