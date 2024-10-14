export default class EnemyPlat {
  constructor(scene, x, y, textureKey) {
    this.scene = scene;

    this.sprite = scene.physics.add.sprite(x, y, textureKey);

    this.sprite.body.setSize(this.sprite.width, this.sprite.height * 0.9);
    this.sprite.body.setOffset(0, this.sprite.height * 0.12);
    this.sprite.setScale(0.1);
    this.sprite.setCollideWorldBounds(true);

    this.speed = 100;
    this.direction = 1;

    this.createAnimations();
    this.canChangeDirection = true;

    this.sprite.play("enemy");
    this.sprite.setVelocityX(this.speed);
  }

  createAnimations() {
    this.scene.anims.create({
      key: "enemy",
      frames: [
        { key: "enemy_1" },
        { key: "enemy_2" },
        { key: "enemy_3" },
        { key: "enemy_4" },
        { key: "enemy_5" },
        { key: "enemy_6" },
      ],
      frameRate: 10,
      repeat: -1,
    });
  }

  update(platform_layer) {
    this.sprite.setVelocityX(this.speed * this.direction);

    if (this.canChangeDirection) {
      // Vérifier s'il n'y a plus de sol en dessous
      const groundCheckX =
        this.sprite.x + this.direction * (this.sprite.width / 2);
      const groundCheckY = this.sprite.y + this.sprite.height / 2 + 1;
      const tileBelow = platform_layer.getTileAtWorldXY(
        groundCheckX,
        groundCheckY
      );

      // Si l'ennemi n'a plus de sol en dessous ou touche un mur
      if (
        !tileBelow ||
        this.sprite.body.blocked.left ||
        this.sprite.body.blocked.right
      ) {
        this.canChangeDirection = false;
        this.direction *= -1;
        this.sprite.setVelocityX(this.speed * this.direction);
        this.sprite.flipX = this.direction === -1;

        // Ajouter un délai avant de pouvoir changer de direction à nouveau
        this.scene.time.delayedCall(500, () => {
          this.canChangeDirection = true;
        });
      }
    }
  }

  changeDirection() {
    // Inverser la direction et stopper temporairement pour éviter d'être bloqué
    this.direction *= -1;
    this.sprite.setVelocityX(this.speed * this.direction);
    this.sprite.flipX = this.direction === -1;

    // Empêche de changer immédiatement
    this.canChangeDirection = false;

    // Autoriser un nouveau changement de direction après un délai
    this.scene.time.delayedCall(5000, () => {
      this.canChangeDirection = true;
    });
  }
}
