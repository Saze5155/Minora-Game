import Global from "/5/test3D/js/inventaire.js";

export default class Player2D {
  constructor(scene, x, y, textureKey) {
    this.scene = scene;

    this.sprite = scene.physics.add.sprite(x, y, textureKey);
    this.sprite.setScale(0.9);
    this.sprite.body.setSize(this.sprite.width, this.sprite.height * 0.9);
    this.sprite.body.setOffset(0, this.sprite.height * 0.1);

    this.sprite.body.checkCollision.none = true;

    // Appliquer les modifications avant d'activer les collisions
    scene.time.delayedCall(500, () => {
      this.sprite.body.checkCollision.none = false; // Activer les collisions après 500ms
    });

    this.sprite.setCollideWorldBounds(true);

    this.attackHitbox = this.scene.add.rectangle(0, 0, 1200, 1200, 0xff0000, 0);
    this.scene.physics.add.existing(this.attackHitbox);
    this.attackHitbox.body.setAllowGravity(false);
    this.attackHitbox.body.enable = false; // Désactivée par défaut

    this.keys = {
      left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      attack: scene.input.mousePointer.leftButtonDown(),
      jump: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      interact: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      inventory: scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.TAB
      ),
    };

    this.healthImages = {};
    this.healthImages[5] = scene.add
      .image(-6500, -3500, "heart_5")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(6)
      .setVisible(false);
    this.healthImages[4] = scene.add
      .image(-6500, -3500, "heart_4")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(6)
      .setVisible(false);
    this.healthImages[3] = scene.add
      .image(-6500, -3500, "heart_3")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(6)
      .setVisible(false);
    this.healthImages[2] = scene.add
      .image(-6500, -3500, "heart_2")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(6)
      .setVisible(false);
    this.healthImages[1] = scene.add
      .image(-6500, -3500, "heart_1")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(6)
      .setVisible(false);
    this.healthImages[6] = scene.add
      .image(-6500, -3500, "heart_6")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(5.9)
      .setVisible(false);
    this.currentHealthImage = null;

    this.isJumping = false;
    this.isAttacking = false;
    this.isAnimating = false;
    this.inventory = true;
    this.lastDirection = "right";
    this.createAnimations();

