const fs = require("fs");
const path = require("path");

// Fonction pour corriger les noms de fichiers en ajoutant 'g' et 'h' aux bons endroits
function correctFrameNames(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error("Erreur lors de la lecture du dossier:", err);
      return;
    }

    files.forEach((file) => {
      const oldPath = path.join(directory, file);

      // Vérifier si le fichier correspond au pattern _jumpauce_1.png (ou similaire)
      if (file.includes("attaqueauce")) {
        // Remplacer 'jumpauce' par 'jumpgauceh'
        const newFileName = file.replace("attaqueauce", "attaquegauche");
        const newPath = path.join(directory, newFileName);

        // Renommer le fichier
        fs.rename(oldPath, newPath, (err) => {
          if (err) {
            console.error(`Erreur lors du renommage de ${file}:`, err);
          } else {
            console.log(`${file} renommé en ${newFileName}`);
          }
        });
      }
    });
  });
}

// Exécuter la fonction sur un dossier spécifique
const directoryPath = path.resolve(
  __dirname,
  "./5/test3D/examples/anim_player"
); // Modifie avec le chemin correct

if (!fs.existsSync(directoryPath)) {
  console.error(`Erreur: Le chemin spécifié n'existe pas : ${directoryPath}`);
  process.exit(1);
}

correctFrameNames(directoryPath);
