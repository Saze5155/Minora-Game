export default class camera {
  constructor(scene) {
    this.scene = scene;

    // Vérifier si la caméra est bien une instance de THREE.PerspectiveCamera
    if (!(scene.third.camera instanceof THREE.PerspectiveCamera)) {
      console.error("La caméra n'est pas de type THREE.PerspectiveCamera");
    }

    // Créer une caméra libre à partir de scene.third.camera
    this.camera = scene.third.camera;
    this.camera.position.set(0, 10, 20); // Position initiale
    this.camera.lookAt(0, 0, 0); // Faire regarder la caméra vers le centre de la scène

    // Initialisation des touches pour la caméra libre
    this.keys = {
      forward: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z), // Avancer
      backward: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S), // Reculer
      left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q), // Gauche
      right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D), // Droite
      up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), // Monter
      down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
      lock: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L), // Descendre
    };

    // Variables pour gérer la rotation et la vitesse de déplacement
    this.rotationSpeed = 0.002; // Vitesse de rotation ajustée pour la souris
    this.moveSpeed = 1;

    // Activer le "pointer lock" sur clic gauche
    scene.input.keyboard.on("keydown", (event) => {
      if (event.code === "KeyL") {
        console.log("Touche L détectée");
        this.togglePointerLock();
      }
    });
    // Gérer la rotation lorsque le pointeur est locké
    scene.input.on("pointermove", this.handleMouseMove, this);

    // Sortir du pointer lock avec échap
    scene.input.keyboard.on("keydown_ESC", () => {
      scene.input.mouse.releasePointerLock();
    });
  }

  togglePointerLock() {
    if (!this.isLocked) {
      this.scene.input.mouse.requestPointerLock();
      console.log("Pointer lock activé");
    } else {
      this.scene.input.mouse.releasePointerLock();
      console.log("Pointer lock désactivé");
    }
  }

  update() {
    this.updateCameraMovement();
  }

  updateCameraMovement() {
    const moveSpeed = this.moveSpeed;

    // Avancer et reculer
    if (this.keys.forward.isDown) {
      this.camera.translateZ(-moveSpeed); // Avancer
    } else if (this.keys.backward.isDown) {
      this.camera.translateZ(moveSpeed); // Reculer
    }

    // Déplacement gauche/droite
    if (this.keys.left.isDown) {
      this.camera.translateX(-moveSpeed); // Gauche
    } else if (this.keys.right.isDown) {
      this.camera.translateX(moveSpeed); // Droite
    }

    // Monter et descendre
    if (this.keys.up.isDown) {
      this.camera.translateY(moveSpeed); // Monter
    } else if (this.keys.down.isDown) {
      this.camera.translateY(-moveSpeed); // Descendre
    }
  }

  handleMouseMove(pointer) {
    // Vérifier si le pointeur est locké
    if (this.scene.input.mouse.locked) {
      // Rotation horizontale (gauche/droite)
      this.camera.rotation.y -= pointer.movementX * this.rotationSpeed;

      // Rotation verticale (haut/bas)
      this.camera.rotation.x -= pointer.movementY * this.rotationSpeed;

      // Limiter l'angle vertical pour éviter une rotation complète
      this.camera.rotation.x = Phaser.Math.Clamp(
        this.camera.rotation.x,
        -Math.PI / 2,
        Math.PI / 2
      );
    }
  }
}
