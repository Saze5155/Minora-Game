import EnemyPlat from "/5/test3D/js/enemy_plat.js";
import Global from "/5/test3D/js/inventaire.js";
import Player2D from "/5/test3D/js/player_2d.js";
export default class Plateformer_map2 extends Phaser.Scene {
  constructor() {
    super({ key: "Plateformer_map2" });
    this.enemyGroups = null;
  }

  preload() {}

  create() {
    this.bossMusic = this.sound.add('BossLevel', { volume: 0.2, loop: true });
    this.bossMusic.play();

    this.physics.world.gravity.y = 2800;
    this.physics.world.setFPS(120);
    this.physics.world.TILE_BIAS = 40;

    this.soundCoffre = this.sound.add("ouverture", {
      loop: true,
      volume: 0.5,
    });
    this.map = this.make.tilemap({ key: "map2" });
    this.tileset = this.map.addTilesetImage("tileset_bois", "tileset_bois");

    this.background_layer = this.map.createLayer(
      "background_layer",
      this.tileset
    );
    this.death_layer = this.map.createLayer("death_layer", this.tileset);
    this.platform_layer = this.map.createLayer("platform_layer", this.tileset);
    this.object_layer = this.map.getObjectLayer("object_layer");

    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    this.platform_layer.setCollisionByProperty({ estSolide: true });

    const startPoint = this.object_layer.objects.find(
      (obj) => obj.name === "start"
    );
    this.enemyGroups = this.physics.add.group();
    const enemyPoints = this.object_layer.objects.filter(
      (obj) => obj.name === "enemy"
    );

    const porte = this.object_layer.objects.find(
      (obj) => obj.name === "sortie"
    );

    this.porte = this.physics.add.image(porte.x, porte.y, "porte");
    this.porte.setScale(20);
    this.porte.body.setSize(this.porte.width, this.porte.height * 0.8);
    this.porte.body.setOffset(10, 90 * 0.1);
    this.porte.body.allowGravity = false;

    this.porte.body.immovable = true;

    const monde = this.object_layer.objects.find((obj) => obj.name === "monde");

    this.monde = this.physics.add.image(monde.x, monde.y, "porte");
    this.monde.setScale(20);
    this.monde.body.setSize(this.monde.width, this.monde.height * 0.8);
    this.monde.body.setOffset(10, 90 * 0.1);
    this.monde.body.allowGravity = false;

    this.monde.body.immovable = true;

    const coffre = this.object_layer.objects.find(
      (obj) => obj.name === "coffre"
    );

    this.coffre = this.physics.add.image(coffre.x, coffre.y, "coffre");
    this.coffre.setScale(0.8);
    this.coffre.body.setSize(this.coffre.width, this.coffre.height);

    this.coffre.body.allowGravity = false;

    this.coffre.body.immovable = true;

    if (startPoint) {
      this.player = new Player2D(this, startPoint.x, startPoint.y, "player");
    } else {
      console.error("Start point not found in object layer.");
    }

    this.enemies = [];
    enemyPoints.forEach((point) => {
      let enemy = new EnemyPlat(this, point.x, point.y, "enemy_1");
      this.enemies.push(enemy);
      this.enemyGroups.add(enemy.sprite); // Ajoute le sprite à enemyGroups pour les collisions
    });

    this.physics.add.collider(this.enemyGroups, this.platform_layer);

    this.physics.add.collider(
      this.player.sprite,
      this.platform_layer,
      null,
      this.checkCollision,
      this
    );

    this.death_layer.setCollisionByProperty({ danger: true });
    this.death_layer.setDepth(10);
    this.death_layer.setPosition(
      0,
      this.map.heightInPixels - this.death_layer.height
    );

    this.physics.add.collider(
      this.player.sprite,
      this.death_layer,
      this.death,
      null,
      this
    );

    this.platformsGroup = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.platform_layer.forEachTile(function (tile) {
      if (tile.properties.move) {
        let platform = this.physics.add.image(
          tile.pixelX + tile.width / 2,
          tile.pixelY + tile.height / 2,
          "plateforme",
          tile.index
        );

        platform.body.allowGravity = false;
        platform.setImmovable(true);

        let direction = 1;

        this.tweens.add({
          targets: platform,
          x: platform.x + 11500,
          duration: 4000,
          ease: "Linear",
          yoyo: true,
          repeat: -1,
          onYoyo: function () {
            direction *= -1;
            platform.setVelocityX(2835 * direction);
          },
          onRepeat: function () {
            direction *= -1;
            platform.setVelocityX(2835 * direction);
          },
        });

        this.physics.add.collider(this.player.sprite, platform);

        this.platform_layer.removeTileAt(tile.x, tile.y);
      }
    }, this);

    this.platform_layer.forEachTile(function (tile) {
      if (tile.properties.moveInverse) {
        let platform = this.physics.add.image(
          tile.pixelX + tile.width / 2,
          tile.pixelY + tile.height / 2,
          "plateforme",
          tile.index
        );

        platform.body.allowGravity = false;
        platform.setImmovable(true);

        let direction = -1;

        this.tweens.add({
          targets: platform,
          x: platform.x - 11500,
          duration: 4000,
          ease: "Linear",
          yoyo: true,
          repeat: -1,
          onYoyo: function () {
            direction *= -1;
            platform.setVelocityX(2835 * direction);
          },
          onRepeat: function () {
            direction *= -1;
            platform.setVelocityX(2835 * direction);
          },
        });
        this.physics.add.collider(this.player.sprite, platform);
        this.platform_layer.removeTileAt(tile.x, tile.y);
      }
    }, this);

    this.platform_layer.forEachTile((tile) => {
      if (tile.properties.time) {
        const platform = this.physics.add.image(
          tile.pixelX + tile.width / 2,
          tile.pixelY + tile.height / 2,
          "plateforme_cassante"
        );

        platform.body.allowGravity = false;
        platform.setImmovable(true);

        this.physics.add.collider(
          this.player.sprite,
          platform,
          (player, platform) => {
            if (
              player.body.velocity.y >= 0 &&
              player.body.y + player.body.height <=
                platform.body.y + platform.body.height
            ) {
              this.time.delayedCall(parseInt(tile.properties.time), () => {
                platform.destroy();
              });
            } else {
              player.body.checkCollision.up = false;
            }
          }
        );

        this.physics.add.collider(
          this.enemyGroups,
          platform,
          (enemy, platform) => {
            this.time.delayedCall(parseInt(tile.properties.time), () => {
              enemy.destroy(); // Casser la plateforme après la collision avec un ennemi
            });
          }
        );

        this.platform_layer.removeTileAt(tile.x, tile.y);
      }
    });

    this.cameras.main.scrollY =
      this.map.heightInPixels - this.cameras.main.height;
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    this.physics.add.overlap(
      this.player.sprite,
      this.porte,
      this.sortie,
      null,
      this
    );

    this.physics.add.overlap(
      this.player.sprite,
      this.monde,
      this.fuite,
      null,
      this
    );

    this.physics.add.overlap(
      this.player.sprite,
      this.coffre,
      this.coffreOuverture,
      null,
      this
    );

    this.physics.add.overlap(
      this.player.sprite,
      this.enemyGroups,
      this.hit,
      null,
      this
    );

    this.physics.add.overlap(
      this.player.attackHitbox,
      this.enemyGroups,
      this.attack,
      null,
      this
    );

    this.enemyGroups.children.iterate(function iterateur(un_ennemi) {
      un_ennemi.setVelocityX(-40);
      un_ennemi.direction = "gauche";
      un_ennemi.play("enemy", true);
      un_ennemi.flipX = true;
    });

    this.cameras.main.setViewport(0, 0, 1920, this.cameras.main.height);
    this.cameras.main.setZoom(1920 / this.map.widthInPixels);
  }

