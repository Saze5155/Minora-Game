export default class LoupeEffect {
  constructor(scene, player, blockingObjects) {
    this.scene = scene;
    this.player = player;
    this.blockingObjects = blockingObjects;

    // Créer une géométrie pour la sphère de loupe
    const geometry = new THREE.CircleGeometry(5, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.3,
      transparent: true,
    });
    this.loupe = new THREE.Mesh(geometry, material);

    // La sphère doit être positionnée devant la caméra
    this.scene.third.scene.add(this.loupe);
  }

  update() {
    const cameraPosition = this.scene.third.camera.position;
    const playerPosition = this.player.walkPlane.position;

    // Mettre à jour la position de la loupe pour qu'elle soit devant la caméra, à la même hauteur que le player
    this.loupe.position.set(
      playerPosition.x,
      playerPosition.y,
      playerPosition.z
    );

    // Parcourir les objets bloquants
    this.blockingObjects.forEach((object) => {
      const distance = object.position.distanceTo(cameraPosition);

      if (distance < 10) {
        // Ajuster cette distance en fonction de la taille du jeu
        object.material.opacity = 0.3;
        object.material.transparent = true;
      } else {
        object.material.opacity = 1;
        object.material.transparent = false;
      }
    });
  }
}
