export default class EnemyLaby {
  constructor(scene, x, y, textureKey) {
    this.scene = scene;

    this.sprite = scene.physics.add.sprite(x, y, textureKey);
    this.sprite.body.setSize(this.sprite.width, this.sprite.height * 0.9);
    this.sprite.body.setOffset(0, this.sprite.height * 0.12);
    this.sprite.setScale(0.4).setDepth(10);
    this.sprite.setCollideWorldBounds(true);

    this.speed = 800;
    this.direction = 1;
    this.pv = 2;
    this.detectionRadius = 1000; // Rayon de détection du joueur

    this.changeDirectionTimer = this.scene.time.addEvent({
      delay: 2000,
      callback: this.changeDirection,
      callbackScope: this,
      loop: true,
    });
  }

  update(player) {
    if (!this.sprite.active) return;

    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      player.sprite.x,
      player.sprite.y
    );

    if (distanceToPlayer < this.detectionRadius) {
      this.moveTowardsPlayer(player);
    }
  }

  changeDirection() {
    if (!this.sprite.active) return;
    if (this.canChangeDirection) {
      const randomAngle = Phaser.Math.Between(0, 360);
      const velocityX =
        this.speed * Math.cos(Phaser.Math.DegToRad(randomAngle));
      const velocityY =
        this.speed * Math.sin(Phaser.Math.DegToRad(randomAngle));

      this.sprite.setVelocity(velocityX, velocityY);
      this.sprite.setRotation(randomAngle); // Ajuster pour que l'image pointe correctement
    }
  }

  moveTowardsPlayer(player) {
    const angleToPlayer = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      player.sprite.x,
      player.sprite.y
    );

    const velocityX = this.speed * Math.cos(angleToPlayer);
    const velocityY = this.speed * Math.sin(angleToPlayer);

    this.sprite.setVelocity(velocityX, velocityY);
    this.sprite.setRotation(angleToPlayer + Math.PI + 90); // Ajuster pour que l'image pointe vers le joueur
  }

  damage() {
    this.pv--;
    if (this.pv <= 0) {
      this.sprite.destroy();
    }
  }
}
