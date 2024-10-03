export default class laser {
  constructor(scene) {
    this.scene = scene;

    // Créer un raycaster
    this.raycaster = new THREE.Raycaster();

    // Créer un vecteur pour stocker la position du pointeur
    this.pointer = new THREE.Vector2();

    // Ajouter un texte pour afficher les coordonnées
    this.coordinateText = scene.add.text(10, 10, "", {
      font: "16px Arial",
      fill: "#ffffff",
      align: "center",
    });

    // Écouter les mouvements de la souris
    scene.input.on("pointermove", this.updatePointer, this);

    // Stocker les objets avec lesquels on veut interagir (par exemple, le sol)
    this.objects = [];
  }

  // Fonction pour mettre à jour la position du pointeur
  updatePointer(pointer) {
    // Normaliser les coordonnées du pointeur
    this.pointer.x = (pointer.x / this.scene.sys.canvas.width) * 2 - 1;
    this.pointer.y = -(pointer.y / this.scene.sys.canvas.height) * 2 + 1;
  }

  // Mettre à jour le raycaster et détecter les intersections
  update() {
    // Mettre à jour le raycaster en fonction de la caméra et du pointeur
    this.raycaster.setFromCamera(this.pointer, this.scene.third.camera);

    // Vérifier les intersections avec les objets
    const intersects = this.raycaster.intersectObjects(this.objects);

    if (intersects.length > 0) {
      const intersect = intersects[0];

      // Afficher les coordonnées du point d'intersection
      const { x, y, z } = intersect.point;
      this.coordinateText.setText(
        `X: ${x.toFixed(2)} Y: ${y.toFixed(2)} Z: ${z.toFixed(2)}`
      );
    }
  }

  // Ajouter des objets avec lesquels le rayon doit interagir
  addObject(object) {
    this.objects.push(object);
  }
}
