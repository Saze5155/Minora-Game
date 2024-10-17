export default class EnemyPlat {
  constructor(scene, x, y, textureKey) {
    this.scene = scene;

    this.sprite = scene.physics.add.sprite(x, y, textureKey);

    this.sprite.body.setSize(this.sprite.width, this.sprite.height * 0.9);
    this.sprite.body.setOffset(0, this.sprite.height * 0.12);
    this.sprite.setScale(0.9);
    this.sprite.setCollideWorldBounds(true);

    this.health = 2;
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

    this.scene.anims.create({
      key: "enemy_space",
      frames: [
        { key: "alien_1" },
        { key: "alien_2" },
        { key: "alien_3" },
        { key: "alien_4" },
        console.log("animation play"),
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "piece",
      frames: [
        { key: "piece_01" },
        { key: "piece_02" },
        { key: "piece_03" },
        { key: "piece_04" },
        { key: "piece_05" },
        { key: "piece_06" },
      ],
      frameRate: 10,
      repeat: -1,
    });
  }

  takeDamage() {
    this.health -= 1; // L'ennemi perd un point de vie
    if (this.health <= 0) {
      this.die(); // Si la vie tombe à 0, l'ennemi meurt
    }
    console.log("take damage");
  }

  die() {
    // Détruire ou désactiver l'ennemi
    this.sprite.destroy(); // Ou une autre logique pour gérer la mort de l'ennemi
    console.log("eneemu mort");
  }

  update(platform_layer) {}

  changeDirection() {
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
