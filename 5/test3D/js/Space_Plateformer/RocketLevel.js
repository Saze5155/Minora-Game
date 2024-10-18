import Global from "/5/test3D/js/inventaire.js";
import PlayerSpace from "/5/test3D/js/player_space.js";

export default class RocketLevel extends Phaser.Scene {
  constructor() {
    super({ key: "RocketLevel" });
    this.rocketControlled = false;
    this.lastDirection = "right";
    this.isShooting = false;
    this.inventory = true;
  }

  preload() {}

  create() {
    this.scene.launch("DialogueScene");

    this.bossMusic = this.sound.add('RocketLevel', { volume: 0, loop: true });
    this.bossMusic.play();

    // Créer le background fixe par rapport à la caméra
    this.background = this.add.image(0, 0, "space_bg").setOrigin(0, 0);
    this.background.setDisplaySize(1920, 1080); // Redimensionne l'image à 1920x1080
    this.background.setScrollFactor(0);

    // Créer la plateforme sous le joueur et ajouter la physique
    this.platform = this.physics.add
      .image(350, 1300, "platform_image")
      .setScale(1);
    this.platform.setImmovable(true); // Rendre la plateforme immobile pour ne pas être influencée par les collisions
    this.platform.body.allowGravity = false; // La plateforme ne doit pas être affectée par la gravité
    // Créer le joueur avec le fichier `PlayerSpace`
    this.player = new PlayerSpace(this, 100, 420, "idle_1");

    // Créer la fusée avec une gravité désactivée
    this.rocket = this.physics.add
      .sprite(550, 850, "rocket_idle")
      .setScale(0.3);
    this.rocket.body.allowGravity = false;
    this.rocket.setCollideWorldBounds(true);
    this.rocket.setFlipX(true); // Flip à gauche

    // Définir les limites du monde
    this.physics.world.setBounds(0, 0, 1920, 1080);
    this.player.sprite.setCollideWorldBounds(true);
    // Ajouter les collisions entre le joueur et la plateforme
    this.physics.add.collider(this.player.sprite, this.platform);

    // Configurer la touche pour entrer dans la fusée
    this.cursors = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.Q,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up: Phaser.Input.Keyboard.KeyCodes.Z,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
      interact: Phaser.Input.Keyboard.KeyCodes.E, // Touche pour interagir
      shoot: this.input.mousePointer.leftButtonDown(),
      inventory: Phaser.Input.Keyboard.KeyCodes.TAB,
    });

    // Configurer la caméra pour suivre la fusée lorsque le joueur la contrôle
    this.cameras.main.setBounds(0, 0, 1920, 1080);

    // Groupes pour les projectiles et les vies
    this.projectiles = this.physics.add.group();
    this.playerProjectiles = this.physics.add.group();
    this.lifeGroup = this.physics.add.group();
    this.enemyGroup = this.physics.add.group();
  }

  enterRocket() {
    this.player.sprite.setVisible(false);
    this.player.sprite.setActive(false);

    this.rocketControlled = true;
    this.rocket.setTexture("rocket_active");
    this.rocket.setVelocity(0, 0);
    this.rocket.body.allowGravity = false;
    this.cameras.main.startFollow(this.rocket);

    // Lancer le tween pour déplacer la plateforme vers la gauche
    this.tweens.add({
      targets: this.platform,
      x: -this.platform.width, // Sortir complètement de l'écran vers la gauche
      duration: 3000, // Durée de 3 secondes pour un mouvement fluide
      ease: "Power2",
    });

    // Démarrer la génération des blocs, lasers, etc.
    this.time.delayedCall(1000, this.startBlockGeneration, [], this);
    this.time.delayedCall(1500, this.startLaserGeneration, [], this);
    this.time.delayedCall(1500, this.startEnemyGeneration, [], this);
    this.time.delayedCall(1500, this.startLifeGeneration, [], this);
    this.time.delayedCall(90000, this.endChallenge, [], this);
  }

  endChallenge() {
    // Arrêter tous les événements de génération
    this.blockEvent?.remove(false);
    this.laserEvent?.remove(false);
    this.enemyEvent?.remove(false);
    this.lifeEvent?.remove(false);

    // Détruire tous les blocs, ennemis, et projectiles restants
    this.blocks.clear(true, true);
    this.projectiles.clear(true, true);
    this.playerProjectiles.clear(true, true);
    this.lifeGroup.clear(true, true);

    // Afficher le coffre et le portail à des positions fixes
    this.chest = this.physics.add
      .sprite(1800, 400, "chest_close")
      .setScale(0.2);
    this.chest.body.allowGravity = false;
    this.portal = this.physics.add.sprite(1800, 800, "portal").setScale(0.5);
    this.portal.body.allowGravity = false;

    // Activer les collisions pour les interactions
    this.physics.add.overlap(
      this.rocket,
      this.chest,
      this.attemptOpenChest,
      null,
      this
    );
    this.physics.add.overlap(
      this.rocket,
      this.portal,
      this.attemptEnterPortal,
      null,
      this
    );
  }

  attemptOpenChest(player, chest) {
    if (this.cursors.interact.isDown) {
      console.log("Coffre ouvert !");
      this.chest.setTexture("chest_open"); // Remplace "chest_open" par l'image du coffre ouvert
      const newAttack = Global.attacks["espace"][1];
      const earnedAttack = Global.attackOff.push(newAttack);

      const width = this.cameras.main.width;
      const height = this.cameras.main.height;

      // Afficher l'image de l'attaque gagnée
      const attackImage = this.add.image(
        width / 2,
        height / 2 + 60,
        newAttack.image // Image de l'attaque gagnée
      );
      attackImage.setScale(0.5).setScrollFactor(0).setDepth(60001);

      // Supprimer la notification après quelques secondes
      setTimeout(() => {
        attackImage.destroy();
        this.soundCoffre.stop();
      }, 2000);
    }
  }

  attemptEnterPortal(player, portal) {
    if (this.cursors.interact.isDown) {
      console.log("Téléportation vers tpt.js !");
      this.scene.start("BossLevel"); // Remplace 'TPT' par la clé correcte de ta scène tpt.js
    }
  }

  startBlockGeneration() {
    this.blocks = this.physics.add.group();
    this.blockEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        const block = this.blocks
          .create(1920, Phaser.Math.Between(100, 980), "block")
          .setScale(0.5);
        const speedX = -250;
        const randomAngle = Phaser.Math.FloatBetween(-0.5, 0.5);
        const speedY = speedX * Math.tan(randomAngle);
        block.setVelocity(speedX, speedY);
        block.setCollideWorldBounds(false);
        block.body.allowGravity = false;
      },
      loop: true,
    });
  }

  startLaserGeneration() {
    this.laserEvent = this.time.addEvent({
      delay: 10000,
      callback: this.createLasers,
      callbackScope: this,
      loop: true,
    });
  }

  createLasers() {
    const laserCount = Phaser.Math.Between(1, 4);
    const usedHeights = [];

    for (let i = 0; i < laserCount; i++) {
      let laserY;
      do {
        laserY = Phaser.Math.Between(50, 1030);
      } while (usedHeights.some((y) => Math.abs(y - laserY) < 40));

      usedHeights.push(laserY);

      const laser = this.add
        .rectangle(0, laserY, 1920, 30, 0xff0000)
        .setOrigin(0, 0.5);
      laser.setAlpha(0.5);
      this.physics.add.existing(laser, true);
      this.sound.play('Laser3', { volume: 0.3 });

      this.time.delayedCall(1500, () => {
        laser.setAlpha(1);
        this.physics.add.overlap(this.rocket, laser, () => {
          this.player.decreaseHealth();
        });

        this.time.delayedCall(1500, () => {
          laser.destroy();
        });
      });
    }
  }

  startEnemyGeneration() {
    this.enemyEvent = this.time.addEvent({
      delay: 15000,
      callback: this.createEnemies,
      callbackScope: this,
      loop: true,
    });
  }

  createEnemies() {
    const enemyCount = Phaser.Math.Between(1, 3);
    for (let i = 0; i < enemyCount; i++) {
      const enemyY = Phaser.Math.Between(100, 980);
      const enemy = this.physics.add
        .sprite(1700, enemyY, "enemy_space")
        .setScale(0.5);
      enemy.setFlipX(true); // Flip à gauche
      enemy.setVelocityY(100);
      enemy.setCollideWorldBounds(true);
      enemy.body.bounce.set(1);
      enemy.body.allowGravity = false;
      enemy.health = 5;

      // Créer et stocker l'événement de tir pour chaque ennemi
      enemy.shootEvent = this.time.addEvent({
        delay: 2000,
        callback: () => this.shootProjectile(enemy),
        loop: true,
      });

      this.physics.add.overlap(
        this.playerProjectiles,
        enemy,
        this.hitEnemy,
        null,
        this
      );
    }
  }

  shootProjectile(enemy) {
    const projectile = this.projectiles
      .create(enemy.x, enemy.y, "bossProjectile")
      .setScale(0.3);
    projectile.setVelocityX(-400);
    projectile.body.allowGravity = false;
    projectile.setCollideWorldBounds(false);

    this.physics.add.overlap(
      this.rocket,
      projectile,
      this.hitProjectile,
      null,
      this
    );
  }

  hitProjectile(rocket, projectile) {
    this.player.decreaseHealth();
    projectile.destroy();

    if (this.player.getHealth() <= 0) {
      console.log("Le joueur est mort !");
    }
  }

  shootPlayerProjectile() {
    const projectile = this.playerProjectiles
      .create(this.rocket.x, this.rocket.y, "playerProjectile")
      .setScale(0.5);
    projectile.setVelocityX(800);
    projectile.body.allowGravity = false;
    projectile.setCollideWorldBounds(false);
    this.sound.play('Laser1', { volume: 0.1 });
  }

  hitEnemy(playerProjectile, enemy) {
    enemy.destroy();
    playerProjectile.health -= 1;

    if (playerProjectile.health <= 0) {
      this.stopShooting(playerProjectile); // Arrêter l'événement de tir avant de détruire l'ennemi
      playerProjectile.destroy();
    }
  }

  stopShooting(enemy) {
    if (enemy.shootEvent) {
      enemy.shootEvent.remove(false);
      enemy.shootEvent = null;
    }
  }

  startLifeGeneration() {
    this.lifeEvent = this.time.addEvent({
      delay: 20000,
      callback: () => {
        const lifeY = Phaser.Math.Between(100, 980);
        const life = this.lifeGroup.create(1920, lifeY, "heart").setScale(0.2);
        life.setVelocityX(-100);
        life.body.allowGravity = false;
        life.setCollideWorldBounds(false);

        this.physics.add.overlap(
          this.rocket,
          life,
          this.collectLife,
          null,
          this
        );
      },
      loop: true,
    });
  }

  collectLife(rocket, life) {
    this.player.increaseHealth();
    life.destroy();
    console.log("Vie récupérée !");
  }

  update() {
    if (!this.rocketControlled) {
      this.player.update();

      if (this.cursors.left.isDown) {
        this.lastDirection = "left";
      } else if (this.cursors.right.isDown) {
        this.lastDirection = "right";
      }

      const distanceToRocket = Phaser.Math.Distance.Between(
        this.player.sprite.x,
        this.player.sprite.y,
        this.rocket.x,
        this.rocket.y
      );

      if (distanceToRocket < 50 && this.cursors.interact.isDown) {
        this.enterRocket();
      }
    } else {
      if (this.cursors.up.isDown) {
        this.rocket.setVelocityY(-400);
      } else if (this.cursors.down.isDown) {
        this.rocket.setVelocityY(400);
      } else {
        this.rocket.setVelocityY(0);
      }

      if (this.cursors.left.isDown) {
        this.rocket.setVelocityX(-400);
      } else if (this.cursors.right.isDown) {
        this.rocket.setVelocityX(400);
      } else {
        this.rocket.setVelocityX(0);
      }

      if (this.input.activePointer.leftButtonDown() && !this.isShooting) {
        this.shootPlayerProjectile();
        this.isShooting = true; // Empêche de déclencher l'attaque plusieurs fois tant que le bouton est maintenu
      }

      // Réinitialiser le flag quand le bouton est relâché
      if (this.input.activePointer.leftButtonReleased()) {
        this.isShooting = false;
      }

      if (this.cursors.inventory.isDown && this.inventory) {
        this.inventory = false;
        Global.toggleInventory(this);

        setTimeout(() => {
          this.inventory = true;
        }, 800);
      }

      this.physics.world.collide(
        this.rocket,
        this.blocks,
        this.hitBlock,
        null,
        this
      );
    }
  }

  restartLevel() {
    // Arrêter la musique, si nécessaire
    if (this.bossMusic) {
        this.bossMusic.stop();
    }
    // Réinitialiser les paramètres nécessaires (comme le background)
    // Redémarrer la scène actuelle
    this.scene.restart();
}
  

  hitBlock(rocket, block) {
    this.player.decreaseHealth();
    block.destroy();

    if (this.player.getHealth() <= 0) {
      
      console.log("Le joueur est mort !");
    }
  }
}