  checkCollision(player, tile) {
    if (player.body.velocity.y < 0 && player.y > tile.pixelY) {
      return false;
    }
    return true;
  }

  update() {
    // Appeler l'update du joueur
    this.player.update();

    const cameraMinY = this.cameras.main.scrollY;
    if (this.player.sprite.y < cameraMinY + this.cameras.main.height / 2) {
      this.cameras.main.scrollY = Math.min(
        this.player.sprite.y - this.cameras.main.height / 2,
        cameraMinY
      );
    }
    if (
      this.player.sprite.y > this.death_layer.y - this.cameras.main.height &&
      this.death_layer.y > -29720
    ) {
      this.death_layer.y =
        this.cameras.main.scrollY + this.cameras.main.height - 34620;
    }
    this.enemies.forEach((enemy) => {
      enemy.update(this.platform_layer);
    });

    this.enemyGroups.children.iterate(function (enemy) {
      if (enemy.direction === "gauche" && enemy.body.blocked.down) {
        var coords = enemy.getBottomLeft();
        var tuileSuivante = this.platform_layer.getTileAtWorldXY(
          coords.x - 10,
          coords.y + 10
        );
        if (!tuileSuivante || enemy.body.blocked.left) {
          enemy.direction = "droite";
          enemy.setVelocityX(860);
          enemy.flipX = false;
        }
      } else if (enemy.direction === "droite" && enemy.body.blocked.down) {
        var coords = enemy.getBottomRight();
        var tuileSuivante = this.platform_layer.getTileAtWorldXY(
          coords.x + 10,
          coords.y + 10
        );
        if (!tuileSuivante || enemy.body.blocked.right) {
          enemy.direction = "gauche";
          enemy.setVelocityX(-860);
          enemy.flipX = true;
        }
      }
    }, this);
  }

  death() {
    this.player.sprite.disableBody(true, true);

    this.cameras.main.fadeIn(2000, 0, 0, 0);

    this.time.delayedCall(200, () => {
      this.scene.restart();
    });
  }

  hit(player, enemy) {
    this.player.decreaseHealth(this.scene);
  }

  attack(player, enemy) {
    enemy.destroy();
  }

  coffreOuverture(scene) {
    if (this.player.keys.interact.isDown && !this.isCoffreOuvert) {
      this.soundCoffre.play();
      this.coffre.setTexture("coffre_ouvert");

      this.isCoffreOuvert = true;

      const newAttack = Global.attacks["nature"][1];
      const earnedAttack = Global.attackOff.push(newAttack);

      const width = this.cameras.main.width;
      const height = this.cameras.main.height;

      // Afficher l'image de l'attaque gagnée
      const attackImage = this.add.image(
        width / 2,
        height / 2 + 60,
        newAttack.image // Image de l'attaque gagnée
      );
      attackImage.setScale(2).setScrollFactor(0).setDepth(60001);

      // Supprimer la notification après quelques secondes
      setTimeout(() => {
        attackImage.destroy();
        this.soundCoffre.stop();
      }, 2000);
    }
  }

  sortie() {
    if (this.player.keys.interact.isDown) {
      this.scene.stop("Plateformer_map2");

      this.scene.start("Plateformer_map3");
    }
  }

  fuite() {
    if (this.player.keys.interact.isDown) {
      this.scene.stop("Plateformer_map2");
      const mondeScene = this.scene.get("monde");
      this.scene.resume("monde");

      if (
        mondeScene.biomeMusic &&
        mondeScene.biomeMusic[mondeScene.currentMusic]
      ) {
        mondeScene.biomeMusic[mondeScene.currentMusic].resume();
      }
    }
  }
}
