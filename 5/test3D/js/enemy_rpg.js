import Global from "/5/test3D/js/inventaire.js";

export default class EnemyRPG {
  constructor(scene, x, y, z, textureKey, player) {
    // Utiliser les mêmes paramètres de construction que le joueur
    const texture = new THREE.TextureLoader().load(textureKey);
    const geometry = new THREE.PlaneGeometry(2.5, 2.5);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.5,
    });

    this.walkPlane = new THREE.Mesh(geometry, material);
    this.walkPlane.position.set(x, y, z);
    scene.third.scene.add(this.walkPlane);

    scene.third.physics.add.existing(this.walkPlane, {
      shape: "box",
      width: 1.5,
      height: 2,
      depth: 2,
    });
    this.walkPlane.geometry = new THREE.PlaneGeometry(1.5, 2);

    this.walkPlane.body.setGravity(0, -9.8, 0);
    this.walkPlane.body.setAngularFactor(0, 0, 0);

    Promise.all([
      this.loadTextures("_walkdroite", 2, "walkdroite"),
      this.loadTextures("_marcheAvant", 2, "marcheAvant"),
      this.loadTextures("_marcheArriere", 2, "marcheArriere"),
    ])
      .then(() => {
        this.texturesLoaded = true; // Indiquer que les textures sont chargées
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des textures :", err);
      });

    this.healthPoints = 2;
    this.isTakingDamage = false;

    this.isTakingDamage = true;

    this.material = material;
    this.currentFrame = 0;
    this.isAnimating = false;
    this.currentAction = null;
    this.randomTarget = null;
    this.patrolPoints = this.generatePatrolPoints();
    this.isMovingToRandomTarget = false;
    this.player = player;
    this.scene = scene;
    this.detectionRadius = 200; // Rayon de détection pour l'ennemi
    this.speed = 0.05;
  }

  takeDamage(playerPosition) {
    if (this.isDead) return;
    this.scene.sound.play("animal_damage");
    this.healthPoints -= 1;
    this.isKnockedBack = true;

    const directionX = this.walkPlane.position.x - playerPosition.x;
    const directionZ = this.walkPlane.position.z - playerPosition.z;
    const magnitude = Math.sqrt(
      directionX * directionX + directionZ * directionZ
    );

    this.walkPlane.body.setVelocityX((directionX / magnitude) * 5);
    this.walkPlane.body.setVelocityZ((directionZ / magnitude) * 5);

    setTimeout(() => {
      this.isKnockedBack = false;
    }, 500);

    if (this.healthPoints <= 0) {
      this.die();
    }
  }

  // Fonction pour tuer l'ennemi
  die() {
    this.isDead = true; // Marquer l'ennemi comme mort

    this.scene.third.physics.destroy(this.walkPlane.body);
    this.walkPlane.visible = false;
    this.walkPlane.geometry.dispose();
    this.walkPlane.material.dispose();
    this.spawnItem();
  }

  spawnItem() {
    const textureLoader = new THREE.TextureLoader();
    const textureCoin = textureLoader.load(
      "/5/test3D/examples/piece/piece-02.png"
    );
    const coinValue = this.getRandomCoinValue();
    const coinGeometry = new THREE.PlaneGeometry(0.6, 0.6);
    const coinMaterial = new THREE.MeshBasicMaterial({
      map: textureCoin, // Utiliser la première texture
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.5,
    });

    const coin = new THREE.Mesh(coinGeometry, coinMaterial);
    coin.position.set(
      this.walkPlane.position.x,
      251.5,
      this.walkPlane.position.z
    );

    this.scene.third.physics.add.existing(coin, {
      shape: "box",
      width: 1.5,
      height: 2,
      depth: 0.5,
      mass: 0,
    });

    const body = coin.body;
    body.setCollisionFlags(4);

    this.scene.third.scene.add(coin);

    this.scene.third.physics.add.collider(this.player.walkPlane, coin, () => {
      Global.addCoin(coinValue);
      this.scene.sound.play("collect"); // Assurez-vous que 'collect' est chargé dans la scène
      this.scene.third.scene.remove(coin);

      if (body) {
        this.scene.third.physics.destroy(body);
      }
    });

    // Drop de la potion
    const potionType = this.getRandomPotionType();
    if (potionType) {
      console.log(potionType);
      const texture = textureLoader.load(
        "/5/test3D/examples/potions/" + potionType[0] + ".png"
      );
      const potionGeometry = new THREE.PlaneGeometry(0.6, 0.6);
      const potionMaterial = new THREE.MeshBasicMaterial({
        map: texture, // Utiliser la texture de la potion
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const potion = new THREE.Mesh(potionGeometry, potionMaterial);
      potion.position.set(
        this.walkPlane.position.x + 1, // Décalage pour ne pas superposer avec la pièce
        251.5,
        this.walkPlane.position.z
      );

      this.scene.third.physics.add.existing(potion, {
        shape: "box",
        width: 1.5,
        height: 2,
        depth: 0.5,
        mass: 0,
      });

      const potionBody = potion.body;
      potionBody.setCollisionFlags(4);
      this.scene.third.scene.add(potion);

      this.scene.third.physics.add.collider(
        this.player.walkPlane,
        potion,
        () => {
          const potionTypeName = potionType[0];
          const potionLimit = {
            vie: 10,
            mana: 10,
            manaPlus: 5,
            viePlus: 5,
            defense: 2,
            force: 2,
            vieFull: 1,
            temps: 1,
            espace: 1,
          };

          if (!Global.inventory.potions[potionTypeName]) {
            console.error(
              `Le type de potion ${potionTypeName} n'existe pas dans l'inventaire.`
            );
            return;
          }

          if (
            Global.inventory.potions[potionTypeName].length <
            potionLimit[potionTypeName]
          ) {
            Global.addPotion(potionTypeName);
            this.scene.sound.play("collect"); // Utilise la scène passée en argum
            this.scene.third.scene.remove(potion);

            if (potionBody) {
              this.scene.third.physics.destroy(potionBody);
            }
          } else {
            console.log(`${potionTypeName} est plein.`);
          }
        }
      );
    }
  }

  getRandomCoinValue() {
    const random = Math.random() * 100;

    if (random <= 65) {
      return 5;
    } else if (random <= 80) {
      return 10;
    } else if (random <= 90) {
      return 15;
    } else if (random <= 98) {
      return 25;
    } else {
      return 50;
    }
  }

  getRandomPotionType() {
    const potionChance = Math.random() * 100;

    if (potionChance <= 60) {
      const potionTypeChance = Math.random() * 100;

      if (potionTypeChance <= 25) {
        return ["force", "potion_force"];
      } else if (potionTypeChance <= 50) {
        return ["vie", "potion_vie"];
      } else if (potionTypeChance <= 75) {
        return ["mana", "potion_mana"];
      } else {
        return ["defense", "potion_defense"];
      }
    }
    return null;
  }

  loadTextures(name, frameCount, action) {
    const framePaths = [];
    for (let i = 1; i <= frameCount; i++) {
      framePaths.push(`/5/test3D/examples/monstre 2/${name}_${i}.png`);
    }

    const textureLoader = new THREE.TextureLoader();
    return Promise.all(
      framePaths.map((path, index) => {
        return new Promise((resolve, reject) => {
          textureLoader.load(
            path,
            (texture) => {
              if (!this[action]) {
                this[action] = [];
              }
              this[action][index] = texture;
              resolve(texture);
            },
            undefined,
            (err) => {
              console.error(
                `Erreur lors du chargement de la texture ${path}:`,
                err
              );
              reject(err);
            }
          );
        });
      })
    );
  }

  // Fonction d'animation de l'ennemi
  animateAction(action) {
    let textures = this[action];

    if (action === "walkgauche") {
      textures = this["walkdroite"];
    }

    if (this.currentAction === action && this.isAnimating) return;

    this.isAnimating = true;
    this.currentAction = action;
    let frameRate = 40;
    let lastFrameTime = 0;

    const animateFrame = (time) => {
      if (this.currentAction !== action || !this.isAnimating) return;

      if (time - lastFrameTime >= frameRate) {
        lastFrameTime = time;
        if (textures.length > 0) {
          this.material.map = textures[this.currentFrame];

          if (action === "walkgauche") {
            this.material.map.repeat.set(-1, 1);
            this.material.map.offset.set(1, 0);
          } else {
            this.material.map.repeat.set(1, 1);
            this.material.map.offset.set(0, 0);
          }

          this.material.needsUpdate = true;
          this.currentFrame = (this.currentFrame + 1) % textures.length;
        }
      }
      requestAnimationFrame(animateFrame);
    };

    requestAnimationFrame(animateFrame);
  }
  generatePatrolPoints() {
    const pentagon = [
      { x: -213, z: -14 },
      { x: -22, z: -22 },
      { x: 97, z: -194 },
      { x: -51, z: -219 },
      { x: -180, z: -144 },
    ];
    const points = [];
    for (let i = 0; i < 5; i++) {
      const randomX =
        pentagon[i].x +
        Math.random() * (pentagon[(i + 1) % 5].x - pentagon[i].x);
      const randomZ =
        pentagon[i].z +
        Math.random() * (pentagon[(i + 1) % 5].z - pentagon[i].z);
      points.push({ x: randomX, z: randomZ });
    }
    return points;
  }
  isPlayerInDetectionRadius() {
    const distanceSquared =
      (this.player.walkPlane.position.x - this.walkPlane.position.x) ** 2 +
      (this.player.walkPlane.position.z - this.walkPlane.position.z) ** 2;
    return distanceSquared < this.detectionRadius;
  }

  // Patrouiller vers des points aléatoires
  patrol() {
    if (!this.currentTarget || this.reachedTarget()) {
      this.currentTarget =
        this.patrolPoints[Math.floor(Math.random() * this.patrolPoints.length)];
    }
    this.moveTowards(this.currentTarget.x, this.currentTarget.z);
  }

  moveTowards(targetX, targetZ) {
    const dx = targetX - this.walkPlane.position.x;
    const dz = targetZ - this.walkPlane.position.z;
    const angle = Math.atan2(dz, dx);

    if (this.walkPlane.body) {
      this.walkPlane.body.setVelocityX(Math.cos(angle) * 2);
      this.walkPlane.body.setVelocityZ(Math.sin(angle) * 2);

      if (Math.abs(dx) > Math.abs(dz)) {
        if (dx > 0) {
          this.walkPlane.scale.x = 5;
          this.animateAction("walkdroite");
        } else {
          this.walkPlane.scale.x = -5;
          this.animateAction("walkgauche");
        }
      } else {
        if (dz > 0) {
          this.animateAction("marcheAvant");
        } else {
          this.animateAction("marcheArriere");
        }
      }
    }
  }

  // Vérifier si l'ennemi a atteint sa cible
  reachedTarget() {
    const distanceSquared =
      (this.currentTarget.x - this.walkPlane.position.x) ** 2 +
      (this.currentTarget.z - this.walkPlane.position.z) ** 2;
    return distanceSquared < 1; // Si la distance est inférieure à une petite valeur
  }

  // Mettre à jour l'ennemi
  update() {
    if (!this.texturesLoaded || this.isKnockedBack) return;

    if (this.isPlayerInDetectionRadius()) {
      this.isChasingPlayer = true;
      this.moveTowards(
        this.player.walkPlane.position.x,
        this.player.walkPlane.position.z
      );
    } else {
      this.isChasingPlayer = false;
      this.patrol();
    }
  }
}
