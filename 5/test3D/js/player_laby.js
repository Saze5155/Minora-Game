import Global from "/5/test3D/js/inventaire.js";

export default class PlayerLaby {
  constructor(scene, x, y, textureKey) {
    this.scene = scene;

    this.sprite = scene.physics.add.sprite(x, y, textureKey);
    this.sprite.setScale(0.3);
    this.sprite.body.setSize(this.sprite.width, this.sprite.height * 0.9);
    this.sprite.body.setOffset(0, this.sprite.height * 0.1);

    this.sprite.body.checkCollision.none = true;
    this.sprite.body.setSize(650, 700);
    this.sprite.body.setOffset(500, 0);
    // Appliquer les modifications avant d'activer les collisions
    scene.time.delayedCall(500, () => {
      this.sprite.body.checkCollision.none = false; // Activer les collisions après 500ms
    });

    this.sprite.setCollideWorldBounds(true);

    this.attackHitbox = this.scene.add.rectangle(0, 0, 120, 120, 0xff0000, 0);
    this.scene.physics.add.existing(this.attackHitbox);
    this.attackHitbox.body.setAllowGravity(false);
    this.attackHitbox.body.enable = false; // Désactivée par défaut

    this.keys = {
      left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      forward: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
      backward: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      attack: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O),
      jump: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      interact: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      inventory: scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.TAB
      ),
    };

    this.healthImages = {};
    this.healthImages[5] = scene.add
      .image(-885, -485, "heart_5")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(2)
      .setDepth(500)
      .setVisible(false);
    this.healthImages[4] = scene.add
      .image(-885, -485, "heart_4")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(2)
      .setDepth(500)
      .setVisible(false);
    this.healthImages[3] = scene.add
      .image(-885, -485, "heart_3")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(2)
      .setDepth(500)
      .setVisible(false);
    this.healthImages[2] = scene.add
      .image(-885, -485, "heart_2")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(2)
      .setDepth(500)
      .setVisible(false);
    this.healthImages[1] = scene.add
      .image(-885, -485, "heart_1")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(2)
      .setDepth(500)
      .setVisible(false);
    this.healthImages[6] = scene.add
      .image(-885, -485, "heart_6")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(1.9)
      .setDepth(500)
      .setVisible(false);
    this.currentHealthImage = null;

    this.isAttacking = false;
    this.isAnimating = false;
    this.inventory = true;

    this.lastDirection = "right";
    this.createAnimations();

    this.sprite.on("animationcomplete", (animation) => {
      if (animation.key === "attaqueHaut") {
        this.isAnimating = false; // L'animation est terminée
        this.isAttacking = false;
        console.log("Animation attaqueHaut terminée");
      }
    });
  }

  createAnimations() {
    // Animation de marche vers la droite (walkdroite)
    this.scene.anims.create({
      key: "marcheHaut",
      frames: [
        { key: "hautAvance_1" },
        { key: "hautAvance_2" },
        { key: "hautAvance_3" },
        { key: "hautAvance_4" },
        { key: "hautAvance_5" },
        { key: "hautAvance_6" },
        { key: "hautAvance_7" },
        { key: "hautAvance_8" },
      ],
      frameRate: 10,
      repeat: -1,
    });

    // Animation de marche vers la gauche (walkgauche)
    this.scene.anims.create({
      key: "attaqueHaut",
      frames: [
        { key: "hautAttaque_1" },
        { key: "hautAttaque_2" },
        { key: "hautAttaque_3" },
        { key: "hautAttaque_4" },
        { key: "hautAttaque_5" },
        { key: "hautAttaque_6" },
        { key: "hautAttaque_7" },
      ],
      frameRate: 11,
      repeat: 0,
    });
  }

  update() {
    if (this.isAnimating) {
      return; // Si une animation est en cours, ne pas permettre d'autres actions
    }

    // Réinitialiser la vitesse horizontale
    this.sprite.setVelocityX(0);
    this.sprite.setVelocityY(0);

    if (this.keys.left.isDown) {
      this.sprite.setVelocityX(-1060);
      this.lastDirection = "left"; // Mémoriser la direction gauche
      if (!this.isAttacking) {
        this.sprite.setRotation(Phaser.Math.DegToRad(-90));
        this.sprite.body.setSize(700, 700);
        this.sprite.body.setOffset(400, 100);
        this.sprite.anims.play("marcheHaut", true); // Jouer l'animation de marche
      }
    } else if (this.keys.right.isDown) {
      this.sprite.setVelocityX(1060);
      this.lastDirection = "right";
      this.sprite.setRotation(Phaser.Math.DegToRad(90));
      this.sprite.body.setSize(700, 700);
      this.sprite.body.setOffset(100, 400);
      if (!this.isAttacking) {
        this.sprite.anims.play("marcheHaut", true); // Jouer l'animation de marche
      } // Rotation vers la droite
    } else if (this.keys.forward.isDown) {
      this.sprite.setVelocityY(-1060);
      this.lastDirection = "up";
      this.sprite.setRotation(0);
      this.sprite.body.setSize(700, 700);
      this.sprite.body.setOffset(500, 400);

      if (!this.isAttacking) {
        this.sprite.anims.play("marcheHaut", true); // Jouer l'animation de marche
      } // Aucune rotation, tête vers le haut
    } else if (this.keys.backward.isDown) {
      this.sprite.setVelocityY(1060);
      this.lastDirection = "down";
      this.sprite.setRotation(Phaser.Math.DegToRad(180));
      this.sprite.body.setSize(700, 700);
      this.sprite.body.setOffset(100, 100);
      if (!this.isAttacking) {
        this.sprite.anims.play("marcheHaut", true); // Jouer l'animation de marche
      } // Rotation vers le bas
    } else if (!this.isAttacking) {
      this.sprite.anims.play("marcheHaut", false);
    }

    if (this.keys.attack.isDown && !this.isAttacking) {
      this.isAttacking = true;
      this.isAnimating = true;
      this.sprite.setVelocityX(0);
      this.sprite.setVelocityY(0);
      this.sprite.anims.play("attaqueHaut", true);
      if (this.lastDirection === "left") {
        this.attackHitbox.setPosition(this.sprite.x - 200, this.sprite.y);
        this.attackHitbox.setRotation(Phaser.Math.DegToRad(-90));
      } else if (this.lastDirection === "right") {
        this.attackHitbox.setPosition(this.sprite.x + 200, this.sprite.y);
        this.attackHitbox.setRotation(Phaser.Math.DegToRad(90));
      } else if (this.lastDirection === "up") {
        this.attackHitbox.setPosition(this.sprite.x, this.sprite.y - 200);
        this.attackHitbox.setRotation(0); // Tête vers le haut
      } else if (this.lastDirection === "down") {
        this.attackHitbox.setPosition(this.sprite.x, this.sprite.y + 200);
        this.attackHitbox.setRotation(Phaser.Math.DegToRad(180));
      }

      this.attackHitbox.body.enable = true;

      this.scene.time.delayedCall(300, () => {
        this.attackHitbox.body.enable = false;
      });
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
