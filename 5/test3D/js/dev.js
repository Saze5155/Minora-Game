import Laser from "/5/test3D/js/laser.js";

export default class DevMode {
  constructor(scene, camera, textureLoader) {
    this.scene = scene;
    this.placedTiles = [];
    this.camera = camera;
    this.textureLoader = textureLoader;
    this.selectedImage = null; // Image sélectionnée
    this.currentObject = null; // Objet temporairement placé
    this.isDragging = false; // Indicateur de glissement
    this.laser = new Laser(scene); // Initialiser le laser pour obtenir les coordonnées
    this.tilesData = [];
    this.initImageSelector(); // Initialiser la galerie d'images
    this.setupEvents(); // Configurer les événements de clic et de touches
  }

  // Initialiser la galerie d'images
  initImageSelector() {
    const images = [
      "/5/test3D/examples/vie/vie-09.png",
      "/5/test3D/examples/vie/vie-10.png",
      "/5/test3D/examples/vie/vie-11.png",
      "/5/test3D/examples/vie/vie-12.png",
      "/5/test3D/examples/vie/vie-13.png",
      "/5/test3D/examples/vie/vie-14.png",
      "/5/test3D/examples/vie/vie-15.png",
      "/5/test3D/examples/vie/vie-16.png",
      "/5/test3D/examples/vie/vie-17.png",
      "/5/test3D/examples/vie/vie-18.png",
      "/5/test3D/examples/vie/vie-19.png",
      "/5/test3D/examples/vie/vie-20.png",
      "/5/test3D/examples/vie/vie-21.png",
      "/5/test3D/examples/vie/vie-22.png",
      "/5/test3D/examples/vie/vie-23.png",
      "/5/test3D/examples/vie/vie-24.png",
      "/5/test3D/examples/vie/vie-25.png",
      "/5/test3D/examples/vie/vie-26.png",
      "/5/test3D/examples/vie/vie-27.png",
    ];

    const container = document.getElementById("image-selector");

    container.innerHTML = "";

    images.forEach((imagePath) => {
      const imgElement = document.createElement("img");
      imgElement.src = imagePath;
      imgElement.style.width = "100px";
      imgElement.onclick = () => {
        this.selectedImage = imagePath;
        console.log(`Image sélectionnée : ${imagePath}`);
      };
      container.appendChild(imgElement);
    });
  }

  // Début du glissement
  startDragging(event) {
    if (!this.selectedImage) return; // S'assurer qu'une image est sélectionnée

    const texture = this.textureLoader.load(this.selectedImage);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });
    const geometry = new THREE.PlaneGeometry(10, 10);
    this.currentObject = new THREE.Mesh(geometry, material);

    this.scene.third.scene.add(this.currentObject); // Ajouter l'image à la scène
    this.isDragging = true; // Activer le mode glisser-déposer

    console.log("Drag started");
  }

  // Déplacer l'image avec la souris
  onMouseMove(event) {
    if (!this.isDragging || !this.currentObject) return;

    // Mettre à jour le pointeur avec le laser
    this.laser.updatePointer(event);
    this.laser.update(); // Mettre à jour le laser pour obtenir les coordonnées d'intersection

    const intersects = this.laser.raycaster.intersectObjects(
      this.laser.objects
    );

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const { x, y, z } = intersect.point;

      this.currentObject.position.set(x, y, z);
      console.log(`Position de l'image : X=${x}, Y=${y}, Z=${z}`);
    }
  }

  // Gérer la rotation de l'image avec la touche "R"
  rotateCurrentObject() {
    if (this.currentObject) {
      this.currentObject.rotation.y += Math.PI / 8; // Faire tourner l'objet autour de l'axe Y
      console.log("Rotation de l'objet");
    }
  }

  // Gérer la hauteur de l'image avec la molette de la souris
  adjustHeight(event) {
    if (this.currentObject) {
      const delta = event.deltaY * -0.01; // Utiliser le mouvement de la molette
      this.currentObject.position.y += delta; // Ajuster la hauteur (Y)
      console.log(`Hauteur ajustée : Y=${this.currentObject.position.y}`);
    }
  }

  // Enregistrer les données de la tuile et ajouter à tilesData
  confirmTile() {
    if (this.currentObject) {
      // Enregistrer les informations de la tuile dans tilesData
      this.tilesData.push({
        texture: this.selectedImage,
        position: this.currentObject.position.clone(), // Copier la position pour éviter la référence
        rotation: this.currentObject.rotation.y,
      });

      console.log("Tuile validée et ajoutée à tilesData", this.tilesData);

      // Optionnel : Envoyer les données de la tuile au serveur
      this.saveTileDataToServer({
        texture: this.selectedImage,
        position: this.currentObject.position.clone(),
        rotation: this.currentObject.rotation.y,
      });

      this.currentObject = null; // Réinitialiser l'objet après ajout
    }
  }

  // Supprimer l'objet sélectionné
  deleteCurrentObject() {
    if (this.currentObject) {
      this.scene.third.scene.remove(this.currentObject); // Supprimer l'objet de la scène
      this.currentObject = null;
      console.log("Objet supprimé de la scène");

      // Supprimer également les données associées dans tilesData
      this.tilesData.pop(); // Supprimer la dernière tuile ajoutée (ou gérer selon ta logique)
      console.log("Dernière tuile supprimée de tilesData", this.tilesData);
    }
  }
  stopDragging() {
    if (this.isDragging) {
      this.isDragging = false; // Désactiver le mode glisser-déposer
      console.log("Drag stopped");
    }
  }
  saveTileDataToServer(tileData) {
    fetch("../save-tiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tileData), // Envoyer les données de la tuile au serveur
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Tuile enregistrée avec succès :", data.message);
      })
      .catch((error) => {
        console.error("Erreur lors de la sauvegarde de la tuile :", error);
      });
  }

  // Configurer les événements de clic, de molette, et de touches
  setupEvents() {
    window.addEventListener("mousedown", (event) => this.startDragging(event));
    window.addEventListener("mousemove", (event) => this.onMouseMove(event));
    window.addEventListener("mouseup", () => this.stopDragging());

    // Touche "R" pour la rotation
    window.addEventListener("keydown", (event) => {
      if (event.code === "KeyR") {
        this.rotateCurrentObject();
      }
    });

    // Molette pour ajuster la hauteur
    window.addEventListener("wheel", (event) => this.adjustHeight(event));

    // Touche "ENTER" pour valider la position de la tuile et l'ajouter à tilesData
    window.addEventListener("keydown", (event) => {
      if (event.code === "Enter") {
        this.confirmTile();
      }
    });

    // Touche "DELETE" pour supprimer la tuile actuellement sélectionnée
    window.addEventListener("keydown", (event) => {
      if (event.code === "Backspace") {
        this.deleteCurrentObject();
      }
    });

    console.log("Events setup completed");
  }

  // Méthode pour définir le cube cible
  setTargetCube(cube) {
    this.laser.addObject(cube); // Ajouter le cube aux objets que le laser doit détecter
    console.log("Cube cible défini");
  }
}
