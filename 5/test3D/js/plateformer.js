import EnemyPlat from "/5/test3D/js/enemy_plat.js";
import Player2D from "/5/test3D/js/player_2d.js";

export default class Plateformer extends Phaser.Scene {
  constructor() {
    super({ key: "plateformer" });
    this.enemyGroups = null;
  }

  preload() {}

  create() {
    this.map = this.make.tilemap({ key: "map1" });
    this.tileset = this.map.addTilesetImage("TX Tileset Ground", "tileset");

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
    this.porte.setScale(0.5);
    this.porte.body.setSize(this.porte.width, this.porte.height * 0.8);
    this.porte.body.setOffset(10, 90 * 0.1);
    this.porte.body.allowGravity = false;

    this.porte.body.immovable = true;

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
          x: platform.x + 950,
          duration: 4000,
          ease: "Linear",
          yoyo: true,
          repeat: -1,
          onYoyo: function () {
            direction *= -1;
            platform.setVelocityX(235 * direction);
          },
          onRepeat: function () {
            direction *= -1;
            platform.setVelocityX(235 * direction);
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
          x: platform.x - 950,
          duration: 4000,
          ease: "Linear",
          yoyo: true,
          repeat: -1,
          onYoyo: function () {
            direction *= -1;
            platform.setVelocityX(235 * direction);
          },
          onRepeat: function () {
            direction *= -1;
            platform.setVelocityX(235 * direction);
          },
        });

        this.physics.add.collider(this.player.sprite, platform);

        this.platform_layer.removeTileAt(tile.x, tile.y);
      }
    }, this);

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

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.death_layer.renderDebug(debugGraphics, {
      tileColor: null, // couleur des tuiles snas collision
      collidingTileColor: new Phaser.Display.Color(243, 134, 0, 255), // couleur des tuiles en conlision
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });
  }

  checkCollision(player, tile) {
    // Si le joueur est en dessous de la plateforme, désactiver la collision
    if (player.body.velocity.y < 0 && player.y > tile.pixelY) {
      return false; // Désactive la collision
    }
    return true; // Active la collision
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

    this.enemies.forEach((enemy) => {
      enemy.update(this.platform_layer);
    });
  }

  death() {
    console.log("le joueur est mort", this.death_layer.y, this.player.sprite.y);
  }

  sortie() {
    console.log("jf k");
    if (this.player.keys.interact.isDown) {
      console.log("kbd ");
    }
  }
}
