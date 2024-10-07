export default class EnemyRPG {
  constructor(scene, x, y, z, textureKey, player) {
    // Utiliser les mêmes paramètres de construction que le joueur
    const texture = new THREE.TextureLoader().load(textureKey);
    const geometry = new THREE.PlaneGeometry(2.5, 2.5);
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
      width: 1.5,
      height: 2,
      depth: 0.1,
    });
    this.walkPlane.geometry = new THREE.PlaneGeometry(1.5, 1.5);
    this.walkPlane.body.setGravity(0, -9.8, 0);
    this.walkPlane.body.setAngularFactor(0, 0, 0);

    // Charger les textures pour les animations
    this.loadTextures("_walkdroite", 2, "walkdroite");
    this.loadTextures("_marcheAvant", 2, "marcheAvant");
    this.loadTextures("_marcheArriere", 2, "marcheArriere");
    this.healthPoints = 2;
    this.isTakingDamage = false;
    this.material = material;
    this.currentFrame = 0;
    this.isAnimating = false;
    this.currentAction = null;
    this.randomTarget = null;
    this.patrolPoints = this.generatePatrolPoints();
    this.isMovingToRandomTarget = false;
    this.player = player; // Référence au joueur pour la détection
    this.detectionRadius = 200; // Rayon de détection pour l'ennemi
    this.speed = 0.05; // Vitesse de déplacement de l'ennemi
  }

  takeDamage(playerPosition) {
    if (this.isDead) return; // Si l'ennemi est déjà mort, ne rien faire

    this.healthPoints -= 1; // Diminuer les points de vie
    console.log(`L'ennemi a pris 1 de dégâts, reste ${this.healthPoints} HP.`);

    if (this.healthPoints <= 0) {
      this.die(); // Appeler la fonction de mort si les HP sont à 0 ou moins
    }
  }

  // Fonction pour tuer l'ennemi
  die() {
    this.isDead = true; // Marquer l'ennemi comme mort
    console.log("L'ennemi est mort !");
    this.walkPlane.visible = false; // Rendre l'ennemi invisible
    this.walkPlane.geometry.dispose(); // Libérer la mémoire de la géométrie
    this.walkPlane.material.dispose();
  }

  // Fonction pour charger les textures de l'ennemi
  loadTextures(name, frameCount, action) {
    const framePaths = [];
    for (let i = 1; i <= frameCount; i++) {
      framePaths.push(`/5/test3D/examples/monstre 2/${name}_${i}.png`);
    }

    const textureLoader = new THREE.TextureLoader();
    framePaths.forEach((path, index) => {
      textureLoader.load(
        path,
        (texture) => {
          if (!this[action]) {
            this[action] = [];
          }
          this[action][index] = texture;
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

  // Fonction d'animation de l'ennemi
  animateAction(action) {
    let textures = this[action];

    // Si l'action est "walkgauche", utiliser les frames de "walkdroite" mais inverser la texture
    if (action === "walkgauche") {
      textures = this["walkdroite"]; // Utiliser les mêmes frames que walkdroite
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

  // Se déplacer vers une position donnée
  moveTowards(targetX, targetZ) {
    const dx = targetX - this.walkPlane.position.x;
    const dz = targetZ - this.walkPlane.position.z;
    const angle = Math.atan2(dz, dx);

    this.walkPlane.body.setVelocityX(Math.cos(angle) * 2); // Vitesse sur l'axe X
    this.walkPlane.body.setVelocityZ(Math.sin(angle) * 2); // Vitesse sur l'axe Z

    // Choisir l'animation en fonction de la direction de déplacement
    if (Math.abs(dx) > Math.abs(dz)) {
      // Déplacement horizontal (gauche/droite)
      if (dx > 0) {
        this.walkPlane.scale.x = 5; // Face à droite
        this.animateAction("walkdroite");
      } else {
        this.walkPlane.scale.x = -5; // Face à gauche (miroir)
        this.animateAction("walkgauche"); // Utiliser la même animation pour gauche
      }
    } else {
      // Déplacement vertical (avant/arrière)
      if (dz > 0) {
        this.animateAction("marcheAvant");
      } else {
        this.animateAction("marcheArriere");
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
