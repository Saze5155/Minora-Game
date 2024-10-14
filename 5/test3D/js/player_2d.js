export default class Player2D {
  constructor(scene, x, y, textureKey) {
    this.scene = scene;

    this.sprite = scene.physics.add.sprite(x, y, textureKey);
    this.sprite.setScale(0.1);
    this.sprite.body.setSize(this.sprite.width, this.sprite.height * 0.9);
    this.sprite.body.setOffset(0, this.sprite.height * 0.1);

    this.sprite.body.checkCollision.none = true;

    // Appliquer les modifications avant d'activer les collisions
    scene.time.delayedCall(500, () => {
      this.sprite.body.checkCollision.none = false; // Activer les collisions après 500ms
    });

    this.sprite.setCollideWorldBounds(true);

    this.keys = {
      left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      attack: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O),
      jump: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      interact: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
    };

    this.isJumping = false;
    this.isAttacking = false;
    this.isAnimating = false;
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
      this.sprite.setVelocityX(-160); // Vitesse vers la gauche
      if (!this.isJumping && !this.isAttacking) {
        this.sprite.anims.play("walkgauche", true); // Jouer l'animation de marche vers la gauche
      }
    } else if (this.keys.right.isDown) {
      this.sprite.setVelocityX(160); // Vitesse vers la droite
      if (!this.isJumping && !this.isAttacking) {
        this.sprite.anims.play("walkdroite", true); // Jouer l'animation de marche vers la droite
      }
    } else if (!this.isJumping && !this.isAttacking) {
      this.sprite.anims.play("idle", true);
    }

    // Attaque
    if (this.keys.attack.isDown && !this.isAttacking) {
      this.isAttacking = true;
      this.isAnimating = true;
      this.sprite.setVelocityX(0);
      if (this.keys.left.isDown) {
        this.sprite.anims.play("attaquegauche"); // Jouer l'animation d'attaque vers la gauche
      } else {
        this.sprite.anims.play("attaquedroite"); // Jouer l'animation d'attaque vers la droite
      }
    }

    // Saut
    if (
      this.keys.jump.isDown &&
      this.sprite.body.blocked.down &&
      !this.isJumping
    ) {
      this.isJumping = true;
      this.isAnimating = true;
      this.sprite.setVelocityY(-340); // Appliquer une impulsion pour sauter
      if (this.keys.left.isDown) {
        this.sprite.anims.play("jumpgauche"); // Jouer l'animation de saut vers la gauche
      } else {
        this.sprite.anims.play("jumpdroite"); // Jouer l'animation de saut vers la droite
      }
    }
  }
}
