import Global from "/5/test3D/js/inventaire.js";

export default class Animal {
  constructor(scene, x, y, z, textureKey, player) {
    const texture = new THREE.TextureLoader().load(textureKey);
    const geometry = new THREE.PlaneGeometry(5, 5);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.5,
    });

    this.walkPlane = new THREE.Mesh(geometry, material);
    this.walkPlane.position.set(x, y, z);
    scene.third.scene.add(this.walkPlane);

    // Ajouter un corps physique
    scene.third.physics.add.existing(this.walkPlane, {
      shape: "box",
      width: 1.8,
      height: 5,
      depth: 2,
    });

    this.walkPlane.body.setGravity(0, -9.8, 0);
    this.walkPlane.body.setAngularFactor(0, 0, 0);

    this.scene = scene;
    this.player = player;
    this.healthPoints = 2;
    this.isDead = false;
    this.material = material;
    this.speed = 2;
    this.jumpInterval = Math.random() * 1000 + 500; // Temps entre chaque saut
    this.lastJumpTime = 0;
    this.jumpDuration = 1000; // Durée du saut en millisecondes
    this.isJumping = false;
    this.canJump = true;
    this.isTakingDamage = true; // Empêche de sauter pendant un saut

    // Points de patrouille dans le pentagone
    this.patrolPoints = this.generatePatrolPoints();
    this.currentTarget = null;
  }

  takeDamage(playerPosition) {
    if (this.isDead) return;

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

  die() {
    this.isDead = true;
    console.log("L'animal est mort !");
    this.walkPlane.visible = false;
    this.walkPlane.body.setCollisionFlags(4);
    this.spawnRawMeat();
  }

  spawnRawMeat() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "/5/test3D/examples/cuisine/steak_cru.png",
      (texture) => {
        const steakGeometry = new THREE.PlaneGeometry(1, 1);
        const steakMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          alphaTest: 0.5,
        });

        const steak = new THREE.Mesh(steakGeometry, steakMaterial);

        steak.position.set(
          this.walkPlane.position.x,
          251.5,
          this.walkPlane.position.z
        );

        this.scene.third.physics.add.existing(steak, {
          shape: "box",
          width: 1.5,
          height: 2,
          depth: 0.5,
          mass: 0,
        });

        steak.body.setCollisionFlags(4);

        this.scene.third.scene.add(steak);
        this.scene.third.physics.add.collider(
          this.player.walkPlane,
          steak,
          () => {
            // Ajoute de la viande crue à l'inventaire en utilisant la fonction de Global
            Global.addMeatOrHoney("viande cru", 1);

            console.log("Viande crue ramassée !");
            console.log("Inventaire mis à jour :", Global.inventory);

            this.scene.third.scene.remove(steak);

            if (steak.body) {
              this.scene.third.physics.destroy(steak.body);
            }
          }
        );
      }
    );
  }

  isOnGround() {
    if (this.walkPlane.position.y <= 253.5) {
      return true;
    }
    return false;
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

  patrol() {
    if (!this.currentTarget || this.reachedTarget()) {
      this.currentTarget =
        this.patrolPoints[Math.floor(Math.random() * this.patrolPoints.length)];
    }
  }

  moveTowards(targetX, targetZ) {
    const dx = targetX - this.walkPlane.position.x;
    const dz = targetZ - this.walkPlane.position.z;
    const angle = Math.atan2(dz, dx);

    // Déplacement uniquement pendant le saut
    if (this.isJumping) {
      this.walkPlane.body.setVelocityX(Math.cos(angle) * this.speed);
      this.walkPlane.body.setVelocityZ(Math.sin(angle) * this.speed);
    } else {
      this.walkPlane.body.setVelocityX(0);
      this.walkPlane.body.setVelocityZ(0);
    }

    // Déterminer l'orientation en fonction de la direction
    if (Math.abs(dx) > Math.abs(dz)) {
      // Déplacement horizontal (gauche/droite)
      if (dx > 0) {
        this.material.map.repeat.set(-1, 1); // Miroir pour aller vers la gauche
        this.material.map.offset.set(1, 0); // Ajuster l'offset
      } else {
        this.material.map.repeat.set(1, 1); // Normal pour aller vers la droite
        this.material.map.offset.set(0, 0); // Ajuster l'offset
      }
    } else {
      // Déplacement vertical (avant/arrière)
      if (dz < 0) {
        this.walkPlane.rotation.y = Math.PI / 2; // Tourner vers l'avant
      } else {
        this.walkPlane.rotation.y = -Math.PI / 2; // Tourner vers l'arrière
      }
    }

    this.material.map.needsUpdate = true; // Mettre à jour la texture pour que les changements prennent effet
  }

  reachedTarget() {
    const distanceSquared =
      (this.currentTarget.x - this.walkPlane.position.x) ** 2 +
      (this.currentTarget.z - this.walkPlane.position.z) ** 2;
    return distanceSquared < 1;
  }

  jump() {
    if (
      !this.isJumping &&
      this.canJump &&
      Date.now() - this.lastJumpTime >= this.jumpInterval &&
      this.isOnGround()
    ) {
      // Sauter et avancer vers la cible
      this.isJumping = true;
      this.canJump = false;
      this.walkPlane.body.setVelocityY(5);

      // Déplacer l'animal vers la cible uniquement pendant le saut
      if (this.currentTarget) {
        this.moveTowards(this.currentTarget.x, this.currentTarget.z);
      }

      // Après le saut, attendre un peu avant de permettre un autre saut
      setTimeout(() => {
        this.isJumping = false;
        setTimeout(() => {
          this.canJump = true; // Autoriser à sauter à nouveau après un délai
          this.lastJumpTime = Date.now();
        }, 200); // Petite pause avant le prochain saut
      }, this.jumpDuration);
    }
  }

  update() {
    if (this.isDead) return;
    if (!this.isKnockedBack) {
      this.jump();
      this.patrol();
    }
  }
}
