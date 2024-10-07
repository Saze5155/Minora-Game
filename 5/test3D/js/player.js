import Global from "/5/test3D/js/inventaire.js";

export default class Player {
  constructor(scene, x, y, z, textureKey, combat) {
    // Charger la texture initiale
    const texture = new THREE.TextureLoader().load(textureKey);
    const geometry = new THREE.PlaneGeometry(2.5, 2.5);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.5,
    });

    // Stocker walkPlane en tant que propriété de l'instance
    this.walkPlane = new THREE.Mesh(geometry, material);
    this.walkPlane.position.set(x, y, z);
    scene.third.scene.add(this.walkPlane);

    // Ajouter un corps physique au personnage (walkPlane)
    scene.third.physics.add.existing(this.walkPlane, {
      shape: "box",
      width: 1.5,
      height: 2,
      depth: 0.1,
    });
    this.walkPlane.geometry = new THREE.PlaneGeometry(1.5, 2); // Dimensions mises à jour

    // Appliquer la gravité à walkPlane
    this.walkPlane.body.setGravity(0, -9.8, 0); // Gravité dirigée vers le bas

    // Empêcher le personnage de tourner sur les axes X et Z
    this.walkPlane.body.setAngularFactor(0, 0, 0);

    // Initialisation des touches
    this.keys = {
      left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      forward: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
      backward: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      jump: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      attack: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O),
      interact: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      inventory: scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.TAB
      ),
    };

    this.material = material; // Stocker le matériau pour l'utiliser dans animateWalk
    this.currentFrame = 0;

    // Initialisation des tableaux de textures pour différentes animations
    this.walkTextures = [];
    this.jumpGaucheTextures = [];
    this.jumpDroiteTextures = [];
    this.attaqueGauche = [];
    this.attaqueDroite = [];
    this.idleTextures = [];
    this.walkGaucheTextures = [];
    this.walkDroiteTextures = [];
    this.marcheAvantTextures = []; // Animations avant
    this.marcheArriereTextures = []; // Animations arrière
    this.isWalking = false;
    this.isJumping = false;
    this.inventory = true;

    this.savedVelocityX = 0; // Mémoriser la vitesse X pendant l'attaque
    this.savedVelocityZ = 0;

    // Charger toutes les animations en tenant compte des dossiers
    this.loadTextures("attack", "_attaquedroite", 8, this.attaqueDroite);
    this.loadTextures("attack", "_attaquegauche", 8, this.attaqueGauche);
    this.loadTextures("jump", "_jumpgauche", 10, this.jumpGaucheTextures);
    this.loadTextures("jump", "_jumpdroite", 10, this.jumpDroiteTextures);
    this.loadTextures("idle", "_idle", 6, this.idleTextures);
    this.loadTextures("walk", "_walkgauche", 9, this.walkGaucheTextures);
    this.loadTextures("walk", "_walkdroite", 9, this.walkDroiteTextures);
    this.loadTextures(
      "walk_front",
      "_marcheAvant",
      4,
      this.marcheAvantTextures
    ); // Avancer
    this.loadTextures(
      "walk_back",
      "_marcheArriere",
      4,
      this.marcheArriereTextures
    ); // Reculer
  }

  preload() {
    this.load.image("steak", "/5/test3D/examples/cuisine/steak_cru.png");
  }

  // Fonction pour charger les textures depuis un dossier spécifique
  loadTextures(folder, name, frameCount, textureArray) {
    const framePaths = [];
    for (let i = 1; i <= frameCount; i++) {
      framePaths.push(
        `/5/test3D/examples/anim_player/${folder}/${name}_${i}.png`
      );
    }

    const textureLoader = new THREE.TextureLoader();
    framePaths.forEach((path, index) => {
      textureLoader.load(
        path,
        (texture) => {
          textureArray[index] = texture;
        },
        undefined,
        (err) => {
          console.error(
            `Erreur lors du chargement de la texture ${path}:`,
            err
          );
        }
      );
    });
  }

  // Fonction d'animation
  animateAction(action) {
    let textures;
    switch (action) {
      case "walkgauche":
        textures = this.walkGaucheTextures;
        break;
      case "walkdroite":
        textures = this.walkDroiteTextures;
        break;
      case "jumpgauche":
        textures = this.jumpGaucheTextures;
        break;
      case "jumpdroite":
        textures = this.jumpDroiteTextures;
        break;
      case "marcheAvant":
        textures = this.marcheAvantTextures;
        break;
      case "marcheArriere":
        textures = this.marcheArriereTextures;
        break;
      case "idle":
        textures = this.idleTextures;
        break;
      case "attaquegauche":
        textures = this.attaqueGauche;
        break;
      case "attaquedroite":
        textures = this.attaqueDroite;
        break;
      default:
        console.error(`Action ${action} non reconnue`);
        return;
    }

    if (this.currentAction === action && this.isAnimating) return;

    this.isAnimating = true;
    this.currentAction = action;
    let frameRate = 90;

    if (
      action == "jumpgauche" ||
      action == "jumpdroite" ||
      action == "idle" ||
      action == "marcheAvant"
    ) {
      frameRate = 150;
    }

    let lastFrameTime = 0;

    const animateFrame = (time) => {
      if (this.currentAction !== action || !this.isAnimating) return;

      if (time - lastFrameTime >= frameRate) {
        lastFrameTime = time;
        if (textures.length > 0) {
          this.material.map = textures[this.currentFrame];
          this.material.needsUpdate = true;
          this.currentFrame = (this.currentFrame + 1) % textures.length;
        }
      }
      requestAnimationFrame(animateFrame);
    };
    requestAnimationFrame(animateFrame);
  }

  // Fonction pour vérifier si le personnage touche le sol
  isOnGround() {
    if (this.walkPlane.position.y <= 252.24996948242188) {
      return true;
    }
    return false;
  }

  update(scene) {
    const body = this.walkPlane.body;
    let velocityX = 0;
    let velocityY = body.velocity.y;
    let velocityZ = 0;
    let isWalking = false;

    // Vérifier si une attaque est en cours
    if (this.isAttacking) {
      body.setVelocityX(0);
      body.setVelocityZ(0);
      return;
    }

    // Mouvement gauche/droite
    if (this.keys.left.isDown) {
      velocityX = -6;
      this.walkPlane.scale.x = -1;
      isWalking = true;
      if (!this.isJumping && this.isOnGround()) {
        this.animateAction("walkgauche");
      }
    } else if (this.keys.right.isDown) {
      velocityX = 6;
      this.walkPlane.scale.x = 1;
      isWalking = true;
      if (!this.isJumping && this.isOnGround()) {
        this.animateAction("walkdroite");
      }
    } else {
      // Seulement vérifier le mouvement avant/arrière si gauche/droite n'est pas activé
      if (this.keys.forward.isDown && !this.isAttacking) {
        velocityZ = -6; // Avancer
        isWalking = true;
        if (!this.isJumping) this.animateAction("marcheArriere");
      } else if (this.keys.backward.isDown && !this.isAttacking) {
        velocityZ = 6; // Reculer
        isWalking = true;
        if (!this.isJumping) this.animateAction("marcheAvant");
      }
    }

    if (this.keys.jump.isDown && this.isOnGround()) {
      velocityY = 6; // Impulsion vers le haut
      this.isJumping = true;
      // Animation du saut en fonction de la direction
      if (this.keys.left.isDown) {
        this.animateAction("jumpgauche");
      } else {
        this.animateAction("jumpdroite");
      }
    }

    // Détecter l'attaque
    if (this.keys.attack.isDown && this.isOnGround()) {
      this.isAttacking = true;
      this.attack = true;
      this.savedVelocityX = velocityX;
      this.savedVelocityZ = velocityZ;
      velocityZ = 0;
      velocityX = 0;

      // Lancer l'animation d'attaque
      if (this.keys.left.isDown) {
        this.animateAction("attaquegauche");
      } else {
        this.animateAction("attaquedroite");
      }

      // Bloquer toute autre animation pendant l'attaque
      setTimeout(() => {
        this.isAttacking = false;
        if (
          !this.keys.left.isDown &&
          !this.keys.right.isDown &&
          !this.keys.forward.isDown &&
          !this.keys.backward.isDown
        ) {
          body.setVelocityX(0);
          body.setVelocityZ(0);
        } // L'attaque est terminée après un certain temps
      }, 1000); // Durée de l'attaque (en millisecondes) — ajuste selon la durée de ton animation
    }
    if (this.isOnGround() && !this.isAttacking) {
      this.isJumping = false;

      if (!isWalking) {
        body.setVelocityX(0);
        body.setVelocityZ(0);
        this.animateAction("idle");
      }
    }
    if (!this.isAttacking) {
      body.setVelocityX(velocityX);
      body.setVelocityY(velocityY);
      body.setVelocityZ(velocityZ);
    }

    if (this.keys.inventory.isDown && this.inventory) {
      this.inventory = false;
      Global.toggleInventory(scene);

      setTimeout(() => {
        this.inventory = true;
      }, 1000);
    }

    scene.third.camera.position.set(
      this.walkPlane.position.x,
      this.walkPlane.position.y + 2,
      this.walkPlane.position.z + 10
    );
    scene.third.camera.lookAt(this.walkPlane.position);
  }
}
