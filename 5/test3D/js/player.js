import Global from "/5/test3D/js/inventaire.js";

export default class Player {
  constructor(scene, x, y, z, textureKey) {
    // Charger la texture initiale
    const texture = new THREE.TextureLoader().load(textureKey);
    const geometry = new THREE.PlaneGeometry(2.5, 2.5);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.5,
    });

    // Stocker walkPlane en tant que propriété de l'instance
    this.walkPlane = new THREE.Mesh(geometry, material);
    this.walkPlane.position.set(x, y, z);
    scene.third.scene.add(this.walkPlane);

    this.scene = scene;

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
      attack: scene.input.mousePointer.leftButtonDown(),
      interact: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      inventory: scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.TAB
      ),
    };

    this.material = material; // Stocker le matériau pour l'utiliser dans animateWalk
    this.currentFrame = 0;

    this.walkTextures = [];
    this.jumpGaucheTextures = [];
    this.jumpDroiteTextures = [];
    this.attaqueGauche = [];
    this.attaqueDroite = [];
    this.attaqueAvant = [];
    this.attaqueArriere = [];
    this.idleTextures = [];
    this.walkGaucheTextures = [];
    this.walkDroiteTextures = [];
    this.marcheAvantTextures = []; // Animations avant
    this.marcheArriereTextures = []; // Animations arrière
    this.isWalking = false;
    this.isJumping = false;
    this.inventory = true;
    this.isInvincible = false;
    this.direction = "right";

    this.maxVelocity = 50;

    this.healthImages = {};
    this.healthImages[5] = scene.add
      .image(1050, 460, "heart_5")
      .setScale(0.4)
      .setVisible(false);
    this.healthImages[4] = scene.add
      .image(1050, 460, "heart_4")
      .setScale(0.4)
      .setVisible(false);
    this.healthImages[3] = scene.add
      .image(1050, 460, "heart_3")
      .setScale(0.4)
      .setVisible(false);
    this.healthImages[2] = scene.add
      .image(1050, 460, "heart_2")
      .setScale(0.4)
      .setVisible(false);
    this.healthImages[1] = scene.add
      .image(1050, 460, "heart_1")
      .setScale(0.4)
      .setVisible(false);
    this.healthImages[6] = scene.add
      .image(1050, 460, "heart_6")
      .setScale(0.3)
      .setVisible(false);
    this.currentHealthImage = null;
    this.currentHitbox = null;

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
    );
    this.loadTextures("attack", "attaqueavant", 7, this.attaqueAvant);
    this.loadTextures("attack", "attaquearriere", 7, this.attaqueArriere);
  }

  preload() {}

  hitboxAttack() {
    if (this.currentHitbox) {
      return this.currentHitbox;
    }

    let offsetX = 0;
    let offsetZ = 0;

    let witdh = 0;
    let depth = 0;

    if (this.keys.left.isDown || this.direction == "left") {
      offsetX = -1;
      witdh = 0.5;
      depth = 1.5;
    } else if (this.keys.right.isDown || this.direction == "right") {
      offsetX = 1;
      witdh = 0.5;
      depth = 1.5;
    } else if (this.keys.forward.isDown || this.direction == "back") {
      offsetZ = -1;
      witdh = 1.5;
      depth = 0.5;
    } else if (this.keys.backward.isDown || this.direction == "front") {
      offsetZ = 1;
      witdh = 1.5;
      depth = 0.5;
    } else {
      offsetX = 1;
      witdh = 0.5;
      depth = 1.5;
    }

    const hitboxGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
    const hitboxMaterial = new THREE.MeshBasicMaterial({ visible: false });

    const hitbox = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
    hitbox.position.set(
      this.walkPlane.position.x + offsetX,
      this.walkPlane.position.y,
      this.walkPlane.position.z + offsetZ
    );

    this.scene.third.scene.add(hitbox);
    this.scene.third.physics.add.existing(hitbox, {
      shape: "box",
      width: witdh,
      height: 1,
      depth: depth,
      isTrigger: true,
    });

    // Stocke la hitbox active
    this.currentHitbox = hitbox;

    return hitbox;
  }

  // Méthode pour supprimer la hitbox
  removeHitbox() {
    if (this.currentHitbox) {
      this.scene.third.scene.remove(this.currentHitbox);
      if (this.currentHitbox.body) {
        this.scene.third.physics.destroy(this.currentHitbox.body);
      }
      this.currentHitbox = null; // Réinitialise la référence de la hitbox
    }
  }

  loadTextures(folder, name, frameCount, textureArray) {
    const framePaths = [];
    for (let i = 1; i <= frameCount; i++) {
      framePaths.push(
        `/5/test3D/examples/anim_player/${folder}/${name}_${i}.png`
      );
    }

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
      case "attaqueavant":
        textures = this.attaqueAvant;
        break;
      case "attaquearriere":
        textures = this.attaqueArriere;
        break;
      default:
        console.error(`Action ${action} non reconnue`);
        return;
    }

    if (this.currentAction === action && this.isAnimating) return;

    this.isAnimating = true;
    this.currentAction = action;
    this.currentFrame = 0; // Réinitialiser à la première frame
    let frameRate = 90;

    if (
      action === "jumpgauche" ||
      action === "jumpdroite" ||
      action === "idle" ||
      action === "marcheAvant"
    ) {
      frameRate = 150;
    }

    let lastFrameTime = 0;

    const animateFrame = (time) => {
      if (this.currentAction !== action || !this.isAnimating) return;

      if (time - lastFrameTime >= frameRate) {
        lastFrameTime = time;
        if (textures.length > 0) {
          // Utiliser l'index modulo la longueur du tableau pour éviter de dépasser
          this.currentFrame = this.currentFrame % textures.length;
          this.material.map = textures[this.currentFrame];
          this.material.needsUpdate = true;
          this.currentFrame++;
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
    // Ajoute une variable pour suivre l'état du son de marche
    if (!this.isWalkingSoundPlaying) {
      this.isWalkingSoundPlaying = false;
    }

    // Mouvement gauche/droite
    if (this.keys.left.isDown) {
      velocityX = -6;
      this.walkPlane.scale.x = -1;
      isWalking = true;
      this.direction = "left";
      if (!this.isJumping && this.isOnGround()) {
        this.animateAction("walkgauche");

        // Joue le son de marche uniquement si ce n'est pas déjà en train de jouer
        if (!this.isWalkingSoundPlaying) {
          this.scene.sound.play("walk_grass");
          this.isWalkingSoundPlaying = true;
        }
      }
    } else if (this.keys.right.isDown) {
      velocityX = 6;
      this.walkPlane.scale.x = 1;
      isWalking = true;
      this.direction = "right";
      if (!this.isJumping && this.isOnGround()) {
        this.animateAction("walkdroite");

        if (!this.isWalkingSoundPlaying) {
          this.scene.sound.play("walk_grass");
          this.isWalkingSoundPlaying = true;
        }
      }
    } else if (this.keys.forward.isDown && !this.isAttacking) {
      velocityZ = -6; // Avancer
      isWalking = true;
      this.direction = "back";

      if (!this.isJumping) {
        this.animateAction("marcheArriere");

        if (!this.isWalkingSoundPlaying) {
          this.scene.sound.play("walk_grass");
          this.isWalkingSoundPlaying = true;
        }
      }
    } else if (this.keys.backward.isDown && !this.isAttacking) {
      velocityZ = 6; // Reculer
      isWalking = true;
      this.direction = "front";

      if (!this.isJumping) {
        this.animateAction("marcheAvant");

        if (!this.isWalkingSoundPlaying) {
          this.scene.sound.play("walk_grass");
          this.isWalkingSoundPlaying = true;
        }
      }
    } else {
      // Arrête le son de marche lorsque le joueur arrête de marcher
      if (this.isWalkingSoundPlaying) {
        this.scene.sound.stopByKey("walk_grass");
        this.isWalkingSoundPlaying = false;
      }
    }

    if (this.keys.jump.isDown && this.isOnGround()) {
      velocityY = 4; // Impulsion vers le haut
      this.isJumping = true;
      this.scene.sound.play("Jump");
      // Animation du saut en fonction de la direction
      if (this.keys.left.isDown) {
        this.animateAction("jumpgauche");
      } else {
        this.animateAction("jumpdroite");
      }
    }

    if (this.scene.input.activePointer.leftButtonDown() && this.isOnGround()) {
      this.isAttacking = true;
      this.attack = true;
      this.scene.sound.play("Sword");
      velocityZ = 0;
      velocityX = 0;

      if (this.keys.left.isDown) {
        this.animateAction("attaquegauche");
      } else if (this.keys.right.isDown) {
        this.animateAction("attaquedroite");
      } else if (this.keys.forward.isDown) {
        this.animateAction("attaquearriere");
      } else if (this.keys.backward.isDown) {
        this.animateAction("attaqueavant");
      } else {
        if (this.direction == "left") {
          this.animateAction("attaquegauche");
        } else if (this.direction == "right") {
          this.animateAction("attaquedroite");
        } else if (this.direction == "back") {
          this.animateAction("attaquearriere");
        } else if (this.direction == "front") {
          this.animateAction("attaqueavant");
        }
      }

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
        }
      }, 800);
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
      }, 800);
    }

    // Positionner la caméra
    scene.third.camera.position.set(
      this.walkPlane.position.x,
      this.walkPlane.position.y + 2,
      this.walkPlane.position.z + 10
    );

    // La caméra regarde toujours vers le personnage
    scene.third.camera.lookAt(this.walkPlane.position);
  }

  decreaseHealth(scene) {
    if (this.isInvincible) {
      return;
    }
    this.scene.sound.play("damage");
    Global.playerHealth--;
    this.showHealth();

    console.log("aie");

    if (Global.playerHealth <= 0) {
      this.death(scene);
    } else {
      this.setInvincibility(); // Activer l'invincibilité
    }
  }

  showHealth() {
    if (this.currentHealthImage) {
      this.currentHealthImage.setVisible(false);
    }

    if (this.healthImages[Global.playerHealth]) {
      this.currentHealthImage = this.healthImages[Global.playerHealth];

      this.currentHealthImage.setVisible(true);

      setTimeout(() => {
        if (this.currentHealthImage) {
          this.currentHealthImage.setVisible(false);
        }
      }, 2000);
    }
  }

  gainHealth(meatType) {
    console.log("je mange");
    if (
      meatType === "viande bien cuite" &&
      Global.maxHealth > Global.playerHealth
    ) {
      if (Global.playerHealth == 5) {
        this.scene.sound.play("Manger");
        setTimeout(() => {
          Global.playerHealth++;
          this.scene.sound.play("GagnerVie");
          this.showHealth();
        }, 3000);
      } else {
        this.scene.sound.play("Manger");
        setTimeout(() => {
          Global.playerHealth += 2;
          this.scene.sound.play("GagnerVie");
          this.showHealth();
        }, 3000);
      }
    } else if (
      (meatType === "viande pas trop cuite" &&
        Global.maxHealth > Global.playerHealth) ||
      (meatType === "viande trop cuite" &&
        Global.maxHealth > Global.playerHealth)
    ) {
      this.scene.sound.play("Manger");
      setTimeout(() => {
        Global.playerHealth++;
        this.scene.sound.play("GagnerVie");
        this.showHealth();
      }, 3000);
    }
  }

  setInvincibility() {
    this.isInvincible = true;

    setTimeout(() => {
      this.isInvincible = false;
    }, 3000);
  }

  death(scene) {
    console.log("mort");
    scene.pause();
  }
}
