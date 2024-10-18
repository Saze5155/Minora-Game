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
    this.pathPoints = [];
    this.snapToLastTile = false;
    this.isPathMode = false;
    this.initImageSelector(); // Initialiser la galerie d'images
    this.setupEvents(); // Configurer les événements de clic et de touches
  }

  // Initialiser la galerie d'images
  initImageSelector() {
    const images = [
      "/5/test3D/examples/village/ruines5.png",
      "/5/test3D/examples/village/ruines4.png",

      "/5/test3D/examples/village/ruines3.png",
      "/5/test3D/examples/village/ruines2.png",
      "/5/test3D/examples/village/ruines1.png",
      "/5/test3D/examples/village/arbre1.png",
      "/5/test3D/examples/village/arbre2.png",
      "/5/test3D/examples/village/arbre3.png",
      "/5/test3D/examples/village/arbre4.png",

      "/5/test3D/examples/vie/vie-03.png",
      "/5/test3D/examples/vie/vie-04.png",
      "/5/test3D/examples/vie/vie-05.png",
      "/5/test3D/examples/vie/vie-06.png",
      "/5/test3D/examples/vie/vie-07.png",

      "/5/test3D/examples/touches/touche_Z.png",
      "/5/test3D/examples/touches/touche_Q.png",
      "/5/test3D/examples/touches/touche_S.png",
      "/5/test3D/examples/touches/touche_D.png",
      "/5/test3D/examples/touches/touches_E.png",
      "/5/test3D/examples/touches/touche_space.png",
      "/5/test3D/examples/touches/touches_souris.png",
      "/5/test3D/examples/touches/touches_tab.png",
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
    const geometry = new THREE.PlaneGeometry(1, 1);
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

  rotateXCurrentObject() {
    if (this.currentObject) {
      this.currentObject.rotation.x += Math.PI / 8; // Faire tourner l'objet autour de l'axe Y
      console.log("Rotation de l'objet");
    }
  }

  // Gérer la hauteur de l'image avec la molette de la souris
  adjustHeight(event) {
    if (this.currentObject) {
      const delta = event.deltaY * -0.001; // Utiliser le mouvement de la molette
      this.currentObject.position.y += delta; // Ajuster la hauteur (Y)
      console.log(`Hauteur ajustée : Y=${this.currentObject.position.y}`);
    }
  }

  // Enregistrer les données de la tuile et ajouter à tilesData
  confirmTile() {
    if (this.currentObject) {
      // Si le mode de collage est activé et qu'il y a déjà une tuile placée
      if (this.snapToLastTile && this.tilesData.length > 0) {
        const lastTile = this.tilesData[this.tilesData.length - 1]; // Dernière tuile placée
        const tileSize = 3.2; // Ajuste cette valeur selon la taille des barrières

        // Récupérer la rotation Y de la dernière tuile
        const rotationY = lastTile.rotationY % (Math.PI * 2); // Normaliser la rotation entre 0 et 2π

        // Calculer l'offset en fonction de la rotation et du tileSize
        const offsetX = Math.round(Math.cos(rotationY)) * tileSize;
        const offsetZ = Math.round(Math.sin(rotationY)) * tileSize;

        // Appliquer le décalage à la nouvelle tuile en fonction de la rotation
        this.currentObject.position.set(
          lastTile.position.x + offsetX,
          this.currentObject.position.y, // Garder la même hauteur
          lastTile.position.z + offsetZ
        );

        // Faire correspondre la rotation de la nouvelle tuile à celle de la dernière
        this.currentObject.rotation.y = lastTile.rotationY;
      }

      // Enregistrer les informations de la tuile dans tilesData
      this.tilesData.push({
        texture: this.selectedImage,
        position: this.currentObject.position.clone(),
        rotationY: this.currentObject.rotation.y,
        rotationX: this.currentObject.rotation.x,
      });

      console.log("Tuile validée et ajoutée à tilesData", this.tilesData);

      // Optionnel : Envoyer les données de la tuile au serveur
      this.saveTileDataToServer({
        texture: this.selectedImage,
        position: this.currentObject.position.clone(),
        rotationY: this.currentObject.rotation.y,
        rotationX: this.currentObject.rotation.x,
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

  // Fonction pour gérer le clic de la souris et ajouter des points au chemin
  addPathPoint(event) {
    // Utiliser le laser pour obtenir les coordonnées de clic dans l'espace 3D
    this.laser.updatePointer(event);
    this.laser.update(); // Met à jour le laser pour obtenir les coordonnées d'intersection

    const intersects = this.laser.raycaster.intersectObjects(
      this.laser.objects
    );

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const { x, y, z } = intersect.point;

      // Ajouter le point au tableau
      this.pathPoints.push(new THREE.Vector3(x, y, z));

      console.log(`Point ajouté : X=${x}, Y=${y}, Z=${z}`);

      // Vérifier si on a 4 points
      if (this.pathPoints.length === 4) {
        this.createRectangleFromPoints(this.pathPoints); // Créer un rectangle
        this.pathPoints = []; // Réinitialiser les points pour commencer un nouveau rectangle
      }
    }
  }

  // Fonction pour créer un segment du chemin
  createRectangleFromPoints(points) {
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });

    // Calculer la taille du rectangle (approximé en fonction des points)
    const width = points[1].distanceTo(points[0]);
    const height = points[3].distanceTo(points[0]);
    const depth = 1; // Tu peux ajuster cette valeur si nécessaire

    const geometry = new THREE.BoxGeometry(width, depth, height);

    // Positionner le centre du rectangle au milieu des 4 points
    const centerX = (points[0].x + points[1].x + points[2].x + points[3].x) / 4;
    const centerY = (points[0].y + points[1].y + points[2].y + points[3].y) / 4;
    const centerZ = (points[0].z + points[1].z + points[2].z + points[3].z) / 4;

    const rectangle = new THREE.Mesh(geometry, material);
    rectangle.position.set(centerX, centerY, centerZ);

    // Ajouter le rectangle à la scène
    this.scene.third.scene.add(rectangle);

    console.log("Rectangle créé avec les points fournis.");
  }

  onMouseClick(event) {
    if (this.isPathMode) {
      console.log("je clique");
      this.addPathPoint(event); // Ajouter un point au chemin quand le mode est activé
    }
  }
  // Configurer les événements de clic, de molette, et de touches
  setupEvents() {
    window.addEventListener("mousedown", (event) => this.startDragging(event));
    window.addEventListener("mousemove", (event) => this.onMouseMove(event));
    window.addEventListener("mouseup", () => this.stopDragging());
    window.addEventListener("mousedown", (event) => this.onMouseClick(event));
    // Touche "R" pour la rotation
    window.addEventListener("keydown", (event) => {
      if (event.code === "KeyR") {
        this.rotateCurrentObject();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.code === "KeyE") {
        this.rotateXCurrentObject();
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

    window.addEventListener("keydown", (event) => {
      if (event.code === "Tab") {
        this.snapToLastTile = !this.snapToLastTile; // Inverser l'état de collage
        console.log(
          `Mode collage automatique : ${
            this.snapToLastTile ? "Activé" : "Désactivé"
          }`
        );
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.code === "KeyQ") {
        this.isPathMode = !this.isPathMode; // Bascule entre mode normal et mode chemin
        console.log("Mode chemin activé :", this.isPathMode);
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
