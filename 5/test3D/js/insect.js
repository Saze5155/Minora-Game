export default class Insect {
  constructor(scene, imageKey, speed) {
    this.scene = scene;
    this.speed = speed;
    this.honeyDroppedToday = false;
    this.pentagon = [
      { x: -213, z: -14 },
      { x: -22, z: -22 },
      { x: 97, z: -194 },
      { x: -51, z: -219 },
      { x: -180, z: -144 },
    ];

    const spawnPoint = this.getRandomPointInPentagon();

    const texture = new THREE.TextureLoader().load(imageKey);
    const geometry = new THREE.PlaneGeometry(5, 5);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.5,
    });

    this.insectImage = new THREE.Mesh(geometry, material);
    this.insectImage.position.set(spawnPoint.x, 255.5, spawnPoint.z);
    scene.third.scene.add(this.insectImage);
    this.insectImage.scale.set(0.7, 0.7, 0.7);

    this.targetX = this.insectImage.position.x;
    this.targetZ = this.insectImage.position.z;
    this.changeDirection();
    this.checkHoneyGeneration();
  }

  getRandomPointInPentagon() {
    const [a, b, c, d, e] = this.pentagon;
    const p1 = Phaser.Math.RND.pick([a, b, c, d, e]);
    const p2 = Phaser.Math.RND.pick([a, b, c, d, e]);

    const randomX = Phaser.Math.Interpolation.Linear(
      [p1.x, p2.x],
      Math.random()
    );
    const randomZ = Phaser.Math.Interpolation.Linear(
      [p1.z, p2.z],
      Math.random()
    );

    return { x: randomX, z: randomZ };
  }

  checkHoneyGeneration() {
    this.scene.time.addEvent({
      delay: 1000, // Toutes les 2 minutes (120000 ms)
      loop: true,
      callback: () => {
        if (!this.scene.isDay && !this.honeyDroppedToday) {
          const chance = Phaser.Math.FloatBetween(0, 1);
          if (chance <= 0.6) {
            this.dropHoney();
            this.honeyDroppedToday = true; // Le miel a été généré aujourd'hui
          }
        }

        // Réinitialiser la variable lorsque la nuit commence
        if (this.scene.isDay) {
          this.honeyDroppedToday = false;
        }
      },
    });
  }

  dropHoney() {
    // Position de l'insecte pour laisser tomber le miel
    const honeyX = this.insectImage.position.x;
    const honeyZ = this.insectImage.position.z;
    const honeyY = this.insectImage.position.y - 5; // Un peu en dessous de l'insecte

    const texture = new THREE.TextureLoader().load(
      "/5/test3D/examples/cuisine/miel.png"
    );
    const geometry = new THREE.PlaneGeometry(0.6, 0.6);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.5,
    });

    const honey = new THREE.Mesh(geometry, material);

    this.scene.third.physics.add.existing(honey, {
      shape: "box",
      width: 1.5,
      height: 2,
      depth: 0.5,
      mass: 0,
    });

    const body = honey.body;
    body.setCollisionFlags(4);
    honey.position.set(honeyX, honeyY, honeyZ);
    this.scene.third.scene.add(honey);
  }
  changeDirection() {
    this.targetX = this.insectImage.position.x + Phaser.Math.Between(-100, 100);
    this.targetZ = this.insectImage.position.z + Phaser.Math.Between(-100, 100);

    this.scene.time.addEvent({
      delay: Phaser.Math.Between(2000, 4000),
      callback: () => this.changeDirection(),
    });
  }

  update() {
    const dx = this.targetX - this.insectImage.position.x;
    const dz = this.targetZ - this.insectImage.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance > 1) {
      // Déplacer l'image progressivement vers la cible
      this.insectImage.position.x += (dx / distance) * this.speed;
      this.insectImage.position.z += (dz / distance) * this.speed;

      // Calculer l'angle de rotation en fonction de la direction
      const angle = Math.atan2(dz, dx);
      this.insectImage.rotation.y = -angle; // Appliquer la rotation pour orienter correctement l'image
    }
  }
}
