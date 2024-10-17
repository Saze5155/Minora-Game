import Global from "/5/test3D/js/inventaire.js";
import PlayerSpace from "/5/test3D/js/player_space.js";

export default class BossLevel extends Phaser.Scene {
  constructor() {
    super({ key: "BossLevel" });
    this.rocketControlled = true;
    this.cooldowns = { basic: 0, arc: 0, laser: 0 };
    this.canShootLaser = true;
    this.phaseTwoStarted = false;
    this.inventory = true;
  }

  preload() {}

  create() {
    this.background = this.add.image(0, 0, "space_bg").setOrigin(0, 0);
    this.background.setDisplaySize(1920, 1080); // Redimensionne l'image à 1920x1080
    this.background.setScrollFactor(0);

    this.rocket = this.physics.add
      .sprite(400, 540, "rocket_active")
      .setScale(0.3);
    this.rocket.body.allowGravity = false;
    this.rocket.setCollideWorldBounds(true);

    this.cameras.main.setBounds(0, 0, 1920, 1080);
    this.input.mouse.disableContextMenu();
    this.cursors = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.Q,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up: Phaser.Input.Keyboard.KeyCodes.Z,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      basicShoot: this.input.mousePointer.leftButtonDown(),
      arcShoot: this.input.mousePointer.rightButtonDown(),
      special: Phaser.Input.Keyboard.KeyCodes.SPACE,
      interact: Phaser.Input.Keyboard.KeyCodes.E,
      inventory: Phaser.Input.Keyboard.KeyCodes.TAB,
    });

    this.boss = this.physics.add.sprite(960, 540, "boss").setScale(0.5);
    this.boss.body.allowGravity = false;
    this.boss.setImmovable(true);

    this.bossMaxHealth = 5000;
    this.bossHealth = this.bossMaxHealth;
    this.createBossHealthBar();

    this.playerProjectiles = this.physics.add.group();
    this.physics.add.overlap(
      this.boss,
      this.playerProjectiles,
      this.hitBoss,
      null,
      this
    );

    this.createAttackIcons();

    this.startPhaseOne(); // Commencer la première phase du boss

    this.player = new PlayerSpace(this, 400, 540, "idle_1");
    this.player.sprite.setVisible(false); // Rendre le joueur invisible

    this.time.addEvent({
      delay: 10000, // 10 secondes
      callback: this.trySpawnHeart,
      callbackScope: this,
      loop: true,
    });
  }

  createAttackIcons() {
    const iconPositions = [820, 960, 1100];
    const icons = ["playerProjectile", "arcProjectile", "laser"];
    this.attackIcons = {};

    icons.forEach((icon, index) => {
      const x = iconPositions[index];
      const background = this.add
        .rectangle(x, 1020, 70, 70, 0x000000)
        .setOrigin(0.5)
        .setAlpha(0.5);
      const image = this.add.image(x, 1020, icon).setScale(0.2);
      const cooldownOverlay = this.add
        .rectangle(x, 1020, 68, 68, 0xff0000)
        .setOrigin(0.5)
        .setAlpha(0);

      this.attackIcons[icon] = {
        background,
        image,
        cooldownOverlay,
      };
    });
  }

  updateAttackCooldowns(time) {
    const cooldowns = {
      playerProjectile: 500,
      arcProjectile: 2000,
      laser: 5000,
    };

    Object.keys(this.attackIcons).forEach((key) => {
      const icon = this.attackIcons[key];
      const cooldownKey = key
        .replace("playerProjectile", "basic")
        .replace("arcProjectile", "arc")
        .replace("laser", "laser");
      const cooldown = cooldowns[key];

      const remainingTime = Math.max(
        0,
        (this.cooldowns[cooldownKey] - time) / cooldown
      );

      icon.cooldownOverlay.setAlpha(remainingTime > 0 ? 0.5 : 0);
      if (remainingTime > 0) {
        icon.cooldownOverlay.height = 68 * remainingTime;
        icon.cooldownOverlay.y = 1020 + (68 * (1 - remainingTime)) / 2;
        icon.image.setTint(0x555555);
      } else {
        icon.image.clearTint();
      }
    });
  }

  createBossHealthBar() {
    const barWidth = 400;
    const barHeight = 20;
    this.bossHealthBar = this.add.graphics();
    this.bossHealthBar.setPosition(760, 30);
    this.updateBossHealthBar();
  }

  updateBossHealthBar() {
    const barWidth = 400;
    const barHeight = 20;
    const healthPercentage = this.bossHealth / this.bossMaxHealth;

    let color = 0x00ff00;
    if (healthPercentage < 0.3) {
      color = 0xff0000;
    } else if (healthPercentage < 0.6) {
      color = 0xffa500;
    }

    this.bossHealthBar.clear();
    this.bossHealthBar.fillStyle(0x000000);
    this.bossHealthBar.fillRect(0, 0, 400, barHeight);
    this.bossHealthBar.fillStyle(color);
    this.bossHealthBar.fillRect(0, 0, barWidth * healthPercentage, barHeight);
  }

  startPhaseOne() {
    this.bossAttackEvent = this.time.addEvent({
      delay: 2000,
      callback: this.shootRandomProjectiles,
      callbackScope: this,
      loop: true,
    });
  }

  startPhaseTwo() {
    this.bossAttackEvent.remove();
    this.bossAttackEvent = this.time.addEvent({
      delay: 2000,
      callback: this.shootRandomProjectiles,
      callbackScope: this,
      loop: true,
    });

    this.bombEvent = this.time.addEvent({
      delay: 5000,
      callback: this.spawnBombs,
      callbackScope: this,
      loop: true,
    });
  }

  startPhaseThree() {
    if (this.bossAttackEvent) {
      this.bossAttackEvent.remove(false);
    }

    this.bossAttackEvent = this.time.addEvent({
      delay: 2500,
      callback: this.shootLaserFromBoss,
      callbackScope: this,
      loop: true,
    });
  }

  shootRandomProjectiles() {
    for (let i = 0; i < 7; i++) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const speed = 300;

      const projectile = this.physics.add
        .sprite(this.boss.x, this.boss.y, "bossProjectile")
        .setScale(0.3);
      projectile.body.allowGravity = false;
      projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
      projectile.rotation = angle;

      // Ajouter la détection de collision entre les projectiles et la fusée
      this.physics.add.overlap(
        this.rocket,
        projectile,
        () => {
          this.player.decreaseHealth();
          projectile.destroy(); // Détruire le projectile après la collision
        },
        null,
        this
      );
    }
  }

  spawnBombs() {
    const bombCount = Phaser.Math.Between(1, 5); // Nombre de bombes à générer
    for (let i = 0; i < bombCount; i++) {
      let bombX, bombY;
      do {
        bombX = Phaser.Math.Between(50, 1870);
        bombY = Phaser.Math.Between(50, 1030);
      } while (
        Phaser.Math.Distance.Between(bombX, bombY, this.boss.x, this.boss.y) <
        200
      );

      const bomb = this.add.image(bombX, bombY, "bomb").setScale(0.5);
      const bombCenter = this.add
        .image(bombX, bombY, "bomb_center")
        .setScale(0.05);
      bomb.setAlpha(0.5);

      this.physics.add.existing(bomb, true);
      this.physics.add.existing(bombCenter, true);

      this.time.delayedCall(1000, () => {
        bomb.setAlpha(1);

        const explosionRadius = this.add.circle(
          bomb.x,
          bomb.y,
          100,
          0xff0000,
          0.5
        );
        this.physics.add.existing(explosionRadius, true);

        this.time.delayedCall(1000, () => {
          explosionRadius.setFillStyle(0xff0000, 1);

          this.physics.add.overlap(
            this.rocket,
            explosionRadius,
            () => {
              this.player.decreaseHealth();
              bomb.destroy();
            },
            null,
            this
          );

          this.time.delayedCall(1000, () => {
            bomb.destroy();
            bombCenter.destroy();
            explosionRadius.destroy();
          });
        });
      });
    }
  }

  update(time) {
    // Si le joueur est en train de tirer le laser, désactiver les mouvements.
    if (this.isShootingLaser) {
      this.rocket.setVelocity(0, 0);
    } else {
      // Gérer les déplacements du joueur
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
    }

    if (this.cursors.inventory.isDown && this.inventory) {
      this.inventory = false;
      Global.toggleInventory(this);

      setTimeout(() => {
        this.inventory = true;
      }, 800);
    }

    // Flipper la fusée si elle est dans le côté gauche de l'écran
    if (this.rocket.x < this.cameras.main.width / 2) {
      this.rocket.setFlipX(true); // Flip à gauche
    } else {
      this.rocket.setFlipX(false); // Remettre la fusée à sa normale à droite
    }

    // Gérer les cooldowns des attaques
    this.updateAttackCooldowns(time);

    // Tir du joueur avec cooldowns
    if (
      this.input.activePointer.leftButtonDown() &&
      time > this.cooldowns.basic
    ) {
      this.shootPlayerProjectile();
      this.cooldowns.basic = time + 500;
    }

    if (
      this.input.activePointer.rightButtonDown() &&
      time > this.cooldowns.arc
    ) {
      this.shootArcProjectile();
      this.cooldowns.arc = time + 2000;
    }

    // Tir du joueur (laser) uniquement si le cooldown est terminé
    if (this.cursors.special.isDown && this.canShootLaser) {
      this.shootLaser();
    }
  }

  shootPlayerProjectile() {
    const projectile = this.playerProjectiles
      .create(this.rocket.x, this.rocket.y, "playerProjectile")
      .setScale(0.3);
    projectile.body.allowGravity = false;

    // Calcul de la direction du tir vers le boss
    const angle = Phaser.Math.Angle.Between(
      projectile.x,
      projectile.y,
      this.boss.x,
      this.boss.y
    );
    const speed = 300;

    // Appliquer la vitesse en fonction de l'angle
    projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    // Orienter le projectile en fonction de l'angle
    projectile.rotation = angle;
  }

  shootArcProjectile() {
    const arcAngles = [-0.3, -0.15, 0, 0.15, 0.3];
    arcAngles.forEach((offset) => {
      const projectile = this.playerProjectiles
        .create(this.rocket.x, this.rocket.y, "arcProjectile")
        .setScale(0.3);
      projectile.body.allowGravity = false;

      const angle =
        Phaser.Math.Angle.Between(
          projectile.x,
          projectile.y,
          this.boss.x,
          this.boss.y
        ) + offset;
      const speed = 300;
      projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
      projectile.rotation = angle;
    });
  }

  shootLaser() {
    this.isShootingLaser = true; // Empêche les mouvements pendant le tir du laser.

    const angle = Phaser.Math.Angle.Between(
      this.rocket.x,
      this.rocket.y,
      this.boss.x,
      this.boss.y
    );
    const laserLength = 1000;
    const laserThickness = 5;
    const laser = this.add
      .rectangle(
        this.rocket.x,
        this.rocket.y,
        laserLength,
        laserThickness,
        0xff0000
      )
      .setOrigin(0, 0.5);
    laser.setAlpha(0.5);
    laser.rotation = angle;
    this.physics.add.existing(laser, true);

    laser.x = this.rocket.x;
    laser.y = this.rocket.y;
    this.cooldowns.laser = this.time.now + 5000;

    // Infliger les dégâts immédiatement lorsque le laser est tiré.
    this.bossHealth -= 300;
    this.updateBossHealthBar();

    // Vérifier si le boss est vaincu après avoir infligé les dégâts.
    if (this.bossHealth <= 0) {
      this.bossDefeated();
    }

    this.time.delayedCall(1000, () => {
      laser.setAlpha(1);

      // Supprimer le laser après 1.5 secondes de phase active.
      this.time.delayedCall(1500, () => {
        laser.destroy();
        this.isShootingLaser = false; // Réactiver les mouvements après le tir du laser.
        this.time.delayedCall(1500, () => {
          this.canShootLaser = true;
        });
      });
    });

    this.canShootLaser = false;
  }

  shootLaserFromBoss() {
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    // Générer entre 1 et 3 lasers horizontaux
    const numHorizontalLasers = Phaser.Math.Between(1, 3);
    for (let i = 0; i < numHorizontalLasers; i++) {
      const yPosition = Phaser.Math.Between(50, screenHeight - 50); // Position aléatoire sur l'axe Y
      const laser = this.add
        .rectangle(0, yPosition, screenWidth, 5, 0xff0000)
        .setOrigin(0, 0.5);
      laser.setAlpha(0.5); // Opacité initiale à 0.5
      this.physics.add.existing(laser, true);

      // Après 1 seconde, rendre le laser actif et détecter les collisions
      this.time.delayedCall(1000, () => {
        laser.setAlpha(1); // Augmenter l'opacité à 1
        this.physics.add.overlap(
          this.rocket,
          laser,
          () => {
            this.player.decreaseHealth();
            laser.destroy();
          },
          null,
          this
        );

        // Supprimer le laser après 1.5 secondes
        this.time.delayedCall(1500, () => {
          laser.destroy();
        });
      });
    }

    // Générer entre 1 et 3 lasers verticaux
    const numVerticalLasers = Phaser.Math.Between(1, 3);
    for (let i = 0; i < numVerticalLasers; i++) {
      const xPosition = Phaser.Math.Between(50, screenWidth - 50); // Position aléatoire sur l'axe X
      const laser = this.add
        .rectangle(xPosition, 0, 5, screenHeight, 0xff0000)
        .setOrigin(0.5, 0);
      laser.setAlpha(0.5); // Opacité initiale à 0.5
      this.physics.add.existing(laser, true);

      // Après 1 seconde, rendre le laser actif et détecter les collisions
      this.time.delayedCall(1000, () => {
        laser.setAlpha(1); // Augmenter l'opacité à 1
        this.physics.add.overlap(
          this.rocket,
          laser,
          () => {
            this.player.decreaseHealth();
            laser.destroy();
          },
          null,
          this
        );

        // Supprimer le laser après 1.5 secondes
        this.time.delayedCall(1500, () => {
          laser.destroy();
        });
      });
    }
  }

  trySpawnHeart() {
    // Chance sur 2 de faire apparaître un cœur
    if (Phaser.Math.Between(0, 1) === 0) {
      this.spawnHeart();
      console.log("Coeur apparu");
    }
  }

  spawnHeart() {
    const sides = ["top", "bottom", "left", "right"];
    const side = Phaser.Math.RND.pick(sides);
    let x, y, velocityX, velocityY;

    switch (side) {
      case "top":
        x = Phaser.Math.Between(0, this.cameras.main.width);
        y = -50; // Position juste au-dessus de l'écran
        velocityX = 0;
        velocityY = 100; // Descend de haut en bas
        break;
      case "bottom":
        x = Phaser.Math.Between(0, this.cameras.main.width);
        y = this.cameras.main.height + 50; // Position juste en dessous de l'écran
        velocityX = 0;
        velocityY = -100; // Monte de bas en haut
        break;
      case "left":
        x = -50; // Position à gauche de l'écran
        y = Phaser.Math.Between(0, this.cameras.main.height);
        velocityX = 100; // Va de gauche à droite
        velocityY = 0;
        break;
      case "right":
        x = this.cameras.main.width + 50; // Position à droite de l'écran
        y = Phaser.Math.Between(0, this.cameras.main.height);
        velocityX = -100; // Va de droite à gauche
        break;
    }

    // Créer le cœur et le faire bouger
    const heart = this.physics.add.sprite(x, y, "heart").setScale(0.2);
    heart.setVelocity(velocityX, velocityY);
    heart.body.allowGravity = false;

    // Activer la détection des limites du monde après 100ms pour éviter la destruction instantanée
    this.time.delayedCall(1000, () => {
      heart.setCollideWorldBounds(true);
      heart.body.onWorldBounds = true;

      heart.body.world.on("worldbounds", (body) => {
        if (body.gameObject === heart) {
          heart.destroy();
          console.log("coeur detruit");
        }
      });
    });

    // Détecter la collision entre la fusée (joueur) et le cœur
    this.physics.add.overlap(this.rocket, heart, this.collectHeart, null, this);
  }

  collectHeart(rocket, heart) {
    heart.destroy();
    this.player.increaseHealth();
    console.log("Vie récupérée !");
  }

  hitBoss(boss, projectile) {
    projectile.destroy();
    this.bossHealth -= 20;
    this.updateBossHealthBar();

    if (this.bossHealth <= 0) {
      this.bossDefeated();
    } else if (
      this.bossHealth <= this.bossMaxHealth * 0.6 &&
      !this.phaseTwoStarted
    ) {
      this.phaseTwoStarted = true;
      this.startPhaseTwo();
    } else if (
      this.bossHealth <= this.bossMaxHealth * 0.3 &&
      !this.phaseThreeStarted
    ) {
      this.phaseThreeStarted = true;
      this.startPhaseThree();
    }
  }

  hitBoss2(laser, boss) {
    this.bossHealth -= 500;
    this.updateBossHealthBar();
    // Appeler bossDefeated uniquement si la vie est à 0
    if (this.bossHealth <= 0) {
      this.bossDefeated();
    } else {
    }
  }

  attemptOpenChest(player, chest) {
    if (this.cursors.interact.isDown) {
      console.log("Coffre ouvert !");
      this.chest.setTexture("chest_open"); // Remplace "chest_open" par l'image du coffre ouvert
    }
  }

  attemptEnterPortal(player, portal) {
    if (this.cursors.interact.isDown) {
      console.log("Téléportation vers tpt.js !");
      Global.enemyId = 2;
      this.scene.start("tpt"); // Remplace 'TPT' par la clé correcte de ta scène tpt.js
    }
  }

  bossDefeated() {
    console.log("Le boss a été vaincu !");
    this.boss.destroy();
    this.bossHealthBar.clear();
    this.bossAttackEvent.remove();
    if (this.bombEvent) {
      this.bombEvent.remove();
    }
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
}