    this.sprite.on("animationcomplete", (animation) => {
      if (
        animation.key === "attaquedroite" ||
        animation.key === "attaquegauche" ||
        animation.key === "jumpdroite" ||
        animation.key === "jumpgauche"
      ) {
        this.isAnimating = false; // L'animation est terminée
        this.isJumping = false;
        this.isAttacking = false;
      }
    });
  }

  createAnimations() {
    // Animation de marche vers la droite (walkdroite)
    this.scene.anims.create({
      key: "walkdroite",
      frames: [
        { key: "walkdroite_1" },
        { key: "walkdroite_2" },
        { key: "walkdroite_3" },
        { key: "walkdroite_4" },
        { key: "walkdroite_5" },
        { key: "walkdroite_6" },
        { key: "walkdroite_7" },
        { key: "walkdroite_8" },
        { key: "walkdroite_9" },
      ],
      frameRate: 10,
      repeat: -1,
    });

    // Animation de marche vers la gauche (walkgauche)
    this.scene.anims.create({
      key: "walkgauche",
      frames: [
        { key: "walkgauche_1" },
        { key: "walkgauche_2" },
        { key: "walkgauche_3" },
        { key: "walkgauche_4" },
        { key: "walkgauche_5" },
        { key: "walkgauche_6" },
        { key: "walkgauche_7" },
        { key: "walkgauche_8" },
        { key: "walkgauche_9" },
      ],
      frameRate: 10,
      repeat: -1,
    });

    // Animation de saut vers la droite (jumpdroite)
    this.scene.anims.create({
      key: "jumpdroite",
      frames: [
        { key: "jumpdroite_1" },
        { key: "jumpdroite_2" },
        { key: "jumpdroite_3" },
        { key: "jumpdroite_4" },
        { key: "jumpdroite_5" },
        { key: "jumpdroite_6" },
        { key: "jumpdroite_7" },
        { key: "jumpdroite_8" },
        { key: "jumpdroite_9" },
        { key: "jumpdroite_10" },
      ],
      frameRate: 15,
      repeat: 0,
    });

    // Animation de saut vers la gauche (jumpgauche)
    this.scene.anims.create({
      key: "jumpgauche",
      frames: [
        { key: "jumpgauche_1" },
        { key: "jumpgauche_2" },
        { key: "jumpgauche_3" },
        { key: "jumpgauche_4" },
        { key: "jumpgauche_5" },
        { key: "jumpgauche_6" },
        { key: "jumpgauche_7" },
        { key: "jumpgauche_8" },
        { key: "jumpgauche_9" },
        { key: "jumpgauche_10" },
      ],
      frameRate: 15,
      repeat: 0,
    });

    // Animation d'attaque vers la droite (attaquedroite)
    this.scene.anims.create({
      key: "attaquedroite",
      frames: [
        { key: "attaquedroite_1" },
        { key: "attaquedroite_2" },
        { key: "attaquedroite_3" },
        { key: "attaquedroite_4" },
        { key: "attaquedroite_5" },
        { key: "attaquedroite_6" },
        { key: "attaquedroite_7" },
        { key: "attaquedroite_8" },
      ],
      frameRate: 12,
      repeat: 0,
    });

    // Animation d'attaque vers la gauche (attaquegauche)
    this.scene.anims.create({
      key: "attaquegauche",
      frames: [
        { key: "attaquegauche_1" },
        { key: "attaquegauche_2" },
        { key: "attaquegauche_3" },
        { key: "attaquegauche_4" },
        { key: "attaquegauche_5" },
        { key: "attaquegauche_6" },
        { key: "attaquegauche_7" },
        { key: "attaquegauche_8" },
      ],
      frameRate: 12,
      repeat: 0,
    });

    this.scene.anims.create({
      key: "idle",
      frames: [
        { key: "idle_1" },
        { key: "idle_2" },
        { key: "idle_3" },
        { key: "idle_4" },
        { key: "idle_5" },
        { key: "idle_6" },
      ],
      frameRate: 6,
      repeat: 0,
    });
  }

  update() {
    if (this.isAnimating) {
      return; // Si une animation est en cours, ne pas permettre d'autres actions
    }

    // Réinitialiser la vitesse horizontale
    this.sprite.setVelocityX(0);

    // Déplacement gauche/droite
    if (this.keys.left.isDown) {
      this.sprite.setVelocityX(-2460); // Vitesse vers la gauche
      this.lastDirection = "left"; // Mémoriser la direction gauche
      if (this.sprite.body.blocked.down && !this.isAttacking) {
        this.sprite.anims.play("walkgauche", true); // Jouer l'animation de marche
      }
    } else if (this.keys.right.isDown) {
      this.sprite.setVelocityX(2460); // Vitesse vers la droite
      this.lastDirection = "right"; // Mémoriser la direction droite
      if (this.sprite.body.blocked.down && !this.isAttacking) {
        this.sprite.anims.play("walkdroite", true); // Jouer l'animation de marche
      }
    } else if (
      this.sprite.body.blocked.down &&
      !this.isAttacking &&
      !this.isJumping
    ) {
      this.sprite.anims.play("idle", true); // Jouer l'animation idle
    }

    if (this.scene.input.activePointer.leftButtonDown() && !this.isAttacking) {
      this.isAttacking = true;
      this.isAnimating = true;
      this.sprite.setVelocityX(0);

      if (this.lastDirection === "left") {
        this.sprite.anims.play("attaquegauche");
        this.attackHitbox.setPosition(this.sprite.x - 300, this.sprite.y); // Ajuster la position
      } else {
        this.sprite.anims.play("attaquedroite");
        this.attackHitbox.setPosition(this.sprite.x + 300, this.sprite.y);
      }

      // Activer la hitbox pendant l'attaque
      this.attackHitbox.body.enable = true;

      // Désactiver la hitbox après l'animation d'attaque
      this.scene.time.delayedCall(300, () => {
        this.attackHitbox.body.enable = false;
      });
    }

    // Saut
    if (
      this.keys.jump.isDown &&
      this.sprite.body.blocked.down &&
      !this.isJumping
    ) {
      this.isJumping = true;
      this.sprite.setVelocityY(-3240); // Appliquer une impulsion pour sauter

      // Lancer l'animation de saut si nécessaire
      if (this.lastDirection === "left") {
        this.sprite.anims.play("jumpgauche"); // Jouer l'animation de saut vers la gauche
      } else {
        this.sprite.anims.play("jumpdroite"); // Jouer l'animation de saut vers la droite
      }
    }

    if (this.sprite.body.blocked.down) {
      this.isJumping = false;
    }

    if (this.keys.inventory.isDown && this.inventory) {
      this.inventory = false;
      Global.toggleInventory(this.scene);

      setTimeout(() => {
        this.inventory = true;
      }, 800);
    }
  }

  decreaseHealth() {
    if (this.isInvincible) {
      return;
    }
    this.scene.sound.play("damage");
    Global.playerHealth--;
    this.showHealth();

    if (Global.playerHealth <= 0) {
      this.death();
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

  death() {
    this.scene.death();
  }
}
